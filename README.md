# Tracewright Narrative Uncertainty Map

Tracewright is not designed to expose people. It is designed to slow down premature judgment.

Tracewright is a review method and dashboard for examining written materials: papers, drafts, correspondence, public statements, provenance records, newsletters, creative work, and mixed document sets. The goal is not to decide "AI or human?" The goal is to make the logic, claims, gaps, contradictions, evidence, source roles, and next review actions visible.

Use it when you want to ask:

- Does this argument hold together?
- Which claims need evidence?
- Where are the contradictions, missing context, or weak links?
- What changed over time?
- What should be checked, revised, or escalated next?

This prototype helps reviewers inspect narrative materials, including AI-mediated or potentially AI-mediated text, without reducing the question to a detector verdict. It organizes evidence, uncertainty, alternatives, provenance disclosures, and follow-up questions so that a human reviewer can reason more carefully.

## Try It With Your Own AI

You can use the Starter Kit with an AI assistant you already have, including free AI tools that can read attached files or pasted text. The simplest path does not require Codex, coding, or dashboard generation. It can produce a Markdown review map for checking a paper draft, article, correspondence thread, creative text, provenance file, or other written material.

Download the Starter Kit:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.2.zip

After unzipping it, open `START_HERE.md`. For the easiest path, attach `USE_THIS_WITH_YOUR_AI.md` to your AI assistant and paste the short starter message. The AI should then check file safety, ask what kind of review you want, and guide the next step.

## View the Demo

Open the public demo here:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/

The demo is a static GitHub Pages site. It uses synthetic cases only; no private correspondence, collector file, manuscript, or real unpublished source material is included.

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
5. A human reviewer inspects the Summary, Claims, Timeline, Evidence, and Source Inventory before deciding what to verify, ask, ignore, or escalate.

The intended output is not a verdict. It is a review map.

## What This Is

- A browser-based demo for reviewing narrative materials.
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
- It does not currently include document upload, storage, or API-backed analysis.

## Demo

Open the live demo here:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/

You can also open `index.html` locally in a browser. The same demo is available at `demo/index.html`.

The demo uses synthetic review materials only. The cases are designed to show how stable human texture, cross-language influence, editorial polish, source grounding, and claim reliability can be separated during review. The Summary tab gives a short triage view, while the Interpretation Guide explains how to read review lanes, texture axes, evidence cards, source roles, and escalation rules without turning them into detector scores.

The demo includes several document genres: personal correspondence, mixed AI/editorial writing, institutional newsletter-style prose, academic paper review, public narrative dossiers, and art-provenance review. These genres should not be reviewed with identical prompts or assumptions.

## Download the Starter Kit

Download the local starter kit here:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.2.zip

The starter kit includes two entry paths:

- **Simple AI Review**: for users who only want to attach one instruction file to ChatGPT, Claude, Gemini, or another AI assistant and receive a Markdown review map.
- **Dashboard Builder**: for Codex users, local HTML/JSON users, or reviewers who want to adapt the dashboard itself.

After downloading and unzipping the starter kit, open `START_HERE.md` first. Non-technical users can attach `USE_THIS_WITH_YOUR_AI.md` to their AI assistant and paste one short message. The AI should then check file safety, ask what kind of review is needed, and guide the next step.

## Demo Cases

- **Case A: Self-Written Baseline** shows what a stable, lightly mediated personal-writing baseline can look like without treating it as a universal standard.
- **Case B: Cross-Language Influence** shows how translation, non-native phrasing, and source-language thinking can be reviewed without treating them as deception.
- **Case C: Mixed Authorship / AI-Polish** shows why one document or exchange may need segment-level review rather than one label for the whole person or text.
- **Case D: Institutional Newsletter-Style Prose** shows how source-backed details, editorial polish, translation workflow, and public-facing institutional claims can be separated.
- **Case E: Academic Paper Review** shows how the framework can support academic quality review by surfacing weak claims, method gaps, citation uncertainty, and overgeneralization, not just possible AI mediation.
- **Case F: Public AI Leadership Narrative Dossier** shows how public statements, company positions, reporting, and adversarial sources can be mapped to test narrative consistency without turning the review into a reputational verdict.
- **Case G: Eighteenth-Century Painting Provenance Dossier** shows how art and collection provenance files can be reviewed across diaries, auction records, researcher notes, material analysis, wartime gaps, and archival silence.

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

## Future Product Shape

A full product would need more than this repository:

- document upload and text extraction
- local or server-side storage
- an API-backed analysis layer
- structured JSON output
- reviewer editing and audit logs
- privacy, retention, and consent controls

The current repository demonstrates the review model and interface logic; it does not provide that backend.

## AI Analysis Instructions

See `docs/ai-analysis-instructions.md` for prompt guidance when asking a local AI assistant to prepare correspondence, newsletter/article, or academic paper material for the dashboard.

## OECD.AI Catalogue Submission Draft

See `docs/oecd-ai-catalogue-submission-draft.md` for a draft submission text and categorization notes for the OECD.AI Catalogue of Tools & Metrics for Trustworthy AI.

## Core Review Lanes

- **Authorship / Mediation**: wording, style, AI/editorial polish, continuity, and final-surface mediation.
- **Disclosure / Provenance**: explicit or known information about AI use, translation, editing, fiction, or workflow.
- **Claim Reliability**: factual claims, identity or timeline statements, contradictions, and verification needs.

## Design Principle

The tool is built around review posture, not verdicts. Labels such as "segment-level review recommended" are meant to guide attention, not to classify people or texts.

## Repository Contents

- `index.html`: public synthetic demo for GitHub Pages.
- `demo/index.html`: duplicate local demo entry point.
- `docs/methodology.md`: method and review model.
- `docs/ai-analysis-instructions.md`: prompt guidance for local AI-assisted analysis.
- `docs/ethics.md`: privacy, consent, and misuse boundaries.
- `LICENSE`: initial open license.
