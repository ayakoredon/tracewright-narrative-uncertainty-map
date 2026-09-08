# Changelog

## Workbench 0.5.0 Beta: 2026-09-08

- Integrate the English Review Lab and workflow intake with the Windows Workbench.
- Add confirmed text selection, exact-payload previews and per-dispatch data-boundary confirmation.
- Connect compatible ChatGPT-signed-in Codex with no API-key fallback, automatic result validation and run history.
- Add workflow controls, stale-input checks, cancellation, origin/session protection and source-role/excerpt checks.
- Preserve original materials, old review maps and sensitive-review fields. Build public artifacts from a clean GitHub checkout.

## Review Lab English Preview: 2026-09-08

- Published the browser Review Lab and a separate local ZIP, with download instructions and SHA-256 integrity information. The Windows Workbench and Starter Kit remain separate releases.

- Added an English browser intake for workflow and narrative review: four stages, explicit local drafts, source metadata, conditional questions, JSON import/export and a manually shared AI request. No source-file upload, AI execution or automatic review-output import is performed.
- Added two entirely fictional workflow examples: multilingual customer support and temporary production access. Preserved original-language excerpts, exact source references, event/version distinctions, alternative explanations and proposed-only next checks.
- Added Flow & Cases, Controls & Access and evidence-state filters without simplifying the richer narrative review. Neither mode provides human/machine probabilities or safety certification.
- Added Unicode, source-integrity, intake, workflow and English-release regression tests. This browser update does not change the Workbench installer, Starter Kit or licence.

- Made the public demo question-led, with linked inspection starting points and a multilingual support workflow as the initial example.
- Replaced static cue scales and lane totals with counts derived from actual observation cards, including an explicit no-card state.
- Added stable IDs and explicit material, claim, observation, and next-check references. Corrected the quantitative-result follow-up and several mismatched excerpt highlights.
- Added filterable observations, dated material inspection, addressable records, keyboard tab navigation, and priority rationales without reducing the retained reasoning or alternatives.
- Added reference-integrity and rendering tests for seven narrative and two workflow cases. These changes affect the public demo, not the released Workbench executable or private local cases.
- Documented complex workflow review in English, covering data/model lifecycle, protection, inspectability, effective human intervention, incentives, remedy, and domain-specific validation. Prepared examples and intake are implemented; automated assessment is not.

## Workbench v0.3.0-beta

- Added a self-contained Windows x64 Workbench with local material intake, bounded AI review bundles, structured JSON import, and inspectable Summary, Claims, Evidence, Sources, and Follow-up views.
- Added a per-user Windows installer with Start Menu, optional desktop shortcut, launch-after-install, and uninstall support.
- Kept review data outside the application directory so updates and uninstall do not automatically remove user reviews.
- Added model-variation warnings, human-readable bundle names, JSON import diagnostics, and stronger navigation for review-map tabs.
- Added application, .NET license, third-party notice, checksum, and unsigned-beta documentation to the release package.
- Reorganized the public README and demo entry points so the Windows Workbench is the recommended path, the dashboard demo is the preview path, and the Starter Kit remains available as the no-install, Mac, or chat-only alternative.
- Rebuilt the public dashboard as a read-only Workbench-style review map with matching Summary, Claims, Evidence, Sources, and Follow-up navigation.

## v0.6

- Added FAQ, misuse examples, safe use cases, schema notes, contribution guidance, and private-material warning.
- Reframed dashboard texture labels away from human/machine scoring language.
- Added `must_not_conclude`, `qualified_human_review_required`, and `high_impact_context` template fields.
- Added Starter Kit `LICENSE.md`.
- Fixed evidence-card rendering to use stable map indexes instead of `indexOf(card)`.

## v0.5

- Strengthened beginner guidance: if lost, start with `USE_THIS_WITH_YOUR_AI.md` only.
- Added clearer high-impact review warnings for legal, academic, employment, reputational, provenance, publication, and financial contexts.
- Clarified that Evidence Cards are observation cards, not suspicion cards.
- Added "uncertainty literacy" language to describe the broader method.
- Kept the public release as a Starter Kit, not a free hosted analysis service.

## v0.4

- Added non-commercial licensing language and commercial-use guidance.
- Added Japanese guide files.
- Added commercial-use summaries to the Starter Kit.

## v0.3

- Added Japanese Starter Kit entry files.
