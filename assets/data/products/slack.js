(function () {
  const vars = { accent: '#1264a3', bg: '#ffffff', side: '#3f0e40', rail: '#2c072d', sideFg: '#e9dcea', sideSel: '#1164a3', sideOn: '#ffffff', fg: '#1d1c1d', muted: '#616061', faint: '#9b9a9b', border: '#e2e2e2', hover: '#f8f8f8', panel: '#f8f8f8', send: '#007a5a', msgHl: '#fef9ec', linkC: '#1264a3', font: "'Inter', 'Lato', -apple-system, sans-serif" };

  const top = { t: 'topbar', h: 40, bg: '#2c072d', st: 'color:#fff;border-bottom:0', center: true, comp: 'top-bar', back: false, actions: [{ i: 'help', k: 'ghost', style: 'color:#e9dcea' }] };
  const topSearch = (q) => ({ ...top, c: undefined, search: q || 'Search Acme Inc', st: 'color:#fff;border-bottom:0;padding-left:120px' });

  const rail = { t: 'rail', w: 70, items: [{ logo: 'A', color: '#e8912d' }, { i: 'home', l: 'Home', on: true }, { i: 'chat', l: 'DMs', badge: '2' }, { i: 'bell', l: 'Activity' }, { i: 'bookmark', l: 'Later' }, { i: 'more', l: 'More' }], bottom: [{ i: 'plus' }, { av: 'Rosa Diaz' }] };

  const sidebar = (on) => ({ t: 'sidebar', w: 260, st: 'border-right:0', head: { name: 'Acme Inc', icons: ['sliders', 'pen'] },
    sections: [
      { items: [{ i: 'chat', l: 'Threads', bold: true }, { i: 'headphones', l: 'Huddles' }, { i: 'send', l: 'Drafts & sent' }] },
      { title: 'Channels', items: [
        { i: 'hash', l: 'announcements' }, { i: 'hash', l: 'design-system', on: on === 'design-system', bold: on !== 'design-system' }, { i: 'hash', l: 'eng-frontend' }, { i: 'hash', l: 'incidents', bold: true, badge: '1' }, { i: 'lock', l: 'leadership' }, { i: 'hash', l: 'random' },
      ] },
      { title: 'Direct messages', items: [{ av: 'Lee Park', l: 'Lee Park', bold: true, badge: '2' }, { av: 'Kai Moreno', l: 'Kai Moreno' }, { av: 'Ana Silva', l: 'Ana Silva, Lee Park' }] },
      { title: 'Apps', items: [{ logo: 'G', color: '#24292f', l: 'GitHub' }, { logo: 'J', color: '#0052cc', l: 'Jira Cloud' }] },
    ] });

  const msgs = [
    { day: 'Yesterday' },
    { who: 'Ana Silva', time: '4:12 PM', text: 'Tokens v4 is merged. Spacing scale is now 4px based and the old `space-xl` alias is gone.', reacts: [['check', '6', true], ['star', '2']] },
    { who: 'Kai Moreno', time: '4:20 PM', text: 'Nice. Do we have a codemod for the alias removal? Mobile still uses it in ~40 places.', thread: { n: 4, avs: ['Ana Silva', 'Lee Park', 'Rosa Diaz'], last: 'Last reply today at 9:02 AM' } },
    { day: 'Today' },
    { who: 'Lee Park', time: '9:41 AM', text: 'Heads up @Rosa Diaz: the Button focus ring fails contrast on the dark theme. Filed as DS-312.', attach: { i: 'file', l: 'DS-312 — Focus ring contrast on dark', sub: 'Jira · In review' } },
    { who: 'Lee Park', time: '9:42 AM', cont: true, text: 'Screens in the Figma file under **Accessibility / Focus**.' },
    { who: 'Rosa Diaz', time: '9:50 AM', text: "On it. I'll pair the fix with the token rename so we only touch Button once.", reacts: [['smile', '3']], hover: true },
  ];

  const channelHeader = { t: 'col', comp: false, c: [
    { t: 'topbar', h: 50, title: '# design-system', avs: ['Ana Silva', 'Lee Park', 'Kai Moreno'], actions: [{ i: 'headphones', l: 'Huddle', sm: 1, caret: true }, { i: 'more', k: 'ghost', sm: 1 }] },
    { t: 'tabs', items: [{ i: 'chat', l: 'Messages' }, { i: 'doc', l: 'Canvas' }, { i: 'clip', l: 'Files' }, { i: 'bookmark', l: 'Pins' }], on: 0, add: true },
  ] };

  const channel = (hl) => ({ t: 'col', flex: 1, c: [
    channelHeader,
    { t: 'chat', flex: 1, msgs: msgs.map((m) => (hl && m.who === 'Kai Moreno' ? { ...m, hl: true } : m)) },
    { t: 'composer', ph: 'Message #design-system', hint: '', minimal: false },
  ] });

  const thread = { t: 'col', w: 420, bd: 'l', c: [
    { t: 'topbar', h: 50, title: 'Thread', actions: [{ l: '# design-system', k: 'ghost', sm: 1 }, { i: 'x', k: 'ghost', sm: 1 }] },
    { t: 'chat', flex: 1, comp: 'message-list', st: 'justify-content:flex-start', msgs: [
      { who: 'Kai Moreno', time: 'Yesterday at 4:20 PM', text: 'Nice. Do we have a codemod for the alias removal? Mobile still uses it in ~40 places.' },
      { day: '4 replies' },
      { who: 'Ana Silva', time: '4:31 PM', text: 'Not yet. I can write one with jscodeshift, should take an hour.' },
      { who: 'Lee Park', time: '4:33 PM', text: 'Please include `space-lg` too, it is deprecated next release.' },
      { who: 'Ana Silva', time: '8:55 AM', text: 'Codemod is up: [[ds-codemods#18]]. Run `npx ds-codemod spacing`.', reacts: [['check', '2']] },
      { who: 'Rosa Diaz', time: '9:02 AM', text: 'Ran it on mobile, 41 files changed, all tests green.' },
    ] },
    { t: 'composer', ph: 'Reply…', focus: true, v: 'Thanks Ana, merging the mobile PR now', send: { l: '', i: 'send', k: 'primary', style: 'background:#007a5a' } },
    { t: 'form', comp: false, st: 'padding:0 20px 14px;margin-top:-8px', fields: [{ type: 'check', l: 'Also send to #design-system', v: false }] },
  ] };

  const searchBody = { t: 'col', c: [
    topSearch('codemod spacing'),
    { t: 'row', flex: 1, c: [rail, sidebar(''), { t: 'col', flex: 1, c: [
      { t: 'topbar', h: 50, title: 'Results for “codemod spacing”', actions: [{ l: 'Save search', k: 'ghost', sm: 1 }] },
      { t: 'tabs', items: [{ l: 'Messages', n: 6 }, { l: 'Files', n: 2 }, { l: 'Channels', n: 1 }, { l: 'People' }], on: 0 },
      { t: 'filters', items: [{ l: 'In', v: '#design-system' }, { l: 'From', caret: true }, { l: 'With', caret: true }, { l: 'Date', caret: true }, { l: 'Only my channels', caret: false }], right: [{ l: 'Most relevant', k: 'ghost', sm: 1, caret: true }] },
      { t: 'list', flex: 1, cards: true, items: [
        { av: 'Ana Silva', title: 'Ana Silva', time: 'Today 8:55 AM', title2: '#design-system · Codemod is up: ds-codemods#18. Run `npx ds-codemod **spacing**`.', sel: true },
        { av: 'Kai Moreno', title: 'Kai Moreno', time: 'Yesterday', title2: '#design-system · Do we have a **codemod** for the alias removal? Mobile still uses it in ~40 places.' },
        { av: 'Lee Park', title: 'Lee Park', time: 'Sep 30', title2: '#eng-frontend · Reminder: the **spacing** tokens change lands next sprint, plan a **codemod** window.' },
        { av: 'Rosa Diaz', title: 'Rosa Diaz', time: 'Sep 28', title2: 'Direct message · Can you review the **spacing** RFC before Thursday?' },
        { av: 'Ana Silva', title: 'Ana Silva', time: 'Sep 12', title2: '#design-system · RFC: 4px **spacing** scale (draft) — feedback welcome' },
      ] },
    ] }] },
  ] };

  const shell = (main, extra) => ({ t: 'col', c: [topSearch(), { t: 'row', flex: 1, c: [rail, sidebar('design-system'), main, ...(extra ? [extra] : [])] }] });

  INSPUX.products.push({
    id: 'slack', name: 'Slack', industry: 'communication', platform: 'desktop', url: 'https://slack.com', color: '#4a154b',
    tagline: 'Channel-based messaging for teams, with threads, huddles, search and thousands of app integrations.',
    summary: {
      overview: 'Slack organizes work talk into channels, then lets any message branch into a thread. The desktop app is a three-zone layout: workspace rail, channel list, conversation, with threads and profiles opening as a fourth pane on the right. Search and the quick switcher are the main ways people find their way back to information.',
      structure: [
        'A narrow rail switches between Home, DMs, Activity and Later. The sidebar lists channels, DMs and apps in collapsible sections.',
        'The conversation pane has a channel header with tabs (Messages, Canvas, Files), the message stream and the composer.',
        'Threads, profiles and search filters open in a right pane, so the channel stays visible.',
        'A global search bar sits at the very top. Cmd+K opens a quick switcher for channels and people.',
      ],
      strengths: [
        'Threads keep side discussions out of the main stream while staying one click away.',
        'Unread state is visible everywhere: bold channel names, badges, the "new messages" line.',
        'The composer handles formatting, mentions, files and slash commands in one place.',
        'Search filters (in, from, date) make old answers findable.',
      ],
      pains: [
        'Notification overload. Channels, threads, mentions and DMs compete for attention.',
        'Threads hide replies. People miss important decisions unless they open each one.',
        'Information decays: decisions made in chat are hard to find weeks later.',
        'Large workspaces end up with hundreds of channels and unclear naming.',
      ],
    },
    screens: [
      { id: 'slack-channel', title: 'Channel', desc: 'A channel with day dividers, reactions, a file attachment and a thread summary under a message. Hovering a message reveals quick actions.', patterns: ['three-pane', 'threaded-conversation'],
        spec: { chrome: 'mac', vars, title: 'Slack', nav: false, body: shell(channel(false)) } },
      { id: 'slack-thread', title: 'Thread pane', desc: 'A thread opens in a right pane next to the channel. The reply composer offers "Also send to channel".', patterns: ['threaded-conversation', 'three-pane', 'master-detail'],
        spec: { chrome: 'mac', vars, title: 'Slack', nav: false, body: shell(channel(true), thread) } },
      { id: 'slack-switcher', title: 'Quick switcher', desc: 'Cmd+K "Jump to" lists recent channels and people. Unread conversations are marked, and typing filters instantly.', patterns: ['command-palette', 'keyboard-first'],
        spec: { chrome: 'mac', vars, title: 'Slack', nav: false, body: shell(channel(false)), dim: 0.5,
          overlays: [{ t: 'palette', y: 120, w: 600, ph: 'Where would you like to go?', q: 'des', groups: [{ title: 'Jump to', items: [
            { i: 'hash', l: '**des**ign-system', sub: '412 members', on: true, k: '↵' }, { i: 'hash', l: 'design-crit', sub: 'Unread' }, { i: 'lock', l: '**des**ign-leads' }, { av: 'Ana Silva', l: 'Ana Silva', sub: '**Des**ign systems lead' }, { i: 'doc', l: 'Canvas: **Des**ign review checklist' },
          ] }], foot: [['↑↓', 'navigate'], ['↵', 'open'], ['⇧ ↵', 'open in split view']] }] } },
      { id: 'slack-search', title: 'Search results', desc: 'Search results with type tabs, filter chips (in, from, date) and highlighted matches in context.', patterns: ['global-search', 'faceted-filtering'],
        spec: { chrome: 'mac', vars, title: 'Slack', nav: false, body: searchBody } },
    ],
    flows: [{
      id: 'slack-find-answer-flow', name: 'Find an old answer and follow up', goal: 'Locate where the team discussed the spacing codemod and reply in that thread.',
      steps: [
        { screen: 'slack-search', note: 'The top search bar returns messages with matches highlighted. "In #design-system" narrows results without retyping.' },
        { screen: 'slack-channel', note: 'Opening a result jumps to the message in its channel and briefly highlights it. The thread summary shows 4 replies.' },
        { screen: 'slack-thread', note: 'The thread opens beside the channel. The reply goes to the thread only, unless "Also send to #design-system" is checked.' },
      ],
      friction: 'Search results show one message out of context, and people often need two or three clicks (result → channel → thread) to see the full discussion.',
    }],
  });
})();
