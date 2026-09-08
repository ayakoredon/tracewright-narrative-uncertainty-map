# Security And Private Materials

Do not submit private review materials in public GitHub issues, pull requests, discussions, screenshots, or examples.

Do not post:

- private correspondence
- unpublished manuscripts
- confidential client or workplace documents
- student records
- legal materials
- personal data
- identifiable third-party material
- sensitive provenance files

If you want to test Tracewright, use synthetic, public, anonymized, redacted, or non-sensitive excerpts.

Tracewright does not provide privacy protection by itself. Privacy depends on the AI service, account settings, local environment, and documents you choose to use.

If the material is sensitive, consider a local-only workflow or consult the relevant data owner, institution, supervisor, lawyer, editor, or qualified professional before uploading it to any AI system.

## Windows Workbench 0.5

The server binds only to IPv4 loopback. API access requires a per-process session token; cross-site origins, foreign Host headers and framing are rejected. Do not expose the port through a proxy, tunnel or public network. These controls do not isolate the app from other software already running as your Windows user.

The automatic connector accepts a compatible Codex signed in with ChatGPT, never an API-key fallback. Each transfer requires a fresh source selection, exact payload preview and explicit confirmations of the destination, terms and authority. Users must check these conditions in their own Codex/account. Tracewright cannot certify account identity or provider terms.

Only approved review text and the brief are sent, in an isolated read-only run with tools disabled. Originals stay local. Returned JSON must pass schema, source-role and literal-excerpt checks before replacing a map. This is not a guarantee against prompt injection, incorrect reasoning or misuse; qualified review is still necessary.

The local data directory includes private originals, approved payloads, candidate results and history. It is not encrypted by Tracewright. Protect the Windows account and backups. Removing an item from a review is not secure deletion. Never commit that directory, screenshots of real cases or run logs to GitHub. Build releases only from a clean public checkout; packaging rejects known private-data paths and document formats.

If reporting a problem, share a minimal fictional reproduction and software version. Do not paste credentials, private payloads or candidate files into a public issue. The beta is unsigned; published SHA-256 values detect changed downloads but do not replace a code signature or independent security review.
