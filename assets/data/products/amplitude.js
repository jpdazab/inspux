(function () {
  const vars = { accent: '#1e61f0', bg: '#ffffff', side: '#f7f8fa', sideFg: '#3d4351', sideSel: '#e8effe', sideOn: '#1e61f0', fg: '#1f2433', muted: '#5f6779', faint: '#9aa1b0', border: '#e3e6ec', hover: '#f2f4f7', panel: '#f7f8fa', sel: '#e8effe', c2: '#13c2c2', c3: '#f5a623', c4: '#a35ce0', font: "'Inter', 'IBM Plex Sans', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'app.amplitude.com/analytics/acme/' + url });

  const sidebar = (on) => ({ t: 'sidebar', w: 224, head: { logo: 'A', name: 'Acme Analytics', color: '#1e61f0' }, cta: { l: 'Create', i: 'plus', k: 'primary' },
    sections: [
      { items: [{ i: 'home', l: 'Home', on: on === 'home' }, { i: 'folder', l: 'Spaces' }, { i: 'grid', l: 'Dashboards' }, { i: 'chart', l: 'Charts', on: on === 'chart' }, { i: 'users', l: 'Cohorts' }, { i: 'zap', l: 'Experiments' }, { i: 'play', l: 'Session replay' }] },
      { title: 'Favorites', items: [{ i: 'star', l: 'Product KPIs' }, { i: 'star', l: 'Checkout funnel' }, { i: 'star', l: 'Activation weekly' }] },
      { title: 'Data', items: [{ i: 'server', l: 'Events' }, { i: 'tag', l: 'Properties' }, { i: 'shield', l: 'Governance' }] },
    ], foot: [{ i: 'help', l: 'Help & resources' }, { i: 'settings', l: 'Settings' }] });

  const top = (title, actions) => ({ t: 'topbar', h: 56, title, star: true, actions: actions || [{ l: 'Share', i: 'link', sm: 1 }, { l: 'Save', k: 'primary', sm: 1 }], st: 'padding:0 20px' });

  const queryPanel = (kind) => ({ t: 'col', w: 400, bd: 'r', pad: '14px 16px', gap: 14, bg: 'panel', comp: 'form', c: [
    { t: 'row', gap: 8, align: 'center', c: [{ t: 'cell', v: { btn: { l: kind === 'funnel' ? 'Funnel Analysis' : 'Segmentation', i: kind === 'funnel' ? 'filter' : 'chart', caret: true } } }, { t: 'spacer' }, { t: 'cell', v: { btn: { i: 'more', k: 'ghost' } } }] },
    { t: 'label', v: kind === 'funnel' ? 'Steps' : 'Events', right: { btn: { l: 'Add event', i: 'plus', k: 'ghost', sm: 1 } } },
    ...(kind === 'funnel' ? [
      ['A', 'View product page', '#1e61f0'], ['B', 'Add to cart', '#13c2c2'], ['C', 'Start checkout', '#f5a623'], ['D', 'Complete purchase', '#a35ce0'],
    ].map(([k, l, c]) => ({ t: 'row', gap: 8, align: 'center', st: 'background:var(--m-bg);border:1px solid var(--m-border);border-radius:8px;padding:8px 10px', c: [{ t: 'cell', v: { html: `<span class="m-logo sm" style="background:${c}">${k}</span>` } }, { t: 'text', v: `**${l}**`, flex: 1 }, { t: 'cell', v: { i: 'filter' } }] })) : [
      { t: 'col', gap: 6, st: 'background:var(--m-bg);border:1px solid var(--m-border);border-radius:8px;padding:10px', c: [
        { t: 'row', gap: 8, align: 'center', c: [{ t: 'cell', v: { html: '<span class="m-logo sm" style="background:#1e61f0">A</span>' } }, { t: 'text', v: '**Complete purchase**', flex: 1 }, { t: 'cell', v: { i: 'x' } }] },
        { t: 'filters', comp: false, st: 'padding:0;border:0', items: [{ l: 'where', v: 'cart_value ≥ 50' }], add: 'filter' },
        { t: 'row', gap: 6, align: 'center', c: [{ t: 'text', v: 'Measured as', muted: true, size: 12 }, { t: 'seg', items: ['Uniques', 'Event totals', 'Active %', 'Property sum'], on: 0 }] },
      ] },
    ]),
    { t: 'label', v: 'Segment by' },
    { t: 'col', gap: 6, st: 'background:var(--m-bg);border:1px solid var(--m-border);border-radius:8px;padding:10px', c: [
      { t: 'row', gap: 8, align: 'center', c: [{ t: 'cell', v: { i: 'users', l: '**All users**' } }, { t: 'spacer' }, { t: 'cell', v: { i: 'more' } }] },
      { t: 'filters', comp: false, st: 'padding:0;border:0', items: [{ l: 'country', op: '=', v: 'United States, Canada' }], add: 'where' },
    ] },
    { t: 'label', v: 'Breakdown by' },
    { t: 'row', gap: 8, c: [{ t: 'cell', v: { btn: { l: 'platform', i: 'layers', caret: true } } }, { t: 'cell', v: { btn: { l: 'Add', i: 'plus', k: 'ghost' } } }] },
    ...(kind === 'funnel' ? [{ t: 'label', v: 'Conversion window' }, { t: 'row', gap: 8, c: [{ t: 'cell', v: { btn: { l: 'within 1 day', caret: true } } }, { t: 'cell', v: { btn: { l: 'this order', caret: true } } }] }] : []),
  ] });

  const chartHeader = (title) => ({ t: 'row', gap: 10, align: 'center', c: [
    { t: 'text', v: title, size: 18, weight: 600 }, { t: 'spacer' },
    { t: 'daterange', v: 'Last 30 days' }, { t: 'seg', items: ['Daily', 'Weekly', 'Monthly'], on: 0 }, { t: 'cell', v: { btn: { l: 'Compare', i: 'refresh', sm: 1 } } },
  ] });

  // Deterministic daily series for the three platforms
  const gen = (seed, base) => { let v = base, s = seed; return Array.from({ length: 30 }, () => { s = (s * 9301 + 49297) % 233280; v += (s / 233280 - 0.45) * base * 0.12; return Math.round(v); }); };

  const segChart = { t: 'col', flex: 1, pad: '18px 24px', gap: 16, c: [
    chartHeader('Purchasers by platform'),
    { t: 'chart', kind: 'line', vw: 900, vh: 300, series: [gen(3, 2000), gen(11, 1550), gen(29, 950)], legend: ['iOS', 'Android', 'Web'], labels: ['Sep 10', 'Sep 17', 'Sep 24', 'Oct 1', 'Oct 9'], marker: 0.83 },
    { t: 'table', dense: true, cols: [{ l: 'Segment' }, { l: 'Platform' }, { l: 'Average', r: 1 }, { l: 'Oct 7', r: 1 }, { l: 'Oct 8', r: 1 }, { l: 'Oct 9', r: 1 }], rows: [
      [{ sw: '#1e61f0', l: 'All users' }, 'iOS', 2104, 2210, 2188, 2342], [{ sw: '#13c2c2', l: 'All users' }, 'Android', 1622, 1704, 1660, 1718], [{ sw: '#f5a623', l: 'All users' }, 'Web', 988, 1012, 940, 1066],
    ] },
  ] };

  const funnelChart = { t: 'col', flex: 1, pad: '18px 24px', gap: 16, c: [
    chartHeader('Checkout funnel'),
    { t: 'kpis', spark: false, plain: true, items: [{ l: 'Overall conversion', v: '18.4%', d: '+2.1 pts', on: true }, { l: 'Users completed', v: '9,812' }, { l: 'Median time to convert', v: '14m 20s' }, { l: 'Biggest drop-off', v: 'B → C', sub: '41.2% leave at checkout start' }] },
    { t: 'chart', kind: 'funnel', vw: 900, vh: 280, series: [[53300, 31400, 18460, 9812]], labels: ['View product page', 'Add to cart', 'Start checkout', 'Complete purchase'], axis: true },
    { t: 'table', dense: true, cols: ['Step', { l: 'Users', r: 1 }, { l: 'Conversion', r: 1 }, { l: 'Drop-off', r: 1 }, { l: 'Median time', r: 1 }], rows: [
      ['A · View product page', '53,300', '100%', '—', '—'], ['B · Add to cart', '31,400', '58.9%', '21,900', '3m 02s'], ['C · Start checkout', '18,460', '34.6%', { b: '12,940' }, '6m 41s'], ['D · Complete purchase', '9,812', '18.4%', '8,648', '4m 37s'],
    ] },
  ] };

  const home = { t: 'col', flex: 1, pad: '20px 28px', gap: 18, c: [
    { t: 'row', align: 'center', gap: 10, c: [{ t: 'h', text: 'Product KPIs', size: 24, sub: 'Dashboard · Growth team · Updated 4 min ago' }, { t: 'spacer' }, { t: 'daterange', v: 'Last 30 days', compare: 'vs. prior period' }, { t: 'btns', items: [{ l: 'Filter', i: 'filter', sm: 1 }, { l: 'Edit', i: 'pen', sm: 1 }, { l: 'Share', i: 'link', sm: 1 }] }] },
    { t: 'kpis', seed: 5, items: [{ l: 'Daily active users', v: '48,210', d: '+6.4%' }, { l: 'Weekly active users', v: '182,904', d: '+3.1%' }, { l: 'D7 retention', v: '41.8%', d: '-1.2%', color: '#13c2c2', trend: -0.2 }, { l: 'Checkout conversion', v: '18.4%', d: '+2.1 pts' }] },
    { t: 'row', gap: 16, c: [
      { t: 'chart', flex: 1, card: true, kind: 'area', seed: 31, n: 30, base: 45000, vw: 560, vh: 200, title: 'Active users', sub: 'Daily · all platforms', labels: ['Sep 10', 'Sep 24', 'Oct 9'] },
      { t: 'chart', flex: 1, card: true, kind: 'stack', series: [[820, 900, 870, 950, 1010, 980, 1100, 1150], [400, 420, 460, 430, 480, 510, 520, 560], [200, 210, 190, 240, 260, 250, 270, 300]], vw: 560, vh: 200, title: 'New users by channel', legend: ['Organic', 'Paid', 'Referral'], labels: ['W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39', 'W40'] },
    ] },
    { t: 'row', gap: 16, c: [
      { t: 'chart', flex: 1, card: true, kind: 'line', series: [[100, 58, 49, 45, 43, 42, 41.8, 41], [100, 55, 46, 43, 41, 40, 39.5, 39]], vw: 560, vh: 170, title: 'Retention · new users', legend: ['This period', 'Previous'], labels: ['Day 0', 'Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 21', 'Day 28', 'Day 30'], unit: '%' },
      { t: 'chart', flex: 1, card: true, kind: 'funnel', series: [[53300, 31400, 18460, 9812]], vw: 560, vh: 170, title: 'Checkout funnel', labels: ['View', 'Cart', 'Checkout', 'Purchase'] },
    ] },
  ] };

  const editor = (kind) => ({ t: 'row', c: [sidebar('chart'), { t: 'col', flex: 1, c: [top(kind === 'funnel' ? 'Checkout funnel' : 'Untitled chart', [{ l: 'Add to dashboard', sm: 1 }, { l: 'Share', i: 'link', sm: 1 }, { l: 'Save', k: 'primary', sm: 1 }]), { t: 'row', flex: 1, c: [queryPanel(kind), kind === 'funnel' ? funnelChart : segChart] }] }] });

  INSPUX.products.push({
    id: 'amplitude', name: 'Amplitude', industry: 'analytics', platform: 'web', url: 'https://amplitude.com', color: '#1e61f0',
    tagline: 'Product analytics for understanding user behavior: events, funnels, retention and experiments.',
    summary: {
      overview: 'Amplitude turns event data into charts without SQL. Every chart is built the same way: pick a chart type, define events, segment users, break down by a property. The result updates live beside the query, and any chart can be saved, shared or pinned to a dashboard.',
      structure: [
        'Left sidebar: Home, Spaces, Dashboards, Charts, Cohorts, Experiments and Session replay, plus favorites.',
        'Chart builder: a query panel on the left (chart type, events, segments, breakdowns) and the chart and data table on the right.',
        'A global date range, interval and compare control sits above every chart.',
        'Dashboards arrange saved charts in a grid with KPI tiles on top.',
      ],
      strengths: [
        'The query panel reads like a sentence (events, measured as, for these users, broken down by), which helps non-analysts.',
        'Live chart updates make exploration fast and forgiving.',
        'Funnels name the biggest drop-off directly, so the insight is visible without reading the chart.',
        'Charts link to the users and sessions behind a data point.',
      ],
      pains: [
        'Results depend on clean event tracking. Messy taxonomies produce confusing dropdowns.',
        'Many chart types with subtle differences (event totals vs uniques vs active %) confuse newcomers.',
        'Dashboards accumulate fast and go stale without ownership.',
        'Advanced features (cohorts, formulas) have a steep learning curve.',
      ],
    },
    screens: [
      { id: 'amplitude-dashboard', title: 'KPI dashboard', desc: 'KPI tiles with sparklines and deltas, then active users, acquisition, retention and funnel charts under one date range.', patterns: ['dashboard-overview', 'time-range-compare'],
        spec: { ...browser('Product KPIs – Amplitude', 'dashboard/kpis'), body: { t: 'row', c: [sidebar('home'), { t: 'col', flex: 1, c: [home] }] } } },
      { id: 'amplitude-segmentation', title: 'Chart builder', desc: 'Query panel on the left (event, filters, measure, segment, breakdown), live line chart and data table on the right.', patterns: ['live-preview', 'progressive-disclosure', 'time-range-compare'],
        spec: { ...browser('Untitled chart – Amplitude', 'chart/new'), body: editor('seg') } },
      { id: 'amplitude-funnel', title: 'Funnel analysis', desc: 'Four-step funnel with conversion per step, headline metrics that name the biggest drop-off, and a step table.', patterns: ['live-preview', 'dashboard-overview'],
        spec: { ...browser('Checkout funnel – Amplitude', 'chart/8h2k1x'), body: editor('funnel') } },
      { id: 'amplitude-save', title: 'Save chart dialog', desc: 'Saving asks for a name, a space and an optional dashboard, so new charts land where the team will find them.', patterns: ['progressive-disclosure', 'sharing-permissions'],
        spec: { ...browser('Checkout funnel – Amplitude', 'chart/8h2k1x'), body: editor('funnel'), dim: true, overlays: [{ t: 'modal', w: 520, y: 140, title: 'Save chart', c: [
          { t: 'form', fields: [
            { l: 'Name', v: 'Checkout funnel — US & Canada', focus: true },
            { l: 'Description', type: 'textarea', ph: 'What question does this chart answer?', h: 64, opt: true },
            { l: 'Space', type: 'select', v: 'Growth team', lead: { i: 'folder' } },
            { l: 'Add to dashboard', type: 'select', v: 'Product KPIs', lead: { i: 'grid' }, opt: true },
            { type: 'check', l: 'Notify me when conversion changes by more than 10%', v: true },
          ] },
        ], footLeft: [{ i: 'lock', l: 'Visible to everyone in Acme' }], foot: [{ l: 'Cancel' }, { l: 'Save', k: 'primary' }] }] } },
    ],
    flows: [{
      id: 'amplitude-funnel-flow', name: 'Find where checkout loses people', goal: 'Go from a question about purchases to a saved funnel the growth team can track.',
      steps: [
        { screen: 'amplitude-segmentation', note: 'Start with a segmentation chart of purchases by platform. The query panel reads top to bottom like a sentence.' },
        { screen: 'amplitude-funnel', note: 'Switching the chart type to Funnel reuses the segment and breakdown. The headline row calls out the biggest drop-off (B → C).' },
        { screen: 'amplitude-save', note: 'Saving asks for a space and a dashboard, and offers an alert, so the funnel becomes something the team monitors.' },
      ],
      friction: 'Switching chart types resets some settings (measure, interval). People rebuild parts of the query and are not told what was dropped.',
    }],
  });
})();
