/*
 * Mockup renderer.
 * Screens are described as a tree of plain objects ({t: 'sidebar', ...}) and
 * rendered to HTML on a fixed 1440×900 desktop canvas. Each primitive tags
 * itself with a component id (data-comp) so the viewer can outline the
 * components a screen uses and the catalogue can index screens by component.
 */
(function () {
  const W = 1440, H = 900;

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Inline markup: **bold**, `code`, @mention, #channel, [[link]]
  const rich = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`(.+?)`/g, '<code class="m-code-inline">$1</code>')
    .replace(/\[\[(.+?)\]\]/g, '<span class="m-link">$1</span>')
    .replace(/(^|\s)@([A-Z][\w.]*(?: [A-Z][\w.]*)?)/g, '$1<span class="m-mention">@$2</span>')
    .replace(/(^|\s)#([a-z][\w-]+)/g, '$1<span class="m-mention">#$2</span>');

  /* ---------- Icons (24px grid, stroked) ---------- */
  const C = (r, cx = 12, cy = 12) => `M${cx} ${cy - r}a${r} ${r} 0 1 0 0 ${2 * r}a${r} ${r} 0 1 0 0-${2 * r}z`;
  const ICONS = {
    search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z M21 21l-4.3-4.3',
    plus: 'M12 5v14 M5 12h14',
    minus: 'M5 12h14',
    home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z',
    filter: 'M3 5h18 M6 12h12 M10 19h4',
    down: 'M6 9l6 6 6-6',
    up: 'M18 15l-6-6-6 6',
    right: 'M9 6l6 6-6 6',
    left: 'M15 6l-6 6 6 6',
    settings: C(3) + ' M12 2v3 M12 19v3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M2 12h3 M19 12h3 M4.9 19.1L7 17 M17 7l2.1-2.1',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8z',
    chart: 'M3 3v18h18 M7 15l4-4 3 3 5-6',
    bar: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
    pie: 'M21 15.9A10 10 0 1 1 8 2.8 M22 12A10 10 0 0 0 12 2v10z',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
    doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h6',
    folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M16 2v4 M8 2v4 M3 10h18',
    bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.9 1.9 0 0 0 3.4 0',
    star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
    hash: 'M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18',
    lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18 M6 6l12 12',
    more: 'M5 12h.01 M12 12h.01 M19 12h.01',
    vmore: 'M12 5h.01 M12 12h.01 M12 19h.01',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
    list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
    layers: 'M12 2l10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5',
    frame: 'M22 6H2 M22 18H2 M6 2v20 M18 2v20',
    pen: 'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    type: 'M4 7V4h16v3 M9 20h6 M12 4v16',
    square: 'M4 4h16v16H4z',
    circle: C(9),
    cart: 'M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6 M9 21h.01 M20 21h.01',
    box: 'M21 8l-9-5-9 5 9 5z M3 8v8l9 5 9-5V8 M12 13v8',
    card: 'M2 5h20v14H2z M2 10h20',
    dollar: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6',
    chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
    clock: C(9) + ' M12 7v5l3 2',
    tag: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z M7 7h.01',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7 M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
    eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z',
    play: 'M6 4l14 8-14 8z',
    globe: C(10) + ' M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
    code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
    alert: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01',
    info: C(10) + ' M12 16v-4 M12 8h.01',
    server: 'M2 3h20v8H2z M2 13h20v8H2z M6 7h.01 M6 17h.01',
    target: C(10) + ' ' + C(6) + ' ' + C(2),
    cursor: 'M4 4l7 17 2.5-7.5L21 11z',
    smile: C(10) + ' M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
    clip: 'M21.4 11l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
    send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
    at: C(4) + ' M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8',
    headphones: 'M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1v-6h3z M3 19a2 2 0 0 0 2 2h1v-6H3z',
    bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
    sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z',
    refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    image: 'M3 3h18v18H3z M8.5 7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3z M21 15l-5-5L5 21',
    truck: 'M1 3h15v13H1z M16 8h4l3 3v5h-7 M5.5 16a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z M18.5 16a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z',
    building: 'M4 22V2h16v20 M9 6h.01 M15 6h.01 M9 10h.01 M15 10h.01 M9 14h.01 M15 14h.01 M10 22v-4h4v4',
    briefcase: 'M2 7h20v14H2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
    arrow: 'M5 12h14 M12 5l7 7-7 7',
    back: 'M19 12H5 M12 19l-7-7 7-7',
    ext: 'M7 17L17 7 M7 7h10v10',
    copy: 'M9 9h13v13H9z M5 15H2V2h13v3',
    trash: 'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6',
    sliders: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
    sort: 'M7 4v16 M3 16l4 4 4-4 M17 20V4 M13 8l4-4 4 4',
    kanban: 'M4 3h4v18H4z M10 3h4v12h-4z M16 3h4v8h-4z',
    component: 'M12 2l3 3-3 3-3-3z M12 16l3 3-3 3-3-3z M5 9l3 3-3 3-3-3z M19 9l3 3-3 3-3-3z',
    help: C(10) + ' M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01',
    hand: 'M18 11V6a2 2 0 0 0-4 0v5 M14 10V4a2 2 0 0 0-4 0v6 M10 10.5V6a2 2 0 0 0-4 0v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15',
    sidebar: 'M3 3h18v18H3z M9 3v18',
    panel: 'M3 3h18v18H3z M15 3v18',
    video: 'M23 7l-7 5 7 5z M1 5h15v14H1z',
    mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    pin: 'M12 22s-8-6.2-8-12a8 8 0 0 1 16 0c0 5.8-8 12-8 12z M12 7a3 3 0 1 0 0 6a3 3 0 0 0 0-6z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
    cycle: C(9) + ' M12 3a9 9 0 0 1 0 18z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    percent: 'M19 5L5 19 M6.5 4a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z M17.5 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z',
    store: 'M3 9l1.5-5h15L21 9 M3 9v11h18V9 M3 9h18 M9 20v-6h6v6',
    megaphone: 'M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z M8 2v16 M16 6v16',
    expand: 'M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7',
    undo: 'M3 7v6h6 M21 17a9 9 0 0 0-15-6.7L3 13',
    bold: 'M6 4h8a4 4 0 0 1 0 8H6z M6 12h9a4 4 0 0 1 0 8H6z',
    italic: 'M19 4h-9 M14 20H5 M15 4L9 20',
    numlist: 'M10 6h11 M10 12h11 M10 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
    quote: 'M3 21c3 0 7-1 7-8V5H3v7h4c0 3.5-1.5 5-4 5z M14 21c3 0 7-1 7-8V5h-7v7h4c0 3.5-1.5 5-4 5z',
    todo: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    table: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18',
    gauge: 'M12 14l4-4 M3.3 19a10 10 0 1 1 17.4 0z',
    branch: 'M6 3v12 M18 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0-6a3 3 0 0 0 0 6z M18 9a9 9 0 0 1-9 9',
    terminal: 'M4 17l6-6-6-6 M12 19h8',
    route: 'M6 19a3 3 0 1 0 0-6 M18 5a3 3 0 1 0 0 6 M6 16h8a4 4 0 0 0 0-8H9',
  };
  const ic = (name, size = 16, cls = '') => {
    const d = ICONS[name];
    if (!d) return '';
    return `<svg class="m-ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  };

  // Linear-style status glyphs and priority bars
  const statusGlyph = (s, size = 14) => {
    const col = { backlog: '#8a8f98', todo: '#b9bcc3', progress: '#f2c94c', review: '#5e9e6e', done: '#5e6ad2', canceled: '#8a8f98', triage: '#fc7840' }[s] || '#8a8f98';
    const r = 6;
    let inner = '';
    if (s === 'backlog') return `<svg class="m-st" width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="${r}" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="2 2"/></svg>`;
    if (s === 'progress') inner = `<path d="M7 3.5a3.5 3.5 0 0 1 0 7z" fill="${col}"/>`;
    if (s === 'review') inner = `<path d="M7 3.5a3.5 3.5 0 1 1-3.5 3.5H7z" fill="${col}"/>`;
    if (s === 'done') return `<svg class="m-st" width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="${col}"/><path d="M4.2 7.2l1.9 1.9 3.8-3.9" stroke="#fff" stroke-width="1.6" fill="none"/></svg>`;
    if (s === 'canceled') return `<svg class="m-st" width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="${col}"/><path d="M4.8 4.8l4.4 4.4M9.2 4.8l-4.4 4.4" stroke="#fff" stroke-width="1.5"/></svg>`;
    if (s === 'triage') return `<svg class="m-st" width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="${col}"/><path d="M4 7h6M8 5l2 2-2 2" stroke="#fff" stroke-width="1.4" fill="none"/></svg>`;
    return `<svg class="m-st" width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="${r}" fill="none" stroke="${col}" stroke-width="1.5"/>${inner}</svg>`;
  };
  const prioGlyph = (p) => {
    if (p === 'urgent') return `<svg class="m-prio" width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="3" fill="#f2994a"/><path d="M7 3.5v4.2M7 9.6v.9" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    if (p === 'none') return `<svg class="m-prio" width="14" height="14" viewBox="0 0 14 14"><path d="M2 7h2M6 7h2M10 7h2" stroke="currentColor" stroke-width="1.5" opacity=".5"/></svg>`;
    const lvl = { high: 3, medium: 2, low: 1 }[p] || 0;
    return `<svg class="m-prio" width="14" height="14" viewBox="0 0 14 14">${[0, 1, 2].map((i) => `<rect x="${1.5 + i * 4}" y="${9 - i * 3}" width="3" height="${4 + i * 3}" rx="1" fill="currentColor" opacity="${i < lvl ? 0.9 : 0.25}"/>`).join('')}</svg>`;
  };

  /* ---------- Atoms ---------- */
  const AV_COLORS = ['#e5484d', '#f76b15', '#ffb224', '#46a758', '#12a594', '#0090ff', '#3e63dd', '#8e4ec6', '#d6409f', '#978365'];
  const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const initials = (n) => String(n).split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const av = (name, size = 22, color) => `<span class="m-av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.42)}px;background:${color || AV_COLORS[hash(name) % AV_COLORS.length]}">${esc(initials(name))}</span>`;
  const avs = (names, size = 20) => `<span class="m-avs">${names.map((n) => av(n, size)).join('')}</span>`;
  const pill = (text, tone = 'gray', dot) => `<span class="m-pill t-${tone}">${dot ? '<i></i>' : ''}${esc(text)}</span>`;
  const kbd = (k) => String(k).split(' ').map((x) => `<kbd class="m-kbd">${esc(x)}</kbd>`).join('');
  const sw = (c, size = 12) => `<span class="m-sw" style="width:${size}px;height:${size}px;background:${c}"></span>`;

  const btn = (b) => {
    if (!b) return '';
    if (typeof b === 'string') b = { l: b };
    const k = b.k || 'secondary';
    return `<span class="m-btn k-${k}${b.sm ? ' sm' : ''}${b.l ? '' : ' icon'}"${b.style ? ` style="${b.style}"` : ''}>${b.i ? ic(b.i, b.sm ? 13 : 15) : ''}${b.l ? `<span>${esc(b.l)}</span>` : ''}${b.kbd ? kbd(b.kbd) : ''}${b.caret ? ic('down', 13, 'm-caret') : ''}</span>`;
  };
  const btns = (list) => (list || []).map(btn).join('');

  // Table / list cell content
  const cell = (v) => {
    if (v == null) return '';
    if (typeof v === 'number') return `<span class="m-num">${v}</span>`;
    if (typeof v === 'string') return rich(v);
    if (Array.isArray(v)) return `<span class="m-inline">${v.map(cell).join('')}</span>`;
    if (v.pill != null) return pill(v.pill, v.tone, v.dot);
    if (v.av != null) return `<span class="m-who">${av(v.av, v.size || 22)}${v.name === false ? '' : `<span>${esc(v.name || v.av)}</span>`}${v.sub ? `<small>${esc(v.sub)}</small>` : ''}</span>`;
    if (v.avs) return avs(v.avs, v.size);
    if (v.two) return `<span class="m-two"><span>${rich(v.two[0])}</span><small>${rich(v.two[1])}</small></span>`;
    if (v.mono != null) return `<span class="m-mono">${esc(v.mono)}</span>`;
    if (v.muted != null) return `<span class="m-muted">${rich(v.muted)}</span>`;
    if (v.b != null) return `<b>${rich(v.b)}</b>`;
    if (v.bar != null) return `<span class="m-bar"><i style="width:${Math.round(v.bar * 100)}%;${v.color ? `background:${v.color}` : ''}"></i></span>${v.l ? `<small class="m-muted">${esc(v.l)}</small>` : ''}`;
    if (v.st) return `<span class="m-inline">${statusGlyph(v.st)}${v.l ? `<span>${esc(v.l)}</span>` : ''}</span>`;
    if (v.prio) return prioGlyph(v.prio);
    if (v.i) return `<span class="m-inline">${ic(v.i, v.size || 15)}${v.l ? `<span>${rich(v.l)}</span>` : ''}</span>`;
    if (v.check != null) return `<span class="m-check${v.check ? ' on' : ''}">${v.check ? ic('check', 11) : ''}</span>`;
    if (v.toggle != null) return `<span class="m-toggle${v.toggle ? ' on' : ''}"><i></i></span>`;
    if (v.sw) return `<span class="m-inline">${sw(v.sw)}${v.l ? `<span>${esc(v.l)}</span>` : ''}</span>`;
    if (v.tags) return `<span class="m-inline">${v.tags.map((t) => (typeof t === 'string' ? pill(t) : pill(t[0], t[1]))).join('')}</span>`;
    if (v.btn) return btn(v.btn);
    if (v.kbd) return kbd(v.kbd);
    if (v.img) return `<span class="m-thumbimg" style="background:${v.img}"></span>${v.l ? `<span>${esc(v.l)}</span>` : ''}`;
    if (v.html) return v.html;
    return '';
  };

  /* ---------- Box model shared by all nodes ---------- */
  const TOKENS = new Set(['bg', 'panel', 'side', 'hover', 'sel', 'accent', 'canvas', 'raised']);
  const COMP_DEFAULT = {
    sidebar: 'sidebar-nav', rail: 'sidebar-nav', topbar: 'top-bar', tabs: 'tabs', filters: 'filter-bar',
    table: 'data-table', list: 'list', kanban: 'kanban-board', kpis: 'kpi-tile', chart: 'chart', cards: 'card',
    feed: 'activity-timeline', chat: 'message-list', composer: 'composer', doc: 'rich-text-editor', form: 'form',
    props: 'property-panel', inspector: 'property-panel', canvas: 'canvas', layers: 'tree-view', tree: 'tree-view',
    calendar: 'date-picker', slots: 'time-slot-picker', empty: 'empty-state', stepper: 'stepper', code: 'code-block',
    logs: 'log-stream', checklist: 'checklist', banner: 'banner', modal: 'modal', drawer: 'drawer', palette: 'command-menu',
    menu: 'dropdown-menu', toast: 'toast', tip: 'tooltip', search: 'search', toolbar: 'toolbar', seg: 'segmented-control',
    bulk: 'bulk-action-bar', breadcrumbs: 'breadcrumbs', pagination: 'pagination', facets: 'facet-panel', pop: 'popover',
    daterange: 'date-range-picker', preview: 'live-preview', upload: 'file-upload', progress: 'progress',
  };

  let compLabel = (id) => id;
  const tokenOrColor = (v) => (TOKENS.has(v) ? `var(--m-${v})` : v);

  function attrs(n, cls, extraStyle = '') {
    const s = [];
    if (n.w != null) s.push(`width:${n.w}px;flex:none`);
    if (n.h != null) s.push(`height:${n.h}px;flex:none`);
    if (n.flex != null) s.push(`flex:${n.flex} 1 0;min-width:0;min-height:0${n.t === 'row' || n.t === 'col' ? ';overflow:hidden' : ''}`);
    if (n.pad != null) s.push(`padding:${typeof n.pad === 'number' ? n.pad + 'px' : n.pad}`);
    if (n.gap != null) s.push(`gap:${n.gap}px`);
    if (n.bg) s.push(`background:${tokenOrColor(n.bg)}`);
    if (n.bd) {
      const map = { a: 'border', r: 'border-right', l: 'border-left', t: 'border-top', b: 'border-bottom' };
      [...n.bd].forEach((k) => map[k] && s.push(`${map[k]}:1px solid var(--m-border)`));
    }
    if (n.radius != null) s.push(`border-radius:${n.radius}px;overflow:hidden`);
    if (n.align) s.push(`align-items:${n.align}`);
    if (n.justify) s.push(`justify-content:${n.justify}`);
    if (n.st) s.push(n.st);
    if (extraStyle) s.push(extraStyle);
    const comp = n.comp === false ? null : n.comp || COMP_DEFAULT[n.t];
    const ca = comp ? ` data-comp="${comp}" data-label="${esc(compLabel(comp))}"` : '';
    return `class="${cls}${n.cls ? ' ' + n.cls : ''}"${s.length ? ` style="${s.join(';')}"` : ''}${ca}`;
  }
  const kids = (n) => (n.c || []).map(R).join('');

  /* ---------- Primitives ---------- */
  const P = {};

  P.row = (n) => `<div ${attrs(n, 'm-row')}>${kids(n)}</div>`;
  P.col = (n) => `<div ${attrs(n, 'm-col')}>${kids(n)}</div>`;
  P.box = (n) => `<div ${attrs(n, 'm-box')}>${kids(n)}</div>`;
  P.scroll = (n) => `<div ${attrs(n, 'm-col m-scroll')}>${kids(n)}</div>`;
  P.center = (n) => `<div ${attrs(n, 'm-center')}>${kids(n)}</div>`;
  P.spacer = (n) => `<div ${attrs(n, 'm-spacer')}></div>`;
  P.divider = (n) => `<div ${attrs(n, 'm-divider')}></div>`;
  P.html = (n) => `<div ${attrs(n, 'm-box')}>${n.html}</div>`;

  P.h = (n) => `<div ${attrs(n, 'm-h')}><div class="m-h-main">${n.i ? ic(n.i, n.size ? n.size * 0.9 : 20) : ''}${n.icon ? `<span class="m-h-icon">${esc(n.icon)}</span>` : ''}<span style="font-size:${n.size || 20}px">${rich(n.text)}</span>${n.badge ? pill(n.badge[0], n.badge[1]) : ''}</div>${n.sub ? `<div class="m-h-sub">${rich(n.sub)}</div>` : ''}${n.right ? `<div class="m-h-right">${btns(n.right)}</div>` : ''}</div>`;

  P.text = (n) => `<div ${attrs(n, 'm-text' + (n.muted ? ' m-muted' : ''), `${n.size ? `font-size:${n.size}px;` : ''}${n.weight ? `font-weight:${n.weight};` : ''}`)}>${rich(n.v)}</div>`;
  P.label = (n) => `<div ${attrs(n, 'm-label')}>${esc(n.v)}${n.right ? `<span>${cell(n.right)}</span>` : ''}</div>`;
  P.btns = (n) => `<div ${attrs(n, 'm-btnrow')}>${btns(n.items)}</div>`;
  P.cell = (n) => `<div ${attrs(n, 'm-cellwrap')}>${cell(n.v)}</div>`;

  P.sidebar = (n) => {
    const head = n.head ? `<div class="m-sb-head">${n.head.logo ? `<span class="m-logo" style="background:${n.head.color || 'var(--m-accent)'}">${esc(n.head.logo)}</span>` : ''}<span class="m-sb-name">${esc(n.head.name)}</span>${n.head.caret !== false ? ic('down', 13, 'm-faint') : ''}<span class="m-spacer"></span>${(n.head.icons || []).map((i) => `<span class="m-ibtn">${ic(i, 15)}</span>`).join('')}</div>` : '';
    const item = (it) => {
      if (it.sep) return '<div class="m-sb-sep"></div>';
      const lead = it.dot ? `<span class="m-dot" style="background:${it.dot}"></span>` : it.logo ? `<span class="m-logo sm" style="background:${it.color || '#888'}">${esc(it.logo)}</span>` : it.av ? av(it.av, 18) : it.i ? ic(it.i, 15) : '';
      return `<div class="m-sb-item${it.on ? ' on' : ''}${it.bold ? ' bold' : ''}" style="padding-left:${10 + (it.d || 0) * 14}px">${it.caret != null ? ic(it.caret ? 'down' : 'right', 12, 'm-faint') : ''}${lead}<span class="m-sb-l">${rich(it.l)}</span>${it.n != null ? `<span class="m-sb-n">${esc(it.n)}</span>` : ''}${it.badge ? `<span class="m-badge">${esc(it.badge)}</span>` : ''}${it.k ? kbd(it.k) : ''}</div>`;
    };
    const sections = (n.sections || []).map((s) => `<div class="m-sb-sec">${s.title ? `<div class="m-sb-title">${esc(s.title)}${s.add ? ic('plus', 13) : ''}</div>` : ''}${s.items.map(item).join('')}</div>`).join('');
    const search = n.search ? `<div class="m-sb-search">${ic('search', 14)}<span>${esc(n.search)}</span>${n.searchK ? kbd(n.searchK) : ''}</div>` : '';
    const foot = n.foot ? `<div class="m-sb-foot">${n.foot.map(item).join('')}</div>` : '';
    const cta = n.cta ? `<div class="m-sb-cta">${btn(n.cta)}</div>` : '';
    return `<aside ${attrs({ w: 240, ...n }, 'm-sidebar')}>${head}${cta}${search}<div class="m-sb-body">${sections}</div>${n.c ? kids(n) : ''}${foot}</aside>`;
  };

  P.rail = (n) => `<nav ${attrs({ w: 64, ...n }, 'm-rail')}>${(n.items || []).map((it) => it.sep ? '<div class="m-rail-sep"></div>' : `<div class="m-rail-item${it.on ? ' on' : ''}">${it.logo ? `<span class="m-logo lg" style="background:${it.color || 'var(--m-accent)'}">${esc(it.logo)}</span>` : it.av ? av(it.av, 30) : ic(it.i, 20)}${it.l ? `<small>${esc(it.l)}</small>` : ''}${it.badge ? `<span class="m-badge">${esc(it.badge)}</span>` : ''}</div>`).join('')}<div class="m-spacer"></div>${(n.bottom || []).map((it) => `<div class="m-rail-item">${it.av ? av(it.av, 30) : ic(it.i, 20)}</div>`).join('')}</nav>`;

  P.topbar = (n) => {
    const crumbs = n.crumbs ? `<div class="m-crumbs">${n.crumbs.map((c, i) => `<span class="${i === n.crumbs.length - 1 ? 'cur' : ''}">${rich(c)}</span>`).join(ic('right', 12, 'm-faint'))}</div>` : '';
    const title = n.title ? `<div class="m-tb-title">${n.i ? ic(n.i, 16) : ''}${n.icon ? `<span class="m-h-icon sm">${esc(n.icon)}</span>` : ''}<span>${rich(n.title)}</span>${n.star ? ic('star', 14, 'm-faint') : ''}${n.badge ? pill(n.badge[0], n.badge[1]) : ''}</div>` : '';
    const tabs = n.tabs ? `<div class="m-tb-tabs">${n.tabs.map((t, i) => `<span class="m-tab-pill${i === (n.tabOn || 0) ? ' on' : ''}">${esc(t)}</span>`).join('')}</div>` : '';
    const search = n.search ? `<div class="m-tb-search" data-comp="search" data-label="${esc(compLabel('search'))}">${ic('search', 14)}<span>${esc(n.search)}</span>${n.searchK ? kbd(n.searchK) : ''}</div>` : '';
    return `<header ${attrs({ h: 48, ...n }, 'm-topbar' + (n.center ? ' center' : ''))}>${n.back ? `<span class="m-ibtn">${ic('back', 16)}</span>` : ''}${crumbs}${title}${tabs}${n.center ? '' : '<span class="m-spacer"></span>'}${search}${n.center ? '<span class="m-spacer"></span>' : ''}${n.avs ? avs(n.avs, 22) : ''}${btns(n.actions)}${n.me ? av(n.me, 26) : ''}</header>`;
  };

  P.breadcrumbs = (n) => `<div ${attrs(n, 'm-crumbs')}>${n.items.map((c, i) => `<span class="${i === n.items.length - 1 ? 'cur' : ''}">${rich(c)}</span>`).join(ic('right', 12, 'm-faint'))}</div>`;

  P.tabs = (n) => {
    const items = n.items.map((t) => (typeof t === 'string' ? { l: t } : t));
    return `<div ${attrs(n, 'm-tabs s-' + (n.style || 'line'))}>${items.map((t, i) => `<span class="m-tab${i === (n.on || 0) ? ' on' : ''}">${t.i ? ic(t.i, 14) : ''}${esc(t.l)}${t.n != null ? `<span class="m-tab-n">${esc(t.n)}</span>` : ''}${t.x ? ic('x', 11, 'm-faint') : ''}</span>`).join('')}${n.add ? `<span class="m-tab add">${ic('plus', 14)}${n.add === true ? '' : esc(n.add)}</span>` : ''}<span class="m-spacer"></span>${btns(n.right)}</div>`;
  };

  P.seg = (n) => `<div ${attrs(n, 'm-seg')}>${n.items.map((t, i) => `<span class="${i === (n.on || 0) ? 'on' : ''}">${typeof t === 'string' ? esc(t) : (t.i ? ic(t.i, 14) : '') + esc(t.l || '')}</span>`).join('')}</div>`;

  P.filters = (n) => {
    const chips = (n.items || []).map((f) => `<span class="m-chip${f.v ? ' set' : ''}">${f.i ? ic(f.i, 13) : ''}<span>${esc(f.l)}</span>${f.op ? `<span class="m-chip-op">${esc(f.op)}</span>` : ''}${f.v ? `<b>${esc(f.v)}</b>` : ''}${f.v && f.x !== false ? ic('x', 11, 'm-faint') : f.caret ? ic('down', 12, 'm-faint') : ''}</span>`).join('');
    const search = n.search ? `<span class="m-fsearch" data-comp="search" data-label="${esc(compLabel('search'))}">${ic('search', 14)}<span>${esc(n.search)}</span></span>` : '';
    return `<div ${attrs(n, 'm-filters')}>${search}${chips}${n.add ? `<span class="m-chip add">${ic(n.addI || 'plus', 13)}<span>${esc(n.add)}</span></span>` : ''}${n.clear ? `<span class="m-link sm">${esc(n.clear)}</span>` : ''}<span class="m-spacer"></span>${n.count ? `<span class="m-muted sm">${esc(n.count)}</span>` : ''}${btns(n.right)}</div>`;
  };

  P.bulk = (n) => `<div ${attrs(n, 'm-bulk')}><span class="m-check on">${ic('check', 11)}</span><b>${esc(n.n)} selected</b>${btns(n.actions)}<span class="m-spacer"></span>${n.close !== false ? `<span class="m-ibtn">${ic('x', 15)}</span>` : ''}</div>`;

  P.table = (n) => {
    const cols = n.cols.map((c) => (typeof c === 'string' ? { l: c } : c));
    const sel = new Set(n.sel || []);
    const th = `<tr>${n.check ? `<th class="m-td-check"><span class="m-check${n.allSel ? ' on' : n.sel && n.sel.length ? ' some' : ''}">${n.allSel ? ic('check', 11) : n.sel && n.sel.length ? ic('minus', 11) : ''}</span></th>` : ''}${cols.map((c) => `<th style="${c.w ? `width:${c.w}px;` : ''}${c.r ? 'text-align:right;' : ''}">${esc(c.l)}${c.sort ? ic(c.sort === 'up' ? 'up' : 'down', 11) : ''}</th>`).join('')}</tr>`;
    const tr = n.rows.map((r, i) => {
      if (r.group) return `<tr class="m-tr-group"><td colspan="${cols.length + (n.check ? 1 : 0)}">${ic('down', 12)}<b>${rich(r.group)}</b>${r.n != null ? `<span class="m-muted">${esc(r.n)}</span>` : ''}</td></tr>`;
      return `<tr class="${sel.has(i) ? 'sel' : ''}${n.hover === i ? ' hover' : ''}">${n.check ? `<td class="m-td-check"><span class="m-check${sel.has(i) ? ' on' : ''}">${sel.has(i) ? ic('check', 11) : ''}</span></td>` : ''}${r.map((v, j) => `<td style="${cols[j] && cols[j].r ? 'text-align:right;' : ''}">${cell(v)}</td>`).join('')}</tr>`;
    }).join('');
    return `<div ${attrs(n, 'm-tablewrap' + (n.dense ? ' dense' : '') + (n.zebra ? ' zebra' : '') + (n.grid ? ' gridlines' : ''))}><table class="m-table"><thead>${th}</thead><tbody>${tr}</tbody></table>${n.foot ? `<div class="m-table-foot">${rich(n.foot)}</div>` : ''}</div>`;
  };

  P.pagination = (n) => `<div ${attrs(n, 'm-pagination')}><span class="m-muted">${esc(n.text)}</span><span class="m-spacer"></span>${btn({ l: 'Previous', sm: 1 })}${btn({ l: 'Next', sm: 1 })}</div>`;

  P.list = (n) => {
    const row = (it, i) => `<div class="m-li${it.on ? ' on' : ''}${it.sel ? ' sel' : ''}${it.unread ? ' unread' : ''}"${it.d ? ` style="padding-left:${16 + it.d * 18}px"` : ''}>${it.check != null ? cell({ check: it.check }) : ''}${it.prio ? prioGlyph(it.prio) : ''}${it.id ? `<span class="m-li-id">${esc(it.id)}</span>` : ''}${it.st ? statusGlyph(it.st) : ''}${it.i ? ic(it.i, 15, 'm-faint') : ''}${it.av ? av(it.av, it.avSize || 22) : ''}<div class="m-li-main">${it.title2 ? `<div class="m-li-top"><b>${rich(it.title)}</b><span class="m-spacer"></span><small class="m-muted">${esc(it.time || '')}</small></div><div class="m-li-sub">${rich(it.title2)}</div>` : `<span class="m-li-title">${rich(it.title)}</span>${it.sub ? `<span class="m-li-sub inline">${rich(it.sub)}</span>` : ''}`}</div>${it.meta ? `<span class="m-inline">${it.meta.map(cell).join('')}</span>` : ''}${it.right != null ? `<span class="m-li-right">${cell(it.right)}</span>` : ''}${it.time && !it.title2 ? `<span class="m-li-time">${esc(it.time)}</span>` : ''}</div>`;
    const groups = n.groups || [{ items: n.items }];
    return `<div ${attrs(n, 'm-list' + (n.dense ? ' dense' : '') + (n.cards ? ' cards' : ''))}>${groups.map((g) => `${g.title ? `<div class="m-li-group">${g.st ? statusGlyph(g.st) : ''}<b>${esc(g.title)}</b><span class="m-muted">${esc(g.n ?? '')}</span><span class="m-spacer"></span>${ic('plus', 14, 'm-faint')}</div>` : ''}${g.items.map(row).join('')}`).join('')}</div>`;
  };

  P.kanban = (n) => `<div ${attrs(n, 'm-kanban')}>${n.cols.map((col) => `<div class="m-kcol" style="${n.colW ? `width:${n.colW}px` : ''}"><div class="m-kcol-head">${col.st ? statusGlyph(col.st) : col.color ? `<span class="m-dot" style="background:${col.color}"></span>` : ''}<b>${esc(col.title)}</b><span class="m-muted">${esc(col.n ?? col.cards.length)}</span><span class="m-spacer"></span>${col.sum ? `<span class="m-muted sm">${esc(col.sum)}</span>` : ic('plus', 14, 'm-faint')}</div><div class="m-kcards">${col.cards.map((c) => `<div class="m-kcard${c.drag ? ' drag' : ''}${c.ghost ? ' ghost' : ''}">${c.id ? `<div class="m-kcard-id">${esc(c.id)}${c.av ? av(c.av, 18) : ''}</div>` : ''}<div class="m-kcard-title">${c.st ? statusGlyph(c.st) : ''}<span>${rich(c.title)}</span></div>${c.sub ? `<div class="m-kcard-sub">${rich(c.sub)}</div>` : ''}${c.meta ? `<div class="m-kcard-meta">${c.meta.map(cell).join('')}${!c.id && c.av ? `<span class="m-spacer"></span>${av(c.av, 20)}` : ''}</div>` : ''}</div>`).join('')}${col.add ? `<div class="m-kadd">${ic('plus', 13)}${esc(col.add)}</div>` : ''}</div></div>`).join('')}</div>`;

  /* Sparkline + charts (SVG, deterministic) */
  const seeded = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const genSeries = (n, seed, base = 50, vol = 0.18, trend = 0.4) => {
    const rnd = seeded(seed); let v = base; const out = [];
    for (let i = 0; i < n; i++) { v = Math.max(base * 0.15, v + (rnd() - 0.5 + trend / n * 3) * base * vol); out.push(Math.round(v * 10) / 10); }
    return out;
  };
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const spark = (data, color = 'var(--m-accent)', w = 120, h = 32, fill = true) => {
    const max = Math.max(...data), min = Math.min(...data); const rg = max - min || 1;
    const pts = data.map((v, i) => [i / (data.length - 1) * w, h - 3 - (v - min) / rg * (h - 6)]);
    const p = pathOf(pts);
    const last = pts[pts.length - 1];
    return `<svg class="m-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${fill ? `<path d="${p}L${w} ${h}L0 ${h}Z" fill="${color}" opacity=".12"/>` : ''}<path d="${p}" fill="none" stroke="${color}" stroke-width="1.6"/><circle cx="${last[0]}" cy="${last[1]}" r="2.5" fill="${color}"/></svg>`;
  };

  P.kpis = (n) => `<div ${attrs(n, 'm-kpis' + (n.plain ? ' plain' : ''))}>${n.items.map((k, i) => `<div class="m-kpi${k.on ? ' on' : ''}"><div class="m-kpi-l">${esc(k.l)}${k.info ? ic('info', 12, 'm-faint') : ''}</div><div class="m-kpi-v">${esc(k.v)}${k.d ? `<span class="m-delta ${k.tone || (String(k.d).startsWith('-') ? 'down' : 'up')}">${esc(k.d)}</span>` : ''}</div>${k.sub ? `<div class="m-kpi-sub">${rich(k.sub)}</div>` : ''}${k.spark !== false && n.spark !== false ? spark(Array.isArray(k.spark) ? k.spark : genSeries(18, (n.seed || 3) + i * 7, 50, 0.25, k.trend ?? 0.6), k.color || 'var(--m-accent)', 160, 34) : ''}</div>`).join('')}</div>`;

  P.chart = (n) => {
    const vw = n.vw || 640, vh = n.vh || 220, kind = n.kind || 'line';
    const padL = n.axis === false ? 6 : 40, padR = 10, padT = 10, padB = n.labels ? 24 : 8;
    const cw = vw - padL - padR, chh = vh - padT - padB;
    const colors = n.colors || ['var(--m-accent)', 'var(--m-c2)', 'var(--m-c3)', 'var(--m-c4)'];
    const base = n.base || 50;
    let series = n.series || [genSeries(n.n || 24, n.seed || 1, base, n.vol || 0.2, n.trend ?? 0.5)];
    if (n.compare && series.length < 2) series = [series[0], genSeries(series[0].length, (n.seed || 1) + 99, base, n.vol || 0.2, 0.2)];
    let body = '';
    const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => `<line x1="${padL}" x2="${vw - padR}" y1="${padT + chh * f}" y2="${padT + chh * f}" stroke="var(--m-border)" stroke-width="1"${f < 1 ? ' stroke-dasharray="2 3"' : ''}/>`).join('');
    let max;
    if (kind === 'bar' || kind === 'stack') {
      const nb = series[0].length;
      const totals = series[0].map((_, i) => (kind === 'stack' ? series.reduce((a, s) => a + s[i], 0) : Math.max(...series.map((s) => s[i]))));
      max = Math.max(...totals) * 1.1;
      const bw = cw / nb;
      series[0].forEach((_, i) => {
        if (kind === 'stack') {
          let acc = 0;
          series.forEach((s, si) => { const hh = s[i] / max * chh; body += `<rect x="${padL + i * bw + bw * 0.18}" y="${padT + chh - acc - hh}" width="${bw * 0.64}" height="${hh}" fill="${colors[si % colors.length]}" rx="1.5"/>`; acc += hh; });
        } else {
          const gw = bw * 0.7 / series.length;
          series.forEach((s, si) => { const hh = s[i] / max * chh; body += `<rect x="${padL + i * bw + bw * 0.15 + si * gw}" y="${padT + chh - hh}" width="${gw - 1}" height="${hh}" fill="${colors[si % colors.length]}" rx="2"/>`; });
        }
      });
    } else if (kind === 'funnel') {
      const steps = series[0]; max = steps[0];
      const bw = cw / steps.length;
      steps.forEach((v, i) => {
        const hh = v / max * chh;
        body += `<rect x="${padL + i * bw + bw * 0.12}" y="${padT}" width="${bw * 0.76}" height="${chh}" fill="var(--m-hover)" rx="3"/>`;
        body += `<rect x="${padL + i * bw + bw * 0.12}" y="${padT + chh - hh}" width="${bw * 0.76}" height="${hh}" fill="${colors[0]}" rx="3"/>`;
        body += `<text x="${padL + i * bw + bw * 0.5}" y="${padT + chh - hh - 6}" text-anchor="middle" class="m-svgt strong">${Math.round(v / max * 1000) / 10}%</text>`;
      });
    } else {
      max = Math.max(...series.flat()) * 1.12;
      series.forEach((s, si) => {
        const pts = s.map((v, i) => [padL + i / (s.length - 1) * cw, padT + chh - v / max * chh]);
        const p = pathOf(pts);
        const col = colors[si % colors.length];
        if ((kind === 'area' || n.fill) && si === 0) body += `<path d="${p}L${padL + cw} ${padT + chh}L${padL} ${padT + chh}Z" fill="${col}" opacity=".14"/>`;
        body += `<path d="${p}" fill="none" stroke="${col}" stroke-width="${si === 0 ? 2 : 1.6}"${n.compare && si === 1 ? ' stroke-dasharray="4 4" opacity=".7"' : ''}/>`;
        if (si === 0 && n.dot !== false) { const l = pts[pts.length - 1]; body += `<circle cx="${l[0]}" cy="${l[1]}" r="3.5" fill="${col}" stroke="var(--m-bg)" stroke-width="2"/>`; }
      });
      if (n.marker != null) { const x = padL + n.marker * cw; body += `<line x1="${x}" x2="${x}" y1="${padT}" y2="${padT + chh}" stroke="var(--m-fg)" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>`; }
      if (n.band) { const [a, b] = n.band; body = `<rect x="${padL + a * cw}" y="${padT}" width="${(b - a) * cw}" height="${chh}" fill="var(--m-danger)" opacity=".1"/>` + body; }
      if (n.threshold != null) { const y = padT + chh - n.threshold * chh; body += `<line x1="${padL}" x2="${padL + cw}" y1="${y}" y2="${y}" stroke="var(--m-danger)" stroke-width="1.2" stroke-dasharray="5 4"/>`; }
    }
    const yl = n.axis === false ? '' : [0, 0.5, 1].map((f) => `<text x="${padL - 8}" y="${padT + chh * (1 - f) + 4}" text-anchor="end" class="m-svgt">${n.yfmt ? n.yfmt(max * f) : fmtAxis(max * f, n.unit)}</text>`).join('');
    const xl = n.labels ? n.labels.map((l, i) => `<text x="${padL + (kind === 'line' || kind === 'area' ? i / (n.labels.length - 1) * cw : (i + 0.5) * cw / n.labels.length)}" y="${vh - 6}" text-anchor="${kind === 'line' || kind === 'area' ? (i === 0 ? 'start' : i === n.labels.length - 1 ? 'end' : 'middle') : 'middle'}" class="m-svgt">${esc(l)}</text>`).join('') : '';
    const legend = n.legend ? `<div class="m-legend">${n.legend.map((l, i) => `<span>${sw(colors[i % colors.length], 9)}${esc(l)}</span>`).join('')}</div>` : '';
    const head = n.title ? `<div class="m-chart-head"><div><div class="m-chart-title">${rich(n.title)}</div>${n.value ? `<div class="m-chart-v">${esc(n.value)}${n.d ? `<span class="m-delta ${String(n.d).startsWith('-') ? 'down' : 'up'}">${esc(n.d)}</span>` : ''}</div>` : ''}${n.sub ? `<div class="m-muted sm">${rich(n.sub)}</div>` : ''}</div><span class="m-spacer"></span>${btns(n.right)}${n.menu !== false ? `<span class="m-ibtn">${ic('more', 15)}</span>` : ''}</div>` : '';
    return `<div ${attrs(n, 'm-chart' + (n.card ? ' card' : ''))}>${head}${legend}<svg viewBox="0 0 ${vw} ${vh}" width="100%" preserveAspectRatio="xMidYMid meet">${grid}${body}${yl}${xl}</svg>${n.foot ? `<div class="m-chart-foot">${rich(n.foot)}</div>` : ''}</div>`;
  };
  const fmtAxis = (v, unit = '') => {
    if (unit === 'ms' && v >= 1000) return (v / 1000).toFixed(1) + 's';
    let s = v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(v >= 1e4 ? 0 : 1) + 'k' : v >= 10 ? Math.round(v) : v.toFixed(1);
    if (v === 0) s = '0';
    return unit === '$' ? '$' + s : s + unit;
  };

  P.cards = (n) => `<div ${attrs(n, 'm-cards', `grid-template-columns:repeat(${n.cols || 3},minmax(0,1fr))`)}>${n.items.map((c) => `<div class="m-card${c.on ? ' on' : ''}${c.dashed ? ' dashed' : ''}">${c.cover ? `<div class="m-card-cover" style="background:${c.cover}">${c.coverHtml || ''}</div>` : ''}${c.stripe ? `<div class="m-card-stripe" style="background:${c.stripe}"></div>` : ''}<div class="m-card-body">${c.i ? `<div class="m-card-icon" style="${c.iColor ? `color:${c.iColor};background:${c.iBg || 'var(--m-hover)'}` : ''}">${ic(c.i, 18)}</div>` : ''}<div class="m-card-title">${rich(c.title)}${c.badge ? pill(c.badge[0], c.badge[1]) : ''}</div>${c.sub ? `<div class="m-card-sub">${rich(c.sub)}</div>` : ''}${c.meta ? `<div class="m-card-meta">${c.meta.map(cell).join('')}</div>` : ''}${c.actions ? `<div class="m-card-actions">${btns(c.actions)}</div>` : ''}</div></div>`).join('')}</div>`;

  P.feed = (n) => `<div ${attrs(n, 'm-feed')}>${n.title ? `<div class="m-label">${esc(n.title)}</div>` : ''}${n.items.map((it) => it.comment ? `<div class="m-feed-comment">${av(it.who, 24)}<div><div class="m-feed-meta"><b>${esc(it.who)}</b><span class="m-muted">${esc(it.when)}</span></div><div class="m-feed-text">${rich(it.text)}</div></div></div>` : `<div class="m-feed-item"><span class="m-feed-dot">${it.av ? av(it.av, 18) : ic(it.i || 'circle', 12)}</span><span class="m-feed-text">${rich(it.text)}</span><span class="m-muted">${esc(it.when || '')}</span></div>`).join('')}${n.input ? `<div class="m-feed-input">${esc(n.input)}</div>` : ''}</div>`;

  P.chat = (n) => `<div ${attrs(n, 'm-chat')}>${n.day ? `<div class="m-chat-day"><span>${esc(n.day)}</span></div>` : ''}${n.msgs.map((m) => m.day ? `<div class="m-chat-day"><span>${esc(m.day)}</span></div>` : `<div class="m-msg${m.hl ? ' hl' : ''}${m.cont ? ' cont' : ''}${m.mine ? ' mine' : ''}${m.bubble ? ' bubble' : ''}">${m.cont ? '<span class="m-msg-gutter"></span>' : av(m.who, 34, m.color)}<div class="m-msg-body">${m.cont ? '' : `<div class="m-msg-meta"><b>${esc(m.who)}</b>${m.tag ? pill(m.tag, 'gray') : ''}<span class="m-muted">${esc(m.time || '')}</span></div>`}<div class="m-msg-text">${rich(m.text)}</div>${m.attach ? `<div class="m-attach">${ic(m.attach.i || 'file', 18)}<div><b>${esc(m.attach.l)}</b><small>${esc(m.attach.sub || '')}</small></div></div>` : ''}${m.reacts ? `<div class="m-reacts">${m.reacts.map((r) => `<span class="${r[2] ? 'on' : ''}">${ic(r[0], 12)}${esc(r[1])}</span>`).join('')}<span>${ic('smile', 12)}</span></div>` : ''}${m.thread ? `<div class="m-thread-link">${avs(m.thread.avs, 18)}<b>${esc(m.thread.n)} replies</b><span class="m-muted">${esc(m.thread.last || '')}</span></div>` : ''}</div>${m.hover ? `<div class="m-msg-actions">${['smile', 'chat', 'bookmark', 'more'].map((i) => ic(i, 15)).join('')}</div>` : ''}</div>`).join('')}</div>`;

  P.composer = (n) => `<div ${attrs(n, 'm-composer' + (n.focus ? ' focus' : ''))}>${n.tabs ? `<div class="m-comp-tabs">${n.tabs.map((t, i) => `<span class="${i === (n.tabOn || 0) ? 'on' : ''}">${esc(t)}</span>`).join('')}</div>` : ''}${n.tools !== false ? `<div class="m-comp-tools">${['bold', 'italic', 'link', 'numlist', 'list', 'code'].map((i) => ic(i, 14)).join('')}</div>` : ''}<div class="m-comp-text${n.v ? '' : ' ph'}">${n.v ? rich(n.v) : esc(n.ph || 'Write a message…')}${n.focus ? '<span class="m-caret-blink"></span>' : ''}</div><div class="m-comp-foot">${['plus', 'smile', 'at', 'video', 'mic'].slice(0, n.minimal ? 3 : 5).map((i) => `<span class="m-ibtn">${ic(i, 15)}</span>`).join('')}<span class="m-spacer"></span>${n.hint ? `<span class="m-muted sm">${esc(n.hint)}</span>` : ''}${n.send ? btn(n.send) : `<span class="m-send${n.v ? ' on' : ''}">${ic('send', 14)}</span>`}</div></div>`;

  P.doc = (n) => {
    const block = (b) => {
      switch (b.t) {
        case 'h1': return `<h1 class="m-doc-h1">${rich(b.v)}</h1>`;
        case 'h2': return `<h2 class="m-doc-h2">${rich(b.v)}</h2>`;
        case 'h3': return `<h3 class="m-doc-h3">${rich(b.v)}</h3>`;
        case 'p': return `<p class="m-doc-p${b.ph ? ' ph' : ''}${b.focus ? ' focus' : ''}">${b.handle ? `<span class="m-doc-handle">${ic('plus', 14)}${ic('vmore', 14)}</span>` : ''}${rich(b.v)}${b.focus ? '<span class="m-caret-blink"></span>' : ''}</p>`;
        case 'bullet': return `<div class="m-doc-bullet"><span>•</span><span>${rich(b.v)}</span></div>`;
        case 'num': return `<div class="m-doc-bullet"><span>${esc(b.n)}.</span><span>${rich(b.v)}</span></div>`;
        case 'todo': return `<div class="m-doc-todo${b.done ? ' done' : ''}">${cell({ check: !!b.done })}<span>${rich(b.v)}</span></div>`;
        case 'toggle': return `<div class="m-doc-toggle">${ic(b.open ? 'down' : 'right', 13)}<span>${rich(b.v)}</span></div>`;
        case 'callout': return `<div class="m-doc-callout" style="${b.bg ? `background:${b.bg}` : ''}">${ic(b.i || 'info', 16)}<span>${rich(b.v)}</span></div>`;
        case 'quote': return `<blockquote class="m-doc-quote">${rich(b.v)}</blockquote>`;
        case 'hr': return '<hr class="m-doc-hr"/>';
        case 'code': return `<pre class="m-doc-code">${esc(b.v)}</pre>`;
        case 'img': return `<div class="m-doc-img" style="background:${b.bg || 'var(--m-hover)'};height:${b.h || 160}px">${ic('image', 24)}</div>`;
        case 'props': return `<div class="m-doc-props">${b.rows.map((r) => `<div class="m-doc-prop"><span class="m-muted">${r[2] ? ic(r[2], 14) : ''}${esc(r[0])}</span><span>${cell(r[1])}</span></div>`).join('')}</div>`;
        case 'node': return R(b.node);
        default: return '';
      }
    };
    return `<div ${attrs(n, 'm-doc')}>${n.cover ? `<div class="m-doc-cover" style="background:${n.cover}"></div>` : ''}<div class="m-doc-inner" style="max-width:${n.maxw || 720}px">${n.icon ? `<div class="m-doc-icon${n.cover ? ' over' : ''}">${esc(n.icon)}</div>` : ''}${n.title ? `<h1 class="m-doc-title">${rich(n.title)}</h1>` : ''}${(n.blocks || []).map(block).join('')}</div></div>`;
  };

  P.form = (n) => {
    const field = (f) => {
      if (f.row) return `<div class="m-frow">${f.row.map(field).join('')}</div>`;
      if (f.section) return `<div class="m-fsection"><b>${esc(f.section)}</b>${f.sub ? `<span class="m-muted">${esc(f.sub)}</span>` : ''}</div>`;
      if (f.node) return R(f.node);
      let ctrl = '';
      const val = f.v != null && f.v !== '' ? `<span>${rich(f.v)}</span>` : `<span class="m-ph">${esc(f.ph || '')}</span>`;
      switch (f.type) {
        case 'select': ctrl = `<div class="m-input${f.focus ? ' focus' : ''}">${f.lead ? cell(f.lead) : ''}${val}<span class="m-spacer"></span>${ic('down', 14, 'm-faint')}</div>`; break;
        case 'textarea': ctrl = `<div class="m-input area${f.focus ? ' focus' : ''}" style="height:${f.h || 84}px">${val}</div>`; break;
        case 'toggle': return `<div class="m-ftoggle"><div><b>${esc(f.l)}</b>${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</div>${cell({ toggle: !!f.v })}</div>`;
        case 'check': return `<div class="m-fcheck">${cell({ check: !!f.v })}<div><span>${rich(f.l)}</span>${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</div></div>`;
        case 'radio': return `<div class="m-fradio"><div class="m-flabel">${esc(f.l)}</div>${f.opts.map((o, i) => `<div class="m-radio-opt${i === f.v ? ' on' : ''}${f.cards ? ' card' : ''}"><span class="m-radio"></span><div><b>${esc(typeof o === 'string' ? o : o[0])}</b>${typeof o !== 'string' && o[1] ? `<small>${esc(o[1])}</small>` : ''}</div></div>`).join('')}</div>`;
        case 'seg': ctrl = R({ t: 'seg', items: f.opts, on: f.v, comp: false }); break;
        case 'chips': ctrl = `<div class="m-input chips">${f.opts.map((o) => pill(o, 'gray')).join('')}<span class="m-ph">${esc(f.ph || '')}</span></div>`; break;
        case 'upload': ctrl = `<div class="m-upload" data-comp="file-upload" data-label="${esc(compLabel('file-upload'))}">${ic('upload', 20)}<span>${rich(f.v || 'Drop files here or **browse**')}</span>${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</div>`; break;
        case 'money': ctrl = `<div class="m-input${f.focus ? ' focus' : ''}"><span class="m-muted">${esc(f.cur || '$')}</span>${val}<span class="m-spacer"></span>${f.suffix ? `<span class="m-muted">${esc(f.suffix)}</span>` : ''}</div>`; break;
        case 'date': ctrl = `<div class="m-input">${ic('calendar', 14, 'm-faint')}${val}</div>`; break;
        case 'static': ctrl = `<div class="m-static">${cell(f.v)}</div>`; break;
        default: ctrl = `<div class="m-input${f.focus ? ' focus' : ''}${f.err ? ' err' : ''}">${f.lead ? cell(f.lead) : ''}${val}${f.focus ? '<span class="m-caret-blink"></span>' : ''}<span class="m-spacer"></span>${f.trail ? cell(f.trail) : ''}</div>`;
      }
      return `<div class="m-field" style="${f.flex ? `flex:${f.flex}` : ''}">${f.l ? `<div class="m-flabel">${esc(f.l)}${f.req ? '<i>*</i>' : ''}${f.opt ? '<span class="m-muted"> (optional)</span>' : ''}</div>` : ''}${ctrl}${f.err ? `<div class="m-ferr">${ic('alert', 12)}${esc(f.err)}</div>` : f.hint && f.type !== 'upload' ? `<div class="m-fhint">${rich(f.hint)}</div>` : ''}</div>`;
    };
    return `<div ${attrs(n, 'm-form' + (n.card ? ' card' : ''))}>${n.title ? `<div class="m-form-title"><b>${esc(n.title)}</b>${n.sub ? `<span class="m-muted">${rich(n.sub)}</span>` : ''}</div>` : ''}${n.fields.map(field).join('')}${n.actions ? `<div class="m-form-actions">${btns(n.actions)}</div>` : ''}</div>`;
  };

  P.props = (n) => `<div ${attrs(n, 'm-props')}>${n.title ? `<div class="m-label">${esc(n.title)}${n.titleRight ? `<span>${cell(n.titleRight)}</span>` : ''}</div>` : ''}${n.rows.map((r) => r.sep ? '<div class="m-divider"></div>' : r.label ? `<div class="m-label">${esc(r.label)}</div>` : `<div class="m-prop"><span class="m-prop-k">${esc(r[0])}</span><span class="m-prop-v">${cell(r[1])}</span></div>`).join('')}</div>`;

  P.inspector = (n) => `<div ${attrs(n, 'm-inspector')}>${n.tabs ? R({ t: 'tabs', items: n.tabs, on: n.tabOn || 0, comp: false, cls: 'sm' }) : ''}${n.sections.map((s) => `<div class="m-insp-sec"><div class="m-insp-title"><b>${esc(s.title)}</b><span class="m-spacer"></span>${(s.icons || ['plus']).map((i) => ic(i, 13, 'm-faint')).join('')}</div>${(s.rows || []).map((r) => `<div class="m-insp-row" style="grid-template-columns:repeat(${r.length},1fr)">${r.map((f) => `<span class="m-insp-field">${f.sw ? sw(f.sw, 14) : f.k ? `<span class="m-faint">${esc(f.k)}</span>` : ''}${f.i ? ic(f.i, 13, 'm-faint') : ''}<span>${esc(f.v ?? '')}</span>${f.r ? `<span class="m-spacer"></span><span class="m-faint">${esc(f.r)}</span>` : ''}</span>`).join('')}</div>`).join('')}${s.html || ''}</div>`).join('')}</div>`;

  P.tree = P.layers = (n) => `<div ${attrs(n, 'm-tree')}>${n.title ? `<div class="m-label">${esc(n.title)}</div>` : ''}${n.items.map((it) => `<div class="m-tree-item${it.sel ? ' sel' : ''}${it.hover ? ' hover' : ''}" style="padding-left:${8 + (it.d || 0) * 16}px">${it.caret != null ? ic(it.caret ? 'down' : 'right', 11, 'm-faint') : '<span style="width:11px"></span>'}${it.i ? ic(it.i, 13, it.color ? '' : 'm-faint') : ''}<span>${esc(it.l)}</span>${it.r ? `<span class="m-spacer"></span><span class="m-faint sm">${esc(it.r)}</span>` : ''}</div>`).join('')}</div>`;

  // Figma-style canvas with frames, cursors, comment pins and prototype arrows
  const frameContent = (kind, accent) => {
    const bar = (w, h = 8, o = 0.18, c = '#000') => `<i style="width:${w}%;height:${h}px;background:${c};opacity:${o}"></i>`;
    if (kind === 'mobile') return `<div class="fz fz-col">${bar(40, 10, 0.7)}${bar(70)}<div class="fz-img" style="background:${accent}22"></div>${bar(90)}${bar(80)}${bar(60)}<div class="fz-btn" style="background:${accent}"></div></div>`;
    if (kind === 'mobile2') return `<div class="fz fz-col">${bar(55, 10, 0.7)}${[0, 1, 2, 3].map(() => `<div class="fz-li"><span style="background:${accent}33"></span><div>${bar(70)}${bar(45, 6, 0.1)}</div></div>`).join('')}<div class="fz-tabbar">${'<b></b>'.repeat(4)}</div></div>`;
    if (kind === 'mobile3') return `<div class="fz fz-col">${bar(30, 6, 0.2)}<div class="fz-big" style="color:${accent}">$2,480</div>${bar(50, 6, 0.15)}<div class="fz-chart" style="border-color:${accent}"></div>${bar(85)}${bar(70)}<div class="fz-btn" style="background:${accent}"></div></div>`;
    if (kind === 'web') return `<div class="fz fz-web"><div class="fz-nav">${bar(12, 8, 0.6)}<span style="flex:1"></span>${bar(6)}${bar(6)}${bar(6)}</div><div class="fz-hero">${bar(60, 18, 0.75)}${bar(45, 10, 0.2)}<div class="fz-btn sm" style="background:${accent}"></div></div><div class="fz-3">${'<div></div>'.repeat(3)}</div></div>`;
    if (kind === 'card') return `<div class="fz fz-col">${bar(50, 10, 0.6)}${bar(80)}${bar(65)}<div class="fz-btn" style="background:${accent}"></div></div>`;
    if (kind === 'icons') return `<div class="fz fz-icons">${Array.from({ length: 12 }, (_, i) => `<span style="background:${i % 3 ? '#0002' : accent}"></span>`).join('')}</div>`;
    return '';
  };
  P.canvas = (n) => {
    const accent = n.accent || '#7b61ff';
    const frames = (n.frames || []).map((f) => `<div class="m-frame${f.sel ? ' sel' : ''}${f.hover ? ' hover' : ''}" style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px"><div class="m-frame-label">${f.sel ? '' : ''}${esc(f.label || '')}</div><div class="m-frame-body" style="background:${f.fill || '#fff'}">${frameContent(f.kind, f.accent || accent)}</div>${f.sel ? '<b class="h tl"></b><b class="h tr"></b><b class="h bl"></b><b class="h br"></b>' : ''}${f.sel && f.size ? `<span class="m-frame-size">${esc(f.size)}</span>` : ''}</div>`).join('');
    const arrows = n.arrows ? `<svg class="m-arrows" width="100%" height="100%">${n.arrows.map((a) => `<path d="M${a[0]} ${a[1]} C ${a[0] + 60} ${a[1]}, ${a[2] - 60} ${a[3]}, ${a[2]} ${a[3]}" fill="none" stroke="${n.arrowColor || '#0d99ff'}" stroke-width="2"/><circle cx="${a[0]}" cy="${a[1]}" r="4" fill="${n.arrowColor || '#0d99ff'}"/><path d="M${a[2] - 8} ${a[3] - 5}l8 5-8 5" fill="none" stroke="${n.arrowColor || '#0d99ff'}" stroke-width="2"/>`).join('')}</svg>` : '';
    const pins = (n.pins || []).map((p) => `<span class="m-pin${p.on ? ' on' : ''}" style="left:${p.x}px;top:${p.y}px">${p.av ? av(p.av, 22) : esc(p.n)}</span>`).join('');
    const cursors = (n.cursors || []).map((c) => `<span class="m-cursor" style="left:${c.x}px;top:${c.y}px;color:${c.color}"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M1 1l5 14 2-6 6-2z" fill="currentColor" stroke="#fff" stroke-width="1"/></svg><b style="background:${c.color}">${esc(c.name)}</b></span>`).join('');
    return `<div ${attrs(n, 'm-canvas', n.dots === false ? '' : '')}>${arrows}${frames}${pins}${cursors}${kids(n)}</div>`;
  };

  P.toolbar = (n) => `<div ${attrs(n, 'm-toolbar' + (n.float ? ' float' : ''), n.float ? `left:${n.x ?? '50%'};${n.bottom != null ? `bottom:${n.bottom}px` : `top:${n.y}px`}` : '')}>${n.items.map((it) => it.sep ? '<span class="m-tool-sep"></span>' : `<span class="m-tool${it.on ? ' on' : ''}">${it.i ? ic(it.i, it.size || 17) : ''}${it.l ? `<span>${esc(it.l)}</span>` : ''}${it.caret ? ic('down', 10) : ''}</span>`).join('')}</div>`;

  P.calendar = (n) => {
    const days = n.days || 31; const start = n.start || 0;
    const avail = new Set(n.avail || []);
    const cells = Array.from({ length: start }, () => '<span></span>').concat(Array.from({ length: days }, (_, i) => { const d = i + 1; return `<span class="${avail.has(d) ? 'av' : ''}${d === n.sel ? ' sel' : ''}${d === n.today ? ' today' : ''}">${d}</span>`; }));
    return `<div ${attrs(n, 'm-cal')}><div class="m-cal-head"><b>${esc(n.month)}</b><span class="m-spacer"></span><span class="m-ibtn round">${ic('left', 14)}</span><span class="m-ibtn round on">${ic('right', 14)}</span></div><div class="m-cal-grid">${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => `<em>${d}</em>`).join('')}${cells.join('')}</div>${n.tz ? `<div class="m-cal-tz"><b>Time zone</b><span>${ic('globe', 13)}${esc(n.tz)}${ic('down', 12)}</span></div>` : ''}</div>`;
  };
  P.slots = (n) => `<div ${attrs(n, 'm-slots')}>${n.title ? `<div class="m-slots-title">${esc(n.title)}</div>` : ''}${n.times.map((t, i) => i === n.sel ? `<div class="m-slot-split"><span class="m-slot picked">${esc(t)}</span><span class="m-slot next">Next</span></div>` : `<span class="m-slot">${esc(t)}</span>`).join('')}</div>`;

  P.empty = (n) => `<div ${attrs(n, 'm-empty')}>${n.art ? `<div class="m-empty-art">${n.art}</div>` : `<div class="m-empty-icon">${ic(n.i || 'inbox', 26)}</div>`}<b>${esc(n.title)}</b><p>${rich(n.text || '')}</p><div class="m-btnrow">${btns(n.actions)}</div>${n.hint ? `<small class="m-muted">${rich(n.hint)}</small>` : ''}</div>`;

  P.stepper = (n) => `<div ${attrs(n, 'm-stepper' + (n.vertical ? ' v' : ''))}>${n.steps.map((s, i) => `<div class="m-step${i < n.on ? ' done' : i === n.on ? ' on' : ''}"><span class="m-step-n">${i < n.on ? ic('check', 12) : i + 1}</span><div><b>${esc(typeof s === 'string' ? s : s[0])}</b>${typeof s !== 'string' && s[1] ? `<small>${esc(s[1])}</small>` : ''}</div></div>`).join(n.vertical ? '' : '<span class="m-step-line"></span>')}</div>`;

  P.code = (n) => `<div ${attrs(n, 'm-codeblock')}>${n.title ? `<div class="m-code-head">${esc(n.title)}<span class="m-spacer"></span>${ic('copy', 13)}</div>` : ''}<pre>${n.lines.map((l, i) => `<span class="ln">${i + 1}</span>${esc(l).replace(/(&quot;.*?&quot;)/g, '<em>$1</em>')}`).join('\n')}</pre></div>`;

  P.logs = (n) => `<div ${attrs(n, 'm-logs')}>${n.rows.map((r, i) => `<div class="m-log${i === n.sel ? ' sel' : ''}"><span class="m-log-lvl l-${r[1]}"></span><span class="m-mono m-muted">${esc(r[0])}</span><span class="m-log-svc">${esc(r[2])}</span><span class="m-log-msg">${rich(r[3])}</span></div>`).join('')}</div>`;

  P.facets = (n) => `<div ${attrs(n, 'm-facets')}>${n.groups.map((g) => `<div class="m-facet"><div class="m-facet-title">${ic(g.open === false ? 'right' : 'down', 12)}<b>${esc(g.title)}</b></div>${g.open === false ? '' : g.items.map((it) => `<div class="m-facet-item">${cell({ check: !!it[2] })}${it[3] ? `<span class="m-dot" style="background:${it[3]}"></span>` : ''}<span>${esc(it[0])}</span><span class="m-spacer"></span><span class="m-muted m-num">${esc(it[1])}</span></div>`).join('')}</div>`).join('')}</div>`;

  P.checklist = (n) => `<div ${attrs(n, 'm-checklist')}><div class="m-cl-head"><div><b>${esc(n.title)}</b>${n.sub ? `<div class="m-muted sm">${esc(n.sub)}</div>` : ''}</div><span class="m-spacer"></span>${n.close !== false ? ic('x', 14, 'm-faint') : ''}</div>${n.done != null ? `<div class="m-cl-progress"><span>${n.done} of ${n.items.length} tasks complete</span><span class="m-bar"><i style="width:${n.done / n.items.length * 100}%"></i></span></div>` : ''}${n.items.map((it) => `<div class="m-cl-item${it.open ? ' open' : ''}${it.done ? ' done' : ''}"><span class="m-cl-check">${it.done ? ic('check', 11) : ''}</span><div class="m-cl-main"><b>${esc(it.l)}</b>${it.open && it.sub ? `<p>${rich(it.sub)}</p>${it.actions ? `<div class="m-btnrow">${btns(it.actions)}</div>` : ''}` : ''}</div>${it.open && it.art ? `<div class="m-cl-art" style="background:${it.art}"></div>` : ''}</div>`).join('')}</div>`;

  P.banner = (n) => `<div ${attrs(n, 'm-banner t-' + (n.tone || 'info') + (n.bar ? ' bar' : ''))}>${ic(n.i || ({ warn: 'alert', danger: 'alert', success: 'check' }[n.tone] || 'info'), 16)}<span>${rich(n.text)}</span><span class="m-spacer"></span>${btns(n.actions)}</div>`;

  P.progress = (n) => `<div ${attrs(n, 'm-progress')}>${n.l ? `<div class="m-progress-l"><span>${esc(n.l)}</span><span class="m-muted">${esc(n.r || '')}</span></div>` : ''}<span class="m-bar"><i style="width:${n.v * 100}%"></i></span></div>`;

  P.daterange = (n) => `<span ${attrs(n, 'm-daterange')}>${ic('calendar', 14)}<span>${esc(n.v)}</span>${n.compare ? `<span class="m-muted">${esc(n.compare)}</span>` : ''}${ic('down', 13, 'm-faint')}</span>`;

  P.preview = (n) => `<div ${attrs(n, 'm-preview')}>${n.label ? `<div class="m-preview-label">${ic('eye', 13)}${esc(n.label)}</div>` : ''}${kids(n)}</div>`;

  P.search = (n) => `<div ${attrs(n, 'm-searchbox' + (n.focus ? ' focus' : ''))}>${ic('search', 15)}<span class="${n.v ? '' : 'm-ph'}">${esc(n.v || n.ph || 'Search')}</span>${n.focus ? '<span class="m-caret-blink"></span>' : ''}<span class="m-spacer"></span>${n.k ? kbd(n.k) : ''}</div>`;

  /* Overlays (absolutely positioned within the screen body) */
  const posStyle = (n, defW) => {
    const s = [`width:${n.w || defW}px`];
    if (n.x != null) s.push(`left:${n.x}px`); else s.push(`left:50%;margin-left:-${(n.w || defW) / 2}px`);
    if (n.y != null) s.push(`top:${n.y}px`); else if (n.bottom != null) s.push(`bottom:${n.bottom}px`); else s.push('top:120px');
    if (n.h) s.push(`height:${n.h}px`);
    return s.join(';');
  };
  P.modal = (n) => `<div ${attrs({ ...n, w: undefined, h: undefined }, 'm-modal', posStyle(n, 560))}>${n.title ? `<div class="m-modal-head">${n.crumbs ? `<div class="m-crumbs sm">${n.crumbs.map((c, i) => `<span class="${i === n.crumbs.length - 1 ? 'cur' : ''}">${rich(c)}</span>`).join(ic('right', 11, 'm-faint'))}</div>` : `<div><b>${rich(n.title)}</b>${n.sub ? `<div class="m-muted sm">${rich(n.sub)}</div>` : ''}</div>`}<span class="m-spacer"></span>${(n.headIcons || []).map((i) => `<span class="m-ibtn">${ic(i, 15)}</span>`).join('')}<span class="m-ibtn">${ic('x', 16)}</span></div>` : ''}<div class="m-modal-body"${n.pad != null ? ` style="padding:${n.pad}px"` : ''}>${kids(n)}</div>${n.foot ? `<div class="m-modal-foot">${n.footLeft ? `<div class="m-inline">${n.footLeft.map(cell).join('')}</div>` : ''}<span class="m-spacer"></span>${btns(n.foot)}</div>` : ''}</div>`;

  P.drawer = (n) => `<div ${attrs({ ...n, w: undefined }, 'm-drawer ' + (n.side || 'right'), `width:${n.w || 440}px`)}><div class="m-drawer-head">${n.crumbs ? R({ t: 'breadcrumbs', items: n.crumbs, comp: false }) : `<b>${rich(n.title)}</b>`}<span class="m-spacer"></span>${(n.headIcons || []).map((i) => `<span class="m-ibtn">${ic(i, 15)}</span>`).join('')}<span class="m-ibtn">${ic('x', 16)}</span></div>${n.sub ? `<div class="m-drawer-sub">${rich(n.sub)}</div>` : ''}<div class="m-drawer-body">${kids(n)}</div>${n.foot ? `<div class="m-drawer-foot">${btns(n.foot)}</div>` : ''}</div>`;

  P.palette = (n) => `<div ${attrs({ ...n, w: undefined }, 'm-palette', posStyle(n, 640))}>${n.ctx ? `<div class="m-pal-ctx">${pill(n.ctx, 'gray')}</div>` : ''}<div class="m-pal-input">${ic(n.icon || 'search', 18)}<span class="${n.q ? '' : 'm-ph'}">${esc(n.q || n.ph || 'Type a command or search…')}</span><span class="m-caret-blink"></span>${n.scope ? `<span class="m-spacer"></span>${pill(n.scope, 'gray')}` : ''}</div>${n.groups.map((g) => `<div class="m-pal-group">${g.title ? `<div class="m-pal-title">${esc(g.title)}</div>` : ''}${g.items.map((it) => `<div class="m-pal-item${it.on ? ' on' : ''}">${it.st ? statusGlyph(it.st) : it.av ? av(it.av, 20) : it.logo ? `<span class="m-logo sm" style="background:${it.color || 'var(--m-accent)'}">${esc(it.logo)}</span>` : ic(it.i || 'arrow', 16)}<span>${rich(it.l)}</span>${it.sub ? `<span class="m-muted">${rich(it.sub)}</span>` : ''}<span class="m-spacer"></span>${it.k ? kbd(it.k) : ''}${it.on && n.enter ? ic('arrow', 14) : ''}</div>`).join('')}</div>`).join('')}${n.foot ? `<div class="m-pal-foot">${n.foot.map((f) => `<span>${kbd(f[0])}${esc(f[1])}</span>`).join('')}</div>` : ''}</div>`;

  P.menu = (n) => `<div ${attrs({ ...n, w: undefined }, 'm-menu', posStyle(n, 240))}>${n.search ? `<div class="m-menu-search">${ic('search', 13)}<span class="${n.searchV ? '' : 'm-ph'}">${esc(n.searchV || n.search)}</span>${n.searchV ? '<span class="m-caret-blink"></span>' : ''}</div>` : ''}${n.items.map((it) => it.sep ? '<div class="m-menu-sep"></div>' : it.head ? `<div class="m-menu-head">${esc(it.head)}</div>` : `<div class="m-menu-item${it.on ? ' on' : ''}${it.danger ? ' danger' : ''}">${it.st ? statusGlyph(it.st) : it.prio ? prioGlyph(it.prio) : it.av ? av(it.av, 18) : it.dot ? `<span class="m-dot" style="background:${it.dot}"></span>` : it.box ? `<span class="m-menu-box">${ic(it.box, 18)}</span>` : it.i ? ic(it.i, 15) : ''}<div class="m-menu-l"><span>${rich(it.l)}</span>${it.sub ? `<small>${rich(it.sub)}</small>` : ''}</div><span class="m-spacer"></span>${it.check ? ic('check', 14) : ''}${it.k ? kbd(it.k) : ''}${it.more ? ic('right', 12, 'm-faint') : ''}</div>`).join('')}</div>`;

  P.pop = (n) => `<div ${attrs({ ...n, w: undefined, h: undefined }, 'm-pop', posStyle(n, 360))}>${n.title ? `<div class="m-pop-head"><b>${esc(n.title)}</b><span class="m-spacer"></span>${btns(n.headActions)}</div>` : ''}${kids(n)}</div>`;

  P.toast = (n) => {
    const pos = n.pos || 'bl';
    const s = pos === 'bl' ? 'left:24px;bottom:24px' : pos === 'br' ? 'right:24px;bottom:24px' : pos === 'tr' ? 'right:24px;top:24px' : pos === 'tc' ? 'left:50%;transform:translateX(-50%);top:16px' : 'left:50%;transform:translateX(-50%);bottom:28px';
    return `<div ${attrs(n, 'm-toast t-' + (n.tone || 'dark'), s)}>${ic(n.i || 'check', 16, 'm-toast-ic')}<div><b>${rich(n.text)}</b>${n.sub ? `<small>${rich(n.sub)}</small>` : ''}</div>${n.action ? `<span class="m-toast-act">${esc(n.action)}</span>` : ''}${n.close !== false ? ic('x', 14, 'm-faint') : ''}</div>`;
  };

  P.tip = (n) => `<div ${attrs(n, 'm-tip', `left:${n.x}px;top:${n.y}px`)}>${esc(n.text)}${n.k ? kbd(n.k) : ''}</div>`;

  P.abs = (n) => `<div ${attrs(n, 'm-abs', `left:${n.x}px;top:${n.y}px;${n.wd ? `width:${n.wd}px;` : ''}`)}>${kids(n)}</div>`;

  function R(n) {
    if (n == null || n === false) return '';
    if (typeof n === 'string') return rich(n);
    const f = P[n.t];
    if (!f) { console.warn('Unknown node', n.t); return ''; }
    return f(n);
  }

  /* ---------- Shell (window chrome + theme) ---------- */
  const THEMES = {
    light: { bg: '#ffffff', panel: '#f7f7f8', side: '#f7f7f8', sideFg: '#3b3d42', fg: '#1d1e21', muted: '#6c6f76', faint: '#9b9ea6', border: '#e7e7ea', hover: '#efeff1', sel: '#e8e9fb', raised: '#ffffff', canvas: '#f3f3f5', accent: '#5e6ad2', accentFg: '#ffffff', danger: '#e5484d', c2: '#f2994a', c3: '#26b5a0', c4: '#c264d8', chrome: '#e9e9ec', font: 'var(--m-font-default)' },
    dark: { bg: '#18191b', panel: '#1f2023', side: '#141517', sideFg: '#c9cbd1', fg: '#e8e9ec', muted: '#8f939c', faint: '#686c75', border: '#2b2d31', hover: '#26282c', sel: '#2a2c45', raised: '#222327', canvas: '#121314', accent: '#7c86ff', accentFg: '#ffffff', danger: '#ff6369', c2: '#f5a524', c3: '#3dd6b0', c4: '#d084f0', chrome: '#0e0f10', font: 'var(--m-font-default)' },
  };

  function shell(spec) {
    const t = { ...THEMES[spec.theme || 'light'], ...(spec.vars || {}) };
    const vars = Object.entries(t).map(([k, v]) => `--m-${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`).join(';');
    let chrome = '';
    if (spec.chrome === 'browser') {
      chrome = `<div class="m-chrome browser"><div class="m-chrome-tabs"><span class="m-lights"><i></i><i></i><i></i></span><span class="m-btab on"><span class="m-fav" style="background:${t.accent}"></span>${esc(spec.tab || spec.title || '')}${ic('x', 11)}</span><span class="m-btab">${ic('plus', 12)}</span></div><div class="m-chrome-url">${ic('left', 14)}${ic('right', 14)}${ic('refresh', 13)}<span class="m-url">${ic('lock', 11)}${esc(spec.url || '')}</span>${ic('star', 13)}<span class="m-chrome-me"></span></div></div>`;
    } else if (spec.chrome === 'mac') {
      chrome = `<div class="m-chrome mac"><span class="m-lights"><i></i><i></i><i></i></span>${spec.nav !== false ? `<span class="m-mac-nav">${ic('left', 14)}${ic('right', 14)}</span>` : ''}<span class="m-mac-title">${esc(spec.title || '')}</span></div>`;
    }
    const overlays = (spec.overlays || []).map(R).join('');
    return `<div class="m-screen${spec.theme === 'dark' ? ' dark' : ''}" style="${vars}">${chrome}<div class="m-body">${R(spec.body)}${spec.dim ? `<div class="m-dim"${typeof spec.dim === 'number' ? ` style="opacity:${spec.dim}"` : ''}></div>` : ''}${overlays}</div></div>`;
  }

  // Walks a spec and returns the set of component ids it contains.
  function components(spec) {
    const out = new Set();
    const walk = (n) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) { n.forEach(walk); return; }
      if (n.t) {
        const c = n.comp === false ? null : n.comp || COMP_DEFAULT[n.t];
        if (c) out.add(c);
        if (n.t === 'topbar' && n.search) out.add('search');
        if (n.t === 'filters' && n.search) out.add('search');
        if (n.t === 'form' && n.fields.some((f) => f.type === 'upload' || (f.row || []).some((g) => g.type === 'upload'))) out.add('file-upload');
        if (n.t === 'topbar' && n.crumbs) out.add('breadcrumbs');
      }
      Object.values(n).forEach((v) => { if (v && typeof v === 'object') walk(v); });
    };
    walk(spec.body); walk(spec.overlays);
    return [...out];
  }

  window.MOCK = { render: shell, components, W, H, setLabeler: (fn) => { compLabel = fn; }, icon: ic };
})();
