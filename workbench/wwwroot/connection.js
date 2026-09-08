'use strict';

const TwTransfer = (() => {
  let plan = null, mode = 'codex', textSource = '', busy = false, dialogProject = '';
  const get = id => document.getElementById(id);
  const json = value => ({headers:{'Content-Type':'application/json'}, body:JSON.stringify(value)});
  const path = suffix => '/api/projects/'+encodeURIComponent(state.activeProjectId)+'/'+suffix;
  const oldMaterials = renderMaterials;
  renderMaterials = function() {
    oldMaterials();
    for (const m of state.envelope?.project.materials || []) {
      const row = document.createElement('div'); row.className='text-preparation';
      const label = document.createElement('span'); label.textContent=m.sourceId+' / '+(m.textStatus==='reviewed'?'Review text confirmed':'Review text needed');
      const button=document.createElement('button'); button.className='secondary'; button.type='button'; button.textContent='Inspect / prepare text';
      button.addEventListener('click',()=>editText(m.sourceId)); row.append(label,button); elements.materialList.append(row);
    }
  };
  const oldReview = renderReview;
  renderReview = function() {
    oldReview();
    const review = state.envelope?.review;
    if (!review) return;
    const f=review.workflow_review;
    const sourceButtons = ids => arrayOf(ids).map(id=>'<button type="button" class="source-link" data-inspect-source="'+escapeHtml(id)+'">'+escapeHtml(id)+'</button>').join(' ');
    get('workflow-panel').innerHTML = f ? '<h3>Workflow and control review</h3><p>'+escapeHtml(f.overview)+'</p><p class="connection-note">Steps describe the supplied account or records, not verified operation. Missing evidence is not proof of control failure.</p><ol class="live-flow">'+arrayOf(f.steps).map(s=>'<li id="step-'+escapeHtml(s.id)+'"><small>'+escapeHtml(s.actor)+' / accountable: '+escapeHtml(s.owner)+'</small><h4>'+escapeHtml(s.id+' / '+s.title)+'</h4><p>'+escapeHtml(s.description)+'</p>'+sourceButtons(s.source_ids)+'</li>').join('')+'</ol><details><summary>Conditional transitions ('+arrayOf(f.transitions).length+')</summary>'+arrayOf(f.transitions).map(e=>'<p><strong>'+escapeHtml(e.from+' → '+e.to)+'</strong> / '+escapeHtml(e.condition)+'<br>'+escapeHtml(e.basis)+' '+sourceButtons(e.source_ids)+'</p>').join('')+'</details><h3>Controls and next checks</h3>'+arrayOf(f.controls).map(c=>'<article class="control-observation"><span class="badge '+(c.state==='documented_mismatch'?'later':'')+'">'+escapeHtml(humanize(c.state))+'</span><h4>'+escapeHtml(c.title)+'</h4><p>'+escapeHtml(c.observation)+'</p>'+sourceButtons(c.source_ids)+'<details><summary>Alternatives and next check</summary>'+renderList(arrayOf(c.alternatives),'Not supplied')+'<p>'+escapeHtml(c.next_check)+'</p></details></article>').join('')+'<h3>Unresolved information</h3>'+renderList(arrayOf(f.unknowns),'No additional unknowns were returned; this is not assurance of completeness.') : '<p>This earlier result has no workflow section. It remains available unchanged; run a new review to assess a workflow.</p>';
    const box=document.createElement('section'); box.className='source-check-band';
    box.innerHTML='<h3>Approved text and original materials</h3><p>Check each passage against its source. Text may be an excerpt or an extraction; file formatting, images, footnotes and unselected passages may be absent.</p>'+sourceButtons(arrayOf(review.sources).map(s=>s.source_id));
    get('summary-panel').append(box);
  };
  async function editText(id) {
    textSource=id; dialogProject=state.activeProjectId;
    try {
      const result=await api(path('text/'+encodeURIComponent(id)));
      get('review-text-value').value=result.text;
      get('review-text-title').textContent='Review text / '+id;
      get('review-text-status').textContent=result.text?'Confirm wording, omissions and source roles against the original.':'This format has no automatic text preparation. Paste a bounded transcription/excerpt verified against your original.';
      get('review-text-dialog').showModal();
    } catch(e) {
      get('review-text-value').value='';
      get('review-text-title').textContent='Review text / '+id;
      get('review-text-status').textContent='Automatic preparation unavailable: '+e.message+' Paste a bounded transcription or excerpt checked against the original.';
      get('review-text-dialog').showModal();
    }
  }
  async function begin(route) {
    if (!state.envelope || busy) return;
    mode=route; plan=null;
    if (!(await saveBrief(true))) return;
    dialogProject=state.activeProjectId;
    get('transfer-source-list').innerHTML=state.envelope.project.materials.map(m=>'<label><input type="checkbox" name="transfer-source" value="'+escapeHtml(m.sourceId)+'" '+(m.textStatus==='reviewed'?'checked':'disabled')+'> '+escapeHtml(m.sourceId+' / '+m.originalName)+' <small>'+escapeHtml(m.contextStatus)+' / '+(m.textStatus==='reviewed'?'confirmed text':'prepare text in Materials first')+'</small></label>').join('');
    get('transfer-destination').value='';
    get('transfer-preview').textContent='Prepare a preview to see the exact text payload.';
    reset(); get('transfer-status').textContent='Nothing sent.'; get('transfer-confirm').textContent=route==='codex'?'Send approved text to Codex':'Download approved text bundle';
    get('transfer-dialog').showModal();
  }
  function reset() { plan=null; for(const id of ['terms-check','authority-check','content-check']) get(id).checked=false; gate(); }
  function gate() { get('transfer-confirm').disabled=busy || !plan || !get('transfer-destination').value.trim() || !['terms-check','authority-check','content-check'].every(id=>get(id).checked); }
  async function preview() {
    reset();
    try {
      plan=await api(path('prepare'),{method:'POST',...json({sourceIds:[...document.querySelectorAll('input[name="transfer-source"]:checked')].map(i=>i.value)})});
      get('transfer-preview').textContent=plan.prompt;
      get('transfer-status').textContent='Preview prepared / '+plan.prompt.length+' characters / expires in 20 minutes. Nothing sent.';
      gate();
    } catch(e) { get('transfer-status').textContent=e.message; }
  }
  async function send() {
    if (get('transfer-confirm').disabled || dialogProject!==state.activeProjectId) return;
    const approval={planId:plan.id,fingerprint:plan.fingerprint,dataTermsChecked:get('terms-check').checked,authorityConfirmed:get('authority-check').checked,contentConfirmed:get('content-check').checked,environmentLabel:get('transfer-destination').value.trim()};
    busy=true; gate();
    try {
      if(mode==='codex') {
        const result=await api(path('run/codex'),{method:'POST',...json(approval)});
        get('transfer-dialog').close(); showToast(result.message); await refreshRunStatus(true);
      } else {
        const res=await fetch(path('bundle'),{method:'POST',...json(approval),headers:{'Content-Type':'application/json','X-Tracewright-Session':state.health.sessionToken}});
        if(!res.ok) { const error=await res.json(); throw new Error(error.error || 'Bundle download failed'); }
        download(await res.blob(),'tracewright-approved-text.zip'); get('transfer-dialog').close(); showToast('Approved text bundle downloaded. No data sent to AI by Tracewright.');
      }
      reset();
    } catch(e) { reset(); get('transfer-status').textContent=e.message+' Prepare a fresh preview before retrying.'; }
    finally { busy=false; gate(); }
  }
  function download(blob,name) { const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000); }
  function mount() {
    const group=document.createElement('div');
    group.innerHTML='<dialog id="review-text-dialog"><h2 id="review-text-title">Review text</h2><p id="review-text-status"></p><p>Only this text is eligible for AI transfer. DOCX/ODT extraction uses body paragraphs only; verify tables, notes and omissions. Originals remain local. Saving edits invalidates previous send previews.</p><textarea id="review-text-value" rows="18" maxlength="180000" aria-label="Review text"></textarea><div class="dialog-actions"><button type="button" id="review-text-close" class="secondary">Close</button><button type="button" id="review-text-save" class="primary">Confirm and save review text</button></div></dialog>'+ 
      '<dialog id="transfer-dialog"><h2>Confirm the data boundary</h2><p>Selected review text and the brief will be sent to your chosen AI. Original files, unrelated local cases and browser drafts are not included. TW cannot inspect or guarantee your provider contract, retention, training use, organisation controls or account identity.</p><p><a href="https://developers.openai.com/codex/auth" target="_blank" rel="noreferrer">Codex authentication</a> / <a href="https://help.openai.com/en/articles/7730893-data-controls-faq" target="_blank" rel="noreferrer">Data controls</a></p><fieldset id="transfer-source-list"><legend>Sources</legend></fieldset><button class="secondary" type="button" id="transfer-prepare">Prepare exact payload</button><details><summary>Exact payload to be shared</summary><pre id="transfer-preview"></pre></details><label>Account / workspace you have checked (no secrets)<input id="transfer-destination" maxlength="300" placeholder="For example: my personal ChatGPT workspace"></label><label class="boundary-check"><input type="checkbox" id="terms-check"> I checked data retention, training use, organisational rules, and the account/workspace in my own Codex or chosen AI. TW has not verified these terms.</label><label class="boundary-check"><input type="checkbox" id="authority-check"> I am authorised to send this content and removed unnecessary identifiers or restricted information.</label><label class="boundary-check"><input type="checkbox" id="content-check"> I checked the exact payload, roles, omissions and destination. I understand that cancellation cannot retract content already sent.</label><p id="transfer-status" role="status"></p><div class="dialog-actions"><button type="button" id="transfer-close" class="secondary">Cancel</button><button type="button" id="transfer-confirm" class="primary" disabled>Send approved text</button></div></dialog>';
    document.body.append(group);
    get('review-text-close').onclick=()=>get('review-text-dialog').close();
    get('review-text-save').onclick=async()=>{
      if(dialogProject!==state.activeProjectId) return;
      try { state.envelope.project=await api(path('text/'+encodeURIComponent(textSource)),{method:'PUT',...json({text:get('review-text-value').value})});populateBrief();renderMaterials();get('review-text-dialog').close();showToast('Confirmed review text saved locally.'); } catch(e) { get('review-text-status').textContent=e.message; }
    };
    get('transfer-source-list').onchange=reset;
    get('transfer-prepare').onclick=preview; get('transfer-confirm').onclick=send; get('transfer-close').onclick=()=>{if(!busy)get('transfer-dialog').close();};
    get('transfer-dialog').addEventListener('cancel',e=>{if(busy)e.preventDefault();});
    for(const id of ['terms-check','authority-check','content-check','transfer-destination']) get(id).addEventListener('input',gate);
    get('transfer-destination').addEventListener('input',()=>{for(const id of ['terms-check','authority-check','content-check']) get(id).checked=false;gate();});
    const recheck=document.createElement('button');recheck.textContent='Recheck Codex';recheck.type='button';recheck.className='secondary';recheck.onclick=async()=>{try{state.health.codex=await api('/api/codex/check');renderConnectorAvailability();}catch(e){showToast(e.message,true);}};
    get('run-codex').parentElement.append(recheck);
    const cancel=document.createElement('button');cancel.textContent='Stop analysis';cancel.type='button';cancel.className='secondary';cancel.onclick=async()=>{try{const r=await api(path('cancel'),{method:'POST'});showToast(r.cancelled?'Stop requested; previously sent content cannot be retracted.':'No active run.');}catch(e){showToast(e.message,true);}};
    get('run-codex').parentElement.append(cancel);
    const history=document.createElement('button');history.textContent='Run history';history.type='button';history.className='secondary';
    const historyBox=document.createElement('section');historyBox.className='run-history';historyBox.setAttribute('aria-live','polite');
    history.onclick=async()=>{try{const rows=await api(path('runs'));historyBox.replaceChildren();for(const r of rows){const row=document.createElement('div');let s;try{s=JSON.parse(r.status);}catch{s={Message:'Status unavailable; record kept.'};}const label=document.createElement('p');label.textContent=r.date+' / '+(s.State||'unknown')+' / '+(s.Message||'');row.append(label);if(r.candidateAvailable){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent='Download candidate JSON (not approval)';b.onclick=async()=>{try{const res=await fetch(path('runs/'+r.id+'/candidate'),{headers:{'X-Tracewright-Session':state.health.sessionToken}});if(!res.ok)throw Error('Candidate unavailable');download(await res.blob(),'candidate-'+r.id+'.json');}catch(e){showToast(e.message,true);}};row.append(b);}historyBox.append(row);}if(!rows.length)historyBox.textContent='No Codex runs recorded for this review.';}catch(e){historyBox.textContent=e.message;}};
    get('run-codex').parentElement.append(history);get('run-status').parentElement.append(historyBox);
    document.addEventListener('click',e=>{const b=e.target.closest('[data-inspect-source]');if(b)editText(b.dataset.inspectSource);});
    const hash=new URLSearchParams(location.hash.slice(1));
    if(hash.get('project')) { state.activeProjectId=hash.get('project'); }
  }
  document.addEventListener('DOMContentLoaded',mount);
  return {begin};
})();
runCodex = () => TwTransfer.begin('codex');
prepareManualBundle = event => { event.preventDefault(); return TwTransfer.begin('manual'); };
