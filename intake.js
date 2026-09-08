(function(root) {
  'use strict';
  const M=typeof module==='object' && module.exports ? require('./demo/intake-model.js') : root.TracewrightIntakeModel;
  const titles=['Purpose and scope','Materials and flow','Intervention and safeguards','Review inputs and gaps'];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const optionList=(options,value)=>Object.entries(options).map(([k,label])=>'<option value="'+esc(k)+'"'+(value===k?' selected':'')+'>'+esc(label)+'</option>').join('');
  function field(group,key,label,value,options={}) {
    const id='f-'+group.replace(':','-')+'-'+key;
    const attrs=' id="'+esc(id)+'" data-group="'+esc(group)+'" data-field="'+esc(key)+'"';
    const control=options.options?'<select'+attrs+'>'+optionList(options.options,value)+'</select>':options.rows?'<textarea'+attrs+' rows="'+options.rows+'" maxlength="12000" placeholder="'+esc(options.placeholder||'')+'">'+esc(value)+'</textarea>':'<input'+attrs+' type="text" maxlength="'+(key==='destination'?400:12000)+'" value="'+esc(value)+'" placeholder="'+esc(options.placeholder||'')+'">';
    return '<div class="intake-field'+(options.wide?' row-wide':'')+'"><label for="'+esc(id)+'">'+esc(label)+'</label>'+control+(options.note?'<small>'+esc(options.note)+'</small>':'')+'</div>';
  }
  const heading=(title,description)=>'<h2 class="section-title" tabindex="-1">'+title+'</h2><p class="section-intro">'+description+'</p>';
  function overview(d) {
    return heading('What do you need to review?','Start with what you know. Unanswered and unverified information stays visible in the intake review.')+
      '<fieldset class="mode-selector"><legend>Review type</legend><div class="mode-options">'+[['workflow','Workflow'],['narrative','Documents and related materials']].map(([value,label])=>'<label><input type="radio" name="review-kind" value="'+value+'"'+(d.kind===value?' checked':'')+'>'+label+'</label>').join('')+'</div></fieldset>'+
      field('scope','title','Case title',d.scope.title,{placeholder:'Example: first-line multilingual customer support'})+
      field('scope','question','What do you want to check, and which decision will it inform?',d.scope.question,{rows:3,placeholder:'Example: check whether a human handoff leads to the response the customer needs.'})+
      field('scope','purpose',d.kind==='workflow'?'What should this workflow achieve?':'Why were these materials created?',d.scope.purpose,{rows:2})+
      field('scope','affected_people','Who could be affected?',d.scope.affected_people,{rows:2,placeholder:'Users, people subject to decisions, staff, families and suppliers. Names are not needed.'})+
      field('scope','unacceptable_outcomes','Which outcomes must be avoided? What could delay or error affect?',d.scope.unacceptable_outcomes,{rows:2})+
      '<details class="intake-details" id="scope-more"><summary><span>Scope, responsibility and initial hypothesis</span><span class="state-note">As far as known</span></summary><div class="details-body"><div class="intake-grid">'+
      field('scope','period','Period and version',d.scope.period)+field('scope','owner','Accountable review role',d.scope.owner)+
      field('scope','stage','Stage of use',d.scope.stage,{options:{unknown:'Unconfirmed',planning:'Planning',pilot:'Pilot',operation:'In operation'}})+'</div>'+
      field('scope','boundaries','What must not be concluded from this review?',d.scope.boundaries,{rows:2})+
      field('scope','intuition','Initial hypothesis or concern (optional)',d.scope.intuition,{rows:2,note:'Kept separate from source-grounded observations.'})+'</div></details>'+
      '<fieldset class="plain-fieldset"><legend>Relevant impact areas</legend><div class="check-options">'+Object.entries(M.impacts).map(([k,label])=>'<label><input type="checkbox" name="impact" value="'+k+'"'+(d.scope.impacts.includes(k)?' checked':'')+'>'+label+'</label>').join('')+'</div><p class="intake-note">No selection means unconfirmed, not no impact. The content has not been independently assessed.</p></fieldset>';
  }
  function steps(d) {
    return '<details class="intake-details" id="structured-flow"><summary><span>Register steps and branches</span><span class="state-note">'+d.workflow.steps.length+' steps / '+d.workflow.transitions.length+' branches</span></summary><div class="details-body"><p class="intake-note">A description is enough to continue. Register structured steps where you already know them.</p>'+
      d.workflow.steps.map(s=>'<article class="intake-row" id="row-'+esc(s.id)+'"><div class="row-heading"><h4><span class="row-id">'+esc(s.id)+'</span> '+esc(s.title||'Untitled step')+'</h4><button type="button" class="text-command" data-remove="step" data-id="'+esc(s.id)+'">Remove step</button></div><div class="row-grid">'+
        field('step:'+s.id,'title','Step title',s.title)+field('step:'+s.id,'actor','Actor',s.actor,{options:M.actors})+field('step:'+s.id,'owner','Role accountable for receipt and response',s.owner)+
        field('step:'+s.id,'input','Input / evidence available',s.input,{rows:2})+field('step:'+s.id,'output','Output / resulting effect',s.output,{rows:2})+field('step:'+s.id,'reversibility','Can the effect be reversed?',s.reversibility,{options:{unknown:'Unconfirmed',yes:'Reported as reversible',no:'Reported as irreversible',conditional:'Reported as conditional'}})+'</div></article>').join('')+
      '<button type="button" class="secondary add-record" data-add="step">Add step</button>'+
      '<h3>Branches, exceptions and timing</h3>'+d.workflow.transitions.map(e=>'<article class="intake-row" id="row-'+esc(e.id)+'"><div class="row-heading"><h4 class="row-id">'+esc(e.id)+'</h4><button type="button" class="text-command" data-remove="transition" data-id="'+esc(e.id)+'">Remove branch</button></div><div class="row-grid">'+
        field('transition:'+e.id,'from','From step',e.from,{options:{'':'Unconfirmed',...Object.fromEntries(d.workflow.steps.map(s=>[s.id,s.id+' / '+(s.title||'Untitled')]))}})+
        field('transition:'+e.id,'to','To step',e.to,{options:{'':'Unconfirmed',...Object.fromEntries(d.workflow.steps.map(s=>[s.id,s.id+' / '+(s.title||'Untitled')])),'END':'This path ends here'}})+
        field('transition:'+e.id,'kind','Route type',e.kind,{options:M.branches})+
        field('transition:'+e.id,'condition','What condition leads to this route?',e.condition,{rows:2,wide:true})+
        field('transition:'+e.id,'deadline','Time condition, unit and starting event',e.deadline,{wide:true,placeholder:'Example: 48 elapsed hours from acknowledgment, not business hours; runs even without human receipt.'})+'</div></article>').join('')+
      '<button type="button" class="secondary add-record" data-add="transition">Add branch</button></div></details>';
  }
  function materials(d) {
    return '<section class="intake-block"><h3>Available materials</h3><p class="intake-note">Only names and metadata are registered here. Selected files are not read, attached or uploaded.</p><div class="file-picker"><label for="material-files">Register file names</label><input type="file" id="material-files" multiple><button type="button" class="secondary" data-add="material">Add material metadata</button></div>'+
      (d.materials.length?'':'<p class="intake-note">No materials registered yet. You can draft without materials.</p>')+
      d.materials.map(m=>'<details class="intake-details" id="material-'+esc(m.id)+'"><summary><span><span class="row-id">'+esc(m.id)+'</span> '+esc(m.title||m.file_name||'Untitled material')+'</span><span class="state-note">Content unread / '+(m.role==='context'?'Context material':'Review target')+'</span></summary><div class="details-body"><div class="row-heading"><span class="material-status">'+esc(m.file_name?'File name only: '+m.file_name+' / '+m.file_size+' bytes':'Declared metadata only / content not supplied')+'</span><button type="button" class="text-command" data-remove="material" data-id="'+esc(m.id)+'">Remove material</button></div><div class="row-grid">'+
        field('material:'+m.id,'title','Material title',m.title)+field('material:'+m.id,'author_role','Author / sender role',m.author_role)+
        field('material:'+m.id,'date','Creation date / covered period',m.date)+field('material:'+m.id,'version','Version / document state',m.version)+
        field('material:'+m.id,'basis','Evidence basis',m.basis,{options:M.bases})+field('material:'+m.id,'role','Role in this review',m.role,{options:{target:'Review target',context:'Background / context only'}})+
        field('material:'+m.id,'reference','URL / location (optional)',m.reference,{wide:true,note:'URLs are not fetched automatically. You do not need to enter confidential paths.'})+
        field('material:'+m.id,'note','What could this establish? What sharing or access limits apply?',m.note,{rows:2,wide:true})+'</div></div></details>').join('')+'</section>';
  }
  function inputs(d) {
    return heading(d.kind==='workflow'?'What enters the workflow, and what happens next?':'Which materials and relationships should be reviewed?','Keep the described process separate from the materials that could substantiate it.')+
      (d.kind==='workflow'?'<div class="intake-grid">'+field('workflow','entry_point','What is received at the start?',d.workflow.entry_point,{rows:3})+field('workflow','end_point','What counts as completion or closure?',d.workflow.end_point,{rows:3})+
      field('workflow','automation_role','Where does AI or an algorithm act, and what does it do?',d.workflow.automation_role,{rows:3})+field('workflow','human_role','Where do people check or change something?',d.workflow.human_role,{rows:3})+'</div>'+
      field('workflow','flow_notes','Describe normal, exceptional and paused operation',d.workflow.flow_notes,{rows:5,placeholder:'Brief notes are fine. Mark unknown destinations or conditions as unconfirmed.'})+steps(d):
      field('narrative','provenance','Known provenance, authorship, translation and editing history',d.narrative.provenance,{rows:4})+field('narrative','comparison','Which claims, dates, style or argument structure should be compared?',d.narrative.comparison,{rows:3})+field('narrative','target_context','How should target text be distinguished from supporting context?',d.narrative.target_context,{rows:3}))+materials(d);
  }
  function safeguards(d) {
    return heading('Safeguards and unknowns','A description is still an unverified account, not proof of implementation or operation. Give a reason for exclusions.')+
      M.activeModules(d).map(m=>{
        const a=d.answers[m.id];
        return '<details class="intake-details" id="module-'+m.id+'"><summary><span>'+esc(m.title)+'</span><span class="state-note">'+esc(M.states[a.status])+'</span></summary><div class="details-body"><p>'+esc(m.prompt)+'</p><div class="intake-grid">'+
          field('answer:'+m.id,'status','Answer status',a.status,{options:M.states})+field('answer:'+m.id,'basis','Basis of this account',a.basis,{options:M.bases})+'</div>'+
          field('answer:'+m.id,'text','Description, unknowns or reason for exclusion',a.text,{rows:4})+
          (d.materials.length?'<fieldset class="plain-fieldset"><legend>Materials related to this account</legend><div class="ref-options">'+d.materials.map(s=>'<label><input type="checkbox" data-ref="'+m.id+'" value="'+esc(s.id)+'"'+(a.material_ids.includes(s.id)?' checked':'')+'>'+esc(s.id+' / '+(s.title||s.file_name||'Untitled'))+'</label>').join('')+'</div></fieldset>':'<p class="intake-note">No related materials registered yet.</p>')+'</div></details>';
      }).join('');
  }
  function review(d) {
    const q=M.questions(d); const rows=[['Review type',d.kind==='workflow'?'Workflow':'Documents and related materials'],['Case title',d.scope.title||'Not set'],['Review question',d.scope.question||'Unanswered'],['Affected people',d.scope.affected_people||'Unconfirmed'],['Impact areas',d.scope.impacts.map(k=>M.impacts[k]).join(', ')||'Unconfirmed'],['Materials',d.materials.length+' material records / all contents unread']];
    return heading('Review the intake and the next questions','This organises your input. It is not a workflow assessment or a flow already analysed by AI.')+
      '<dl class="review-summary">'+rows.map(([label,value])=>'<dt>'+label+'</dt><dd>'+esc(value)+'</dd>').join('')+'</dl>'+
      (d.kind==='workflow' && d.workflow.steps.length?'<details class="intake-details" id="input-flow-preview"><summary><span>Registered steps and branches</span><span class="state-note">Structure awaiting human confirmation</span></summary><div class="details-body"><ol class="input-flow">'+d.workflow.steps.map(s=>'<li><code>'+esc(s.id)+'</code><div><strong>'+esc(s.title||'Untitled')+'</strong><p>'+esc(M.actors[s.actor])+' / Owner: '+esc(s.owner||'Unconfirmed')+'</p>'+d.workflow.transitions.filter(e=>e.from===s.id).map(e=>'<p>→ '+esc(e.to||'Destination unconfirmed')+' / '+esc(M.branches[e.kind])+' / '+esc(e.condition||'Condition unconfirmed')+'</p>').join('')+'</div></li>').join('')+'</ol></div></details>':'')+
      '<section class="intake-block"><h3>Next questions</h3><p class="intake-note">Questions derived from missing input, not automatically detected risks. '+q.length+' questions in total; the first three are shown.</p><ol class="question-list">'+q.slice(0,3).map(x=>'<li><strong>'+esc(x.question)+'</strong><p>'+esc(x.why)+'</p><button type="button" class="text-command" data-page="'+x.section+'">Go to this input</button></li>').join('')+'</ol>'+
      (q.length>3?'<details class="intake-details" id="remaining-questions"><summary><span>Remaining questions</span><span class="state-note">'+(q.length-3)+' records</span></summary><div class="details-body"><ol class="question-list" start="4">'+q.slice(3).map(x=>'<li>'+esc(x.question)+'<p>'+esc(x.why)+'</p></li>').join('')+'</ol></div></details>':'')+'</section>'+
      '<section class="intake-block"><h3>Prepare a request for your AI</h3><div class="boundary-note"><strong>Nothing is sent externally.</strong><p>The request includes your descriptions and material names, not the files. Review the destination terms and whether personal or confidential information is necessary.</p><p>Qualified human review required: Do not finalise decisions affecting clinical care, employment, legal matters, academic assessment, reputation, provenance, finances, safety or remedy from this intake alone.</p></div>'+
      field('root','destination','AI / environment you intend to use',d.destination,{placeholder:'Example: your own AI environment whose terms and data handling you have checked'})+
      '<details class="intake-details" id="request-details"><summary><span>Request and included intake data</span><span class="state-note">Preview before sharing</span></summary><div class="details-body"><label for="request-text" class="intake-note">AI request</label><textarea id="request-text" class="packet-preview" readonly></textarea></div></details>'+
      '<label class="handoff-confirmation"><input type="checkbox" id="handoff-confirmed"><span>I have reviewed the included information and the destination terms. I will decide whether to paste or send it externally.</span></label>'+
      '<div class="handoff-actions"><button type="button" class="primary" id="copy-brief" disabled>Copy request</button><button type="button" class="secondary" id="download-brief" disabled>Export request</button></div><p class="intake-note">Editing clears this confirmation. Preparing or copying a request is not sending it to AI or completing analysis.</p></section>';
  }
  function render(d,page) { return [overview,inputs,safeguards,review][page](d); }
  function mount(document,window,data) {
    const get=id=>document.getElementById(id), prefix='tracewright.intake.v1.';
    const uid=()=>window.crypto?.randomUUID?.() || 'draft-'+Date.now()+'-'+Math.random().toString(16).slice(2);
    const params=new URLSearchParams(window.location.search);
    let d=M.create(uid(),params.get('kind')==='narrative'?'narrative':'workflow'), page=0, dirty=false, confirmed=false, prepared='', exportText='', exportId='', pendingConfirm=null;
    const sampleCases=(data?.cases||[]).filter(c=>c.kind==='workflow' && (c.intake_seed || c.id==='global-support'));
    const sampleSelect=get('sample-case');
    sampleSelect.innerHTML=optionList(Object.fromEntries(sampleCases.map(c=>[c.id,c.short_name])),params.get('sample')||'global-support');
    const updateSampleLink=()=>{get('sample-review').href='index.html#case='+encodeURIComponent(sampleSelect.value)+'&view=summary';};
    updateSampleLink();
    sampleSelect.addEventListener('change',updateSampleLink);
    const requestedExample=sampleCases.find(c=>c.id===params.get('sample'));
    if(requestedExample) { d=M.sample(requestedExample,uid()); dirty=true; }
    const openDetails=new Set();
    const recordId=prefix=>M.nextId([...d.materials,...d.workflow.steps,...d.workflow.transitions],prefix);
    function message(text,error=false) { get('intake-status').textContent=text; get('intake-status').classList.toggle('is-error',error); }
    function showOrigin() {
      get('input-origin').hidden=d.origin==='user_input';
      get('input-origin').textContent=d.origin==='synthetic_example'?'Entirely fictional example, not a real organisation, customer or incident.':d.origin==='imported_unverified'?'Imported intake account. Its contents, including claims of real or synthetic origin, have not been independently verified.':'Draft edited from an example. Distinguish fictional settings from information you added.';
    }
    function touch() {
      dirty=true; confirmed=false; d.updated_at=new Date().toISOString();
      if(d.origin==='synthetic_example') d.origin='example_edited';
      showOrigin();
      get('save-state').textContent='Changed / unsaved';
      const check=get('handoff-confirmed'); if(check) check.checked=false;
      updateGate();
    }
    function updateGate() {
      for(const id of ['copy-brief','download-brief']) if(get(id)) get(id).disabled=!(confirmed && d.destination.trim() && prepared);
    }
    function prepare() {
      if(page!==3) return;
      try { prepared=M.brief(d); get('request-text').value=prepared; } catch(error) { prepared=''; get('request-text').value='Please correct the input: '+error.message; }
      updateGate();
    }
    function paint(focus=false) {
      document.querySelectorAll('#intake-section details[open]').forEach(el=>openDetails.add(el.id));
      get('intake-nav').innerHTML=titles.map((t,i)=>'<button type="button" data-page="'+i+'"'+(page===i?' aria-current="step"':'')+'><span>'+String(i+1).padStart(2,'0')+'</span><span>'+t+'</span></button>').join('');
      get('intake-section').innerHTML=render(d,page);
      for(const id of openDetails) if(get(id)) get(id).open=true;
      get('previous-step').hidden=page===0; get('next-step').hidden=page===3;
      get('next-step').textContent=page===2?'Review inputs':'Next';
      get('step-label').textContent=(page+1)+' / 4';
      showOrigin();
      get('save-state').textContent=dirty?'Changed / unsaved':'Intake draft / not analysed';
      confirmed=false; prepare();
      if(focus) { const h=document.querySelector('.section-title'); h.focus({preventScroll:true}); h.scrollIntoView({block:'start'}); }
    }
    function navigate(n) { page=Math.max(0,Math.min(3,n)); paint(true); }
    function ask(text,action) { pendingConfirm=action; get('confirm-message').textContent=text; get('confirm-dialog').showModal(); get('confirm-cancel').focus(); }
    function replace(next) {
      const apply=()=>{d=next; dirty=true; confirmed=false; page=0; openDetails.clear(); paint(true); message('New intake draft. Previously saved drafts are unchanged.');};
      if(dirty) ask('Discard this page\u0027s unsaved changes and open another draft? Saved drafts remain unchanged.',apply); else apply();
    }
    function library(selected='') {
      try {
        const list=[];
        for(let i=0;i<window.localStorage.length;i++) {
          const key=window.localStorage.key(i); if(!key?.startsWith(prefix)) continue;
          try { const saved=M.parse(window.localStorage.getItem(key)); if(prefix+saved.id===key) list.push(saved); } catch { /* Leave unreadable records untouched. */ }
        }
        list.sort((a,b)=>b.updated_at.localeCompare(a.updated_at));
        get('saved-drafts').innerHTML='<option value="">Select saved draft</option>'+list.map(s=>'<option value="'+esc(s.id)+'">'+esc((s.scope.title||'Untitled')+' / '+s.updated_at.slice(0,16).replace('T',' ')+' UTC')+'</option>').join('');
        if(list.some(s=>s.id===selected)) get('saved-drafts').value=selected;
      } catch { message('Browser storage is unavailable. You can export intake JSON.',true); }
    }
    function save() {
      try {
        const errors=M.validate(d); if(errors.length) throw new Error(errors.slice(0,3).join(' '));
        d.updated_at=new Date().toISOString(); const text=JSON.stringify(d);
        window.localStorage.setItem(prefix+d.id,text);
        if(window.localStorage.getItem(prefix+d.id)!==text) throw new Error('Saved data could not be verified by read-back.');
        dirty=false; library(d.id); get('save-state').textContent='Saved in this browser';
        message('Draft saved in this browser and verified by read-back. No file was saved or data sent to AI.');
      } catch(error) { message('Could not save. Your input remains on this page. '+error.message,true); }
    }
    function download(text,name,type) {
      const url=window.URL.createObjectURL(new window.Blob([text],{type}));
      const link=document.createElement('a'); link.href=url; link.download=name; document.body.append(link); link.click(); link.remove();
      window.setTimeout(()=>window.URL.revokeObjectURL(url),30000);
    }
    function exportDraft() {
      try {
        const clean=M.parse(JSON.stringify(d));
        exportText=JSON.stringify(clean,null,2); exportId=d.id;
        get('export-text').value=exportText; get('export-status').textContent='Not yet copied or downloaded.';
        get('export-dialog').showModal(); get('export-text').setSelectionRange(0,0); get('export-text').scrollTop=0; get('export-close').focus();
      } catch(error) { message(error.message,true); }
    }
    function add(kind) {
      const list=kind==='material'?d.materials:kind==='step'?d.workflow.steps:d.workflow.transitions;
      const limit=kind==='transition'?80:40;
      if(list.length>=limit) { message('This intake supports up to '+limit+' records. Put additional detail in material notes.',true); return; }
      const id=recordId(kind==='material'?'MAT-':kind==='step'?'ST-':'BR-');
      list.push(kind==='material'?M.newMaterial(id):kind==='step'?M.newStep(id):M.newTransition(id));
      touch(); openDetails.add(kind==='material'?'material-'+id:'structured-flow'); paint();
      const el=get('f-'+kind+'-'+id+'-'+(kind==='transition'?'from':'title')); el?.focus();
    }
    function remove(kind,id) {
      const related=kind==='step'?d.workflow.transitions.filter(e=>e.from===id || e.to===id):[];
      ask('Remove '+id+' from this draft?'+(related.length?' This also removes '+related.length+' connected branches.':'')+(kind==='material'?' Related material links will be removed.':'')+' Original files are not deleted.',()=>{
        if(kind==='material') { d.materials=d.materials.filter(m=>m.id!==id); for(const a of Object.values(d.answers)) a.material_ids=a.material_ids.filter(x=>x!==id); }
        if(kind==='step') { d.workflow.steps=d.workflow.steps.filter(s=>s.id!==id); d.workflow.transitions=d.workflow.transitions.filter(e=>e.from!==id && e.to!==id); }
        if(kind==='transition') d.workflow.transitions=d.workflow.transitions.filter(e=>e.id!==id);
        touch(); paint(); message(id+' removed from the draft.');
      });
    }
    get('intake-form').addEventListener('submit',event=>event.preventDefault());
    document.addEventListener('click',event=>{
      const pageButton=event.target.closest('[data-page]'); if(pageButton) navigate(Number(pageButton.dataset.page));
      const addButton=event.target.closest('[data-add]'); if(addButton) add(addButton.dataset.add);
      const removeButton=event.target.closest('[data-remove]'); if(removeButton) remove(removeButton.dataset.remove,removeButton.dataset.id);
    });
    get('intake-section').addEventListener('toggle',event=>{if(event.target.tagName==='DETAILS') { if(event.target.open) openDetails.add(event.target.id); else openDetails.delete(event.target.id); }},true);
    function updateField(el) {
      if(!el.dataset.group) return false;
      const [kind,id]=el.dataset.group.split(':');
      const target=kind==='root'?d:kind==='scope'?d.scope:kind==='workflow'?d.workflow:kind==='narrative'?d.narrative:kind==='answer'?d.answers[id]:kind==='step'?d.workflow.steps.find(s=>s.id===id):kind==='transition'?d.workflow.transitions.find(s=>s.id===id):kind==='material'?d.materials.find(s=>s.id===id):null;
      if(!target || !Object.hasOwn(target,el.dataset.field)) return false;
      target[el.dataset.field]=el.value; touch(); prepare(); return true;
    }
    get('intake-section').addEventListener('input',event=>{if(event.target.tagName!=='SELECT') updateField(event.target);});
    get('intake-section').addEventListener('change',async event=>{
      const el=event.target;
      if(el.tagName==='SELECT' && updateField(el)) { paint(); get(el.id)?.focus(); return; }
      if(el.name==='review-kind') { d.kind=el.value; touch(); paint(); return; }
      if(el.name==='impact') { d.scope.impacts=[...document.querySelectorAll('input[name="impact"]:checked')].map(i=>i.value); touch(); return; }
      if(el.dataset.ref) { d.answers[el.dataset.ref].material_ids=[...document.querySelectorAll('input[data-ref="'+el.dataset.ref+'"]:checked')].map(i=>i.value); touch(); return; }
      if(el.id==='handoff-confirmed') { confirmed=el.checked; updateGate(); return; }
      if(el.id==='material-files') {
        const files=[...el.files];
        if(d.materials.length+files.length>40) { message('Up to 40 materials are supported. Your input is unchanged.',true); el.value=''; return; }
        for(const f of files) { const m=M.newMaterial(recordId('MAT-')); Object.assign(m,{title:f.name,file_name:f.name,file_size:f.size,file_modified:f.lastModified,content_status:'metadata_only'}); d.materials.push(m); }
        touch(); paint(); message(files.length+' file names registered. Contents have not been read.');
      }
    });
    get('intake-section').addEventListener('click',async event=>{
      if(!['copy-brief','download-brief'].includes(event.target.id)) return;
      if(!confirmed || !d.destination.trim() || !prepared) { message('Review the request and intended AI environment first.',true); return; }
      if(event.target.id==='download-brief') { download(prepared,'tracewright-ai-request-'+d.id+'.md','text/markdown;charset=utf-8'); message('Request download initiated. Nothing was sent to AI.'); }
      else try { await window.navigator.clipboard.writeText(prepared); message('Request copied to clipboard. Nothing was sent to AI.'); } catch { get('request-details').open=true; get('request-text').focus(); get('request-text').select(); message('Could not write to the clipboard. The request is selected; export is also available.',true); }
    });
    get('previous-step').addEventListener('click',()=>navigate(page-1));
    get('next-step').addEventListener('click',()=>navigate(page+1));
    get('save-draft').addEventListener('click',save);
    if(new URLSearchParams(window.location.search).get('workbench')==='1' && window.location.hostname==='127.0.0.1') {
      document.querySelector('.back-link').href='/';
      document.querySelector('.intake-brand').href='/';
      const send=document.createElement('button'); send.type='button'; send.className='primary'; send.textContent='Create local Workbench review';
      get('save-draft').parentElement.append(send);
      send.addEventListener('click',async()=>{
        send.disabled=true;
        try {
          M.parse(JSON.stringify(d));
          const health=await window.fetch('/api/health').then(r=>r.json());
          const result=await window.fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json','X-Tracewright-Session':health.sessionToken},body:JSON.stringify(d)});
          const value=await result.json();if(!result.ok)throw new Error(value.error || 'Local registration failed.');
          dirty=false;window.location.href='/#project='+encodeURIComponent(value.id);
        } catch(error) {message(error.message+' Nothing was sent to AI.',true);send.disabled=false;}
      });
    }
    get('export-draft').addEventListener('click',exportDraft);
    get('export-close').addEventListener('click',()=>get('export-dialog').close());
    get('export-copy').addEventListener('click',async()=>{
      try { await window.navigator.clipboard.writeText(exportText); get('export-status').textContent='Intake JSON copied. No file saved or data sent to AI.'; }
      catch { get('export-text').focus(); get('export-text').select(); get('export-status').textContent='Could not copy. The JSON is selected.'; }
    });
    get('export-download').addEventListener('click',()=>{
      download(exportText,'tracewright-intake-'+exportId+'.json','application/json;charset=utf-8');
      get('export-status').textContent='Download requested; verify completion in your browser. Copy JSON is also available.';
    });
    get('new-draft').addEventListener('click',()=>replace(M.create(uid(),d.kind)));
    get('load-sample').addEventListener('click',()=>{const example=sampleCases.find(c=>c.id===sampleSelect.value); if(example) replace(M.sample(example,uid())); else message('Could not load the example.',true);});
    get('load-draft').addEventListener('click',()=>{
      const id=get('saved-drafts').value; if(!id) { message('Select a draft to open.'); return; }
      try {
        const saved=M.parse(window.localStorage.getItem(prefix+id));
        const apply=()=>{d=saved; dirty=false; page=0; openDetails.clear(); paint(true); get('save-state').textContent='Loaded saved draft'; message('Saved intake draft loaded. Sharing confirmation has been cleared.');};
        if(dirty) ask('Discard unsaved changes and open the selected draft?',apply); else apply();
      } catch(error) { message('Could not load. Your current input is unchanged. '+error.message,true); }
    });
    get('delete-draft').addEventListener('click',()=>{
      const id=get('saved-drafts').value; if(!id) { message('Select a saved draft to delete.'); return; }
      ask('Delete the selected draft from browser storage? The open input and exported files will not be deleted.',()=>{
        try { window.localStorage.removeItem(prefix+id); if(window.localStorage.getItem(prefix+id)!==null) throw new Error('Could not verify deletion.'); library(); if(id===d.id) { dirty=true; get('save-state').textContent='No saved record / kept on this page'; } message('Selected draft deleted from browser storage.'); } catch(error) { message(error.message,true); }
      });
    });
    get('import-draft').addEventListener('change',async event=>{
      const f=event.target.files[0]; event.target.value=''; if(!f) return;
      try { if(f.size>1500000) throw new Error('Intake JSON must be no larger than 1.5 MB.'); const imported=M.parse(await f.text()); imported.id=uid(); imported.origin='imported_unverified'; imported.updated_at=new Date().toISOString(); replace(imported); } catch(error) { message('Could not import intake JSON. Your current input is unchanged. '+error.message,true); }
    });
    get('confirm-cancel').addEventListener('click',()=>{pendingConfirm=null; get('confirm-dialog').close();});
    get('confirm-dialog').addEventListener('cancel',()=>{pendingConfirm=null;});
    get('confirm-accept').addEventListener('click',()=>{const action=pendingConfirm; pendingConfirm=null; get('confirm-dialog').close(); action?.();});
    window.addEventListener('beforeunload',event=>{if(dirty) { event.preventDefault(); event.returnValue=''; }});
    paint(); library();
  }
  const api={render,esc,mount};
  if(typeof module==='object' && module.exports) module.exports=api;
  else { root.TracewrightIntakeUI=api; mount(root.document,root,root.TracewrightDemoData); }
})(typeof globalThis!=='undefined'?globalThis:this);
