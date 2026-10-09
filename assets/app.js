(function () {
  const { products, patterns, components, industries } = INSPUX;
  MOCK.setLabeler((id) => (components[id] ? components[id].name : id));

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem('inspux.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('inspux.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  const svg = (d, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const I = {
    search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z M21 21l-4.3-4.3', x: 'M18 6L6 18 M6 6l12 12', left: 'M15 6l-6 6 6 6', right: 'M9 6l6 6-6 6',
    plus: 'M12 5v14 M5 12h14', minus: 'M5 12h14', ext: 'M7 17L17 7 M7 7h10v10', back: 'M19 12H5 M12 19l-7-7 7-7', arrow: 'M5 12h14 M12 5l7 7-7 7',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
    filter: 'M3 5h18 M6 12h12 M10 19h4', fit: 'M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7', comp: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  };

  /* ---------- Index ---------- */
  const screens = [];
  const screenById = {};
  const flows = [];
  products.forEach((p) => {
    p.screens.forEach((s) => {
      s.product = p;
      s.comps = [...new Set([...MOCK.components(s.spec), ...(s.components || [])])].filter((c) => components[c]);
      s.patterns = (s.patterns || []).filter((x) => patterns[x]);
      s.flows = [];
      screens.push(s);
      screenById[s.id] = s;
    });
    (p.flows || []).forEach((f) => { f.product = p; flows.push(f); });
  });
  flows.forEach((f) => f.steps.forEach((st, i) => { const s = screenById[st.screen]; if (s) s.flows.push({ flow: f, index: i }); }));
  const htmlCache = {};
  const screenHTML = (s) => (htmlCache[s.id] ||= MOCK.render(s.spec));
  const countBy = (key) => { const m = {}; screens.forEach((s) => s[key].forEach((x) => { m[x] = (m[x] || 0) + 1; })); return m; };
  const patternCount = countBy('patterns');
  const compCount = countBy('comps');
  const platformLabel = { desktop: 'Desktop app', web: 'Web app' };

  /* ---------- Thumbnails ---------- */
  const ro = new ResizeObserver((entries) => entries.forEach((e) => e.target.style.setProperty('--s', e.contentRect.width / MOCK.W)));
  const thumb = (s, focus) => `<div class="thumb" data-sid="${s.id}"${focus ? ` data-focus="${focus}"` : ''}>${screenHTML(s)}</div>`;
  function hydrate(root) {
    $$('.thumb', root).forEach((t) => {
      ro.observe(t);
      if (t.dataset.focus) $$(`[data-comp="${t.dataset.focus}"]`, t).forEach((el) => el.classList.add('m-focus'));
    });
  }
  const logo = (p, cls = 'plogo') => `<span class="${cls}" style="background:${p.color}">${esc(p.name[0])}</span>`;
  const screenCard = (s, ctx, focus) => `<button class="scard" data-open="${s.id}" data-ctx="${ctx}"${focus ? ` data-focus="${focus}"` : ''} aria-label="Open ${esc(s.product.name)}: ${esc(s.title)}">
      ${thumb(s, focus)}
      <span class="scard-meta">
        <span class="scard-top"><span class="pdot" style="background:${s.product.color}"></span>${esc(s.product.name)} · ${esc(industries[s.product.industry])}</span>
        <span class="scard-title">${esc(s.title)}</span>
        <span class="tags">${s.patterns.slice(0, 3).map((x) => `<span class="tag">${esc(patterns[x].name)}</span>`).join('')}</span>
      </span>
    </button>`;

  /* ---------- Shell ---------- */
  const app = $('#app');
  app.innerHTML = `
    <header class="hdr"><div class="wrap hdr-in">
      <a class="brand" href="#screens"><span class="brand-mark" aria-hidden="true"></span>inspux</a>
      <nav class="nav" aria-label="Sections">
        <a href="#screens" data-nav="screens">Screens<span class="n">${screens.length}</span></a>
        <a href="#products" data-nav="products">Products<span class="n">${products.length}</span></a>
        <a href="#flows" data-nav="flows">User flows<span class="n">${flows.length}</span></a>
        <a href="#patterns" data-nav="patterns">Patterns<span class="n">${Object.keys(patterns).length}</span></a>
        <a href="#components" data-nav="components">Components<span class="n">${Object.keys(components).length}</span></a>
      </nav>
      <label class="hdr-search">${svg(I.search)}<input id="q" type="search" placeholder="Search screens, patterns, components" autocomplete="off" aria-label="Search"><kbd>/</kbd></label>
      <button class="icon-btn" id="theme" aria-label="Toggle color theme"></button>
    </div></header>
    <main id="main" class="wrap page"></main>
    <footer class="wrap foot"><p>Every screen here is a hand-built HTML recreation made for study, not a screenshot. Layouts, copy and data are illustrative and may differ from the live products. Product names belong to their owners; Inspux is not affiliated with any of them.</p></footer>
    <div class="viewer" id="viewer" hidden role="dialog" aria-modal="true" aria-label="Screen viewer"></div>`;
  const main = $('#main');

  // Theme toggle: system → explicit opposite → back to system
  const themeBtn = $('#theme');
  const sysDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
    const dark = t ? t === 'dark' : sysDark();
    themeBtn.innerHTML = svg(dark ? I.sun : I.moon, 17);
    themeBtn.title = dark ? 'Switch to light' : 'Switch to dark';
  }
  applyTheme(store.get('theme', null));
  themeBtn.onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme') || (sysDark() ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    store.set('theme', next); applyTheme(next);
  };

  /* ---------- Browse state ---------- */
  const state = { q: '', industry: [], platform: [], pattern: [], comp: [], ...store.get('filters', {}) };
  state.q = '';
  const saveFilters = () => store.set('filters', { industry: state.industry, platform: state.platform, pattern: state.pattern, comp: state.comp });
  const qInput = $('#q');

  const searchText = (s) => (s._t ||= [s.title, s.desc, s.product.name, industries[s.product.industry], ...s.patterns.map((x) => patterns[x].name), ...s.comps.map((x) => components[x].name)].join(' ').toLowerCase());
  function matches(s, skip) {
    if (state.q) { const words = state.q.toLowerCase().split(/\s+/).filter(Boolean); const t = searchText(s); if (!words.every((w) => t.includes(w))) return false; }
    if (skip !== 'industry' && state.industry.length && !state.industry.includes(s.product.industry)) return false;
    if (skip !== 'platform' && state.platform.length && !state.platform.includes(s.product.platform)) return false;
    if (skip !== 'pattern' && !state.pattern.every((x) => s.patterns.includes(x))) return false;
    if (skip !== 'comp' && !state.comp.every((x) => s.comps.includes(x))) return false;
    return true;
  }

  /* ---------- Pages ---------- */
  const pages = {};

  pages.screens = () => {
    const opened = store.get('open', {});
    const group = (key, title, note, opts) => {
      const base = screens.filter((s) => matches(s, key));
      const count = (v) => base.filter((s) => (key === 'industry' ? s.product.industry === v : key === 'platform' ? s.product.platform === v : key === 'pattern' ? s.patterns.includes(v) : s.comps.includes(v))).length;
      let list = opts.map(([v, label, sw]) => ({ v, label, sw, n: count(v), on: state[key].includes(v) }));
      if (key === 'pattern' || key === 'comp') list.sort((a, b) => b.on - a.on || b.n - a.n || a.label.localeCompare(b.label));
      const limit = 8; const showAll = opened[key];
      const shown = showAll ? list : list.slice(0, limit);
      return `<div class="fgroup"><h3>${title}<span>${note}</span></h3>${shown.map((o) => `<label class="fopt${o.n ? '' : ' zero'}"><input type="checkbox" data-f="${key}" value="${o.v}"${o.on ? ' checked' : ''}>${o.sw ? `<span class="sw" style="background:${o.sw}"></span>` : ''}<span>${esc(o.label)}</span><span class="c">${o.n}</span></label>`).join('')}${list.length > limit ? `<button class="fmore" data-more="${key}">${showAll ? 'Show fewer' : `Show all ${list.length}`}</button>` : ''}</div>`;
    };
    const res = screens.filter((s) => matches(s));
    const active = [
      ...state.industry.map((v) => ['industry', v, industries[v]]), ...state.platform.map((v) => ['platform', v, platformLabel[v]]),
      ...state.pattern.map((v) => ['pattern', v, patterns[v].name]), ...state.comp.map((v) => ['comp', v, components[v].name]),
    ];
    main.innerHTML = `
      <div class="page-head">
        <span class="eyebrow">Desktop SaaS screen library</span>
        <h1>Study how good software is put together.</h1>
        <p>${screens.length} desktop screens from ${products.length} SaaS products, recreated by hand and broken down into user flows, UX patterns and the components they use. Open any screen to zoom in and outline its components.</p>
      </div>
      <div class="browse">
        <aside class="filters" id="filters" aria-label="Filters">
          ${group('industry', 'Industry', 'any of', Object.entries(industries).map(([k, v]) => [k, v, (products.find((p) => p.industry === k) || {}).color]))}
          ${group('platform', 'Platform', 'any of', Object.entries(platformLabel))}
          ${group('pattern', 'Patterns', 'all of', Object.entries(patterns).map(([k, v]) => [k, v.name]))}
          ${group('comp', 'Components', 'all of', Object.entries(components).map(([k, v]) => [k, v.name]))}
        </aside>
        <section aria-label="Results">
          <div class="results-bar">
            <button class="btn filters-toggle" id="ftoggle">${svg(I.filter)}Filters${active.length ? ` (${active.length})` : ''}</button>
            <span class="count">${res.length} of ${screens.length} screens${state.q ? ` for “${esc(state.q)}”` : ''}</span>
            ${active.map(([k, v, l]) => `<button class="chip on" data-rm="${k}" data-v="${v}">${esc(l)}${svg(I.x, 13)}</button>`).join('')}
            ${active.length || state.q ? '<button class="clear" id="clear">Clear all</button>' : ''}
          </div>
          ${res.length ? `<div class="grid">${res.map((s) => screenCard(s, 'browse')).join('')}</div>` : `<div class="empty-results"><b>No screens match these filters.</b><span>Remove a filter or clear the search to see more.</span><button class="btn" id="clear2">Clear filters</button></div>`}
        </section>
      </div>`;
    browseCtx = res.map((s) => s.id);
    hydrate(main);
    $$('[data-f]', main).forEach((cb) => cb.onchange = () => {
      const k = cb.dataset.f; const set = new Set(state[k]);
      cb.checked ? set.add(cb.value) : set.delete(cb.value);
      state[k] = [...set]; saveFilters(); rerenderKeepScroll();
    });
    $$('[data-more]', main).forEach((b) => b.onclick = () => { opened[b.dataset.more] = !opened[b.dataset.more]; store.set('open', opened); rerenderKeepScroll(); });
    $$('[data-rm]', main).forEach((b) => b.onclick = () => { const k = b.dataset.rm; state[k] = state[k].filter((x) => x !== b.dataset.v); saveFilters(); rerenderKeepScroll(); });
    const clear = () => { state.industry = []; state.platform = []; state.pattern = []; state.comp = []; state.q = ''; qInput.value = ''; saveFilters(); rerenderKeepScroll(); };
    ($('#clear', main) || {}).onclick = clear; ($('#clear2', main) || {}).onclick = clear;
    $('#ftoggle', main).onclick = () => $('#filters', main).classList.toggle('open');
  };
  let browseCtx = [];
  function rerenderKeepScroll() {
    const y = scrollY; const fOpen = ($('#filters') || {}).classList?.contains('open'); const fs = ($('#filters') || {}).scrollTop || 0;
    pages.screens(); scrollTo(0, y);
    if (fOpen) $('#filters').classList.add('open');
    if ($('#filters')) $('#filters').scrollTop = fs;
  }

  pages.products = () => {
    main.innerHTML = `
      <div class="page-head"><span class="eyebrow">Products</span><h1>${products.length} products, ${Object.keys(industries).length} industries.</h1>
      <p>Each product page has a UX summary (how it is structured, what works, where people struggle), its screens, its user flows and the patterns and components it relies on.</p></div>
      <div class="pgrid">${products.map((p) => `
        <a class="pcard" href="#product/${p.id}">
          <div class="pcard-stack">${p.screens.slice(0, 2).map((s) => thumb(s)).join('')}</div>
          <div class="pcard-body">
            <div class="pcard-name">${logo(p)}${esc(p.name)}</div>
            <p>${esc(p.tagline)}</p>
            <div class="pcard-foot"><span>${esc(industries[p.industry])}</span><span>${platformLabel[p.platform]}</span><span>${p.screens.length} screens</span><span>${(p.flows || []).length} flow${(p.flows || []).length === 1 ? '' : 's'}</span></div>
          </div>
        </a>`).join('')}</div>`;
    hydrate(main);
  };

  pages.product = (id) => {
    const p = products.find((x) => x.id === id); if (!p) return notFound();
    const pc = {}; const cc = {};
    p.screens.forEach((s) => { s.patterns.forEach((x) => { pc[x] = (pc[x] || 0) + 1; }); s.comps.forEach((x) => { cc[x] = (cc[x] || 0) + 1; }); });
    const sorted = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
    const li = (arr) => `<ul>${arr.map((x) => `<li><span>${esc(x)}</span></li>`).join('')}</ul>`;
    main.innerHTML = `
      <a class="back" href="#products">${svg(I.back, 14)}All products</a>
      <div class="phead">
        <div><h1>${logo(p)}${esc(p.name)}</h1><p>${esc(p.tagline)}</p>
          <div class="facts"><a class="chip" href="#screens" data-ind="${p.industry}">${esc(industries[p.industry])}</a><span class="chip">${platformLabel[p.platform]}</span><span class="chip">${p.screens.length} screens</span></div>
        </div>
        <a class="btn" href="${p.url}" target="_blank" rel="noopener">Visit ${esc(p.url.replace(/^https?:\/\//, ''))}${svg(I.ext, 14)}</a>
      </div>
      <section class="section">
        <div class="section-head"><h2>UX summary</h2></div>
        <p class="ux-overview">${esc(p.summary.overview)}</p>
        <div class="ux">
          <div class="ux-col structure"><h3>Structure</h3>${li(p.summary.structure)}</div>
          <div class="ux-col strengths"><h3>Strengths</h3>${li(p.summary.strengths)}</div>
          <div class="ux-col pains"><h3>Pain points</h3>${li(p.summary.pains)}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Screens</h2><span class="mono">${p.screens.length}</span></div>
        <div class="grid lg">${p.screens.map((s) => screenCard(s, 'product:' + p.id)).join('')}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>User flows</h2><span class="mono">${(p.flows || []).length}</span></div>
        <div class="flist">${(p.flows || []).map(flowCard).join('')}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Patterns used</h2></div>
        <div class="chips">${sorted(pc).map(([k, n]) => `<a class="chip" href="#pattern/${k}">${esc(patterns[k].name)}<span class="c">${n}</span></a>`).join('')}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Components used</h2></div>
        <div class="chips">${sorted(cc).map(([k, n]) => `<a class="chip" href="#component/${k}">${esc(components[k].name)}<span class="c">${n}</span></a>`).join('')}</div>
      </section>`;
    hydrate(main);
    $('[data-ind]', main).onclick = () => { state.industry = [p.industry]; state.platform = []; state.pattern = []; state.comp = []; saveFilters(); };
  };

  const flowCard = (f) => `
    <a class="fcard" href="#flow/${f.id}">
      <div><span class="scard-top"><span class="pdot" style="background:${f.product.color}"></span>${esc(f.product.name)} · ${f.steps.length} steps</span><h3>${esc(f.name)}</h3><p>${esc(f.goal)}</p></div>
      <div class="fstrip">${f.steps.map((st, i) => (i ? `<span class="arr">${svg(I.arrow, 14)}</span>` : '') + thumb(screenById[st.screen])).join('')}</div>
    </a>`;

  pages.flows = () => {
    main.innerHTML = `
      <div class="page-head"><span class="eyebrow">User flows</span><h1>Tasks, step by step.</h1>
      <p>Each flow follows one job from start to finish across real screens, with what happens at each step and where people get stuck.</p></div>
      <div class="flist">${flows.map(flowCard).join('')}</div>`;
    hydrate(main);
  };

  pages.flow = (id) => {
    const f = flows.find((x) => x.id === id); if (!f) return notFound();
    main.innerHTML = `
      <a class="back" href="#flows">${svg(I.back, 14)}All flows</a>
      <div class="page-head"><span class="scard-top"><span class="pdot" style="background:${f.product.color}"></span><a href="#product/${f.product.id}">${esc(f.product.name)}</a> · ${f.steps.length} steps</span>
      <h1>${esc(f.name)}</h1><p><b>Goal:</b> ${esc(f.goal)}</p></div>
      <div class="steps">${f.steps.map((st, i) => { const s = screenById[st.screen]; return `
        <div class="step"><span class="step-n">${i + 1}</span>
          ${screenCard(s, 'flow:' + f.id).replace('class="scard"', 'class="scard" style="min-width:0"')}
          <div class="step-note"><span class="eyebrow">Step ${i + 1} of ${f.steps.length}</span><h3>${esc(s.title)}</h3><p>${esc(st.note)}</p></div>
        </div>`; }).join('')}</div>
      ${f.friction ? `<div class="callout"><span>${svg('M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01', 20)}</span><div><h3>Friction</h3><p>${esc(f.friction)}</p></div></div>` : ''}`;
    hydrate(main);
  };

  const taxPage = (kind) => {
    const dict = kind === 'pattern' ? patterns : components;
    const counts = kind === 'pattern' ? patternCount : compCount;
    const key = kind === 'pattern' ? 'patterns' : 'comps';
    const groups = {};
    Object.entries(dict).forEach(([k, v]) => { (groups[v.group] ||= []).push(k); });
    main.innerHTML = `
      <div class="page-head"><span class="eyebrow">${kind === 'pattern' ? 'UX patterns' : 'UI components'}</span>
      <h1>${kind === 'pattern' ? 'Patterns that solve recurring problems.' : 'The building blocks, in context.'}</h1>
      <p>${kind === 'pattern' ? 'Recurring solutions to recurring problems: how products handle navigation, data, editing, feedback and collaboration. Each one links to the screens that use it.' : 'Filters, forms, drawers, tables and the rest, each shown on the real screens that use it. The component is outlined on every example.'}</p></div>
      ${Object.entries(groups).map(([g, ks]) => `
        <div class="tax-group"><div class="section-head"><h2>${esc(g)}</h2><span class="mono">${ks.length}</span></div>
        <div class="tax-list">${ks.sort((a, b) => (counts[b] || 0) - (counts[a] || 0)).map((k, i) => { const m = screens.filter((s) => s[key].includes(k)); const ex = m[(i * 7 + k.length) % (m.length || 1)]; return `
          <a class="tax${counts[k] ? '' : ' zero'}" href="#${kind}/${k}"><div><h3>${esc(dict[k].name)}<span class="mono">${counts[k] || 0}</span></h3><p>${esc(dict[k].desc)}</p></div>${ex ? thumb(ex, kind === 'component' ? k : null) : '<span></span>'}</a>`; }).join('')}</div></div>`).join('')}`;
    hydrate(main);
  };
  pages.patterns = () => taxPage('pattern');
  pages.components = () => taxPage('component');

  const taxDetail = (kind, id) => {
    const dict = kind === 'pattern' ? patterns : components;
    const d = dict[id]; if (!d) return notFound();
    const key = kind === 'pattern' ? 'patterns' : 'comps';
    const list = screens.filter((s) => s[key].includes(id));
    const prods = [...new Set(list.map((s) => s.product))];
    main.innerHTML = `
      <a class="back" href="#${kind}s">${svg(I.back, 14)}All ${kind}s</a>
      <div class="page-head"><span class="eyebrow">${esc(d.group)} · ${kind}</span><h1>${esc(d.name)}</h1><p>${esc(d.desc)}</p>
      <div class="stats"><span><b>${list.length}</b>screens</span><span><b>${prods.length}</b>products</span></div></div>
      ${d.use || d.watch ? `<div class="detail-grid">${d.use ? `<div class="note good"><h3>When to use it</h3><p>${esc(d.use)}</p></div>` : ''}${d.watch ? `<div class="note warn"><h3>Watch out for</h3><p>${esc(d.watch)}</p></div>` : ''}</div>` : ''}
      <section class="section"><div class="section-head"><h2>Examples</h2><span class="mono">${list.length}</span></div>
      ${list.length ? `<div class="grid">${list.map((s) => screenCard(s, kind + ':' + id, kind === 'component' ? id : null)).join('')}</div>` : '<div class="empty-results"><b>No examples yet.</b><span>None of the recreated screens use this one so far.</span></div>'}</section>
      ${prods.length ? `<section class="section"><div class="section-head"><h2>Used by</h2></div><div class="chips">${prods.map((p) => `<a class="chip" href="#product/${p.id}"><span class="pdot" style="background:${p.color}"></span>${esc(p.name)}</a>`).join('')}</div></section>` : ''}`;
    hydrate(main);
  };
  pages.pattern = (id) => taxDetail('pattern', id);
  pages.component = (id) => taxDetail('component', id);

  function notFound() {
    main.innerHTML = `<div class="empty-results"><b>That page does not exist.</b><a class="btn" href="#screens">Browse all screens</a></div>`;
  }

  /* ---------- Context lists for viewer navigation ---------- */
  function ctxList(ctx) {
    const [kind, id] = ctx.split(':');
    if (kind === 'browse') return browseCtx;
    if (kind === 'product') return products.find((p) => p.id === id).screens.map((s) => s.id);
    if (kind === 'flow') return flows.find((f) => f.id === id).steps.map((s) => s.screen);
    if (kind === 'pattern') return screens.filter((s) => s.patterns.includes(id)).map((s) => s.id);
    if (kind === 'component') return screens.filter((s) => s.comps.includes(id)).map((s) => s.id);
    return [ctx];
  }

  /* ---------- Viewer ---------- */
  const viewer = $('#viewer');
  const V = { list: [], i: 0, ctx: '', focus: null, hl: false, s: 1, x: 0, y: 0, lastFocus: null };
  viewer.innerHTML = `
    <div class="vbar">
      <div class="vgroup"><button class="vbtn" data-v="prev" aria-label="Previous screen">${svg(I.left)}</button><span class="vzoom" id="vpos"></span><button class="vbtn" data-v="next" aria-label="Next screen">${svg(I.right)}</button></div>
      <div class="vbar-title"><b id="vtitle"></b><span id="vsub"></span></div>
      <div class="vgroup"><button class="vbtn" data-v="out" aria-label="Zoom out">${svg(I.minus)}</button><span class="vzoom" id="vzoom">100%</span><button class="vbtn" data-v="in" aria-label="Zoom in">${svg(I.plus)}</button><button class="vbtn hide-sm" data-v="fit">Fit</button><button class="vbtn hide-sm" data-v="100">1:1</button><button class="vbtn hide-sm" data-v="200">2×</button></div>
      <button class="vbtn" data-v="hl" style="border:1px solid var(--line)" aria-pressed="false">${svg(I.comp, 15)}<span class="hide-sm">Components</span></button>
      <button class="vbtn" data-v="close" aria-label="Close viewer" style="border:1px solid var(--line)">${svg(I.x)}</button>
    </div>
    <div class="vmain">
      <div class="stage" id="stage"><div class="stage-inner" id="sinner"></div><div class="stage-hint">Scroll or drag to pan · Ctrl/⌘ + scroll or pinch to zoom · Double-click to toggle 1:1</div></div>
      <aside class="vside" id="vside"></aside>
    </div>`;
  const stage = $('#stage'); const sinner = $('#sinner');

  function openViewer(ctx, id, focus) {
    V.ctx = ctx; V.list = ctxList(ctx); V.i = Math.max(0, V.list.indexOf(id)); V.focus = focus || null;
    V.lastFocus = document.activeElement;
    viewer.hidden = false; document.body.style.overflow = 'hidden';
    showScreen();
    $('[data-v="close"]', viewer).focus();
  }
  function closeViewer() {
    viewer.hidden = true; document.body.style.overflow = '';
    if (V.lastFocus && document.contains(V.lastFocus)) V.lastFocus.focus();
  }
  function showScreen() {
    const s = screenById[V.list[V.i]];
    sinner.innerHTML = screenHTML(s);
    const scr = $('.m-screen', sinner);
    if (V.hl) scr.classList.add('hl');
    if (V.focus) focusComp(V.focus);
    $('#vtitle').textContent = s.title;
    $('#vsub').textContent = `${s.product.name} · ${industries[s.product.industry]} · ${platformLabel[s.product.platform]}`;
    $('#vpos').textContent = `${V.i + 1}/${V.list.length}`;
    $('[data-v="prev"]', viewer).disabled = V.i === 0;
    $('[data-v="next"]', viewer).disabled = V.i === V.list.length - 1;
    const [kind, cid] = V.ctx.split(':');
    const flowStep = kind === 'flow' ? (() => { const f = flows.find((x) => x.id === cid); return { f, st: f.steps[V.i] }; })() : null;
    const compCounts = {};
    $$('[data-comp]', scr).forEach((el) => { const c = el.dataset.comp; compCounts[c] = (compCounts[c] || 0) + 1; });
    $('#vside').innerHTML = `
      ${flowStep ? `<div class="step-ctx"><span class="eyebrow">${esc(flowStep.f.name)} · Step ${V.i + 1} of ${flowStep.f.steps.length}</span><span>${esc(flowStep.st.note)}</span></div>` : ''}
      <div class="vblock"><span class="scard-top"><span class="pdot" style="background:${s.product.color}"></span><a href="#product/${s.product.id}" data-close>${esc(s.product.name)}</a></span><h2>${esc(s.title)}</h2><p class="lede">${esc(s.desc)}</p></div>
      <div class="vblock"><h3>Patterns</h3><div class="tags">${s.patterns.map((x) => `<a class="tag" href="#pattern/${x}" data-close>${esc(patterns[x].name)}</a>`).join('')}</div></div>
      <div class="vblock"><h3>Components<span>hover to outline</span></h3><div class="clist">${s.comps.map((c) => `<button data-c="${c}" class="${V.focus === c ? 'on' : ''}"><span class="dash"></span>${esc(components[c].name)}<span class="mono">${compCounts[c] || ''}</span></button>`).join('')}</div></div>
      ${s.flows.length ? `<div class="vblock"><h3>Appears in</h3><div class="tags">${s.flows.map((x) => `<a class="tag" href="#flow/${x.flow.id}" data-close>${esc(x.flow.name)} · step ${x.index + 1}</a>`).join('')}</div></div>` : ''}
      <div class="vblock"><h3>About ${esc(s.product.name)}</h3><p class="lede">${esc(s.product.summary.overview)}</p><a class="tag" href="#product/${s.product.id}" data-close style="align-self:flex-start">Read the UX summary →</a></div>`;
    $$('[data-c]', $('#vside')).forEach((b) => {
      b.onmouseenter = () => focusComp(b.dataset.c);
      b.onmouseleave = () => focusComp(V.focus);
      b.onfocus = b.onmouseenter; b.onblur = b.onmouseleave;
      b.onclick = () => { V.focus = V.focus === b.dataset.c ? null : b.dataset.c; $$('[data-c]', $('#vside')).forEach((x) => x.classList.toggle('on', x.dataset.c === V.focus)); focusComp(V.focus); };
    });
    $$('[data-close]', $('#vside')).forEach((a) => a.addEventListener('click', closeViewer));
    requestAnimationFrame(fit);
  }
  function focusComp(c) {
    $$('.m-focus', sinner).forEach((el) => el.classList.remove('m-focus'));
    if (c) $$(`[data-comp="${c}"]`, sinner).forEach((el) => el.classList.add('m-focus'));
  }
  function apply() {
    sinner.style.transform = `translate(${V.x}px, ${V.y}px) scale(${V.s})`;
    $('#vzoom').textContent = Math.round(V.s * 100) + '%';
  }
  function fit() {
    const r = stage.getBoundingClientRect();
    V.s = Math.min((r.width - 40) / MOCK.W, (r.height - 40) / MOCK.H);
    V.x = (r.width - MOCK.W * V.s) / 2; V.y = (r.height - MOCK.H * V.s) / 2; apply();
  }
  function zoomTo(ns, cx, cy) {
    const r = stage.getBoundingClientRect();
    if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    ns = Math.min(4, Math.max(0.1, ns));
    V.x = cx - (cx - V.x) * (ns / V.s); V.y = cy - (cy - V.y) * (ns / V.s); V.s = ns; apply();
  }
  const go = (d) => { const n = V.i + d; if (n >= 0 && n < V.list.length) { V.i = n; showScreen(); } };
  viewer.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    const a = b.dataset.v;
    if (a === 'close') closeViewer();
    if (a === 'prev') go(-1);
    if (a === 'next') go(1);
    if (a === 'in') zoomTo(V.s * 1.25);
    if (a === 'out') zoomTo(V.s / 1.25);
    if (a === 'fit') fit();
    if (a === '100') zoomTo(1);
    if (a === '200') zoomTo(2);
    if (a === 'hl') { V.hl = !V.hl; b.classList.toggle('on', V.hl); b.setAttribute('aria-pressed', V.hl); $('.m-screen', sinner).classList.toggle('hl', V.hl); }
  });
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) zoomTo(V.s * Math.exp(-e.deltaY * 0.0022), e.clientX - r.left, e.clientY - r.top);
    else { V.x -= e.deltaX; V.y -= e.deltaY; apply(); }
  }, { passive: false });
  stage.addEventListener('dblclick', (e) => {
    const r = stage.getBoundingClientRect();
    if (Math.abs(V.s - 1) < 0.02) fit(); else zoomTo(1, e.clientX - r.left, e.clientY - r.top);
  });
  // Drag to pan, two-finger pinch to zoom
  const ptrs = new Map(); let pinch = null;
  stage.addEventListener('pointerdown', (e) => { stage.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); stage.classList.add('grabbing'); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: V.s }; } });
  stage.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId); const cur = { x: e.clientX, y: e.clientY }; ptrs.set(e.pointerId, cur);
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()]; const r = stage.getBoundingClientRect();
      zoomTo(pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    } else if (ptrs.size === 1) { V.x += cur.x - prev.x; V.y += cur.y - prev.y; apply(); }
  });
  const up = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) stage.classList.remove('grabbing'); };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  addEventListener('resize', () => { if (!viewer.hidden) fit(); });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (!viewer.hidden) {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === '+' || e.key === '=') zoomTo(V.s * 1.25);
      else if (e.key === '-') zoomTo(V.s / 1.25);
      else if (e.key === '0') fit();
      else if (e.key === '1') zoomTo(1);
      else if (e.key.toLowerCase() === 'c') $('[data-v="hl"]', viewer).click();
      else if (e.key === 'Tab') { // keep focus inside the dialog
        const f = $$('button:not([disabled]), a[href]', viewer); const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
      return;
    }
    if (e.key === '/' && !typing) { e.preventDefault(); qInput.focus(); }
  });

  main.addEventListener('click', (e) => {
    const c = e.target.closest('[data-open]'); if (!c) return;
    openViewer(c.dataset.ctx, c.dataset.open, c.dataset.focus);
  });

  /* ---------- Search ---------- */
  let qTimer;
  qInput.addEventListener('input', () => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = qInput.value.trim();
      if (route().page !== 'screens') location.hash = 'screens'; else rerenderKeepScroll();
    }, 120);
  });
  qInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') { qInput.value = ''; qInput.dispatchEvent(new Event('input')); qInput.blur(); } });

  /* ---------- Router ---------- */
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [page, id] = h.split('/');
    return { page: page || 'screens', id };
  }
  function render() {
    const { page, id } = route();
    if (!viewer.hidden) closeViewer();
    (pages[page] || notFound)(id);
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === page || a.dataset.nav + 's' === page || (page === 'product' && a.dataset.nav === 'products') || (page === 'flow' && a.dataset.nav === 'flows')));
    document.title = { screens: 'Inspux', products: 'Products · Inspux', flows: 'User flows · Inspux', patterns: 'Patterns · Inspux', components: 'Components · Inspux' }[page]
      || `${(id && (products.find((p) => p.id === id) || flows.find((f) => f.id === id) || patterns[id] || components[id] || {}).name) || 'Inspux'} · Inspux`;
  }
  let lastPage = null;
  addEventListener('hashchange', () => { render(); const p = route().page; if (p !== lastPage || p !== 'screens') scrollTo(0, 0); lastPage = p; });
  render(); lastPage = route().page;
})();
