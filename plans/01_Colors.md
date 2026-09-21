# 01 — Colour theme: Miami Art Deco, single theme

## Context

The site shipped with a placeholder blue-violet theme (hue 265), 9 semantic tokens, and a
full light/dark system. Three problems motivated this pass:

1. **The palette was placeholder.** `docs/ideas.md` lists "proper typography and color theme"
   as outstanding, and `src/pages/index.astro` carried a `TODO` saying the visual treatment
   came next.
2. **Dark mode was dead weight.** The dark palette was duplicated verbatim in two blocks,
   `@custom-variant dark` was defined and used zero times, and *nothing in the codebase ever
   wrote `data-theme`* — the attribute path was unreachable.
3. **The token set was too thin.** One chromatic token (`accent`), no `on-` colours beyond
   `accent-ink`, no hover tone (the primary button fudged with `hover:opacity-90`), no
   inverse surface, and no overlay pair — which is why `DemoFrame.astro` hardcoded
   `border-white/20 bg-black/50 text-white`.

**Outcome:** one bright Miami Art Deco theme — cream ground, white cards, mint and salmon
accents, near-black ink — as a two-layer token system, with zero hardcoded colours anywhere,
including the WebGL shader and the favicon.

**Decisions:** token naming `surface` / `content` / `accent` with explicit `on-` colours;
restrained palette dial (colour is ~15% of pixels); code blocks as dark ink panels.

---

## Architecture: two layers

```
:root { --mint-600: oklch(48% 0.085 172); … }   ← PALETTE. Plain CSS vars.
                                                   Deliberately NOT in @theme, so no
                                                   `bg-mint-600` utility can ever exist.
        ↓
@theme { --color-accent: var(--mint-600); … }   ← SEMANTIC. The only layer markup may touch.
        ↓
        class="bg-accent text-on-accent"        ← MARKUP. Roles only, never raw colour.
```

Keeping the palette out of `@theme` is what makes "no hardcoded colours" mechanically
enforceable: no utility class names a hue, so the only way to get colour into markup is
through a role.

### Verified Tailwind v4 mechanics (checked against `tailwindcss@4.3.3` in `node_modules`)

- `@theme` **prunes** unused `--color-*`, but a token referenced from a hand-authored rule
  *in a file Tailwind processes* is marked used and survives. **Caveat:** a `.astro` scoped
  `<style>` block is invisible to Tailwind and would *not* mark a token used. There are no
  `<style>` blocks in `src/` — keep it that way, or switch to `@theme static`.
- `bg-surface/80` compiles to `color-mix(in oklab, var(--color-surface) 80%, transparent)`
  behind an `@supports` guard. Works through the `var()` indirection.
- A token whose value carries alpha works with plain `bg-overlay`. **`bg-overlay/70` on top
  compounds** (0.55 × 0.70 ≈ 0.385) rather than replacing — hence `overlay-hover` is its own
  token rather than a modifier.
- Deleting `@custom-variant dark` is safe: it *replaces* the built-in variant, so removing it
  restores the media-query default. No `dark:` utility exists in `src/`.

---

## The palette

Miami deco: cream stucco ground, mint and salmon banding, black linework. Neutrals carry a
faint cool cast (hue 190/220) so the mint reads clean beside them rather than muddy.

