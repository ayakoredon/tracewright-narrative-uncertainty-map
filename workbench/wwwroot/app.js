const state = {
  health: null,
  projects: [],
  activeProjectId: localStorage.getItem("tracewright.activeProject") || null,
  envelope: null,
  currentView: "brief",
  evidenceFilter: "All",
  statusPoll: null
};

const elements = {
  emptyState: document.querySelector("#empty-state"),
  workspace: document.querySelector("#workspace"),
  projectList: document.querySelector("#project-list"),
  projectCount: document.querySelector("#project-count"),
  workspaceTitle: document.querySelector("#workspace-title"),
  workspaceEyebrow: document.querySelector("#workspace-eyebrow"),
  saveStatus: document.querySelector("#save-status"),
  toast: document.querySelector("#toast"),
  briefForm: document.querySelector("#brief-form"),
  uploadForm: document.querySelector("#upload-form"),
  fileInput: document.querySelector("#material-files"),
  selectedFileSummary: document.querySelector("#selected-file-summary"),
  materialList: document.querySelector("#material-list"),
  materialCount: document.querySelector("#material-count"),
  requestDialog: document.querySelector("#request-dialog"),
  requestPreview: document.querySelector("#request-preview"),
  importStatus: document.querySelector("#import-status"),
  appVersion: document.querySelector("#app-version"),
  reviewEmpty: document.querySelector("#review-empty"),
  reviewContent: document.querySelector("#review-content")
};

document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
  bindEvents();
  try {
    const healthRequest = api("/api/health")
      .then(health => {
        state.health = health;
        elements.appVersion.textContent = `v${health.version}`;
        renderConnectorAvailability();
        document.querySelector("#quit-workbench").disabled = false;
      })
      .catch(error => {
        state.health = { codex: { available: false, message: error.message } };
        renderConnectorAvailability();
      });
    const projects = await api("/api/projects");
    state.projects = projects;
    renderProjectList();

    const candidate = state.projects.find(project => project.id === state.activeProjectId) || state.projects[0];
    if (candidate) {
      await selectProject(candidate.id);
    } else {
      showEmptyState();
    }
    await healthRequest;
  } catch (error) {
    showToast(error.message, true);
    elements.saveStatus.textContent = "Workbench unavailable";
  }
}

function bindEvents() {
  document.querySelector("#new-review-button").addEventListener("click", createProject);
  document.querySelector("#empty-new-review-button").addEventListener("click", createProject);
  elements.briefForm.addEventListener("submit", event => {
    event.preventDefault();
    saveBrief();
  });
  elements.uploadForm.addEventListener("submit", uploadMaterials);
  elements.fileInput.addEventListener("change", updateSelectedFiles);

  const dropZone = document.querySelector("#drop-zone");
  ["dragenter", "dragover"].forEach(name => dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach(name => dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  }));
  dropZone.addEventListener("drop", event => {
    if (event.dataTransfer?.files?.length) {
      elements.fileInput.files = event.dataTransfer.files;
      updateSelectedFiles();
    }
  });

  document.querySelectorAll(".workflow-tab").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  document.querySelectorAll(".next-view").forEach(button => {
    button.addEventListener("click", async () => {
      if (state.currentView === "brief") {
        const saved = await saveBrief(true);
        if (!saved) return;
      }
      switchView(button.dataset.next);
    });
  });
  document.querySelectorAll(".review-tab").forEach(button => {
    button.addEventListener("click", () => switchReviewView(button.dataset.reviewView));
  });

  document.querySelector("#preview-request").addEventListener("click", previewRequest);
  document.querySelector("#close-request-dialog").addEventListener("click", () => elements.requestDialog.close());
  document.querySelector("#done-request").addEventListener("click", () => elements.requestDialog.close());
  document.querySelector("#copy-request").addEventListener("click", copyRequest);
  document.querySelector("#download-bundle").addEventListener("click", prepareManualBundle);
  document.querySelector("#import-review").addEventListener("click", importReview);
  document.querySelector("#run-codex").addEventListener("click", runCodex);
  document.querySelector("#quit-workbench").addEventListener("click", quitWorkbench);
}

async function api(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "object" && payload?.error ? payload.error : payload || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload;
}

