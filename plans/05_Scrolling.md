# 05 — Scrolling

## Context

The site has basic CSS `scroll-behavior: smooth` and a minimally styled scrollbar via
`scrollbar-color`. Three enhancements: Lenis smooth scroll, a custom scrollbar, and a
header that hides on scroll-down / reappears on scroll-up.

This **relaxes** the zero-JS-on-content-pages rule. Lenis (~15 KB) + the header script
(~600 B) will ship on every page. AGENTS.md must be updated to reflect the new baseline.

---

## 1. Lenis smooth scroll

**Install:** `npm i lenis`

**New file:** `src/components/layout/SmoothScroll.astro`

A thin wrapper containing only a `<script>` block that:
- Imports `lenis` (dynamic import not needed — it ships on every page)
- Instantiates `new Lenis()` with default options
- Drives it via `requestAnimationFrame` loop
- Checks `matchMedia('(prefers-reduced-motion: reduce)')` — if true, calls
  `lenis.destroy()` and bails so the browser's native scroll is used instead
- Listens for the `change` event on that media query to create/destroy at runtime

**Include in:** `src/layouts/BaseLayout.astro` — add `<SmoothScroll />` inside `<body>`,
after the skip link and before `<Header />`.

**CSS change in `global.css`:** Remove `scroll-behavior: smooth` from the `html` rule.
Lenis replaces it. Keep `scrollbar-gutter: stable` and `scrollbar-color`.

The header hide/show script (step 3) will use `window.scrollY` in a passive scroll
listener, which works with Lenis since Lenis scrolls the real document (not a wrapper div
by default). No special integration needed.

---

## 2. Custom scrollbar (CSS-only)

**File:** `src/styles/global.css` — `@layer base`, `html` block + new rules after it.

Add `scrollbar-width: thin` to the existing `html` rule, then add WebKit pseudo-elements:

```css
scrollbar-width: thin;

::-webkit-scrollbar       { width: 10px; }
::-webkit-scrollbar-track { background: var(--color-surface); }
::-webkit-scrollbar-thumb {
  background: var(--color-line-strong);
  border: 2px solid transparent;
  background-clip: content-box;
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-content-subtle);
  border: 2px solid transparent;
  background-clip: content-box;
}
```

All colours are semantic tokens. Firefox uses `scrollbar-color` + `scrollbar-width`;
Chromium/Safari use the pseudo-elements. Progressive enhancement.

---

## 3. Header hide on scroll

**File:** `src/components/layout/Header.astro`

### 3a. Transition class

Update the `<header>` class — change `transition-colors` to also transition `transform`:

```diff
- transition-colors duration-(--duration-base)
+ transition-[color,background-color,border-color,backdrop-filter,transform] duration-(--duration-base) ease-(--ease-out-soft)
```

If Tailwind v4 doesn't accept the bracketed list, fall back to `transition-all`.

### 3b. Script

Add a `<script>` block at the end of `Header.astro`:

```
Logic (passive scroll listener, rAF-throttled):
- If prefers-reduced-motion: do nothing, header stays permanently visible
- Track lastScrollY and direction
- Scrolling down AND scrollY > 64px: set transform: translateY(-100%)
- Scrolling up: set transform: translateY(0)
- scrollY < 64px: always show (prevents flicker near top)
- 5px dead-zone to prevent jitter from tiny direction changes
```

Directly sets `headerEl.style.transform`. No CSS class toggle needed.

### 3c. Overlay interaction

Overlay mode (`data-hero-overlay`) controls **appearance** (transparent vs solid); hide/show
controls **position** (`translateY`). They target different CSS properties — no conflict.

---

## 4. AGENTS.md update

Rewrite the zero-JS bullet to reflect the new baseline:

> Every page ships Lenis (~15 KB) for smooth scrolling and a header scroll-direction
> micro-script (~600 B). Beyond these two shared scripts, content pages ship zero
> additional JS. The homepage additionally ships the hero shader chunk.

Update the verification grep guidance accordingly.

---

## File summary

| File | Change |
|---|---|
| `src/styles/global.css` | Remove `scroll-behavior: smooth`, add `scrollbar-width: thin` + WebKit pseudo-elements |
| `src/components/layout/SmoothScroll.astro` | **New.** Lenis instantiation + reduced-motion guard |
| `src/layouts/BaseLayout.astro` | Include `<SmoothScroll />` |
| `src/components/layout/Header.astro` | Transition class update + hide/show `<script>` |
| `AGENTS.md` | Document new JS baseline |

**New dependency:** `lenis`

## Sequencing

1. `npm i lenis`
2. Create `SmoothScroll.astro`, include in `BaseLayout.astro`
3. Custom scrollbar CSS (`global.css`)
4. Header transition class + hide/show script (`Header.astro`)
5. Update `AGENTS.md`
6. `npm run verify`

## Verification

1. `npm run verify` — must pass (lint + typecheck + build)
2. Scroll any page — momentum/inertia feel from Lenis
3. Visual: scrollbar styled (rounded pill thumb) in Chrome and Firefox
4. Scroll down — header slides up; scroll up — header reappears
5. Set OS to reduced motion — Lenis disabled (native scroll), header stays fixed
6. Homepage: overlay mode still works (transparent over hero, solidifies on scroll)