| Token | oklch | sRGB |
|---|---|---|
| `--shell-000` | `oklch(100% 0 0)` | `#ffffff` |
| `--shell-050` | `oklch(98.4% 0.006 190)` | `#f5fbfb` |
| `--shell-100` | `oklch(96.2% 0.010 190)` | `#ebf5f4` |
| `--shell-200` | `oklch(90.5% 0.014 190)` | `#d6e3e2` |
| `--shell-300` | `oklch(64% 0.020 190)` | `#7f908f` |
| `--ink-900` | `oklch(20% 0.025 220)` | `#08191e` |
| `--ink-800` | `oklch(24% 0.024 220)` | `#122227` |
| `--ink-600` | `oklch(38% 0.022 220)` | `#36454b` |
| `--ink-400` | `oklch(49% 0.018 220)` | `#566368` |
| `--mint-200` | `oklch(90% 0.062 172)` | `#b5ecd9` |
| `--mint-600` | `oklch(48% 0.085 172)` | `#186d58` |
| `--mint-700` | `oklch(40% 0.072 172)` | `#0e5443` |
| `--salmon-200` | `oklch(91% 0.045 28)` | `#fed7d1` |
| `--salmon-600` | `oklch(53% 0.160 30)` | `#b63c2e` |

### Two tiers per hue, and why the dark mint is green

A pastel mint at its prettiest (~90% L) is ~1.3:1 on cream and cannot carry text. So each hue
gets a **pastel fill** tier (text sits *on* it in `content`) and a **text-safe** tier that
passes AA as text on cream and carries cream text as a button fill.

**The sRGB gamut does not contain a saturated mint at text-safe lightness.** Maximum chroma at
hue 172 is 0.077 at L40, 0.091 at L47 — so `mint-600` is necessarily a deep pine-teal
(`#186d58`), not a bright mint. The first draft of this palette specified `0.105` chroma,
which silently clipped to a forest green outside sRGB. The pastel tier carries the mint
identity; the deep tier is the functional interactive tone. **Do not raise the chroma of
`mint-600` / `mint-700` — it will clip and shift hue.**

Same constraint on salmon in reverse: `salmon-200` is capped at ~0.047 chroma at L91.

### Contrast — all verified, all pass

Computed via oklch → linear sRGB → WCAG 2.x relative luminance. Note oklch `L` is *not*
CIE `L*`; these were measured, not estimated.

| Pair | Ratio | Need |
|---|---|---|
| `content` on `surface` | 17.25:1 | 12 |
| `content` on `surface-raised` | 18.03:1 | 12 |
| `content-muted` on `surface` | 9.51:1 | 6 |
| `content-subtle` on `surface` | 5.95:1 | 4.5 |
| `content-subtle` on `surface-sunken` | 5.59:1 | 4.5 |
| `accent` (link) on `surface` | 5.98:1 | 4.5 |
| `accent-hover` on `surface` | 8.48:1 | 4.5 |
| `on-accent` on `accent` (primary button) | 5.98:1 | 4.5 |
| `highlight` on `surface` (eyebrow) | 5.47:1 | 4.5 |
| `content` on `accent-soft` | 13.70:1 | 4.5 |
| `content` on `highlight-soft` | 13.59:1 | 4.5 |
| `content-inverse` on `surface-inverse` | 15.66:1 | 12 |
| `accent-soft` on `surface-inverse` (footer links) | 12.44:1 | 4.5 |
| `focus` vs `surface` | 5.47:1 | 3 |
| focus ring inside the ink band | 12.33:1 | 3 |
| `line-strong` vs `surface` | 3.19:1 | 3 |

**Two findings that changed the design:**

- **Footer link hover.** Deep mint on the ink band is 1.9:1. Footer links hover to
  `accent-soft` (pastel mint), which is 12.44:1.
- **The focus ring needs two tones.** Salmon on ink is 2.32:1 — a keyboard user tabbing into
  the footer would see almost nothing. Solved with an `.on-inverse` utility that retargets
  `--focus-ring` to the pastel salmon. Salmon on mint is 1.11:1, but `outline-offset: 2px`
  exposes the page ground between ring and element, so the ring reads against cream (5.47:1)
  regardless of what it surrounds.

---

## The semantic tokens (21)

