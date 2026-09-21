import type { APIRoute } from 'astro';
import { THEME_HEX } from '../theme';

/**
 * Generated rather than kept in public/ so the mark cannot drift from the palette —
 * same reasoning as robots.txt.ts. A favicon in public/ is a hardcoded pair of hex
 * literals that no colour change will ever reach.
 *
 * TRAP: if `public/favicon.svg` exists, Astro resolves the static file first, logs a
 * `warn` about skipping this route, and ships the stale mark. `npm run verify` still
 * passes. The public/ copy has to be deleted, not just superseded.
 */
export const GET: APIRoute = () => {
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
  <title>MS</title>
  <rect width="64" height="64" rx="14" fill="${THEME_HEX.accent}" />
  <text
    x="32"
    y="33"
    fill="${THEME_HEX.onAccent}"
    font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="30"
    font-weight="650"
    letter-spacing="-1.5"
    text-anchor="middle"
    dominant-baseline="central"
  >MS</text>
</svg>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
