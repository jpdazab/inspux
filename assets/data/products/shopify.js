(function () {
  const vars = { accent: '#303030', accentFg: '#ffffff', bg: '#f1f1f1', raised: '#ffffff', side: '#ebebeb', sideFg: '#303030', sideSel: '#fafafa', fg: '#303030', muted: '#616161', faint: '#8a8a8a', border: '#e3e3e3', hover: '#f7f7f7', panel: '#f7f7f7', sel: '#f1f1f1', th: '#f7f7f7', c2: '#29845a', font: "'Inter', -apple-system, 'Segoe UI', sans-serif" };
  const browser = (title, url) => ({ chrome: 'browser', vars, tab: title, url: 'admin.shopify.com/store/acme-goods/' + url });

  const top = { t: 'topbar', h: 56, bg: '#1a1a1a', st: 'color:#e3e3e3;border-bottom:0', title: 'shopify', center: true, search: 'Search', searchK: '⌘ K', actions: [{ i: 'sparkle', k: 'ghost', style: 'color:#e3e3e3' }, { i: 'bell', k: 'ghost', style: 'color:#e3e3e3' }, { l: 'Acme Goods', k: 'ghost', style: 'color:#e3e3e3', caret: true }] };
  const saveBar = { t: 'banner', comp: 'banner', tone: 'dark', bar: true, i: 'alert', st: 'height:56px;padding:0 24px;font-weight:600', text: 'Unsaved product', actions: [{ l: 'Discard', sm: 1 }, { l: 'Save', k: 'primary', sm: 1 }] };

  const sidebar = (on) => ({ t: 'sidebar', w: 240, st: 'border-right:0',
    sections: [
      { items: [{ i: 'home', l: 'Home', on: on === 'home' }, { i: 'inbox', l: 'Orders', n: 14, on: on === 'orders' }, { i: 'tag', l: 'Products', on: on === 'products' }, { i: 'users', l: 'Customers' }, { i: 'doc', l: 'Content' }, { i: 'chart', l: 'Analytics' }, { i: 'megaphone', l: 'Marketing' }, { i: 'percent', l: 'Discounts' }] },
      { title: 'Sales channels', items: [{ i: 'store', l: 'Online Store' }, { i: 'card', l: 'Point of Sale' }] },
      { title: 'Apps', items: [{ i: 'plus', l: 'Add apps' }] },
    ], foot: [{ i: 'settings', l: 'Settings' }] });

  const shell = (on, main, bar) => ({ t: 'col', c: [bar || top, { t: 'row', flex: 1, c: [sidebar(on), { t: 'scroll', flex: 1, st: 'border-radius:12px 0 0 0;background:var(--m-bg)', c: [main] }] }] });
  const card = (c, extra = {}) => ({ t: 'col', gap: 12, st: 'background:var(--m-raised);border-radius:12px;padding:16px;box-shadow:0 1px 0 rgba(0,0,0,.07),inset 0 0 0 1px rgba(0,0,0,.05)', c, ...extra });

  const home = { t: 'col', pad: '20px 36px', gap: 16, st: 'max-width:1000px;margin:0 auto;width:100%', c: [
    { t: 'row', gap: 8, align: 'center', c: [{ t: 'daterange', v: 'Today' }, { t: 'cell', v: { btn: { l: 'All channels', sm: 1, caret: true } } }, { t: 'spacer' }, { t: 'cell', v: { pill: '3 live visitors', tone: 'green', dot: 1 } }] },
    { t: 'kpis', st: 'background:var(--m-raised);border-radius:12px', plain: true, seed: 8, items: [{ l: 'Sessions', v: '1,284', d: '+12%' }, { l: 'Total sales', v: '$3,920', d: '+8%', on: true }, { l: 'Orders', v: '41', d: '+5%' }, { l: 'Conversion rate', v: '3.2%', d: '-0.4%', trend: -0.2 }] },
    { t: 'checklist', title: 'Setup guide', sub: 'Use this guide to get your store up and running.', done: 2, items: [
      { l: 'Add your first product', open: true, sub: 'Write a description, add photos, and set pricing for the products you plan to sell.', actions: [{ l: 'Add product', k: 'primary', sm: 1 }, { l: 'Import products', sm: 1 }], art: 'linear-gradient(135deg,#d9f2e6,#bfe3f5)' },
      { l: 'Customize your online store', done: true },
      { l: 'Add a custom domain', done: true },
      { l: 'Set up payments' },
      { l: 'Review your shipping rates' },
    ] },
    { t: 'cards', cols: 2, items: [
      { i: 'megaphone', title: 'Run your first campaign', sub: 'Reach customers with Shopify Email. 10,000 free emails a month.', actions: [{ l: 'Create campaign', sm: 1 }] },
      { i: 'card', title: 'Accept in-person payments', sub: 'Sell at pop-ups and markets with Shopify POS.', actions: [{ l: 'Learn more', sm: 1 }] },
    ] },
  ] };

  const productForm = (filled) => ({ t: 'col', pad: '20px 36px', gap: 16, st: 'max-width:1000px;margin:0 auto;width:100%', c: [
    { t: 'row', gap: 8, align: 'center', c: [{ t: 'cell', v: { btn: { i: 'back', k: 'ghost', sm: 1 } } }, { t: 'text', v: filled ? '**Linen Throw Blanket**' : '**Add product**', size: 20 }, ...(filled ? [{ t: 'cell', v: { pill: 'Draft', tone: 'gray' } }] : [])] },
    { t: 'row', gap: 16, align: 'flex-start', c: [
      { t: 'col', flex: 2, gap: 16, c: [
        card([{ t: 'form', comp: 'form', fields: [
          { l: 'Title', v: filled ? 'Linen Throw Blanket' : '', ph: 'Short sleeve t-shirt', focus: !filled },
          { l: 'Description', type: 'textarea', h: 110, v: filled ? 'Stonewashed European linen, woven in Portugal. Soft from the first use and gets softer with every wash. 130 × 170 cm.' : '' },
          { l: 'Media', type: 'upload', v: filled ? '**3 images** · Drag to reorder' : 'Upload new · **Select existing**', hint: 'Accepts images, videos, or 3D models' },
          { l: 'Category', type: 'select', v: filled ? 'Home & Garden › Linens › Blankets' : '', ph: 'Choose a product category' },
        ] }]),
        card([{ t: 'text', v: '**Pricing**' }, { t: 'form', comp: false, fields: [
          { row: [{ l: 'Price', type: 'money', v: filled ? '89.00' : '0.00' }, { l: 'Compare-at price', type: 'money', v: filled ? '110.00' : '0.00' }] },
          { type: 'check', l: 'Charge tax on this product', v: true },
          { row: [{ l: 'Cost per item', type: 'money', v: filled ? '31.50' : '' }, { l: 'Profit', type: 'static', v: filled ? '$57.50' : '--' }, { l: 'Margin', type: 'static', v: filled ? '64.6%' : '--' }] },
        ] }]),
        card([{ t: 'text', v: '**Inventory**' }, { t: 'form', comp: false, fields: [{ type: 'check', l: 'Track quantity', v: true }, { row: [{ l: 'Quantity · Shop location', v: filled ? '120' : '0' }, { l: 'SKU (Stock Keeping Unit)', v: filled ? 'LIN-THR-OAT' : '' }] }] }]),
      ] },
      { t: 'col', flex: 1, gap: 16, c: [
        card([{ t: 'form', comp: false, fields: [{ l: 'Status', type: 'select', v: filled ? 'Draft' : 'Active' }] }]),
        card([{ t: 'text', v: '**Publishing**' }, { t: 'props', comp: false, rows: [['Online Store', { pill: 'Visible', tone: 'green' }], ['Point of Sale', { pill: 'Hidden', tone: 'gray' }]] }]),
        card([{ t: 'text', v: '**Product organization**' }, { t: 'form', comp: false, fields: [{ l: 'Type', v: filled ? 'Blanket' : '' }, { l: 'Vendor', v: filled ? 'Acme Goods' : '' }, { l: 'Collections', type: 'select', v: filled ? 'Bedroom, New arrivals' : '' }, { l: 'Tags', type: filled ? 'chips' : 'text', opts: ['linen', 'gift'], ph: filled ? '' : 'Add tags' }] }]),
      ] },
    ] },
  ] });

  const orders = { t: 'col', pad: '20px 28px', gap: 14, c: [
    { t: 'row', gap: 8, align: 'center', c: [{ t: 'h', text: 'Orders', size: 20 }, { t: 'spacer' }, { t: 'btns', items: [{ l: 'Export', sm: 1 }, { l: 'More actions', sm: 1, caret: true }, { l: 'Create order', k: 'primary', sm: 1 }] }] },
    { t: 'kpis', plain: true, st: 'background:var(--m-raised);border-radius:12px', seed: 14, items: [{ l: 'Orders', v: '284', d: '+9%' }, { l: 'Items ordered', v: '512', d: '+11%' }, { l: 'Returns', v: '$318', d: '-12%', trend: -0.3 }, { l: 'Fulfilled', v: '231', d: '+6%' }] },
    card([
      { t: 'tabs', st: 'padding:0;margin:-6px 0 0', style: 'pill', items: ['All', 'Unfulfilled', 'Unpaid', 'Open', 'Archived'], on: 1, add: true, right: [{ i: 'search', sm: 1 }, { i: 'sort', sm: 1 }] },
      { t: 'table', check: true, dense: true, cols: ['Order', 'Date', 'Customer', 'Channel', { l: 'Total', r: 1 }, 'Payment status', 'Fulfillment status', 'Items', 'Delivery method'], rows: [
        [{ b: '#1047' }, 'Today at 10:12 am', 'Maya Chen', 'Online Store', '$89.00', { pill: 'Paid', tone: 'gray', dot: 1 }, { pill: 'Unfulfilled', tone: 'amber', dot: 1 }, '1 item', 'Standard'],
        [{ b: '#1046' }, 'Today at 9:40 am', 'Jonas Weber', 'Online Store', '$214.00', { pill: 'Paid', tone: 'gray', dot: 1 }, { pill: 'Unfulfilled', tone: 'amber', dot: 1 }, '3 items', 'Express'],
        [{ b: '#1045' }, 'Today at 8:05 am', 'Grace Kim', 'Point of Sale', '$46.00', { pill: 'Paid', tone: 'gray', dot: 1 }, { pill: 'Fulfilled', tone: 'gray', dot: 1 }, '2 items', 'Pickup'],
        [{ b: '#1044' }, 'Yesterday at 6:31 pm', 'Leo Martins', 'Online Store', '$129.00', { pill: 'Payment pending', tone: 'amber', dot: 1 }, { pill: 'Unfulfilled', tone: 'amber', dot: 1 }, '1 item', 'Standard'],
        [{ b: '#1043' }, 'Yesterday at 2:18 pm', 'Omar Haddad', 'Online Store', '$302.50', { pill: 'Partially refunded', tone: 'gray', dot: 1 }, { pill: 'Fulfilled', tone: 'gray', dot: 1 }, '4 items', 'Standard'],
        [{ b: '#1042' }, 'Oct 7 at 11:02 am', 'Nina Rossi', 'Online Store', '$89.00', { pill: 'Paid', tone: 'gray', dot: 1 }, { pill: 'In progress', tone: 'blue', dot: 1 }, '1 item', 'Express'],
        [{ b: '#1041' }, 'Oct 7 at 9:47 am', 'Ana Silva', 'Online Store', '$178.00', { pill: 'Paid', tone: 'gray', dot: 1 }, { pill: 'Fulfilled', tone: 'gray', dot: 1 }, '2 items', 'Standard'],
      ] },
    ], { st: 'background:var(--m-raised);border-radius:12px;padding:12px 4px 0;box-shadow:0 1px 0 rgba(0,0,0,.07),inset 0 0 0 1px rgba(0,0,0,.05)' }),
  ] };

  INSPUX.products.push({
    id: 'shopify', name: 'Shopify', industry: 'ecommerce', platform: 'web', url: 'https://www.shopify.com', color: '#008060',
    tagline: 'Commerce platform for running an online store, point of sale and orders from one admin.',
    summary: {
      overview: 'The Shopify admin is built on Polaris, a design system tuned for merchants who are not designers or developers. Pages follow a strict layout: a primary column for content and a narrow secondary column for status and organization. A setup guide leads new merchants from an empty store to a first sale.',
      structure: [
        'A dark top bar with global search and store switcher; a light sidebar for Orders, Products, Customers, Analytics, Marketing and sales channels.',
        'Content sits in rounded cards on a grey canvas, with a wide main column and a narrow side column.',
        'Index pages: tabs for saved views, a table with status badges, and bulk actions on selection.',
        'Forms use a contextual save bar that replaces the top bar when there are unsaved changes.',
      ],
      strengths: [
        'The setup guide turns a blank store into a sequence of concrete tasks with progress.',
        'The contextual save bar makes unsaved state impossible to miss and keeps Save in one place.',
        'Inline calculations (profit, margin) answer the merchant\'s real question while they type.',
        'Consistent two-column page layout means every form is learnable after the first.',
      ],
      pains: [
        'Many features live in apps, so the admin and app UIs feel inconsistent.',
        'Product variants and options get unwieldy for large catalogs.',
        'Settings are spread over many pages that are hard to find without search.',
        'Analytics and reports are basic compared to dedicated tools.',
      ],
    },
    screens: [
      { id: 'shopify-home', title: 'Home with setup guide', desc: 'Sales KPIs for today and a setup guide checklist with progress, where the open task shows its actions and an illustration.', patterns: ['onboarding-checklist', 'dashboard-overview', 'empty-state'],
        spec: { ...browser('Home · Acme Goods · Shopify', 'home'), body: shell('home', home) } },
      { id: 'shopify-product-new', title: 'Add product', desc: 'An empty product form: main column for title, description, media, pricing and inventory; side column for status, publishing and organization.', patterns: ['progressive-disclosure'],
        spec: { ...browser('Add product · Shopify', 'products/new'), body: shell('products', productForm(false)) } },
      { id: 'shopify-product-filled', title: 'Unsaved changes bar', desc: 'With unsaved changes the top bar turns into a save bar with Discard and Save. Profit and margin are calculated as the merchant types.', patterns: ['contextual-save-bar', 'inline-editing'],
        spec: { ...browser('Linen Throw Blanket · Shopify', 'products/new'), body: shell('products', productForm(true), saveBar) } },
      { id: 'shopify-orders', title: 'Orders index', desc: 'Order KPIs over a table with saved-view tabs, payment and fulfillment status badges, and channel and delivery columns.', patterns: ['saved-views', 'status-workflow', 'bulk-actions'],
        spec: { ...browser('Orders · Shopify', 'orders'), body: shell('orders', orders) } },
    ],
    flows: [{
      id: 'shopify-first-product-flow', name: 'Add the first product', goal: 'Take a new merchant from the setup guide to a saved product.',
      steps: [
        { screen: 'shopify-home', note: 'The setup guide shows 2 of 5 tasks done and opens the next one with a clear Add product button.' },
        { screen: 'shopify-product-new', note: 'The empty form uses placeholder examples. Status defaults to Active, and publishing to the Online Store is on.' },
        { screen: 'shopify-product-filled', note: 'As soon as anything changes, the save bar replaces the top bar. Profit and margin appear when cost is entered.' },
      ],
      friction: 'Status defaults to Active, so a half-finished product can go live on Save. Many merchants only notice when a customer sees it.',
    }],
  });
})();
