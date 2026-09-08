using Microsoft.AspNetCore.Http.Features;
using System.Diagnostics;
using System.Security.Cryptography;
using Tracewright.Workbench;
using Tracewright.Workbench.Services;

var applicationArgs = args.ToList();
var noBrowser = applicationArgs.Remove("--no-browser");
var portIndex = applicationArgs.IndexOf("--port");
var port = 8791;
if (portIndex >= 0)
{
    if (portIndex + 1 >= applicationArgs.Count || !int.TryParse(applicationArgs[portIndex + 1], out port) || port is < 1024 or > 65535) throw new ArgumentException("Invalid local port.");
    applicationArgs.RemoveAt(portIndex + 1); applicationArgs.RemoveAt(portIndex);
}
var localUrl = "http://127.0.0.1:" + port;
var dataDirectoryIndex = applicationArgs.IndexOf("--data-dir");
if (dataDirectoryIndex >= 0 && dataDirectoryIndex + 1 < applicationArgs.Count)
{
    var requestedDataDirectory = Path.GetFullPath(applicationArgs[dataDirectoryIndex + 1]);
    Environment.SetEnvironmentVariable("TRACEWRIGHT_DATA_DIR", requestedDataDirectory);
    applicationArgs.RemoveAt(dataDirectoryIndex + 1);
    applicationArgs.RemoveAt(dataDirectoryIndex);
}

var instanceData = Environment.GetEnvironmentVariable("TRACEWRIGHT_DATA_DIR") ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Tracewright", "Workbench");
Directory.CreateDirectory(instanceData);
var portFile = Path.Combine(instanceData, "local-port.txt");
var instanceKey = Convert.ToHexString(SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(Path.GetFullPath(instanceData).ToUpperInvariant())))[..16];
using var singleInstance = new Mutex(true, @"Local\Tracewright.Workbench." + instanceKey, out var ownsInstance);
if (!ownsInstance)
{
    if (!noBrowser)
    {
        if (File.Exists(portFile) && int.TryParse(File.ReadAllText(portFile), out var previousPort) && previousPort is >= 1024 and <= 65535) localUrl = "http://127.0.0.1:" + previousPort;
        OpenLocalUrl(localUrl);
    }
    return;
}

try { var probe = new System.Net.Sockets.TcpListener(System.Net.IPAddress.Loopback, port); probe.Start(); probe.Stop(); }
catch (System.Net.Sockets.SocketException)
{
    var probe = new System.Net.Sockets.TcpListener(System.Net.IPAddress.Loopback, 0); probe.Start();
    port = ((System.Net.IPEndPoint)probe.LocalEndpoint).Port; probe.Stop();
    localUrl = "http://127.0.0.1:" + port;
}

var packagedContentRoot = Directory.Exists(Path.Combine(AppContext.BaseDirectory, "wwwroot"))
    ? AppContext.BaseDirectory
    : Directory.GetCurrentDirectory();
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = applicationArgs.ToArray(),
    ContentRootPath = packagedContentRoot,
    WebRootPath = Path.Combine(packagedContentRoot, "wwwroot")
});
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.WriteIndented = true;
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200L * 1024 * 1024;
});
builder.Services.AddSingleton<ProjectStore>();
builder.Services.AddSingleton<CodexRunner>();
builder.Services.AddSingleton<ReviewTransfer>();

var app = builder.Build();
var sessionToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(24));
app.Urls.Clear();
app.Urls.Add(localUrl);
app.Use(async (context, next) =>
{
    context.Response.Headers.XContentTypeOptions = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
    var origin = context.Request.Headers.Origin.FirstOrDefault();
    if (context.Request.Host.Value != "127.0.0.1:" + port || (origin is not null && origin != localUrl) || context.Request.Headers["Sec-Fetch-Site"] == "cross-site")
    { context.Response.StatusCode = 403; return; }
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.Headers.CacheControl = "no-store";
        if (context.Request.Path != "/api/health" && context.Request.Headers["X-Tracewright-Session"] != sessionToken)
        { context.Response.StatusCode = 401; return; }
    }
    try { await next(); }
    catch (Exception e) when (e is InvalidDataException or ArgumentException or System.Text.Json.JsonException or IOException)
    {
        if (context.Response.HasStarted) throw;
        context.Response.StatusCode = 400;
        await context.Response.WriteAsJsonAsync(new { error = e is InvalidDataException ? e.Message : "This input could not be read. Check the file, format or current review. Existing files have been kept." });
    }
});
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        context.Context.Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
        context.Context.Response.Headers.Pragma = "no-cache";
        context.Context.Response.Headers.Expires = "0";
    }
});

