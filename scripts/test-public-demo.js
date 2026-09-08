const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../demo/cases.js');
const M = require('../demo/review-model.js');
const UI = require('../public-demo.js');
const root = path.resolve(__dirname, '..');

assert.deepEqual(M.validate(data), [], 'All fixture IDs, excerpts and relationships must resolve.');
assert.equal(data.cases.length, 7);
assert.equal(M.route('', data).case, 'academic');
assert.equal(M.route('#case=invalid&view=unknown', data).view, 'summary');
let rendered = 0;
let checkedLinks = 0;
for (const c of data.cases) {
  const counts = M.counts(c);
  assert.equal(Object.values(counts.lanes).reduce((a, b) => a + b, 0), c.evidence.length);
  assert.equal(Object.values(counts.axes).reduce((a, b) => a + b, 0), c.evidence.length);
  for (const lane of M.lanesFor(c)) assert.equal(M.evidenceFor(c, { lane }).length, counts.lanes[lane]);
  for (const axis of Object.keys(M.axes)) assert.equal(M.evidenceFor(c, { axis }).length, counts.axes[axis]);
  const reversed = structuredClone(c);
  for (const key of Object.values(M.collections)) if (Array.isArray(reversed[key])) reversed[key].reverse();
  assert.deepEqual(M.counts(reversed), counts);
  assert.deepEqual(M.sourceOrder(reversed), M.sourceOrder(c));
  assert.deepEqual(M.evidenceFor(reversed), M.evidenceFor(c));
  for (const view of M.viewsFor(c)) {
    const html = UI.render(c, { view });
    assert.ok(html.trim(), c.id + ': blank ' + view);
    assert.ok(!/undefined|NaN/.test(html));
    for (const match of html.matchAll(/href="(#case=[^"]+)"/g)) {
      const state = M.route(match[1].replaceAll('&amp;', '&'), data);
      assert.equal(state.case, c.id);
      if (state.item) {
        const kind = Object.keys(M.viewFor).find(key => M.viewFor[key] === state.view);
        assert.ok(M.byId(c, kind, state.item), c.id + ': unresolved visible link ' + state.item);
        assert.ok(M.byId(reversed, kind, state.item), 'Sorting must not change the link target.');
      }
      checkedLinks++;
    }
    rendered++;
  }
  for (const e of c.evidence) {
    const opened = UI.render(c, { view: 'evidence', item: e.id });
    assert.ok(opened.includes('id="' + e.id + '" open'));
    assert.equal((opened.match(/" open>/g) || []).length, 1, 'Only the requested observation opens.');
  }
  const closed = UI.render(c, { view: 'evidence' });
  assert.equal((closed.match(/" open>/g) || []).length, 0);
  assert.ok(UI.render(c, { view: 'evidence', q: 'no-matching-test-phrase-48731' }).includes('No observations match'));
  assert.ok(UI.render(c, { view: 'claims', item: 'not-a-record' }).includes('requested record is not in this case'));
  for (const a of c.actions) assert.deepEqual(M.byId(reversed, 'action', a.id), a);
}

const academic = data.cases.find(c => c.id === 'academic');
const resultClaim = M.byId(academic, 'claim', 'CL-E-RESULT');
assert.deepEqual(resultClaim.action_ids, ['ACT-E-RESULT']);
assert.match(M.byId(academic, 'action', resultClaim.action_ids[0]).text, /31%/);
assert.deepEqual(resultClaim.evidence_ids, [], 'Do not fabricate a result excerpt.');
assert.equal(M.counts(academic).axes.source_texture, 0);
assert.equal(M.counts(academic).axes.mediation_polish, 0, 'A method gap is not a polish cue.');
const broken = structuredClone(data);
broken.cases[0].claims[0].action_ids = ['DOES-NOT-EXIST'];
assert.ok(M.validate(broken).some(error => error.includes('unresolved action')));
const badExcerpt = structuredClone(data);
badExcerpt.cases[0].evidence[0].marked_text[0].text = 'not in the supplied excerpt';
assert.ok(M.validate(badExcerpt).some(error => error.includes('marked text absent')));
assert.equal(UI.esc('<script>"&'), '&lt;script&gt;&quot;&amp;');
const unicode = '\u65e5\u672c\u8a9e / fran\u00e7ais / \u00c9lodie';
assert.equal(UI.esc(unicode), unicode);
const route = { case: 'mixed', view: 'evidence', q: 'a & b', lane: 'Claim reliability', sort: 'lane' };
assert.equal(M.route(M.hash(route), data).q, route.q);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const script of ['demo/cases.js', 'demo/review-model.js', 'public-demo.js']) assert.ok(html.includes('src="' + script + '?'));
assert.ok(html.includes('role="tablist"'));
assert.equal((html.match(/role="tabpanel"/g) || []).length, M.views.length);
assert.ok(fs.readFileSync(path.join(root, 'demo/index.html'), 'utf8').includes('window.location.search'));

// Exercise the controller separately from pure HTML rendering. Browser layout is a separate QA step.
function controllerHarness() {
  const node = (id, dataset = {}) => ({
    id, dataset, innerHTML: '', textContent: '', value: '', hidden: false, handlers: {}, attributes: {}, style: {},
    classList: { toggle() {} },
    addEventListener(type, listener) { this.handlers[type] = listener; },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    querySelector() { return null; }, focus() {}, scrollIntoView() {}, getBoundingClientRect() { return { height: 172 }; }
  });
  const elements = new Map([...html.matchAll(/id="([^"]+)"/g)].map(match => [match[1], node(match[1])]));
  const tabs = M.views.map(view => { const tab = elements.get('tab-' + view); tab.dataset.view = view; return tab; });
  const caseLinks = data.cases.map(c => node(c.id, { case: c.id }));
  const main = node('main');
  const tablist = node('tablist');
  const events = {};
  let hash = '';
  const window = {
    console, FormData: class { constructor(form) { return Object.entries(form.values); } },
    location: { get hash() { return hash; }, set hash(value) { hash = value; if (events.hashchange) events.hashchange(); } },
    history: { replaceState(_a, _b, value) { hash = value; } },
    addEventListener(type, listener) { events[type] = listener; }, requestAnimationFrame(callback) { callback(); }
  };
  const document = {
    documentElement: node('html'),
    getElementById(id) { return elements.get(id); },
    querySelector(selector) { return selector === 'main' ? main : selector === '.review-tabs' ? tablist : null; },
    querySelectorAll(selector) { return selector === '[data-view]' ? tabs : selector === '[data-case]' ? caseLinks : []; }
  };
  UI.mount(data, document, window);
  assert.equal(elements.get('name').textContent, academic.short_name);
  assert.equal(elements.get('summary').hidden, false);
  assert.equal(elements.get('evidence').hidden, true);
  tablist.handlers.click({ target: { closest: () => tabs.find(t => t.dataset.view === 'evidence') } });
  assert.equal(elements.get('evidence').hidden, false);
  assert.equal(elements.get('summary').innerHTML, '');
  assert.equal(elements.get('tab-evidence').attributes['aria-selected'], 'true');
  const form = { id: 'evidence-filters', values: { lane: 'Claim reliability', axis: '', source: 'P002', sort: 'source', q: '' } };
  main.handlers.submit({ target: form, preventDefault() {} });
  assert.ok(elements.get('evidence').innerHTML.includes('1 of 3 observations'));
  tablist.handlers.keydown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(elements.get('tab-sources').attributes['aria-selected'], 'true');
  elements.get('mobile-case-select').handlers.change({ target: { value: 'mixed' } });
  assert.equal(elements.get('name').textContent, data.cases.find(c => c.id === 'mixed').short_name);
  window.location.hash = '#case=academic&view=claims&item=CL-E-RESULT';
  assert.ok(elements.get('claims').innerHTML.includes('record is-target" id="CL-E-RESULT"'));
  assert.ok(elements.get('claims').innerHTML.includes('ACT-E-RESULT'));
}
controllerHarness();
assert.ok(M.validate(undefined).length);
console.log(`PASS: ${rendered} rendered case/views, ${checkedLinks} valid links, all cue counts, exact excerpt marks, stable IDs, priorities, filters, deep links, controller navigation, escaping and Unicode.`);
