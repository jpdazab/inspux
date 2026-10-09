(function () {
  const vars = { accent: '#006bff', bg: '#ffffff', side: '#ffffff', sideFg: '#0a2540', sideSel: '#f0f5ff', sideOn: '#006bff', fg: '#0a2540', muted: '#476788', faint: '#a6bbd1', border: '#e2e8f0', hover: '#f2f6fb', panel: '#f8fafc', sel: '#f0f5ff', canvas: '#f8fafc', font: "'Inter', 'Gilroy', -apple-system, sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'calendly.com/' + url });

  const sidebar = { t: 'sidebar', w: 240, head: { logo: 'C', name: 'Calendly', color: '#006bff', caret: false, icons: ['sidebar'] }, cta: { l: 'Create', i: 'plus', k: 'secondary' },
    sections: [
      { items: [{ i: 'link', l: 'Scheduling', on: true }, { i: 'calendar', l: 'Meetings' }, { i: 'clock', l: 'Availability' }, { i: 'users', l: 'Contacts' }, { i: 'zap', l: 'Workflows' }, { i: 'grid', l: 'Integrations & apps' }, { i: 'route', l: 'Routing' }] },
    ], foot: [{ i: 'chart', l: 'Analytics' }, { i: 'settings', l: 'Admin center' }, { i: 'help', l: 'Help' }] };

  const evtCard = (color, title, sub, extra = {}) => ({ stripe: color, title, sub, meta: [{ muted: 'One-on-One' }], actions: [{ l: 'Copy link', i: 'link', sm: 1 }, { l: 'Share', sm: 1 }], ...extra });

  const home = { t: 'row', c: [sidebar, { t: 'col', flex: 1, c: [
    { t: 'topbar', h: 60, title: 'Scheduling', actions: [{ l: 'Invite user', i: 'users', k: 'ghost', sm: 1 }], me: 'Rosa Diaz' },
    { t: 'tabs', items: ['Event types', 'Single-use links', 'Meeting polls'], on: 0 },
    { t: 'col', flex: 1, pad: '20px 32px', gap: 18, bg: 'canvas', c: [
      { t: 'row', gap: 10, align: 'center', c: [{ t: 'search', ph: 'Search event types', st: 'width:300px' }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'New event type', i: 'plus', k: 'primary' }] }] },
      { t: 'row', gap: 10, align: 'center', c: [{ t: 'cell', v: { av: 'Rosa Diaz', size: 32, name: 'Rosa Diaz', sub: 'calendly.com/rosa-diaz' } }, { t: 'spacer' }, { t: 'cell', v: { btn: { l: 'View landing page', i: 'ext', k: 'ghost', sm: 1 } } }] },
      { t: 'cards', cols: 3, items: [
        evtCard('#8247f5', '30 Minute Meeting', '30 mins · Zoom', { on: true }),
        evtCard('#ff4f00', 'Product demo', '45 mins · Google Meet', { meta: [{ muted: 'One-on-One' }, { pill: 'Routing', tone: 'amber' }] }),
        evtCard('#00a2ff', 'Customer onboarding', '60 mins · Zoom', { meta: [{ muted: 'Round Robin' }, { avs: ['Lee Park', 'Kai Moreno'], size: 18 }] }),
        evtCard('#0ae8f0', 'Quick intro call', '15 mins · Phone call'),
        evtCard('#e55cff', 'Office hours', '30 mins · Group · 8 seats', { meta: [{ muted: 'Group' }] }),
        { dashed: true, i: 'plus', title: 'New event type', sub: 'One-on-one, group, round robin or collective' },
      ] },
    ] },
  ] }] };

  const editor = { t: 'row', c: [
    { t: 'col', w: 460, bd: 'r', c: [
      { t: 'row', pad: '14px 20px', gap: 8, align: 'center', bd: 'b', c: [{ t: 'cell', v: { btn: { i: 'back', k: 'ghost', sm: 1 } } }, { t: 'text', v: '**Event type**', size: 15 }, { t: 'spacer' }, { t: 'cell', v: { btn: { i: 'more', k: 'ghost', sm: 1 } } }] },
      { t: 'col', pad: '18px 20px', gap: 14, flex: 1, c: [
        { t: 'row', gap: 10, align: 'center', c: [{ t: 'cell', v: { html: '<span class="m-dot" style="width:14px;height:14px;background:#8247f5"></span>' } }, { t: 'col', c: [{ t: 'text', v: '**30 Minute Meeting**', size: 18 }, { t: 'text', v: 'One-on-One', muted: true, size: 12.5 }] }] },
        { t: 'props', comp: 'property-panel', rows: [
          ['Duration', { i: 'clock', l: '30 min' }], ['Location', { i: 'video', l: 'Zoom · auto-generated link' }], ['Availability', { i: 'calendar', l: 'Weekdays, 9:00 am – 5:00 pm' }], ['Host', { av: 'Rosa Diaz', size: 20 }],
        ] },
        { t: 'divider' },
        { t: 'form', fields: [
          { l: 'Description', type: 'textarea', h: 70, v: 'A quick call to see whether Acme fits your team. Bring your questions!' },
          { row: [{ l: 'Buffer before', type: 'select', v: '10 min' }, { l: 'Buffer after', type: 'select', v: '0 min' }] },
          { l: 'Max meetings per day', v: '6', hint: 'Invitees will see fewer times on busy days.' },
          { type: 'toggle', l: 'Collect invitee time zone', v: true },
        ] },
        { t: 'tree', comp: false, items: [{ caret: false, l: 'Booking form' }, { caret: false, l: 'Notifications and workflows' }, { caret: false, l: 'Payments' }, { caret: false, l: 'Advanced settings' }] },
      ] },
      { t: 'row', pad: '12px 20px', bd: 't', gap: 8, c: [{ t: 'spacer' }, { t: 'btns', items: [{ l: 'Cancel', k: 'ghost' }, { l: 'Save changes', k: 'primary' }] }] },
    ] },
    { t: 'preview', flex: 1, label: 'This is a preview. To book an event, share the link with your invitees.', st: 'border-radius:0;background:var(--m-canvas);display:flex;align-items:center;justify-content:center', c: [
      { t: 'row', st: 'width:760px;background:#fff;border-radius:10px;box-shadow:0 2px 12px rgba(10,37,64,.12);transform:scale(.92)', c: [
        { t: 'col', w: 260, pad: 22, gap: 8, bd: 'r', c: [{ t: 'cell', v: { av: 'Rosa Diaz', size: 40, name: false } }, { t: 'text', v: 'Rosa Diaz', muted: true }, { t: 'text', v: '**30 Minute Meeting**', size: 20 }, { t: 'cell', v: { i: 'clock', l: '30 min' } }, { t: 'cell', v: { i: 'video', l: 'Zoom' } }] },
        { t: 'col', flex: 1, pad: 22, gap: 10, c: [{ t: 'text', v: '**Select a Date & Time**', size: 15 }, { t: 'calendar', comp: false, month: 'October 2026', start: 4, avail: [12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30], today: 9 }] },
      ] },
    ] },
  ] };

  const bookingShell = (right) => ({ t: 'center', bg: 'canvas', c: [{ t: 'row', st: 'width:1060px;height:640px;background:#fff;border-radius:10px;box-shadow:0 2px 16px rgba(10,37,64,.1);overflow:hidden;position:relative', c: [
    { t: 'col', w: 320, pad: '30px 28px', gap: 12, bd: 'r', c: [
      { t: 'cell', v: { html: '<span style="display:inline-grid;place-items:center;width:100%;height:40px;border-bottom:1px solid var(--m-border);margin:-6px 0 8px;font-weight:700;letter-spacing:.02em;color:#0a2540">ACME</span>' } },
      { t: 'text', v: 'Rosa Diaz', muted: true }, { t: 'text', v: '**30 Minute Meeting**', size: 24 },
      { t: 'cell', v: { i: 'clock', l: '30 min' } }, { t: 'cell', v: { i: 'video', l: 'Web conferencing details provided upon confirmation.' } },
      ...(right.summary ? [{ t: 'cell', v: { i: 'calendar', l: '**10:30am – 11:00am, Thursday, October 15, 2026**' } }, { t: 'cell', v: { i: 'globe', l: 'Central European Time' } }] : [{ t: 'text', v: 'A quick call to see whether Acme fits your team. Bring your questions!', muted: true }]),
    ] },
    ...right.c,
  ] }] });

  const booking = bookingShell({ c: [
    { t: 'col', flex: 1, pad: '30px 28px', gap: 12, c: [{ t: 'text', v: '**Select a Date & Time**', size: 20 }, { t: 'calendar', month: 'October 2026', start: 4, avail: [12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30], sel: 15, today: 9, tz: 'Central European Time (16:42)' }] },
    { t: 'slots', w: 230, pad: '74px 24px 20px 0', title: 'Thursday, October 15', sel: 2, times: ['9:00am', '9:30am', '10:30am', '11:00am', '1:30pm', '2:00pm', '3:30pm', '4:00pm'] },
  ] });

  const bookingForm = bookingShell({ summary: true, c: [
    { t: 'col', flex: 1, pad: '30px 36px', gap: 14, c: [
      { t: 'text', v: '**Enter Details**', size: 20 },
      { t: 'form', st: 'max-width:460px', fields: [
        { l: 'Name', req: true, v: 'Maya Chen' },
        { l: 'Email', req: true, v: 'maya@brightloop.io', focus: true },
        { node: { t: 'btns', items: [{ l: 'Add Guests', k: 'secondary', sm: 1, style: 'border-radius:20px;color:#006bff;border-color:#006bff' }] } },
        { l: 'Please share anything that will help prepare for our meeting.', type: 'textarea', h: 80, v: 'We are a 40-person team evaluating tools for Q1.' },
        { l: 'How did you hear about us?', type: 'select', v: 'Colleague recommendation' },
      ] },
      { t: 'text', v: 'By proceeding, you confirm that you have read and agree to Calendly\'s [[Terms of Use]] and [[Privacy Notice]].', muted: true, size: 12 },
      { t: 'btns', items: [{ l: 'Schedule Event', k: 'primary', style: 'border-radius:20px;height:40px;padding:0 22px' }] },
    ] },
  ] });

  INSPUX.products.push({
    id: 'calendly', name: 'Calendly', industry: 'scheduling', platform: 'web', url: 'https://calendly.com', color: '#006bff',
    tagline: 'Scheduling automation: share a link, invitees pick a time, the meeting lands on both calendars.',
    summary: {
      overview: 'Calendly serves two very different users. Hosts configure event types once, in a settings panel with a live preview of what invitees will see. Invitees, who often use Calendly once and never sign up, get a two-step page: pick a time, enter details. The invitee side is deliberately minimal because it is effectively a public form.',
      structure: [
        'Host app: a sidebar for Scheduling, Meetings, Availability, Contacts and Workflows; event types shown as color-coded cards.',
        'The event type editor puts settings on the left and a live preview of the booking page on the right.',
        'Invitee page: host details on the left, a month calendar with available days in the middle, and time slots on the right.',
        'Picking a slot turns it into a two-part "time / Next" button, then a short details form confirms the booking.',
      ],
      strengths: [
        'The invitee flow takes two screens and needs no account, which keeps booking friction close to zero.',
        'Available days are highlighted on the calendar, so invitees never click into an empty day.',
        'The split slot button confirms the choice without a separate dialog.',
        'Live preview in the editor shows hosts exactly what invitees will see.',
      ],
      pains: [
        'Time zones still confuse invitees. The selector is easy to miss below the calendar.',
        'Hosts with many event types and team links struggle to keep them organized.',
        'Routing, workflows and team scheduling add settings that are hard to discover.',
        'Asking colleagues "pick a slot on my Calendly" can feel impersonal, a social cost the product cannot design away.',
      ],
    },
    screens: [
      { id: 'calendly-event-types', title: 'Event types', desc: 'Event types as color-coded cards with duration, location and kind, plus quick Copy link and Share actions and a dashed card for a new one.', patterns: ['templates', 'empty-state'],
        spec: { ...browser('Scheduling – Calendly', 'event_types/user/me'), body: home } },
      { id: 'calendly-editor', title: 'Event type editor', desc: 'Settings on the left as a property list and form, with a live preview of the booking page on the right.', patterns: ['live-preview', 'progressive-disclosure', 'inline-editing'],
        spec: { ...browser('Edit event type – Calendly', 'event_types/8812/edit'), body: editor } },
      { id: 'calendly-booking', title: 'Booking page: pick a time', desc: 'Invitee booking page with host details, a month calendar that highlights available days, and a time slot column where the chosen slot splits into a Next button.', patterns: ['progressive-disclosure', 'wizard'],
        spec: { ...browser('30 Minute Meeting – Rosa Diaz', 'rosa-diaz/30min'), body: booking } },
      { id: 'calendly-booking-form', title: 'Booking page: details', desc: 'The second step restates the chosen time and asks for name, email and optional questions before scheduling.', patterns: ['wizard', 'progressive-disclosure'],
        spec: { ...browser('30 Minute Meeting – Rosa Diaz', 'rosa-diaz/30min/2026-10-15T10:30'), body: bookingForm } },
    ],
    flows: [
      {
        id: 'calendly-host-flow', name: 'Set up a bookable meeting', goal: 'Create a 30-minute intro call with buffers and share the link.',
        steps: [
          { screen: 'calendly-event-types', note: 'Event types are cards with a color stripe that carries through to calendar invites. Copy link is on every card.' },
          { screen: 'calendly-editor', note: 'The editor shows the key settings as a summary list first; detailed options (buffers, limits) sit lower. The preview updates as settings change.' },
        ],
        friction: 'Availability is edited on a separate page, so hosts often save an event type before noticing it inherits the wrong schedule.',
      },
      {
        id: 'calendly-invitee-flow', name: 'Book a time as an invitee', goal: 'Pick a slot on someone else\'s calendar and confirm, without creating an account.',
        steps: [
          { screen: 'calendly-booking', note: 'Available days are tinted. Choosing a day lists times; choosing a time splits it into the time and a Next button.' },
          { screen: 'calendly-booking-form', note: 'The left column now shows the chosen date, time and time zone. Only name and email are required.' },
        ],
        friction: 'The time zone control sits below the calendar and is easy to miss, so invitees sometimes book in the wrong zone.',
      },
    ],
  });
})();
