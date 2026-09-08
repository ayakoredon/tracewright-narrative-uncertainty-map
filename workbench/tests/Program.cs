using System.Text;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Tracewright.Workbench;
using Tracewright.Workbench.Services;

var root = Path.GetFullPath(args[0]);
var data = Path.GetFullPath(args[1]);
Directory.CreateDirectory(data);
Environment.SetEnvironmentVariable("TRACEWRIGHT_DATA_DIR", data);
var store = new ProjectStore(new Env(root));
var transfer = new ReviewTransfer(store);
int passed = 0;
void Check(bool b, string name) { if (!b) throw new Exception(name); passed++; Console.WriteLine("PASS " + name); }
async Task Reject(Func<Task> action, string name) { try { await action(); } catch (InvalidDataException) { Check(true, name); return; } throw new Exception("Accepted: " + name); }
var p = await store.CreateAsync("Entirely fictional automated queue");
await store.UpdateIntakeAsync(p.Id, new UpdateIntakeRequest { Title = p.Title, ReviewQuestion = "Who receives a report before closure?" });
var text = "Fictional policy: a person must read every exception before closure.\nFictional log: exception T001 closed without assigned receipt.\nCafé / 日本語";
var bytes = Encoding.UTF8.GetBytes(text);
await using var stream = new MemoryStream(bytes);
var file = new FormFile(stream, 0, bytes.Length, "files", "fictional.txt") { Headers = new HeaderDictionary(), ContentType = "text/plain" };
await store.AddMaterialsAsync(p.Id, new[] { file }, "Policy and log", "Fictional scenario author", "2026-09-08", "Analysis target");
Check(await transfer.Extract(p.Id, "S001") == text, "Unicode text roundtrip");
await Reject(async () => await transfer.Prepare(p.Id, new[] { "S001" }), "Unreviewed text cannot transfer");
await store.SaveTextAsync(p.Id, "S001", text);
var plan = await transfer.Prepare(p.Id, new[] { "S001" });
var approval = new SendApproval(plan.Id, plan.Fingerprint, true, true, true, "Fictional test environment");
await Reject(async () => await transfer.Consume(p.Id, approval with {DataTermsChecked=false}), "Terms confirmation required");
await transfer.Consume(p.Id, approval);
await Reject(async () => await transfer.Consume(p.Id, approval), "Replay rejected");
var stale = await transfer.Prepare(p.Id, new[] {"S001"});
await store.SaveTextAsync(p.Id, "S001", text + "\nA later correction.");
await Reject(async () => await transfer.Consume(p.Id, approval with {PlanId=stale.Id,Fingerprint=stale.Fingerprint}), "Changed source invalidates consent");
await store.SaveTextAsync(p.Id, "S001", text);
plan = await transfer.Prepare(p.Id, new[] {"S001"});
Check(!plan.Prompt.Contains("AppData") && plan.Prompt.Contains(text[..15]), "Payload contains only bounded data, no host paths");
Check(File.ReadAllText(Path.Combine(store.GetProjectDirectory(p.Id), "materials", "S001.txt")) == text, "Original unchanged after text edits");
var schema = JsonNode.Parse(File.ReadAllText(Path.Combine(root,"schemas/review-output.schema.json")))!;
JsonNode Blank(JsonNode s) => s["type"]!.GetValue<string>() switch {
    "object" => new JsonObject(s["properties"]!.AsObject().Select(kv => new KeyValuePair<string,JsonNode?>(kv.Key, Blank(kv.Value!)))),
    "array" => new JsonArray(), "boolean" => JsonValue.Create(true)!,
    _ => s["enum"] is JsonArray a ? a[0]!.DeepClone() : JsonValue.Create("Fictional test")!
};
var result = Blank(schema);
var source = Blank(schema["properties"]!["sources"]!["items"]!);
source["source_id"]="S001"; source["target_status"]="Analysis target"; result["sources"]!.AsArray().Add(source);
var e = Blank(schema["properties"]!["evidence"]!["items"]!);
e["evidence_id"]="E001"; e["source_id"]="S001"; e["source_excerpt"]=text.Split('\n')[1];
e["reasoning_chain"]=new JsonArray("Compare policy and observed event; receipt is missing in the supplied log.");
e["alternative_explanations"]=new JsonArray("Receipt could exist in another log not supplied.");
result["evidence"]!.AsArray().Add(e);
ReviewSafety.CheckShape(result, schema); ReviewSafety.CheckReferences(result, plan.Snapshot,true); Check(true,"Valid structured result accepted");
await Reject(()=>{var bad=result.DeepClone();bad["evidence"]=JsonValue.Create("not an array");ReviewSafety.CheckShape(bad,schema);return Task.CompletedTask;},"Malformed array rejected");
await Reject(()=>{var bad=result.DeepClone();bad["evidence"]![0]!["source_excerpt"]="Invented excerpt";ReviewSafety.CheckReferences(bad,plan.Snapshot,true);return Task.CompletedTask;},"Fabricated quote rejected");
await Reject(()=>{var bad=result.DeepClone();bad["sources"]![0]!["source_id"]="PRIVATE";ReviewSafety.CheckReferences(bad,plan.Snapshot,true);return Task.CompletedTask;},"Unknown source rejected");
await Reject(()=>{var bad=result.DeepClone();bad["sources"]![0]!["target_status"]="Context only";ReviewSafety.CheckReferences(bad,plan.Snapshot,true);return Task.CompletedTask;},"Target/context role protected");
await store.SaveReviewAsync(p.Id,result); await store.SaveReviewAsync(p.Id,result);
Check(Directory.GetFiles(store.GetProjectDirectory(p.Id),"review-*.json").Length==1,"Previous review version preserved");
await Reject(async()=>await store.ApplyReviewAsync(plan,result,transfer),"Stale candidate cannot overwrite a newer review");
await store.UpdateIntakeAsync(p.Id,new UpdateIntakeRequest {Title=p.Title,ReviewQuestion="Fictional sensitive workflow",SensitiveReviewMode=true});
await Reject(async()=>await transfer.Prepare(p.Id,new[]{"S001"}),"Sensitive-use confirmation is enforced server-side");
await store.UpdateIntakeAsync(p.Id,new UpdateIntakeRequest {Title=p.Title,ReviewQuestion="Fictional sensitive workflow",SensitiveReviewMode=true,SensitiveUseConfirmed=true});
var fresh=await transfer.Prepare(p.Id,new[]{"S001"});
await store.ApplyReviewAsync(fresh,result,transfer);
Check(Directory.GetFiles(store.GetProjectDirectory(p.Id),"review-*.json").Length==2,"Validated conditional apply preserves prior map");
await File.WriteAllTextAsync(Path.Combine(data,"valid-result.json"),result.ToJsonString());
var flags=string.Join(' ',CodexRunner.BuildArguments("schema","output"));
Check(!flags.Contains("--ignore-rules") && !flags.Contains("dangerously") && flags.Contains("forced_login_method=\"chatgpt\"") && flags.Contains("features.shell_tool=false"),"Read-only ChatGPT connector policy");
Console.WriteLine($"{passed} checks passed.");

sealed class Env(string root) : IWebHostEnvironment {
    public string ApplicationName {get;set;}="Tests";
    public string EnvironmentName {get;set;}="Tests";
    public string ContentRootPath {get;set;}=root;
    public string WebRootPath {get;set;}=Path.Combine(root,"wwwroot");
    public IFileProvider ContentRootFileProvider {get;set;}=new NullFileProvider();
    public IFileProvider WebRootFileProvider {get;set;}=new NullFileProvider();
}
