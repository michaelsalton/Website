# AGENTS.md

Personal portfolio site for Michael Salton. Static marketing site — Astro 7, Tailwind v4,
TypeScript, deployed to Vercel.

## Commands

```bash
npm run dev        # dev server on http://localhost:4321
npm run verify     # lint + typecheck + build — MUST pass before committing
npm run lint:fix   # Biome format + safe lint fixes
npm run check      # astro check (types only)
```

`npm run build` runs `astro check` first, so a type error fails the deploy rather than
shipping.

**Agents: start the dev server detached**, so it doesn't block the session:

```bash
npx astro dev --background      # then: astro dev status | logs | stop
```

Astro 7 detects agent sessions and emits structured JSON logs in this mode.

## Stack, and two traps

| | |
|---|---|
| Astro | 7.3 (Vite 8 + Rolldown, Rust `.astro` compiler) |
| Tailwind | 4.3 via `@tailwindcss/vite` |
| Lint/format | Biome 2.5 (single binary, `biome.json`) |
| Types | TypeScript 6, `astro/tsconfigs/strict` |
| Node | ≥22.12 (see `.node-version`) |

**Trap 1 — Tailwind:** never add `@astrojs/tailwind` (deprecated for v4) and never create
`tailwind.config.js` (v4 ignores it silently). All config lives in
`src/styles/global.css` under `@theme`.

**Trap 2 — the Astro 7 Rust compiler:** HTML auto-correction is gone. Unclosed tags and
unterminated attributes are now hard **errors**, and whitespace follows JSX rules, so a
newline between inline elements no longer renders as a space. Astro snippets found online
predating v7 may not compile.

**Trap 3 — Shiki has one theme, set with `theme:`.** `themes` beats `theme` whenever it
is non-empty (`@astrojs/internal-helpers/dist/shiki.js` picks
`Object.values(themes).length ? { themes } : { theme }`), so adding `theme:` *alongside*
a `themes:` key changes nothing and emits no warning. With a single theme Shiki writes
literal hex as **inline styles**, which is why `.astro-code` in `global.css` needs
`!important` to re-ground the panel. Keep that override on `background-color` and on
`.astro-code` alone — widening it to the token spans wipes every syntax colour.

## Layout of the code

```
src/
  consts.ts              site metadata, nav, socials — SINGLE source of truth
  content.config.ts      collection schemas (projects, posts, demos)
  content/               the markdown itself
  lib/                   content.ts (queries + draft filter), format.ts (dates, slugs)
  layouts/               BaseLayout → PageLayout / ArticleLayout
  components/
    layout/              Header, Footer
    seo/                 BaseHead, PersonSchema (JSON-LD)
    ui/                  Button, Card, CardGrid, Tag
    demos/               DemoFrame.astro + shaderRenderer.ts
  pages/                 routes; robots.txt.ts, rss.xml.ts, favicon.svg.ts are generated
  styles/global.css      Tailwind config, colour palette + tokens, prose + Shiki theming
  theme.ts               hex mirrors of 3 tokens, for the favicon and <meta theme-color>
```

## Conventions

- **`.astro` by default.** No framework is installed. For interactivity use a `<script>`
  or a custom element; only reach for React/Svelte if something genuinely needs it.
- **Never hardcode** the site title, a nav label, or a social URL — import from
  `src/consts.ts`.
- **Content, not markup.** New projects/posts/demos are markdown files in
  `src/content/`, never new hardcoded pages.
- **Zod comes from `astro/zod`**, not the `zod` package. Astro bundles Zod 4, and mixing
  the two produces confusing validation errors. Use `z.url()`, not the deprecated
  `z.string().url()`.
- **Always filter drafts** via `isPublished` from `src/lib/content.ts`, or use the
  `getPosts`/`getProjects`/`getDemos` helpers that already do. Hand-rolling a
  `getCollection` call is how unfinished work gets published.
- **Images:** `src/assets/` + `<Image>` for anything optimizable; `public/` only for
  files needing a stable URL. The `projects` schema *rejects* a `cover` without
  `coverAlt` — that check is deliberate, don't loosen it.
