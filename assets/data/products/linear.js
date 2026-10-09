(function () {
  const vars = { accent: '#5e6ad2', bg: '#191a1f', side: '#131417', panel: '#1d1e24', raised: '#222329', hover: '#272830', sel: '#2b2d48', border: '#2a2b32', sideSel: '#26272e' };

  const sidebar = (on) => ({
    t: 'sidebar', w: 232,
    head: { logo: 'A', name: 'Acme', color: '#e5484d', icons: ['search', 'pen'] },
    sections: [
      { items: [{ i: 'inbox', l: 'Inbox', n: 3, on: on === 'inbox' }, { i: 'target', l: 'My issues', on: on === 'my' }, { i: 'layers', l: 'Views' }] },
      { title: 'Workspace', items: [{ i: 'box', l: 'Projects' }, { i: 'cycle', l: 'Initiatives' }, { i: 'more', l: 'More' }] },
      { title: 'Your teams', items: [
        { logo: 'E', color: '#3e63dd', l: 'Engineering', caret: true },
        { i: 'cycle', l: 'Issues', d: 1, on: on === 'issues' }, { i: 'refresh', l: 'Cycles', d: 1 }, { i: 'box', l: 'Projects', d: 1 }, { i: 'layers', l: 'Views', d: 1 },
        { logo: 'D', color: '#d6409f', l: 'Design', caret: false },
        { logo: 'M', color: '#46a758', l: 'Mobile', caret: false },
      ] },
      { title: 'Try', items: [{ i: 'download', l: 'Import issues' }, { i: 'users', l: 'Invite people' }] },
    ],
  });

  const issues = {
    progress: [
      ['ENG-2041', 'Sync engine drops offline edits after reconnect', 'urgent', [{ tags: [['Bug', 'red']] }], 'Oct 12'],
      ['ENG-2037', 'Command menu: rank recent issues above projects', 'high', [{ tags: [['Feature', 'purple']] }], 'Oct 14'],
      ['ENG-1998', 'Migrate attachments to signed URLs', 'medium', [{ tags: [['Infra', 'blue']] }], 'Oct 18'],
    ],
    todo: [
      ['ENG-2050', 'Keyboard shortcut cheat sheet overlay', 'medium', [{ tags: [['Feature', 'purple']] }], 'Oct 21'],
      ['ENG-2046', 'Triage: duplicate detection for Intercom imports', 'high', [{ tags: [['Integrations', 'amber']] }], ''],
      ['ENG-2033', 'Sub-issue progress in project graph', 'low', [{ tags: [['Projects', 'gray']] }], ''],
      ['ENG-2029', 'Reduce cold start of desktop app below 600ms', 'high', [{ tags: [['Performance', 'green']] }], 'Oct 25'],
    ],
    backlog: [
      ['ENG-1975', 'Dark mode contrast for status icons', 'low', [{ tags: [['Design', 'purple']] }], ''],
      ['ENG-1962', 'Bulk-edit estimates from cycle view', 'none', [], ''],
    ],
  };
  const toItems = (rows, st) => rows.map(([id, title, prio, meta, due]) => ({ prio, id, st, title, meta: [...meta, ...(due ? [{ i: 'calendar', l: due, size: 13 }] : [])], av: 'Rosa Diaz', avSize: 20 }));

  const listBody = (selIdx) => ({
    t: 'row', c: [
      sidebar('my'),
      { t: 'col', flex: 1, c: [
        { t: 'topbar', title: 'My issues', i: 'target', tabs: ['Assigned', 'Created', 'Subscribed', 'Activity'], actions: [{ i: 'filter', k: 'ghost' }, { l: 'Display', i: 'sliders', sm: 1 }] },
        { t: 'filters', items: [{ l: 'Status', op: 'is not', v: 'Done, Canceled' }, { l: 'Team', op: 'is', v: 'Engineering' }], add: 'Filter', right: [{ l: 'Save view', k: 'ghost', sm: 1 }] },
        { t: 'list', flex: 1, groups: [
          { title: 'In Progress', st: 'progress', n: 3, items: toItems(issues.progress, 'progress').map((it, i) => ({ ...it, sel: selIdx === i })) },
          { title: 'Todo', st: 'todo', n: 4, items: toItems(issues.todo, 'todo') },
          { title: 'Backlog', st: 'backlog', n: 2, items: toItems(issues.backlog, 'backlog') },
        ] },
      ] },
    ],
  });

  INSPUX.products.push({
    id: 'linear',
    name: 'Linear',
    industry: 'project-management',
    platform: 'desktop',
    url: 'https://linear.app',
    color: '#5e6ad2',
    tagline: 'Issue tracking and product planning for software teams, built around speed and the keyboard.',
    summary: {
      overview: 'Linear treats an issue tracker like a fast desktop editor. Everything is a list or a board of issues, every action has a shortcut, and the command menu reaches all of it. The visual system is quiet and dark-first, so status icons and priority bars carry most of the signal.',
      structure: [
        'Left sidebar: personal views (Inbox, My issues), then workspace objects (Projects, Views), then teams, each with Issues, Cycles and Projects.',
        'The main area is always a list or board with a header holding view tabs, filters and Display options.',
        'Issues open as a full page with content on the left and a property panel on the right. Activity and comments run beneath the description.',
        'Cmd+K command menu and single-key shortcuts sit on top of every screen.',
      ],
      strengths: [
        'Very high information density without clutter. Status and priority are encoded as small glyphs, so rows stay one line.',
        'The create-issue modal keeps people in context. "Create more" lets them log several issues in a row without closing it.',
        'Shortcuts are shown in menus and tooltips, which teaches them gradually.',
        'Optimistic updates make every change feel instant, even on slow networks.',
      ],
      pains: [
        'Opinionated workflow (cycles, triage, fixed issue model) can feel rigid to teams coming from Jira.',
        'Low-contrast dark UI and tiny glyphs are hard for some users. Meaning depends on learning the icon set.',
        'Reporting and cross-team portfolio views are thinner than in enterprise tools.',
        'Non-engineering stakeholders find the keyboard-heavy model intimidating at first.',
      ],
    },
    screens: [
      {
        id: 'linear-my-issues', title: 'My issues', desc: 'Personal issue list grouped by status, with view tabs, applied filters and a Display menu for grouping and ordering.',
        patterns: ['keyboard-first', 'saved-views', 'status-workflow', 'master-detail'],
        spec: { chrome: 'mac', theme: 'dark', vars, title: 'Linear', body: listBody(0) },
      },
      {
        id: 'linear-command-menu', title: 'Command menu', desc: 'Cmd+K opens a command menu over the list. It runs actions on the focused issue and jumps to any object.',
        patterns: ['command-palette', 'keyboard-first', 'global-search'],
        spec: {
          chrome: 'mac', theme: 'dark', vars, title: 'Linear', body: listBody(0), dim: 0.6,
          overlays: [{
            t: 'palette', y: 110, w: 640, ctx: 'ENG-2041 — Sync engine drops offline edits…', q: 'create', enter: true,
            groups: [
              { title: 'Issues', items: [{ i: 'plus', l: 'Create new issue…', k: 'C', on: true }, { i: 'plus', l: 'Create sub-issue', k: '⇧ C' }, { i: 'copy', l: 'Create issue from template…' }] },
              { title: 'Projects', items: [{ i: 'box', l: 'Create new project…', k: '⇧ P' }] },
              { title: 'Navigation', items: [{ i: 'arrow', l: 'Go to Cycles', k: 'G C' }, { i: 'arrow', l: 'Go to Inbox', k: 'G I' }] },
            ],
            foot: [['↑↓', 'to navigate'], ['↵', 'to select'], ['esc', 'to close']],
          }],
        },
      },
      {
        id: 'linear-create-issue', title: 'Create issue modal', desc: 'A compact modal with title, description and property chips. "Create more" keeps the modal open for rapid entry.',
        patterns: ['keyboard-first', 'progressive-disclosure'],
        spec: {
          chrome: 'mac', theme: 'dark', vars, title: 'Linear', body: listBody(0), dim: 0.6,
          overlays: [
            {
              t: 'modal', y: 96, w: 720, title: 'New issue', crumbs: ['ENG', 'New issue'], headIcons: ['expand'],
              c: [
                { t: 'text', v: 'Sync status badge flickers when switching workspaces', size: 19, weight: 600 },
                { t: 'text', v: 'When switching between Acme and Acme Labs the sync badge shows **Offline** for ~400ms before settling. Repro on desktop 1.42 with throttled network.', muted: true, size: 14 },
                { t: 'cell', v: [{ btn: { l: 'Todo', i: 'circle', sm: 1 } }, { btn: { l: 'High', i: 'bar', sm: 1 } }, { btn: { l: 'Rosa Diaz', i: 'user', sm: 1 } }, { btn: { l: 'Bug', i: 'tag', sm: 1 } }, { btn: { l: 'Desktop 1.43', i: 'box', sm: 1 } }, { btn: { i: 'more', sm: 1 } }] },
              ],
              footLeft: [{ i: 'clip', l: '' }],
              foot: [{ l: 'Create more', k: 'ghost', i: 'circle' }, { l: 'Create issue', k: 'primary' }],
            },
            { t: 'menu', x: 470, y: 340, w: 230, search: 'Change priority…', items: [{ prio: 'none', l: 'No priority', k: '0' }, { prio: 'urgent', l: 'Urgent', k: '1' }, { prio: 'high', l: 'High', k: '2', on: true, check: true }, { prio: 'medium', l: 'Medium', k: '3' }, { prio: 'low', l: 'Low', k: '4' }] },
          ],
        },
      },
      {
        id: 'linear-issue-detail', title: 'Issue detail', desc: 'Full-page issue with description, sub-issues and activity on the left and an editable property panel on the right.',
        patterns: ['contextual-inspector', 'inline-editing', 'activity-timeline', 'status-workflow'],
        spec: {
          chrome: 'mac', theme: 'dark', vars, title: 'Linear',
          body: { t: 'row', c: [
            sidebar('my'),
            { t: 'col', flex: 1, c: [
              { t: 'topbar', crumbs: ['Engineering', 'ENG-2041'], star: true, actions: [{ i: 'link', k: 'ghost' }, { i: 'more', k: 'ghost' }, { l: '2 / 9', k: 'ghost', sm: 1 }, { i: 'up', k: 'ghost', sm: 1 }, { i: 'down', k: 'ghost', sm: 1 }] },
              { t: 'row', flex: 1, c: [
                { t: 'col', flex: 1, pad: '28px 56px', gap: 14, c: [
                  { t: 'text', v: 'Sync engine drops offline edits after reconnect', size: 24, weight: 600 },
                  { t: 'text', v: 'Edits made while offline are queued but the queue is cleared when the socket reconnects before the delta is acknowledged. Users lose up to 30s of work.', size: 15 },
                  { t: 'text', v: '**Steps to reproduce**', size: 15 },
                  { t: 'doc', comp: false, maxw: 900, st: 'margin-left:-48px;margin-top:-30px', blocks: [{ t: 'num', n: 1, v: 'Open any issue and go offline (DevTools → Offline).' }, { t: 'num', n: 2, v: 'Edit the description and two properties.' }, { t: 'num', n: 3, v: 'Reconnect within 5s. Description edit is lost.' }] },
                  { t: 'list', comp: 'list', bd: 'a', radius: 8, items: [
                    { st: 'done', id: 'ENG-2042', title: 'Persist outbound queue in IndexedDB', av: 'Kai Moreno', avSize: 18 },
                    { st: 'progress', id: 'ENG-2043', title: 'Hold queue until server ack', av: 'Rosa Diaz', avSize: 18 },
                    { st: 'todo', id: 'ENG-2044', title: 'Regression test for reconnect race', av: 'Lee Park', avSize: 18 },
                  ] },
                  { t: 'feed', title: 'Activity', items: [
                    { av: 'Rosa Diaz', text: '**Rosa Diaz** created the issue', when: '3d ago' },
                    { i: 'tag', text: '**Triage bot** added label **Bug** and moved to **Todo**', when: '3d ago' },
                    { comment: true, who: 'Kai Moreno', when: '2d ago', text: 'Confirmed on 1.42.1. Looks like `flushQueue()` runs before `onAck`. I can pair on this tomorrow.' },
                    { st: 'progress', i: 'cycle', text: '**Rosa Diaz** moved from Todo to **In Progress**', when: '1d ago' },
                  ], input: 'Leave a comment…' },
                ] },
                { t: 'props', w: 300, pad: '18px 20px', bd: 'l', bg: 'panel', rows: [
                  ['Status', { st: 'progress', l: 'In Progress' }], ['Priority', [{ prio: 'urgent' }, 'Urgent']], ['Assignee', { av: 'Rosa Diaz', size: 20 }],
                  ['Labels', { tags: [['Bug', 'red'], ['Sync', 'gray']] }], ['Cycle', { i: 'refresh', l: 'Cycle 48' }], ['Project', { i: 'box', l: 'Offline mode' }],
                  ['Estimate', '3 points'], ['Due date', { i: 'calendar', l: 'Oct 12' }], { sep: 1 }, { label: 'Linked' }, ['GitHub', { i: 'branch', l: 'rosa/eng-2041-sync' }], ['Review', { pill: 'PR #4821 open', tone: 'green', dot: 1 }],
                ] },
              ] },
            ] },
          ] },
          overlays: [{ t: 'tip', x: 1250, y: 44, text: 'Change status', k: 'S' }],
        },
      },
    ],
    flows: [
      {
        id: 'linear-create-issue-flow', name: 'Capture an issue without leaving the list', goal: 'Log a bug found while triaging, assign it, and keep working.',
        steps: [
          { screen: 'linear-my-issues', note: 'Working through My issues. The focused row has a highlight, and every action applies to it.' },
          { screen: 'linear-command-menu', note: 'Cmd+K opens the command menu. Typing "create" filters to creation actions, and each shows its direct shortcut (C) for next time.' },
          { screen: 'linear-create-issue', note: 'The modal opens with the team pre-selected. Properties are set with chips or shortcuts (P for priority opens this menu). "Create more" keeps the modal open for the next issue.' },
          { screen: 'linear-issue-detail', note: 'The new issue page shows all properties on the right and an activity log that records every change.' },
        ],
        friction: 'The flow is fast for people who know shortcuts. Newcomers have to find the small pen icon in the sidebar header or learn C, because there is no prominent "New issue" button in the list.',
      },
    ],
  });
})();
