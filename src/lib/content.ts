import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Drafts are visible while developing and stripped from production builds.
 *
 * Pass this to every `getCollection` call rather than re-inlining the ternary —
 * a page that forgets it will publish unfinished work.
 */
export const isPublished = <T extends { data: { draft: boolean } }>({ data }: T): boolean =>
  import.meta.env.PROD ? !data.draft : true;

/** Explicit `order` wins; ties break on year, newest first. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects', isPublished);
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}
