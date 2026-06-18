# OECD.AI Catalogue Submission Draft

Use this draft for the OECD.AI "Submit a tool to the Catalogue of Tools & Metrics for Trustworthy AI" form.

Submission page:

https://oecd.ai/en/catalogue/tools/submit

Public demo:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/

Starter kit download:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.5.zip

GitHub repository:

https://github.com/ayakoredon/tracewright-narrative-uncertainty-map

## Positioning

Submit Tracewright as a public prototype and review method, not as a finished hosted SaaS product.

Recommended framing:

- Human-in-the-loop review support
- Provenance-aware reading
- AI-mediated text and narrative-material review
- Claim, source-role, disclosure, and uncertainty mapping
- A tool to slow premature judgment, not an AI detector

Avoid framing:

- AI detector
- Authorship classifier
- Authenticity score
- Person-exposure tool
- Automated legal, academic, employment, or reputational decision system

## Name of the Tool

Tracewright Narrative Uncertainty Map

Alternative if a broader name is preferred:

Tracewright: Provenance and Uncertainty Map

## Excerpt

80 words maximum.

Recommended version, 56 words:

Tracewright Narrative Uncertainty Map is a human-in-the-loop review dashboard for AI-mediated and mixed-source narrative materials. It helps reviewers map claims, source roles, provenance disclosures, evidence gaps, and alternative explanations without producing detector-style verdicts. The public prototype demonstrates correspondence, academic, public narrative, institutional, and art-provenance review cases using synthetic materials.

Shorter version, 39 words:

Tracewright Narrative Uncertainty Map helps reviewers inspect AI-mediated or mixed-source narrative materials by mapping claims, source roles, provenance disclosures, evidence gaps, and next verification steps. It is designed to slow premature judgment, not to detect or expose people.

## Detailed Description

Tracewright Narrative Uncertainty Map is a public prototype and review framework for reading narrative materials more carefully in an AI-mediated information environment. It was developed from the observation that the central question is often not simply whether a text was written by a human or by AI, but what can be trusted, what needs checking, what changed over time, which source said what, and what action a responsible reviewer should take next.

The tool organizes a document set into review materials, claims, evidence cards, source roles, timeline entries, disclosure/provenance notes, and follow-up actions. It separates several review lanes that are often collapsed in ordinary reading: authorship or mediation, claim reliability, and disclosure or provenance. It also distinguishes human/source texture from machine/editorial cleanliness as review cues, not as authenticity probabilities.

Tracewright is not an AI detector and does not produce a verdict about a person or text. Its goal is to slow premature judgment and support accountable human review. A reviewer can use it to inspect correspondence, public statements, institutional publications, academic drafts, art-provenance files, historical records, or other mixed narrative dossiers. It is especially useful when materials have different authors, dates, roles, levels of editorial intervention, or evidence quality.

The public demo is a static GitHub Pages prototype using synthetic cases only. It demonstrates how the method can surface response continuity, translation or editorial mediation, academic method gaps, public narrative consistency issues, source-boundary problems, wartime provenance gaps, archival silence, and weak or overextended claims. The starter kit adds a review-intake worksheet, mode-specific prompt snippets, and a refinement prompt so users can tell their own AI assistant what kind of review they need before analysis. A production system would require document upload, extraction, secure storage, API-backed analysis, reviewer editing, audit logs, privacy controls, and domain-specific validation.

## Background and Objectives

Tracewright was created to support human judgment around AI-mediated documents and mixed-source narratives. As generative AI, machine translation, automated polishing, and synthetic drafting become normal parts of writing workflows, reviewers increasingly face documents where the final surface is smooth but the provenance, claim support, or source role is unclear.

The objective is to give reviewers a structured way to:

- separate authorship, mediation, disclosure, and claim reliability questions
- preserve the relationship between summary labels and exact evidence
- identify contradictions, evidence gaps, source-role problems, and chronology shifts
- record alternative explanations rather than jumping to a detector-like conclusion
- decide whether to verify, ask a follow-up, revise a draft, seek expert review, or de-escalate

The tool is designed for improvement and verification rather than punishment. It can support academic review, public narrative analysis, correspondence review, institutional communications review, art-provenance research, and other contexts where human reviewers need to reason carefully about evidence and uncertainty.

## Tool Resources and Links

Link to the tool's website:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/

Starter kit download:

https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.5.zip

GitHub repository of the tool:

