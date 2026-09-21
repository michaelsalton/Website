# 08 — Social Links Components

## Context

The footer and contact page currently render social links as plain text buttons. The goal
is a pair of components — `SocialIcon` (atomic) and `SocialsTray` (composition) — that
give socials a bubbly, icon-driven treatment with a light rounded tray, hover scale, and
color change, all wired through the existing theme tokens.

### Original notes

- bubbly icons
- dark icons
- light background tray behind them, rounded corners
- build a component for SocialIcon and then another for SocialsTray that uses the SocialIcon
- Slight enlarge on hover, and color change
- use theme

---

## Design decisions

| Question | Answer |
|----------|--------|
| Where do SVG icons live? | Inline map inside `SocialIcon.astro` (matches hamburger pattern, no icon library needed at 4 icons) |
| Extend SOCIALS with an `icon` field? | No — lookup by `label` keeps `consts.ts` data-only |
| Platforms | GitHub, LinkedIn, Email, RSS (all already referenced across footer/contact) |
| Tray surface | Always `bg-surface-raised` (white pill) regardless of parent — icons are always dark-on-light |
| Hover enlarge | `hover:scale-110` via `transform` (GPU, no reflow, like Card's translate) |
| Hover color | `text-content → text-accent` (6.03 : 1 on raised surface) |
| Icon size | `h-5 w-5` (20 px) + `p-2.5` padding = 40 px touch target (≥ 44 px after 10 % scale) |
| Icon source | Simple Icons (MIT) for GitHub + LinkedIn; generic envelope + broadcast for Email + RSS |

---

## Steps

### 1. Extend `SOCIALS` — `src/consts.ts`

Add Email and RSS entries so they are centrally managed:

```ts
export const SOCIALS = [
  { href: 'https://github.com/michaelsalton', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/', label: 'LinkedIn' },
  { href: 'mailto:michael@lootzysoft.com', label: 'Email' },   // mirrors SITE.email
  { href: '/rss.xml', label: 'RSS' },
] as const;
```

### 2. Create `src/components/ui/SocialIcon.astro`

Single icon link. Key details:

- **Props:** `href`, `label`, `class?`
- **Icon map:** `Record<string, string>` mapping label → SVG `<path>` markup
- **Template:** `<a>` wrapping `<svg>` with `aria-label={label}`, `aria-hidden` on svg
- **Classes:**
  ```
  inline-flex items-center justify-center rounded-xl p-2.5
  text-content hover:text-accent
  transition-[color,transform] duration-(--duration-fast) ease-(--ease-out-soft)
  hover:scale-110
  ```
- **Link hygiene:** `target="_blank" rel="me noopener"` only for external `http` links;
  omitted for `mailto:` and `/rss.xml`
- **Fallback:** if label has no icon entry, render label text instead of empty svg

### 3. Create `src/components/ui/SocialsTray.astro`

Tray container. Key details:

- **Props:** `class?`
- **Imports:** `SOCIALS` from `consts.ts`, `SocialIcon`
- **Template:**
  ```astro
  <div class:list={['inline-flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3', className]}
       role="list" aria-label="Social links">
    {SOCIALS.map(s => <SocialIcon href={s.href} label={s.label} />)}
  </div>
  ```
- Tray is always light (`bg-surface-raised`), so icons always use the normal
  (non-inverse) color scheme — no `inverse` prop needed.

### 4. Update Footer — `src/components/layout/Footer.astro`

- Import `SocialsTray`
- Replace the `<ul class="space-y-2">` block (SOCIALS map + hardcoded RSS link) with
  `<SocialsTray />`
- Remove the now-unused `SOCIALS` import if no other reference remains
- The tray sits inside the `.on-inverse` footer but has its own light surface, so the
  default focus ring (salmon, 5.47 : 1 on white) is correct. If `.on-inverse` overrides
  bleed in, add an inline `style` on the tray to reset `--color-focus`.

### 5. Update Contact page — `src/pages/contact.astro`

- Import `SocialsTray`
- Place `<SocialsTray />` alongside or below the existing "Email me" button
- Accept the duplication of email appearing both as CTA and in the tray — it reinforces
  the contact intent

### 6. Accessibility check

- `aria-label` on each `<a>` (screen readers announce "GitHub", etc.)
- `aria-hidden="true"` on decorative `<svg>`
- `role="list"` + `aria-label` on tray div
- `prefers-reduced-motion` already zeros transitions globally — no extra work
- Focus ring visible on light tray surface (salmon at 5.47 : 1)

---

## Files touched

| File | Action |
|------|--------|
| `src/consts.ts` | Add Email + RSS to `SOCIALS` |
| `src/components/ui/SocialIcon.astro` | **New** |
| `src/components/ui/SocialsTray.astro` | **New** |
| `src/components/layout/Footer.astro` | Replace social `<ul>` with `<SocialsTray />` |
| `src/pages/contact.astro` | Add `<SocialsTray />` |

## Verification

```bash
npm run verify          # lint + typecheck + build must pass
npm run dev             # visual check: footer tray, contact tray, hover scale + color
```

- Confirm icons render at correct size on mobile and desktop
- Tab through icons — focus ring visible on both footer (dark bg, light tray) and contact
  (light bg, light tray)
- Check `prefers-reduced-motion` — hover scale should not animate
- Inspect built output — no extra JS bundle from social components (pure `.astro`)
