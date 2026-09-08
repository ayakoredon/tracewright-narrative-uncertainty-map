# Local Review Lab

English browser preview, 2026-09-08.

This download contains Tracewright's prepared review examples and a form for organising a new narrative or workflow review. It is not the installed Windows Workbench and does not update that application.

## Start

1. Extract the ZIP to a folder on your computer.
2. Open `index.html` in a modern browser to inspect the synthetic cases.
3. Open `intake.html` or choose **New review** to describe a case.
4. Export intake JSON when you need a portable copy of the draft. Browser storage belongs to the browser and origin; moving a folder or changing the URL may not preserve access to a saved draft.

No installation, account, API key or Node.js is required to open the static pages. The kit uses local scripts and styles rather than a third-party CDN. External documentation and download links need a network connection. If a browser blocks local-file storage or clipboard operations, use the export preview or the optional loopback server below.

## What Is Included

- Seven fictional narrative review examples.
- Two entirely fictional workflow reviews: multilingual customer support and temporary production access.
- A four-stage intake with source-role metadata, workflow branches, safeguards, unanswered-information states and conditional questions.
- Explicit local draft saving, JSON import/export and a previewable request for an AI environment you choose.
- Source-linked observations, alternatives, limitations and proposed next checks in the prepared examples.
- English method notes, validation tests and the unchanged licence.

Scenario inputs and outputs were invented together. They are not real incidents, measured AI outputs, a blind test, a safety certificate or a person's risk assessment.

## What Is Not Included

The form does not read file contents, fetch URLs, call an AI or transmit data. File selection registers metadata only. It does not automatically analyse a new case or import a later AI review into the dashboard. Intake JSON is not a completed review and is not the Windows Workbench's result format.

To use your AI, inspect the request preview and the destination's data-handling terms, confirm what may be shared, then decide separately whether to paste it. Provide permitted and suitably redacted source text separately. Require a structure check before analysis and exact source references, alternatives and next checks afterward.

The installed Windows Workbench and the Starter Kit remain separate downloads. Do not copy this kit into their installation folders or assume compatible import formats.

## Privacy And Review Limits

Input stays on the page unless you explicitly save, export or copy it. Browser draft storage is not encrypted; do not save confidential material on a shared device. Exported drafts include inactive-mode fields for round-trip preservation. Review exports before sharing and retain originals separately.

A flag means inspect carefully, not that someone did something wrong. Missing information is not evidence of an absent control. High-impact use requires an appropriately qualified and accountable human reviewer. Proposed actions do not mean that anything was implemented or verified.

## Optional Preview Server And Tests

From the extracted folder, with Node.js installed:

```powershell
node scripts/serve-preview.cjs
```

Open the loopback URL printed by the command. Stop it with Ctrl+C. It binds to `127.0.0.1`, not your network interfaces. No public deployment occurs.

```powershell
node scripts/test-public-demo.js
node scripts/test-workflow.js
node scripts/test-access.js
node scripts/test-intake.js
node scripts/test-english-release.js
```

These tests check software behaviour and fixture integrity, not analytical predictive accuracy.

## Integrity And Licence

Obtain the kit and its adjacent SHA-256 file from the official Tracewright repository or Pages site. Compare the downloaded ZIP's SHA-256 with the published value. A checksum detects a changed file; it is not a code signature or an independent security audit.

The Source-Available Non-Commercial License v0.1 is unchanged. Read `LICENSE` and `COMMERCIAL_USE.md` before adapting, distributing or using the kit commercially. Public download availability does not grant commercial-use permission.
