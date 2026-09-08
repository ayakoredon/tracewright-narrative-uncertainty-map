using System.Text.Json.Nodes;

namespace Tracewright.Workbench.Services;

public static class ReviewSafety
{
    // This checks the finite contract shipped with this app, not arbitrary JSON Schema dialects.
    public static void CheckShape(JsonNode? value, JsonNode schema, string path = "result")
    {
        var type = schema["type"]?.GetValue<string>();
        if (type == "object")
        {
            if (value is not JsonObject obj) throw new InvalidDataException(path + " must be an object.");
            var properties = schema["properties"]!.AsObject();
            foreach (var name in schema["required"]?.AsArray() ?? new JsonArray())
                if (!obj.ContainsKey(name!.GetValue<string>())) throw new InvalidDataException(path + "." + name + " is required.");
            foreach (var entry in obj)
            {
                if (properties[entry.Key] is JsonNode rule) CheckShape(entry.Value, rule, path + "." + entry.Key);
                else if (schema["additionalProperties"]?.GetValue<bool>() == false)
                    throw new InvalidDataException(path + ": unexpected field " + entry.Key);
            }
        }
        else if (type == "array")
        {
            if (value is not JsonArray items || items.Count > 2000) throw new InvalidDataException(path + " must be an array of at most 2000 items.");
            for (var i = 0; i < items.Count; i++) CheckShape(items[i], schema["items"]!, path + "[" + i + "]");
        }
        else if (type == "string")
        {
            if (value is not JsonValue v || !v.TryGetValue<string>(out var text) || text.Length > 200000)
                throw new InvalidDataException(path + " must be text (at most 200000 characters).");
        }
        else if (type == "boolean")
        {
            if (value is not JsonValue v || !v.TryGetValue<bool>(out _)) throw new InvalidDataException(path + " must be boolean.");
        }
        else throw new InvalidDataException("Unsupported contract type: " + type);
        if (schema["enum"] is JsonArray allowed && !allowed.Any(x => JsonNode.DeepEquals(x, value)))
            throw new InvalidDataException(path + " has an unsupported value.");
    }

    public static void CheckReferences(JsonNode review, ReviewProject project, bool exactExcerpts)
    {
        var ids = project.Materials.Select(m => m.SourceId).ToHashSet(StringComparer.Ordinal);
        var sources = review["sources"]!.AsArray();
        var returned = sources.Select(s => s!["source_id"]!.GetValue<string>()).ToArray();
        if (returned.Distinct().Count() != returned.Length || !ids.SetEquals(returned))
            throw new InvalidDataException("Source inventory differs from the approved source set.");
        foreach (var m in project.Materials)
        {
            var source = sources.Single(s => s!["source_id"]!.GetValue<string>() == m.SourceId)!;
            if (source["target_status"]!.GetValue<string>() != m.ContextStatus)
                throw new InvalidDataException(m.SourceId + ": context/target role was changed.");
        }
        var allIds = new HashSet<string>(StringComparer.Ordinal);
        foreach (var (collection, field) in new[] { ("evidence", "evidence_id"), ("claims", "claim_id") })
            foreach (var row in review[collection]!.AsArray())
            {
                var id = row![field]!.GetValue<string>();
                if (id.Length is < 1 or > 80 || !id.All(c => char.IsAsciiLetterOrDigit(c) || c is '-' or '_') || !allIds.Add(id))
                    throw new InvalidDataException("Duplicate or invalid observation/claim ID.");
            }
        foreach (var row in review["evidence"]!.AsArray())
        {
            var e = row!;
            var id = e["source_id"]!.GetValue<string>();
            if (!ids.Contains(id)) throw new InvalidDataException("Unknown evidence source: " + id);
            var text = e["source_excerpt"]!.GetValue<string>();
            if (string.IsNullOrWhiteSpace(text)) throw new InvalidDataException("Evidence requires an exact excerpt.");
            if (exactExcerpts && !project.Materials.Single(m => m.SourceId == id).ReviewText.Contains(text, StringComparison.Ordinal))
                throw new InvalidDataException(e["evidence_id"] + ": excerpt is absent from the approved review text. Result retained for correction, not applied.");
            foreach (var mark in e["marked_text"]!.AsArray())
                if (!text.Contains(mark!["text"]!.GetValue<string>(), StringComparison.Ordinal))
                    throw new InvalidDataException("Marked wording is absent from its excerpt.");
            if (e["reasoning_chain"]!.AsArray().Count == 0 || e["alternative_explanations"]!.AsArray().Count == 0)
                throw new InvalidDataException("An observation needs reasoning and alternatives.");
        }
        CheckSourceArrays(review, ids);
        if (project.HighImpactContexts.Count > 0 || project.SensitiveReviewMode)
            if (review["review_setup"]!["qualified_human_review_required"]!.GetValue<bool>() != true)
                throw new InvalidDataException("Qualified human review cannot be removed from this case.");
        if (review["workflow_review"] is JsonObject flow)
        {
            var steps = flow["steps"]!.AsArray().Select(s => s!["id"]!.GetValue<string>()).ToArray();
            if (steps.Distinct().Count() != steps.Length) throw new InvalidDataException("Duplicate workflow step.");
            foreach (var edge in flow["transitions"]!.AsArray())
                if (!steps.Contains(edge!["from"]!.GetValue<string>()) || !steps.Contains(edge["to"]!.GetValue<string>()))
                    throw new InvalidDataException("Workflow transition refers to an unknown step.");
        }
    }

    private static void CheckSourceArrays(JsonNode? node, HashSet<string> ids)
    {
        if (node is JsonObject obj)
            foreach (var (key, value) in obj)
            {
                if (key == "source_ids" && value is JsonArray refs)
                    foreach (var r in refs) if (!ids.Contains(r!.GetValue<string>())) throw new InvalidDataException("Unknown source reference.");
                CheckSourceArrays(value, ids);
            }
        else if (node is JsonArray items) foreach (var item in items) CheckSourceArrays(item, ids);
    }
}
