using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Tracewright.Workbench.Services;

public sealed class CodexRunner(ProjectStore store, ReviewTransfer transfer, IWebHostEnvironment environment)
{
    private readonly ConcurrentDictionary<string, RunStatus> statuses = new();
    private readonly ConcurrentDictionary<string, CancellationTokenSource> cancellations = new();
    private readonly SemaphoreSlim admission = new(1, 1);
    private ConnectorAvailability? cached;
    private DateTimeOffset checkedAt;
    private readonly string schemaPath = Path.Combine(environment.ContentRootPath, "schemas", "review-output.schema.json");
    public RunStatus GetStatus(string id)
    {
        if (statuses.TryGetValue(id, out var found)) return found;
        var root = Path.Combine(store.GetProjectDirectory(id), "runs");
        if (!Directory.Exists(root)) return new();
        var last = Directory.EnumerateFiles(root, "status.json", SearchOption.AllDirectories).OrderByDescending(File.GetLastWriteTimeUtc).FirstOrDefault();
        if (last is null) return new();
        try
        {
            var saved = JsonSerializer.Deserialize<RunStatus>(File.ReadAllText(last)) ?? new();
            if (saved.State is "running" or "queued") { saved.State = "failed"; saved.Message = "A previous run was interrupted. Delivery/result state is uncertain. Inspect the run record; no automatic retry."; }
            return saved;
        }
        catch { return new() { State = "failed", Message = "Prior run status is unreadable. Kept for recovery; no automatic retry." }; }
    }

    public static string? FindCodex()
    {
        var bin = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenAI", "Codex", "bin");
        if (Directory.Exists(bin))
        {
            var candidate = Directory.EnumerateDirectories(bin).Where(d => System.Text.RegularExpressions.Regex.IsMatch(Path.GetFileName(d), "^[a-fA-F0-9]{16}$"))
                .Select(d => Path.Combine(d, "codex.exe")).Where(File.Exists).OrderByDescending(File.GetLastWriteTimeUtc).FirstOrDefault();
            if (candidate is not null) return candidate;
        }
        foreach (var folder in (Environment.GetEnvironmentVariable("PATH") ?? "").Split(Path.PathSeparator))
        {
            if (!Path.IsPathFullyQualified(folder)) continue;
            var candidate = Path.Combine(folder, OperatingSystem.IsWindows() ? "codex.exe" : "codex");
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }

    private static ProcessStartInfo StartInfo(string exe)
    {
        var info = new ProcessStartInfo(exe) { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true, RedirectStandardInput = true, StandardOutputEncoding = Encoding.UTF8, StandardErrorEncoding = Encoding.UTF8 };
        foreach (var name in info.Environment.Keys.Where(k => k.Contains("API_KEY", StringComparison.OrdinalIgnoreCase) || k is "OPENAI_BASE_URL" or "OPENAI_API_BASE").ToArray()) info.Environment.Remove(name);
        return info;
    }

    private static async Task<(int Exit, string Text)> Probe(string exe, params string[] args)
    {
        using var p = new Process { StartInfo = StartInfo(exe) };
        foreach (var arg in args) p.StartInfo.ArgumentList.Add(arg);
        p.Start(); p.StandardInput.Close();
        var output = p.StandardOutput.ReadToEndAsync(); var error = p.StandardError.ReadToEndAsync();
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(12));
        try { await p.WaitForExitAsync(timeout.Token); }
        catch { if (!p.HasExited) p.Kill(true); throw; }
        return (p.ExitCode, (await output + "\n" + await error).Trim());
    }

    public async Task<ConnectorAvailability> GetAvailabilityAsync(bool refresh = false)
    {
        if (!refresh && cached is not null && DateTimeOffset.UtcNow - checkedAt < TimeSpan.FromSeconds(30)) return cached;
        try
        {
            var exe = FindCodex();
            if (exe is null) return new(false, "Codex executable not found. Install/open Codex and sign in with ChatGPT, then recheck. Manual transfer is available.");
            var version = await Probe(exe, "--version");
            var auth = await Probe(exe, "login", "status");
            var help = await Probe(exe, "exec", "--help");
            var compatible = help.Text.Contains("--ignore-user-config") && help.Text.Contains("--output-schema");
            cached = version.Exit == 0 && auth.Exit == 0 && auth.Text.Contains("Logged in using ChatGPT", StringComparison.OrdinalIgnoreCase) && compatible
                ? new(true, "ChatGPT sign-in detected. Account/workspace identity and data terms still require your confirmation. This run uses your Codex allowance, not an API-key fallback.", version.Text)
                : new(false, compatible ? "ChatGPT sign-in was not confirmed. Open Codex and check your account. API-key accounts are not used by this connector." : "Update Codex: this connector needs isolated configuration and structured output support.", version.Text);
        }
        catch (Exception e) { cached = new(false, "Connection check failed: " + e.GetType().Name + ". Recheck Codex; no materials were sent."); }
        checkedAt = DateTimeOffset.UtcNow;
        return cached;
    }

    public async Task<(bool Started, string Message)> StartAsync(string id, SendApproval approval)
    {
        await admission.WaitAsync();
        try
        {
            if (cancellations.Count > 0) return (false, "One review is already running. Wait or cancel it before starting another.");
            var availability = await GetAvailabilityAsync(true);
            if (!availability.Available) return (false, availability.Message);
            var plan = await transfer.Consume(id, approval);
            var cts = new CancellationTokenSource(TimeSpan.FromMinutes(20));
            cancellations[id] = cts;
            var status = new RunStatus { State = "queued", Message = "Approved payload queued", StartedAt = DateTimeOffset.UtcNow };
            statuses[id] = status;
            _ = Run(id, plan, approval, status, cts);
            return (true, "Approved review queued for your ChatGPT-signed-in Codex. Follow the run status; no automatic retry.");
        }
        finally { admission.Release(); }
    }

