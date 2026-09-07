import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// NOTE: import Zod from 'astro/zod', never the standalone 'zod' package — Astro bundles
// its own (Zod 4) and mixing the two produces confusing schema-validation errors.
import { z } from 'astro/zod';

/** Shared by every collection so unfinished entries can sit in the repo safely. */
const draftable = {
  draft: z.boolean().default(false),
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One or two sentences. Used on cards and as the meta description fallback. */
        summary: z.string(),
        role: z.string(),
        stack: z.array(z.string()).default([]),
        year: z.number().int(),
        /** Relative path to an image in src/assets — processed and optimized at build. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
        // Zod 4 style: top-level z.url(), not the deprecated z.string().url().
        repo: z.url().optional(),
        live: z.url().optional(),
        /** Surfaced on the homepage. */
        featured: z.boolean().default(false),
        /** Lower sorts first on the index; ties fall back to year descending. */
        order: z.number().default(0),
        ...draftable,
      })
      // A cover image with no alt text is an accessibility bug that is easy to ship and
      // hard to notice, so make the schema reject it at build time instead.
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'coverAlt is required whenever cover is set',
        path: ['coverAlt'],
      }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    ...draftable,
  }),
});

const demos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/demos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /**
       * Filename (without extension) of the island in src/components/demos/ that renders
       * this demo. Resolved at build time — see src/lib/demos.ts.
       */
      component: z.string(),
      /** Shown before the island hydrates, and as the OG image. */
      poster: image().optional(),
      posterAlt: z.string().optional(),
      tech: z.array(z.string()).default([]),
      ...draftable,
    }),
});

export const collections = { projects, posts, demos };
