(function () {
  const vars = { accent: '#1f2937', accentFg: '#ffffff', bg: '#ffffff', side: '#f6f6f4', rail: '#111111', sideFg: '#3b3b38', sideSel: '#ffffff', fg: '#16161a', muted: '#6b6b6b', faint: '#a3a3a3', border: '#e6e6e3', hover: '#f1f1ef', panel: '#f8f8f6', sel: '#eef2ff', bubbleMine: '#e8eefe', bubbleMineFg: '#16161a', font: "'Inter', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'app.intercom.com/a/inbox/acme/' + url });

  const rail = { t: 'rail', w: 56, st: 'color:#d6d6d6', items: [{ logo: 'I', color: '#0057ff' }, { i: 'inbox', on: true, badge: '12' }, { i: 'sparkle' }, { i: 'book' }, { i: 'megaphone' }, { i: 'users' }, { i: 'chart' }], bottom: [{ i: 'settings' }, { av: 'Rosa Diaz' }] };

  const inboxNav = { t: 'sidebar', w: 220, head: { name: 'Inbox', caret: false, icons: ['search', 'pen'] },
    sections: [
      { items: [{ i: 'inbox', l: 'Your inbox', n: 12, on: true }, { i: 'at', l: 'Mentions', n: 2 }, { i: 'pen', l: 'Created by you' }, { i: 'layers', l: 'All', n: 148 }, { i: 'user', l: 'Unassigned', n: 9 }] },
      { title: 'Team inboxes', add: true, items: [{ dot: '#0057ff', l: 'Support', n: 34 }, { dot: '#f59e0b', l: 'Billing', n: 11 }, { dot: '#10b981', l: 'VIP accounts', n: 3 }] },
      { title: 'Views', items: [{ i: 'clock', l: 'Waiting > 1h' }, { i: 'flag', l: 'Refund requests' }] },
    ], foot: [{ i: 'sparkle', l: 'Fin AI Agent' }] };

  const convList = (sel = 0, closed = false) => ({ t: 'col', w: 310, bd: 'r', c: [
    { t: 'row', pad: '12px 14px', align: 'center', gap: 8, bd: 'b', c: [{ t: 'text', v: '**12 Open**', size: 14 }, { t: 'cell', v: { i: 'down' } }, { t: 'spacer' }, { t: 'cell', v: { btn: { l: 'Newest', k: 'ghost', sm: 1, caret: true } } }] },
    { t: 'list', cards: true, items: [
      ...(closed ? [] : [{ av: 'Maya Chen', title: 'Maya Chen', time: '2m', title2: 'I was charged twice for the Pro plan this month, can I get one refunded?', sel: sel === 0, unread: false }]),
      { av: 'Jonas Weber', title: 'Jonas Weber', time: '9m', title2: 'How do I export conversations to CSV?', unread: true, sel: closed },
      { av: 'Priya Nair', title: 'Priya Nair · Initech', time: '21m', title2: 'SSO login loops back to the sign-in page' },
      { av: 'Leo Martins', title: 'Leo Martins', time: '34m', title2: 'Thanks! That fixed it.' },
      { av: 'Grace Kim', title: 'Grace Kim · VIP', time: '1h', title2: 'Can we move our renewal date to January?', unread: true },
      { av: 'Omar Haddad', title: 'Omar Haddad', time: '2h', title2: 'Webhook retries are not arriving' },
      ...(closed ? [{ av: 'Nina Rossi', title: 'Nina Rossi', time: '3h', title2: 'Is there a discount for nonprofits?' }] : []),
    ] },
  ] });

  const conversation = (composer, extraMsgs = []) => ({ t: 'col', flex: 1, c: [
    { t: 'topbar', h: 56, title: 'Maya Chen', actions: [{ i: 'star', k: 'ghost' }, { i: 'more', k: 'ghost' }, { i: 'clock', l: 'Snooze', sm: 1 }, { i: 'check', l: 'Close', k: 'primary', sm: 1 }] },
    { t: 'chat', flex: 1, msgs: [
      { day: 'Today' },
      { who: 'Maya Chen', time: '10:02 AM', bubble: true, text: 'Hi! I was charged twice for the Pro plan this month, can I get one refunded? Invoice numbers are INV-4471 and INV-4472.' },
      { who: 'Fin', time: '10:02 AM', bubble: true, color: '#0057ff', tag: 'AI Agent', text: 'Sorry about that. I can see two charges of $49 on Oct 1. I\'ve passed this to the billing team, who can issue refunds.' },
      { who: 'Note · Rosa Diaz', time: '10:05 AM', bubble: true, color: '#f59e0b', text: 'Confirmed duplicate in Stripe. Card retried after a 3DS timeout. Refund INV-4472.', hl: true },
      ...extraMsgs,
    ] },
    composer,
  ] });

  const details = { t: 'col', w: 320, bd: 'l', pad: '14px 16px', gap: 16, c: [
    { t: 'tabs', st: 'padding:0;margin:-6px -16px 0;padding-left:16px', items: ['Details', 'Copilot'], on: 0 },
    { t: 'props', rows: [['Assignee', { av: 'Rosa Diaz', size: 20 }], ['Team', { l: 'Billing', i: 'users' }], ['Ticket type', { pill: 'Refund request', tone: 'amber' }], ['Priority', { pill: 'Normal', tone: 'gray' }]] },
    { t: 'props', title: 'Customer', rows: [['Email', 'maya@brightloop.io'], ['Company', 'Brightloop'], ['Plan', { pill: 'Pro · monthly', tone: 'blue' }], ['MRR', '$49'], ['Location', 'Toronto, CA'], ['Signed up', 'Mar 2025']] },
    { t: 'props', title: 'Recent conversations', rows: [['Aug 12', 'How do I add a teammate?'], ['May 3', 'Invoice address change']] },
  ] };

  const copilot = { t: 'col', w: 340, bd: 'l', pad: '14px 16px', gap: 14, bg: 'panel', c: [
    { t: 'tabs', st: 'padding:0;margin:-6px -16px 0;padding-left:16px', items: ['Details', 'Copilot'], on: 1 },
    { t: 'chat', comp: 'message-list', st: 'padding:0;justify-content:flex-start', msgs: [
      { who: 'Rosa Diaz', time: 'You', bubble: true, mine: true, text: 'What is our refund policy for duplicate charges?' },
      { who: 'Copilot', time: 'AI', bubble: true, color: '#0057ff', text: 'Duplicate charges are refunded in full, no approval needed. Refund the **later** invoice in Stripe, then reply with the refund ID and the 5–10 day timeline.' },
    ] },
    { t: 'col', gap: 6, c: [{ t: 'label', v: 'Sources' }, { t: 'cell', v: { i: 'book', l: '[[Refund policy (internal)]]' } }, { t: 'cell', v: { i: 'chat', l: '[[3 similar conversations]]' } }] },
    { t: 'btns', items: [{ l: 'Add to composer', i: 'plus', k: 'primary', sm: 1 }, { l: 'Copy', i: 'copy', sm: 1 }] },
    { t: 'spacer' },
    { t: 'search', ph: 'Ask a follow-up question…' },
  ] };

  const composer = (v, focus) => ({ t: 'composer', tabs: ['Reply', 'Note'], focus, v, ph: 'Use ⌘K for shortcuts', send: { l: 'Send', k: 'primary', sm: 1, caret: true }, hint: '⌘↵ to send' });

  const layout = (center, right, list) => ({ t: 'row', c: [rail, inboxNav, list || convList(0), center, right] });

  INSPUX.products.push({
    id: 'intercom', name: 'Intercom', industry: 'support', platform: 'web', url: 'https://www.intercom.com', color: '#0057ff',
    tagline: 'A customer service platform with a shared inbox, AI agent, help center and in-app messaging.',
    summary: {
      overview: 'Intercom\'s inbox is built for speed through a queue. Conversations, customer context and AI help sit side by side, so an agent rarely leaves the screen. An AI agent answers first; humans pick up where it hands off, with Copilot drafting answers from internal docs and past conversations.',
      structure: [
        'An icon rail switches between Inbox, AI agent, Knowledge, Outbound, Contacts and Reports.',
        'The inbox has four columns: inbox views, the conversation list, the conversation, and a details or Copilot panel.',
        'The composer switches between Reply and Note, and Cmd+K opens macros and shortcuts in place.',
        'Closing a conversation moves the agent to the next one automatically.',
      ],
      strengths: [
        'Customer context (plan, MRR, history) is visible while replying, which cuts tab switching.',
        'Internal notes are visually distinct from replies, so private context never gets sent by mistake.',
        'Copilot answers cite their sources, so agents can check before using them.',
        'Keyboard shortcuts and macros make high-volume queues fast.',
      ],
      pains: [
        'Four columns get cramped on laptop screens; agents collapse panels constantly.',
        'Inbox views, team inboxes and assignment rules overlap, so routing is hard to reason about.',
        'AI handoffs can leave customers repeating themselves if the agent does not read the AI transcript.',
        'Reporting is split across several places and hard to customize.',
      ],
    },
    screens: [
      { id: 'intercom-inbox', title: 'Inbox conversation', desc: 'Four-column inbox: views, conversation list, the conversation with AI and internal-note messages, and customer details.', patterns: ['three-pane', 'master-detail', 'status-workflow'],
        spec: { ...browser('Inbox | Intercom', 'conversation/2041'), body: layout(conversation(composer('', false)), details) } },
      { id: 'intercom-copilot', title: 'Copilot answer', desc: 'The right panel switches to Copilot, which answers a policy question with sources and can insert the answer into the composer.', patterns: ['ai-assist', 'three-pane'],
        spec: { ...browser('Inbox | Intercom', 'conversation/2041'), body: layout(conversation(composer('', false)), copilot) } },
      { id: 'intercom-macro', title: 'Macro picker', desc: 'Typing in the composer opens a searchable macro menu. Each macro fills a reply and can also set tags and close the conversation.', patterns: ['command-palette', 'keyboard-first', 'templates'],
        spec: { ...browser('Inbox | Intercom', 'conversation/2041'), body: layout(conversation(composer('#refund', true)), details),
          overlays: [{ t: 'menu', x: 600, y: 470, w: 420, search: 'Search macros', searchV: 'refund', items: [
            { head: 'Macros' }, { i: 'zap', l: 'Refund — duplicate charge', sub: 'Replies, tags "refund", closes conversation', on: true, k: '↵' }, { i: 'zap', l: 'Refund — partial, prorated', sub: 'Replies and assigns to Billing' }, { i: 'zap', l: 'Refund — outside policy', sub: 'Replies, escalates to team lead' },
            { sep: 1 }, { head: 'Articles' }, { i: 'book', l: 'How refunds work', sub: 'Help Center · Billing' },
          ] }] } },
      { id: 'intercom-closed', title: 'Closed with undo', desc: 'After closing, the conversation leaves the list, the next one opens, and a toast offers Undo.', patterns: ['undo-toast', 'status-workflow'],
        spec: { ...browser('Inbox | Intercom', 'conversation/2044'), body: { t: 'row', c: [rail, inboxNav, convList(1, true), { t: 'col', flex: 1, c: [
          { t: 'topbar', h: 56, title: 'Jonas Weber', actions: [{ i: 'star', k: 'ghost' }, { i: 'more', k: 'ghost' }, { i: 'clock', l: 'Snooze', sm: 1 }, { i: 'check', l: 'Close', k: 'primary', sm: 1 }] },
          { t: 'chat', flex: 1, msgs: [{ day: 'Today' }, { who: 'Jonas Weber', time: '10:05 AM', bubble: true, text: 'How do I export conversations to CSV? I need last quarter for an audit.' }, { who: 'Fin', time: '10:05 AM', bubble: true, color: '#0057ff', tag: 'AI Agent', text: 'You can export from Reports → Conversations → Export. Would you like the steps for a date range?' }, { who: 'Jonas Weber', time: '10:09 AM', bubble: true, text: 'I don\'t see an Export button, I\'m on the Starter plan.' }] },
          composer('', true),
        ] }, details] },
          overlays: [{ t: 'toast', pos: 'bc', text: 'Conversation with Maya Chen closed', sub: 'Refund issued · tagged "refund"', action: 'Undo' }] } },
    ],
    flows: [{
      id: 'intercom-refund-flow', name: 'Resolve a refund request', goal: 'Verify a duplicate charge, reply with the right policy, and move on to the next customer.',
      steps: [
        { screen: 'intercom-inbox', note: 'The AI agent already gathered the invoice numbers and handed off. A teammate\'s internal note (amber) confirms the duplicate.' },
        { screen: 'intercom-copilot', note: 'The agent asks Copilot about the policy. The answer cites the internal doc and similar past conversations.' },
        { screen: 'intercom-macro', note: 'Typing a macro name in the composer opens the macro menu. The chosen macro fills the reply, tags it and closes the conversation on send.' },
        { screen: 'intercom-closed', note: 'The next conversation opens automatically. A toast confirms what happened and offers Undo.' },
      ],
      friction: 'The refund itself still happens in Stripe, in another tab. Agents copy the refund ID back by hand, and the macro cannot confirm that the refund was actually issued.',
    }],
  });
})();
