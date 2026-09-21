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
 *   surface  → --color-surface  → --shell-050
 *   accent   → --color-accent   → --aqua-600
 *   onAccent → --color-on-accent → --shell-050
 *
 * Note `accent` is the deep teal tier, not the brand aqua #71cfd7: cream text on the
 * bright aqua is 1.73:1, which would make the favicon monogram unreadable. Here it is
 * 6.03:1.
 */
export const THEME_HEX = {
  surface: '#f5fbfb',
  accent: '#076b72',
  onAccent: '#f5fbfb',
} as const;
