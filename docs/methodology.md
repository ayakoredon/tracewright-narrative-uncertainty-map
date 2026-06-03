# Methodology

Tracewright maps uncertainty in text review. It treats AI mediation as one possible explanation among several, rather than as a binary target to detect.

## Operational Flow

The expected workflow is:

1. **Input**: one narrative document or a bounded sequence of related materials.
2. **AI-assisted structuring**: an AI assistant segments the text, extracts claims, identifies style and mediation signals, preserves source excerpts, and proposes alternative explanations.
3. **Dashboard mapping**: the structured output is loaded into a review dashboard.
4. **Human review**: the reviewer inspects the Summary, Claims, Evidence, Timeline, and Source Inventory.
5. **Action decision**: the reviewer chooses what to verify, ask, ignore, monitor, or escalate.

The method assumes that AI can help organize evidence, but the human reviewer remains responsible for judgment.

## Review Inputs

Each review material can include:

- source text or excerpt
- date or sequence
- author role
- direction, such as context message or target material
- declared AI, translation, or editing use
- reviewer intuition, when available
- known provenance, when available

## Document-Type Presets

Tracewright should not use the same review emphasis for every genre.

### Correspondence

Useful review questions include:

- Does the reply address the prior message?
- Are self-claims stable over time?
- Are concrete details reused naturally?
- Is there style drift across a sequence?
- Is AI, translation, or editing disclosed?

### Newsletter / Article

Useful review questions include:

- Which claims are source-backed?
- Which claims require fact-checking?
- Is the prose institutionally polished or template-like?
- Are translation or editorial workflows plausible?
- Are archive, object, date, or citation details preserved?

### Academic Paper

Useful review questions include:

- What are the central research claims?
- Are methods, sample, data, and limitations described clearly?
- Do conclusions exceed the evidence?
- Are citations used as support, background, or rhetorical decoration?
- Are quantitative claims, definitions, and causal language verifiable?
- Are limitations disclosed or minimized?

Document-type presets should guide the AI prompt before analysis begins.

## Suggested Structured Output

A practical implementation can store each case as JSON with:

- case metadata
- source materials
- segment summaries
- claim map
- style and mediation observations
- evidence cards
- alternative explanations
- next checks
- reviewer notes

The demo keeps this data embedded in `index.html` for portability. A larger implementation should load it from local JSON or a database.

## Analysis Units

The method separates:

- **Segments**: greeting, self-disclosure, response alignment, claims, questions, closing, and topic-specific passages.
- **Claims**: verifiable, semi-verifiable, interpretive, emotional, or value-based statements.
- **Style features**: concrete detail, abstract/general language, grammar errors/friction, cross-language influence, and AI/editorial polish.
- **Evidence cards**: source excerpt, marked text, reasoning chain, alternatives, and next action.

## Review Lanes

### Authorship / Mediation

This lane asks how the text surface may have been shaped. It includes polish, continuity, cross-language influence, grammar friction, response alignment, and source-grounded specificity.

It does not ask whether the author is "human" or "AI." The better question is: what layers of the text may have been drafted, translated, edited, polished, copied, or personally supplied?

### Disclosure / Provenance

This lane records what is explicitly stated or otherwise known about the text's creation. Examples include disclosed translation, AI assistance, human editing, synthetic data, fictional status, or workflow ground truth.

Known provenance should constrain interpretation. If a text is known to be synthetic, translated, or AI-assisted, the task becomes calibration rather than suspicion.

### Claim Reliability

This lane separates content reliability from authorship questions. A text can be human-written but factually unreliable, or AI-polished but source-grounded and accurate.

Reviewers should avoid merging these questions into one "trust" score.

## Why Not Scores?

Simple scores encourage premature judgment. Tracewright instead shows:

- what triggered attention
- what alternative explanations remain plausible
- what evidence is missing
- what a reviewer should inspect next

## Limits

Final polished English often does not reliably reveal whether the original thinking occurred in another language. Translation-like surface features should be treated as weak signals unless compared with drafts, prior writing, or known workflow evidence.
