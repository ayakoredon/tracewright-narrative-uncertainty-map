# Workbench 0.5.1 Beta — Windows security maintenance

Update all Windows Workbench installations, including 0.3.0 and 0.5.0 beta.

This release embeds .NET / ASP.NET Core 10.0.13. The 0.5.0 download embedded 10.0.11, which is in Microsoft's affected range for CVE-2026-88092 (HTTP/1 request smuggling). The dependency is affected; exploitation of this loopback-only application has not been demonstrated. Updating the system .NET installation does not replace the runtime inside an existing self-contained Workbench download.

Version 0.3.0 also predates the Host, Origin, cross-site request and API session-token protections present in 0.5.x. Malicious websites may be able to reach an old running local service under browser and DNS-rebinding conditions. Stop using the older Windows binaries. Removing their public downloads cannot repair copies already installed.

## Upgrade

1. Close every running Workbench window and its local service.
2. Back up `%LOCALAPPDATA%\Tracewright\Workbench` (or your custom data directory).
3. Install 0.5.1 beta, or extract its portable ZIP into a new empty folder. Do not mix old and new package files.
4. Start the new copy and confirm `v0.5.1-beta` in the interface. Remove old application copies after confirming your saved projects are available; keep your data backup.

No project-data format migration is introduced by this maintenance release. The package remains an unsigned Windows x64 beta. Checksums accompany the installer and ZIP. Static browser demos do not contain the Windows server runtime.

Validation covers synthetic contract checks, public fixtures and the packaged local API, including rejected foreign Host/Origin/cross-site requests, session tokens, stale or replayed approvals and invalid imported results. No private source material or live AI request is used in this maintenance validation. This is a bounded review, not a guarantee that all security issues have been found.

Microsoft advisory: https://github.com/dotnet/announcements/issues/472

Existing feature notes: [Workbench 0.5.0](workbench-0.5-release.md).
