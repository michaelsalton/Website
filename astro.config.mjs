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

  integrations: [mdx(), sitemap()],

  // Self-hosted, subset, and metrics-matched automatically: no layout shift, no
  // third-party request to fonts.googleapis.com.
  //
  // Deliberately no `preload`. Each entry below expands to one file per weight/style
  // combination, so preloading Inter would fire six font requests during first paint.
  // Browsers fetch only the faces text actually uses, and Astro's generated fallback
  // metrics hold the layout steady until they arrive — so on-demand wins here.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
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
    // Dual themes so code blocks follow the OS colour scheme via CSS variables,
    // with no JS theme switcher and no flash of the wrong theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  vite: {
    // Tailwind v4 ships as a Vite plugin. Do NOT add @astrojs/tailwind — deprecated for v4.
    plugins: [tailwindcss()],
  },
});
