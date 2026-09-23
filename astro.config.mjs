// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real domain once purchased. Required for @astrojs/sitemap
  // and the RSS feed to emit absolute URLs — a wrong value here silently ships bad
  // canonical tags and an unusable sitemap, so update this before the first deploy.
  site: 'https://example.com',

  // Default 'static'. The Vercel adapter is here so a single route can later opt into
  // on-demand rendering (`export const prerender = false`) — e.g. the contact form —
  // without converting the whole site to SSR.
  adapter: vercel(),

  // /styles is the internal design reference and is marked noindex — listing it in the
  // sitemap would tell crawlers to fetch a page we've asked them not to index.
  integrations: [mdx(), sitemap({ filter: (page) => !/\/styles\/?$/.test(page) })],

  // Self-hosted, subset, and metrics-matched automatically: no layout shift, no
  // third-party request to fonts.googleapis.com.
  //
  // Deliberately no `preload`. Each entry below expands to one file per weight/style
  // combination — nine files in total (Inter 3x2, Space Grotesk 2, JetBrains Mono 1) —
  // so preloading would fire nine font requests during first paint. Browsers fetch only
  // the faces text actually uses, and Astro's generated fallback metrics hold the layout
  // steady until they arrive, so on-demand wins here.
  fonts: [
    {
      // Body face. 500 is loaded because `font-medium` is genuinely used; 700 is not,
      // because after the typography pass every bold thing is a heading and headings are
      // Space Grotesk. Asking for an unloaded weight means synthesized fake bold.
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      // Display face, bound to h1–h6 in global.css. Oswald is a condensed grotesque
      // with no italic. Only the two weights the ladder asks for (h2/h3 600,
      // h1/display 700).
      provider: fontProviders.fontsource(),
      name: 'Oswald',
      cssVariable: '--font-oswald',
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  markdown: {
    // One Shiki theme, because the site has one theme. `poimandres` is teal/aqua/pink,
    // which sits on-palette, and is bundled with the Shiki that Astro ships.
    //
    // TRAP: `themes` beats `theme` whenever it is non-empty — see the
    // `Object.values(themes).length ? { themes } : { theme }` line in
    // @astrojs/internal-helpers/dist/shiki.js. Adding `theme:` *alongside* a `themes:`
    // key changes nothing and emits no warning, so the key has to be removed rather
    // than overridden.
    //
    // With a single theme Shiki writes literal hex as inline styles instead of CSS
    // variables, so the panel background is re-grounded via `.astro-code` in
    // src/styles/global.css.
    shikiConfig: {
      theme: 'poimandres',
      wrap: true,
    },
  },

  vite: {
    // Tailwind v4 ships as a Vite plugin. Do NOT add @astrojs/tailwind — deprecated for v4.
    plugins: [tailwindcss()],
  },
});
