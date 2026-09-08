# Tracewright

## Narrative And Automation-Workflow Review

Tracewright helps people inspect evidence, preserve uncertainty and decide what to check next. It is not designed to expose people. It is designed to slow down premature judgment.

**A flag means inspect carefully, not that someone did something wrong.**

- [Try the English synthetic demo](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/)
- [Install Workbench 0.5.0 beta for Windows](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.5.0-beta/Tracewright-Workbench-Setup-v0.5.0-beta.exe)
- [Download the portable Windows ZIP](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.5.0-beta/tracewright-workbench-windows-v0.5.0-beta.zip)
- [Release notes and SHA-256 checksums](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/tag/workbench-v0.5.0-beta)
- [Japanese introduction](README.ja.md)

The Windows package is self-contained: Windows 10/11 x64, no separate .NET or Node installation required. It is an unsigned beta. Verify the release source and checksum before running it. The interface is English; Japanese installer text is not a Japanese app translation.

## Choose Your Starting Point

| Route | What it does | What it does not do |
| --- | --- | --- |
| Public browser demo | Nine entirely fictional examples, source-linked observations, workflow traces and intake | No live AI, private uploads or connection to your local Codex |
| Windows Workbench | Local materials, workflow intake, approved text transfer, Codex or manual analysis, validated result import | No Tracewright cloud, automatic decision or guaranteed analysis |
| [Browser-only ZIP](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-review-lab-2026-09-08-en.zip) | Static examples and intake; open `index.html` without a server | No automatic analysis or result import; use Workbench for those |
| [Starter Kit](starter-kit/) | Earlier model-agnostic method and prompt materials | Not the Workbench 0.5 result contract |

## From Question To Human Review

1. **Frame the review.** State the question, affected people, intended decision and what must not be concluded. For workflows, use the four-stage intake; unknown and withheld information stay visible.
2. **Classify materials.** Preserve author/source roles, dates, versions, targets and context. A file name in an intake is not evidence that its contents were uploaded or read.
3. **Confirm readable text.** Add permitted originals locally. Inspect prepared text or paste a verified excerpt, especially where formatting, transcription or extraction may omit material.
4. **Check your data boundary.** In your own Codex or AI environment, check the account/workspace, retention, training use, organisation policy and authority to share. Tracewright cannot verify these terms on your behalf.
5. **Approve an exact payload.** Select sources, inspect the complete text and brief, and confirm the destination. Originals and unrelated local cases are not included in the automatic text payload.
6. **Receive a review map.** Use compatible ChatGPT-signed-in Codex, or download an approved text bundle for your chosen AI and import its JSON. Results are checked against the contract, source roles and exact excerpts before replacing the map.
7. **Inspect and decide.** Review Summary, Flow & Controls, Claims, Evidence, Sources and Follow-up. Compare observations with originals, alternatives and missing information. Record subsequent investigation and decisions separately.

## Review The Workflow, Not Just The Output

An AI-assisted workflow can produce polished output while its human checks fail to operate. Tracewright helps examine:

- Where inputs change meaning, lose context or enter an exceptional route.
- Whether a handoff reaches a named, capable reviewer with access and authority.
- Whether corrections, holds and stops reach downstream queues, decisions and notifications.
- Whether training, workload and incentives support challenge rather than nominal approval.
- What evidence exists for evaluation, data handling, suppliers, remedy, pause and recovery.

The demo includes multilingual customer support and temporary production access. Both are hand-authored fictional scenarios, not real organisations, incidents or measured AI performance. Working interventions appear alongside problem paths. A policy, owner account, controlled test and operational event are not interchangeable evidence.

For narrative materials, keep **claim reliability**, **authorship/mediation cues** and **disclosure/provenance** separate. Source-grounded texture and mediation-polish cues are not human or machine scores. Use the method with papers, correspondence, public statements, provenance records and mixed document sets without turning it into a verdict on a person.

## Codex Connection And Data Boundaries

Workbench detects a compatible local Codex executable and checks for ChatGPT sign-in. Installation alone does not establish account access, allowance, identity or appropriate data terms. An API-key-only sign-in does not enable this connector; there is no silent API billing fallback.

The automatic route starts a new, ephemeral, read-only Codex run with a bounded text payload, structured output contract and tool/custom-configuration restrictions. It does not attach itself to your existing conversation. This isolation may produce different results from your usual assistant. Codex still calls its provider; this is **not offline inference** and does not make transmitted content local-only.

The first release uses the existing CLI route, not an experimental browser-to-app-server connection. It has no hosted account system and no API-key storage. The manual route is available when local Codex cannot be used. Read [the detailed boundary and error guide](docs/codex-connection.md) and [official Codex authentication guidance](https://developers.openai.com/codex/auth).

## What Is Preserved

- Originals and earlier review results remain local; 0.3/0.4 records remain readable.
- Editing the brief or approved text invalidates a pending transmission preview.
- A result arriving after input changes is retained as a candidate, not applied over the current map.
- Invalid JSON, missing source IDs, changed context roles and fabricated exact excerpts are rejected.
- Cancellation, timeout, restart uncertainty and failed analysis do not trigger an automatic retry.

Local storage is `%LOCALAPPDATA%\Tracewright\Workbench`. It includes originals, approved text, payloads and run records and is not encrypted by TW. Protect it and back it up before upgrading. Removing a material from a review excludes it from later requests but retains the original for history; this is not secure deletion. Never publish this folder, its backups or logs.

## File And Analysis Limits

Text, Markdown, CSV, JSON, HTML/XML and DOCX/ODT body paragraphs can be prepared locally. DOCX/ODT extraction is not a full rendering of notes, images or layout. PDF, legacy Office, RTF and other originals may be stored, but their text must be pasted and verified in this release. Nothing silently substitutes an empty or truncated source for a successful read.

The automatic payload is limited to 180,000 characters, including the brief. Larger projects need explicit selection or bounded excerpts. Results vary with the model, version and source preparation. Software/contract tests are not measured analytical accuracy. Source-ID and quotation validation does not establish that the reasoning is correct.

High-impact academic, employment, legal, safety, clinical, reputational, provenance, publication or financial use requires qualified human review. This tool does not certify an audit, establish compliance, estimate wrongdoing or risk probabilities, or operate the system under review.

## Develop And Build

The repository contains only public code, methodological guidance and fictional examples. The same allowlisted demo/intake assets are packaged with Workbench.

```powershell
node scripts/sync-workbench-assets.cjs
dotnet run --project workbench/Tracewright.Workbench.csproj
dotnet run --project workbench/tests/Tests.csproj -- workbench "$env:TEMP/tw-contract-tests"
pwsh scripts/build-workbench.ps1 -Installer
```

Source builds require Node.js 22+, .NET 10 SDK and, for the optional installer, Inno Setup 6. Use a fresh output directory for release builds. The release workflow builds artifacts from the GitHub checkout, not a developer's local data folder. See [release verification](docs/workbench-0.5-release.md).

## Licence And Responsible Use

The [Source-Available Non-Commercial License](LICENSE) and [commercial-use terms](COMMERCIAL_USE.md) remain unchanged. Public source availability is not an unrestricted open-source or commercial licence.

Read [ethics](docs/ethics.md), [safe uses](docs/safe-use-cases.md), [misuse examples](docs/misuse-examples.md), [security guidance](SECURITY.md) and [contribution guidance](CONTRIBUTING.md). Do not submit private materials, account details or unredacted logs in issues or pull requests.
