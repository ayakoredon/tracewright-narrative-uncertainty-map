using Microsoft.AspNetCore.Http.Features;
using System.Diagnostics;
using System.Security.Cryptography;
using Tracewright.Workbench;
using Tracewright.Workbench.Services;

const string localUrl = "http://127.0.0.1:8791";
var applicationArgs = args.ToList();
var noBrowser = applicationArgs.Remove("--no-browser");
var dataDirectoryIndex = applicationArgs.IndexOf("--data-dir");
if (dataDirectoryIndex >= 0 && dataDirectoryIndex + 1 < applicationArgs.Count)
{
    var requestedDataDirectory = Path.GetFullPath(applicationArgs[dataDirectoryIndex + 1]);
    Environment.SetEnvironmentVariable("TRACEWRIGHT_DATA_DIR", requestedDataDirectory);
    applicationArgs.RemoveAt(dataDirectoryIndex + 1);
    applicationArgs.RemoveAt(dataDirectoryIndex);
}

using var singleInstance = new Mutex(true, @"Local\Tracewright.Workbench", out var ownsInstance);
if (!ownsInstance)
{
    if (!noBrowser)
    {
        OpenLocalUrl(localUrl);
    }
    return;
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

var app = builder.Build();
var sessionToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(24));
app.Urls.Add(localUrl);
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
        version = "0.3.0-beta",
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

app.MapGet("/api/projects/{id}/bundle", async (string id, ProjectStore store) =>
{
    var bundle = await store.CreateBundleAsync(id);
    return bundle is null
        ? Results.NotFound()
        : Results.File(bundle.Content, "application/zip", bundle.FileName);
});

app.MapPost("/api/projects/{id}/review-import", async (string id, HttpRequest request, ProjectStore store) =>
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
    var (review, error) = await store.ImportReviewAsync(id, stream);
    return error is not null ? Results.BadRequest(new { error }) : Results.Ok(review);
});

app.MapPost("/api/projects/{id}/run/codex", async (string id, CodexRunner codex) =>
{
    var (started, message) = await codex.StartAsync(id);
    return started ? Results.Accepted(value: new { message }) : Results.BadRequest(new { error = message });
});

app.MapGet("/api/projects/{id}/run-status", (string id, CodexRunner codex) => Results.Ok(codex.GetStatus(id)));

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
