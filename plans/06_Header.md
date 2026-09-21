# Header

## Goal

Modern, clean sticky header with frosted-glass effect, desktop horizontal nav, and a
mobile hamburger menu. No framework JS — vanilla `<script>` only.

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Michael Salton          Projects  Demos  Writing  …    │  ← desktop
│  [wordmark]                            [horizontal nav] │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│  Michael Salton      ☰   │  ← mobile (< sm)
├──────────────────────────┤
│  Projects                │  ← slide-down panel
│  Demos                   │
│  Writing                 │
│  About                   │
│  Contact                 │
└──────────────────────────┘
```

## Visual spec

- **Height:** `h-16` (64px)
- **Background:** `bg-surface/80 backdrop-blur-md` (frosted glass — see-through, not opaque)
- **Border:** `border-b border-line`
- **Wordmark:** `text-h3 font-display font-semibold`, links to `/`
- **Nav links (desktop):** `text-caption`, active = `bg-accent-soft text-content` pill
- **Hamburger:** inline SVG, 3 bars → X, `sm:hidden`
- **Mobile panel:** `bg-surface`, `border-b border-line`, links stacked with `py-3` tap targets

## Behaviour

1. **Mobile toggle** — `<button data-nav-toggle>` with `aria-expanded` toggles panel
2. **Panel animation** — CSS `grid-template-rows: 0fr → 1fr` transition (no `max-height` hack)
3. **Hero overlay** — when `overlay` prop is true, header starts transparent; JS scroll
   listener adds/removes `data-hero-overlay` at `scrollY > 64`; existing CSS rules in
   `global.css` handle the visual change
4. **Reduced motion** — global rule already zeros transition durations

## Accessibility

- `aria-expanded` on toggle, `aria-controls` pointing to panel `id`
- All nav links keyboard-focusable
- Visible focus rings (inherited from global `:focus-visible`)
- Skip-to-content link already in `BaseLayout`

## Files

- `src/components/layout/Header.astro` — rewrite
- `src/styles/global.css` — add mobile panel animation utility

## Constraints

- No solid opaque background — the frosted glass (`bg-surface/80 backdrop-blur-md`) is
  the resting state, keeping the header see-through
- Semantic colours only, type roles only — no hex literals, no `text-4xl`, no `sm:text-*`
- Zero framework JS; inline `<script>` for toggle + scroll
- Reuse `Button.astro` for nav links (already does `<a>` vs `<button>` correctly)
