import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Drafts are visible while developing and stripped from production builds.
 *
 * Pass this to every `getCollection` call rather than re-inlining the ternary —
 * a page that forgets it will publish unfinished work.
 */
export const isPublished = <T extends { data: { draft: boolean } }>({ data }: T): boolean =>
  import.meta.env.PROD ? !data.draft : true;

/** Newest first. */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', isPublished);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Explicit `order` wins; ties break on year, newest first. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects', isPublished);
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getFeaturedProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.data.featured);
}

export async function getDemos(): Promise<CollectionEntry<'demos'>[]> {
  const demos = await getCollection('demos', isPublished);
  return demos.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

/** Every tag used by a published post, with counts, sorted by frequency then name. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