app.MapGet("/api/health", async (ProjectStore store, CodexRunner codex) =>
{
    var availability = await codex.GetAvailabilityAsync();
    return Results.Ok(new
    {
        application = "Tracewright Workbench",
        version = "0.5.0-beta",
        storage = "local",
        dataDirectory = store.DataDirectory,
        sessionToken,
        codex = availability
    });
});

app.MapGet("/api/projects", async (ProjectStore store) => Results.Ok(await store.ListAsync()));

app.MapPost("/api/projects", async (CreateProjectRequest request, ProjectStore store) =>
{
    var project = await store.CreateAsync(request.Title);
    return Results.Created($"/api/projects/{project.Id}", project);
});

app.MapGet("/api/projects/{id}", async (string id, ProjectStore store) =>
{
    var envelope = await store.GetEnvelopeAsync(id);
    return envelope is null ? Results.NotFound() : Results.Ok(envelope);
});

app.MapPut("/api/projects/{id}/intake", async (string id, UpdateIntakeRequest request, ProjectStore store) =>
{
    var project = await store.UpdateIntakeAsync(id, request);
    return project is null ? Results.NotFound() : Results.Ok(project);
});

app.MapPost("/api/projects/{id}/materials", async (string id, HttpRequest request, ProjectStore store) =>
{
    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new { error = "Use multipart/form-data." });
    }

    var form = await request.ReadFormAsync();
    var (project, error) = await store.AddMaterialsAsync(
        id,
        form.Files,
        form["role"].FirstOrDefault() ?? "Primary material",
        form["authorRole"].FirstOrDefault() ?? "Unknown / mixed",
        form["sourceDate"].FirstOrDefault() ?? "",
        form["contextStatus"].FirstOrDefault() ?? "Analysis target");
    return error is not null ? Results.BadRequest(new { error }) : Results.Ok(project);
});

app.MapDelete("/api/projects/{id}/materials/{sourceId}", async (string id, string sourceId, ProjectStore store) =>
{
    var project = await store.RemoveMaterialAsync(id, sourceId);
    return project is null ? Results.NotFound() : Results.Ok(project);
});

app.MapGet("/api/projects/{id}/review-request", async (string id, ProjectStore store) =>
{
    var request = await store.BuildReviewRequestAsync(id);
    return request is null ? Results.NotFound() : Results.Text(request, "text/plain; charset=utf-8");
});

app.MapPost("/api/intake", async (System.Text.Json.Nodes.JsonObject intake, ProjectStore store) => Results.Ok(await store.CreateFromIntakeAsync(intake)));
app.MapGet("/api/codex/check", async (CodexRunner codex) => Results.Ok(await codex.GetAvailabilityAsync(true)));
app.MapGet("/api/projects/{id}/text/{sourceId}", async (string id, string sourceId, ReviewTransfer transfer) => Results.Ok(new { text = await transfer.Extract(id, sourceId) }));
app.MapPut("/api/projects/{id}/text/{sourceId}", async (string id, string sourceId, TextRequest request, ProjectStore store) => Results.Ok(await store.SaveTextAsync(id, sourceId, request.Text)));
app.MapPost("/api/projects/{id}/prepare", async (string id, PrepareRequest request, ReviewTransfer transfer) => Results.Ok(await transfer.Prepare(id, request.SourceIds)));
app.MapPost("/api/projects/{id}/bundle", async (string id, SendApproval approval, ReviewTransfer transfer, ProjectStore store, IWebHostEnvironment env) =>
{
    var plan = await transfer.Consume(id, approval);
    await File.WriteAllTextAsync(Path.Combine(store.GetProjectDirectory(id), "manual-binding.json"), System.Text.Json.JsonSerializer.Serialize(plan));
    using var memory = new MemoryStream();
    using (var zip = new System.IO.Compression.ZipArchive(memory, System.IO.Compression.ZipArchiveMode.Create, true))
    {
        void Add(string name, string text) { using var writer = new StreamWriter(zip.CreateEntry(name).Open(), new System.Text.UTF8Encoding(false)); writer.Write(text); }
        Add("REQUEST.md", plan.Prompt);
        Add("review-output.schema.json", await File.ReadAllTextAsync(Path.Combine(env.ContentRootPath, "schemas", "review-output.schema.json")));
        Add("README_FIRST.txt", "Approved text only; no original files. Check your AI provider's data terms before uploading. Return JSON following the schema and import it into the unchanged review. A flag means inspect carefully, not that someone did something wrong.");
    }
    return Results.File(memory.ToArray(), "application/zip", "tracewright-approved-text-" + plan.Id + ".zip");
});

