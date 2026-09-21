# Hero Section Plan

## Context

The homepage needs a full-viewport hero with a large animated WebGL background, bold
display text, and floating navigation. This is the brand landing page — the first thing
visitors see — so it justifies the one exception to the "zero JS on content pages" rule.

## Layout

Two zones, top to bottom:

1. **Hero** — `min-h-dvh`, relative-positioned container.
   - A full-bleed `<hero-canvas>` custom element (absolute, fills the section).
   - Centred text overlay (heading + subtitle + two CTA buttons) with a gradient scrim
     for contrast.
   - The sticky header becomes transparent over this section, floating above the shader.

2. **Content** — the existing "Selected work" and "Writing" sections, unchanged, in the
   normal `max-w-5xl` wrapper.

## Files to create

### `src/components/hero/HeroCanvas.astro`

Custom element `<hero-canvas>`, following the `DemoFrame.astro` pattern with these
differences:

| Concern            | DemoFrame (below fold)       | HeroCanvas (above fold)          |
|--------------------|------------------------------|----------------------------------|
| Activation         | IntersectionObserver, lazy   | Immediate on `connectedCallback` |
| Pause              | When scrolled away           | When hero fully off-screen       |
| Fallback           | Poster `<Image>`             | CSS gradient from semantic tokens|
| Shape              | Boxed, configurable aspect   | `min-h-dvh`, full viewport       |
| Toggle button      | Pause/Play overlay           | None (ambient background)        |
| Reduced motion     | One static frame             | One static frame                 |

Implementation:
- `connectedCallback` immediately imports `../demos/shaderRenderer` (dynamic `import()`,
  separate chunk) and calls `createShaderDemo(canvas)`.
- IntersectionObserver pauses the shader when the hero scrolls fully off-screen.
- `visibilitychange` listener pauses on hidden tab.
- `prefers-reduced-motion: reduce` → one static frame, never `play()`.
- If `createShaderDemo()` returns `null` → canvas stays `opacity-0`, CSS gradient fallback
  shows through.
- On intersection change, toggles `data-hero-overlay` on the `<header>` element to
  trigger the transparent ↔ solid header transition.

Reuses `shaderRenderer.ts` directly — the existing domain-warped sine field in
aqua/teal/salmon is a good fit. A hero-specific shader can replace it later without
changing the component architecture.

## Files to modify

### `src/pages/index.astro`

- Import `HeroCanvas`.
- Pass `heroMode` to `<BaseLayout heroMode>`.
- Hero section: `min-h-dvh`, relative. Contains `<HeroCanvas />` (absolute fill) +
  centred text overlay with scrim.
- Text uses `text-on-overlay`. Heading is `text-display`. Subtitle is `text-body`.
- Both CTAs use `variant="press"` — the raised white buttons float off the shader
  naturally with no new variant needed.
- Content sections below the hero are unchanged.

### `src/layouts/BaseLayout.astro`

- Add `heroMode?: boolean` to Props interface.
- Pass `overlay={props.heroMode}` to `<Header />`.

### `src/components/layout/Header.astro`

- Accept `overlay?: boolean` prop.
- When `overlay` is true, add `data-hero-overlay="true"` to the `<header>` element.
- Add transition classes for smooth background/border/blur changes.

### `src/styles/global.css`

Under `@layer utilities`:
- **Hero scrim**: a `.hero-scrim` class with a pseudo-element gradient overlay behind
  hero text (dark → transparent, using `overlay` tokens).
- **Header overlay rules**:
  ```css
  header[data-hero-overlay="true"] {
    background-color: transparent;
    border-color: transparent;
    backdrop-filter: none;
  }
  ```
  The normal state is handled by the existing Tailwind classes on `<header>`.

### `AGENTS.md`

Document the homepage JS exception under "The budget":
> The homepage ships one script chunk: the hero shader canvas.

## Fallback strategy

| Condition               | Behaviour                                       |
|-------------------------|--------------------------------------------------|
| No WebGL2               | Canvas stays invisible; CSS gradient shows       |
| No JavaScript           | CSS gradient + all text/buttons (SSR HTML)       |
| `prefers-reduced-motion`| One static shader frame, no animation            |
| Low-end mobile          | Shader runs at capped DPR (max 2, existing cap)  |

The CSS gradient fallback on the hero section uses semantic tokens only:
`linear-gradient(135deg, var(--color-accent), var(--color-accent-soft), var(--color-highlight-soft))`.

## Accessibility

- Skip link in `BaseLayout` already jumps to `#main` — works unchanged.
- Canvas has `role="img"` + `aria-label` describing the visual.
- `<noscript>` fallback message inside `<hero-canvas>`.
- Focus rings: header overlay mode needs `.on-inverse` if the transparent header sits on
  dark shader tones — or the focus ring uses the existing salmon which reads against the
  shader.
- Keyboard: hero buttons are `<a>` elements, tabbable by default.

## Responsive behaviour

Handled by the existing type ramp — no breakpoint variants in markup:

| Breakpoint | `text-display` | Notes                          |
|------------|----------------|--------------------------------|
| < 48rem    | 44px           | Buttons wrap via `flex-wrap`   |
| 48–64rem   | 64px           | Same centred layout            |
| 64rem+     | 80px           | Full desktop presentation      |

Hero uses `min-h-dvh` (not `h-dvh`) so content is never clipped on short viewports.

## Verification

1. `npm run verify` passes (lint + typecheck + build).
2. `grep -c '<script[^>]*src=' dist/index.html` → exactly 1.
3. The four typography greps and four colour greps from AGENTS.md → all zero.
4. `prefers-reduced-motion: reduce` in devtools → shader shows one static frame.
5. Disable WebGL2 → CSS gradient fallback visible, text legible.
6. Disable JS → gradient + all text/buttons render (SSR).
7. Scroll past hero → header transitions from transparent to solid.
8. Tab through page → skip link, hero buttons, nav all focusable with visible rings.
9. Lighthouse >= 95 all four categories.
10. Test at 375px mobile width — hero fills viewport, text wraps, shader runs.