    public bool Cancel(string id)
    {
        if (!cancellations.TryGetValue(id, out var cts)) return false;
        cts.Cancel(); return true;
    }

    private async Task Run(string id, ReviewPlan plan, SendApproval approval, RunStatus status, CancellationTokenSource cts)
    {
        var directory = Path.Combine(store.GetProjectDirectory(id), "runs", plan.Id);
        var output = Path.Combine(directory, "candidate.json");
        try
        {
            Directory.CreateDirectory(directory);
            await File.WriteAllTextAsync(Path.Combine(directory, "approved-payload.txt"), plan.Prompt, new UTF8Encoding(false));
            await File.WriteAllTextAsync(Path.Combine(directory, "approval.json"), JsonSerializer.Serialize(new { approvedAt = DateTimeOffset.UtcNow, approval, payloadSha256 = ReviewTransfer.Hash(plan.Prompt), sourceIds = plan.Snapshot.Materials.Select(m => m.SourceId) }));
            status.State = "running"; status.Message = "Codex is reviewing the approved text. Result will be validated before replacing the map.";
            await File.WriteAllTextAsync(Path.Combine(directory, "status.json"), JsonSerializer.Serialize(status));
            using var p = new Process { StartInfo = StartInfo(FindCodex() ?? throw new InvalidDataException("Codex disappeared. Recheck the installation.")) };
            p.StartInfo.WorkingDirectory = directory;
            foreach (var arg in BuildArguments(schemaPath, output)) p.StartInfo.ArgumentList.Add(arg);
            p.Start();
            using var stopProcess = cts.Token.Register(() => { try { if (!p.HasExited) p.Kill(true); } catch (InvalidOperationException) { } });
            var stdout = p.StandardOutput.ReadToEndAsync(); var stderr = p.StandardError.ReadToEndAsync();
            await p.StandardInput.WriteAsync(plan.Prompt.AsMemory(), cts.Token); p.StandardInput.Close();
            try { await p.WaitForExitAsync(cts.Token); }
            catch (OperationCanceledException) { if (!p.HasExited) p.Kill(true); await p.WaitForExitAsync(); throw; }
            cts.Token.ThrowIfCancellationRequested();
            var events = await stdout; await stderr;
            await File.WriteAllTextAsync(Path.Combine(directory, "events.jsonl"), events);
            if (p.ExitCode != 0) throw new InvalidDataException("Codex could not finish (exit " + p.ExitCode + "). Check sign-in, allowance and connectivity in Codex. No retry was made.");
            foreach (var line in events.Split('\n', StringSplitOptions.RemoveEmptyEntries))
            {
                var ev = JsonNode.Parse(line);
                if (ev?["item"]?["type"]?.GetValue<string>() is "command_execution" or "mcp_tool_call" or "web_search")
                    throw new InvalidDataException("Unexpected tool activity. The result was not applied; inspect the local run record.");
            }
            if (!File.Exists(output) || new FileInfo(output).Length > 10000000) throw new InvalidDataException("No bounded JSON result returned. Prior review kept.");
            var result = JsonNode.Parse(await File.ReadAllTextAsync(output)) ?? throw new InvalidDataException("Empty result.");
            ReviewSafety.CheckShape(result, JsonNode.Parse(await File.ReadAllTextAsync(schemaPath))!);
            ReviewSafety.CheckReferences(result, plan.Snapshot, true);
            await store.ApplyReviewAsync(plan, result, transfer, cts.Token);
            status.State = "completed"; status.Message = "Result received and structurally checked; verify the analysis against approved text. This is not an audit verdict.";
            try { await store.RecordRunAsync(id, "validated_result_applied", "codex-chatgpt", plan.Snapshot.Materials.Select(m => m.SourceId)); }
            catch (IOException) { status.Message += " Audit append failed; preserve the run folder for recovery."; }
        }
        catch (OperationCanceledException) { status.State = "cancelled"; status.Message = "Cancelled or timed out. Prior map kept. Stopping cannot retract content already sent to Codex."; }
        catch (Exception e) { status.State = "failed"; status.Message = e is InvalidDataException ? e.Message : "Result could not be validated (" + e.GetType().Name + "). Prior map kept. Check the local run record."; }
        finally
        {
            status.FinishedAt = DateTimeOffset.UtcNow;
            try { await File.WriteAllTextAsync(Path.Combine(directory, "status.json"), JsonSerializer.Serialize(status)); }
            catch (IOException) { status.Message += " Run status could not be saved to disk."; }
            catch (UnauthorizedAccessException) { status.Message += " Run status could not be saved to disk."; }
            finally { cancellations.TryRemove(id, out _); cts.Dispose(); }
        }
    }

    public static IEnumerable<string> BuildArguments(string schema, string output)
    {
        var args = new List<string> { "exec", "--ephemeral", "--skip-git-repo-check", "--ignore-user-config", "--sandbox", "read-only", "--json", "--output-schema", schema, "-o", output };
        foreach (var setting in new[] { "forced_login_method=\"chatgpt\"", "model_provider=\"openai\"", "approval_policy=\"never\"", "project_doc_max_bytes=0", "web_search=\"disabled\"", "mcp_servers={}", "features.shell_tool=false", "features.unified_exec=false", "features.apps=false", "features.code_mode=false", "features.code_mode_host=false", "features.browser_use=false", "features.computer_use=false", "features.image_generation=false", "features.view_image=false", "features.hooks=false", "features.remote_plugin=false", "features.skill_search=false", "features.skip_host_skill_discovery=true" }) { args.Add("-c"); args.Add(setting); }
        args.Add("-"); return args;
    }
}
