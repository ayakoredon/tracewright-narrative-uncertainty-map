# Tracewright Letter Uncertainty Map

Tracewright is not designed to expose people. It is designed to slow down premature judgment.

This prototype helps reviewers inspect AI-mediated or potentially AI-mediated text without reducing the question to a detector verdict. It organizes evidence, uncertainty, alternatives, provenance disclosures, claims, and follow-up questions so that a human reviewer can reason more carefully.

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

## Demo

Open `index.html` in a browser. The same demo is also available at `demo/index.html`.

The demo uses synthetic review materials only. The Summary tab includes a review guide, texture axes, review lanes, and an attention mix so that the tool is framed as narrative-material review rather than AI detection. Claims are separated from authorship/mediation signals because factual reliability and AI mediation are different review questions.

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
