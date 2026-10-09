(function () {
  const vars = { accent: '#8f5bff', bg: '#16141c', side: '#1d1a25', panel: '#1f1c28', raised: '#211e2b', hover: '#2a2636', sel: '#2e2546', border: '#2f2b3b', fg: '#e9e6f2', muted: '#9a94ad', faint: '#6c6680', canvas: '#121017', danger: '#ff5c7a', c2: '#ffb020', c3: '#3fc1a5', c4: '#4e9dff', chrome: '#0f0d14', th: '#1f1c28', font: "'Inter', 'Noto Sans', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', theme: 'dark', vars, tab: title, url: 'app.datadoghq.com/' + url });

  const rail = (on) => ({ t: 'rail', w: 64, items: [
    { logo: 'D', color: '#632ca6' }, { i: 'search', l: 'Search' }, { sep: 1 }, { i: 'grid', l: 'Dashb.', on: on === 'dash' }, { i: 'bell', l: 'Monitors', on: on === 'mon' }, { i: 'activity', l: 'APM' }, { i: 'list', l: 'Logs', on: on === 'logs' }, { i: 'server', l: 'Infra' }, { i: 'shield', l: 'Security' },
  ], bottom: [{ i: 'help' }, { av: 'Rosa Diaz' }] });

  const timepicker = (v) => ({ t: 'daterange', v: v || 'Past 1 Hour', compare: '10:14 – 11:14' });

  // Monitors list
  const monitors = { t: 'row', c: [rail('mon'), { t: 'col', flex: 1, c: [
    { t: 'topbar', h: 52, title: 'Monitors', tabs: ['Manage Monitors', 'Triggered', 'Downtimes', 'SLOs'], tabOn: 1, actions: [{ l: 'New Monitor', i: 'plus', k: 'primary', sm: 1 }] },
    { t: 'row', flex: 1, c: [
      { t: 'facets', w: 230, bd: 'r', bg: 'panel', pad: '8px 0', groups: [
        { title: 'Status', items: [['Alert', '3', true, '#ff5c7a'], ['Warn', '2', true, '#ffb020'], ['No Data', '1', false, '#9a94ad'], ['OK', '214', false, '#3fc1a5']] },
        { title: 'Service', items: [['checkout-api', '4', false], ['payments-worker', '2', false], ['search', '1', false], ['web-frontend', '6', false]] },
        { title: 'Monitor type', items: [['Metric', '148', false], ['APM', '42', false], ['Log', '19', false], ['Synthetics', '11', false]] },
        { title: 'Team', open: false, items: [] }, { title: 'Priority', open: false, items: [] },
      ] },
      { t: 'col', flex: 1, c: [
        { t: 'filters', search: 'status:(alert OR warn) env:prod', items: [], right: [{ l: 'Mute', i: 'bell', sm: 1 }, { l: 'Edit tags', i: 'tag', sm: 1 }], count: '5 monitors' },
        { t: 'table', check: true, dense: true, cols: ['Status', 'Monitor name', 'Tags', 'Triggered', 'Priority', 'Owner'], rows: [
          [{ pill: 'ALERT', tone: 'red' }, { b: '[checkout-api] p95 latency above 800ms' }, { tags: ['env:prod', 'team:payments'] }, '12 min ago', 'P1', { av: 'Rosa Diaz', size: 20 }],
          [{ pill: 'ALERT', tone: 'red' }, { b: '[checkout-api] Error rate above 2%' }, { tags: ['env:prod', 'team:payments'] }, '11 min ago', 'P1', { av: 'Rosa Diaz', size: 20 }],
          [{ pill: 'ALERT', tone: 'red' }, { b: '[payments-worker] Queue depth > 5k' }, { tags: ['env:prod'] }, '9 min ago', 'P2', { av: 'Kai Moreno', size: 20 }],
          [{ pill: 'WARN', tone: 'amber' }, '[db-primary] CPU above 75%', { tags: ['env:prod', 'team:platform'] }, '24 min ago', 'P3', { av: 'Kai Moreno', size: 20 }],
          [{ pill: 'WARN', tone: 'amber' }, '[web-frontend] LCP above 2.5s', { tags: ['env:prod', 'team:web'] }, '1 h ago', 'P3', { av: 'Lee Park', size: 20 }],
        ], sel: [] },
        { t: 'chart', pad: '14px 16px', kind: 'line', vw: 1060, vh: 170, base: 400, seed: 4, n: 60, threshold: 0.66, band: [0.78, 1], title: '[checkout-api] p95 latency', sub: 'Threshold 800 ms · Alerting since 10:58', labels: ['10:15', '10:30', '10:45', '11:00', '11:14'], unit: 'ms', series: [Array.from({ length: 60 }, (_, i) => (i < 46 ? 420 + Math.sin(i / 3) * 40 + (i % 7) * 6 : 860 + Math.sin(i) * 90 + (i - 46) * 12))], colors: ['#8f5bff'] },
      ] },
    ] },
  ] }] };

  // Dashboard
  const qv = (title, v, unit, tone) => ({ t: 'col', flex: 1, gap: 6, st: 'background:var(--m-raised);border:1px solid var(--m-border);border-radius:6px;padding:12px 14px', comp: 'kpi-tile', c: [{ t: 'text', v: title, muted: true, size: 12 }, { t: 'cell', v: { html: `<span style="font-size:34px;font-weight:600;color:${tone}">${v}</span><span style="font-size:14px;color:var(--m-muted)">${unit}</span>` } }] });
  const spikeSeries = (base, spike, n = 60) => Array.from({ length: n }, (_, i) => Math.round(base + Math.sin(i / 2.3) * base * 0.08 + (i > 45 ? spike * (1 - Math.abs(i - 52) / 14) : 0)));
  const dashboard = { t: 'row', c: [rail('dash'), { t: 'col', flex: 1, c: [
    { t: 'row', pad: '10px 16px', gap: 10, align: 'center', bd: 'b', c: [{ t: 'text', v: '**Checkout service — Overview**', size: 16 }, { t: 'cell', v: { i: 'star' } }, { t: 'spacer' }, timepicker(), { t: 'btns', items: [{ i: 'refresh', sm: 1 }, { l: 'Share', sm: 1 }, { l: 'Configure', sm: 1, caret: true }] }] },
    { t: 'filters', items: [{ l: '$env', v: 'prod', x: false }, { l: '$service', v: 'checkout-api', x: false }, { l: '$region', v: 'us-east-1', x: false }], add: 'Add variable', right: [{ l: 'Saved views', k: 'ghost', sm: 1, caret: true }] },
    { t: 'col', flex: 1, pad: 14, gap: 12, bg: 'canvas', c: [
      { t: 'row', gap: 12, c: [qv('Error rate', '4.2', '%', '#ff5c7a'), qv('p95 latency', '912', 'ms', '#ffb020'), qv('Requests / s', '1,284', '', '#e9e6f2'), qv('Apdex', '0.81', '', '#ffb020')] },
      { t: 'row', gap: 12, c: [
        { t: 'chart', flex: 1, card: true, kind: 'stack', vw: 520, vh: 180, title: 'Requests by status code', legend: ['2xx', '4xx', '5xx'], colors: ['#3fc1a5', '#ffb020', '#ff5c7a'], series: [spikeSeries(900, -120, 30), spikeSeries(40, 10, 30), spikeSeries(8, 260, 30).map((v, i) => (i > 22 ? v : 6))], labels: ['10:15', '', '', '', '', '', '', '', '', '', '10:45', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '11:14'] },
        { t: 'chart', flex: 1, card: true, kind: 'line', vw: 520, vh: 180, title: 'Latency p50 / p95 / p99', legend: ['p50', 'p95', 'p99'], colors: ['#4e9dff', '#ffb020', '#ff5c7a'], series: [spikeSeries(180, 60), spikeSeries(420, 480), spikeSeries(640, 900)], unit: 'ms', band: [0.76, 1], labels: ['10:15', '10:45', '11:14'] },
      ] },
      { t: 'row', gap: 12, c: [
        { t: 'col', flex: 1, gap: 8, st: 'background:var(--m-raised);border:1px solid var(--m-border);border-radius:10px;padding:12px 14px', c: [{ t: 'text', v: '**Top endpoints by error rate**' }, { t: 'table', dense: true, comp: 'data-table', cols: ['Resource', { l: 'Errors', r: 1 }, 'Share'], rows: [[{ mono: 'POST /v2/checkout/confirm' }, '1,204', { bar: 0.82, color: '#ff5c7a' }], [{ mono: 'POST /v2/payment_intents' }, '388', { bar: 0.27, color: '#ff5c7a' }], [{ mono: 'GET /v2/cart' }, '41', { bar: 0.04, color: '#ff5c7a' }]] }] },
        { t: 'col', flex: 1, gap: 8, st: 'background:var(--m-raised);border:1px solid var(--m-border);border-radius:10px;padding:12px 14px', c: [{ t: 'text', v: '**Events**' }, { t: 'feed', items: [{ i: 'alert', text: '**Monitor triggered** · checkout-api p95 latency above 800ms', when: '10:58' }, { i: 'branch', text: '**Deploy** checkout-api v2.41.0 by Kai Moreno', when: '10:52' }, { i: 'refresh', text: 'Autoscaling added 4 hosts to checkout-api', when: '10:31' }] }] },
      ] },
    ] },
  ] }] };

  // Logs
  const logRows = [
    ['Oct 09 11:13:58.412', 'error', 'checkout-api', 'PaymentIntentConfirmError: card_declined after 3DS timeout (pi_3Q8x…) trace_id=8f12'],
    ['Oct 09 11:13:57.981', 'error', 'checkout-api', 'Timeout calling payments-worker after 5000ms route=/v2/checkout/confirm'],
    ['Oct 09 11:13:57.640', 'warn', 'payments-worker', 'Queue lag 5,812 messages; consumer slow (batch=50)'],
    ['Oct 09 11:13:56.233', 'error', 'checkout-api', 'Timeout calling payments-worker after 5000ms route=/v2/checkout/confirm'],
    ['Oct 09 11:13:55.910', 'info', 'web-frontend', 'GET /checkout 200 1.82s user_agent=Safari/17'],
    ['Oct 09 11:13:55.102', 'error', 'checkout-api', 'Retry budget exhausted for payments-worker (3/3)'],
    ['Oct 09 11:13:54.877', 'warn', 'checkout-api', 'Circuit breaker half-open for payments-worker'],
    ['Oct 09 11:13:54.004', 'error', 'checkout-api', 'Timeout calling payments-worker after 5000ms route=/v2/checkout/confirm'],
    ['Oct 09 11:13:53.761', 'info', 'payments-worker', 'Processed batch size=50 duration=4.9s'],
    ['Oct 09 11:13:53.120', 'error', 'checkout-api', 'Timeout calling payments-worker after 5000ms route=/v2/payment_intents'],
    ['Oct 09 11:13:52.540', 'info', 'checkout-api', 'POST /v2/cart 200 84ms'],
    ['Oct 09 11:13:51.998', 'error', 'checkout-api', 'Timeout calling payments-worker after 5000ms route=/v2/checkout/confirm'],
  ];
  const logs = { t: 'row', c: [rail('logs'), { t: 'col', flex: 1, c: [
    { t: 'row', pad: '10px 16px', gap: 10, align: 'center', bd: 'b', c: [{ t: 'text', v: '**Log Explorer**', size: 16 }, { t: 'seg', items: ['List', 'Patterns', 'Transactions'], on: 0 }, { t: 'spacer' }, timepicker('Past 15 Minutes'), { t: 'btns', items: [{ l: 'Live', i: 'play', sm: 1 }, { l: 'Save view', sm: 1, caret: true }] }] },
    { t: 'row', pad: '8px 16px', gap: 8, bd: 'b', align: 'center', c: [{ t: 'search', flex: 1, v: 'service:checkout-api status:error env:prod', k: '⌘ ↵' }, { t: 'cell', v: { btn: { l: 'Group into', sm: 1, caret: true } } }] },
    { t: 'row', flex: 1, c: [
      { t: 'facets', w: 220, bd: 'r', bg: 'panel', pad: '6px 0', groups: [
        { title: 'Status', items: [['Error', '18.2k', true, '#ff5c7a'], ['Warn', '2.1k', false, '#ffb020'], ['Info', '412k', false, '#4e9dff']] },
        { title: 'Service', items: [['checkout-api', '16.4k', true], ['payments-worker', '1.6k', false], ['web-frontend', '220', false]] },
        { title: 'Host', items: [['i-0a4f…e1', '4.1k', false], ['i-0b77…9c', '3.9k', false], ['i-0c12…40', '3.2k', false]] },
        { title: '@http.route', open: false, items: [] },
      ] },
      { t: 'col', flex: 1, c: [
        { t: 'chart', pad: '8px 16px 0', kind: 'stack', axis: false, vw: 1000, vh: 70, colors: ['#4e9dff', '#ffb020', '#ff5c7a'], series: [spikeSeries(40, 0, 45), spikeSeries(6, 6, 45), spikeSeries(4, 34, 45).map((v, i) => (i > 33 ? v : 3))], comp: 'chart' },
        { t: 'logs', flex: 1, sel: 1, rows: logRows },
      ] },
    ] },
  ] }] };

  const logDrawer = { t: 'drawer', w: 520, crumbs: ['checkout-api', 'error'], headIcons: ['ext', 'copy'], c: [
    { t: 'text', v: 'Timeout calling payments-worker after 5000ms', size: 15, weight: 600 },
    { t: 'props', rows: [['Date', 'Oct 09 11:13:57.981'], ['Host', { mono: 'i-0a4f2c91e1' }], ['Service', { pill: 'checkout-api', tone: 'purple' }], ['Trace', { l: '[[View trace 8f12…a03]]', i: 'route' }]] },
    { t: 'tabs', st: 'padding:0', items: ['Event attributes', 'Trace', 'Metrics', 'Processes'], on: 0 },
    { t: 'code', lines: ['{', '  "http": { "route": "/v2/checkout/confirm", "status_code": 504 },', '  "error": { "kind": "TimeoutError", "message": "upstream timeout" },', '  "upstream": "payments-worker", "timeout_ms": 5000,', '  "version": "v2.41.0", "usr": { "id": "u_8812" }', '}'] },
  ], foot: [{ l: 'View in context', sm: 1 }, { l: 'Create monitor', k: 'primary', sm: 1 }] };

  // New monitor
  const newMonitor = { t: 'row', c: [rail('mon'), { t: 'col', flex: 1, c: [
    { t: 'topbar', h: 52, crumbs: ['Monitors', 'New Monitor', 'Metric'], actions: [{ l: 'Cancel', k: 'ghost', sm: 1 }, { l: 'Test notifications', sm: 1 }, { l: 'Create', k: 'primary', sm: 1 }] },
    { t: 'row', flex: 1, c: [
      { t: 'col', flex: 1, pad: '18px 28px', gap: 16, c: [
        { t: 'text', v: '**1 · Choose the detection method**', size: 14 },
        { t: 'form', comp: false, fields: [{ type: 'radio', l: '', cards: true, v: 0, opts: [['Threshold alert', 'Alert when a metric crosses a fixed value'], ['Anomaly detection', 'Alert when a metric deviates from its usual pattern']] }] },
        { t: 'text', v: '**2 · Define the metric**', size: 14 },
        { t: 'code', title: 'Query', lines: ['avg(last_5m):p95:trace.http.request{service:checkout-api,env:prod} > 0.8'] },
        { t: 'chart', card: true, kind: 'line', vw: 760, vh: 140, axis: true, unit: 's', threshold: 0.66, series: [spikeSeries(0.42, 0.5)], labels: ['10:15', '10:45', '11:14'], title: 'Preview · Past 1 hour' },
        { t: 'text', v: '**3 · Set alert conditions**', size: 14 },
        { t: 'form', comp: false, fields: [{ row: [{ l: 'Alert threshold', v: '0.8', trail: { muted: 'seconds' } }, { l: 'Warning threshold', v: '0.6', trail: { muted: 'seconds' } }, { l: 'Evaluate over', type: 'select', v: 'last 5 minutes' }] }] },
      ] },
      { t: 'col', w: 420, bd: 'l', pad: '18px 22px', gap: 14, bg: 'panel', c: [
        { t: 'text', v: '**4 · Configure notifications**', size: 14 },
        { t: 'form', fields: [
          { l: 'Monitor name', v: '[checkout-api] p95 latency above {{threshold}}s' },
          { l: 'Message', type: 'textarea', h: 160, v: 'p95 latency on **checkout-api** is {{value}}s. Runbook: [[wiki/runbooks/checkout-latency]] — notify @slack-payments-oncall and @pagerduty-checkout' },
          { l: 'Priority', type: 'select', v: 'P1 · Critical' },
          { l: 'Tags', type: 'chips', opts: ['env:prod', 'team:payments', 'service:checkout-api'] },
          { type: 'toggle', l: 'Renotify if the monitor is not resolved', hint: 'Every 30 minutes', v: true },
        ] },
      ] },
    ] },
  ] }] };

  INSPUX.products.push({
    id: 'datadog', name: 'Datadog', industry: 'devops', platform: 'web', url: 'https://www.datadoghq.com', color: '#632ca6',
    tagline: 'Observability for cloud applications: metrics, traces, logs and alerting in one place.',
    summary: {
      overview: 'Datadog is built for incidents: get alerted, look at the dashboard, drill into traces and logs, all while keeping the same time range and tags. Dense, dark interfaces put as much data on screen as possible, and every chart is a door into the underlying logs or traces.',
      structure: [
        'An icon rail switches between products (Dashboards, Monitors, APM, Logs, Infrastructure, Security).',
        'Every explorer has the same anatomy: a search query bar, facets with counts on the left, a histogram on top and a result list.',
        'Dashboards are grids of widgets driven by template variables (env, service, region) and one time picker.',
        'Selecting any log, trace or host opens a side panel with attributes and links to related data.',
      ],
      strengths: [
        'The shared time range and tags make jumping from alert to dashboard to logs seamless.',
        'Facets with counts show the shape of the data before filtering, and every value is one click from a filter.',
        'Monitor previews plot the query and threshold before saving, so alerts are tuned against real data.',
        'High information density suits on-call engineers scanning many signals at once.',
      ],
      pains: [
        'The query syntax and huge product surface take months to learn.',
        'Dense, low-contrast dark UI and tiny text strain the eyes.',
        'Cost visibility is poor; it is easy to create expensive custom metrics or log indexes.',
        'Dashboards multiply without ownership, so teams struggle to find the right one during an incident.',
      ],
    },
    screens: [
      { id: 'datadog-monitors', title: 'Triggered monitors', desc: 'Faceted monitor list filtered to alerting and warning states, with the selected monitor\'s latency graph against its threshold.', patterns: ['faceted-filtering', 'status-workflow', 'bulk-actions'],
        spec: { ...browser('Monitors | Datadog', 'monitors/triggered'), body: monitors } },
      { id: 'datadog-dashboard', title: 'Service dashboard', desc: 'Template variables and a time picker drive every widget: query values, stacked status codes, latency percentiles, top endpoints and an event feed.', patterns: ['dashboard-overview', 'time-range-compare', 'saved-views'],
        spec: { ...browser('Checkout service — Overview | Datadog', 'dashboard/abc-123'), body: dashboard } },
      { id: 'datadog-logs', title: 'Log explorer', desc: 'Search query, status and service facets with counts, a stacked histogram, a log stream, and the selected log in a side panel with attributes.', patterns: ['faceted-filtering', 'master-detail', 'global-search'],
        spec: { ...browser('Log Explorer | Datadog', 'logs?query=service%3Acheckout-api'), body: logs, overlays: [logDrawer] } },
      { id: 'datadog-new-monitor', title: 'New monitor form', desc: 'Numbered sections for detection method, metric query with live preview, alert conditions and the notification message.', patterns: ['live-preview', 'progressive-disclosure'],
        spec: { ...browser('New Monitor | Datadog', 'monitors/create/metric'), body: newMonitor } },
    ],
    flows: [{
      id: 'datadog-incident-flow', name: 'Investigate a latency alert', goal: 'Go from a paging alert to the log line that explains it.',
      steps: [
        { screen: 'datadog-monitors', note: 'Triggered monitors are filtered by status. The selected monitor shows the latency breaking the threshold at 10:58.' },
        { screen: 'datadog-dashboard', note: 'The service dashboard opens with env and service already set. The event feed shows a deploy six minutes before the alert.' },
        { screen: 'datadog-logs', note: 'Filtering logs to checkout-api errors shows repeated timeouts to payments-worker. The side panel links to the full trace.' },
      ],
      friction: 'Each jump between products opens a new view with its own time picker, and context (time range, tags) is sometimes lost, especially from dashboards into custom log views.',
    }],
  });
})();
