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
    filter: 'M4 6h16 M7 12h10 M10 18h4', comp: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z', down: 'M6 9l6 6 6-6',
    alert: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01',
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
  const platformLabel = { desktop: 'Desktop app', web: 'Web app' };

  /* ---------- Thumbnails & cards ---------- */
  const ro = new ResizeObserver((entries) => entries.forEach((e) => e.target.style.setProperty('--s', e.contentRect.width / MOCK.W)));
  const thumb = (s, focus) => `<div class="thumb" data-sid="${s.id}"${focus ? ` data-focus="${focus}"` : ''}>${screenHTML(s)}</div>`;
  function hydrate(root) {
    $$('.thumb', root).forEach((t) => {
      ro.observe(t);
      if (t.dataset.focus) $$(`[data-comp="${t.dataset.focus}"]`, t).forEach((el) => el.classList.add('m-focus'));
    });
  }
  const icon = (p, size = 'md') => `<span class="appicon ${size}" style="background:${p.color}">${esc(p.name[0])}</span>`;

  // A screen tile: grey rounded frame holding the screen, app identity underneath
  const screenCard = (s, ctx, opts = {}) => `<button class="scard" data-open="${s.id}" data-ctx="${ctx}"${opts.focus ? ` data-focus="${opts.focus}"` : ''} aria-label="Open ${esc(s.product.name)}: ${esc(s.title)}">
      <span class="tile">${thumb(s, opts.focus)}</span>
      <span class="scard-meta">
        ${opts.hideApp ? '' : icon(s.product, 'sm')}
        <span class="scard-text"><b>${esc(opts.hideApp ? s.title : s.product.name)}</b><span>${esc(opts.hideApp ? s.patterns.slice(0, 2).map((x) => patterns[x].name).join(' · ') : s.title)}</span></span>
      </span>
    </button>`;

  /* ---------- Shell ---------- */
  const app = $('#app');
  app.innerHTML = `
    <header class="hdr">
      <div class="hdr-top">
        <a class="brand" href="#apps" aria-label="Inspux home"><span class="brand-mark" aria-hidden="true"></span>Inspux</a>
        <div class="hdr-center">
          <div class="platform" role="tablist" aria-label="Platform">
            <button data-plat="" role="tab">All</button><button data-plat="desktop" role="tab">Desktop</button><button data-plat="web" role="tab">Web</button>
          </div>
          <label class="search">${svg(I.search, 18)}<input id="q" type="search" placeholder="Search apps, screens, UI elements or flows" autocomplete="off" aria-label="Search"><kbd>/</kbd></label>
        </div>
        <div class="hdr-right">
          <button class="iconbtn" id="theme" aria-label="Toggle color theme"></button>
          <a class="pill dark hide-sm" href="#screens">Browse screens</a>
        </div>
      </div>
      <nav class="tabs" aria-label="Sections">
        <a href="#apps" data-nav="apps">Apps</a>
        <a href="#screens" data-nav="screens">Screens</a>
        <a href="#elements" data-nav="elements">UI Elements</a>
        <a href="#flows" data-nav="flows">Flows</a>
        <a href="#patterns" data-nav="patterns">Patterns</a>
      </nav>
    </header>
    <main id="main" class="main"></main>
    <footer class="foot">
      <div class="foot-cols">
        <div class="foot-brand"><a class="brand" href="#apps"><span class="brand-mark" aria-hidden="true"></span>Inspux</a><p>A reference library of desktop SaaS screens, flows, UI elements and patterns.</p></div>
        <div><h4>Browse</h4><a href="#apps">Apps</a><a href="#screens">Screens</a><a href="#elements">UI Elements</a><a href="#flows">Flows</a><a href="#patterns">Patterns</a></div>
        <div><h4>Categories</h4>${Object.entries(industries).slice(0, 6).map(([k, v]) => `<a href="#screens" data-cat="${k}">${esc(v)}</a>`).join('')}</div>
        <div><h4>More categories</h4>${Object.entries(industries).slice(6).map(([k, v]) => `<a href="#screens" data-cat="${k}">${esc(v)}</a>`).join('')}</div>
      </div>
      <p class="foot-note">Every screen is a hand-built HTML recreation made for study, not a screenshot. Layouts, copy and data are illustrative and may differ from the live products. Product names belong to their owners; Inspux is not affiliated with any of them.</p>
    </footer>
    <div class="overlay" id="filters-dialog" hidden role="dialog" aria-modal="true" aria-label="Filters"></div>
    <div class="overlay viewer" id="viewer" hidden role="dialog" aria-modal="true" aria-label="Screen viewer"></div>`;
  const main = $('#main');

  // Theme toggle
  const themeBtn = $('#theme');
  const sysDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
    const dark = t ? t === 'dark' : sysDark();
    themeBtn.innerHTML = svg(dark ? I.sun : I.moon, 18);
    themeBtn.title = dark ? 'Switch to light' : 'Switch to dark';
  }
  applyTheme(store.get('theme', null));
  themeBtn.onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme') || (sysDark() ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    store.set('theme', next); applyTheme(next);
  };

  /* ---------- State ---------- */
  const saved = store.get('state', {});
  const state = { q: '', platform: saved.platform || '', cat: saved.cat || '', pattern: saved.pattern || [], comp: saved.comp || [] };
  const save = () => store.set('state', { platform: state.platform, cat: state.cat, pattern: state.pattern, comp: state.comp });
  const qInput = $('#q');

  function syncPlatform() {
    $$('[data-plat]').forEach((b) => { const on = b.dataset.plat === state.platform; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const label = { '': 'all platforms', desktop: 'Desktop', web: 'Web' }[state.platform];
    qInput.placeholder = `Search on ${label}…`;
  }
  $$('[data-plat]').forEach((b) => b.onclick = () => { state.platform = b.dataset.plat; save(); syncPlatform(); render(true); });
  syncPlatform();

  const words = () => state.q.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (text) => words().every((w) => text.toLowerCase().includes(w));
  const onPlatform = (p) => !state.platform || p.platform === state.platform;
  const screenText = (s) => (s._t ||= [s.title, s.desc, s.product.name, industries[s.product.industry], ...s.patterns.map((x) => patterns[x].name), ...s.comps.map((x) => components[x].name)].join(' '));
  function screenMatches(s, skip) {
    if (!onPlatform(s.product)) return false;
    if (state.q && !hit(screenText(s))) return false;
    if (skip !== 'cat' && state.cat && s.product.industry !== state.cat) return false;
    if (skip !== 'pattern' && !state.pattern.every((x) => s.patterns.includes(x))) return false;
    if (skip !== 'comp' && !state.comp.every((x) => s.comps.includes(x))) return false;
    return true;
  }

  /* ---------- Shared bits ---------- */
  const catChips = (counts) => `<div class="chips" role="group" aria-label="Category">
      <button class="chip${state.cat ? '' : ' on'}" data-setcat="">All</button>
      ${Object.entries(industries).map(([k, v]) => `<button class="chip${state.cat === k ? ' on' : ''}${counts && !counts[k] ? ' zero' : ''}" data-setcat="${k}">${esc(v)}</button>`).join('')}
    </div>`;
  const bindChips = (root) => $$('[data-setcat]', root).forEach((b) => b.onclick = () => { state.cat = b.dataset.setcat; save(); render(true); });
  const emptyBox = (title, text, btn) => `<div class="empty"><b>${esc(title)}</b><span>${esc(text)}</span>${btn ? `<button class="pill" id="${btn[0]}">${esc(btn[1])}</button>` : ''}</div>`;
  const pageHead = (title, sub, right = '') => `<div class="phead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${right}</div>`;
  const resetAll = () => { state.cat = ''; state.pattern = []; state.comp = []; state.q = ''; qInput.value = ''; save(); render(true); };

  /* ---------- Pages ---------- */
  const pages = {};

  pages.apps = () => {
    const list = products.filter((p) => onPlatform(p) && (!state.cat || p.industry === state.cat) && (!state.q || hit([p.name, p.tagline, industries[p.industry]].join(' '))));
    const counts = {}; products.filter(onPlatform).forEach((p) => { counts[p.industry] = (counts[p.industry] || 0) + 1; });
    main.innerHTML = `
      ${state.q ? '' : `<section class="hero"><h1>Design inspiration from the best desktop SaaS products.</h1><p>${screens.length} screens, ${flows.length} flows and ${Object.keys(components).length} UI elements from ${products.length} products, recreated so you can zoom into every detail.</p></section>`}
      ${pageHead('Apps', `${list.length} ${list.length === 1 ? 'app' : 'apps'}${state.q ? ` matching “${esc(state.q)}”` : ''}`)}
      ${catChips(counts)}
      ${list.length ? `<div class="agrid">${list.map((p) => `
        <a class="acard" href="#app/${p.id}">
          <span class="tile">${thumb(p.screens[0])}</span>
          <span class="acard-meta">${icon(p)}<span class="acard-text"><b>${esc(p.name)}</b><span>${esc(industries[p.industry])}</span></span><span class="acard-n">${p.screens.length} screens</span></span>
        </a>`).join('')}</div>` : emptyBox('No apps found', 'Try another category or clear the search.', ['reset', 'Clear filters'])}`;
    hydrate(main); bindChips(main);
    ($('#reset', main) || {}).onclick = resetAll;
  };

  let browseCtx = [];
  pages.screens = () => {
    const res = screens.filter((s) => screenMatches(s));
    const catCounts = {}; screens.filter((s) => screenMatches(s, 'cat')).forEach((s) => { catCounts[s.product.industry] = (catCounts[s.product.industry] || 0) + 1; });
    const active = [...state.pattern.map((v) => ['pattern', v, patterns[v].name]), ...state.comp.map((v) => ['comp', v, components[v].name])];
    main.innerHTML = `
      ${pageHead('Screens', `${res.length} of ${screens.length} screens${state.q ? ` matching “${esc(state.q)}”` : ''}`, `<button class="pill" id="open-filters">${svg(I.filter)}Filters${active.length ? `<span class="badge">${active.length}</span>` : ''}</button>`)}
      ${catChips(catCounts)}
      ${active.length ? `<div class="active">${active.map(([k, v, l]) => `<button class="tagpill" data-rm="${k}" data-v="${v}">${esc(l)}${svg(I.x, 13)}</button>`).join('')}<button class="link" id="clear-active">Clear all</button></div>` : ''}
      ${res.length ? `<div class="sgrid">${res.map((s) => screenCard(s, 'browse')).join('')}</div>` : emptyBox('No screens match these filters', 'Remove a filter or pick another category.', ['reset', 'Clear filters'])}`;
    browseCtx = res.map((s) => s.id);
    hydrate(main); bindChips(main);
    $('#open-filters', main).onclick = openFilters;
    $$('[data-rm]', main).forEach((b) => b.onclick = () => { const k = b.dataset.rm; state[k] = state[k].filter((x) => x !== b.dataset.v); save(); render(true); });
    ($('#clear-active', main) || {}).onclick = () => { state.pattern = []; state.comp = []; save(); render(true); };
    ($('#reset', main) || {}).onclick = resetAll;
  };

  // Filter dialog: patterns and UI elements, counts update as choices combine
  const fdlg = $('#filters-dialog');
  function openFilters() {
    const draft = { pattern: [...state.pattern], comp: [...state.comp] };
    const draw = () => {
      const base = screens.filter((s) => onPlatform(s.product) && (!state.cat || s.product.industry === state.cat) && (!state.q || hit(screenText(s))));
      const ok = (s) => draft.pattern.every((x) => s.patterns.includes(x)) && draft.comp.every((x) => s.comps.includes(x));
      const n = base.filter(ok).length;
      const col = (key, dict, title) => {
        const groups = {};
        Object.entries(dict).forEach(([k, v]) => { (groups[v.group] ||= []).push(k); });
        return `<div class="fcol"><h3>${title}</h3>${Object.entries(groups).map(([g, ks]) => `<div class="fgroup"><h4>${esc(g)}</h4>${ks.map((k) => {
          const on = draft[key].includes(k);
          const c = base.filter((s) => ok(s) || on).filter((s) => (key === 'pattern' ? s.patterns : s.comps).includes(k) && (on || ok(s))).length;
          return `<label class="fopt${c || on ? '' : ' zero'}"><input type="checkbox" data-k="${key}" value="${k}"${on ? ' checked' : ''}><span>${esc(dict[k].name)}</span><em>${c}</em></label>`;
        }).join('')}</div>`).join('')}</div>`;
      };
      fdlg.innerHTML = `<div class="dialog">
          <div class="dialog-head"><b>Filters</b><button class="iconbtn" data-close aria-label="Close filters">${svg(I.x)}</button></div>
          <div class="dialog-body">${col('pattern', patterns, 'Patterns')}${col('comp', components, 'UI Elements')}</div>
          <div class="dialog-foot"><button class="link" data-clear>Clear all</button><button class="pill dark" data-apply>Show ${n} screen${n === 1 ? '' : 's'}</button></div>
        </div>`;
      $$('[data-k]', fdlg).forEach((cb) => cb.onchange = () => { const set = new Set(draft[cb.dataset.k]); cb.checked ? set.add(cb.value) : set.delete(cb.value); draft[cb.dataset.k] = [...set]; const y = $('.dialog-body', fdlg).scrollTop; draw(); $('.dialog-body', fdlg).scrollTop = y; });
      $('[data-close]', fdlg).onclick = closeFilters;
      $('[data-clear]', fdlg).onclick = () => { draft.pattern = []; draft.comp = []; draw(); };
      $('[data-apply]', fdlg).onclick = () => { state.pattern = draft.pattern; state.comp = draft.comp; save(); closeFilters(); render(true); };
    };
    draw();
    fdlg.hidden = false; document.body.style.overflow = 'hidden';
    $('[data-close]', fdlg).focus();
  }
  function closeFilters() { fdlg.hidden = true; document.body.style.overflow = ''; }
  fdlg.addEventListener('click', (e) => { if (e.target === fdlg) closeFilters(); });

  // UI elements and patterns: grids of categories, each with a representative screen
  const taxGrid = (kind) => {
    const dict = kind === 'element' ? components : patterns;
    const key = kind === 'element' ? 'comps' : 'patterns';
    const visible = screens.filter((s) => onPlatform(s.product));
    const entries = Object.entries(dict).filter(([k, v]) => !state.q || hit(v.name + ' ' + v.desc));
    const groups = {};
    entries.forEach(([k, v]) => { (groups[v.group] ||= []).push(k); });
    main.innerHTML = `
      ${pageHead(kind === 'element' ? 'UI Elements' : 'Patterns', kind === 'element' ? 'Filters, forms, drawers, tables and more, outlined on the real screens that use them.' : 'Recurring solutions to recurring problems, from command palettes to setup checklists.')}
      ${entries.length ? Object.entries(groups).map(([g, ks]) => `
        <section class="tsec"><h2>${esc(g)}</h2><div class="tgrid">${ks.map((k, i) => {
          const m = visible.filter((s) => s[key].includes(k));
          const ex = m[(i * 7 + k.length) % (m.length || 1)];
          return `<a class="tcard${m.length ? '' : ' zero'}" href="#${kind}/${k}"><span class="tile">${ex ? thumb(ex, kind === 'element' ? k : null) : ''}</span><span class="tcard-meta"><b>${esc(dict[k].name)}</b><span>${m.length} screen${m.length === 1 ? '' : 's'}</span></span></a>`;
        }).join('')}</div></section>`).join('') : emptyBox('Nothing matches that search', 'Try a different word.', null)}`;
    hydrate(main);
  };
  pages.elements = () => taxGrid('element');
  pages.patterns = () => taxGrid('pattern');

  const taxDetail = (kind, id) => {
    const dict = kind === 'element' ? components : patterns;
    const d = dict[id]; if (!d) return notFound();
    const key = kind === 'element' ? 'comps' : 'patterns';
    const list = screens.filter((s) => s[key].includes(id) && onPlatform(s.product));
    const prods = [...new Set(list.map((s) => s.product))];
    main.innerHTML = `
      <a class="back" href="#${kind === 'element' ? 'elements' : 'patterns'}">${svg(I.back, 15)}${kind === 'element' ? 'UI Elements' : 'Patterns'}</a>
      <div class="dhead"><span class="eyebrow">${esc(d.group)}</span><h1>${esc(d.name)}</h1><p>${esc(d.desc)}</p>
        <div class="dmeta"><span>${list.length} screens</span><span>${prods.length} apps</span>${prods.map((p) => `<a class="appchip" href="#app/${p.id}">${icon(p, 'xs')}${esc(p.name)}</a>`).join('')}</div></div>
      ${d.use || d.watch ? `<div class="notes">${d.use ? `<div class="note"><h3>When to use it</h3><p>${esc(d.use)}</p></div>` : ''}${d.watch ? `<div class="note"><h3>Watch out for</h3><p>${esc(d.watch)}</p></div>` : ''}</div>` : ''}
      ${list.length ? `<div class="sgrid">${list.map((s) => screenCard(s, kind + ':' + id, { focus: kind === 'element' ? id : null })).join('')}</div>` : emptyBox('No examples on this platform', 'Switch the platform to All to see more.', null)}`;
    hydrate(main);
  };
  pages.element = (id) => taxDetail('element', id);
  pages.pattern = (id) => taxDetail('pattern', id);

  const flowRow = (f, ctx) => `
    <div class="frow">
      <a class="frow-head" href="#flow/${f.id}">${icon(f.product, 'sm')}<span class="frow-text"><b>${esc(f.name)}</b><span>${esc(f.product.name)} · ${f.steps.length} steps</span></span>${svg(I.right, 18)}</a>
      <div class="frow-strip">${f.steps.map((st, i) => screenCard(screenById[st.screen], ctx || 'flow:' + f.id, { hideApp: true }).replace('<span class="scard-text"><b>', `<span class="scard-text"><b><i class="stepn">${i + 1}</i>`)).join('')}</div>
    </div>`;

  pages.flows = () => {
    const list = flows.filter((f) => onPlatform(f.product) && (!state.cat || f.product.industry === state.cat) && (!state.q || hit([f.name, f.goal, f.product.name].join(' '))));
    const counts = {}; flows.filter((f) => onPlatform(f.product)).forEach((f) => { counts[f.product.industry] = (counts[f.product.industry] || 0) + 1; });
    main.innerHTML = `
      ${pageHead('Flows', `${list.length} user flows, step by step`)}
      ${catChips(counts)}
      ${list.length ? `<div class="flist">${list.map((f) => flowRow(f)).join('')}</div>` : emptyBox('No flows found', 'Try another category or clear the search.', ['reset', 'Clear filters'])}`;
    hydrate(main); bindChips(main);
    ($('#reset', main) || {}).onclick = resetAll;
  };

  pages.flow = (id) => {
    const f = flows.find((x) => x.id === id); if (!f) return notFound();
    main.innerHTML = `
      <a class="back" href="#app/${f.product.id}/flows">${svg(I.back, 15)}${esc(f.product.name)} flows</a>
      <div class="dhead"><span class="eyebrow">${esc(f.product.name)} · ${f.steps.length} steps</span><h1>${esc(f.name)}</h1><p>${esc(f.goal)}</p></div>
      <ol class="steps">${f.steps.map((st, i) => { const s = screenById[st.screen]; return `
        <li class="step"><div class="step-note"><span class="stepn lg">${i + 1}</span><div><b>${esc(s.title)}</b><p>${esc(st.note)}</p></div></div>${screenCard(s, 'flow:' + f.id, { hideApp: true })}</li>`; }).join('')}</ol>
      ${f.friction ? `<div class="friction">${svg(I.alert, 18)}<div><b>Friction</b><p>${esc(f.friction)}</p></div></div>` : ''}`;
    hydrate(main);
  };

  pages.app = (id, tab) => {
    const p = products.find((x) => x.id === id); if (!p) return notFound();
    tab = tab || 'screens';
    const cc = {}; p.screens.forEach((s) => s.comps.forEach((x) => { cc[x] = (cc[x] || 0) + 1; }));
    const pc = {}; p.screens.forEach((s) => s.patterns.forEach((x) => { pc[x] = (pc[x] || 0) + 1; }));
    const sorted = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
    const li = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const tabs = [['screens', 'Screens', p.screens.length], ['elements', 'UI Elements', Object.keys(cc).length], ['flows', 'Flows', (p.flows || []).length], ['ux', 'UX summary', null]];
    let body = '';
    if (tab === 'screens') body = `<div class="sgrid">${p.screens.map((s) => screenCard(s, 'product:' + p.id, { hideApp: true })).join('')}</div>`;
    if (tab === 'flows') body = `<div class="flist">${(p.flows || []).map((f) => flowRow(f)).join('')}</div>`;
    if (tab === 'elements') body = `<div class="tgrid">${sorted(cc).map(([k, n]) => { const ex = p.screens.find((s) => s.comps.includes(k)); return `<a class="tcard" href="#element/${k}"><span class="tile">${thumb(ex, k)}</span><span class="tcard-meta"><b>${esc(components[k].name)}</b><span>${n} screen${n === 1 ? '' : 's'}</span></span></a>`; }).join('')}</div>`;
    if (tab === 'ux') body = `
      <p class="ux-lede">${esc(p.summary.overview)}</p>
      <div class="ux">
        <div class="ux-col"><h3>Structure</h3>${li(p.summary.structure)}</div>
        <div class="ux-col good"><h3>Strengths</h3>${li(p.summary.strengths)}</div>
        <div class="ux-col bad"><h3>Pain points</h3>${li(p.summary.pains)}</div>
      </div>
      <h3 class="ux-sub">Patterns used</h3><div class="taglist">${sorted(pc).map(([k, n]) => `<a class="tagpill" href="#pattern/${k}">${esc(patterns[k].name)}<em>${n}</em></a>`).join('')}</div>`;
    main.innerHTML = `
      <div class="apphead">
        ${icon(p, 'xl')}
        <div class="apphead-text"><h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p>
          <div class="dmeta"><a class="appchip" href="#apps" data-cat="${p.industry}">${esc(industries[p.industry])}</a><span>${platformLabel[p.platform]}</span></div></div>
        <a class="pill" href="${p.url}" target="_blank" rel="noopener">Visit website${svg(I.ext, 14)}</a>
      </div>
      <nav class="subtabs" aria-label="${esc(p.name)} sections">${tabs.map(([k, l, n]) => `<a href="#app/${p.id}/${k}" class="${tab === k ? 'on' : ''}">${l}${n != null ? `<em>${n}</em>` : ''}</a>`).join('')}</nav>
      ${body}`;
    hydrate(main);
  };

  function notFound() {
    main.innerHTML = emptyBox('That page does not exist', 'It may have moved.', ['home', 'Go to apps']);
    $('#home', main).onclick = () => { location.hash = 'apps'; };
  }

  // Footer and app-chip category links set the category before navigating
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (c) { state.cat = c.dataset.cat; save(); if (location.hash === c.getAttribute('href')) render(true); }
  });

  /* ---------- Viewer ---------- */
  function ctxList(ctx) {
    const [kind, id] = ctx.split(':');
    if (kind === 'browse') return browseCtx;
    if (kind === 'product') return products.find((p) => p.id === id).screens.map((s) => s.id);
    if (kind === 'flow') return flows.find((f) => f.id === id).steps.map((s) => s.screen);
    if (kind === 'pattern') return screens.filter((s) => s.patterns.includes(id) && onPlatform(s.product)).map((s) => s.id);
    if (kind === 'element') return screens.filter((s) => s.comps.includes(id) && onPlatform(s.product)).map((s) => s.id);
    return [ctx];
  }

  const viewer = $('#viewer');
  const V = { list: [], i: 0, ctx: '', focus: null, hl: false, s: 1, x: 0, y: 0, lastFocus: null };
  viewer.innerHTML = `
    <div class="vmodal">
      <div class="stage" id="stage">
        <div class="stage-inner" id="sinner"></div>
        <button class="vclose" data-v="close" aria-label="Close viewer">${svg(I.x, 18)}</button>
        <button class="vnav prev" data-v="prev" aria-label="Previous screen">${svg(I.left, 20)}</button>
        <button class="vnav next" data-v="next" aria-label="Next screen">${svg(I.right, 20)}</button>
        <div class="vtools">
          <button data-v="out" aria-label="Zoom out">${svg(I.minus)}</button><span id="vzoom">100%</span><button data-v="in" aria-label="Zoom in">${svg(I.plus)}</button>
          <i></i><button data-v="fit">Fit</button><button data-v="100">1:1</button><button data-v="200" class="hide-sm">2×</button>
          <i></i><button data-v="hl" aria-pressed="false">${svg(I.comp, 15)}<span class="hide-sm">UI Elements</span></button>
        </div>
      </div>
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
    $('[data-v="prev"]', viewer).disabled = V.i === 0;
    $('[data-v="next"]', viewer).disabled = V.i === V.list.length - 1;
    const [kind, cid] = V.ctx.split(':');
    const flowStep = kind === 'flow' ? (() => { const f = flows.find((x) => x.id === cid); return { f, st: f.steps[V.i] }; })() : null;
    const compCounts = {};
    $$('[data-comp]', scr).forEach((el) => { const c = el.dataset.comp; compCounts[c] = (compCounts[c] || 0) + 1; });
    $('#vside').innerHTML = `
      <a class="vapp" href="#app/${s.product.id}" data-close>${icon(s.product)}<span><b>${esc(s.product.name)}</b><span>${esc(industries[s.product.industry])}</span></span>${svg(I.right, 16)}</a>
      <div class="vblock"><span class="eyebrow">${V.i + 1} of ${V.list.length}</span><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p></div>
      ${flowStep ? `<div class="vstep"><span class="eyebrow">${esc(flowStep.f.name)} · step ${V.i + 1}</span><p>${esc(flowStep.st.note)}</p></div>` : ''}
      <div class="vblock"><h3>Patterns</h3><div class="taglist">${s.patterns.map((x) => `<a class="tagpill" href="#pattern/${x}" data-close>${esc(patterns[x].name)}</a>`).join('')}</div></div>
      <div class="vblock"><h3>UI Elements <span>hover to outline</span></h3><div class="clist">${s.comps.map((c) => `<button data-c="${c}" class="${V.focus === c ? 'on' : ''}"><span class="dash"></span>${esc(components[c].name)}<em>${compCounts[c] || ''}</em></button>`).join('')}</div></div>
      ${s.flows.length ? `<div class="vblock"><h3>In flows</h3><div class="taglist">${s.flows.map((x) => `<a class="tagpill" href="#flow/${x.flow.id}" data-close>${esc(x.flow.name)} · ${x.index + 1}</a>`).join('')}</div></div>` : ''}`;
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
    const padX = r.width > 700 ? 120 : 24, padY = 120;
    V.s = Math.min((r.width - padX) / MOCK.W, (r.height - padY) / MOCK.H);
    V.x = (r.width - MOCK.W * V.s) / 2; V.y = (r.height - 56 - MOCK.H * V.s) / 2 + 8; apply();
  }
  function zoomTo(ns, cx, cy) {
    const r = stage.getBoundingClientRect();
    if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    ns = Math.min(4, Math.max(0.1, ns));
    V.x = cx - (cx - V.x) * (ns / V.s); V.y = cy - (cy - V.y) * (ns / V.s); V.s = ns; apply();
  }
  const go = (d) => { const n = V.i + d; if (n >= 0 && n < V.list.length) { V.i = n; showScreen(); } };
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) return closeViewer();
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
    if (e.target.closest('button')) return;
    const r = stage.getBoundingClientRect();
    if (Math.abs(V.s - 1) < 0.02) fit(); else zoomTo(1, e.clientX - r.left, e.clientY - r.top);
  });
  // Drag to pan, two-finger pinch to zoom
  const ptrs = new Map(); let pinch = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    stage.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); stage.classList.add('grabbing');
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: V.s }; }
  });
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
    const trap = (root) => {
      const f = $$('button:not([disabled]), a[href], input', root); const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    if (!fdlg.hidden) { if (e.key === 'Escape') closeFilters(); else if (e.key === 'Tab') trap(fdlg); return; }
    if (!viewer.hidden) {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === '+' || e.key === '=') zoomTo(V.s * 1.25);
      else if (e.key === '-') zoomTo(V.s / 1.25);
      else if (e.key === '0') fit();
      else if (e.key === '1') zoomTo(1);
      else if (e.key.toLowerCase() === 'c') $('[data-v="hl"]', viewer).click();
      else if (e.key === 'Tab') trap(viewer);
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
      const { page } = route();
      if (['apps', 'screens', 'elements', 'patterns', 'flows'].includes(page)) render(true); else location.hash = 'screens';
    }, 120);
  });
  qInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') { qInput.value = ''; qInput.dispatchEvent(new Event('input')); qInput.blur(); } });

  /* ---------- Router ---------- */
  const ALIAS = { product: 'app', products: 'apps', components: 'elements', component: 'element', '': 'apps' };
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [raw, id, tab] = h.split('/');
    const page = ALIAS[raw] ?? raw;
    return { page, id, tab };
  }
  const NAV_OF = { apps: 'apps', app: 'apps', screens: 'screens', elements: 'elements', element: 'elements', flows: 'flows', flow: 'flows', patterns: 'patterns', pattern: 'patterns' };
  function render(keepScroll) {
    const y = scrollY;
    const { page, id, tab } = route();
    if (!viewer.hidden) closeViewer();
    if (!fdlg.hidden) closeFilters();
    (pages[page] || notFound)(id, tab);
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === NAV_OF[page]));
    const name = id && ((products.find((p) => p.id === id) || flows.find((f) => f.id === id) || patterns[id] || components[id] || {}).name);
    document.title = name ? `${name} · Inspux` : page === 'apps' ? 'Inspux' : `${{ screens: 'Screens', elements: 'UI Elements', flows: 'Flows', patterns: 'Patterns' }[page] || 'Inspux'} · Inspux`;
    if (keepScroll) scrollTo(0, y);
  }
  addEventListener('hashchange', () => { render(false); scrollTo(0, 0); });
  render(false);
})();
