import { SITE } from '../consts';

/** e.g. "7 September 2026" — stable across server and client, unlike toLocaleDateString defaults. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Machine-readable value for <time datetime="…">. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Turns a free-text tag into a URL-safe slug. Must match the logic in /tags/[tag]. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
