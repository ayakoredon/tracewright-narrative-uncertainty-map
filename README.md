# Tracewright Narrative Uncertainty Map

## Tracewright is a review method and dashboard for examining written materials.

Use it with papers, academic writings, drafts, correspondence, public statements, provenance records, newsletters, creative work, and mixed document sets.

The goal is not to decide **"AI or human?"** The goal is to make the **logic, claims, gaps, contradictions, evidence, source roles, and next review actions** visible.

It can also be used to improve human-written work: clarifying arguments, extracting key issues, finding weak links, and identifying what should be revised before publication, submission, citation, or escalation.

## Get Tracewright

### 1. Install the Windows Workbench (recommended)

**[Download Tracewright Workbench v0.3.0-beta for Windows](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.3.0-beta/Tracewright-Workbench-Setup-v0.3.0-beta.exe)**

This is the main way to use Tracewright. The local-first Workbench guides the full review flow without requiring you to build a dashboard:

- define the review question and mode before analysis
- add and classify materials while keeping review targets separate from context
- create a bounded review bundle for an AI environment you choose
- import the AI's structured JSON result
- inspect Summary, Claims, Evidence, Sources, and Follow-up views, including the reasoning and alternatives behind each observation

The installer adds a Start Menu shortcut and can add a desktop shortcut. The browser-based interface and review files stay on your computer; Tracewright does not operate a hosted document server and does not receive your materials.

**Requirements:** Windows 10/11 x64. This is an unsigned beta, so Windows SmartScreen may show an unrecognized-app warning. Download it only from this repository. Checksums, release notes, and integrity guidance are available on the [Workbench release page](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/tag/workbench-v0.3.0-beta).

### 2. See the dashboard before installing

**[Open the public dashboard demo](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/)**

The demo shows the review map across synthetic correspondence, academic, public-narrative, and provenance cases. It contains no private correspondence, collector file, manuscript, or real unpublished source material.

### Other ways to use Tracewright

- **No installation, Mac, or chat-only workflow:** use the [Starter Kit](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.6.zip) with ChatGPT, Claude, Gemini, or another file-capable AI assistant. It returns a Markdown review map instead of the interactive Workbench.
- **See the lightweight workflow first:** open the [Simple AI Review example](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/simple-ai-example.html).
- **日本語で始める:** open the [Japanese guide / 日本語ガイド](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/blob/main/README.ja.md).

**License / commercial use:** free for personal, educational, research, and other non-commercial use. Commercial use, resale, hosted commercial services, or product integration require prior written permission. See `LICENSE` and `COMMERCIAL_USE.md`. Public visibility does not grant commercial-use rights.

## Use It When You Want To Ask

- Does this argument hold together?
- Which claims need evidence?
- Where are the contradictions, missing context, or weak links?
- What changed over time?
- What should be checked, revised, or escalated next?

Tracewright helps reviewers inspect narrative materials, including AI-mediated or potentially AI-mediated text, without reducing the question to a detector verdict. It organizes evidence, uncertainty, alternatives, provenance disclosures, and follow-up questions so that a human reviewer can reason more carefully.

Another way to describe the project is **uncertainty literacy**: learning how to read without rushing, especially when documents may have been drafted, edited, translated, polished, summarized, or mediated by AI.

## Design Principle

Tracewright is not designed to expose people. It is designed to slow down premature judgment.

## Why This Exists

Tracewright began as a way to read narrative materials more responsibly in an AI-mediated world. The original question was not simply "was this written by a human?" The more useful question was: when a reviewer faces documents, statements, drafts, correspondence, public narratives, academic material, or mixed-source dossiers, what can be trusted, what needs checking, what has changed over time, and what should be done next?

The tool is designed to support careful review rather than exposure. It can help make visible:

- shifts in the public or private narrative around a particular person, organization, or project
- small contradictions, missing context, or changes in stated position across a timeline
- whether academic or technical prose still preserves the author's intention after editing, translation, or AI-assisted polishing
- where machine-generated or heavily mediated text leaves weak reasoning, unsupported claims, missing evidence, or unclear responsibility
- how materials written by different authors, in different roles, and in different contexts relate to each other

In that sense, Tracewright is a tool for improvement and verification. It helps a reviewer decide whether to ask a follow-up question, check a source, add evidence, revise a draft, separate source roles, or escalate to a qualified human reviewer. It is not built to judge people.

## Intended Workflow

Tracewright is designed for a human-in-the-loop review flow:

1. A reviewer gathers one document or a sequence of related narrative materials.
2. The reviewer provides the materials to an AI assistant or analysis pipeline.
3. The AI segments the materials, extracts claims, identifies evidence, records uncertainty, and proposes alternative explanations.
4. The structured result is loaded into a dashboard like this one.
5. A human reviewer inspects the Summary, Claims, Evidence, Sources, and Follow-up views before deciding what to verify, ask, ignore, or escalate.

