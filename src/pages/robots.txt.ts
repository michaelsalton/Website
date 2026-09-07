import type { APIRoute } from 'astro';

/**
 * Generated rather than kept in public/ so the sitemap URL always matches `site` in
 * astro.config.mjs. A hardcoded robots.txt is the classic way to ship a sitemap link
 * pointing at the wrong domain.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
