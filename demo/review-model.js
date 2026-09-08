(function (root) {
  'use strict';
  const views = ['summary', 'workflow', 'controls', 'claims', 'evidence', 'sources', 'follow-up'];
  const viewsFor = c => c.kind === 'workflow' ? views : views.filter(v => !['workflow','controls'].includes(v));
  const lanes = ['Claim reliability', 'Authorship / mediation', 'Disclosure / provenance'];
  const axes = { source_texture: 'Source-grounded texture cues', mediation_polish: 'Mediation-polish cues', not_applicable: 'Other observations' };
  const lanesFor = c => c.review_lanes || lanes;
  const routesFor = c => c.workflow_ui?.routes || {routine:'Routine response',safety:'Safety response',irregular:'Irregular'};
  const findingStates = { observed_gap: 'Documented mismatch', concern: 'Control concern', unknown: 'Not established', observed_control: 'Observed in this sample' };
  const collections = { claim: 'claims', evidence: 'evidence', source: 'sources', action: 'actions', step:'steps', ticket:'tickets', control:'controls' };
  const viewFor = { claim: 'claims', evidence: 'evidence', source: 'sources', action: 'follow-up', step:'workflow', ticket:'workflow', control:'controls' };
  const byId = (c, kind, id) => (c[collections[kind]] || []).find(item => item.id === id);
  const itemForView = (c, view, id) => Object.keys(viewFor).filter(k => viewFor[k] === view).map(k => byId(c,k,id)).find(Boolean);

  function validate(data) {
    const errors = [];
    const expect = (ok, message) => { if (!ok) errors.push(message); };
    if (!data || !Array.isArray(data.cases) || !data.cases.length) return ['Cases must be a nonempty array.'];
    const caseIds = new Set();
    for (const c of data.cases) {
      expect(typeof c.id === 'string' && !caseIds.has(c.id), 'Duplicate or missing case ID.');
      caseIds.add(c.id);
      const ids = new Set();
      const arrays = ['sources', 'claims', 'evidence', 'actions', 'focus', 'limitations', 'must_not_conclude'];
      if (arrays.some(key => !Array.isArray(c[key]))) { errors.push(c.id + ': missing collection.'); continue; }
      for (const kind of Object.keys(collections)) {
        for (const item of c[collections[kind]] || []) {
          expect(typeof item.id === 'string' && !ids.has(item.id), c.id + ': duplicate or missing item ID.');
          ids.add(item.id);
          for (const [key, target] of [['source_ids', 'source'], ['evidence_ids', 'evidence'], ['action_ids', 'action'],['step_ids','step'],['ticket_ids','ticket']]) {
            if (!(key in item)) continue;
            expect(Array.isArray(item[key]), item.id + ': ' + key + ' must be an array.');
            if (Array.isArray(item[key])) for (const id of item[key]) expect(!!byId(c, target, id), item.id + ': unresolved ' + target + ' ' + id);
          }
        }
      }
      for (const s of c.sources) expect(['target', 'context'].includes(s.target_status), s.id + ': invalid source role.');
      for (const e of c.evidence) {
        expect(lanesFor(c).includes(e.lane), e.id + ': invalid review lane.');
        expect(Object.hasOwn(axes, e.texture_axis), e.id + ': invalid cue type.');
        expect(typeof e.excerpt === 'string' && !!e.excerpt, e.id + ': missing excerpt or review note.');
        for (const field of ['marked_text', 'reasoning_chain', 'alternative_explanations']) expect(Array.isArray(e[field]), e.id + ': invalid ' + field);
        if (Array.isArray(e.marked_text) && typeof e.excerpt === 'string') {
          for (const mark of e.marked_text) expect(e.excerpt.includes(mark.text), e.id + ': marked text absent from excerpt.');
        }
      }
      for (const a of c.actions) expect(['High', 'Medium', 'Low'].includes(a.priority) && !!a.priority_reason, a.id + ': priority requires a rationale.');
      for (const f of c.focus) expect(!!byId(c, f.kind, f.id), c.id + ': unresolved focus ' + f.id);
      if (c.kind === 'workflow') {
        expect(c.id==='global-support' || !!c.workflow_ui,c.id+': missing workflow presentation.');
        for(const aux of c.workflow_ui?.auxiliary_nodes || []) expect(!!byId(c,'step',aux.step_id),c.id+': missing auxiliary step.');
        for(const r of c.workflow_ui?.access?.source_ids || []) expect(!!byId(c,'source',r),c.id+': missing access source.');
        for (const e of c.evidence) {
          expect(Object.hasOwn(findingStates,e.finding_state),e.id + ': invalid finding state.');
          const passages = (e.source_refs || []).map(r => byId(c,'source',r.source_id)?.sections?.find(s=>s.id===r.section_id)?.text);
          expect(passages.length > 0 && passages.every(Boolean),e.id + ': missing source section.');
          expect(passages.join('\n\n') === e.excerpt,e.id + ': excerpt differs from source section.');
          for (const ticketId of e.ticket_ids || []) expect(byId(c,'ticket',ticketId)?.evidence_ids?.includes(e.id),e.id + ': ticket observation link is not reciprocal.');
        }
        const edgeIds = new Set();
        for (const edge of c.transitions || []) {
          expect(!edgeIds.has(edge.id),edge.id + ': duplicate transition.'); edgeIds.add(edge.id);
          expect(!!byId(c,'step',edge.from) && !!byId(c,'step',edge.to),edge.id + ': unresolved step.');
        }
        for (const ticket of c.tickets || []) {
          expect(Object.hasOwn(routesFor(c),ticket.route),ticket.id+': invalid route.');
          for(const r of ticket.source_refs || []) expect(!!byId(c,'source',r.source_id)?.sections?.find(s=>s.id===r.section_id),ticket.id+': missing ticket source section.');
          for (const evidenceId of ticket.evidence_ids || []) expect(byId(c,'evidence',evidenceId)?.ticket_ids?.includes(ticket.id),ticket.id + ': ticket observation link is not reciprocal.');
          for (const step of ticket.path) expect(!!byId(c,'step',step),ticket.id + ': missing path step.');
          for (let i=1;i<ticket.path.length;i++) expect(c.transitions.some(e=>e.from===ticket.path[i-1] && e.to===ticket.path[i]),ticket.id + ': path uses missing transition.');
          expect(ticket.events.every((e,i)=>!i || e[0]>=ticket.events[i-1][0]),ticket.id + ': events out of time order.');
        }
      }
    }
    return errors;
  }

  function counts(c) {
    const result = { lanes: Object.fromEntries(lanesFor(c).map(l => [l, 0])), axes: Object.fromEntries(Object.keys(axes).map(a => [a, 0])) };
    for (const e of c.evidence) { result.lanes[e.lane]++; result.axes[e.texture_axis]++; }
    return result;
  }

  function sourceOrder(c) {
    return [...c.sources].sort((a, b) => a.date.localeCompare(b.date, 'en', { numeric: true }) || a.id.localeCompare(b.id));
  }

  function evidenceFor(c, filters = {}) {
    const query = (filters.q || '').trim().toLowerCase();
    const rank = new Map(sourceOrder(c).map((s, i) => [s.id, i]));
    const firstSource = e => Math.min(...e.source_ids.map(id => rank.get(id)), Infinity);
    const evidence = c.evidence.filter(e =>
      (!filters.lane || e.lane === filters.lane) && (!filters.axis || e.texture_axis === filters.axis) &&
      (!filters.source || e.source_ids.includes(filters.source)) &&
      (!filters.step || (e.step_ids || []).includes(filters.step)) && (!filters.ticket || (e.ticket_ids || []).includes(filters.ticket)) &&
      (!filters.finding || e.finding_state === filters.finding) &&
      (!query || [e.id, e.title, e.excerpt, e.observation, e.reasoning_chain.join(' '), e.alternative_explanations.join(' ')].join(' ').toLowerCase().includes(query))
    );
    return evidence.sort((a, b) => (filters.sort === 'lane' ? lanesFor(c).indexOf(a.lane) - lanesFor(c).indexOf(b.lane) : firstSource(a) - firstSource(b)) || a.id.localeCompare(b.id));
  }

  function route(hash, data) {
    const p = new URLSearchParams(hash.replace(/^#/, ''));
    const fallback = data.default_case || 'academic';
    const caseId = data.cases.some(c => c.id === p.get('case')) ? p.get('case') : fallback;
    const current = data.cases.find(c => c.id === caseId) || data.cases[0];
    return {
      case: current.id, view: viewsFor(current).includes(p.get('view')) ? p.get('view') : 'summary',
      item: p.get('item') || '', lane: lanesFor(current).includes(p.get('lane')) ? p.get('lane') : '',
      axis: Object.hasOwn(axes, p.get('axis')) ? p.get('axis') : '', source: p.get('source') || '',
      q: (p.get('q') || '').slice(0, 200), sort: p.get('sort') === 'lane' ? 'lane' : 'source',
      part:p.get('part') || '',step:p.get('step') || '',ticket:p.get('ticket') || '',route:Object.hasOwn(routesFor(current),p.get('route')) ? p.get('route') : '',
      finding:Object.hasOwn(findingStates,p.get('finding')) ? p.get('finding') : ''
    };
  }

  function hash(state) {
    const p = new URLSearchParams();
    for (const key of ['case', 'view', 'item', 'part', 'lane', 'axis', 'source', 'q', 'sort','step','ticket','route','finding']) if (state[key] && !(key === 'sort' && state[key] === 'source')) p.set(key, state[key]);
    return '#' + p.toString();
  }

  const api = { views, viewsFor, lanes, lanesFor, routesFor, findingStates, axes, collections, viewFor, byId, itemForView, validate, counts, sourceOrder, evidenceFor, route, hash };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TracewrightReviewModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
