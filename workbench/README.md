# Tracewright Workbench 0.5.0 Beta

Local narrative and automation-workflow review. See the [repository introduction](../README.md), [data boundary](../docs/codex-connection.md), and [release notes](../docs/workbench-0.5-release.md).

For source builds, run `node scripts/sync-workbench-assets.cjs` from the repository root, then `dotnet run --project workbench/Tracewright.Workbench.csproj`. Requires Node 22+ and .NET 10 SDK. The Windows release does not require either runtime to be installed separately.

Build a portable package with `pwsh scripts/build-workbench.ps1`; add `-Installer` with Inno Setup 6 available. The package builder uses a clean output directory and public-asset allowlist. It does not include projects, raw materials, run records, credentials or developer caches.

The local server listens on loopback, normally port 8791, with a fallback when occupied. APIs require the local session token and matching origin/host. This is not authentication against malicious software running as the same Windows user. Do not expose the listener to a network or shared machine.

Existing data remains under `%LOCALAPPDATA%\Tracewright\Workbench`; a separate directory can be selected with `--data-dir`. Back up this folder before upgrades. Original files and older review JSONs are retained. The new result contract adds workflow observations while retaining sensitive-review information. Older saved maps remain readable; fresh result imports must follow the current approved bundle and contract.

Codex analysis uses a bounded, user-confirmed text payload and ChatGPT sign-in. No API-key fallback. User data terms and authority must be checked in the user's own AI environment before dispatch. The app cannot verify retention, training use or organisation policy. Non-text originals need verified text preparation before they can participate in this route.

All findings are review aids, not verdicts or audit certification. Qualified humans remain responsible for high-impact use.