| Token | Value | Used for |
|---|---|---|
| **Surfaces** | | |
| `surface` | `shell-050` | page ground |
| `surface-sunken` | `shell-100` | card tag chips, demo frame |
| `surface-raised` | `shell-000` | cards — white pops *up* off the cream |
| `surface-inverse` | `ink-800` | footer band, code panels |
| `overlay` | `ink-900 / 0.55` | controls floating over arbitrary imagery |
| `overlay-hover` | `ink-900 / 0.75` | its hover |
| **Brand** | | |
| `accent` | `mint-600` | links, primary button fill, card hover border |
| `accent-hover` | `mint-700` | button/link hover |
| `accent-soft` | `mint-200` | active nav pill, inline code, hover text *on ink* |
| `highlight` | `salmon-600` | eyebrows, 404 code, tag hover |
| `highlight-soft` | `salmon-200` | section rules, `::selection`, focus ring on ink |
| **Content** | | |
| `content` | `ink-900` | headings, body |
| `content-muted` | `ink-600` | secondary text |
| `content-subtle` | `ink-400` | meta, dates, captions |
| `content-inverse` | `shell-050` | text on `surface-inverse` |
| `on-accent` | `shell-050` | text on an `accent` fill |
| `on-overlay` | `shell-050` | text on `overlay` |
| **Lines** | | |
| `line` | `shell-200` | decorative dividers (no 3:1 requirement) |
| `line-strong` | `shell-300` | interactive boundaries — secondary button, scrollbar |
| **Focus** | | |
| `focus` | `salmon-600` | `:focus-visible` outline |

**No `on-accent-soft` / `on-highlight-soft` token** — text on either pastel is always
`content` (13.7:1 and 13.6:1).

**Status colours are deliberately omitted.** No UI needs them today and unused tokens rot. If
a form or toast lands later, add `positive` / `caution` / `critical` at the same two tiers.

### Where mint vs salmon go

| | |
|---|---|
| **Mint** (`accent`) | primary buttons, links, card hover border, wordmark hover, footer link hover (`accent-soft`), active nav pill (`accent-soft`), inline code background, prose quote border |
| **Salmon** (`highlight`) | article/project eyebrows, homepage section rules (`highlight-soft`), tag pill hover, focus ring, the 404 code, `::selection` |
| **Ink** (`surface-inverse`) | footer band, code panels — the only two dark regions |

---

## Files changed

### 1. `src/styles/global.css` — the core rewrite
Delete the dark-mode media block, the `[data-theme="dark"]` block, `@custom-variant dark`,
and both `--shiki-dark` override blocks. Add the palette `:root`, the 21-token `@theme`,
`color-scheme: light`, tokenised `scrollbar-color`, `::selection`, the `.on-inverse` focus
utility, the prose remap (incl. the previously missing `--tw-prose-pre-bg`), an inline-code
rule, the code-panel rule, and the `--gl-*` shader triples.

### 2. `astro.config.mjs` — single Shiki theme
**Delete the `themes: {…}` key** and replace with `theme: 'poimandres'` (teal/mint/pink —
on-palette, bundled in the `shiki@4.4.3` Astro ships).

> **Trap:** `themes` beats `theme` whenever it is non-empty
> (`@astrojs/internal-helpers/dist/shiki.js`). Adding `theme:` *alongside* `themes:` changes
> nothing and emits no warning. The key must be removed.

With a single theme Shiki writes literal hex as inline styles on `.astro-code` and every
token span, so overriding the panel background needs `!important`, scoped to `.astro-code`
alone — touching spans would wipe the syntax colours.

### 3. `src/theme.ts` — new
The favicon and `<meta name="theme-color">` live outside CSS, where `var()` cannot reach.
Exports three hex mirrors: `surface #f5fbfb`, `accent #186d58`, `onAccent #f5fbfb`. This is
the one accepted duplication in the system, bound with comments in both directions.

### 4. Favicon — generated route
Delete `public/favicon.svg` (hardcoded `#16161d` / `#f4f4f8`); add `src/pages/favicon.svg.ts`
as an `APIRoute` mirroring `robots.txt.ts`, drawing the monogram in `THEME_HEX`.

