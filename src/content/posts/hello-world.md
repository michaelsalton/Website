---
title: 'Starting a portfolio on Astro 7'
description: 'Why this site ships almost no JavaScript, and how the content collections are wired together.'
pubDate: 2026-09-07
tags: ['astro', 'web']
draft: false
---

This is a seed post. It exists so the blog index, the detail route, the tag pages, and
the RSS feed all have something real to render — delete it once there's a genuine first
post.

## What the frontmatter has to contain

`title`, `description`, and `pubDate` are required by the schema in
`src/content.config.ts`. `tags` and `draft` are optional and default to `[]` and `false`.
A missing or mistyped field fails the build rather than rendering a broken page:

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // …
  }),
});
```

## Drafts

Set `draft: true` and the post stays visible in `npm run dev` but disappears from
production builds. That's handled centrally by `isPublished` in `src/lib/content.ts`, so
individual pages can't forget to apply it.

## Code blocks

Shiki renders these at build time with both a light and a dark theme, switched by CSS
variables. No syntax-highlighting JavaScript is sent to the browser.
