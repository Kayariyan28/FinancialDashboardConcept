---
name: spatial-analytics-platform
description: >
  Rebuild an advanced product-grade analytics platform in the RevMoney mold:
  dark operational chrome, self-explaining KPI cards, interactive sparklines,
  date-range filters, and a first-class honeycomb heatmap driven by real
  hexagonal binning (cube round, axial floor, D3 offset). Use when the brief
  is a financial dashboard, revenue map, ops console, spatial heatmap, or
  "vibe-code an advanced analytics site like RevMoney." Triggers: dashboard,
  analytics, KPI, honeycomb, hexbin, heatmap, fintech UI, revenue map,
  spatial analytics, rebuild RevMoney.
metadata:
  short-description: "RevMoney-class analytics: KPIs, hover craft, hex binning, dark chrome"
  reference: https://github.com/Kayariyan28/FinancialDashboardConcept
  live: https://karanrevmoney.grok.me
user-invocable: true
---

# Spatial analytics platform (RevMoney pattern)

Build a **demo-complete analytics product**, not a chart collage. The reference
implementation is [RevMoney](https://karanrevmoney.grok.me)
([source](https://github.com/Kayariyan28/FinancialDashboardConcept)).

This skill is the rebuild brief. Follow it in order. Pair with `design-ui`
for tokens/anti-slop. Do not invent a second visual language.

**Read on demand (this folder):**
- `references/hex-binning.md` — cube / axial-floor / offset-row math
- `references/hover-craft.md` — why portaled tooltips loop, and the CSS fix

---

## 0. Product thesis (do not skip)

Every surface must defend one of these:

1. **Numbers explain themselves.** A KPI is a billboard until hover (or tap)
   reveals definition, prior period, delta, and a sparkline. The readout must
   *leave* when the pointer leaves.
2. **Geography is a first-class chart.** Place is not a table column. Bin
   events onto a honeycomb. Hexes tessellate; squares leave dead corners.
3. **Algorithms are visible.** Do not paint a heatmap. Bin real (or seeded)
   points. Let the user switch cube-round / axial-floor / offset-rows and
   watch the city change.
4. **Dark, quiet, one accent.** Charcoal ground, ice→navy hex scale, one
   income blue. No decorative gradients. Motion is short and reversible.

If a request is "analytics dashboard" without a spatial idea, still ship
thesis 1 + 4. Add the honeycomb when the domain has place, territory,
cells, or intensity.

---

## 1. Scope of a complete rebuild

Ship all of this in the first vertical slice. A scaffold with TODOs is a miss.

| Surface | Job |
| --- | --- |
| App chrome | Wordmark, 4-item nav, notices, account chip. One header, not a leftover sidebar. |
| Dashboard | 3 KPI cards (value + delta + sparkline + hover definition). Honeycomb as the hero. One supporting chart. One activity list. |
| Heatmap | SVG honeycomb, hover tooltip (district, swatch, amount, count), crosshairs, legend, minimap, binning controls. |
| Analytics | Date-range filters (week / month / 90d / year / custom) that recompute every chart and table. |
| Breakdown | Sortable table with inline sparklines. |
| Offline data | Seeded generator. App works with no network. |
| Identity | Distinct name, SVG favicon, OG card. Rename everywhere — never leave a previous product name in chrome or screenshots. |

Optional, not required for the concept: auth, real Postgres, billing.

---

## 2. Stack (match unless the user names another)

| Layer | Choice | Why |
| --- | --- | --- |
| App | React + TanStack Start (or Vite + TanStack Router) | File routes, SSR-safe |
| Style | Tailwind v4, tokens in `@theme` | One source of truth |
| Charts | Recharts for cartesian; **custom SVG** for hex | Recharts cannot do honest hexbin |
| Icons | `lucide-react` | No emoji-as-icon |
| Motion | CSS transitions 150–250ms | No JS spring libraries for chrome |
| Data | Seeded TS module (`mulberry32`) | Deterministic, offline |

Reference files in this repo:

```
src/styles.css                  tokens, hover motion, hex scale
src/lib/data.ts                 seeded series, KPIs, filters
src/lib/honeycomb.ts            events, pixel↔axial, cube/floor/offset
src/components/kpi-tip.tsx      CSS group-hover definition panel
src/components/sparkline.tsx    interactive SVG sparkline
src/components/honeycomb-map.tsx heatmap + algorithm explorer
src/components/analytics-view.tsx date filters + tabbed charts
src/components/breakdown-table.tsx
src/routes/dashboard.tsx
```

---

## 3. Visual system (copy these constraints)

Define tokens **before** any JSX color. Ban raw hex in components.

```css
@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --color-background: #0c0c0e;
  --color-foreground: #f3f3f5;
  --color-card: #141416;
  --color-card-2: #1a1a1d;
  --color-muted: #8c8c94;
  --color-border: #26262b;
  --color-income: #6d8cff;       /* sole accent */
  --color-positive: #3aa272;
  --color-negative: #d45d6a;
  --shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.06);
  --radius-2xl: 1.5rem;
}
```

Hex intensity is a **named scale**, not ad-hoc fills:

`--color-hex-0` charcoal (empty) → `--color-hex-1` ice white → `--color-hex-11` navy.

Rules:

- ≤ 5 hues in the chrome. The hex scale is one hue, eleven steps.
- One typeface. Tabular numerals on every money/percent.
- Cards: `rounded-2xl bg-card shadow-border`. Hover lifts `-translate-y-0.5`.
- Header is a floating bar (`h-14` / `h-16`, `rounded-2xl bg-header`), not a 240px sidebar unless the brief is explicitly a dense IDE.
- Mobile 390px first: no horizontal overflow; tap targets ≥ 40–44px; legend can become a horizontal chip row.

---

## 4. Information architecture

```
/                Analytics (filters + charts + table)
/dashboard       Snapshot KPIs + honeycomb hero
/accounts        Object list with sparklines
/cards           Supporting objects
```

Dashboard grid:

```
[ wordmark ………… nav ………… account ]
[ KPI ] [ KPI ] [ KPI ]
[          honeycomb heatmap           ]
[  trend chart     |  accounts list    ]
[          recent activity             ]
```

Do not hide the honeycomb below the fold on desktop. It is the product.

---

## 5. KPI cards (non-negotiable)

Each card shows: label, big tabular value, delta badge, sparkline.

On hover/focus: a **definition panel** (title, one-line meaning, comparison
rows, optional hint). Implement with **CSS group-hover**, not a portaled
Radix popover.

Hard lessons from this build — treat as law:

- Do **not** portal the tip. A portal under a stationary cursor fires
  `mouseleave` on the trigger and never `mouseenter` on the content →
  open/close loop, "stuck black" overlay.
- Do **not** use focus-trap / `onFocus`/`onBlur` to drive hover.
- Keep the panel in the DOM; hide with `opacity` + `pointer-events: none`.
- Enter ~40ms, leave ~60–140ms delay so the pointer can cross the gap.
- Position with **inline styles** (`top: calc(100% + 12px)`), not dynamic
  Tailwind class strings (`bottom-full`) that the compiler will drop.
- Dashboard cards: `side="bottom"` so the panel does not clip the header.
- Parent grids: `overflow-visible`.
- Hovered card `z-20` so its tip stacks over siblings.

See `references/hover-craft.md` and `src/components/kpi-tip.tsx`.

---

## 6. Sparklines

Custom SVG, not a chart-library sparkline.

- Path + optional area fill in the accent token.
- Pointer scrub → active dot + value readout.
- `useId()` for clip/gradient ids (many sparks on one page).
- Empty/single-point: render nothing, don't crash.
- Color from tokens (`var(--color-income)` / expense). Never a raw hex.

Reference: `src/components/sparkline.tsx`.

---

## 7. Date-range filters

One `Filters` object drives **every** derived view:

```ts
type Filters = { year: number; from: string; to: string; tab: string };
```

Presets: This week, This month, Last 90 days, This year, Custom, plus a
year switcher. Changing year resets `from`/`to`. Recompute KPIs, series,
transactions, and heatmap seed from the same object. No local-only copies
of "current range."

Format money with a shared `formatCurrency` / `formatPct`. Deltas compare
to the **equal-length prior window**, not "vs yesterday" unless asked.

---

## 8. Honeycomb heatmap (the distinctive surface)

### 8.1 Data, not decoration

1. Seed **events** (x, y, value, district) as gaussian clusters around
   named places. ~1.5k–2.5k points. Deterministic RNG.
2. Project each event → axial `(q, r)` with the active algorithm.
3. Aggregate per hex: `count`, `sum`, `mean`.
4. Color occupied hexes by percentile of the active aggregation.
5. Add a **1-ring charcoal fringe** of empty neighbors so the city has an
   edge. Do not flood a huge empty disk — the blob will look lost.

### 8.2 Algorithms (all three, switchable)

| id | Use |
| --- | --- |
| `cube` | Default. Nearest hex. Equal area. |
| `axial-floor` | Teaching contrast — outline shears. |
| `d3-offset` | Cheap even-r / even-q shortcut. |

Also ship: **pointy / flat** orientation, **bin size** 7–14, **sum / mean /
count**, **show source points**. Caption the active algorithm in one sentence
on the map (`BIN_ALGOS[].blurb`).

Math: `references/hex-binning.md`. Code: `src/lib/honeycomb.ts`.

### 8.3 Interaction chrome

Match the reference heatmap, adapted to the product (revenue, not noise dB):

- Header: title + live status pill + range select
- Coordinates + timestamp that follow the active cell
- Dashed crosshairs on the active hex
- Tooltip: district, color swatch, formatted value, deal count / average.
  CSS-positioned inside the map (same hover rules as KPIs). Flip below the
  cell when it would clip the top.
- Floating legend (click a band to isolate). Horizontal chips on mobile.
- Mini-map, bottom-left, with a dot on the selection
- Default selection: a mid-intensity cell in the primary district (Midtown
  in the reference), so the first paint already has a tooltip

SVG: one `<polygon>` per cell, `fill="var(--color-hex-N)"`. 400–700 cells is
fine. Hover via `onMouseEnter` on occupied cells; click toggles pin.

---

## 9. Sample data (offline contract)

- Seeded PRNG (`mulberry32`). Same seed → same map and series.
- Named districts with lat/lng and a weight (busier cores get more events).
- Monthly (or weekly) revenue / cost / churn series for cartesian charts.
- Heatmap range control reseeds (`seed = year`).
- Never require an API key or network for the happy path.

---

## 10. Motion and accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Tooltips: opacity + transform + slight blur, 150–200ms, ease-out on enter.
- Cards: 180ms lift. Hex fill/stroke 160ms.
- `role="tooltip"` / `role="img"` + `aria-label` on the map.
- Keyboard: KPI wrapper is a `<button>` so focus opens the same panel
  (`:focus-within`).
- Contrast: muted text on charcoal must still read. Don't use `#8c8c94` on
  `#141416` for primary labels — that's secondary only.

---

## 11. Build loop (vibe-coding, but with gates)

Work like the RevMoney session:

1. **Thesis first** — one sentence the UI must prove.
2. **Tokens + chrome** — wordmark, nav, empty cards. Rename the product
   in every string before taking screenshots.
3. **KPIs + sparklines + hover.** Visually QA hover *and* leave. Rapid
   sweeps between cards must not leave a stuck overlay.
4. **Filters** that actually recompute.
5. **Honeycomb from points**, then algorithm switches.
6. **Eyeball at 1440 and 390.** No overflow. Screenshot the real UI for
   any README / OG / share card — never ship frames of a previous name.

Reject:

- Chart-library hexagon scatter as a "honeycomb"
- Portaled hover for dense cards
- Purple gradients, glassmorphism soup, three typefaces
- "Lorem" merchants, empty states that say "No data" on first load
- A map that does not change when the algorithm control changes

---

## 12. Finish checklist

- [ ] Product name consistent in chrome, title, favicon, OG, README
- [ ] Tokens only; no raw hex in JSX
- [ ] 3 KPI cards with sparkline + definition hover that **closes**
- [ ] Date filters recompute KPIs, charts, table, heatmap seed
- [ ] Honeycomb bins real points; cube / floor / offset all visibly differ
- [ ] Tooltip + legend + crosshairs + minimap
- [ ] Offline seed; works with network off
- [ ] 390px: no horizontal scroll; hex SVG scales
- [ ] `prefers-reduced-motion` honored
- [ ] Screenshots taken from the current build (not a prior brand)

---

## 13. Prompt to start a rebuild

Paste this to an agent with this skill loaded:

> Rebuild a RevMoney-class analytics platform using
> `skills/spatial-analytics-platform/SKILL.md`. Dark charcoal chrome, Plus
> Jakarta Sans, one blue accent. Dashboard with three self-explaining KPI
> cards (CSS hover, no portal), sparklines, and a honeycomb revenue heatmap
> that bins seeded deals with cube-round / axial-floor / offset-row
> controls. Analytics page with live date-range filters. Offline sample
> data. Name it [PRODUCT]. Match the interaction quality of
> https://karanrevmoney.grok.me — not the visual of a generic admin template.
