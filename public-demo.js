(function (root) {
  'use strict';
  const M = typeof module === 'object' && module.exports ? require('./demo/review-model.js') : root.TracewrightReviewModel;
  const W = typeof module === 'object' && module.exports ? require('./workflow-review.js') : root.TracewrightWorkflowUI;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const list = items => '<ul class="reading-list">' + items.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul>';
  const anchor = (c, kind, id, label) => '<a class="record-link" href="' + esc(M.hash({ case: c.id, view: M.viewFor[kind], item: id })) + '">' + esc(label || id) + '</a>';
  const refs = (c, kind, ids) => ids.length ? ids.map(id => anchor(c, kind, id)).join(' <span aria-hidden="true">/</span> ') : '<span class="empty-inline">No linked ' + esc(kind) + '</span>';
  const title = (heading, note) => '<header class="view-heading"><h2 class="view-title" tabindex="-1">' + esc(heading) + '</h2><p>' + esc(note) + '</p></header>';
  const attentionClass = value => ({ 'High attention': 'high', Review: 'review', Observe: 'observe', 'Mediated layer': 'mediated', 'Documented mismatch':'review','Control concern':'observe','Observed in this sample':'control' })[value] || 'neutral';
  const badge = (text, type = 'neutral') => '<span class="review-badge ' + esc(type) + '">' + esc(text) + '</span>';
  const relation = (c, key, id, field) => c[key].filter(item => (item[field] || []).includes(id));
  const helpers = { esc, list, anchor, refs, badge };

  function highlight(e) {
    const marks = e.marked_text.map(m => ({ start: e.excerpt.indexOf(m.text), end: e.excerpt.indexOf(m.text) + m.text.length })).filter(m => m.start >= 0).sort((a, b) => a.start - b.start);
    let cursor = 0;
    let output = '';
    for (const mark of marks) {
      if (mark.start < cursor) continue;
      output += esc(e.excerpt.slice(cursor, mark.start)) + '<mark>' + esc(e.excerpt.slice(mark.start, mark.end)) + '</mark>';
      cursor = mark.end;
    }
    return output + esc(e.excerpt.slice(cursor));
  }

  function summary(c,state) {
    if (c.kind === 'workflow') return W.summary(c,state,helpers);
    const n = M.counts(c);
    const countLink = (label, count, filters) => '<a class="count-link" href="' + esc(M.hash({ case: c.id, view: 'evidence', ...filters })) + '"><span>' + esc(label) + '</span><strong>' + count + '<small>observations</small></strong></a>';
    return title('Review question', c.stage) +
      '<section class="question-band"><h3>' + esc(c.question) + '</h3><p>' + esc(c.overview) + '</p></section>' +
      '<section class="inspect-band"><div class="section-heading"><h3>First places to inspect</h3><span>Suggested starting points</span></div><ol class="inspection-list">' + c.focus.map(f =>
        '<li>' + anchor(c, f.kind, f.id, f.title) + '<p>' + esc(f.description) + '</p><small>' + esc(f.id) + '</small></li>').join('') + '</ol></section>' +
      '<div class="summary-split"><section><h3>Review lanes</h3><p class="section-note">Which questions the linked observations address.</p>' +
        M.lanes.map(lane => countLink(lane, n.lanes[lane], { lane })).join('') + '</section>' +
      '<section><h3>Texture cues</h3><p class="section-note">Local wording or detail, and editorial surface. Neither establishes who wrote the text.</p>' +
        ['source_texture', 'mediation_polish'].map(axis => countLink(M.axes[axis], n.axes[axis], { axis })).join('') +
        '<p class="section-note">' + n.axes.not_applicable + ' observations address other questions. A count of 0 means no linked cue card in this demo, not absence of the feature.</p></section></div>' +
      '<details class="guide-details"><summary>Scope, limitations and interpretation</summary><div class="guide-body"><div class="guide-columns"><section><h3>Review posture</h3><p>' + esc(c.posture) + '</p><h3>Available material</h3><p>' + c.sources.length + ' inventory entries; ' + c.evidence.length + ' linked observations.</p>' + list(c.limitations) + '</section><section><h3>Must not conclude</h3>' + list(c.must_not_conclude) +
        '<p>A source-role label does not establish whether the underlying claim is true or false.</p><h3>Reader starting point</h3><p>' + esc(c.reader_intuition) + '</p><p class="section-note">An initial viewpoint, not corroborating evidence.</p></section></div><p class="boundary-note">A flag means inspect carefully, not that someone did something wrong.</p></div></details>' +
      (c.qualified_human_review_required ? '<aside class="qualified-review"><strong>Qualified human review required</strong><p>This case touches ' + esc(c.high_impact_context.join(', ')) + '. The map does not authorize a consequential decision or replace a domain specialist.</p></aside>' : '') +
      '<p class="demo-flow-note">Review materials <span aria-hidden="true">/</span> AI-assisted organization <span aria-hidden="true">/</span> Human inspection and decision. This read-only demo shows prepared results; it does not run an analysis.</p>';
  }

  function claims(c, state) {
    return title('Claims to examine', 'Statements and their support boundaries, independent of whether AI was involved.') +
      '<div class="claim-list">' + c.claims.map(claim => '<article class="claim-record record' + (state.item === claim.id ? ' is-target' : '') + '" id="' + esc(claim.id) + '" tabindex="-1"><div class="record-heading"><span class="record-id">' + esc(claim.id) + '</span>' + badge(claim.type) + '</div><h3>' + esc(claim.text) + '</h3><dl class="record-facts"><div><dt>Support in supplied material</dt><dd>' + esc(claim.support_status) + '</dd></div><div><dt>Review posture</dt><dd>' + esc(claim.review_posture) + '</dd></div></dl><div class="linked-row"><span>Materials</span><div>' + refs(c, 'source', claim.source_ids) + '</div></div><div class="linked-row"><span>Observations</span><div>' + refs(c, 'evidence', claim.evidence_ids) + '</div></div>' +
        (!claim.evidence_ids.length ? '<p class="missing-excerpt">No supporting passage is reproduced for this claim. Its presence in the claim list is not verification.</p>' : '') +
        '<div class="claim-actions"><h4>Next human check</h4>' + claim.action_ids.map(id => '<p>' + anchor(c, 'action', id, M.byId(c, 'action', id).text) + '</p>').join('') + '</div></article>').join('') + '</div>';
  }

  function evidenceCard(c, e, open) {
    const linkedClaims = relation(c, 'claims', e.id, 'evidence_ids');
    return '<details class="observation record' + (open ? ' is-target' : '') + '" id="' + esc(e.id) + '"' + (open ? ' open' : '') + '><summary><span class="observation-heading"><span class="record-id">' + esc(e.id) + '</span><strong>' + esc(e.title) + '</strong><span class="observation-meta">' + esc(e.lane) + ' <span aria-hidden="true">/</span> ' + esc(e.source_ids.join(', ')) + '</span></span>' + badge(e.attention, attentionClass(e.attention)) + '</summary><div class="observation-body"><div class="excerpt-heading"><h3>' + esc(e.excerpt_kind) + '</h3><div class="excerpt-refs">' + (e.source_refs ? e.source_refs.map(r=>W.sourcePart(c,r.source_id,r.section_id,null,helpers)).join(' / ') : refs(c, 'source', e.source_ids)) + '</div></div><blockquote>' + highlight(e) + '</blockquote>' +
      '<section class="observation-step"><h3>Observed point</h3><p>' + esc(e.observation) + '</p>' + e.marked_text.map(mark => '<dl class="marked-detail"><dt>' + esc(mark.text) + '</dt><dd><strong>' + esc(mark.label) + '.</strong> ' + esc(mark.reason) + '</dd></dl>').join('') + '</section>' +
      '<div class="reasoning-grid"><section><h3>Reasoning and limits</h3>' + list(e.reasoning_chain) + '</section><section><h3>Alternative explanations</h3>' + list(e.alternative_explanations) + '</section></div>' +
      '<div class="linked-row"><span>Related claims</span><div>' + refs(c, 'claim', linkedClaims.map(cl => cl.id)) + '</div></div>' +
      (c.kind==='workflow' ? '<div class="linked-row"><span>Related steps</span><div>'+refs(c,'step',e.step_ids)+'</div></div><div class="linked-row"><span>Trace record</span><div>'+refs(c,'ticket',e.ticket_ids)+'</div></div>' : '') +
      '<section class="claim-actions"><h3>Next human check</h3>' + e.action_ids.map(id => '<p>' + anchor(c, 'action', id, M.byId(c, 'action', id).text) + '</p>').join('') + '</section>' +
      (c.kind==='workflow' ? '<p class="cue-footnote">Observation limited to the fictional materials. Not a finding of wrongdoing or general AI performance.</p>' : '<p class="cue-footnote">Cue classification: ' + esc(M.axes[e.texture_axis]) + '. This observation is not an authorship or misconduct finding.</p>')+'</div></details>';
  }

  function evidence(c, state) {
    const items = M.evidenceFor(c, state);
    const options = (values, selected, all) => '<option value="">' + esc(all) + '</option>' + values.map(([value, label]) => '<option value="' + esc(value) + '"' + (selected === value ? ' selected' : '') + '>' + esc(label) + '</option>').join('');
    return title('Observation cards', 'Each card retains a passage or review note, the reasoning, alternative explanations and a next check.') +
      '<form id="evidence-filters" class="filter-bar" role="search"><label>Review lane<select name="lane" id="filter-lane">' + options(M.lanesFor(c).map(l => [l, l]), state.lane, 'All review lanes') + '</select></label>' +
      (c.kind==='workflow' ? '<label>Evidence state<select name="finding" id="filter-finding">'+options(Object.entries(M.findingStates),state.finding,'All states')+'</select></label>' : '<label>Cue type<select name="axis" id="filter-axis">'+options(Object.entries(M.axes),state.axis,'All cue types')+'</select></label>')+
      '<label>Material<select name="source" id="filter-source">' + options(M.sourceOrder(c).map(s => [s.id, s.id + ' / ' + s.author_role]), state.source, 'All materials') + '</select></label><label>Order<select name="sort" id="filter-sort"><option value="source"' + (state.sort !== 'lane' ? ' selected' : '') + '>Material date</option><option value="lane"' + (state.sort === 'lane' ? ' selected' : '') + '>Review lane</option></select></label>'+
      (c.kind==='workflow' ? '<label>Workflow step<select name="step" id="filter-step">'+options(c.steps.map(s=>[s.id,s.title]),state.step,'All steps')+'</select></label><label>Trace record<select name="ticket" id="filter-ticket">'+options(c.tickets.map(t=>[t.id,t.id+' / '+t.title]),state.ticket,'All records')+'</select></label>' : '')+
      '<label class="filter-query">Search observations<input type="search" name="q" id="filter-query" maxlength="200" value="' + esc(state.q || '') + '"></label><button type="submit" class="secondary">Apply filters</button></form>' +
      '<div class="results-line"><span>' + items.length + ' of ' + c.evidence.length + ' observations</span><a href="' + esc(M.hash({ case: c.id, view: 'evidence' })) + '">Clear filters</a></div>' +
      (items.length ? items.map(e => evidenceCard(c, e, e.id === state.item)).join('') : '<div class="empty-state"><h3>No observations match this selection</h3><p>No matching card is not evidence that a feature is absent. Change or clear the filters to inspect the other observations.</p></div>');
  }

  function sources(c, state) {
    return title('Review materials', c.kind==='workflow' ? 'Fictional materials in date order. Originals or audio not supplied remain unavailable; gaps are not filled in.' : 'Inventory in date order, using the start of supplied date ranges. Context stays separate; only displayed excerpts and summaries are available.') +
      '<div class="material-list">' + M.sourceOrder(c).map(s => {
        const observations = relation(c, 'evidence', s.id, 'source_ids');
        const relatedClaims = relation(c, 'claims', s.id, 'source_ids');
        const actions = relation(c, 'actions', s.id, 'source_ids');
        return '<details class="material record' + (s.target_status === 'context' ? ' context-material' : '') + (state.item === s.id ? ' is-target' : '') + '" id="' + esc(s.id) + '"' + (state.item === s.id ? ' open' : '') + '><summary><span class="material-heading"><span class="record-id">' + esc(s.id) + '</span><strong>' + esc(s.author_role) + '</strong><span class="material-date">' + esc(s.date) + '</span></span>' + badge(s.target_status === 'context' ? 'Context only' : 'Review target') + '</summary><div class="material-body"><p>' + esc(s.summary) + '</p><dl class="record-facts"><div><dt>Supplied reference</dt><dd>' + esc(s.reference) + '</dd></div><div><dt>Availability</dt><dd>'+(s.sections ? 'Full text of this constructed sample material, not a copy of a real record.' : 'Summary and linked excerpts only. Full original not supplied.')+'</dd></div></dl><div class="linked-row"><span>Observations</span><div>' + refs(c, 'evidence', observations.map(e => e.id)) + '</div></div><div class="linked-row"><span>Claims</span><div>' + refs(c, 'claim', relatedClaims.map(cl => cl.id)) + '</div></div><div class="linked-row"><span>Next checks</span><div>' + refs(c, 'action', actions.map(a => a.id)) + '</div></div>' +
          (s.sections ? s.sections.map(part=>'<section class="source-section'+(state.part===part.id && state.item===s.id?' is-target':'')+'" id="'+esc(s.id+'--'+part.id)+'" tabindex="-1"><h3>'+esc(part.id+' / '+part.title)+'</h3><p>'+esc(part.text)+'</p></section>').join('') : observations.length ? '<h3>Available passages and notes</h3>' + observations.map(e => '<section class="source-passage"><div class="excerpt-heading"><span>' + esc(e.excerpt_kind) + '</span>' + anchor(c, 'evidence', e.id, e.title) + '</div><blockquote>' + highlight(e) + '</blockquote></section>').join('') : '<p class="missing-excerpt">No passage is reproduced for this inventory entry.</p>') + '</div></details>';
      }).join('') + '</div>';
  }

  function actions(c, state) {
    return title('Next human checks', 'Priority indicates the suggested order of checking, not the likelihood of wrongdoing. No action is executed by this demo.') +
      '<div class="action-list">' + c.actions.map(a => '<article class="action-record record' + (state.item === a.id ? ' is-target' : '') + '" id="' + esc(a.id) + '" tabindex="-1"><div class="record-heading"><span class="record-id">' + esc(a.id) + '</span>' + badge(a.priority + ' priority', a.priority === 'High' ? 'review' : 'neutral') + '</div><h3>' + esc(a.text) + '</h3><p><strong>Why this priority:</strong> ' + esc(a.priority_reason) + '</p>'+
      (a.owner ? '<p><strong>Suggested review owner:</strong> '+esc(a.owner)+'</p><dl class="record-facts"><div><dt>Proposed check / improvement</dt><dd>'+esc(a.proposal)+'</dd></div><div><dt>Acceptance evidence</dt><dd>'+esc(a.acceptance)+'</dd></div></dl><p class="action-state">'+esc(a.execution_status)+'</p>' : '')+
      '<div class="linked-row"><span>Materials</span><div>' + refs(c, 'source', a.source_ids) + '</div></div><div class="linked-row"><span>Claims</span><div>' + refs(c, 'claim', relation(c, 'claims', a.id, 'action_ids').map(cl => cl.id)) + '</div></div><div class="linked-row"><span>Observations</span><div>' + refs(c, 'evidence', relation(c, 'evidence', a.id, 'action_ids').map(e => e.id)) + '</div></div></article>').join('') + '</div>';
  }

  const renderers = { summary, claims, evidence, sources, 'follow-up': actions,workflow:(c,s)=>W.workflow(c,s,helpers),controls:(c,s)=>W.controls(c,s,helpers) };
  function render(c, state) {
    const missing = state.item && !M.itemForView(c,state.view,state.item);
    const notice = missing ? '<p class="route-notice" role="status">The requested record is not in this case. Its review view is shown below.</p>' : '';
    return notice + renderers[state.view](c, state);
  }

  function mount(data, document, window) {
    const errors = M.validate(data);
    if (errors.length) {
      document.getElementById('summary').innerHTML = '<h2>Review data needs repair</h2><p>The demo could not validate its references. No assessment is shown.</p>';
      window.console.error(errors);
      return;
    }
    const get = id => document.getElementById(id);
    let current;
    let pendingFocus;
    const main = document.querySelector('main');
    get('caseList').innerHTML = data.cases.map(c => '<a class="project-item" data-case="' + esc(c.id) + '" href="' + esc(M.hash({ case: c.id, view: 'summary' })) + '"><strong>' + esc(c.short_name) + '</strong><span>' + esc(c.stage) + '</span></a>').join('');
    get('mobile-case-select').innerHTML = data.cases.map(c => '<option value="' + esc(c.id) + '">' + esc(c.short_name) + '</option>').join('');
    get('case-count').textContent = data.cases.length;

    function paint(navigate) {
      current = M.route(window.location.hash, data);
      const c = data.cases.find(item => item.id === current.case);
      main.classList.toggle('workflow-mode',c.kind==='workflow');
      document.documentElement.lang = 'en';
      get('intake-link').setAttribute('href','intake.html?kind='+(c.kind==='workflow'?'workflow':'narrative'));
      get('name').textContent = c.short_name;
      get('stage').textContent = c.stage;
      get('count').textContent = c.sources.length + ' materials / ' + c.evidence.length + ' observations';
      get('level').textContent = c.posture;
      get('mobile-case-select').value = c.id;
      for (const [id, items] of [['claim-count', c.claims], ['evidence-count', c.evidence], ['source-count', c.sources], ['follow-up-count', c.actions]]) get(id).textContent = items.length;
      document.querySelectorAll('[data-case]').forEach(a => {
        const selected = a.dataset.case === c.id;
        a.classList.toggle('active', selected);
        if (selected) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      document.querySelectorAll('[data-view]').forEach(button => {
        button.hidden = !M.viewsFor(c).includes(button.dataset.view);
        const active = button.dataset.view === current.view;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      for (const view of M.views) {
        get(view).classList.toggle('active', current.view === view);
        get(view).hidden = current.view !== view;
        get(view).innerHTML = current.view === view ? render(c, current) : '';
      }
      if (navigate) window.requestAnimationFrame(() => {
        const record = current.item && ((current.part && get(current.item+'--'+current.part)) || get(current.item));
        const target = record ? (record.tagName === 'DETAILS' ? record.querySelector('summary') : record) : pendingFocus ? get(pendingFocus) : get(current.view).querySelector('.view-title');
        pendingFocus = null;
        if (target) {
          target.focus({ preventScroll: true });
          const scrollTarget = target.id.startsWith('tab-') ? get(current.view).querySelector('.view-title') : target;
          if (scrollTarget) {
            scrollTarget.style.scrollMarginTop = (document.querySelector('.review-tabs').getBoundingClientRect().height + 16) + 'px';
            scrollTarget.scrollIntoView({ block: 'start' });
          }
        }
      });
    }

    function go(state, replace = false) {
      const next = M.hash(state);
      if (replace) { window.history.replaceState(null, '', next); paint(true); }
      else if (window.location.hash === next) paint(true);
      else window.location.hash = next;
    }
    document.querySelector('.review-tabs').addEventListener('click', event => {
      const button = event.target.closest('[data-view]');
      if (button) go({ case: current.case, view: button.dataset.view });
    });
    document.querySelector('.review-tabs').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const available = M.viewsFor(data.cases.find(c=>c.id===current.case));
      const index = available.indexOf(current.view);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length;
      pendingFocus = 'tab-' + available[next];
      go({ case: current.case, view: available[next] });
    });
    get('mobile-case-select').addEventListener('change', event => go({ case: event.target.value, view: 'summary' }));
    main.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#case="]');
      if (link && link.getAttribute('href') === window.location.hash) { event.preventDefault(); paint(true); }
    });
    function applyFilters(form) {
      const values = Object.fromEntries(new window.FormData(form));
      go({ case: current.case, view: 'evidence', ...values });
    }
    main.addEventListener('submit', event => {
      if (event.target.id !== 'evidence-filters') return;
      event.preventDefault();
      pendingFocus = 'filter-query';
      applyFilters(event.target);
    });
    main.addEventListener('change', event => {
      if (event.target.matches('.workflow-select')) { pendingFocus=event.target.id; go({case:current.case,view:'workflow',route:event.target.value}); return; }
      if (!event.target.matches('#evidence-filters select')) return;
      pendingFocus = event.target.id;
      applyFilters(event.target.form);
    });
    window.addEventListener('hashchange', () => paint(true));
    paint(!!window.location.hash);
  }

  const api = { esc, highlight, render, mount };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.TracewrightDemoUI = api; mount(root.TracewrightDemoData, root.document, root); }
})(typeof globalThis !== 'undefined' ? globalThis : this);