- **Colours: one bright theme, two layers, zero literals.** `src/styles/global.css`
  holds a **palette** of plain CSS vars (`--aqua-600`) and a `@theme` block of
  **semantic tokens** (`--color-accent`) that point at them. Markup may only ever touch
  the semantic layer — `bg-surface`, `text-content`, `border-line`, `text-on-accent`.

  The palette is deliberately **not** in `@theme`, so no `bg-aqua-600` utility exists and
  the only way to get colour into markup is through a role. If a role is missing, add one
  there; never write a hex, an `rgb()`, or a stock Tailwind colour like `text-white`.

  There is **no dark mode** — no `dark:` variant, no `data-theme`, `color-scheme: light`.
  Don't reintroduce one token at a time; it's a whole second palette or nothing.

  **The brand colour `#71cfd7` is `accent-soft`, not `accent`.** At 1.73:1 on the cream
  ground it is a *fill only* — it cannot be text, a link, or a boundary. `accent` is the
  deep teal `#076b72` derived at the same hue (6.03:1). Reaching for the bright aqua to
  colour text is the one mistake this palette invites; body text on it is 9.98:1, which
  is why it works as the nav pill, the inline-code wash and the footer link hover.

  Two more contrast rules: text on the **pastel** tiers (`accent-soft`, `highlight-soft`)
  is always `content`, and the **deep teal is unusable on the ink band** (2.61:1) —
  inside `surface-inverse`, links hover to `accent-soft` (9.04:1). Any subtree on
  `surface-inverse` needs the `.on-inverse` class so the focus ring switches to the
  pastel salmon; without it the ring is 2.86:1 and effectively invisible.

  Don't raise the chroma of `aqua-600`/`aqua-700`: sRGB has no saturated aqua at
  text-safe lightness (max ~0.082 at L48), so it silently clips and shifts hue.

