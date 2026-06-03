# Tracewright Letter Uncertainty Map

Tracewright is not designed to expose people. It is designed to slow down premature judgment.

This prototype helps reviewers inspect AI-mediated or potentially AI-mediated text without reducing the question to a detector verdict. It organizes evidence, uncertainty, alternatives, provenance disclosures, and follow-up questions so that a human reviewer can reason more carefully.

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
- A synthetic public demo; no private correspondence is included.

## What This Is Not

- It is not an AI detector.
- It does not identify whether a person used AI.
- It does not produce authenticity scores.
- It does not replace consent, context, or human judgment.
- It is not a hosted analysis platform.
- It does not currently include document upload, storage, or API-backed analysis.

## Demo

Open `index.html` in a browser. The same demo is also available at `demo/index.html`.

The demo uses synthetic review materials only. The cases are designed to show how stable human texture, cross-language influence, editorial polish, source grounding, and claim reliability can be separated during review. The Summary tab includes a review guide, texture axes, review lanes, and an attention mix so that the tool is framed as narrative-material review rather than AI detection.

The demo includes several document genres: personal correspondence, mixed AI/editorial writing, institutional newsletter-style prose, and academic paper review. These genres should not be reviewed with identical prompts or assumptions.

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
- `docs/ethics.md`: privacy, consent, and misuse boundaries.
- `LICENSE`: initial open license.