The intended output is not a verdict. It is a review map.

## What This Is

- A browser-based demo for reviewing narrative materials.
- A downloadable local-first Windows Workbench for preparing review bundles and inspecting structured results.
- A method for mapping uncertainty around authorship, mediation, disclosure, and claim reliability.
- A reviewer-support tool for provenance-aware reading.
- A way to review mixed narrative sets: correspondence, public statements, articles, academic drafts, institutional pages, transcripts, art-provenance files, historical records, and other source materials.
- A synthetic public demo; no private correspondence is included.

## What This Is Not

- It is not an AI detector.
- It does not identify whether a person used AI.
- It does not produce authenticity scores.
- It does not replace consent, context, or human judgment.
- It is not a hosted analysis platform.
- It does not provide hosted storage, a Tracewright cloud, or free AI computing resources.
- The Windows Workbench includes local material intake and structured-result import, but no direct provider API connection yet.
- It is not a grant of permission to commercially exploit the Tracewright concept, name, methodology, starter kit, dashboard, prompts, templates, or distinctive review structure.

## License And Commercial Use

Tracewright Narrative Uncertainty Map is free to study, test, adapt, and use for personal, educational, research, and other non-commercial purposes.

Commercial use is not granted by the public license. This includes selling Tracewright-based tools, dashboards, prompts, workflows, or services; building a hosted commercial platform from this repository; packaging the Starter Kit into a paid product; or using the Tracewright name or distinctive method as part of a commercial product without permission.

For commercial collaboration, licensing, institutional use, or product integration, please contact Ayako Redon first.

See `LICENSE` and `COMMERCIAL_USE.md`.

## Safety Docs

- `FAQ.md`: common questions and boundaries.
- `docs/misuse-examples.md`: unsafe uses and safer reframings.
- `docs/safe-use-cases.md`: practical review scenarios.
- `docs/schema.md`: data structure notes for builders.
- `SECURITY.md`: do not post private review materials in public issues.
- `CONTRIBUTING.md`: contribution principles.

## Public Dashboard Demo

Open the live dashboard demo here:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/

You can also open `index.html` locally in a browser. The same demo is available at `demo/index.html`.

The demo uses synthetic review materials only and presents them as a read-only Workbench review map. The cases are designed to show how source-grounded texture cues, cross-language influence, editorial polish, source grounding, and claim reliability can be separated during review. Summary includes the Interpretation Guide; Sources preserves chronology and source-role boundaries; Evidence leaves the excerpt, reasoning chain, alternatives, and next human action inspectable.

The demo includes several document genres: personal correspondence, mixed AI/editorial writing, institutional newsletter-style prose, academic paper review, public narrative dossiers, and art-provenance review. These genres should not be reviewed with identical prompts or assumptions.

For the non-dashboard workflow, see `simple-ai-example.html`. It shows a reconstructed academic review map generated through the simple "use this with your AI" path.

## No-Install Starter Kit

The Starter Kit is the secondary route for Mac users, people who do not want to install an application, or anyone who prefers to work directly in a familiar AI chat:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.6.zip

The starter kit includes two entry paths:

- **Simple AI Review**: for users who only want to attach one instruction file to ChatGPT, Claude, Gemini, or another AI assistant and receive a Markdown review map.
- **Dashboard Builder**: for Codex users, local HTML/JSON users, or reviewers who want to adapt the dashboard itself.

After downloading and unzipping the starter kit, open `START_HERE.md` first. Non-technical users can attach `USE_THIS_WITH_YOUR_AI.md` to their AI assistant and paste one short message. The AI should then check file safety, ask what kind of review is needed, and guide the next step.

If you feel lost, start with only one file: `USE_THIS_WITH_YOUR_AI.md`. Attach it to your AI assistant and ask it to guide you before uploading any review materials.

The Starter Kit is not a free analysis service operated by Ayako Redon. It is a set of files you can use with your own AI environment, subject to that environment's privacy, security, and capability limits.

## Demo Cases

- **Case A: Self-Written Baseline** shows what a stable, lightly mediated personal-writing baseline can look like without treating it as a universal standard.
- **Case B: Cross-Language Influence** shows how translation, non-native phrasing, and source-language thinking can be reviewed without treating them as deception.
- **Case C: Mixed Authorship / AI-Polish** shows why one document or exchange may need segment-level review rather than one label for the whole person or text.
- **Case D: Institutional Newsletter-Style Prose** shows how source-backed details, editorial polish, translation workflow, and public-facing institutional claims can be separated.
- **Case E: Academic Paper Review** shows how the framework can support academic quality review by surfacing weak claims, method gaps, citation uncertainty, and overgeneralization, not just possible AI mediation.
- **Case F: Public AI Leadership Narrative Dossier** shows how public statements, company positions, reporting, and adversarial sources can be mapped to test narrative consistency without turning the review into a reputational verdict.
- **Case G: Eighteenth-Century Painting Provenance Dossier** shows how art and collection provenance files can be reviewed across diaries, auction records, researcher notes, material analysis, wartime gaps, and archival silence.