app.MapPost("/api/projects/{id}/review-import", async (string id, HttpRequest request, ProjectStore store, ReviewTransfer transfer, IWebHostEnvironment env) =>
{
    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new { error = "Choose a JSON result file." });
    }

    var form = await request.ReadFormAsync();
    var file = form.Files.FirstOrDefault();
    if (file is null || file.Length == 0 || file.Length > 10 * 1024 * 1024)
    {
        return Results.BadRequest(new { error = "Choose one JSON file under 10 MB." });
    }

    await using var stream = file.OpenReadStream();
    var bindingPath = Path.Combine(store.GetProjectDirectory(id), "manual-binding.json");
    if (!File.Exists(bindingPath)) throw new InvalidDataException("Prepare an approved text bundle for this review before importing its result.");
    var binding = System.Text.Json.JsonSerializer.Deserialize<ReviewPlan>(await File.ReadAllTextAsync(bindingPath))!;
    var current = await store.GetAsync(id) ?? throw new InvalidDataException("Review not found.");
    if (await transfer.Fingerprint(current) != binding.Fingerprint) throw new InvalidDataException("Input changed since the approved bundle. Prepare a new bundle instead of applying a stale result.");
    var review = await System.Text.Json.Nodes.JsonNode.ParseAsync(stream) ?? throw new InvalidDataException("Empty result.");
    ReviewSafety.CheckShape(review, System.Text.Json.Nodes.JsonNode.Parse(await File.ReadAllTextAsync(Path.Combine(env.ContentRootPath, "schemas", "review-output.schema.json")))!);
    ReviewSafety.CheckReferences(review, binding.Snapshot, true);
    await store.ApplyReviewAsync(binding, review, transfer, manual: true);
    return Results.Ok(review);
});

app.MapPost("/api/projects/{id}/run/codex", async (string id, SendApproval approval, CodexRunner codex) =>
{
    var (started, message) = await codex.StartAsync(id, approval);
    return started ? Results.Accepted(value: new { message }) : Results.BadRequest(new { error = message });
});
app.MapPost("/api/projects/{id}/cancel", (string id, CodexRunner codex) => Results.Ok(new { cancelled = codex.Cancel(id) }));

app.MapGet("/api/projects/{id}/run-status", (string id, CodexRunner codex) => Results.Ok(codex.GetStatus(id)));
app.MapGet("/api/projects/{id}/runs", (string id, ProjectStore store) =>
{
    var root = Path.Combine(store.GetProjectDirectory(id), "runs");
    if (!Directory.Exists(root)) return Results.Ok(Array.Empty<object>());
    return Results.Ok(Directory.EnumerateDirectories(root).Where(d => System.Text.RegularExpressions.Regex.IsMatch(Path.GetFileName(d), "^[a-f0-9]{32}$")).OrderByDescending(Directory.GetCreationTimeUtc).Select(d => new { id = Path.GetFileName(d), date = Directory.GetCreationTimeUtc(d), candidateAvailable = File.Exists(Path.Combine(d, "candidate.json")), status = File.Exists(Path.Combine(d, "status.json")) ? File.ReadAllText(Path.Combine(d, "status.json")) : "Interrupted or not recorded" }).ToArray());
});
app.MapGet("/api/projects/{id}/runs/{runId}/candidate", (string id, string runId, ProjectStore store) =>
{
    if (!System.Text.RegularExpressions.Regex.IsMatch(runId, "^[a-f0-9]{32}$")) return Results.BadRequest();
    var path = Path.Combine(store.GetProjectDirectory(id), "runs", runId, "candidate.json");
    return File.Exists(path) ? Results.File(File.ReadAllBytes(path), "application/json", "candidate-" + runId + ".json") : Results.NotFound();
});

app.MapPost("/api/shutdown", (HttpRequest request, IHostApplicationLifetime lifetime) =>
{
    if (!string.Equals(request.Headers["X-Tracewright-Session"].FirstOrDefault(), sessionToken, StringComparison.Ordinal))
    {
        return Results.Unauthorized();
    }

    _ = Task.Run(async () =>
    {
        await Task.Delay(250);
        lifetime.StopApplication();
    });
    return Results.Accepted(value: new { message = "Tracewright Workbench is closing." });
});

app.Lifetime.ApplicationStarted.Register(() =>
{
    File.WriteAllText(portFile, port.ToString());
    if (noBrowser || Environment.GetEnvironmentVariable("TRACEWRIGHT_NO_BROWSER") == "1")
    {
        return;
    }

    try
    {
        OpenLocalUrl(localUrl);
    }
    catch
    {
        // The URL is also printed to the terminal for environments that cannot open a browser.
    }
});

app.Run();

static void OpenLocalUrl(string url)
{
    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
}
