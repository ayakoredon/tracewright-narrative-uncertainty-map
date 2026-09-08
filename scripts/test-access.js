const assert=require('node:assert/strict');
const M=require('../demo/review-model');
const I=require('../demo/intake-model');
const UI=require('../public-demo');
const IntakeUI=require('../intake');
const c=require('../demo/access-case');
const support=require('../demo/workflow-case');
const legacy=require('../demo/cases');
const data={...legacy,cases:[c,support,...legacy.cases]};
assert.deepEqual(M.validate(data),[]);
assert.deepEqual([c.tickets.length,c.sources.length,c.evidence.length,c.actions.length,c.controls.length],[7,12,15,9,8]);
let links=0;
for(const view of M.viewsFor(c)) {
  const html=UI.render(c,{view});
  assert.ok(html.trim() && !/undefined|NaN/.test(html),view);
  assert.ok(!/WF-S0|Adopted English translation|Safety duty officer/.test(html),view+' uses the wrong domain');
  for(const [,href] of html.matchAll(/href="(#case=[^"]+)"/g)) {
    const r=M.route(href.replaceAll('&amp;','&'),data);
    assert.equal(r.case,c.id);
    if(r.item) assert.ok(M.itemForView(c,r.view,r.item),r.item);
    if(r.part) assert.ok(M.byId(c,'source',r.item).sections.some(s=>s.id===r.part));
    links++;
  }
}
for(const s of c.steps) {
  assert.ok(s.source_ids.length);
  assert.ok(['common','ready','review','hold','outcome'].includes(s.branch));
  assert.ok(UI.render(c,{view:'workflow',item:s.id}).includes('id="'+s.id+'" tabindex="-1"'));
}
for(const t of c.tickets) {
  assert.ok(UI.render(c,{view:'workflow',item:t.id}).includes('id="'+t.id+'" tabindex="-1"'));
  assert.deepEqual([...t.evidence_ids].sort(),M.evidenceFor(c,{ticket:t.id}).map(e=>e.id).sort());
  for(let i=1;i<t.events.length;i++) assert.ok(Date.parse(t.events[i][0])>=Date.parse(t.events[i-1][0]));
  for(let i=1;i<t.path.length;i++) assert.ok(c.transitions.some(e=>e.from===t.path[i-1] && e.to===t.path[i]),t.id);
}
for(const route of Object.keys(M.routesFor(c))) {
  assert.equal(M.route('#case='+c.id+'&view=workflow&route='+route,data).route,route);
  assert.match(UI.render(c,{view:'workflow',route}),new RegExp(c.tickets.filter(t=>t.route===route).length+' / 7\\s+records'));
}
const event=(id,name)=>M.byId(c,'ticket',id).events.find(e=>e[1]===name);
assert.equal((Date.parse(event('P003','closed_auto')[0])-Date.parse(event('P003','query_sent')[0]))/3600000,72);
assert.ok(event('P003','closed_auto')[2].includes('requestor_withdrawal_record=null; human_review=null'));
assert.ok(event('P006','grant_activated')[2].includes('cached_source_version=1; approval_version=1; current_source_version=2'));
assert.ok(event('P006','revoke_queued')[2].includes('readback=not_supplied'));
assert.equal(event('P006','grant_revoked'),undefined);
assert.ok(event('P004','reassessed')[2].includes('input_version=2'));
assert.ok(event('P004','grant_activated')[2].includes('source_version=2; approval_version=2'));
assert.ok(event('P004','grant_revoked')[2].includes('readback_absent'));
assert.ok(event('P007','test_held')[2].includes('no_grant'));
for(const [id,state] of [['PA-E04','concern'],['PA-E05','unknown'],['PA-E06','concern'],['PA-E11','observed_control'],['PA-E07','observed_gap'],['PA-E15','observed_gap']]) assert.equal(M.byId(c,'evidence',id).finding_state,state);
for(const e of c.evidence) {
  assert.ok(e.reasoning_chain.length>=2 && e.alternative_explanations.length && e.action_ids.length);
  for(const mark of e.marked_text) assert.ok(e.excerpt.includes(mark.text) && mark.reason.length>15,e.id);
}
assert.ok(UI.render(c,{view:'summary'}).includes('From intake to source review'));
assert.ok(UI.render(c,{view:'summary'}).includes('intake.html?sample=privileged-access'));
assert.ok(UI.render(c,{view:'sources',item:'PA-S05',part:'P006'}).includes('source-section is-target" id="PA-S05--P006"'));
assert.ok(!UI.render(c,{view:'summary'}).includes('Texture cues'));
const d=I.sample(c,'access-demo','2026-09-08T08:00:00Z');
assert.deepEqual(I.validate(d),[]);
assert.equal(d.scope.stage,'pilot');
assert.deepEqual(d.scope.impacts,['privacy','remedy']);
assert.equal(d.materials.length,12);
assert.equal(d.workflow.steps.length,0);
assert.equal(d.answers.handoff.basis,'statement');
assert.equal(d.materials.find(m=>m.id==='PA-S01').basis,'statement');
assert.equal(d.materials.find(m=>m.id==='PA-S03').basis,'configuration');
assert.equal(d.materials.find(m=>m.id==='PA-S05').basis,'operation');
assert.ok(!I.activeModules(d).some(m=>['financial_scope','esg_scope','medical_scope'].includes(m.id)));
const p=I.packet(d);
assert.equal(p.safety.assessment_status,'not_started');
assert.equal(p.safety.source_contents_included,false);
assert.equal(p.safety.external_transmission_performed,false);
assert.ok(!JSON.stringify(p).includes('PA-E07'));
assert.ok(p.materials.every(m=>m.content_status==='not_provided'));
for(let page=0;page<4;page++) assert.ok(!/undefined|NaN/.test(IntakeUI.render(d,page)));
const old=structuredClone(d); delete old.answers.financial_scope;
const migrated=I.parse(JSON.stringify(old));
assert.equal(migrated.answers.financial_scope.status,'unanswered');
assert.deepEqual(migrated.scope,old.scope);
assert.deepEqual(migrated.answers.handoff,old.answers.handoff);
const badOld=structuredClone(old); badOld.answers.financial_scope=null;
assert.throws(()=>I.parse(JSON.stringify(badOld)));
const bad=structuredClone(data); bad.cases[0].tickets[0].route='routine';
assert.ok(M.validate(bad).length);
const badRef=structuredClone(data); badRef.cases[0].tickets[0].source_refs[0].section_id='missing';
assert.ok(M.validate(badRef).length);
const badSource=structuredClone(data); badSource.cases[0].sources[1].sections[0].text+=' altered';
assert.ok(M.validate(badSource).some(e=>e.includes('excerpt differs')));
const badPath=structuredClone(data); badPath.cases[0].tickets[0].path=['PA-RECEIVE','PA-NOTIFY'];
assert.ok(M.validate(badPath).some(e=>e.includes('missing transition')));
assert.throws(()=>I.sample({id:'unsupported'},'x'));
console.log(`PASS: access workflow 7 views, ${links} links, 7 traces, 15 grounded observations, 13 steps, source/version/expiry guards and intake round trips.`);
