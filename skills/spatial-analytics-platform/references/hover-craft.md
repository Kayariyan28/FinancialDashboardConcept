# Hover craft (KPI + hex tooltips)

## Failure mode (do not repeat)

Radix / portaled popover, `side="top"`, `sideOffset=12`, controlled `open`
from `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur`:

1. Pointer sits on the trigger.
2. Portal paints the panel where the cursor already is (or in the gap).
3. Trigger `mouseleave` fires; content never gets `mouseenter`.
4. Timer closes; enter reopens. Infinite flicker.
5. Focus trap + `onBlur` can pin the panel open ("stuck black").

A leave delay of 140ms is not enough if the panel is not a descendant of
the hovered node.

## Pattern that works

Keep the tooltip a **positioned descendant** of a `.kpi-tip` / map-relative
wrapper. Drive visibility with CSS:

```css
.kpi-tip-panel {
  opacity: 0;
  pointer-events: none;
  transform: var(--kpi-tip-from);
  filter: blur(4px);
  transition: opacity 150ms ease-in, transform 150ms ease-in, filter 150ms ease-in;
  transition-delay: 60ms; /* close */
}
.kpi-tip:hover .kpi-tip-panel,
.kpi-tip:focus-within .kpi-tip-panel {
  opacity: 1;
  transform: var(--kpi-tip-to);
  filter: blur(0);
  pointer-events: auto;
  transition-delay: 40ms; /* open */
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

`--kpi-tip-from` / `--kpi-tip-to` and `top`/`left`/`right`/`bottom` are
**inline styles**, because Tailwind will not emit dynamic class strings.

Hex tooltips: same idea, `pointer-events: none` on the open panel except
the close button, so the pointer can keep sampling hexes underneath.

## QA

- Hover card A → tip visible.
- Leave → opacity 0 within ~300ms. No leftover overlay.
- Sweep A→B→C quickly → at most one tip, never a loop.
- Hex: hover, move to a neighbor, leave the map → last selection may pin
  (intentional); X / click-empty clears it.
- 390px: tip stays in viewport (`max-w-[min(18rem,calc(100vw-2rem))]`).
