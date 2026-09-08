TRACEWRIGHT WORKBENCH FOR WINDOWS v0.5.0-beta
=============================================

START
-----
Open Tracewright Workbench from the desktop shortcut or Windows Start menu.
Your default browser opens the local workbench on IPv4 loopback. An occupied
default port is replaced with an available port. Read README_FIRST.txt in the
installed folder for the workflow, format limits and Codex data-boundary checks.

STOP
----
Use "Quit Workbench" in the upper-right corner of the app.
Closing only the browser tab does not stop the local workbench.

DOCUMENT STORAGE AND AI BOUNDARY
--------------------------------
- Reviews are stored locally under:
  %LOCALAPPDATA%\Tracewright\Workbench
- Uninstalling the app does not automatically delete review data.
- Tracewright does not upload documents to an Ayako or Tracewright server.
- Originals stay local. Only selected, confirmed review text and the brief are
  eligible for transfer after an exact payload preview and explicit approval.
- In your own Codex or chosen AI, check the account/workspace, retention, training
  use, organisation policy and authority to share before each transfer.
- Back up the data directory before upgrading. Removal is not secure deletion.

AI CONNECTIONS
--------------
- Manual AI Bridge downloads an approved-text bundle, not original files.
  Review your destination before uploading; import the schema-conformant JSON.
- Codex automation needs a compatible executable signed in with ChatGPT. It uses
  your Codex allowance, not an API-key fallback, in an isolated fresh review.

Analysis depth and accuracy can vary with the AI product, model/version, custom
instructions, prior chat context, context limits, and attached-file support.
Confirm that each file was actually read and verify important Evidence Cards
against the original material.

WINDOWS NOTICE
--------------
This beta installer is not code-signed. Windows SmartScreen may display a
warning. Only install a copy obtained from Ayako Redon's official Tracewright
GitHub release.

Tracewright is a review map, not an AI detector or a final professional verdict.
High-impact academic, legal, employment, financial, provenance, publication,
or reputational decisions require qualified human review.

See LICENSE.txt for non-commercial use terms.
