# Inspux

A design and product inspiration library of desktop SaaS screens. Every screen is a hand-built HTML recreation (not a screenshot), broken down into:

- **Screens**: 48 desktop screens from 12 products in 12 industries, with search and faceted filters (industry, platform, patterns, components)
- **User flows**: 13 step-by-step flows, with notes on each step and the main friction point
- **Patterns**: 30 UX patterns (command palette, saved views, wizard, contextual save bar…) with when to use them and what to watch out for
- **Components**: 44 UI components (filters, forms, drawers, modals, tables…) shown in context, outlined on every example
- **UX summary** per product: structure, strengths and pain points
- **Zoom viewer**: scroll/drag to pan, Ctrl/⌘ + scroll or pinch to zoom, double-click for 1:1, and a "Components" toggle that outlines and labels every component on the screen

| Product | Industry | Platform |
| --- | --- | --- |
| Linear | Project management | Desktop app |
| Notion | Docs & knowledge | Desktop app |
| Figma | Design tools | Desktop app |
| Slack | Team communication | Desktop app |
| Stripe | Payments & fintech | Web app |
| HubSpot | CRM & sales | Web app |
| Amplitude | Product analytics | Web app |
| Rippling | HR & payroll | Web app |
| Intercom | Customer support | Web app |
| Shopify | E-commerce | Web app |
| Datadog | Observability & DevOps | Web app |
| Calendly | Scheduling | Web app |

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

It also works as-is on GitHub Pages or any static host.

## How it works

```
index.html                  page shell, loads everything below
assets/mockup.js            renders a screen spec (a tree of plain objects) to HTML on a 1440×900 canvas
assets/mockup.css           styles for the mockup primitives
assets/app.js               routing, search and filters, product/flow/pattern/component pages, zoom viewer
assets/styles.css           site styles (light and dark)
assets/data/taxonomy.js     pattern, component and industry definitions
assets/data/products/*.js   one file per product: UX summary, screens and flows
```

Each screen is described with layout primitives such as `sidebar`, `topbar`, `filters`, `table`, `kanban`, `chart`, `form`, `drawer`, `modal` and `palette`. Every primitive tags itself with a component id, so the component index and the viewer outlines are generated from the specs automatically. Patterns are assigned by hand per screen.

### Add a product

1. Create `assets/data/products/<id>.js` that calls `INSPUX.products.push({...})` (copy an existing file as a template).
2. Add a `<script>` tag for it in `index.html`.
3. Use pattern and component ids from `assets/data/taxonomy.js`, or add new ones there.

## Disclaimer

Screens are recreations made for study. Layouts, copy and data are illustrative and may differ from the live products. Product names and trademarks belong to their owners; this project is not affiliated with any of them.
