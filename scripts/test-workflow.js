const assert = require('node:assert/strict');
const M = require('../demo/review-model');
const UI = require('../public-demo');
const c = require('../demo/workflow-case');
const legacy = require('../demo/cases');
const data = {...legacy,default_case:c.id,cases:[c,...legacy.cases]};
assert.deepEqual(M.validate(data),[]);
assert.equal(M.route('',data).case,c.id);
assert.equal(M.viewsFor(c).length,7);
assert.equal(c.tickets.length,8);
assert.equal(c.sources.length,9);
assert.equal(c.evidence.length,12);
assert.equal(c.controls.length,6);
assert.equal(c.actions.length,8);
let links=0;
for(const view of M.viewsFor(c)) {
  const html=UI.render(c,{view});
  assert.ok(html.trim());
  assert.ok(!/undefined|NaN/.test(html));
  for(const [,href] of html.matchAll(/href="(#case=[^"]+)"/g)) {
    const route=M.route(href.replaceAll('&amp;','&'),data);
    assert.equal(route.case,c.id);
    if(route.item) assert.ok(M.itemForView(c,route.view,route.item),route.item);
    if(route.part) assert.ok(M.byId(c,'source',route.item).sections.some(p=>p.id===route.part));
    links++;
  }
}
assert.ok(!UI.render(c,{view:'summary'}).includes('Texture cues'));
assert.ok(!UI.render(c,{view:'evidence'}).includes('filter-axis'));
assert.equal(M.route('#case=academic&view=workflow',data).view,'summary');
for(const [state,label] of Object.entries(M.findingStates)) {
  const n=c.evidence.filter(e=>e.finding_state===state).length;
  assert.equal(M.evidenceFor(c,{finding:state}).length,n,label);
}
for(const ticket of c.tickets) {
  const html=UI.render(c,{view:'workflow',item:ticket.id});
  assert.ok(html.includes('id="'+ticket.id+'" tabindex="-1"'));
  assert.ok(!html.includes('requested record is not in this case'));
  assert.equal(M.evidenceFor(c,{ticket:ticket.id}).length,c.evidence.filter(e=>e.ticket_ids.includes(ticket.id)).length);
  assert.deepEqual([...ticket.evidence_ids].sort(),M.evidenceFor(c,{ticket:ticket.id}).map(e=>e.id).sort());
}
for(const step of c.steps) assert.ok(UI.render(c,{view:'workflow',item:step.id}).includes('id="'+step.id+'" tabindex="-1"'));
for(const route of ['routine','safety','irregular']) assert.ok(UI.render(c,{view:'workflow',route}).includes(c.tickets.filter(t=>t.route===route).length+' / 8 records'));
const t2=M.byId(c,'ticket','T002');
assert.equal(t2.route,'routine');
assert.ok(!t2.path.includes('SAFETY'));
const t3=M.byId(c,'ticket','T003');
assert.equal(t3.source_text,null);
assert.equal(t3.translated_text,null);
assert.equal((Date.parse(t3.events.at(-1)[0])-Date.parse(t3.events.at(-2)[0]))/3600000,48);
assert.ok(UI.render(c,{view:'workflow',item:'T003'}).includes('Original not supplied'));
const t4=M.byId(c,'ticket','T004');
assert.equal((Date.parse(t4.events.find(e=>e[1]==='accepted')[0])-Date.parse(t4.events[0][0]))/60000,6);
assert.equal(M.byId(c,'evidence','WF-E04').finding_state,'concern');
assert.equal(M.byId(c,'evidence','WF-E05').finding_state,'unknown');
assert.equal(M.byId(c,'evidence','WF-E06').finding_state,'concern');
assert.equal(M.byId(c,'evidence','WF-E09').finding_state,'concern');
for(const e of c.evidence) for(const mark of e.marked_text) assert.ok(mark.reason.length > 30 && !mark.reason.includes('以下の観察'), e.id);
assert.ok(UI.render(c,{view:'sources',item:'WF-S03',part:'T002'}).includes('source-section is-target" id="WF-S03--T002"'));
assert.ok(UI.render(c,{view:'workflow',item:'T006'}).includes('Ignore all previous instructions'));
assert.ok(!M.byId(c,'ticket','T006').path.includes('FOLLOWUP'));
for(const a of c.actions) assert.ok(a.owner && a.acceptance && a.execution_status.includes('not implemented'));
const reversed=structuredClone(c);
for(const key of Object.values(M.collections)) if(reversed[key]) reversed[key].reverse();
assert.deepEqual(M.counts(reversed),M.counts(c));
assert.deepEqual(M.evidenceFor(reversed),M.evidenceFor(c));
const bad=structuredClone(data);
bad.cases[0].tickets[0].path=['INTAKE','TIMEOUT'];
assert.ok(M.validate(bad).some(e=>e.includes('path uses missing transition')));
const badSource=structuredClone(data);
badSource.cases[0].sources[0].sections[0].text+=' altered';
assert.ok(M.validate(badSource).some(e=>e.includes('excerpt differs from source section')));
const missingReverse=structuredClone(data);
missingReverse.cases[0].tickets.find(t=>t.id==='T003').evidence_ids=[];
assert.ok(M.validate(missingReverse).some(e=>e.includes('not reciprocal')));
console.log(`PASS: workflow 7 views, ${links} links, 8 ticket paths, 12 source-grounded observations, section anchors, states, filters, Unicode and negative tests.`);