https://github.com/ayakoredon/tracewright-narrative-uncertainty-map

Tool package:

Not available. This is currently a static public prototype and method demonstration.

Related post:

Not available yet.

## Tool Categorization Suggestions

The exact OECD form options may vary. Use the closest available options in the dropdowns.

### Type

Suggested tool types:

- Toolkit
- Methodology / framework
- Educational or guidance resource

If only technical categories are available, choose the closest to:

- Risk management tool
- Assessment tool
- Governance tool

### Usage Rights and Objectives

Usage rights:

- Open source / openly available
- Free to access

Objectives:

- Transparency
- Accountability
- Human oversight

Secondary possible objective:

- Risk management

### License

Use the repository license as listed on GitHub.

If the form requires a text answer:

MIT License

## Origin

Stakeholder groups:

- Civil society / independent researcher
- Academia / research community
- Private sector / developer

Country/Territory of origin:

Use the submitter's appropriate country/territory.

Organisation:

Tracewright

If a registered organisation is required and Tracewright is not yet formalized, consider:

Independent project / Tracewright prototype

## Scope

Lifecycle stages:

- Design
- Development
- Evaluation

Target groups:

- AI users
- Researchers
- Organisations deploying or reviewing AI-assisted workflows

Target users:

- Reviewers
- Researchers
- Compliance / governance teams

Target sectors:

- Cross-sector
- Education and research
- Media, culture, and information services

Alternative sector if available:

- Arts, culture, and heritage

Impacted stakeholders:

- People represented in reviewed materials
- Reviewers and decision-makers
- Organisations relying on AI-mediated documents

Purposes or action of the AI system:

- Content generation and editing
- Information retrieval and analysis
- Decision support

Geographical reach:

International / global

Platform neutrality:

Platform-neutral. The public prototype is static HTML, and the method can be adapted to different AI assistants or local analysis workflows.

## Adoptability

Tool readiness:

Prototype / beta / proof of concept

Required skills:

- Basic web browser use for the public demo
- For local reproduction: ability to use an AI assistant, review structured outputs, and edit JSON or HTML
- Domain expertise is recommended for high-stakes uses such as academic review, provenance research, legal matters, employment, publication, or reputational review

People involved:

- Human reviewer
- Domain expert when needed
- AI assistant or analysis pipeline when preparing structured review data

Validity:

The current public demo is a synthetic prototype. It demonstrates the review model and interface logic, but it has not yet been externally validated as a formal metric or benchmark. Analysis quality depends on the source material, extraction quality, model configuration, prompt design, and reviewer expertise. Outputs should be treated as draft review maps, not ground truth.

## Implementation Incentives

Benefits:

- Supports human oversight by making uncertainty, evidence gaps, and source roles visible
- Reduces premature AI-authorship or authenticity judgments
- Helps reviewers identify next verification actions across mixed documents and AI-mediated workflows

Enforcements:

Not an enforcement tool. It supports human review, documentation, and escalation decisions.

## Keywords

Suggested keywords:

- trustworthy AI
- human oversight
- provenance
- uncertainty mapping
- AI-mediated text
- source reliability
- claim verification
- narrative review
- accountability
- transparency
- evidence mapping
- generative AI
- content provenance
- academic review
- art provenance

## Email

Use the submitter's preferred contact email.

## Relation to This Tool

Recommended answer:

I work in or am affiliated to the organisation that created the tool.

If submitting as an individual before formalizing Tracewright:

I am the creator / project lead of this independent prototype.

## Contributor Disclosures

Before checking the final disclosure boxes, confirm that:

- all public demo materials are synthetic or public-safe
- no private letters, unpublished manuscripts, private collector files, or personal data are included
- the GitHub repository does not contain private source documents
- the submission describes the tool as a prototype, not a validated detector
- the submission does not claim legal, academic, employment, or provenance-certification authority

## Screenshot / Image Suggestion

Recommended image:

A screenshot of the public demo Summary or Interpretation Guide tab, preferably showing:

- "This is not an AI detector"
- Review lanes
- Texture axes
- Evidence or source-role language

Avoid screenshots that suggest:

- a person has been classified
- an AI probability score
- a red/green pass-fail verdict

## Final Safety Sentence to Include if Space Allows

Tracewright is designed to help reviewers ask better questions before making decisions; it should not be used as an automated detector, enforcement mechanism, or substitute for qualified human review.