async function createProject() {
  try {
    setSaveStatus("Creating review...");
    const project = await api("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled review" })
    });
    state.projects.unshift(project);
    renderProjectList();
    await selectProject(project.id);
    switchView("brief");
    document.querySelector("#project-title").select();
    setSaveStatus("Local draft created");
  } catch (error) {
    showToast(error.message, true);
  }
}

async function selectProject(id) {
  clearInterval(state.statusPoll);
  state.statusPoll = null;
  state.activeProjectId = id;
  localStorage.setItem("tracewright.activeProject", id);
  setSaveStatus("Loading...");
  try {
    state.envelope = await api(`/api/projects/${encodeURIComponent(id)}`);
    showWorkspace();
    populateBrief();
    renderMaterials();
    renderBoundary();
    renderReview();
    renderProjectList();
    await refreshRunStatus(false);
    setSaveStatus(`Saved locally · ${formatDate(state.envelope.project.updatedAt)}`);
  } catch (error) {
    showToast(error.message, true);
  }
}

function showEmptyState() {
  elements.emptyState.hidden = false;
  elements.workspace.hidden = true;
  elements.workspaceTitle.textContent = "Narrative review, with the reasoning left visible.";
  elements.workspaceEyebrow.textContent = "WORKBENCH";
}

function showWorkspace() {
  elements.emptyState.hidden = true;
  elements.workspace.hidden = false;
  const project = state.envelope.project;
  elements.workspaceTitle.textContent = project.title;
  elements.workspaceEyebrow.textContent = project.primaryMode.toUpperCase();
  document.querySelector("#download-bundle").href = `/api/projects/${encodeURIComponent(project.id)}/bundle`;
}

function renderProjectList() {
  elements.projectCount.textContent = state.projects.length;
  if (!state.projects.length) {
    elements.projectList.innerHTML = '<div class="material-empty">No review files yet</div>';
    return;
  }
  elements.projectList.innerHTML = state.projects.map(project => `
    <button class="project-item ${project.id === state.activeProjectId ? "active" : ""}" type="button" data-project-id="${escapeHtml(project.id)}">
      <strong>${escapeHtml(project.title)}</strong>
      <span>${escapeHtml(project.primaryMode)} · ${formatDate(project.updatedAt)}</span>
    </button>
  `).join("");
  elements.projectList.querySelectorAll("[data-project-id]").forEach(button => {
    button.addEventListener("click", () => selectProject(button.dataset.projectId));
  });
}

function populateBrief() {
  const project = state.envelope.project;
  document.querySelector("#project-title").value = project.title || "";
  document.querySelector("#primary-mode").value = project.primaryMode || "Claim and Fact Consistency";
  document.querySelector("#secondary-mode").value = project.secondaryMode || "";
  document.querySelector("#review-question").value = project.reviewQuestion || "";
  document.querySelector("#known-provenance").value = project.knownProvenance || "";
  document.querySelector("#reviewer-intuition").value = project.reviewerIntuition || "";
  document.querySelector("#must-not-conclude").value = (project.mustNotConclude || []).join("\n");
  document.querySelector("#privacy-confirmed").checked = Boolean(project.privacyConfirmed);
  document.querySelectorAll("#high-impact-contexts input").forEach(input => {
    input.checked = (project.highImpactContexts || []).includes(input.value);
  });
}

function collectBrief() {
  return {
    title: document.querySelector("#project-title").value,
    primaryMode: document.querySelector("#primary-mode").value,
    secondaryMode: document.querySelector("#secondary-mode").value,
    reviewQuestion: document.querySelector("#review-question").value,
    knownProvenance: document.querySelector("#known-provenance").value,
    reviewerIntuition: document.querySelector("#reviewer-intuition").value,
    mustNotConclude: document.querySelector("#must-not-conclude").value.split(/\r?\n/).map(value => value.trim()).filter(Boolean),
    highImpactContexts: [...document.querySelectorAll("#high-impact-contexts input:checked")].map(input => input.value),
    privacyConfirmed: document.querySelector("#privacy-confirmed").checked,
    preferredConnector: state.envelope.project.preferredConnector || "manual"
  };
}

