# Tracewright Workbench v0.3.0-beta

Tracewright Workbench is a local-first interface for connecting:

1. a bounded review question,
2. a classified set of narrative materials,
3. an AI environment controlled by the user, and
4. an inspectable review map for human judgment.

It is not an AI detector and does not provide an authorship verdict.

## Run locally

With the .NET 10 SDK installed, double-click `run-workbench.cmd`, or run:

```powershell
dotnet run --project Tracewright.Workbench.csproj
```

The workbench opens at `http://127.0.0.1:8791`.

## Build the double-click Windows package

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-windows.ps1
```

The script creates a self-contained Windows x64 folder and ZIP under `release/`. The recipient does not need Node.js or a separate .NET installation. After extracting the ZIP, double-click `Tracewright Workbench.exe`.

## Build the Windows installer

Install Inno Setup 6, then run:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-windows-installer.ps1
```

The script first builds the portable package, then creates a per-user installer under `release/`. The installer adds Start Menu and optional desktop shortcuts without requiring administrator privileges. Review data remains under `%LOCALAPPDATA%\Tracewright\Workbench` and is not removed automatically during uninstall.

## Storage boundary

- Review files are stored under `%LOCALAPPDATA%\Tracewright\Workbench` by default.
- Set `TRACEWRIGHT_DATA_DIR` to use another local data directory.
- The app listens only on `127.0.0.1`.
- Tracewright has no hosted document server and receives no documents or telemetry.
- Documents leave the computer only through a connection chosen by the user.

## AI connections in v0.1

### Manual AI Bridge

This route works with file-capable AI assistants. The workbench creates a ZIP containing the selected materials, a bounded review request, a source manifest, and a JSON output schema. The user uploads that bundle to an AI environment they trust and imports the returned JSON result.

### Codex CLI

If the Codex CLI is installed and signed in, the workbench can run a non-interactive, read-only, ephemeral review from the local project directory. It uses a JSON output schema and returns the result directly to the dashboard.

## Current limits

- Office, OpenDocument, PDF, and RTF files are preserved as originals; readability depends on the connected AI and tools available in that environment.
- There is no direct provider API-key connector yet.
- There is no account system, remote collaboration, hosted storage, or cloud sync.
- A qualified human reviewer remains responsible for academic, legal, employment, financial, publication, provenance, ownership, and reputational decisions.
