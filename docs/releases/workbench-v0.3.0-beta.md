# Tracewright Workbench v0.3.0-beta

Tracewright Workbench is the first downloadable Windows beta of the local-first review interface.

It is not an AI detector and does not provide an authorship or credibility verdict. It helps a human reviewer define a bounded question, classify materials, prepare a review bundle for an AI environment they choose, and inspect the returned claims, evidence, alternatives, limitations, and next actions.

## Download

- `Tracewright-Workbench-Setup-v0.3.0-beta.exe`: recommended Windows installer
- `tracewright-workbench-windows-v0.3.0-beta.zip`: portable version for advanced users
- matching `.sha256.txt` files: integrity checks

## Requirements

- Windows 10 version 1809 or later, or Windows 11
- x64-compatible processor
- a modern default browser
- an AI assistant capable of reading attached files for the Manual AI Bridge workflow

The application is self-contained. Recipients do not need Node.js or a separate .NET installation.

## What The Installer Does

- installs under the current user's local application-data programs folder
- creates a Start Menu shortcut
- offers a desktop shortcut, selected by default
- registers an uninstaller
- keeps reviews under `%LOCALAPPDATA%\Tracewright\Workbench`

Uninstalling the application does not automatically delete the review-data folder.

## Privacy Boundary

Tracewright has no hosted document server and receives no files or telemetry. Files leave the computer only when the user chooses an AI route and uploads a generated review bundle to that environment.

Before uploading any material, verify that the selected AI account and service are appropriate for its confidentiality, ownership, consent, and retention requirements.

## Known Limits

- The beta is not code-signed, so Windows SmartScreen may display an unrecognized-app warning.
- Direct provider API connections and local API-key storage are not included.
- Codex CLI automation appears only when a compatible signed-in CLI is accessible from the local application process.
- Office, OpenDocument, PDF, and RTF files are preserved as originals; actual readability depends on the selected AI and its file tools.
- Analysis quality varies with the AI product, model/version, custom instructions, prior chat context, context limits, and source extraction quality.

Tracewright output is a draft review map. High-impact academic, legal, employment, financial, provenance, publication, or reputational decisions require qualified human review.