async function saveBrief(silent = false) {
  if (!state.envelope) return false;
  const payload = collectBrief();
  if (!payload.title.trim() || !payload.reviewQuestion.trim()) {
    showToast("Add a review title and review question before continuing.", true);
    switchView("brief");
    return false;
  }

  try {
    setSaveStatus("Saving locally...");
    const project = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/intake`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    state.envelope.project = project;
    updateProjectCache(project);
    showWorkspace();
    renderProjectList();
    renderBoundary();
    setSaveStatus(`Saved locally · ${formatDate(project.updatedAt)}`);
    if (!silent) showToast("Review brief saved locally.");
    return true;
  } catch (error) {
    showToast(error.message, true);
    return false;
  }
}

function switchView(view) {
  state.currentView = view;
  document.querySelectorAll(".workflow-tab").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.toggle("active", panel.dataset.panel === view));
  if (view === "connection") refreshRunStatus(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateSelectedFiles() {
  const files = [...elements.fileInput.files];
  elements.selectedFileSummary.textContent = files.length
    ? `${files.length} selected · ${formatBytes(files.reduce((total, file) => total + file.size, 0))}`
    : "No files selected";
}

async function uploadMaterials(event) {
  event.preventDefault();
  if (!state.envelope || !elements.fileInput.files.length) {
    showToast("Choose at least one review material.", true);
    return;
  }

  const data = new FormData();
  [...elements.fileInput.files].forEach(file => data.append("files", file));
  data.append("role", document.querySelector("#material-role").value);
  data.append("authorRole", document.querySelector("#author-role").value);
  data.append("sourceDate", document.querySelector("#source-date").value);
  data.append("contextStatus", document.querySelector("#context-status").value);

  try {
    setSaveStatus("Adding materials...");
    const project = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/materials`, { method: "POST", body: data });
    state.envelope.project = project;
    updateProjectCache(project);
    elements.fileInput.value = "";
    updateSelectedFiles();
    renderMaterials();
    renderBoundary();
    renderProjectList();
    setSaveStatus(`Saved locally · ${formatDate(project.updatedAt)}`);
    showToast("Materials added with stable source IDs.");
  } catch (error) {
    showToast(error.message, true);
  }
}

function renderMaterials() {
  if (!state.envelope) return;
  const materials = state.envelope.project.materials || [];
  elements.materialCount.textContent = `${materials.length} ${materials.length === 1 ? "file" : "files"}`;
  if (!materials.length) {
    elements.materialList.innerHTML = '<div class="material-empty"><strong>No materials yet.</strong><br>Add the smallest useful set first.</div>';
    return;
  }

  elements.materialList.innerHTML = materials.map(material => `
    <article class="material-row ${material.contextStatus === "Context only" ? "context-only" : ""}">
      <span class="source-id">${escapeHtml(material.sourceId)}</span>
      <div>
        <div class="material-name">${escapeHtml(material.originalName)}</div>
        <div class="material-meta">
          <span>${escapeHtml(material.role)}</span>
          <span>${escapeHtml(material.authorRole)}</span>
          <span>${escapeHtml(material.sourceDate || "Date unknown")}</span>
          <span>${escapeHtml(material.contextStatus)}</span>
          <span>${formatBytes(material.size)}</span>
        </div>
      </div>
      <button class="text-button" type="button" data-remove-source="${escapeHtml(material.sourceId)}">Remove</button>
    </article>
  `).join("");
  elements.materialList.querySelectorAll("[data-remove-source]").forEach(button => {
    button.addEventListener("click", () => removeMaterial(button.dataset.removeSource));
  });
}

