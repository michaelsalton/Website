# michaelsalton.com

Personal portfolio and writing — a static site built for speed: no application
JavaScript on content pages, and interactive WebGL demos that load only when scrolled to.

Built with [Astro 7](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com),
and TypeScript. Deployed on [Vercel](https://vercel.com).

## Quickstart

Requires Node ≥ 22.12 (see [.node-version](.node-version)).

```bash
npm install
npm run dev      # http://localhost:4321
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | `astro check` — types only |
| `npm run lint` | Biome format + lint check |
| `npm run lint:fix` | Apply formatting and safe lint fixes |
| `npm run verify` | lint + typecheck + build — run before committing |

## Structure

```
src/
├─ consts.ts            Site metadata, nav, socials — edit here, not in components
├─ content.config.ts    Schemas for the three content collections
├─ content/
│  ├─ projects/         Case studies
│  ├─ posts/            Blog
│  └─ demos/            Interactive demos
├─ lib/                 Content queries, date/slug helpers
├─ layouts/             BaseLayout → PageLayout / ArticleLayout
├─ components/
│  ├─ layout/           Header, Footer
│  ├─ seo/              Meta tags, JSON-LD structured data
│  ├─ ui/               Button, Card, CardGrid
│  └─ demos/            Demo frame + WebGL renderer
├─ pages/               File-based routes (+ generated robots.txt and rss.xml)
├─ styles/global.css    Design tokens, theming, prose styles
└─ assets/              Images processed by Astro's optimizer
```

## Adding content

**A blog post** — create `src/content/posts/my-post.md`:

```yaml
---
title: 'Post title'
description: 'One sentence, used on cards and in search results.'
pubDate: 2026-09-07
tags: ['webgl']
draft: false
---
```

**A project** — create `src/content/projects/my-project.md`. Requires `title`, `summary`,
`role`, and `year`; `featured: true` surfaces it on the homepage. A `cover` image must be
accompanied by `coverAlt` or the build fails.

**A demo** — write the renderer in `src/components/demos/`, register it in the
`RENDERERS` map in `src/pages/demos/[...slug].astro`, then add a markdown entry whose
`component` matches.

In every case, `draft: true` keeps an entry visible in `npm run dev` and out of
production builds.

## Deployment

Vercel builds `main` on push and gives every pull request a preview URL. No pipeline
config is needed — the Astro adapter emits everything Vercel requires.

The site is statically generated. The Vercel adapter is configured so a single route can
later opt into on-demand rendering with `export const prerender = false` — for a contact
form endpoint, say — without converting the whole site to SSR.

GitHub Actions ([ci.yml](.github/workflows/ci.yml)) runs lint, typecheck, and build on
every push and PR as a quality gate.

## Before going live

`site` in [astro.config.mjs](astro.config.mjs) is still `https://example.com`. The
sitemap, RSS feed, canonical tags, and JSON-LD all derive from it, so it has to be set to
the real domain before the first deploy. `grep -rn "TODO" src astro.config.mjs` lists the
remaining placeholders.

## License

Source code is MIT ([LICENSE](LICENSE)). Written content and images are not — please
don't republish the posts or project write-ups.
