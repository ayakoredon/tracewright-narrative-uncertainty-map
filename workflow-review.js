(function(root) {
  'use strict';
  const M = typeof module === 'object' && module.exports ? require('./demo/review-model.js') : root.TracewrightReviewModel;
  const stateClass = {observed_gap:'review',concern:'observe',unknown:'neutral',observed_control:'control'};
  const supportDisplay = {
    context:'Fictional international appliance support / translation AI, triage AI and human response',
    affected_people:['Customers reporting injury or fire, and people around them','Users of less-supported languages or audio input','Staff with limited time and original-text access','Safety, language-support and data-protection staff'],
    priorities:['Do not turn unknown meaning into no danger or resolved','Trace assigned receipt and a needed response, not just forwarding','Do not penalise justified holds or pauses','Preserve working interventions and retest after changes'],
    domain_note:'Reference meanings are scenario settings, not independently verified translations. Real performance evaluation requires separate data and qualified language review.',
    qualified_note:'Product safety, remedy and personal data require qualified human review. These observations are not operational instructions or a safety certification.',
    flow_intro:'Configured routes and selected event traces. Forwarding, assigned receipt, content review and closure are distinct states.',
    graph_label:'Customer-support workflow',branch_caption:'Routes selected from the English-text classification',
    auxiliary_nodes:[{branch:'irregular',step_id:'TIMEOUT',caption:'Separate path: 48 elapsed hours without human receipt'}],
    inventory_title:'Customer-message traces',scope_column:'Language',route_column:'Route after AI classification',
    pair_labels:{input:'Customer original',output:'Adopted English translation',reference:'Reference meaning and limits',fidelity:'Meaning preservation',classification:'Classification set in the scenario',input_missing:'Original not supplied; language label only.',output_missing:'No English text / translation failed'},
    ticket_sources:[{source_id:'WF-S03',label:'Original, translation and reference meaning'},{source_id:'WF-S04',label:'Event trace'}],
    access:{headers:['Role','English text','Original','Personal attributes','Pause translation'],rows:[['Generalist','Default view','After supervisor approval','Default view','Unconfirmed'],['Supervisor','Unconfirmed','Approves access','Unconfirmed','Unconfirmed'],['Language specialist','Undefined','Undefined','Undefined','Unconfirmed'],['Administrator','Unconfirmed','Unconfirmed','Unconfirmed','May pause / recovery unconfirmed']],source_ids:['WF-S07','WF-S08'],note:'Limited to WF-S07 and WF-S08. Unconfirmed does not mean no authority or safe.'},
    unknowns:['Less-supported-language originals and independent reference translations','Training provenance and use/population/error-specific evaluation','Actual reviewer capacity, training and experience of challenge','Executed terms, external retention, reuse and deletion evidence','Tests of support during pause and after recovery']
  };
  function display(c) {
    if(c.workflow_ui) return c.workflow_ui;
    if(c.id==='global-support') return supportDisplay;
    throw new Error('Workflow presentation is missing: '+c.id);
  }
  function journey(c,h) {
    if(!c.intake_seed) return '';
    const {esc,anchor,list}=h;
    return '<section class="intake-review-bridge"><div class="section-heading"><h3>From intake to source review</h3><a class="record-link" href="intake.html?sample='+encodeURIComponent(c.id)+'">Open this intake example</a></div><p>'+esc(c.review_journey.note)+'</p><div class="summary-split"><section><h4>Initial account / unverified</h4>'+list(c.review_journey.initial)+'</section><section><h4>Review after receiving materials</h4><ul>'+c.review_journey.review.map(r=>'<li>'+anchor(c,'evidence',r.evidence_id,r.text)+'</li>').join('')+'</ul></section></div><p class="section-note">Intake registration and source review are separate. Entering a description does not automatically produce an assessment.</p></section>';
  }
  function summary(c,state,h) {
    const {esc,anchor,list,badge}=h, v=display(c);
    return '<header class="view-heading"><h2 class="view-title" tabindex="-1">Workflow review question</h2><p>'+esc(v.context)+'</p></header>'+
      '<section class="question-band"><h3>'+esc(c.question)+'</h3><p>'+esc(c.overview)+'</p></section>'+
      '<div class="workflow-scope"><span>'+c.tickets.length+' selected records</span><span>'+c.sources.length+' fictional sources</span><span>'+c.evidence.length+' observations</span><span>Times: UTC</span></div>'+
      '<section class="inspect-band"><div class="section-heading"><h3>First places to inspect</h3><span>Problem paths and working interventions</span></div><ol class="inspection-list">'+c.focus.map(f=>'<li>'+anchor(c,f.kind,f.id,f.title)+'<p>'+esc(f.description)+'</p></li>').join('')+'</ol></section>'+
      '<section class="finding-overview"><h3>Observations by evidence state</h3><div class="finding-counts">'+Object.entries(M.findingStates).map(([key,label])=>'<a href="'+esc(M.hash({case:c.id,view:'evidence',finding:key}))+'">'+badge(label,stateClass[key])+'<strong>'+c.evidence.filter(e=>e.finding_state===key).length+'<small>observations</small></strong></a>').join('')+'</div><p class="section-note">Counts are not safety scores. A documented mismatch is limited to the fictional policy, configuration and logs supplied.</p></section>'+
      journey(c,h)+'<div class="summary-split"><section><h3>Affected people</h3>'+list(v.affected_people)+'</section><section><h3>Priorities for the next review</h3>'+list(v.priorities)+'</section></div>'+
      '<details class="guide-details"><summary>Construction, source coverage and limits</summary><div class="guide-body">'+list(c.limitations)+'<h3>Must not conclude</h3>'+list(c.must_not_conclude)+'<p>'+esc(v.domain_note)+'</p></div></details>'+
      '<aside class="qualified-review"><strong>Qualified human review required</strong><p>'+esc(v.qualified_note)+'</p></aside>';
  }
  function workflow(c,state,h) {
    const {esc,anchor,refs,badge}=h, v=display(c), routes=M.routesFor(c);
    const selected=M.byId(c,'ticket',state.ticket || state.item), selectedStep=M.byId(c,'step',state.item);
    const displayed=c.tickets.filter(t=>!state.route || t.route===state.route);
    const node=s=>{
      const count=c.evidence.filter(e=>e.step_ids.includes(s.id)).length;
      return '<li><a class="flow-step '+(selected?.path.includes(s.id)?'on-path ':'')+(selectedStep?.id===s.id?'selected-step':'')+'" href="'+esc(M.hash({case:c.id,view:'workflow',item:s.id,ticket:selected?.id,route:state.route}))+'"><span class="actor-kind '+(s.actor==='AI'?'actor-ai':s.actor==='Human'?'actor-human':'')+'">'+esc(s.actor)+'</span><strong>'+esc(s.title)+'</strong><small>'+esc(s.id)+' / '+count+' observation'+(count===1?'':'s')+'</small></a></li>';
    };
    const aux=v.auxiliary_nodes || [];
    const options='<option value="">All routes</option>'+Object.entries(routes).map(([value,label])=>'<option value="'+esc(value)+'"'+(state.route===value?' selected':'')+'>'+esc(label)+'</option>').join('');
    return '<header class="view-heading"><h2 class="view-title" tabindex="-1">Flow & Cases</h2><p>'+esc(v.flow_intro)+'</p></header>'+
      '<div class="workflow-toolbar"><label>Recorded route<select id="workflow-route" class="workflow-select" name="route">'+options+'</select></label><span>'+(selected?'Following: '+esc(selected.id)+' / '+esc(selected.title):'All paths')+'</span></div>'+
      '<section class="flow-map" aria-label="'+esc(v.graph_label)+'"><ol class="flow-common">'+c.steps.filter(s=>s.branch==='common').map(node).join('')+'</ol><p class="branch-caption">'+esc(v.branch_caption)+'</p><div class="flow-branches">'+Object.entries(routes).filter(([key])=>!state.route || key===state.route).map(([key,label])=>'<section><h3>'+esc(label)+'</h3><ol>'+c.steps.filter(s=>s.branch===key && !aux.some(a=>a.step_id===s.id)).map(node).join('')+'</ol>'+aux.filter(a=>a.branch===key).map(a=>'<div class="timeout-branch"><p>'+esc(a.caption)+'</p><ol>'+node(M.byId(c,'step',a.step_id))+'</ol></div>').join('')+'</section>').join('')+'</div><ol class="flow-outcomes">'+c.steps.filter(s=>s.branch==='outcome').map(node).join('')+'</ol><p class="section-note">Highlighted steps belong to the selected trace. AI / Human / System identifies the actor, not a safety rating.</p></section>'+
      (selectedStep?'<section class="step-inspector record is-target" id="'+esc(selectedStep.id)+'" tabindex="-1"><span class="record-id">'+esc(selectedStep.id)+'</span><h3>'+esc(selectedStep.title)+'</h3><p>'+esc(selectedStep.description)+'</p><div class="linked-row"><span>Supporting materials</span><div>'+refs(c,'source',selectedStep.source_ids)+'</div></div><div class="linked-row"><span>Observations</span><div>'+refs(c,'evidence',c.evidence.filter(e=>e.step_ids.includes(selectedStep.id)).map(e=>e.id))+'</div></div><h4>Paths leaving this step</h4><ul>'+c.transitions.filter(e=>e.from===selectedStep.id).map(e=>'<li>'+anchor(c,'step',e.to,M.byId(c,'step',e.to).title)+' / '+esc(e.condition)+'</li>').join('')+'</ul></section>':'')+
      '<section class="ticket-inventory"><div class="section-heading"><h3>'+esc(v.inventory_title)+'</h3><span>'+displayed.length+' / '+c.tickets.length+' records</span></div><div class="table-wrap"><table class="ticket-table"><thead><tr><th>Record</th><th>'+esc(v.scope_column)+'</th><th>'+esc(v.route_column)+'</th><th>At the observation cutoff</th></tr></thead><tbody>'+displayed.map(t=>'<tr'+(selected?.id===t.id?' class="selected-ticket"':'')+'><td>'+anchor(c,'ticket',t.id,t.id+' / '+t.title)+'</td><td>'+esc(t.scope_label || t.language)+'</td><td>'+esc(routes[t.route])+'</td><td>'+badge(t.outcome,t.outcome==='Closed while unresolved'?'review':'neutral')+'</td></tr>').join('')+'</tbody></table></div></section>'+
      (selected?ticketDetail(c,selected,h):'')+
      '<details class="guide-details"><summary>All transitions</summary><div class="guide-body"><ul>'+c.transitions.map(e=>'<li>'+anchor(c,'step',e.from,M.byId(c,'step',e.from).title)+' → '+anchor(c,'step',e.to,M.byId(c,'step',e.to).title)+' / '+esc(e.condition)+'</li>').join('')+'</ul></div></details>';
  }
  function ticketDetail(c,t,h) {
    const {esc,anchor,refs}=h, v=display(c), labels=v.pair_labels;
    const pair=t.review_pair || {input:t.source_text,output:t.translated_text,reference:t.reference_meaning,fidelity:t.fidelity,classification:t.actual_category};
    const sourceLinks=(t.source_refs || v.ticket_sources.map(s=>({...s,section_id:t.id}))).map(s=>sourcePart(c,s.source_id,s.section_id,s.label,h)).join(' / ');
    return '<article class="ticket-detail record is-target" id="'+esc(t.id)+'" tabindex="-1"><span class="record-id">'+esc(t.id)+'</span><h3>'+esc(t.title)+'</h3><p>'+esc(t.outcome_detail)+'</p><div class="translation-pair"><section><h4>'+esc(labels.input)+' <small>Fictional input</small></h4><blockquote class="original-text">'+esc(pair.input || labels.input_missing)+'</blockquote></section><section><h4>'+esc(labels.output)+' <small>Constructed output</small></h4><blockquote>'+esc(pair.output || labels.output_missing)+'</blockquote></section></div><dl class="record-facts"><div><dt>'+esc(labels.reference)+'</dt><dd>'+esc(pair.reference)+'</dd></div><div><dt>'+esc(labels.fidelity)+'</dt><dd>'+esc(pair.fidelity)+'</dd></div><div><dt>'+esc(labels.classification)+'</dt><dd>'+esc(pair.classification)+'</dd></div><div><dt>Handling to verify</dt><dd>'+esc(t.expected_handling)+'</dd></div></dl>'+
      (t.notice_text?'<section><h4>Notice recorded in this scenario</h4><blockquote>'+esc(t.notice_text)+'</blockquote></section>':'')+
      '<div class="ticket-path">'+t.path.map(id=>anchor(c,'step',id,M.byId(c,'step',id).title)).join(' <span aria-hidden="true">→</span> ')+'</div><h4>Event trace from receipt <small>UTC</small></h4><ol class="event-trace">'+t.events.map(e=>'<li><time datetime="'+esc(e[0])+'">'+esc(e[0].replace('T',' ').replace('Z',''))+'</time><div><code>'+esc(e[1])+'</code><p>'+esc(e[2])+'</p></div></li>').join('')+'</ol><div class="linked-row"><span>Supporting materials</span><div>'+sourceLinks+'</div></div><div class="linked-row"><span>Observations</span><div>'+refs(c,'evidence',t.evidence_ids)+'</div></div></article>';
  }
  function sourcePart(c,id,part,label,h) {
    return '<a class="record-link" href="'+h.esc(M.hash({case:c.id,view:'sources',item:id,part}))+'">'+h.esc(label || id+' / '+part)+'</a>';
  }
  function controls(c,state,h) {
    const {esc,refs,list}=h, v=display(c), matrix=v.access;
    return '<header class="view-heading"><h2 class="view-title" tabindex="-1">Controls & Access</h2><p>Separate stated policy, observed configuration or events, and what remains unknown.</p></header>'+
      '<section><h3>Inspection and intervention authority</h3><p class="section-note">'+esc(matrix.note)+'</p><div class="table-wrap"><table class="access-table"><thead><tr>'+matrix.headers.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+matrix.rows.map(row=>'<tr>'+row.map((value,i)=>'<'+(i?'td':'th')+'>'+esc(value)+'</'+(i?'td':'th')+'>').join('')+'</tr>').join('')+'</tbody></table></div><p>'+refs(c,'source',matrix.source_ids)+'</p></section>'+
      '<div class="control-list">'+c.controls.map(control=>'<article class="control-record record'+(state.item===control.id?' is-target':'')+'" id="'+esc(control.id)+'" tabindex="-1"><span class="record-id">'+esc(control.id)+'</span><h3>'+esc(control.title)+'</h3><dl class="record-facts"><div><dt>Policy / design</dt><dd>'+esc(control.design)+'</dd></div><div><dt>Observed and unverified operation</dt><dd>'+esc(control.operation)+'</dd></div></dl><p><strong>Suggested review owner:</strong> '+esc(control.owner)+'</p><div class="linked-row"><span>Related steps</span><div>'+refs(c,'step',control.step_ids)+'</div></div><div class="linked-row"><span>Supporting materials</span><div>'+refs(c,'source',control.source_ids)+'</div></div><div class="linked-row"><span>Observations</span><div>'+refs(c,'evidence',control.evidence_ids)+'</div></div></article>').join('')+'</div>'+
      '<details class="guide-details"><summary>Still unverified</summary><div class="guide-body">'+list(v.unknowns)+'</div></details>';
  }
  const api={summary,workflow,controls,sourcePart,stateClass};
  if(typeof module==='object' && module.exports) module.exports=api;
  else root.TracewrightWorkflowUI=api;
})(typeof globalThis!=='undefined'?globalThis:this);