> **Trap:** if `public/favicon.svg` survives, Astro *silently skips* the route with a `warn`
> and ships the stale file. `npm run verify` still passes.

### 5. WebGL demo — palette from the theme
GLSL cannot read CSS variables, and parsing `oklch()` in JS would mean ~40 lines of
colour-space maths in the demo chunk. Instead the shader palette is published as plain
numeric triples in `global.css` — `--gl-deep` `#042f32`, `--gl-mid` `#92e0c7`, `--gl-hot`
`#f9aea2` — read once via `getComputedStyle` and passed as `vec3` uniforms. **If any triple
is missing or unparseable, `createShaderDemo` returns `null`**, which `DemoFrame` already
handles by leaving the poster in place — a fail-safe path with no hardcoded fallback colour.

### 6. `src/components/ui/Tag.astro` — new
The outlined tag pill was a 12-class string duplicated byte-for-byte in `ArticleLayout` and
`blog/index`. Extracted so a colour change lands in one place.

### 7. Token rename across markup
`accent` keeps its name, so the ~20 `text-accent` / `hover:border-accent` usages are
unchanged. `bg-canvas`→`bg-surface`, `bg-surface`→`bg-surface-raised`, `border-border`→
`border-line`, `text-ink*`→`text-content*`, `text-accent-ink`→`text-on-accent`.

Deliberate surface changes beyond the rename: active nav pill → `bg-accent-soft`; footer →
ink band with `accent-soft` link hover; primary button → `hover:bg-accent-hover` (kills the
opacity fudge); secondary button border → `line-strong` (3:1); card → `bg-surface-raised`;
article eyebrow → `text-highlight`; homepage section rules → `border-t-2 border-highlight-soft`;
404 code → `text-highlight`; demo overlay button → the `overlay` token trio.

### 8. `src/components/seo/BaseHead.astro`
Add `<meta name="theme-color" content={THEME_HEX.surface} />`.

### 9. `AGENTS.md`
Updated Colours convention, a Trap 3 for the single theme, the two mirrors that must be kept
in step, and the two silent-failure traps above.

---

## Verification

```bash
npm run verify                    # lint + astro check + build
npx astro dev --background        # then: astro dev logs
```

**No hardcoded colours** — expect hits only in `src/theme.ts` and the `--gl-*` block:

```bash
grep -rniE '#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(bg|text|border|ring|fill|stroke|outline|divide|decoration|caret|shadow)-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)\b' src astro.config.mjs
grep -rnE '\b(bg|text|border)-(canvas|ink|ink-muted|ink-subtle|accent-ink|border|surface-raised)\b' src
```

**Build output:** no `Skipping … public folder` warning; `dist/favicon.svg` exists;
`grep -r 'shiki-dark' dist/` returns nothing; `grep -c '<script[^>]*src=' dist/index.html`
→ 0 (only `/demos/*` ships a script).

**Visual pass** at `localhost:4321`:

| Route | Look for |
|---|---|
| `/` | cream ground, white cards lifting off it, mint buttons, salmon section rules, ink footer band |
| `/blog` | salmon-hover tag pills via the new `Tag` component |
| `/blog/hello-world` | dark ink code panel, mint-wash inline code with no literal backticks |
| `/demos/warped-field` | shader renders teal → mint → salmon; overlay button legible over it |
| `/404` | salmon `404`, secondary buttons visible at 1px on cream |

**Interaction:** tab through header → skip link → buttons → cards → footer; the focus ring
must be visible on every one, including on the mint primary button and inside the ink footer
band (where it switches to the pastel). Select text — salmon `::selection`. Toggle OS dark
mode: **the site must not change**.

**Degradation:** delete `--gl-mid` in DevTools and reload `/demos/warped-field` — the poster
stays rather than a black canvas. Set `prefers-reduced-motion: reduce` — one static frame.
