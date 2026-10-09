(function () {
  const vars = { accent: '#ff5c35', bg: '#ffffff', side: '#1f2c3a', rail: '#1f2c3a', sideFg: '#cbd6e2', fg: '#213343', muted: '#516f90', faint: '#99afc4', border: '#dfe3eb', hover: '#f5f8fa', panel: '#f5f8fa', sel: '#e5f5f8', th: '#f5f8fa', kcol: '#f5f8fa', font: "'Inter', 'Lexend Deca', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'app.hubspot.com/' + url });

  const rail = (on) => ({ t: 'rail', w: 60, items: [
    { logo: 'H', color: '#ff5c35' }, { sep: 1 }, { i: 'bookmark' }, { i: 'users', on: on === 'crm' }, { i: 'megaphone' }, { i: 'chat' }, { i: 'dollar', on: on === 'sales' }, { i: 'help' }, { i: 'chart' }, { i: 'zap' },
  ], bottom: [{ i: 'settings' }, { av: 'Rosa Diaz' }] });

  const top = { t: 'topbar', h: 52, search: 'Search HubSpot', searchK: '⌘ K', st: 'padding-left:24px', actions: [{ l: 'Upgrade', k: 'ghost', sm: 1 }, { i: 'help', k: 'ghost' }, { i: 'settings', k: 'ghost' }, { i: 'bell', k: 'ghost' }], me: 'Rosa Diaz', center: true };

  const shell = (on, main, extra) => ({ t: 'row', c: [rail(on), { t: 'col', flex: 1, c: [top, { t: 'row', flex: 1, c: [main, ...(extra ? [extra] : [])] }] }] });

  const contactsRows = [
    [{ av: 'Ana Silva', name: 'Ana Silva', size: 26 }, 'ana@northwind.io', '+1 415 555 0142', { av: 'Rosa Diaz', size: 20 }, { l: 'Northwind', i: 'building' }, 'Today, 9:12 AM', { pill: 'Open deal', tone: 'blue' }],
    [{ av: 'Marcus Lee', name: 'Marcus Lee', size: 26 }, 'marcus@globex.com', '+1 212 555 0198', { av: 'Rosa Diaz', size: 20 }, { l: 'Globex', i: 'building' }, 'Yesterday', { pill: 'In progress', tone: 'amber' }],
    [{ av: 'Priya Nair', name: 'Priya Nair', size: 26 }, 'priya@initech.com', '+44 20 7946 0331', { av: 'Kai Moreno', size: 20 }, { l: 'Initech', i: 'building' }, 'Oct 7', { pill: 'New', tone: 'green' }],
    [{ av: 'Tom Becker', name: 'Tom Becker', size: 26 }, 'tom@hooli.dev', '+49 30 901820', { av: 'Kai Moreno', size: 20 }, { l: 'Hooli', i: 'building' }, 'Oct 6', { pill: 'Connected', tone: 'purple' }],
    [{ av: 'Sofia Ruiz', name: 'Sofia Ruiz', size: 26 }, 'sofia@umbrella.co', '+34 91 555 0110', { av: 'Lee Park', size: 20 }, { l: 'Umbrella', i: 'building' }, 'Oct 3', { pill: 'Attempted', tone: 'gray' }],
    [{ av: 'James Okafor', name: 'James Okafor', size: 26 }, 'james@wayne.ent', '+1 312 555 0177', { av: 'Rosa Diaz', size: 20 }, { l: 'Wayne Ent.', i: 'building' }, 'Oct 2', { pill: 'New', tone: 'green' }],
    [{ av: 'Lena Fischer', name: 'Lena Fischer', size: 26 }, 'lena@soylent.io', '+49 89 555 0102', { av: 'Lee Park', size: 20 }, { l: 'Soylent', i: 'building' }, 'Sep 29', { pill: 'Unqualified', tone: 'red' }],
    [{ av: 'Daniel Cho', name: 'Daniel Cho', size: 26 }, 'daniel@stark.io', '+1 650 555 0188', { av: 'Kai Moreno', size: 20 }, { l: 'Stark', i: 'building' }, 'Sep 27', { pill: 'Open deal', tone: 'blue' }],
  ];

  const contacts = { t: 'col', flex: 1, c: [
    { t: 'row', pad: '18px 24px 10px', align: 'center', gap: 10, c: [{ t: 'h', text: 'Contacts', size: 22, sub: '2,418 records' }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Actions', caret: true }, { l: 'Import' }, { l: 'Create contact', k: 'primary' }] }] },
    { t: 'tabs', style: 'box', items: [{ l: 'All contacts', x: 1 }, { l: 'My contacts', x: 1 }, { l: 'Unassigned', x: 1 }, { l: 'Open deals', x: 1 }], on: 0, add: 'Add view (4/50)', right: [{ l: 'All views', k: 'ghost', sm: 1 }] },
    { t: 'filters', search: 'Search name, phone, email', items: [{ l: 'Contact owner', caret: true }, { l: 'Create date', caret: true }, { l: 'Last activity date', caret: true }, { l: 'Lead status', caret: true }], add: 'More', addI: 'plus', right: [{ l: 'Advanced filters', i: 'sliders', k: 'ghost', sm: 1 }, { l: 'Export', sm: 1 }, { l: 'Edit columns', sm: 1 }] },
    { t: 'bulk', n: 3, actions: [{ l: 'Assign', i: 'user', sm: 1, k: 'ghost' }, { l: 'Edit', i: 'pen', sm: 1, k: 'ghost' }, { l: 'Create tasks', i: 'todo', sm: 1, k: 'ghost' }, { l: 'Add to list', i: 'list', sm: 1, k: 'ghost' }, { l: 'Delete', i: 'trash', sm: 1, k: 'ghost' }, { l: 'More', sm: 1, k: 'ghost', caret: true }] },
    { t: 'table', check: true, sel: [0, 2, 5], cols: [{ l: 'Name', sort: 'down' }, 'Email', 'Phone number', 'Contact owner', 'Primary company', 'Last activity date', 'Lead status'], rows: contactsRows },
    { t: 'pagination', text: '25 per page · 1 of 97' },
  ] };

  const deal = (title, amt, close, av, extra = {}) => ({ title: `**${title}**`, sub: `Amount: ${amt}`, meta: [{ muted: `Close date: ${close}` }], av, ...extra });
  const pipeline = { t: 'col', flex: 1, c: [
    { t: 'row', pad: '18px 24px 10px', align: 'center', gap: 10, c: [{ t: 'h', text: 'Deals', size: 22 }, { t: 'cell', v: { btn: { l: 'Sales pipeline', caret: true, sm: 1 } } }, { t: 'spacer' }, { t: 'seg', items: [{ i: 'list' }, { i: 'kanban' }], on: 1 }, { t: 'btns', items: [{ l: 'Actions', caret: true }, { l: 'Import' }, { l: 'Create deal', k: 'primary' }] }] },
    { t: 'filters', search: 'Search deals', items: [{ l: 'Deal owner', op: 'is', v: 'Rosa Diaz' }, { l: 'Create date', caret: true }, { l: 'Close date', caret: true }, { l: 'Last activity', caret: true }], add: 'More', right: [{ l: 'Board options', k: 'ghost', sm: 1, caret: true }] },
    { t: 'kanban', flex: 1, colW: 250, cols: [
      { title: 'Appointment scheduled', n: 4, sum: '$48,000', cards: [deal('Northwind – Pro annual', '$12,000', 'Oct 31', 'Rosa Diaz'), deal('Hooli – Pilot', '$6,500', 'Nov 14', 'Rosa Diaz'), deal('Soylent – Starter', '$2,400', 'Nov 20', 'Rosa Diaz')] },
      { title: 'Qualified to buy', n: 3, sum: '$71,200', cards: [deal('Globex – 40 seats', '$38,400', 'Nov 30', 'Rosa Diaz'), { ghost: true, title: 'x' }, deal('Initech – Expansion', '$14,800', 'Dec 5', 'Rosa Diaz')] },
      { title: 'Presentation scheduled', n: 2, sum: '$52,000', cards: [deal('Wayne Ent. – Enterprise', '$45,000', 'Dec 12', 'Rosa Diaz', { drag: true }), deal('Stark – Add-on', '$7,000', 'Oct 28', 'Rosa Diaz')] },
      { title: 'Decision maker bought-in', n: 1, sum: '$18,000', cards: [deal('Umbrella – Team plan', '$18,000', 'Oct 24', 'Rosa Diaz')] },
      { title: 'Contract sent', n: 1, sum: '$9,600', cards: [deal('Acme Labs – Renewal', '$9,600', 'Oct 15', 'Rosa Diaz')] },
    ] },
  ] };

  const record = { t: 'row', flex: 1, c: [
    { t: 'col', w: 330, bd: 'r', pad: '18px 20px', gap: 16, c: [
      { t: 'breadcrumbs', items: ['Contacts', 'Ana Silva'] },
      { t: 'row', gap: 12, align: 'center', c: [{ t: 'cell', v: { av: 'Ana Silva', size: 56, name: false } }, { t: 'col', c: [{ t: 'text', v: '**Ana Silva**', size: 18 }, { t: 'text', v: 'Head of Operations, Northwind', muted: true }, { t: 'text', v: 'ana@northwind.io', size: 12.5 }] }] },
      { t: 'row', gap: 8, comp: 'toolbar', justify: 'space-between', c: ['pen', 'mail', 'phone', 'todo', 'calendar', 'more'].map((i, k) => ({ t: 'col', align: 'center', gap: 4, c: [{ t: 'cell', v: { btn: { i, style: 'border-radius:50%;width:38px;height:38px' } } }, { t: 'text', v: ['Note', 'Email', 'Call', 'Task', 'Meeting', 'More'][k], size: 11.5, muted: true }] })) },
      { t: 'props', title: 'About this contact', rows: [['Email', 'ana@northwind.io'], ['Phone', '+1 415 555 0142'], ['Contact owner', { av: 'Rosa Diaz', size: 20 }], ['Lifecycle stage', { pill: 'Opportunity', tone: 'blue' }], ['Lead status', { pill: 'Open deal', tone: 'blue' }], ['Last contacted', 'Today, 9:12 AM']] },
    ] },
    { t: 'col', flex: 1, c: [
      { t: 'tabs', items: ['Overview', 'Activities', 'Intelligence'], on: 1 },
      { t: 'col', pad: '16px 24px', gap: 14, flex: 1, c: [
        { t: 'row', gap: 10, align: 'center', c: [{ t: 'search', ph: 'Search activities', st: 'width:260px' }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Collapse all', k: 'ghost', sm: 1 }] }] },
        { t: 'tabs', style: 'pill', st: 'padding:0', comp: false, items: ['Activity', 'Notes', 'Emails', 'Calls', 'Tasks', 'Meetings'], on: 0 },
        { t: 'label', v: 'Upcoming' },
        { t: 'feed', items: [{ comment: true, who: 'Rosa Diaz', when: 'Task · due Oct 14', text: '**Send revised proposal** with the 3-year pricing option Ana asked for.' }] },
        { t: 'label', v: 'October 2026' },
        { t: 'feed', items: [
          { comment: true, who: 'Rosa Diaz', when: 'Call · Oct 9, 9:12 AM · 18 min', text: 'Walked through security review. Ana needs SSO and an audit log before procurement signs. Decision expected end of month.' },
          { comment: true, who: 'Ana Silva', when: 'Email · Oct 7', text: '**Re: Pricing for 40 seats** — Thanks Rosa, could you include a 3-year option? Our CFO prefers multi-year.' },
          { i: 'eye', text: 'Ana Silva viewed **pricing page** 3 times', when: 'Oct 6' },
        ] },
      ] },
    ] },
    { t: 'col', w: 320, bd: 'l', pad: '18px 18px', gap: 14, bg: 'panel', c: [
      { t: 'cards', cols: 1, items: [
        { title: 'Companies (1)', sub: '**Northwind** · northwind.io · 240 employees', actions: [{ l: '+ Add', k: 'ghost', sm: 1 }] },
        { title: 'Deals (1)', sub: '**Northwind – Pro annual** · $12,000 · Appointment scheduled · Close Oct 31', actions: [{ l: '+ Add', k: 'ghost', sm: 1 }] },
        { title: 'Tickets (0)', sub: 'No open tickets', actions: [{ l: '+ Add', k: 'ghost', sm: 1 }] },
        { title: 'Attachments', sub: 'Security questionnaire.pdf', actions: [{ l: '+ Add', k: 'ghost', sm: 1 }] },
      ] },
    ] },
  ] };

  const createDeal = { t: 'drawer', w: 460, title: 'Create Deal', c: [
    { t: 'form', fields: [
      { l: 'Deal name', req: true, v: 'Northwind – Pro annual', focus: true },
      { l: 'Pipeline', req: true, type: 'select', v: 'Sales pipeline' },
      { l: 'Deal stage', req: true, type: 'select', v: 'Appointment scheduled' },
      { row: [{ l: 'Amount', type: 'money', v: '12,000' }, { l: 'Close date', type: 'date', v: '10/31/2026' }] },
      { l: 'Deal owner', type: 'select', v: 'Rosa Diaz', lead: { av: 'Rosa Diaz', size: 18, name: false } },
      { row: [{ l: 'Deal type', type: 'select', v: 'New business' }, { l: 'Priority', type: 'select', v: 'High' }] },
      { section: 'Associate deal with' },
      { l: 'Contact', type: 'select', v: 'Ana Silva (ana@northwind.io)' },
      { l: 'Company', type: 'select', v: 'Northwind' },
    ] },
  ], foot: [{ l: 'Cancel', k: 'ghost' }, { l: 'Create and add another' }, { l: 'Create', k: 'primary' }] };

  INSPUX.products.push({
    id: 'hubspot', name: 'HubSpot', industry: 'crm', platform: 'web', url: 'https://www.hubspot.com', color: '#ff5c35',
    tagline: 'A CRM platform that ties contacts, companies, deals and tickets to marketing, sales and service tools.',
    summary: {
      overview: 'HubSpot is built on a small set of CRM objects (contacts, companies, deals, tickets) that every hub shares. Index pages are dense, customizable tables with saved views; record pages use a stable three-column layout. Creating records happens in a right-side panel so people never lose their place.',
      structure: [
        'A dark vertical rail switches between hubs (CRM, Marketing, Sales, Service, Reporting). A top bar holds global search and notifications.',
        'Every object index has the same frame: title and create button, view tabs, quick filters, then a table or board.',
        'Record pages: identity and properties on the left, activity timeline in the middle, associated records on the right.',
        'Create and edit forms open as a right drawer over the current page.',
      ],
      strengths: [
        'The same layout across objects means learning one record page teaches all of them.',
        'Saved view tabs let reps keep their own slices (My contacts, Open deals) one click away.',
        'The activity timeline puts emails, calls, notes and web visits in one chronological story.',
        'Drag-and-drop pipeline boards with stage totals make forecasting visual.',
      ],
      pains: [
        'Feature density is high. Settings and properties sprawl across hubs and tiers.',
        'Many useful features sit behind higher pricing tiers, with upgrade prompts in the UI.',
        'Record pages with dozens of properties and associations get long and slow.',
        'Custom reporting needs a separate builder with its own learning curve.',
      ],
    },
    screens: [
      { id: 'hubspot-contacts', title: 'Contacts index', desc: 'A contacts table with saved view tabs, quick filters and a bulk action bar that replaces the toolbar when rows are selected.', patterns: ['saved-views', 'bulk-actions', 'faceted-filtering'],
        spec: { ...browser('Contacts | HubSpot', 'contacts/44120/objects/0-1/views/all/list'), body: shell('crm', contacts) } },
      { id: 'hubspot-pipeline', title: 'Deals pipeline', desc: 'Deals as a kanban board by stage, with stage totals and a card mid-drag between columns.', patterns: ['drag-and-drop', 'status-workflow', 'saved-views'],
        spec: { ...browser('Deals | HubSpot', 'contacts/44120/objects/0-3/views/all/board'), body: shell('sales', pipeline) } },
      { id: 'hubspot-create-deal', title: 'Create deal drawer', desc: 'A right drawer form for creating a deal without leaving the board, with association fields and "Create and add another".', patterns: ['progressive-disclosure', 'inline-editing'],
        spec: { ...browser('Deals | HubSpot', 'contacts/44120/objects/0-3/views/all/board'), body: shell('sales', pipeline), dim: 0.35, overlays: [createDeal] } },
      { id: 'hubspot-record', title: 'Contact record', desc: 'Three-column record: identity and quick actions on the left, filtered activity timeline in the middle, associated records on the right.', patterns: ['three-pane', 'activity-timeline', 'contextual-inspector'],
        spec: { ...browser('Ana Silva | HubSpot', 'contacts/44120/record/0-1/8812'), body: shell('crm', record) } },
    ],
    flows: [{
      id: 'hubspot-deal-flow', name: 'Log a new deal and follow up', goal: 'Capture a deal from a call, attach it to the right contact, then log the next step.',
      steps: [
        { screen: 'hubspot-pipeline', note: 'The rep starts on the pipeline board. Stage totals show where value sits; Create deal is the primary button.' },
        { screen: 'hubspot-create-deal', note: 'The drawer keeps the board visible. Pipeline and stage default to the current board. Association fields link the deal to a contact and company in one step.' },
        { screen: 'hubspot-record', note: 'On the contact record, the new deal appears in the right column and a follow-up task sits at the top of the timeline.' },
      ],
      friction: 'Required custom properties added by admins can turn the short drawer into a long form, and errors only show after pressing Create.',
    }],
  });
})();
