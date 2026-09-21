/**
 * Single source of truth for site metadata, navigation, and social links.
 *
 * Nothing in `src/pages` or `src/components` should hardcode the site title, a nav
 * label, or a social URL — import from here so there is exactly one place to edit.
 */

/** TODO: confirm the public-facing name and contact address before launch. */
export const SITE = {
  title: 'Michael Salton',
  /** Used as the default <title> suffix and in the JSON-LD / OG tags. */
  tagline: 'Software developer, computer graphics',
  description:
    'Portfolio of Michael Salton — real-time graphics, rendering, and web engineering. Projects, writing, and interactive WebGL demos.',
  /** Two candidates exist (michael@lootzysoft.com, msalton6@gmail.com) — pick one. */
  email: 'msalton6@gmail.com',
  locale: 'en',
  /** BCP 47 tag for <html lang> and date formatting. */
  lang: 'en-CA',
} as const;

export const NAV = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '#footer', label: 'Contact' },
] as const;

export const SOCIALS = [
  { href: 'https://www.linkedin.com/in/', label: 'LinkedIn' },
  { href: 'https://github.com/michaelsalton', label: 'GitHub' },
  { href: 'https://www.youtube.com/', label: 'YouTube' },
  { href: `mailto:${SITE.email}`, label: 'Email' },
] as const;

/** Number of entries per page on the blog and project indexes. */
export const PAGE_SIZE = 10;