- **Three colours are mirrored outside CSS** and must be changed in step:
  `src/theme.ts` (favicon + `<meta name="theme-color">`, which can't resolve a `var()`)
  and the `--gl-*` triples in `global.css` (the WebGL palette, since GLSL can't read CSS
  variables). Both sides carry comments pointing at the other.

- **Typography: one responsive ladder, two layers, one class per element.** Identical
  architecture to the colours. A **ramp** of plain vars (`--step-h1`) lives on `:root`
  outside `@theme` and steps at `48rem` and `64rem`; a `@theme` block of **role tokens**
  (`--text-h1`) points at it. Markup only ever touches the role.

  A role carries **size + line-height + tracking + weight**, so `class="text-h1"` is the
  whole declaration — never a companion `leading-*`, `tracking-*` or `font-*`, and never
  a breakpoint variant. The ramp is responsive in CSS; `sm:text-4xl` is the old way and
  is now wrong on both counts.

  Nine roles: `display` (the homepage hero alone, 80px at desktop), `h1` (page and
  article titles), `h2`, `h3`, `body` (**the default** — `@layer base` sets it on
  `body`, so most paragraphs need no class), `body-sm`, `caption` (meta, dates, nav,
  buttons), `label` (ALL-CAPS eyebrows and chips, the one positive tracking), `micro`.
  `/styles` renders every one of them live and **throws at build time** if a `--text-*`
  token is undocumented, exactly as it does for colours.

  **Tailwind's stock scale is deleted.** `--text-*: initial`, `--leading-*: initial` and
  `--tracking-*: initial` mean `text-4xl`, `leading-snug` and `tracking-tight` do not
  exist, the same way no `bg-aqua-600` exists. `--font-weight-*` is trimmed to the four
  loaded faces (400/500/600/700), so `font-extrabold` is gone too — asking for a weight
  the browser would have to synthesize is now inexpressible.

  **Two traps in that enforcement.** Tailwind does **not** error on an unknown utility —
  a stale `text-4xl` passes `npm run verify` and silently renders at 1rem. And clearing a
  namespace does not disable arbitrary values: `text-[20px]` still compiles. The greps
  under *The budget* are the only real gate.

  **One role per element.** Tailwind emits these utilities in *alphabetical* order of the
  role name — not by size — so `text-caption text-body` resolves to 14px, and stacking
  two roles is always a bug. A `font-*` utility *does* reliably override a role's weight
  (weights are emitted after sizes); that is the sanctioned emphasis escape hatch, and
  it's why `Button`'s base `font-medium` overrides every role it wraps.

- **Oswald is the site-wide typeface** (`--font-sans`), used for all text including
  headings. **Inter is reserved for the header nav only**, exposed as `--font-display`
  so the header can reach for it via `font-display`. The `font-display` utility should
  not be used anywhere else.

  **Oswald has no italic.** Never put `italic` on text; the browser would synthesize
  a mechanical oblique. The header nav (Inter) has real italics.

  The `.prose` remap in `global.css` is **mandatory, not cosmetic**:
  `@tailwindcss/typography` hardcodes its own scale and never reads `--text-*`, so
  without it markdown headings keep the plugin's sizes and its `font-weight: 800` on h1 —
  a face loaded in neither family.

## Adding a demo

1. Write the renderer in `src/components/demos/`.
2. Register it in the `RENDERERS` map in `src/pages/demos/[...slug].astro`.
3. Add a markdown entry in `src/content/demos/` whose `component` matches the key.

`DemoFrame.astro` is the reference implementation. Copy its behaviour: idle until
visible, renderer behind a **dynamic `import()`** so it's a separate chunk, paused when
off-screen or when the tab is hidden, one static frame under `prefers-reduced-motion`,
and the poster left in place if WebGL2 is unavailable.

**Shader colours come from the theme, not from the GLSL.** `shaderRenderer.ts` reads the
`--gl-*` triples off `:root` once via `getComputedStyle` and uploads them as `vec3`
uniforms. If a triple is missing or unparseable it returns `null` and the poster stays —
there is deliberately no hardcoded fallback colour. Add a `--gl-*` var for a new demo's
palette rather than writing literals into the shader.

Note `client:visible` does **not** work on `.astro` files — client directives only apply
to framework components. The custom element + dynamic import achieves the same thing
without a framework.

**Do not add `three` until a demo actually needs it**, and import it inside the island so
it never lands in the main bundle.

## The budget this site is held to

- **Minimal JS baseline on every page** — two shared scripts ship globally: Lenis
  (~15 KB, smooth scrolling, `SmoothScroll.astro`) and a header scroll-direction
  micro-script (~600 B, `Header.astro`). Beyond these, content pages ship zero
  additional JS. The homepage additionally ships the hero shader chunk (reusing
  `shaderRenderer.ts`).
- Islands stay below the fold and load on intersection. The homepage hero canvas is the
  one above-the-fold exception — it activates immediately rather than on intersection.
- Lighthouse ≥95 across all four categories.
- Keyboard navigable; visible focus rings; `prefers-reduced-motion` honoured.
- **No hardcoded typography.** All four must return zero hits. They cover bracket syntax
  because arbitrary values survive the namespace clear, and they match breakpoint-prefixed
  forms because `:` is a non-word character, so `\b` matches after it. No role token trips
  them — the size pattern is anchored at `text-`, and what follows in `text-body-sm` is
  `body`, not `sm`.

  `global.css` is excluded because it is the file that *deletes* these names and has to
  spell them out to say so. It defines the system rather than consuming it, and carries no
  markup and no `@apply`, so nothing there can be a violation.

  ```bash
  G="grep -rnE --exclude=global.css"
  $G '\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|\btext-\[' src        # stock + arbitrary sizes
  $G '\b(leading|tracking)-' src                                # the roles own these now
  $G '\bfont-(thin|extralight|light|extrabold|black)\b|\bfont-\[' src  # unloaded weights
  $G '\b(sm|md|lg|xl):text-' src                                # the ramp lives in CSS
  ```

## Known issues

- **`npm audit` reports 3 high-severity `path-to-regexp` advisories.** They arrive via
  `@astrojs/vercel` → `@vercel/routing-utils`, which runs at **build time** to emit
  Vercel's route config and never reaches the browser. `npm audit fix --force` would
  *downgrade* the adapter from 11.x to 8.0.4 — do not run it. Revisit when the adapter
  bumps its dependency.
- **Biome's `.astro` support is experimental**, enabled by
  `html.experimentalFullSupportEnabled` in `biome.json`. It currently formats and lints
  this codebase cleanly (verified against a full `astro check` + build). If a Biome
  upgrade ever mangles `.astro` output, the escape hatch is to exclude `**/*.astro` from
  Biome and add `prettier` + `prettier-plugin-astro` for those files only.
- **`biome.json` must be strict JSON.** Comments in it cause Biome to *silently fall back
  to its defaults* rather than erroring — which looks like "my config is being ignored".
- **A file in `public/` silently beats a generated route of the same name.** The favicon
  is `src/pages/favicon.svg.ts`; recreating `public/favicon.svg` makes Astro skip the
  route with only a `warn` and ship the stale file, and `npm run verify` still passes.
  Same trap applies to `robots.txt`. After a build, check `dist/` for what actually shipped.
- **`@theme` prunes unused `--color-*` tokens.** A token referenced from a hand-authored
  rule in a file Tailwind processes survives (verified — `--color-focus` is used only by
  the `:focus-visible` rule and is in the output). But a `.astro` scoped `<style>` block
  is invisible to Tailwind and would *not* mark a token used. There are no `<style>`
  blocks in `src/` — keep it that way, or switch to `@theme static`.
- **An alpha modifier on a token that already has alpha compounds** rather than replacing
  it: `bg-overlay/70` gives 0.55 × 0.70 ≈ 0.385, which is why `overlay-hover` is its own
  token rather than a modifier.
- Node 22.16 locally emits an `EBADENGINE` warning for `undici`, which wants ≥22.19.
  Harmless so far; upgrading local Node to the latest 22.x clears it.

## Reference

Full docs: https://docs.astro.build — worth consulting before related work:

- [Routing, dynamic routes, middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/) (none
  installed — see Conventions first)
- [Fonts API](https://docs.astro.build/en/guides/fonts/)

## Before launch

`src/consts.ts` and `astro.config.mjs` both carry `TODO`s that must be resolved: the real
domain in `site` (the sitemap, RSS and canonical tags all derive from it), the public
contact email, and the LinkedIn URL. `grep -rn "TODO" src astro.config.mjs` lists them.
