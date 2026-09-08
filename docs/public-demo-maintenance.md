# Public demo review data

The public demo is a read-only rendering of prepared synthetic excerpts and illustrative source-role notes. It does not analyze uploads or call an AI. Its data format is not the Workbench review-output import schema.

## Files

- `demo/cases.js`: canonical demo fixtures with named fields and explicit IDs.
- `demo/workflow-case.js`: fictional multilingual customer-support scenario.
- `demo/access-materials.js` and `demo/access-case.js`: fictional temporary production-access materials and review.
- `demo/review-model.js`: validation, reference lookup, counts, ordering, filters and URL state.
- `public-demo.js`: escaped HTML rendering and browser interaction.
- `workflow-review.js`: workflow-specific Summary, Flow & Cases, Controls & Access.
- `intake.html`, `intake.js`, `intake.css`, `demo/intake-model.js`: local intake, metadata, questions and manual AI-request preparation. No source-file reading or AI execution.
- `public-demo.css`: styles scoped to the public demo.
- `demo/index.html`: compatibility redirect; keep its query and hash preservation.

## Invariants

1. IDs are unique within a case. Never infer relationships or priorities from array positions.
2. Every source, claim, observation, action and summary focus link resolves by ID.
3. Marked text matches the supplied excerpt exactly. Review notes and composite comparisons are not represented as original quotations.
4. Lane and cue counts derive from observation cards. Zero means no linked card, not demonstrated absence or a probability.
5. A reliability or attribution observation is not automatically a texture or polish cue.
6. A claim without an excerpt remains inspectable as an unsupported inventory claim. Do not invent a passage to complete the display.
7. Next-check priority has an explicit rationale and scope; it is not an allegation or risk likelihood.
8. Context material is separate from review targets. Date ranges sort by their supplied start; precision is not invented.
9. The fixture validator fails closed if references or marked text do not resolve. No private case material belongs in these fixtures.

## Verification

Run `node scripts/test-public-demo.js`, `node scripts/test-workflow.js`, `node scripts/test-access.js`, `node scripts/test-intake.js` and `node scripts/test-english-release.js`. These cover views, links, count/filter equality, exact excerpts, reciprocal links, input/output versions, expiry, Unicode, untrusted imports and release-content boundaries.

Also inspect the browser at desktop and narrow widths: focus link opens the correct observation; its summary collapses normally; claim-to-action-to-source navigation and browser Back work; lane, cue, source and text filters reset cleanly; keyboard tab navigation and focus remain visible. Confirm no horizontal clipping. Pure rendering tests do not replace this browser check.

Open `index.html` directly or use a local static server; no build step is required. Test changes locally before publishing. The installed Windows Workbench and its imported case format are maintained separately.

## Workflow review and intake

The browser demo now includes two prepared workflow reviews and a four-stage intake form. See [workflow design](workflow-review-design.md), [support example](workflow-sample.md), [access example](privileged-access-sample.md) and [intake](review-intake.md).

The interface and explanations are English. Preserve multilingual originals and user-entered Unicode exactly; language consistency does not mean transliterating source text. Keep narrative texture cues separate from workflow-control observations. A workflow has no human/machine score.

The static browser demo, intake schema, installed Workbench and Starter Kit are different artifacts. Do not claim an installed-application upgrade or an automatic review-output importer from changes to this demo. Never publish working directories, browser drafts, private source files or QA outputs with the release.
