import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../consts';
import { getPosts } from '../lib/content';

export const GET: APIRoute = async (context) => {
  // Comes from `site` in astro.config.mjs. Failing loudly beats shipping a feed full of
  // relative links that no reader can resolve.
  if (!context.site) {
    throw new Error('`site` must be set in astro.config.mjs to build the RSS feed.');
  }

  const posts = await getPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
};
