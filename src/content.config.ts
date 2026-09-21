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
        /** Optional external link shown as a pill button at the bottom of the show card. */
        link: z.url().optional(),
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

export const collections = { projects };