async function removeMaterial(sourceId) {
  if (!confirm(`Remove ${sourceId} from this local review?`)) return;
  try {
    const project = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/materials/${encodeURIComponent(sourceId)}`, { method: "DELETE" });
    state.envelope.project = project;
    updateProjectCache(project);
    renderMaterials();
    renderBoundary();
    showToast(`${sourceId} removed.`);
  } catch (error) {
    showToast(error.message, true);
  }
}

function renderBoundary() {
  if (!state.envelope) return;
  const project = state.envelope.project;
  const count = project.materials?.length || 0;
  document.querySelector("#boundary-file-count").textContent = `${count} ${count === 1 ? "file" : "files"}`;
  document.querySelector("#boundary-route").textContent = project.preferredConnector === "codex" ? "Codex CLI" : "Manual AI Bridge";
  document.querySelector("#boundary-provider").textContent = project.preferredConnector === "codex"
    ? "Your signed-in Codex service"
    : "Only after you upload them";
}

function renderConnectorAvailability() {
  const availability = state.health?.codex;
  if (!availability) return;
  const badge = document.querySelector("#codex-badge");
  const detail = document.querySelector("#codex-availability");
  const button = document.querySelector("#run-codex");
  badge.textContent = availability.available ? "Available" : "Unavailable";
  badge.className = `badge ${availability.available ? "ready" : "unavailable"}`;
  detail.textContent = availability.available
    ? (availability.version ? `${availability.message} ${availability.version}` : availability.message)
    : "Codex could not be started from this local process. Use Manual AI Bridge, or install/sign in to Codex before retrying.";
  button.disabled = !availability.available;
}

async function prepareManualBundle(event) {
  event.preventDefault();
  if (!state.envelope) return;
  state.envelope.project.preferredConnector = "manual";
  const saved = await saveBrief(true);
  if (!saved || !state.envelope.project.privacyConfirmed) {
    showToast("Confirm the document boundary in Review Brief before preparing an AI bundle.", true);
    switchView("brief");
    return;
  }
  if (!state.envelope.project.materials.length) {
    showToast("Add at least one material before creating a bundle.", true);
    switchView("materials");
    return;
  }
  renderBoundary();
  window.location.assign(`/api/projects/${encodeURIComponent(state.activeProjectId)}/bundle`);
}

async function previewRequest() {
  if (!state.envelope) return;
  const saved = await saveBrief(true);
  if (!saved) return;
  try {
    elements.requestPreview.textContent = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/review-request`);
    elements.requestDialog.showModal();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function copyRequest() {
  try {
    await navigator.clipboard.writeText(elements.requestPreview.textContent);
    showToast("Review request copied.");
  } catch {
    showToast("The browser could not copy the request. Select the text manually.", true);
  }
}

async function importReview() {
  const input = document.querySelector("#review-result-file");
  if (!input.files.length) {
    setImportStatus("Choose the JSON review result returned by your AI.", "error");
    showToast("Choose the JSON review result returned by your AI.", true);
    return;
  }
  const data = new FormData();
  data.append("file", input.files[0]);
  let review;
  try {
    setSaveStatus("Importing review map...");
    setImportStatus("Checking the JSON structure and saving it locally...");
    review = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/review-import`, { method: "POST", body: data });
  } catch (error) {
    setSaveStatus("Import needs attention");
    setImportStatus(`Import failed: ${error.message}`, "error");
    showToast(error.message, true);
    return;
  }

  state.envelope.review = review;
  input.value = "";
  try {
    renderReview();
    switchView("review");
    setSaveStatus("Structured review imported");
    setImportStatus(`Imported successfully: ${arrayOf(review.claims).length} claims, ${arrayOf(review.evidence).length} evidence cards, and ${arrayOf(review.follow_up).length} follow-up actions.`, "success");
    showToast("Review map imported. Start with Summary, then inspect Evidence.");
  } catch (error) {
    setSaveStatus("Review saved; display needs attention");
    setImportStatus(`The JSON was saved, but the dashboard could not display it: ${error.message}`, "error");
    showToast("The result was saved, but the dashboard could not display it.", true);
  }
}

function setImportStatus(message, state = "neutral") {
  elements.importStatus.textContent = message;
  elements.importStatus.dataset.state = state;
}

async function runCodex() {
  if (!state.envelope) return;
  state.envelope.project.preferredConnector = "codex";
  const saved = await saveBrief(true);
  if (!saved) return;
  renderBoundary();
  try {
    const response = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/run/codex`, { method: "POST" });
    showToast(response.message);
    await refreshRunStatus(true);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function quitWorkbench() {
  if (!state.health?.sessionToken) {
    showToast("The local session is still starting. Try again in a moment.", true);
    return;
  }
  if (!confirm("Close Tracewright Workbench? Your saved reviews will remain on this computer.")) return;

  try {
    await api("/api/shutdown", {
      method: "POST",
      headers: { "X-Tracewright-Session": state.health.sessionToken }
    });
    document.querySelector(".app-shell").outerHTML = `
      <main class="closed-screen">
        <section class="closed-message">
          <span class="section-label">WORKBENCH CLOSED</span>
          <h1>Your local reviews are saved.</h1>
          <p>You can close this browser tab. Double-click Tracewright Workbench.exe whenever you want to return.</p>
        </section>
      </main>`;
  } catch (error) {
    showToast(error.message, true);
  }
}

async function refreshRunStatus(startPolling) {
  if (!state.activeProjectId) return;
  try {
    const status = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}/run-status`);
    const runStatus = document.querySelector("#run-status");
    runStatus.textContent = status.message;
    runStatus.dataset.state = status.state;
    const badge = document.querySelector("#codex-badge");
    if (["queued", "running"].includes(status.state)) {
      badge.textContent = "Running";
      badge.className = "badge running";
      document.querySelector("#run-codex").disabled = true;
    } else {
      renderConnectorAvailability();
    }

    if (status.state === "completed") {
      clearInterval(state.statusPoll);
      state.statusPoll = null;
      state.envelope = await api(`/api/projects/${encodeURIComponent(state.activeProjectId)}`);
      renderReview();
      renderProjectList();
      switchView("review");
      showToast("Codex review map is ready.");
    } else if (status.state === "failed") {
      clearInterval(state.statusPoll);
      state.statusPoll = null;
      showToast(status.message, true);
    } else if (startPolling && !state.statusPoll) {
      state.statusPoll = setInterval(() => refreshRunStatus(false), 2200);
    }
  } catch (error) {
    if (startPolling) showToast(error.message, true);
  }
}

function renderReview() {
  const review = state.envelope?.review;
  const hasReview = Boolean(review);
  elements.reviewEmpty.hidden = hasReview;
  elements.reviewContent.hidden = !hasReview;
  document.querySelector("#review-generated-status").textContent = hasReview
    ? "Structured result available · verify every important card against its source."
    : "No structured result yet.";
  if (!hasReview) return;

  const claims = arrayOf(review.claims);
  const evidence = arrayOf(review.evidence);
  const sources = arrayOf(review.sources);
  const followUp = arrayOf(review.follow_up);
  document.querySelector("#claim-count").textContent = claims.length;
  document.querySelector("#evidence-count").textContent = evidence.length;
  document.querySelector("#source-count").textContent = sources.length;
  document.querySelector("#follow-up-count").textContent = followUp.length;
  renderSummary(review);
  renderClaims(claims);
  renderEvidence(evidence);
  renderSources(sources);
  renderFollowUp(followUp);
}

function renderSummary(review) {
  const setup = review.review_setup || {};
  const orientation = review.orientation || {};
  const limitations = arrayOf(review.limitations);
  const evidence = arrayOf(review.evidence);
  const laneCounts = countBy(evidence, item => item.lane || "Unclassified");
  const textureCounts = countBy(evidence, item => item.texture_axis || "not_applicable");
  const projectIntuition = state.envelope.project.reviewerIntuition;
  const highImpact = Boolean(setup.qualified_human_review_required);

  document.querySelector("#summary-panel").innerHTML = `
    <div class="summary-band">
      <div class="summary-main">
        <span class="section-label">INTERPRETATION GUIDE</span>
        <h3>${escapeHtml(orientation.posture || "Review posture not supplied")}</h3>
        <p>${escapeHtml(orientation.overview || "No overview supplied.")}</p>
      </div>
      <aside class="summary-aside">
        <div class="summary-stat"><span>Evidence completeness</span><strong>${escapeHtml(orientation.evidence_completeness || "Not assessed")}</strong></div>
        <div class="summary-stat"><span>Overclaim risk</span><strong>${escapeHtml(orientation.overclaim_risk || "Not assessed")}</strong></div>
        <div class="summary-stat"><span>Human review</span><strong>${highImpact ? "Qualified review required" : "Reviewer remains responsible"}</strong></div>
      </aside>
    </div>
    <div class="review-grid">
      ${highImpact ? `<article class="review-card high-impact"><h3>High-impact boundary</h3><p>This map may inform a consequential decision, but it must not make that decision. A qualified human reviewer must verify the sources, methods, and relevant domain rules.</p></article>` : ""}
      <article class="review-card">
        <h3>Reader intuition</h3>
        <p>${escapeHtml(projectIntuition || "No reader intuition was supplied. The map starts from the bounded review question instead.")}</p>
      </article>
      <article class="review-card">
        <h3>Analysis overview</h3>
        <p>${escapeHtml(orientation.overview || "No overview supplied.")}</p>
      </article>
      <article class="review-card">
        <h3>Review lanes</h3>
        <p>These counts show what kind of question the evidence cards answer.</p>
        ${renderCountList(laneCounts, humanize)}
      </article>
      <article class="review-card">
        <h3>Texture axes</h3>
        <p>Source texture and mediation polish are observations about the text, not human/AI scores.</p>
        ${renderCountList(textureCounts, value => value === "source_texture" ? "Source-grounded texture" : value === "mediation_polish" ? "Mediation / polish cues" : "Not applicable")}
      </article>
      <article class="review-card limitations">
        <h3>Limitations</h3>
        ${renderList(limitations, "No limitations were supplied. Treat that absence as something to review.")}
      </article>
      <article class="review-card">
        <h3>Must not conclude</h3>
        ${renderList(arrayOf(setup.must_not_conclude), "No explicit boundary was returned.")}
      </article>
    </div>
  `;
}

function renderClaims(claims) {
  const panel = document.querySelector("#claims-panel");
  if (!claims.length) {
    panel.innerHTML = '<div class="review-empty"><h3>No claims extracted.</h3><p>Check whether the material was readable and whether the review question asked for claim analysis.</p></div>';
    return;
  }
  panel.innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Claim</th><th>Type</th><th>Sources</th><th>Support</th><th>Gap / contradiction</th><th>Next check</th></tr></thead>
      <tbody>${claims.map(claim => `
        <tr>
          <td><strong>${escapeHtml(claim.claim_id || "")}</strong><br>${escapeHtml(claim.claim || "")}</td>
          <td>${escapeHtml(claim.type || "")}</td>
          <td>${escapeHtml(arrayOf(claim.source_ids).join(", "))}</td>
          <td><span class="posture ${slug(claim.review_posture)}">${escapeHtml(claim.support_status || claim.review_posture || "")}</span></td>
          <td>${escapeHtml(claim.contradiction_or_gap || "")}</td>
          <td>${escapeHtml(claim.next_check || "")}</td>
        </tr>
      `).join("")}</tbody>
    </table></div>`;
}

function renderEvidence(evidence) {
  const panel = document.querySelector("#evidence-panel");
  const lanes = ["All", ...new Set(evidence.map(item => item.lane).filter(Boolean))];
  const filtered = state.evidenceFilter === "All" ? evidence : evidence.filter(item => item.lane === state.evidenceFilter);
  panel.innerHTML = `
    <div class="evidence-toolbar">
      ${lanes.map(lane => `<button class="filter-button ${lane === state.evidenceFilter ? "active" : ""}" type="button" data-evidence-filter="${escapeHtml(lane)}">${escapeHtml(lane)} (${lane === "All" ? evidence.length : evidence.filter(item => item.lane === lane).length})</button>`).join("")}
    </div>
    <div class="evidence-list">
      ${filtered.length ? filtered.map(renderEvidenceCard).join("") : '<div class="review-empty"><h3>No evidence cards in this lane.</h3></div>'}
    </div>`;
  panel.querySelectorAll("[data-evidence-filter]").forEach(button => {
    button.addEventListener("click", () => {
      state.evidenceFilter = button.dataset.evidenceFilter;
      renderEvidence(evidence);
    });
  });
}

function renderEvidenceCard(item) {
  const marked = arrayOf(item.marked_text);
  return `
    <details class="evidence-card">
      <summary>
        <div>
          <div class="evidence-kicker"><span>${escapeHtml(item.lane || "Unclassified")}</span><span>${escapeHtml(item.source_id || "No source")}</span><span>${escapeHtml(humanize(item.texture_axis || "not_applicable"))}</span></div>
          <h3>${escapeHtml(item.title || "Untitled evidence")}</h3>
        </div>
        <span class="posture ${slug(item.attention)}">${escapeHtml(item.attention || "Observe")}</span>
      </summary>
      <div class="evidence-body">
        <blockquote class="source-excerpt">${escapeHtml(item.source_excerpt || "No excerpt supplied.")}</blockquote>
        ${marked.length ? `<ul class="marked-list">${marked.map(mark => `<li><code>${escapeHtml(mark.text || "")}</code> <strong>${escapeHtml(mark.label || "")}</strong><br>${escapeHtml(mark.reason || "")}</li>`).join("")}</ul>` : ""}
        <div class="evidence-columns">
          <div class="evidence-block"><h4>Observation</h4><p>${escapeHtml(item.observation || "")}</p></div>
          <div class="evidence-block"><h4>Reasoning chain</h4>${renderList(arrayOf(item.reasoning_chain), "No reasoning chain supplied.")}</div>
          <div class="evidence-block"><h4>Alternative explanations</h4>${renderList(arrayOf(item.alternative_explanations), "No alternatives supplied.")}</div>
          <div class="evidence-block next-action"><h4>Next human action</h4><p>${escapeHtml(item.next_action || "No next action supplied.")}</p></div>
        </div>
      </div>
    </details>`;
}

function renderSources(sources) {
  const panel = document.querySelector("#sources-panel");
  if (!sources.length) {
    panel.innerHTML = '<div class="review-empty"><h3>No source inventory returned.</h3></div>';
    return;
  }
  panel.innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Role</th><th>Date</th><th>Author / source role</th><th>Status</th><th>Summary</th><th>Limitations</th></tr></thead>
      <tbody>${sources.map(source => `
        <tr class="${source.target_status === "Context only" ? "context-row" : ""}">
          <td><strong>${escapeHtml(source.source_id || "")}</strong></td>
          <td>${escapeHtml(source.role || "")}</td>
          <td>${escapeHtml(source.date || "")}</td>
          <td>${escapeHtml(source.author_role || "")}</td>
          <td>${escapeHtml(source.target_status || "")}</td>
          <td>${escapeHtml(source.summary || "")}<br><small>${escapeHtml(source.known_provenance || "")}</small></td>
          <td>${escapeHtml(source.limitations || "")}</td>
        </tr>
      `).join("")}</tbody>
    </table></div>`;
}

function renderFollowUp(items) {
  const panel = document.querySelector("#follow-up-panel");
  if (!items.length) {
    panel.innerHTML = '<div class="review-empty"><h3>No follow-up actions returned.</h3><p>A useful map should usually leave at least one next check.</p></div>';
    return;
  }
  const rank = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...items].sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9));
  panel.innerHTML = `<div class="follow-up-list">${sorted.map(item => `
    <article class="follow-up-item">
      <span class="posture ${slug(item.priority)}">${escapeHtml(item.priority || "")}</span>
      <div><strong>${escapeHtml(item.kind || "Next check")}</strong><p>${escapeHtml(item.question_or_action || "")}</p></div>
      <span class="source-id">${escapeHtml(arrayOf(item.source_ids).join(", "))}</span>
    </article>
  `).join("")}</div>`;
}

function switchReviewView(view) {
  document.querySelectorAll(".review-tab").forEach(button => button.classList.toggle("active", button.dataset.reviewView === view));
  document.querySelectorAll(".review-section").forEach(panel => panel.classList.toggle("active", panel.dataset.reviewPanel === view));
}

function updateProjectCache(project) {
  const index = state.projects.findIndex(item => item.id === project.id);
  if (index >= 0) state.projects[index] = project;
  else state.projects.unshift(project);
  state.projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function renderCountList(counts, labeler) {
  const entries = Object.entries(counts);
  if (!entries.length) return "<p>No evidence cards returned.</p>";
  return `<ul>${entries.map(([key, count]) => `<li><strong>${count}</strong> ${escapeHtml(labeler(key))}</li>`).join("")}</ul>`;
}

function renderList(items, emptyText) {
  return items.length ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p>${escapeHtml(emptyText)}</p>`;
}

function countBy(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function setSaveStatus(message) {
  elements.saveStatus.textContent = message;
}

let toastTimer;
function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.className = `toast${isError ? " error" : ""}`;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, 4800);
}

function formatDate(value) {
  if (!value) return "now";
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 1024) return `${bytes || 0} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 1; value >= 1024 && index < units.length; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`;
}

function humanize(value) {
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function slug(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
