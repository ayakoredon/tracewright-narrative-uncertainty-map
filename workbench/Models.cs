using System.Text.Json.Nodes;

namespace Tracewright.Workbench;

public sealed class ReviewProject
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "Untitled review";
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public string PrimaryMode { get; set; } = "Claim and Fact Consistency";
    public string SecondaryMode { get; set; } = "";
    public string ReviewQuestion { get; set; } = "";
    public string KnownProvenance { get; set; } = "";
    public string ReviewerIntuition { get; set; } = "";
    public List<string> MustNotConclude { get; set; } = new();
    public List<string> HighImpactContexts { get; set; } = new();
    public bool PrivacyConfirmed { get; set; }
    public string PreferredConnector { get; set; } = "manual";
    public List<ReviewMaterial> Materials { get; set; } = new();
}

public sealed class ReviewMaterial
{
    public string SourceId { get; set; } = "";
    public string OriginalName { get; set; } = "";
    public string StoredName { get; set; } = "";
    public string ContentType { get; set; } = "application/octet-stream";
    public long Size { get; set; }
    public string Role { get; set; } = "Primary material";
    public string AuthorRole { get; set; } = "Unknown / mixed";
    public string SourceDate { get; set; } = "";
    public string ContextStatus { get; set; } = "Analysis target";
}

public sealed record CreateProjectRequest(string? Title);

public sealed class UpdateIntakeRequest
{
    public string Title { get; set; } = "Untitled review";
    public string PrimaryMode { get; set; } = "Claim and Fact Consistency";
    public string SecondaryMode { get; set; } = "";
    public string ReviewQuestion { get; set; } = "";
    public string KnownProvenance { get; set; } = "";
    public string ReviewerIntuition { get; set; } = "";
    public List<string> MustNotConclude { get; set; } = new();
    public List<string> HighImpactContexts { get; set; } = new();
    public bool PrivacyConfirmed { get; set; }
    public string PreferredConnector { get; set; } = "manual";
}

public sealed class ProjectEnvelope
{
    public required ReviewProject Project { get; init; }
    public JsonNode? Review { get; init; }
}

public sealed class RunStatus
{
    public string State { get; set; } = "idle";
    public string Message { get; set; } = "Ready";
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? FinishedAt { get; set; }
}

public sealed record ConnectorAvailability(bool Available, string Message, string? Version = null);

public sealed record ReviewBundle(byte[] Content, string FileName, string SuggestedResultFileName);
