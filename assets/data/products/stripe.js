(function () {
  const vars = { accent: '#635bff', bg: '#ffffff', side: '#ffffff', sideFg: '#414552', sideSel: '#f5f6f8', sideOn: '#635bff', fg: '#1a1b25', muted: '#687385', faint: '#a3acba', border: '#ebeef1', hover: '#f5f6f8', panel: '#f6f8fa', sel: '#f2f1ff', c2: '#0096eb', c3: '#00a87e', font: "'Inter', -apple-system, 'Segoe UI', sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'dashboard.stripe.com/' + url });

  const sidebar = (on) => ({ t: 'sidebar', w: 232, st: 'border-right:1px solid var(--m-border)', head: { logo: 'A', name: 'Acme, Inc.', color: '#0a2540' },
    sections: [
      { items: [{ i: 'home', l: 'Home', on: on === 'home' }, { i: 'dollar', l: 'Balances' }, { i: 'refresh', l: 'Transactions', on: on === 'tx' }, { i: 'users', l: 'Customers' }, { i: 'box', l: 'Product catalog' }] },
      { title: 'Shortcuts', items: [{ i: 'clock', l: 'Subscriptions' }, { i: 'doc', l: 'Invoices' }, { i: 'alert', l: 'Disputes' }] },
      { title: 'Products', items: [{ i: 'card', l: 'Payments', caret: false }, { i: 'refresh', l: 'Billing', caret: false }, { i: 'chart', l: 'Reporting', caret: false }, { i: 'more', l: 'More', caret: false }] },
    ], foot: [{ i: 'code', l: 'Developers' }] });

  const shell = (on, main) => ({ t: 'row', c: [sidebar(on), { t: 'col', flex: 1, c: [{ t: 'topbar', h: 56, search: 'Search', actions: [{ i: 'help', k: 'ghost' }, { i: 'bell', k: 'ghost' }, { i: 'settings', k: 'ghost' }, { l: '', i: 'plus', k: 'primary', style: 'border-radius:50%;width:30px;padding:0;justify-content:center' }], st: 'border-bottom:0' }, main] }] });

  const home = { t: 'col', flex: 1, pad: '8px 40px', gap: 22, c: [
    { t: 'h', text: 'Today', size: 26 },
    { t: 'row', gap: 40, c: [
      { t: 'chart', flex: 1, kind: 'line', compare: true, n: 24, seed: 11, base: 1400, vw: 760, vh: 170, title: 'Gross volume', value: '$18,402.76', sub: 'Yesterday $14,880.10', labels: ['12:00 AM', '', '', 'Now', '', '', '11:59 PM'], unit: '$', menu: false, marker: 0.58 },
      { t: 'col', w: 260, gap: 18, c: [
        { t: 'props', rows: [['USD balance', { b: '$94,215.40' }], ['', { muted: 'Available to pay out' }]] },
        { t: 'divider' },
        { t: 'props', rows: [['Payouts', { b: '$31,920.00' }], ['', { muted: 'Expected Oct 11' }]] },
      ] },
    ] },
    { t: 'row', align: 'center', gap: 10, c: [{ t: 'h', text: 'Your overview', size: 20 }, { t: 'spacer' }, { t: 'daterange', v: 'Last 7 days', compare: 'compared to previous period' }, { t: 'btns', items: [{ l: 'Daily', sm: 1, caret: true }, { l: 'Add', i: 'plus', sm: 1 }, { l: 'Edit', i: 'pen', sm: 1 }] }] },
    { t: 'row', gap: 20, c: [
      { t: 'chart', flex: 1, card: true, kind: 'line', compare: true, seed: 3, n: 7, base: 16000, vw: 320, vh: 120, title: 'Gross volume', value: '$112.4K', d: '+18.2%', labels: ['Oct 3', 'Oct 9'], unit: '$', axis: false },
      { t: 'chart', flex: 1, card: true, kind: 'line', compare: true, seed: 5, n: 7, base: 15000, vw: 320, vh: 120, title: 'Net volume', value: '$108.9K', d: '+17.4%', labels: ['Oct 3', 'Oct 9'], axis: false },
      { t: 'chart', flex: 1, card: true, kind: 'bar', series: [[38, 44, 41, 52, 49, 57, 61]], vw: 320, vh: 120, title: 'New customers', value: '342', d: '+9.0%', labels: ['3', '4', '5', '6', '7', '8', '9'], axis: false },
    ] },
    { t: 'row', gap: 20, c: [
      { t: 'chart', flex: 1, card: true, kind: 'line', seed: 9, n: 7, vw: 320, vh: 100, title: 'Successful payments', value: '1,284', d: '+12.6%', axis: false },
      { t: 'chart', flex: 1, card: true, kind: 'line', seed: 21, n: 7, trend: -0.3, vw: 320, vh: 100, title: 'Failed payments', value: '37', d: '-4.1%', axis: false, colors: ['#df1b41'] },
      { t: 'chart', flex: 1, card: true, kind: 'area', seed: 15, n: 7, vw: 320, vh: 100, title: 'MRR', value: '$84.1K', d: '+3.2%', axis: false },
    ] },
  ] };

  const pm = (brand, last) => ({ html: `<span class="m-inline"><span style="font:700 9px/14px Inter;background:${brand === 'VISA' ? '#1a1f71' : brand === 'MC' ? '#eb001b' : '#2e77bb'};color:#fff;border-radius:3px;padding:0 4px">${brand}</span><span>•••• ${last}</span></span>` });
  const rows = [
    ['$249.00', 'USD', { pill: 'Succeeded', tone: 'green' }, pm('VISA', '4242'), 'Pro plan · annual', 'ana@northwind.io', 'Oct 9, 10:42 AM'],
    ['$1,200.00', 'USD', { pill: 'Succeeded', tone: 'green' }, pm('MC', '8210'), 'Team plan · 10 seats', 'billing@globex.com', 'Oct 9, 9:18 AM'],
    ['$49.00', 'USD', { pill: 'Refunded', tone: 'gray' }, pm('VISA', '1881'), 'Starter plan', 'kai@hooli.dev', 'Oct 9, 8:03 AM'],
    ['$899.00', 'EUR', { pill: 'Uncaptured', tone: 'amber' }, pm('AMEX', '3005'), 'Onboarding package', 'finance@initech.de', 'Oct 8, 6:51 PM'],
    ['$249.00', 'USD', { pill: 'Failed', tone: 'red' }, pm('VISA', '0341'), 'Pro plan · annual', 'jo@piedpiper.com', 'Oct 8, 4:30 PM'],
    ['$75.00', 'USD', { pill: 'Disputed', tone: 'red' }, pm('MC', '5521'), 'Add-on: extra storage', 'dan@umbrella.co', 'Oct 8, 2:12 PM'],
    ['$1,200.00', 'GBP', { pill: 'Succeeded', tone: 'green' }, pm('VISA', '7777'), 'Team plan · 10 seats', 'ops@wonka.co.uk', 'Oct 8, 11:47 AM'],
    ['$249.00', 'USD', { pill: 'Succeeded', tone: 'green' }, pm('VISA', '4040'), 'Pro plan · annual', 'lee@stark.io', 'Oct 8, 9:02 AM'],
    ['$12.00', 'USD', { pill: 'Succeeded', tone: 'green' }, pm('MC', '1200'), 'Usage overage', 'amy@acme.org', 'Oct 7, 7:40 PM'],
  ].map((r) => [{ b: r[0] }, { muted: r[1] }, r[2], r[3], r[4], r[5], { muted: r[6] }]);

  const payments = { t: 'col', flex: 1, pad: '8px 40px', gap: 14, c: [
    { t: 'h', text: 'Transactions', size: 26 },
    { t: 'tabs', st: 'padding:0', items: ['Payments', 'Collected fees', 'Transfers', 'All activity'], on: 0 },
    { t: 'kpis', comp: 'segmented-control', spark: false, plain: true, items: [{ l: 'All', v: '1,321', on: true }, { l: 'Succeeded', v: '1,284' }, { l: 'Refunded', v: '18' }, { l: 'Disputed', v: '3' }, { l: 'Failed', v: '37' }, { l: 'Uncaptured', v: '4' }] },
    { t: 'filters', st: 'padding:2px 0;border:0', items: [{ l: 'Date and time', i: 'plus' }, { l: 'Amount', i: 'plus' }, { l: 'Currency', i: 'plus' }, { l: 'Status', i: 'plus' }, { l: 'Payment method', i: 'plus' }, { l: 'More filters', i: 'plus' }], right: [{ l: 'Export', i: 'download', sm: 1 }, { l: 'Edit columns', i: 'sliders', sm: 1 }] },
    { t: 'table', check: true, hover: 0, cols: [{ l: 'Amount', w: 100 }, { l: '', w: 50 }, { l: 'Status' }, { l: 'Payment method' }, { l: 'Description' }, { l: 'Customer' }, { l: 'Date' }], rows },
    { t: 'pagination', text: 'Viewing 1–9 of 1,321 results' },
  ] };

  const detail = { t: 'col', flex: 1, pad: '4px 40px', gap: 18, c: [
    { t: 'breadcrumbs', items: ['Payments', 'pi_3Q8xK2LkdIwHu7ix0FqB'] },
    { t: 'row', align: 'center', gap: 12, c: [{ t: 'h', text: '$249.00 **USD**', size: 28, badge: ['Succeeded', 'green'] }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Refund', i: 'undo' }, { i: 'more' }] }] },
    { t: 'row', gap: 0, st: 'border-top:1px solid var(--m-border);border-bottom:1px solid var(--m-border);padding:12px 0', c: [
      { t: 'props', flex: 1, comp: false, rows: [['Last update', 'Oct 9, 10:42 AM']] }, { t: 'props', flex: 1, comp: false, rows: [['Customer', { l: 'ana@northwind.io', i: 'user' }]] }, { t: 'props', flex: 1, comp: false, rows: [['Payment method', pm('VISA', '4242')]] }, { t: 'props', flex: 1, comp: false, rows: [['Risk evaluation', { pill: 'Normal · 12', tone: 'green' }]] },
    ] },
    { t: 'row', gap: 40, flex: 1, c: [
      { t: 'col', flex: 1, gap: 22, c: [
        { t: 'feed', title: 'Timeline', items: [
          { i: 'check', text: '**Payment succeeded**', when: 'Oct 9, 10:42 AM' },
          { i: 'shield', text: 'Radar evaluated the payment: **normal risk** (12)', when: 'Oct 9, 10:42 AM' },
          { i: 'card', text: 'Payment authorized by **Visa** with 3D Secure', when: 'Oct 9, 10:41 AM' },
          { i: 'plus', text: 'Payment started via **Checkout Session**', when: 'Oct 9, 10:40 AM' },
        ] },
        { t: 'props', title: 'Payment breakdown', rows: [['Payment amount', '$249.00'], ['Stripe processing fees', '−$7.52'], ['Net amount', { b: '$241.48' }]] },
        { t: 'props', title: 'Payment method', rows: [['ID', { mono: 'pm_1Q8xK1LkdIwHu7ix' }], ['Number', '•••• 4242'], ['Expires', '04 / 2028'], ['Type', 'Visa credit card'], ['CVC check', { pill: 'Passed', tone: 'green' }], ['Street check', { pill: 'Passed', tone: 'green' }]] },
      ] },
      { t: 'col', w: 340, gap: 22, c: [
        { t: 'props', title: 'Details', rows: [['Payment ID', { mono: 'pi_3Q8x…0FqB' }], ['Description', 'Pro plan · annual'], ['Statement desc.', 'ACME* PRO'], ['Invoice', { l: 'INV-2026-0412', i: 'doc' }]] },
        { t: 'props', title: 'Metadata', titleRight: { btn: { l: 'Edit', k: 'ghost', sm: 1 } }, rows: [['order_id', { mono: '8812-A' }], ['plan', { mono: 'pro_annual' }]] },
      ] },
    ] },
  ] };

  INSPUX.products.push({
    id: 'stripe', name: 'Stripe', industry: 'payments', platform: 'web', url: 'https://stripe.com', color: '#635bff',
    tagline: 'Payments infrastructure, with a dashboard for payments, billing, payouts and reporting.',
    summary: {
      overview: 'The Stripe Dashboard serves two audiences at once: operators who refund and investigate payments, and developers who need IDs, logs and metadata. It handles this by putting the human summary first (amount, status, customer) and keeping technical detail one level down in the same page.',
      structure: [
        'Left sidebar: Home, Balances, Transactions, Customers and Product catalog, with each Stripe product (Payments, Billing, Connect) listed below.',
        'Home shows today\'s activity against yesterday, then a configurable overview of metric charts with a shared date range and comparison.',
        'Lists combine status tabs with counts, filter chips and a dense table. Every row opens a full detail page.',
        'Detail pages put amount and status in the header, key facts in a strip, a timeline on the left and IDs and metadata on the right.',
      ],
      strengths: [
        'Status tabs with live counts double as filters and as an at-a-glance health check.',
        'Detail pages show the full lifecycle of a payment in a timeline, which makes support questions quick to answer.',
        'Money-moving actions (refunds, payouts) use focused dialogs that restate amount and consequence.',
        'Consistent, restrained visual language: one accent color, semantic status pills, generous spacing.',
      ],
      pains: [
        'The breadth of products makes navigation deep. Finding a setting often requires search.',
        'Developer-oriented detail (IDs, events, metadata) can overwhelm non-technical operators.',
        'Reporting beyond the standard charts pushes people to Sigma or exports.',
        'Test mode and live mode look almost identical, which leads to mistakes.',
      ],
    },
    screens: [
      { id: 'stripe-home', title: 'Home dashboard', desc: 'Today\'s gross volume against yesterday, balances and payouts, then an overview grid of metric charts with a shared date range and comparison.', patterns: ['dashboard-overview', 'time-range-compare'],
        spec: { ...browser('Home – Stripe', 'dashboard'), body: shell('home', home) } },
      { id: 'stripe-payments', title: 'Payments list', desc: 'Status tabs with counts, add-filter chips and a dense table of payments with status pills and card brands.', patterns: ['faceted-filtering', 'status-workflow', 'saved-views', 'bulk-actions'],
        spec: { ...browser('Payments – Stripe', 'payments'), body: shell('tx', payments) } },
      { id: 'stripe-payment-detail', title: 'Payment detail', desc: 'Amount and status first, then a fact strip, a lifecycle timeline, fee breakdown and card checks, with IDs and metadata on the right.', patterns: ['activity-timeline', 'status-workflow', 'contextual-inspector'],
        spec: { ...browser('Payment – Stripe', 'payments/pi_3Q8xK2LkdIwHu7ix0FqB'), body: shell('tx', detail) } },
      { id: 'stripe-refund', title: 'Refund dialog', desc: 'A focused dialog for a money-moving action. It restates the amount, explains timing and asks for a reason.', patterns: ['confirm-destructive', 'progressive-disclosure'],
        spec: { ...browser('Payment – Stripe', 'payments/pi_3Q8xK2LkdIwHu7ix0FqB'), body: shell('tx', detail), dim: true,
          overlays: [{ t: 'modal', y: 110, w: 520, title: 'Refund payment', c: [
            { t: 'banner', tone: 'info', text: 'Refunds take 5–10 days to appear on a customer\'s statement. Stripe\'s fees for the original payment won\'t be returned.' },
            { t: 'form', fields: [
              { l: 'Refund', type: 'money', v: '249.00', suffix: 'USD', focus: true, hint: 'Up to $249.00. Enter a smaller amount for a partial refund.' },
              { l: 'Reason', type: 'select', v: 'Requested by customer' },
              { l: 'Note', type: 'textarea', ph: 'Add a note about this refund (only visible to your team)', h: 72, opt: true },
            ] },
          ], foot: [{ l: 'Cancel' }, { l: 'Refund $249.00', k: 'primary' }] }] } },
    ],
    flows: [{
      id: 'stripe-refund-flow', name: 'Refund a customer', goal: 'Find a specific payment and refund it in full, with a reason recorded for the team.',
      steps: [
        { screen: 'stripe-payments', note: 'Status tabs and filter chips narrow the list. The customer email column is the usual way support finds the payment.' },
        { screen: 'stripe-payment-detail', note: 'The detail page confirms it is the right payment: amount, card, customer and timeline. Refund is the primary action in the header.' },
        { screen: 'stripe-refund', note: 'The dialog pre-fills the full amount, warns about timing and fees, and the button repeats the exact amount being refunded.' },
      ],
      friction: 'People who start from a customer record must first open the customer, then the payment. There is no refund action directly in the payments table.',
    }],
  });
})();
