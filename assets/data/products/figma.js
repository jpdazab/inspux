(function () {
  const vars = { accent: '#0d99ff', bg: '#ffffff', side: '#ffffff', panel: '#f5f5f5', fg: '#1e1e1e', muted: '#757575', faint: '#b3b3b3', border: '#e6e6e6', hover: '#f0f0f0', sel: '#e5f4ff', canvas: '#f5f5f5', font: "'Inter', -apple-system, sans-serif" };
  const purple = '#7b61ff';

  const layers = (sel) => ({ t: 'col', w: 240, bd: 'r', c: [
    { t: 'row', pad: '12px 12px 8px', align: 'center', gap: 8, c: [{ t: 'cell', v: { html: '<span class="m-logo" style="background:#1e1e1e">F</span>' } }, { t: 'col', flex: 1, c: [{ t: 'text', v: '**Checkout redesign**', size: 12.5 }, { t: 'text', v: 'Mobile app · Drafts', muted: true, size: 11 }] }, { t: 'cell', v: { i: 'sidebar' } }] },
    { t: 'tabs', comp: false, cls: 'sm', items: ['File', 'Assets'], on: 0 },
    { t: 'tree', title: 'Pages', comp: 'tree-view', items: [{ l: 'Cover' }, { l: 'Checkout v3', sel: true }, { l: 'Archive' }] },
    { t: 'divider' },
    { t: 'tree', title: 'Layers', items: [
      { i: 'frame', l: 'Cart', caret: false },
      { i: 'frame', l: 'Checkout', caret: true, sel: sel === 'checkout' },
      { i: 'type', l: 'Total', d: 1 }, { i: 'square', l: 'Order summary', d: 1, caret: false }, { i: 'component', l: 'Payment method', d: 1, color: 1 }, { i: 'component', l: 'Button / Primary', d: 1, color: 1, hover: sel === 'checkout' },
      { i: 'frame', l: 'Confirmation', caret: false },
      { i: 'frame', l: 'Web checkout', caret: false },
    ] },
  ] });

  const frames = (sel) => [
    { x: 70, y: 150, w: 210, h: 440, label: 'Cart', kind: 'mobile2' },
    { x: 340, y: 150, w: 210, h: 440, label: 'Checkout', kind: 'mobile3', sel: sel, size: sel ? '390 × 844' : '' },
    { x: 610, y: 150, w: 210, h: 440, label: 'Confirmation', kind: 'mobile' },
    { x: 70, y: 660, w: 750, h: 260, label: 'Web checkout', kind: 'web' },
  ];
  const cursors = [{ x: 470, y: 320, name: 'Lee Park', color: '#f24822' }, { x: 760, y: 520, name: 'Ana Silva', color: '#14ae5c' }];
  const toolbar = { t: 'toolbar', float: true, bottom: 18, items: [{ i: 'cursor', on: true, caret: true }, { i: 'frame', caret: true }, { i: 'square', caret: true }, { i: 'pen', caret: true }, { i: 'type' }, { i: 'chat' }, { sep: 1 }, { i: 'component' }, { i: 'code', l: 'Dev' }] };

  const rightTop = (mode) => ({ t: 'row', pad: '8px 10px', gap: 6, align: 'center', bd: 'b', c: [{ t: 'cell', v: { avs: ['Lee Park', 'Ana Silva', 'Rosa Diaz'], size: 22 } }, { t: 'spacer' }, { t: 'btns', items: [{ i: 'play', k: 'ghost', sm: 1 }, { l: 'Share', k: 'primary', sm: 1 }] }] });

  const designPanel = { t: 'inspector', tabs: ['Design', 'Prototype'], tabOn: 0, sections: [
    { title: 'Frame', icons: ['down'], rows: [[{ v: 'iPhone 14 & 15', r: '⌄' }]] },
    { title: 'Position', icons: [], rows: [[{ k: 'X', v: '340' }, { k: 'Y', v: '150' }], [{ i: 'refresh', v: '0°' }, { i: 'frame', v: 'Clip content' }]] },
    { title: 'Layout', icons: ['grid'], rows: [[{ k: 'W', v: '390' }, { k: 'H', v: '844' }], [{ i: 'list', v: 'Vertical' }, { i: 'sliders', v: '16' }], [{ k: 'Pad', v: '24' }, { k: '↕', v: '32' }]] },
    { title: 'Appearance', icons: ['eye'], rows: [[{ i: 'square', v: '100%' }, { i: 'circle', v: '28' }]] },
    { title: 'Fill', rows: [[{ sw: '#ffffff', v: 'FFFFFF', r: '100%' }]] },
    { title: 'Stroke', rows: [] },
    { title: 'Effects', rows: [[{ sw: '#00000022', v: 'Drop shadow' }]] },
    { title: 'Export', rows: [] },
  ] };

  const editor = (opts = {}) => ({ t: 'row', c: [
    layers('checkout'),
    { t: 'canvas', flex: 1, accent: purple, frames: frames(opts.sel !== false), cursors: opts.cursors === false ? [] : cursors, arrows: opts.arrows, pins: opts.pins, c: [toolbar] },
    { t: 'col', w: 260, bd: 'l', c: [rightTop(), opts.panel || designPanel] },
  ] });

  const files = { t: 'row', c: [
    { t: 'sidebar', w: 240, head: { logo: 'R', name: 'Rosa Diaz', color: '#9747ff' }, search: 'Search',
      sections: [
        { items: [{ i: 'clock', l: 'Recents', on: true }, { i: 'users', l: 'Community' }] },
        { title: 'Acme Design', items: [{ i: 'folder', l: 'Drafts' }, { i: 'grid', l: 'All projects' }, { i: 'trash', l: 'Trash' }] },
        { title: 'Starred', items: [{ i: 'star', l: 'Design system' }, { i: 'star', l: 'Checkout redesign' }] },
      ], foot: [{ i: 'plus', l: 'Create new team' }] },
    { t: 'col', flex: 1, c: [
      { t: 'topbar', title: 'Recents', h: 56, actions: [{ i: 'bell', k: 'ghost' }, { l: 'Import', k: 'secondary' }, { l: 'Create', i: 'plus', k: 'primary' }] },
      { t: 'col', flex: 1, pad: '20px 28px', gap: 18, c: [
        { t: 'row', gap: 10, align: 'center', c: [{ t: 'tabs', comp: 'tabs', style: 'pill', st: 'padding:0', items: ['Recently viewed', 'Shared files', 'Shared projects'], on: 0 }, { t: 'spacer' }, { t: 'filters', st: 'border:0;padding:0', items: [{ l: 'All organizations', caret: true }, { l: 'All files', caret: true }, { l: 'Last viewed', caret: true }] }, { t: 'seg', items: [{ i: 'grid' }, { i: 'list' }], on: 0 }] },
        { t: 'cards', cols: 4, items: [
          { cover: '#f1effd', coverHtml: '<div style="position:absolute;inset:18px 30px;display:flex;gap:10px"><div style="flex:1;background:#fff;border-radius:8px;box-shadow:0 1px 3px #0002"></div><div style="flex:1;background:#fff;border-radius:8px;box-shadow:0 1px 3px #0002"></div><div style="flex:1;background:#7b61ff;border-radius:8px"></div></div>', title: 'Checkout redesign', sub: 'Edited 12 minutes ago', meta: [{ avs: ['Lee Park', 'Ana Silva'], size: 18 }] , on: true },
          { cover: '#1e1e1e', coverHtml: '<div style="position:absolute;inset:22px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px">' + '<span style="background:#0d99ff;border-radius:4px"></span><span style="background:#14ae5c;border-radius:4px"></span><span style="background:#f24822;border-radius:4px"></span><span style="background:#ffcd29;border-radius:4px"></span><span style="background:#9747ff;border-radius:4px"></span><span style="background:#fff;border-radius:4px"></span>'.repeat(3) + '</div>', title: 'Design system', sub: 'Edited 2 hours ago', meta: [{ pill: 'Library', tone: 'purple' }] },
          { cover: '#e5f4ff', coverHtml: '<div style="position:absolute;left:24px;right:24px;top:24px;bottom:0;background:#fff;border-radius:8px 8px 0 0;box-shadow:0 1px 3px #0002"></div>', title: 'Marketing site 2026', sub: 'Edited yesterday', meta: [{ avs: ['Ana Silva'], size: 18 }] },
          { cover: '#fff4e5', coverHtml: '<div style="position:absolute;inset:26px;display:flex;flex-wrap:wrap;gap:8px"><span style="width:60px;height:40px;background:#ffcd29;border-radius:4px"></span><span style="width:60px;height:40px;background:#ff9e42;border-radius:4px"></span><span style="width:60px;height:40px;background:#fff;border-radius:4px"></span></div>', title: 'Q4 brainstorm', sub: 'FigJam · Edited 3 days ago', meta: [{ pill: 'FigJam', tone: 'amber' }] },
          { cover: '#f5f5f5', coverHtml: '<div style="position:absolute;left:24px;right:24px;top:24px;bottom:0;background:#fff;border-radius:8px 8px 0 0;box-shadow:0 1px 3px #0002"></div>', title: 'Onboarding flows', sub: 'Edited last week' },
          { cover: '#eefbf3', coverHtml: '<div style="position:absolute;left:24px;right:24px;top:24px;bottom:0;background:#fff;border-radius:8px 8px 0 0;box-shadow:0 1px 3px #0002"></div>', title: 'Mobile nav exploration', sub: 'Edited last week' },
          { cover: '#fdeeee', coverHtml: '<div style="position:absolute;left:24px;right:24px;top:24px;bottom:0;background:#fff;border-radius:8px 8px 0 0;box-shadow:0 1px 3px #0002"></div>', title: 'Pricing page tests', sub: 'Edited 2 weeks ago' },
          { cover: '#f1effd', coverHtml: '<div style="position:absolute;left:24px;right:24px;top:24px;bottom:0;background:#fff;border-radius:8px 8px 0 0;box-shadow:0 1px 3px #0002"></div>', title: 'Icon set v4', sub: 'Edited 3 weeks ago' },
        ] },
      ] },
    ] },
  ] };

  const protoPanel = { t: 'inspector', tabs: ['Design', 'Prototype'], tabOn: 1, sections: [
    { title: 'Flow starting point', rows: [[{ i: 'play', v: 'Checkout flow' }]] },
    { title: 'Interactions', rows: [[{ i: 'zap', v: 'On tap → Navigate to Confirmation' }]] },
    { title: 'Scroll behavior', icons: [], rows: [[{ v: 'Overflow: No scrolling', r: '⌄' }], [{ v: 'Position: Scroll with parent', r: '⌄' }]] },
    { title: 'Prototype settings', icons: [], rows: [[{ v: 'Device: iPhone 15 Pro', r: '⌄' }], [{ sw: '#f5f5f5', v: 'Background' }]] },
  ] };

  const commentsPanel = { t: 'col', flex: 1, comp: false, c: [
    { t: 'row', pad: '10px 12px', gap: 8, align: 'center', bd: 'b', c: [{ t: 'text', v: '**Comments**', size: 12.5 }, { t: 'spacer' }, { t: 'cell', v: { i: 'filter' } }, { t: 'cell', v: { i: 'search' } }] },
    { t: 'feed', pad: 12, gap: 10, items: [
      { comment: true, who: 'Lee Park', when: '12m', text: 'Can we show the delivery date above the total? Support says people ask about it a lot.' },
      { comment: true, who: 'Ana Silva', when: '8m', text: 'Payment method row needs 44px tap height. It is 36 now.' },
      { comment: true, who: 'Kai Moreno', when: '1h', text: 'Engineering note: Apple Pay button must use the system component.' },
    ] },
  ] };

  INSPUX.products.push({
    id: 'figma', name: 'Figma', industry: 'design', platform: 'desktop', url: 'https://www.figma.com', color: '#a259ff',
    tagline: 'Collaborative interface design: one shared canvas for design, prototyping, review and handoff.',
    summary: {
      overview: 'Figma made the design file a live, shared document. Everyone works on one infinite canvas, sees each other\'s cursors, and switches between Design, Prototype, Comment and Dev modes without exporting anything. The UI keeps the canvas central and puts dense controls in thin side panels.',
      structure: [
        'File browser: recents, drafts and team projects as thumbnail cards.',
        'Editor: layers and pages on the left, the canvas in the middle, and a context-sensitive properties panel on the right.',
        'A floating bottom toolbar holds creation tools. Modes (design, prototype, comments, dev) change the right panel, not the page.',
        'Multiplayer presence (avatars, cursors) and Share sit at the top of the right panel.',
      ],
      strengths: [
        'Real-time multiplayer removes file versions and handoff exports.',
        'The properties panel shows only what applies to the current selection, which keeps a powerful tool scannable.',
        'Comments are pinned to exact spots on the canvas, so feedback stays in context.',
        'Components and auto layout scale a design system across hundreds of files.',
      ],
      pains: [
        'Large files with many pages and variants get slow and memory-hungry.',
        'Dense, small controls (11px text, icon-only buttons) are hard for newcomers to learn.',
        'Comment threads pile up on the canvas and are hard to triage at scale.',
        'Prototyping arrows become a tangle in complex flows.',
      ],
    },
    screens: [
      { id: 'figma-files', title: 'File browser', desc: 'Recently viewed files as thumbnail cards, with team navigation, filters and a grid/list switch.', patterns: ['templates', 'global-search'],
        spec: { chrome: 'mac', vars, title: 'Figma', body: files } },
      { id: 'figma-editor', title: 'Design editor', desc: 'Layers on the left, canvas with live cursors in the middle, and the Design panel for the selected frame on the right.', patterns: ['contextual-inspector', 'real-time-presence', 'drag-and-drop'],
        spec: { chrome: 'mac', vars, title: 'Checkout redesign', body: editor() } },
      { id: 'figma-prototype', title: 'Prototype mode', desc: 'Connections between frames are drawn as arrows. Selecting one opens an interaction popover with trigger, action and animation.', patterns: ['contextual-inspector', 'live-preview'],
        spec: { chrome: 'mac', vars, title: 'Checkout redesign', body: editor({ arrows: [[550, 520, 610, 300], [280, 300, 340, 300]], cursors: false, panel: protoPanel }),
          overlays: [{ t: 'pop', x: 860, y: 260, w: 300, title: 'Interaction', headActions: [{ i: 'x', k: 'ghost', sm: 1 }], c: [
            { t: 'form', comp: false, fields: [{ type: 'select', v: 'On tap', lead: { i: 'cursor' } }, { type: 'select', v: 'Navigate to', lead: { i: 'arrow' } }, { type: 'select', v: 'Confirmation', lead: { i: 'frame' } }, { type: 'select', v: 'Smart animate', lead: { i: 'sparkle' } }, { row: [{ type: 'select', v: 'Ease out' }, { v: '300ms' }] }] },
          ] }] } },
      { id: 'figma-comments', title: 'Comment mode', desc: 'Comment pins sit on the exact spot they discuss. The right panel lists every thread, and an open thread shows replies inline.', patterns: ['inline-comments', 'threaded-conversation', 'real-time-presence'],
        spec: { chrome: 'mac', vars, title: 'Checkout redesign', body: { t: 'row', c: [
          layers('checkout'),
          { t: 'canvas', flex: 1, accent: purple, frames: frames(false), pins: [{ x: 500, y: 200, av: 'Lee Park', on: true }, { x: 470, y: 470, av: 'Ana Silva' }, { x: 790, y: 690, n: '3' }], c: [{ ...toolbar, items: toolbar.items.map((it) => (it.i === 'chat' ? { ...it, on: true } : { ...it, on: false })) }] },
          { t: 'col', w: 260, bd: 'l', c: [rightTop(), commentsPanel] },
        ] },
          overlays: [{ t: 'pop', x: 735, y: 160, w: 300, comp: 'popover', c: [
            { t: 'feed', comp: false, items: [{ comment: true, who: 'Lee Park', when: '12m', text: 'Can we show the delivery date above the total? Support says people ask about it a lot.' }, { comment: true, who: 'Rosa Diaz', when: 'now', text: 'Good call. Moving it under the address block.' }] },
            { t: 'form', comp: false, fields: [{ ph: 'Reply', trail: { i: 'send' } }] },
          ] }] } },
    ],
    flows: [{
      id: 'figma-review-flow', name: 'Take a design from canvas to review', goal: 'Open a file, wire up the prototype and collect feedback from the team.',
      steps: [
        { screen: 'figma-files', note: 'The file browser opens on Recents. Thumbnails make files recognizable at a glance; avatars show who else is active.' },
        { screen: 'figma-editor', note: 'Selecting the Checkout frame fills the right panel with its layout, fill and effects. Teammates\' cursors show where they are working.' },
        { screen: 'figma-prototype', note: 'In Prototype mode, connections are dragged from frame to frame. The interaction popover sets trigger, destination and animation.' },
        { screen: 'figma-comments', note: 'Reviewers drop comment pins on exact elements. Threads open in place and the right panel lists all of them.' },
      ],
      friction: 'Switching to the Prototype tab hides design properties, and the connection arrows overlap frames. On busy pages, finding which arrow belongs to which hotspot is slow.',
    }],
  });
})();
