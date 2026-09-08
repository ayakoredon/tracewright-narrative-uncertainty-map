# Review Intake

The browser form collects a description for a later AI-assisted review. It is not a file upload, a model connection or an automatic workflow assessor.

## Four stages

1. **Purpose and scope:** choose workflow or narrative review; describe the question, purpose, affected people, unacceptable outcomes and limits.
2. **Materials and flow:** describe normal and exceptional operation, optionally register steps and branches, and record material metadata with author role, date, version and target/context status.
3. **Intervention and safeguards:** record what is described, unknown, unavailable, restricted, withheld or not applicable with a reason. Relevant impact areas expose additional questions.
4. **Review inputs and gaps:** inspect the input summary, the first three missing-information questions and the complete request intended for your own AI.

Selecting an example does not overwrite a draft; **Load example** does, after confirmation when edits are unsaved. **View example review** opens the prepared review in another tab. The production-access intake preserves an initial owner account, not the conclusions later drawn from its materials. The support example is a fuller worked intake and already includes described configuration differences. Neither is a blind test.

## What the browser actually does

- File selection registers only file name, size and modification time. It does not read or attach contents. URLs are not fetched.
- Text fields and notes are part of the draft. Do not paste unnecessary sensitive source content into them.
- Nothing is saved until **Save draft**. Storage is local to the browser/origin and is not encrypted. Shared browser profiles and other same-origin scripts may have access.
- Saving performs an exact read-back check. Loading a draft clears sharing confirmation.
- Exported intake JSON includes inactive-mode and inactive-domain fields for round-trip preservation. Review its preview before copying or downloading.
- The AI request includes only the active review mode and applicable modules. Hidden-mode descriptions are not forwarded in that request. Material names and notes are included, not source-file bodies.
- Request copy/export requires a destination note and an explicit confirmation. Editing the input clears the confirmation. These actions still do not send anything to an AI.
- Import validates the schema and limits, strips unsupported properties, gives the draft a new ID and marks its origin as imported/unverified. It never silently certifies an imported synthetic label.
- Deleting browser storage leaves open input, original files and previously exported copies untouched. Moving between origins does not migrate stored drafts automatically.

The public demonstration must never bundle browser storage, private drafts, source documents, clipboard contents or local QA exports.

## Schema boundary

Schema ID: `tracewright.review-intake.v1`.

Draft fields: `id`, timestamps, `kind`, `origin`, `scope`, `workflow`, `narrative`, `materials`, `answers`, `destination`.

Workflow steps record ID, title, actor, accountable role, input, output and described reversibility. Transitions record source, destination, kind, condition and timing; `END` is an explicit terminal destination. Missing endpoints remain unanswered rather than invented.

Each information entry has `status`, `text`, `basis` and `material_ids`. Status and evidence basis are different: a person's account of a test is not an independently inspected test result. `answered` means described/unverified.

Limits: 40 materials, 40 steps, 80 transitions, 12,000 characters per ordinary text field, 400 for destination and 1.5 MB total UTF-8 JSON. Earlier v1 drafts lacking the optional financial module receive an unanswered field; existing answers and scope stay unchanged. Present but malformed fields are rejected.

The generated packet has `packet_kind: unanalysed_intake` and explicitly records `assessment_status: not_started`, source contents not included, no external transmission, qualified human review required and pending structure confirmation. It is not a completed analysis import for the browser or the installed Workbench.

## Working with your AI

Review the prepared request and your chosen environment's terms. Decide separately whether and where to share it. Ask the AI to confirm the structure first and ask only 1-3 important questions at a time. Provide suitably redacted source text separately when needed; a filename is not evidence that the AI read a document.

Instructions inside source material remain untrusted data. Require exact source spans, observation, conditional rationale, alternatives, expertise and next check for later cards. Do not let a missing document become a misconduct finding or a confident reconstruction.

The current browser demonstration does not automatically bring that later review back into the dashboard. A developer must validate and adapt reviewed results to the fixture schema, or use a separately documented Workbench workflow. This release does not upgrade the Windows installer or Starter Kit.
