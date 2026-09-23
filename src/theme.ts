/**
 * Hex mirrors of the three semantic tokens that are needed outside CSS.
 *
 * The favicon and `<meta name="theme-color">` are consumed by the browser chrome and
 * by the SVG rasteriser, neither of which can resolve a `var()` from a stylesheet — so
 * these values cannot come from `src/styles/global.css` the way everything else does.
 *
 * This is the one accepted duplication in the colour system. Both sides carry a comment
 * pointing at the other; if you change a value here, change the matching palette entry
 * in `src/styles/global.css`, and vice versa.
 *
 *   surface  → --color-surface  → --ink-900
 *   accent   → --color-accent   → --aqua-200
 *   onAccent → --color-on-accent → --ink-900
 */
export const THEME_HEX = {
  surface: '#08191e',
  accent: '#71cfd7',
  onAccent: '#08191e',
} as const;