Separate from the dashboard cases, the **Simple AI Review Example** shows what a Markdown academic review map can look like when the Starter Kit is used with a general-purpose AI assistant.

## Reproducing the Method Locally

This repository is intentionally a static public demo, not a free hosted service. A Codex or LLM-assisted user can still reproduce the workflow locally by:

1. Keeping private source documents outside the public repository.
2. Asking an AI assistant to analyze those documents using the methodology in `docs/methodology.md`.
3. Converting the analysis into structured case data: materials, claims, evidence cards, review lanes, and summary posture.
4. Replacing the synthetic demo data in `index.html` or adapting the UI to load a local JSON file.
5. Reviewing and correcting the AI output manually before taking any action.

This keeps the method reproducible without requiring the project owner to host private documents or provide free analysis infrastructure.

## AI Configuration Matters

Analysis quality depends heavily on the AI assistant, model, prompt, source extraction quality, and reviewer instructions. A reviewer should explicitly tell the AI what kind of material is being reviewed and what level of scrutiny is needed.

For example:

- correspondence review may emphasize continuity, response alignment, personal claims, style drift, and disclosure
- newsletter or article review may emphasize editorial polish, source-backed details, translation workflow, institutional claims, and public-facing accuracy
- academic paper review may emphasize research claims, methodology, sample description, evidence strength, citation use, limitations, and overgeneralization
- art-provenance review may emphasize source-role boundaries, attribution versus ownership history, material-analysis limits, catalogue or diary mismatches, wartime gaps, and archival silence

The starter kit includes a review-intake worksheet for choosing a primary review mode before analysis. Users should tell their AI whether they want claim/fact consistency review, academic review, correspondence continuity review, authorship/mediation workflow review, provenance/source-role review, or another mode. If the goal is unclear, the AI should ask clarifying questions before producing a map.

The dashboard is only as useful as the structured analysis that feeds it. AI output should be treated as a draft review map, not as ground truth.

If a review may affect employment, legal, academic, reputational, provenance, publication, or financial decisions, Tracewright output should be treated only as preparation for qualified human review.

## Current Workbench And Future Product Shape

The Windows Workbench now provides local material intake, review setup, bounded bundle generation, structured JSON import, and an inspectable review dashboard. It keeps files under the user's local application-data folder and uses the user's chosen AI environment.

A future hosted or multi-user product would still need:

- broader document text extraction
- optional encrypted collaboration and retention controls
- an API-backed analysis layer
- reviewer editing and audit logs
- provider-specific key storage, consent, and cost controls

The current repository does not provide that hosted backend.

## AI Analysis Instructions

See `docs/ai-analysis-instructions.md` for prompt guidance when asking a local AI assistant to prepare correspondence, newsletter/article, or academic paper material for the dashboard.

## OECD.AI Catalogue Submission Draft

See `docs/oecd-ai-catalogue-submission-draft.md` for a draft submission text and categorization notes for the OECD.AI Catalogue of Tools & Metrics for Trustworthy AI.

## Core Review Lanes

- **Authorship / Mediation**: wording, style, AI/editorial polish, continuity, and final-surface mediation.
- **Disclosure / Provenance**: explicit or known information about AI use, translation, editing, fiction, or workflow.
- **Claim Reliability**: factual claims, identity or timeline statements, contradictions, and verification needs.

The tool is built around review posture, not verdicts. Labels such as "segment-level review recommended" are meant to guide attention, not to classify people or texts.

Evidence Cards are observation cards, not suspicion cards. They should never be used as a list of "people to suspect" or as a ranking of authenticity.

## Repository Contents

- `workbench/`: source and Windows packaging scripts for the local-first Tracewright Workbench.
- `index.html`: public synthetic demo for GitHub Pages.
- `demo/index.html`: duplicate local demo entry point.
- `CHANGELOG.md`: public version notes.
- `docs/methodology.md`: method and review model.
- `docs/ai-analysis-instructions.md`: prompt guidance for local AI-assisted analysis.
- `docs/ethics.md`: privacy, consent, and misuse boundaries.
- `docs/misuse-examples.md`: misuse examples and safer reframings.
- `docs/safe-use-cases.md`: safe practical use cases.
- `docs/schema.md`: data structure notes.
- `FAQ.md`: common questions.
- `CONTRIBUTING.md`: contribution principles.
- `SECURITY.md`: private-material warning for public GitHub participation.
- `LICENSE`: source-available non-commercial license.
- `COMMERCIAL_USE.md`: plain-language commercial-use summary.





