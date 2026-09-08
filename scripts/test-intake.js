const assert = require('node:assert/strict');
const M = require('../demo/intake-model');
const UI = require('../intake');
const sampleCase = require('../demo/workflow-case');
const now = '2026-09-07T04:00:00.000Z';
let checks = 0;
const check = (label, fn) => { fn(); checks++; console.log('PASS: ' + label); };
const draft = () => M.create('test-draft', 'workflow', now);
const example = M.sample(sampleCase, 'example', now);
check('Empty drafts accept missing information without risk conclusions', () => {
  for (const kind of ['workflow','narrative']) {
    const d = M.create('empty',kind,now);
    assert.deepEqual(M.validate(d),[]);
    assert.deepEqual(M.parse(JSON.stringify(d)),d);
    assert.ok(M.questions(d).some(q=>q.id==='impact'));
    assert.equal(M.packet(d).safety.impact_assessment_status,'not_independently_assessed');
  }
});
check('Eight page renders, unique field IDs, escaped values and labels', () => {
  for (const kind of ['workflow','narrative']) {
    const d = structuredClone(example); d.kind=kind;
    d.scope.title='<script>bad()</script> "é日本語"';
    for(let page=0;page<4;page++) {
      const html=UI.render(d,page);
      assert.ok(html.length>500);
      assert.ok(!/undefined|NaN|<script>bad/.test(html));
      const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
      assert.equal(ids.length,new Set(ids).size);
      for(const [,id] of html.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(id),id);
    }
  }
});
check('Synthetic sample preserves 10 stages, 12 paths, 9 material records', () => {
  assert.deepEqual(M.validate(example),[]);
  assert.equal(example.workflow.steps.length,10);
  assert.equal(example.workflow.transitions.length,12);
  assert.equal(example.materials.length,9);
  assert.equal(example.origin,'synthetic_example');
  assert.ok(!Object.hasOwn(M.packet(example),'evidence'));
  assert.ok(!Object.hasOwn(M.packet(example),'findings'));
  assert.equal(example.answers.handoff.status,'answered');
  assert.equal(example.answers.handoff.basis,'statement');
});
check('Unicode, quotation marks and source roles survive JSON round trips', () => {
  const d=draft(); const m=M.newMaterial('MAT-001');
  d.scope.title='François / 日本語 / محمد / é̀';
  d.workflow.flow_notes='"原文" → réponse\n第二行';
  Object.assign(m,{title:'問合せ_é.txt',author_role:'利用者（背景情報）',role:'context',file_name:'問合せ_é.txt',file_size:21,file_modified:1700000000000,content_status:'metadata_only'});
  d.materials.push(m);
  assert.deepEqual(M.parse(JSON.stringify(d)),d);
  assert.equal(M.packet(d).materials[0].date,'');
  assert.equal(M.packet(d).materials[0].role,'context');
});
check('Branch and conditional modules: retained in draft, excluded from AI request', () => {
  const d=draft();
  d.narrative.provenance='PRIVATE_INACTIVE_NARRATIVE';
  d.answers.medical_scope.text='PRIVATE_INACTIVE_MEDICAL';
  d.answers.source_roles.text='PRIVATE_INACTIVE_SOURCE_ROLES';
  assert.ok(!M.brief(d).includes('PRIVATE_INACTIVE'));
  assert.ok(JSON.stringify(M.parse(JSON.stringify(d))).includes('PRIVATE_INACTIVE_MEDICAL'));
  assert.equal(M.activeModules(d).length,8);
  d.scope.impacts=['medical','esg','remedy'];
  assert.equal(M.activeModules(d).length,11);
  assert.ok(M.brief(d).includes('PRIVATE_INACTIVE_MEDICAL'));
  d.kind='narrative'; d.scope.impacts=[]; d.workflow.flow_notes='PRIVATE_INACTIVE_WORKFLOW';
  assert.equal(M.activeModules(d).length,3);
  assert.ok(M.brief(d).includes('PRIVATE_INACTIVE_NARRATIVE'));
  assert.ok(!M.brief(d).includes('PRIVATE_INACTIVE_WORKFLOW'));
});
check('Information states do not collapse into absent controls or confirmed operation', () => {
  const d=draft();
  for(const state of Object.keys(M.states)) {
    d.answers.handoff.status=state; d.answers.handoff.text='';
    assert.deepEqual(M.validate(d),[]);
    assert.ok(M.questions(d).some(q=>q.id==='handoff'));
    assert.equal(M.packet(d).information_entries.find(m=>m.id==='handoff').status,state);
  }
  d.answers.handoff.status='not_applicable'; d.answers.handoff.text='分析対象にこの経路は含まれないとの説明。';
  assert.ok(!M.questions(d).some(q=>q.id==='handoff'));
  d.answers.handoff.status='answered';
  assert.equal(M.packet(d).safety.assessment_status,'not_started');
});
check('Input provenance, missing source contents and human confirmation remain explicit', () => {
  const p=M.packet(example);
  assert.equal(p.safety.source_contents_included,false);
  assert.equal(p.safety.external_transmission_performed,false);
  assert.equal(p.safety.human_structure_confirmation,'pending');
  assert.equal(p.safety.qualified_human_review_required,true);
  assert.equal(p.packet_kind,'unanalysed_intake');
  assert.ok(p.safety.must_not_conclude.length>=4);
  assert.ok(p.next_questions.some(q=>q.id==='source_contents'));
  assert.ok(M.brief(example).includes('not instructions to execute'));
  assert.ok(M.brief(example).includes('Do not claim to have read a file from its name'));
});
check('Invalid schemas, enums, oversized imports and dangling refs rejected', () => {
  const corruptions=[d=>d.schema_version='else',d=>d.scope.stage='approved',d=>d.scope.impacts=['fiction'],d=>d.scope.question='x'.repeat(12001),d=>d.workflow.steps=[M.newStep('END')],d=>d.answers.handoff.status='confirmed',d=>d.answers.handoff.material_ids=['MISSING'],d=>d.workflow.transitions=[{...M.newTransition('BR-001'),to:'MISSING'}],d=>d.materials=[{...M.newMaterial('M001'),content_status:'body_read'}],d=>d.workflow.steps=[M.newStep('same'),M.newStep('same')],d=>d.materials=Array.from({length:41},(_,i)=>M.newMaterial('M'+i))];
  for(const change of corruptions) { const d=draft(); change(d); assert.ok(M.validate(d).length); assert.throws(()=>M.parse(JSON.stringify(d))); }
  for(const raw of ['{broken','null','[]','"string"',' '.repeat(1500001)]) assert.throws(()=>M.parse(raw));
});
check('Unknown extra properties, prototype keys and unselected content are not forwarded', () => {
  const d=draft(); d.materials.push(M.newMaterial('M001'));
  d.materials[0].raw_text='MUST_NOT_FORWARD_BODY'; d.scope.secret='MUST_NOT_FORWARD_SECRET';
  const raw=JSON.stringify(d).replace('"scope":{','"scope":{"__proto__":{"polluted":true},');
  assert.ok(!JSON.stringify(M.parse(raw)).includes('MUST_NOT_FORWARD'));
  assert.ok(!M.brief(d).includes('MUST_NOT_FORWARD'));
  assert.equal({}.polluted,undefined);
});
check('Unspecified connections are permitted but surfaced; terminal END is explicit', () => {
  const d=draft(); d.workflow.steps.push(M.newStep('ST-001')); d.workflow.transitions.push(M.newTransition('BR-001'));
  assert.deepEqual(M.validate(d),[]);
  assert.ok(M.questions(d).some(q=>q.id==='BR-001'));
  Object.assign(d.workflow.transitions[0],{from:'ST-001',to:'END',kind:'stop',condition:'担当者が打切りを承認したとき'});
  assert.deepEqual(M.validate(d),[]);
  assert.ok(!M.questions(d).some(q=>q.id==='BR-001'));
});
console.log(`PASS: ${checks} intake test groups; registration remains separate from analysis.`);
if(process.argv.includes('--fixtures')) {
  const fs=require('node:fs'); const path=require('node:path');
  const out=path.resolve(__dirname,'../../outputs/review-intake-20260907');
  fs.mkdirSync(out,{recursive:true});
  const fixture=structuredClone(example); fixture.scope.title='Import QA / 日本語・français';
  fs.writeFileSync(path.join(out,'intake-import-qa.json'),JSON.stringify(fixture,null,2),'utf8');
  fs.writeFileSync(path.join(out,'intake-invalid-qa.json'),JSON.stringify({schema_version:'unsupported',text:'Must not replace current input'}),'utf8');
  console.log('Generated synthetic import fixtures: '+out);
}
