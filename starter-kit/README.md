# Tracewright Narrative Uncertainty Map Starter Kit

This starter kit lets you try the Tracewright review method locally with your own AI assistant and your own source materials.

Tracewright is not designed to expose people. It is designed to slow down premature judgment.

## If You Are Starting From ChatGPT, Claude, or Another AI Account

You do not need to install a special AI system to try this kit. You can use an AI assistant you already have access to, such as ChatGPT, Claude, Gemini, or a local LLM. The important part is to tell the AI what kind of review you want before you paste or upload documents.

Start here:

1. Download and unzip the starter kit.
2. Open this `README.md` file.
3. Open `dashboard/index.html` in your browser so you can see what the final review map can look like.
4. Open `prompts/review-intake-worksheet.md`.
5. Choose the review mode that fits your material: academic review, claim/fact consistency, correspondence continuity, authorship/mediation workflow, provenance/source-role review, or another mode.
6. Open your AI assistant in a private workspace or chat.
7. Paste the filled-in review-intake worksheet into the AI chat.
8. Then paste `prompts/tracewright-analysis-prompt.md`.
9. If one mode clearly applies, also paste the relevant section from `prompts/mode-specific-prompt-snippets.md`.
10. Only after that, upload or paste the documents you want reviewed.
11. Ask the AI to produce a Tracewright-style review map with claims, evidence cards, review lanes, uncertainty notes, and follow-up questions.
12. Use `prompts/refinement-feedback-prompt.md` to ask for a second pass if the first result is too vague, too verdict-like, or missing evidence.

For a first test, use a small document set: one short article, one letter exchange, one draft paper section, or three to five related source excerpts. Do not start with a large archive.

## Copy-Paste Starter Message

If you are unsure what to say to your AI assistant, start with this:

```text
I want to use the Tracewright Narrative Uncertainty Map method.

Please do not treat this as an AI-detection task. I want a review map that slows down premature judgment.

Before analyzing my documents, please help me choose the right review mode and ask clarifying questions if my goal is unclear. Possible modes include academic review, claim/fact consistency, correspondence continuity, authorship/mediation workflow, and provenance/source-role review.

After I provide the materials, please separate:
- what the documents explicitly say
- what can be inferred
- what remains uncertain
- what alternative explanations should be kept open
- what evidence or follow-up question would reduce uncertainty
```

Then paste the review-intake worksheet and your selected prompt files.

## What Is Included

- `dashboard/index.html`  
  A static dashboard demo that opens in a browser.

- `prompts/tracewright-analysis-prompt.md`  
  A reusable prompt for asking your own AI assistant to prepare a Tracewright-style review map.

- `prompts/review-intake-worksheet.md`
  A worksheet for choosing the review mode and telling your AI what kind of analysis you need before uploading or pasting materials.

- `prompts/mode-specific-prompt-snippets.md`
  Short prompt additions for common review modes.

- `prompts/refinement-feedback-prompt.md`
  A follow-up prompt for improving the first AI output.

- `templates/case-data-template.json`  
  A structured case-data template showing the fields used by the dashboard.

- `docs/ai-analysis-instructions.md`  
  Review instructions for correspondence, articles, newsletters, academic papers, and other narrative materials.

- `docs/methodology.md`  
  The core Tracewright method.

- `docs/ethics.md`  
  Privacy, consent, and misuse boundaries.

## Basic Workflow

1. Keep private source materials on your own machine or in your own secure workspace.
2. Open the dashboard demo once so you understand the kind of review map you are trying to produce.
3. Fill out `prompts/review-intake-worksheet.md` so your AI assistant knows the review mode, purpose, limits, and known context.
4. Ask your preferred AI assistant to analyze a bounded document set using `prompts/tracewright-analysis-prompt.md` plus the appropriate mode snippet.
5. Use `prompts/refinement-feedback-prompt.md` to challenge and improve the first output.
6. Review the AI output yourself. Correct source excerpts, claims, evidence cards, and uncertainty labels.
7. Adapt the structured output into the shape shown in `templates/case-data-template.json`.
8. Use the dashboard as a review map, not as a verdict.

## What To Do With the AI Output

The AI's first answer is only a draft. Check whether it:

- quotes or points to exact source passages
- separates authorship questions from factual-reliability questions
- preserves alternative explanations
- avoids verdict language such as "this is AI-written" or "this person is lying"
- tells you what to verify next

If the answer is too broad, ask for a narrower second pass. If it gives conclusions without evidence, ask it to rebuild the map from source excerpts and uncertainty notes.

## What This Kit Does Not Do

- It does not upload documents.
- It does not connect to an AI API.
- It does not store your private materials.
- It does not detect whether a text was written by AI.
- It does not replace legal, academic, editorial, provenance, or professional review.

## Choosing a Review Mode

Tracewright works best when the AI knows what kind of review you want. Before analysis, choose a primary mode:

- Claim and Fact Consistency
- Academic Review
- Correspondence / Personal Narrative Continuity
- Authorship / Mediation Workflow
- Provenance / Source-Role Review

If more than one mode applies, choose one primary mode and one secondary mode. The same source material can produce different useful maps depending on the review purpose.

## How To Open the Dashboard

Open:

```text
dashboard/index.html
```

The included dashboard uses synthetic demo cases. To review your own material, adapt the dashboard or use the template as a guide for building your own case data.

## Safe Use

Use synthetic, anonymized, consent-safe, or private-local materials unless you have permission to publish the source text.

Do not use Tracewright to accuse, shame, expose, or rank people based on suspected AI use. The purpose is to document uncertainty, preserve alternative explanations, and decide what should be checked next.

## Public Project Links

Public demo:

```text
https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/
```

GitHub repository:

```text
https://github.com/ayakoredon/tracewright-narrative-uncertainty-map
```
