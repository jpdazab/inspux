(function () {
  const vars = { accent: '#7a1f5c', accentFg: '#ffffff', bg: '#ffffff', side: '#ffffff', sideFg: '#3a2f37', sideSel: '#f6eef3', sideOn: '#7a1f5c', fg: '#221a20', muted: '#6e6370', faint: '#a79dab', border: '#e8e3e8', hover: '#f6f3f6', panel: '#faf8fa', sel: '#f6eef3', th: '#faf8fa', font: "'Inter', 'Basel', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'app.rippling.com/' + url });

  const top = { t: 'topbar', h: 54, bg: '#4a1238', st: 'color:#fff;border-bottom:0', title: 'RIPPLING', center: true, search: 'Search or jump to…', searchK: '⌘ K', actions: [{ i: 'help', k: 'ghost', style: 'color:#f1dce9' }, { i: 'bell', k: 'ghost', style: 'color:#f1dce9' }], me: 'Rosa Diaz' };

  const sidebar = (on) => ({ t: 'sidebar', w: 232, head: { logo: 'R', name: 'Acme, Inc.', color: '#fdb71c' },
    sections: [
      { items: [{ i: 'home', l: 'Home' }, { i: 'inbox', l: 'Inbox', badge: '4' }] },
      { title: 'HR', items: [{ i: 'users', l: 'People', on: on === 'people' }, { i: 'briefcase', l: 'Hiring' }, { i: 'calendar', l: 'Time off' }, { i: 'book', l: 'Learning' }] },
      { title: 'Payroll & Spend', items: [{ i: 'dollar', l: 'Payroll', on: on === 'payroll' }, { i: 'card', l: 'Corporate cards' }, { i: 'doc', l: 'Expenses' }] },
      { title: 'IT', items: [{ i: 'server', l: 'Devices' }, { i: 'grid', l: 'Apps' }, { i: 'shield', l: 'Identity' }] },
      { title: 'Platform', items: [{ i: 'chart', l: 'Reports' }, { i: 'zap', l: 'Workflow Studio' }] },
    ] });

  const shell = (on, main) => ({ t: 'col', c: [top, { t: 'row', flex: 1, c: [sidebar(on), main] }] });

  const people = [
    ['Ana Silva', 'Head of Operations', 'Operations', 'San Francisco', 'Rosa Diaz', 'Mar 4, 2024', 'Full-time', ['Active', 'green']],
    ['Marcus Lee', 'Senior Engineer', 'Engineering', 'Remote · US', 'Kai Moreno', 'Jan 16, 2023', 'Full-time', ['Active', 'green']],
    ['Priya Nair', 'Product Designer', 'Design', 'London', 'Lee Park', 'Aug 1, 2025', 'Full-time', ['Active', 'green']],
    ['Tom Becker', 'Account Executive', 'Sales', 'Berlin', 'Sofia Ruiz', 'Oct 20, 2026', 'Full-time', ['Onboarding', 'blue']],
    ['Sofia Ruiz', 'Sales Director', 'Sales', 'Madrid', 'Rosa Diaz', 'Feb 2, 2022', 'Full-time', ['Active', 'green']],
    ['James Okafor', 'Data Analyst', 'Finance', 'Remote · US', 'Lena Fischer', 'Jun 10, 2025', 'Part-time', ['On leave', 'amber']],
    ['Lena Fischer', 'Controller', 'Finance', 'New York', 'Rosa Diaz', 'Apr 18, 2023', 'Full-time', ['Active', 'green']],
    ['Daniel Cho', 'Security Contractor', 'IT', 'Remote · CA', 'Kai Moreno', 'Sep 1, 2026', 'Contractor', ['Active', 'green']],
  ].map(([n, t, d, l, m, s, e, st]) => [{ av: n, name: n, sub: t, size: 30 }, d, l, { av: m, size: 20 }, s, e, { pill: st[0], tone: st[1], dot: 1 }]);

  const peopleMain = { t: 'col', flex: 1, c: [
    { t: 'row', pad: '20px 28px 8px', align: 'center', gap: 10, c: [{ t: 'h', text: 'People', size: 24, sub: '214 employees · 12 contractors' }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Org chart', i: 'branch' }, { l: 'Export', i: 'download' }, { l: 'Hire', i: 'plus', k: 'primary' }] }] },
    { t: 'tabs', items: [{ l: 'Directory' }, { l: 'Onboarding', n: 3 }, { l: 'Offboarding', n: 1 }, { l: 'Changes', n: 6 }], on: 0 },
    { t: 'filters', search: 'Search by name, title or email', items: [{ l: 'Department', caret: true }, { l: 'Location', caret: true }, { l: 'Employment type', op: 'is not', v: 'Former' }, { l: 'Manager', caret: true }], add: 'Filter', right: [{ l: 'Columns', i: 'sliders', k: 'ghost', sm: 1 }] },
    { t: 'table', cols: ['Name', 'Department', 'Work location', 'Manager', 'Start date', 'Type', 'Status'], rows: people },
  ] };

  const wizard = (step, content, foot) => ({ t: 'col', flex: 1, c: [
    { t: 'row', pad: '16px 28px', align: 'center', gap: 12, bd: 'b', c: [{ t: 'cell', v: { btn: { i: 'x', k: 'ghost' } } }, { t: 'h', text: 'Hire Tom Becker', size: 18, sub: 'Account Executive · Sales · Berlin' }, { t: 'spacer' }, { t: 'text', v: 'Draft saved 30s ago', muted: true, size: 12 }, { t: 'btns', items: [{ l: 'Save and exit' }] }] },
    { t: 'row', flex: 1, c: [
      { t: 'col', w: 280, pad: '24px 16px', bd: 'r', bg: 'panel', c: [{ t: 'stepper', vertical: true, on: step, steps: [['Basics', 'Name, role, manager'], ['Employment', 'Start date, type, location'], ['Compensation', 'Salary, equity, bonus'], ['Benefits', 'Plan eligibility'], ['Apps & devices', 'Accounts, laptop'], ['Review & send', 'Offer letter']] }] },
      { t: 'col', flex: 1, pad: '28px 56px', gap: 18, c: content },
    ] },
    { t: 'row', pad: '12px 28px', bd: 't', align: 'center', gap: 10, c: [{ t: 'text', v: `Step ${step + 1} of 6`, muted: true }, { t: 'spacer' }, { t: 'btns', items: foot }] },
  ] });

  const basics = wizard(0, [
    { t: 'h', text: 'Basics', size: 22, sub: 'Rippling uses these details to create accounts and paperwork automatically.' },
    { t: 'form', st: 'max-width:640px', fields: [
      { row: [{ l: 'Legal first name', req: true, v: 'Tom' }, { l: 'Legal last name', req: true, v: 'Becker' }] },
      { l: 'Personal email', req: true, v: 'tom.becker@gmail', focus: true, err: 'Enter a full email address, like name@example.com' },
      { row: [{ l: 'Role title', req: true, v: 'Account Executive' }, { l: 'Department', req: true, type: 'select', v: 'Sales' }] },
      { l: 'Manager', type: 'select', v: 'Sofia Ruiz · Sales Director', lead: { av: 'Sofia Ruiz', size: 18, name: false } },
      { type: 'radio', l: 'Employment type', cards: true, v: 0, opts: [['Full-time employee', 'Eligible for benefits and equity'], ['Part-time employee', 'Hourly, prorated benefits'], ['Contractor', 'Paid by invoice, no benefits']] },
    ] },
  ], [{ l: 'Back', k: 'ghost' }, { l: 'Continue', k: 'primary', i: 'arrow' }]);

  const review = wizard(5, [
    { t: 'h', text: 'Review and send offer', size: 22, sub: 'Check the details. Tom will get an offer letter to sign, then onboarding starts automatically.' },
    { t: 'banner', tone: 'success', text: 'When Tom signs, Rippling will create a Google Workspace account, invite him to Slack and GitHub, and ship a MacBook Pro to Berlin.' },
    { t: 'row', gap: 16, c: [
      { t: 'props', flex: 1, st: 'border:1px solid var(--m-border);border-radius:10px;padding:14px 16px', title: 'Basics', titleRight: { btn: { l: 'Edit', k: 'ghost', sm: 1 } }, rows: [['Name', 'Tom Becker'], ['Email', 'tom.becker@gmail.com'], ['Role', 'Account Executive'], ['Manager', { av: 'Sofia Ruiz', size: 20 }]] },
      { t: 'props', flex: 1, st: 'border:1px solid var(--m-border);border-radius:10px;padding:14px 16px', title: 'Employment', titleRight: { btn: { l: 'Edit', k: 'ghost', sm: 1 } }, rows: [['Start date', 'Oct 20, 2026'], ['Type', 'Full-time'], ['Location', 'Berlin office'], ['Entity', 'Acme GmbH']] },
    ] },
    { t: 'row', gap: 16, c: [
      { t: 'props', flex: 1, st: 'border:1px solid var(--m-border);border-radius:10px;padding:14px 16px', title: 'Compensation', titleRight: { btn: { l: 'Edit', k: 'ghost', sm: 1 } }, rows: [['Base salary', { b: '€92,000 / year' }], ['Commission', '€40,000 OTE'], ['Equity', '2,400 options'], ['Pay schedule', 'Monthly']] },
      { t: 'props', flex: 1, st: 'border:1px solid var(--m-border);border-radius:10px;padding:14px 16px', title: 'Apps & devices', titleRight: { btn: { l: 'Edit', k: 'ghost', sm: 1 } }, rows: [['Accounts', { tags: ['Google', 'Slack', 'GitHub', 'HubSpot'] }], ['Laptop', 'MacBook Pro 14″'], ['Ship to', 'Home address'], ['Groups', 'Sales EMEA']] },
    ] },
  ], [{ l: 'Back', k: 'ghost' }, { l: 'Preview offer letter' }, { l: 'Send offer', k: 'primary', i: 'send' }]);

  const payroll = { t: 'col', flex: 1, c: [
    { t: 'row', pad: '18px 28px 10px', align: 'center', gap: 12, c: [{ t: 'h', text: 'Run payroll · Oct 1–15', size: 22, sub: 'Acme, Inc. · Semi-monthly · Pay date Fri, Oct 17' }, { t: 'spacer' }, { t: 'stepper', on: 1, steps: ['Hours & earnings', 'Review', 'Approve'], st: 'width:420px' }] },
    { t: 'col', pad: '6px 28px', gap: 14, flex: 1, c: [
      { t: 'banner', tone: 'warn', text: '**2 employees** are missing bank details and will be paid by check unless updated by Oct 15, 5 PM PT.', actions: [{ l: 'Review', sm: 1 }] },
      { t: 'kpis', spark: false, plain: true, items: [{ l: 'Total payroll cost', v: '$412,860.22', on: true }, { l: 'Employee net pay', v: '$288,104.10' }, { l: 'Employer taxes', v: '$31,402.88' }, { l: 'Debit date', v: 'Oct 15', sub: 'from Chase ••4410' }] },
      { t: 'filters', st: 'padding:4px 0;border:0', search: 'Search employees', items: [{ l: 'Department', caret: true }, { l: 'Pay type', caret: true }, { l: 'Has changes', v: 'Yes' }], count: '226 people' },
      { t: 'table', dense: true, cols: ['Employee', 'Pay type', { l: 'Gross pay', r: 1 }, { l: 'Deductions', r: 1 }, { l: 'Taxes', r: 1 }, { l: 'Net pay', r: 1 }, 'Changes'], rows: [
        [{ av: 'Ana Silva', name: 'Ana Silva', size: 22 }, 'Salary', '$7,916.67', '$612.40', '$1,904.22', { b: '$5,400.05' }, { muted: '—' }],
        [{ av: 'Marcus Lee', name: 'Marcus Lee', size: 22 }, 'Salary', '$8,750.00', '$730.10', '$2,201.80', { b: '$5,818.10' }, { pill: 'Bonus +$2,000', tone: 'blue' }],
        [{ av: 'James Okafor', name: 'James Okafor', size: 22 }, 'Hourly', '$2,880.00', '$140.00', '$588.60', { b: '$2,151.40' }, { pill: '64 h', tone: 'gray' }],
        [{ av: 'Lena Fischer', name: 'Lena Fischer', size: 22 }, 'Salary', '$7,083.33', '$590.00', '$1,702.44', { b: '$4,790.89' }, { pill: 'Missing bank', tone: 'amber' }],
        [{ av: 'Daniel Cho', name: 'Daniel Cho', size: 22 }, 'Contractor', '$6,400.00', '$0.00', '$0.00', { b: '$6,400.00' }, { muted: '—' }],
        [{ av: 'Sofia Ruiz', name: 'Sofia Ruiz', size: 22 }, 'Salary', '$9,583.33', '$802.20', '$2,410.10', { b: '$6,371.03' }, { pill: 'Commission +$3,120', tone: 'blue' }],
      ] },
    ] },
    { t: 'row', pad: '12px 28px', bd: 't', align: 'center', gap: 10, c: [{ t: 'text', v: 'Approve by **Oct 15, 5:00 PM PT** to pay on time.', muted: true }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Back', k: 'ghost' }, { l: 'Preview report', i: 'doc' }, { l: 'Approve payroll', k: 'primary' }] }] },
  ] };

  INSPUX.products.push({
    id: 'rippling', name: 'Rippling', industry: 'hr', platform: 'web', url: 'https://www.rippling.com', color: '#7a1f5c',
    tagline: 'HR, payroll, IT and spend on one employee record, so a single change updates every system.',
    summary: {
      overview: 'Rippling\'s core idea is a single employee record that drives everything else. Hiring someone creates their payroll profile, benefits eligibility, app accounts and laptop order in one flow. The UI leans on long, carefully staged wizards for these high-stakes tasks and on dense tables for day-to-day administration.',
      structure: [
        'A dark top bar with global search; a left sidebar grouped by suite (HR, Payroll & Spend, IT, Platform).',
        'Index pages are tables with tabs for lifecycle states (Directory, Onboarding, Offboarding).',
        'High-stakes tasks (hiring, payroll runs, terminations) use full-screen wizards with a vertical stepper and a fixed footer.',
        'Every wizard ends on a review page that summarizes each step with Edit links.',
      ],
      strengths: [
        'One action fans out to many systems, and the review step says exactly what will happen.',
        'Inline validation explains how to fix each error, right under the field.',
        'Payroll review surfaces problems (missing bank details, changes) before money moves.',
        'Draft autosave on long wizards means people can leave and come back safely.',
      ],
      pains: [
        'The breadth of modules makes navigation long and settings hard to find.',
        'Wizards are long; people cannot see later required fields until they get there.',
        'Pricing and features vary by module, so menus differ between companies.',
        'Admin power comes with complex permission settings that are easy to misconfigure.',
      ],
    },
    screens: [
      { id: 'rippling-people', title: 'People directory', desc: 'Employee table with lifecycle tabs (Directory, Onboarding, Offboarding), filters and a primary Hire action.', patterns: ['saved-views', 'faceted-filtering', 'status-workflow'],
        spec: { ...browser('People – Rippling', 'employee-list'), body: shell('people', peopleMain) } },
      { id: 'rippling-hire-basics', title: 'Hire wizard: basics', desc: 'Step one of a six-step hire wizard: vertical stepper, inline validation with a fix-it message, and radio cards for employment type.', patterns: ['wizard', 'progressive-disclosure'],
        spec: { ...browser('Hire – Rippling', 'hire/new'), body: shell('people', basics) } },
      { id: 'rippling-hire-review', title: 'Hire wizard: review', desc: 'The final step summarizes every section with Edit links and explains what will happen automatically after the offer is signed.', patterns: ['wizard', 'confirm-destructive'],
        spec: { ...browser('Hire – Rippling', 'hire/new/review'), body: shell('people', review) } },
      { id: 'rippling-payroll', title: 'Payroll review', desc: 'Payroll run on the Review step: blocking issues first, totals and debit date, then a per-employee table with changes called out.', patterns: ['wizard', 'dashboard-overview', 'confirm-destructive'],
        spec: { ...browser('Run payroll – Rippling', 'payroll/run/2026-10-15'), body: shell('payroll', payroll) } },
    ],
    flows: [{
      id: 'rippling-hire-flow', name: 'Hire a new employee', goal: 'Create the employee, send an offer, and have accounts and a laptop ready on day one.',
      steps: [
        { screen: 'rippling-people', note: 'Hiring starts from the People directory. The Onboarding tab will show the new hire until their start date.' },
        { screen: 'rippling-hire-basics', note: 'Step one collects identity and role. The email error says how to fix it, and the stepper shows the five steps still ahead.' },
        { screen: 'rippling-hire-review', note: 'The review page restates every section and spells out what happens after signing: accounts, groups and a laptop shipment.' },
      ],
      friction: 'Compensation and benefits steps need information that hiring managers often do not have, so many drafts stall halfway and someone else has to finish them.',
    }],
  });
})();
