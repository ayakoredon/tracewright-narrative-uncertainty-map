const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const base=require('../demo/cases');
const support=require('../demo/workflow-case');
const access=require('../demo/access-case');
const M=require('../demo/review-model');
const I=require('../demo/intake-model');
const UI=require('../public-demo');
const IntakeUI=require('../intake');
const data={...base,cases:[access,support,...base.cases]};
const cjk=/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;
const privatePaths=/iCloudDrive|OneDrive|file:\/\/|[A-Z]:\\/i;
assert.equal(data.cases.length,9);
assert.deepEqual(M.validate(data),[]);
assert.deepEqual(data.cases.filter(c=>c.kind==='workflow').map(c=>c.id).sort(),['global-support','privileged-access']);
assert.ok(!privatePaths.test(JSON.stringify(data)));
assert.ok(!cjk.test(JSON.stringify(data)));
const uiFiles=['index.html','intake.html','public-demo.js','workflow-review.js','intake.js','demo/review-model.js','demo/intake-model.js'];
for(const name of uiFiles) {
  const bytes=fs.readFileSync(path.join(root,name));
  const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  assert.ok(!cjk.test(text),name+' contains untranslated UI');
  assert.ok(!privatePaths.test(text),name+' contains a private path');
  assert.ok(!/\uFFFD|Ã©|â€™/.test(text),name+' has suspicious encoding');
  if(name.endsWith('.js')) new vm.Script(text,{filename:name});
  else {
    assert.match(text,/<html lang="en">/);
    assert.match(text,/<meta charset="utf-8">/i);
    for(const [,ref] of text.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if(/^(https?:|#)/.test(ref)) continue;
      const target=path.resolve(root,ref.split(/[?#]/)[0]);
      assert.ok(fs.existsSync(target),name+' missing asset or document: '+ref);
    }
  }
}
let views=0;
assert.match(fs.readFileSync(path.join(root,'public-demo.js'),'utf8'),/document\.documentElement\.lang = 'en'/);
for(const c of data.cases) for(const view of M.viewsFor(c)) {
  const html=UI.render(c,{view});
  assert.ok(!cjk.test(html),c.id+'/'+view);
  assert.ok(!/undefined|NaN|Dashboard render error/.test(html),c.id+'/'+view);
  views++;
}
for(const c of [support,access]) {
  const d=I.sample(c,'english-'+c.id,'2026-09-08T08:00:00Z');
  for(let page=0;page<4;page++) assert.ok(!cjk.test(IntakeUI.render(d,page)));
  assert.ok(!cjk.test(I.brief(d)));
  assert.deepEqual(I.parse(JSON.stringify(d)),d);
}
assert.equal(support.tickets.find(t=>t.id==='T002').source_text,'La base se recalentó y me quemó dos dedos. Ya fui a urgencias.');
assert.equal(support.tickets.find(t=>t.id==='T003').source_text,null);
assert.ok(support.tickets.find(t=>t.id==='T005').events.at(-1)[2].includes('Es gab kein Feuer.'));
assert.equal(support.tickets.find(t=>t.id==='T008').source_text,'Tout est dans le message vocal joint.');
assert.equal(access.id,'privileged-access');
assert.ok(access.must_not_conclude.join(' ').includes('not a reconstruction'));
console.log(`PASS: English release, ${views} case/views, 8 sample intake pages, exact multilingual originals, UTF-8, links and fixture boundaries.`);
