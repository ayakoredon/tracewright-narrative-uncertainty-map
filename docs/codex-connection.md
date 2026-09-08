# Codex Connection And Data Boundary

## Before You Connect

Open your own Codex and check which account and workspace you are using. Consult your applicable contract, data controls and organisation policy for retention, training use, managed access, approved purposes and sharing restrictions. Workbench does not read your tokens, determine your contract or guarantee these settings. Do not put tokens or passwords in the environment-description field.

Connection availability, authority to disclose and permission to transmit a particular payload are separate checks. Review all three. Check again after switching account, workspace, provider or material set.

## What Is Sent

The preview shows the complete review brief, unverified intake account, selected source metadata and user-confirmed text. Original files, other projects and unselected material text are not automatically included. The text may itself contain sensitive information, so redact before confirming it.

Data is stored locally by Tracewright but sent to the selected provider when you approve analysis. Ephemeral Codex execution concerns local session persistence, not provider retention or training policy. The app stores approved payloads and run records locally for traceability. It does not encrypt them.

## Automatic Route

A compatible Codex executable with confirmed ChatGPT sign-in is required. The app probes availability and uses that sign-in; it does not copy credentials or silently use API keys. Usage draws on the applicable Codex allowance. A compatible account, remaining allowance and network access are still required.

The application starts an isolated `codex exec` review rather than continuing an existing chat. Its request uses read-only execution, disabled tools/web/plugins/hooks and isolated custom configuration, while retaining provider authentication and platform policies. It does not use `--dangerously-bypass-approvals-and-sandbox` or ignore policy rules. This is a bounded-text connector, not a general desktop agent. Sources containing instructions remain untrusted evidence.

## Human Gate And Error States

The preview expires after 20 minutes. Any saved change to the brief, materials or confirmed text invalidates it. All three confirmations and an identified destination are required at dispatch. A preview cannot be reused for duplicate sends.

Failed or uncertain sends are not retried automatically. After a restart, an unfinished run is reported as uncertain. Cancellation requests stop the local process but cannot retract content already received by a provider or guarantee that remote computation immediately stops.

Returned JSON must match the current contract. The source inventory and target/context roles must match the approved set. Evidence quotes must occur exactly in the approved text; marked wording must occur in the quote. Bad results are not applied. The candidate and status remain in local run history where available. Earlier accepted results are preserved.

Manual bundles follow the same preview gate and contain approved text, a request and an output schema, not the originals. A returned result is bound to that unchanged input. Editing the project requires a new bundle; this prevents accepting an old result as a review of changed input.

## Troubleshooting

| State | Next check |
| --- | --- |
| Codex not found | Install/open Codex; confirm its executable is accessible; use Recheck Codex. A standalone compatible CLI on PATH also works. |
| ChatGPT sign-in not confirmed | Open Codex and check the account. API-key-only mode is not used here. No materials have been sent by the failed availability check. |
| Text needed | Inspect local extraction or paste a verified excerpt. Confirm what notes, images, layout or sections are absent. |
| Payload too large | Explicitly narrow the source set or excerpts. Do not silently truncate a document. |
| Result rejected | Inspect Run history and the candidate. Check the source IDs, literal quotes and contract. Do not treat it as a completed review. |
| Cancelled, interrupted, timeout | Previous map remains. Check status and provider usage before manually starting a new run. |
| Port occupied | The app chooses an available loopback port; use the URL it opens. |

This integration test coverage verifies the software's boundaries, not that a model is accurate or appropriate for your decision. Important conclusions still need qualified review and, where necessary, independent evidence.

Official references: [authentication](https://developers.openai.com/codex/auth), [non-interactive execution](https://developers.openai.com/codex/noninteractive). Consult current official documentation when updating the connector.
