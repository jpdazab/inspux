(function () {
  const vars = { accent: '#2383e2', bg: '#ffffff', side: '#f8f8f7', sideFg: '#5f5e5b', fg: '#37352f', muted: '#787774', faint: '#a5a29d', border: '#e9e9e7', hover: '#efefed', sel: '#e7f3fd', panel: '#f8f8f7', font: "'Inter', -apple-system, 'Segoe UI', sans-serif" };

  const sidebar = (on) => ({
    t: 'sidebar', w: 248,
    head: { logo: 'A', name: 'Acme HQ', color: '#37352f', icons: ['pen'] },
    sections: [
      { items: [{ i: 'search', l: 'Search' }, { i: 'home', l: 'Home' }, { i: 'inbox', l: 'Inbox', badge: '2' }] },
      { title: 'Favorites', items: [{ i: 'doc', l: 'Q4 planning' }, { i: 'table', l: 'Product roadmap', on: on === 'roadmap' }] },
      { title: 'Teamspaces', items: [
        { logo: 'E', color: '#0b6e99', l: 'Engineering', caret: true },
        { i: 'book', l: 'Engineering wiki', d: 1, caret: true },
        { i: 'doc', l: 'Onboarding guide', d: 2, on: on === 'onboarding' },
        { i: 'doc', l: 'On-call runbook', d: 2 },
        { i: 'doc', l: 'Architecture decisions', d: 2 },
        { i: 'table', l: 'Product roadmap', d: 1 },
        { i: 'calendar', l: 'Meeting notes', d: 1 },
        { logo: 'D', color: '#ad1a72', l: 'Design', caret: false },
      ] },
      { title: 'Private', items: [{ i: 'doc', l: 'Reading list', caret: false }, { i: 'todo', l: 'My tasks', caret: false }] },
    ],
    foot: [{ i: 'settings', l: 'Settings' }, { i: 'layers', l: 'Templates' }, { i: 'trash', l: 'Trash' }],
  });

  const topbar = (crumbs, extra = {}) => ({ t: 'topbar', h: 44, bd: '', crumbs, actions: [{ l: 'Edited 2h ago', k: 'ghost', sm: 1 }, { l: 'Share', k: 'ghost', sm: 1 }, { i: 'chat', k: 'ghost', sm: 1 }, { i: 'star', k: 'ghost', sm: 1 }, { i: 'more', k: 'ghost', sm: 1 }], ...extra });

  const pageBlocks = (slash) => [
    { t: 'callout', i: 'info', v: 'Welcome to Acme! This page is your first-week checklist. Work through it with your onboarding buddy and tick items off as you go.', bg: '#f1f1ef' },
    { t: 'h2', v: 'Week one' },
    { t: 'todo', done: true, v: 'Get laptop and accounts from IT (Google, Slack, GitHub)' },
    { t: 'todo', done: true, v: 'Read the [[Engineering principles]]' },
    { t: 'todo', v: 'Ship a small fix to production with your buddy' },
    { t: 'todo', v: 'Shadow an on-call shift' },
    { t: 'h2', v: 'Who to ask' },
    { t: 'bullet', v: '**Platform**: @Kai Moreno (deploys, CI, infra access)' },
    { t: 'bullet', v: '**Product**: @Lee Park (roadmap, priorities)' },
    { t: 'toggle', v: 'FAQ: how do I get production access?' },
    slash ? { t: 'p', v: '/ta', focus: true, handle: true } : { t: 'p', v: "Press '/' for commands", ph: true, handle: true },
  ];

  const pageBody = (slash) => ({ t: 'row', c: [
    sidebar('onboarding'),
    { t: 'col', flex: 1, c: [
      topbar(['Engineering', 'Engineering wiki', 'Onboarding guide']),
      { t: 'doc', flex: 1, cover: 'linear-gradient(120deg,#e3d7c8,#c9d6df 55%,#b8c7d3)', icon: '🚀', title: 'Onboarding guide', maxw: 760, blocks: pageBlocks(slash) },
    ] },
  ] });

  const db = {
    t: 'table', comp: 'data-table', grid: true, cols: [{ l: 'Aa Name', w: 330 }, { l: 'Status', w: 130 }, { l: 'Owner', w: 150 }, { l: 'Quarter', w: 90 }, { l: 'Priority', w: 100 }, { l: 'Team', w: 140 }],
    rows: [
      [{ i: 'doc', l: '**Offline mode for mobile**' }, { pill: 'In progress', tone: 'blue', dot: 1 }, { av: 'Kai Moreno', size: 20 }, 'Q4', { pill: 'High', tone: 'red' }, { tags: [['Mobile', 'purple']] }],
      [{ i: 'doc', l: '**SSO for Enterprise**' }, { pill: 'In progress', tone: 'blue', dot: 1 }, { av: 'Rosa Diaz', size: 20 }, 'Q4', { pill: 'High', tone: 'red' }, { tags: [['Platform', 'amber']] }],
      [{ i: 'doc', l: '**Usage-based billing**' }, { pill: 'Planned', tone: 'gray', dot: 1 }, { av: 'Lee Park', size: 20 }, 'Q1', { pill: 'Medium', tone: 'amber' }, { tags: [['Billing', 'green']] }],
      [{ i: 'doc', l: '**Redesign settings**' }, { pill: 'Planned', tone: 'gray', dot: 1 }, { av: 'Ana Silva', size: 20 }, 'Q1', { pill: 'Low', tone: 'gray' }, { tags: [['Design', 'purple']] }],
      [{ i: 'doc', l: '**Audit log export**' }, { pill: 'Done', tone: 'green', dot: 1 }, { av: 'Rosa Diaz', size: 20 }, 'Q3', { pill: 'Medium', tone: 'amber' }, { tags: [['Platform', 'amber']] }],
      [{ i: 'doc', l: '**AI meeting summaries**' }, { pill: 'Research', tone: 'purple', dot: 1 }, { av: 'Lee Park', size: 20 }, 'Q2', { pill: 'Medium', tone: 'amber' }, { tags: [['AI', 'blue']] }],
      [{ i: 'doc', l: '**Public API v2**' }, { pill: 'Done', tone: 'green', dot: 1 }, { av: 'Kai Moreno', size: 20 }, 'Q3', { pill: 'High', tone: 'red' }, { tags: [['Platform', 'amber']] }],
    ],
    foot: '+ New',
  };

  const dbBody = { t: 'row', c: [
    sidebar('roadmap'),
    { t: 'col', flex: 1, c: [
      topbar(['Engineering', 'Product roadmap']),
      { t: 'col', flex: 1, pad: '28px 96px 0', gap: 10, c: [
        { t: 'h', text: 'Product roadmap', size: 36, icon: '🗺️' },
        { t: 'text', v: 'What we are building this quarter and next. Owners keep status current every Friday.', muted: true, size: 14 },
        { t: 'tabs', st: 'padding:0;margin-top:12px', items: [{ i: 'calendar', l: 'Timeline' }, { i: 'kanban', l: 'By status' }, { i: 'table', l: 'All projects' }], on: 2, add: true, right: [{ i: 'filter', k: 'ghost', sm: 1 }, { i: 'sort', k: 'ghost', sm: 1 }, { i: 'search', k: 'ghost', sm: 1 }, { i: 'sliders', k: 'ghost', sm: 1 }, { l: 'New', k: 'primary', sm: 1, caret: true }] },
        { t: 'filters', st: 'padding:6px 0;border:0', items: [{ l: 'Quarter', op: 'is', v: 'Q4, Q1' }, { l: 'Status', op: 'is not', v: 'Archived' }], add: 'Add filter' },
        db,
      ] },
    ] },
  ] };

  INSPUX.products.push({
    id: 'notion', name: 'Notion', industry: 'docs-knowledge', platform: 'desktop', url: 'https://www.notion.com', color: '#37352f',
    tagline: 'A connected workspace where docs, wikis and databases are built from the same blocks.',
    summary: {
      overview: 'Notion builds everything from blocks. A page can hold text, toggles and callouts next to a full database with its own views, and any database row opens as a page. That flexibility makes it a wiki, a project tracker and a CRM at once, at the cost of a blank-canvas problem for new users.',
      structure: [
        'Sidebar tree of pages, grouped into Favorites, Teamspaces and Private. Pages nest without limit.',
        'The page is the only screen type: an optional cover and icon, a title, then blocks. Databases are blocks too.',
        'Databases show the same rows as table, board, timeline, calendar or gallery views, as tabs above the data.',
        'Share, comments, history and page options live in a slim top bar with breadcrumbs.',
      ],
      strengths: [
        'One mental model (blocks) covers writing, structured data and layout.',
        'The slash menu and Markdown shortcuts make formatting fast without a toolbar.',
        'Database views let each team look at the same data their own way.',
        'Templates and a calm, typographic UI make pages pleasant to read.',
      ],
      pains: [
        'Blank pages and unlimited nesting lead to sprawling, hard-to-navigate workspaces.',
        'Large databases and long pages get slow, especially on the desktop app.',
        'Permissions are inherited down the tree, which surprises people when they move pages.',
        'Formulas, relations and rollups have a steep learning curve for non-technical users.',
      ],
    },
    screens: [
      { id: 'notion-page', title: 'Wiki page', desc: 'A team wiki page with a cover, icon, callout, to-dos and toggles. The sidebar tree shows where the page sits.', patterns: ['inline-editing', 'progressive-disclosure', 'onboarding-checklist'],
        spec: { chrome: 'mac', vars, title: 'Onboarding guide', body: pageBody(false) } },
      { id: 'notion-slash', title: 'Slash command menu', desc: 'Typing "/" opens a filtered menu of block types. "/ta" narrows to tables and database views.', patterns: ['slash-commands', 'keyboard-first'],
        spec: { chrome: 'mac', vars, title: 'Onboarding guide', body: pageBody(true),
          overlays: [{ t: 'menu', x: 560, y: 405, w: 330, items: [
            { head: 'Basic blocks' }, { box: 'table', l: 'Table', sub: 'Add a simple tabular content.', on: true },
            { head: 'Database' }, { box: 'table', l: 'Table view', sub: 'Add inline Table database.' }, { box: 'kanban', l: 'Board view', sub: 'Add an inline Kanban board.' }, { box: 'calendar', l: 'Timeline view', sub: 'Add an inline timeline.' },
            { sep: 1 }, { l: 'Type on to filter…', sub: 'esc to close' },
          ] }] } },
      { id: 'notion-database', title: 'Database table view', desc: 'A roadmap database shown as a table, with view tabs, applied filters and typed properties.', patterns: ['saved-views', 'inline-editing', 'status-workflow'],
        spec: { chrome: 'mac', vars, title: 'Product roadmap', body: dbBody } },
      { id: 'notion-share', title: 'Share menu', desc: 'A share popover anchored to the Share button. Invite people, set access per person and for the whole workspace, or publish to the web.', patterns: ['sharing-permissions'],
        spec: { chrome: 'mac', vars, title: 'Product roadmap', body: dbBody,
          overlays: [{ t: 'pop', x: 1000, y: 40, w: 420, comp: 'popover', c: [
            { t: 'tabs', comp: false, st: 'padding:0;margin:-6px 0 0', items: ['Share', 'Publish'], on: 0 },
            { t: 'row', gap: 8, c: [{ t: 'form', comp: false, flex: 1, fields: [{ ph: 'Email or group, separated by commas', focus: false }] }, { t: 'btns', items: [{ l: 'Invite', k: 'primary' }] }] },
            { t: 'list', comp: false, dense: true, st: 'margin:0 -16px', items: [
              { av: 'Rosa Diaz', title: '**Rosa Diaz** (You)', sub: 'rosa@acme.com', right: 'Full access' },
              { av: 'Lee Park', title: '**Lee Park**', sub: 'lee@acme.com', right: 'Can edit' },
              { av: 'Kai Moreno', title: '**Kai Moreno**', sub: 'kai@acme.com', right: 'Can comment' },
            ] },
            { t: 'label', v: 'General access' },
            { t: 'row', gap: 10, align: 'center', c: [{ t: 'cell', v: { html: '<span class="m-logo" style="background:#0b6e99">E</span>' } }, { t: 'col', flex: 1, c: [{ t: 'text', v: '**Engineering teamspace**' }, { t: 'text', v: 'Anyone in the teamspace can edit', muted: true, size: 12 }] }, { t: 'cell', v: { btn: { l: 'Can edit', k: 'ghost', sm: 1, caret: true } } }] },
            { t: 'row', st: 'border-top:1px solid var(--m-border);padding-top:12px;margin:0 -16px;padding-left:16px;padding-right:16px', c: [{ t: 'cell', v: { i: 'help', l: 'Learn about sharing' } }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Copy link', i: 'link' }] }] },
          ] }] } },
    ],
    flows: [{
      id: 'notion-roadmap-flow', name: 'Turn a wiki page into a shared roadmap', goal: 'Add structured project data to the team wiki and give the right people access.',
      steps: [
        { screen: 'notion-page', note: 'The empty line at the end of the page shows a "/" hint and a "+" handle on hover, so there are two ways to add a block.' },
        { screen: 'notion-slash', note: 'Typing "/ta" filters the slash menu to tables and database views. Each option has a preview icon and a one-line description.' },
        { screen: 'notion-database', note: 'The database gets view tabs, filters and typed properties. The same rows can be shown as a board or timeline from the tabs.' },
        { screen: 'notion-share', note: 'Share opens as a popover, not a page. It shows who already has access before asking who to add.' },
      ],
      friction: 'Choosing between "Table" (a simple block) and "Table view" (a database) is a common source of confusion. They look the same in the menu but behave very differently later.',
    }],
  });
})();
