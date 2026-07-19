using System.Collections.Concurrent;
using System.ComponentModel;
using System.Diagnostics;
using System.Text;
using System.Text.Json.Nodes;

namespace Tracewright.Workbench.Services;

public sealed class CodexRunner
{
    private readonly ConcurrentDictionary<string, RunStatus> _statuses = new(StringComparer.OrdinalIgnoreCase);
    private readonly ProjectStore _store;
    private readonly string _schemaPath;
    private ConnectorAvailability? _cachedAvailability;
    private DateTimeOffset _availabilityCheckedAt;

    public CodexRunner(ProjectStore store, IWebHostEnvironment environment)
    {
        _store = store;
        _schemaPath = Path.Combine(environment.ContentRootPath, "schemas", "review-output.schema.json");
    }

    public RunStatus GetStatus(string projectId)
        => _statuses.TryGetValue(projectId, out var status) ? status : new RunStatus();

    public async Task<ConnectorAvailability> GetAvailabilityAsync(bool refresh = false)
    {
        if (!refresh && _cachedAvailability is not null && DateTimeOffset.UtcNow - _availabilityCheckedAt < TimeSpan.FromSeconds(30))
        {
            return _cachedAvailability;
        }

        try
        {
            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "codex",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.StartInfo.ArgumentList.Add("--version");
            process.Start();
            var stdoutTask = process.StandardOutput.ReadToEndAsync();
            var stderrTask = process.StandardError.ReadToEndAsync();
            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(8));
            await process.WaitForExitAsync(timeout.Token);
            var stdout = (await stdoutTask).Trim();
            var stderr = (await stderrTask).Trim();
            _cachedAvailability = process.ExitCode == 0
                ? new ConnectorAvailability(true, "Codex CLI is available and will use its saved sign-in.", stdout)
                : new ConnectorAvailability(false, string.IsNullOrWhiteSpace(stderr) ? "Codex CLI did not start successfully." : stderr);
        }
        catch (OperationCanceledException)
        {
            _cachedAvailability = new ConnectorAvailability(false, "Codex CLI availability check timed out.");
        }
        catch (Win32Exception exception)
        {
            _cachedAvailability = new ConnectorAvailability(false, "Codex CLI is not accessible: " + exception.Message);
        }
        catch (Exception exception)
        {
            _cachedAvailability = new ConnectorAvailability(false, "Codex CLI check failed: " + exception.Message);
        }

        _availabilityCheckedAt = DateTimeOffset.UtcNow;
        return _cachedAvailability;
    }

    public async Task<(bool Started, string Message)> StartAsync(string projectId)
    {
        var project = await _store.GetAsync(projectId);
        if (project is null)
        {
            return (false, "Review not found.");
        }

        if (!project.PrivacyConfirmed)
        {
            return (false, "Confirm document safety in Review Brief before connecting an AI.");
        }

        if (project.Materials.Count == 0)
        {
            return (false, "Add at least one review material first.");
        }

        if (string.IsNullOrWhiteSpace(project.ReviewQuestion))
        {
            return (false, "Describe the review question before running the analysis.");
        }

        var availability = await GetAvailabilityAsync(true);
        if (!availability.Available)
        {
            return (false, availability.Message);
        }

        var status = _statuses.GetOrAdd(projectId, _ => new RunStatus());
        lock (status)
        {
            if (status.State is "queued" or "running")
            {
                return (false, "A Codex review is already running.");
            }

            status.State = "queued";
            status.Message = "Review queued";
            status.StartedAt = DateTimeOffset.UtcNow;
            status.FinishedAt = null;
        }

        _ = Task.Run(() => RunAsync(projectId, status));
        return (true, "Codex review started.");
    }

    private async Task RunAsync(string projectId, RunStatus status)
    {
        try
        {
            SetStatus(status, "running", "Codex is reading the selected materials and building the review map.");
            var project = await _store.GetAsync(projectId) ?? throw new InvalidOperationException("Review not found.");
            var projectDirectory = _store.GetProjectDirectory(projectId);
            var runDirectory = Path.Combine(projectDirectory, "runs", DateTimeOffset.UtcNow.ToString("yyyyMMdd-HHmmss"));
            Directory.CreateDirectory(runDirectory);
            var outputPath = Path.Combine(runDirectory, "review-output.json");
            var logPath = Path.Combine(runDirectory, "codex-events.jsonl");
            var errorPath = Path.Combine(runDirectory, "codex-error.log");
            var prompt = _store.BuildReviewRequest(project);
            await File.WriteAllTextAsync(Path.Combine(runDirectory, "request.md"), prompt, new UTF8Encoding(false));

            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "codex",
                    WorkingDirectory = projectDirectory,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            foreach (var argument in new[]
            {
                "exec", "--ephemeral", "--skip-git-repo-check", "--sandbox", "read-only",
                "--ignore-rules", "--json", "--output-schema", _schemaPath, "-o", outputPath, "-"
            })
            {
                process.StartInfo.ArgumentList.Add(argument);
            }

            process.Start();
            var stdoutTask = process.StandardOutput.ReadToEndAsync();
            var stderrTask = process.StandardError.ReadToEndAsync();
            await process.StandardInput.WriteAsync(prompt);
            process.StandardInput.Close();

            using var timeout = new CancellationTokenSource(TimeSpan.FromMinutes(20));
            try
            {
                await process.WaitForExitAsync(timeout.Token);
            }
            catch (OperationCanceledException)
            {
                process.Kill(true);
                throw new TimeoutException("Codex review exceeded the 20 minute local timeout.");
            }

            var stdout = await stdoutTask;
            var stderr = await stderrTask;
            await File.WriteAllTextAsync(logPath, stdout, new UTF8Encoding(false));
            await File.WriteAllTextAsync(errorPath, stderr, new UTF8Encoding(false));

            if (process.ExitCode != 0)
            {
                throw new InvalidOperationException(string.IsNullOrWhiteSpace(stderr)
                    ? $"Codex exited with code {process.ExitCode}."
                    : stderr.Trim());
            }

            if (!File.Exists(outputPath))
            {
                throw new InvalidOperationException("Codex finished without creating a structured review result.");
            }

            var review = JsonNode.Parse(await File.ReadAllTextAsync(outputPath, Encoding.UTF8))
                ?? throw new InvalidOperationException("Codex returned an empty review result.");
            await _store.SaveReviewAsync(projectId, review);
            await _store.RecordRunAsync(projectId, "review_completed", "codex", project.Materials.Select(item => item.SourceId));
            SetStatus(status, "completed", "Structured review map is ready.", true);
        }
        catch (Exception exception)
        {
            await _store.RecordRunAsync(projectId, "review_failed", "codex", Array.Empty<string>());
            SetStatus(status, "failed", Shorten(exception.Message, 600), true);
        }
    }

    private static void SetStatus(RunStatus status, string state, string message, bool finished = false)
    {
        lock (status)
        {
            status.State = state;
            status.Message = message;
            if (finished)
            {
                status.FinishedAt = DateTimeOffset.UtcNow;
            }
        }
    }

    private static string Shorten(string value, int maxLength)
        => value.Length <= maxLength ? value : value[..maxLength] + "...";
}
