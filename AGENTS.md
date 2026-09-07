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
    ui/                  Button, Card, CardGrid
    demos/               DemoFrame.astro + shaderRenderer.ts
  pages/                 routes; robots.txt.ts and rss.xml.ts are generated routes
  styles/global.css      Tailwind config, design tokens, prose + Shiki theming
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
- **Colours** come from the semantic tokens (`bg-canvas`, `text-ink`, `border-border`,
  `text-accent`). They follow light/dark automatically, so `dark:` is rarely needed.

## Adding a demo

1. Write the renderer in `src/components/demos/`.
2. Register it in the `RENDERERS` map in `src/pages/demos/[...slug].astro`.
3. Add a markdown entry in `src/content/demos/` whose `component` matches the key.

`DemoFrame.astro` is the reference implementation. Copy its behaviour: idle until
visible, renderer behind a **dynamic `import()`** so it's a separate chunk, paused when
off-screen or when the tab is hidden, one static frame under `prefers-reduced-motion`,
and the poster left in place if WebGL2 is unavailable.

Note `client:visible` does **not** work on `.astro` files — client directives only apply
to framework components. The custom element + dynamic import achieves the same thing
without a framework.

**Do not add `three` until a demo actually needs it**, and import it inside the island so
it never lands in the main bundle.

## The budget this site is held to

- **Zero application JS on content pages.** Verified: only `/demos/*` ships a script.
  Check with `grep -c '<script[^>]*src=' dist/<page>/index.html` after a build.
- Islands stay below the fold and load on intersection.
- Lighthouse ≥95 across all four categories.
- Keyboard navigable; visible focus rings; `prefers-reduced-motion` honoured.

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
