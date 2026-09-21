# 03 — Button System

## Goal

Replace the current three-variant Button component (`primary | secondary | inverse`) with
a five-variant system that covers every interaction pattern on the site. Every clickable
element must use `Button.astro` — no hardcoded `<a>` or `<button>` with inline styles
anywhere in the codebase.

---

## The five variants

### 1. `filled` (default)

Solid background fill, light text. The primary CTA.

- **Idle:** `bg-accent`, `text-on-accent`, rounded-lg
- **Hover:** background shifts to `accent-hover`; subtle scale-up (`scale-[1.02]`) and
  a soft box-shadow fade-in for a "lift" feel
- **Active / pressed:** scale snaps back to 1, shadow drops
- **Focus-visible:** standard salmon focus ring (inherited from global `:focus-visible`)

### 2. `outline`

Transparent fill, visible border. The secondary/supporting action.

- **Idle:** `border border-line-strong`, `text-content`, transparent background
- **Hover:** border colour transitions to `accent`, text transitions to `accent`,
  faint `bg-accent-soft/10` wash fades in behind the text
- **Active:** wash deepens slightly
- **Focus-visible:** standard focus ring

### 3. `underline`

No background, no border. Text with animated underline — for inline or lightweight nav
actions.

- **Idle:** `text-accent`, no underline visible (pseudo-element scaled to 0 on X)
- **Hover:** pseudo-element `::after` scales to full width, `bg-accent` underline slides
  in from the left (or center-out), 2px tall, offset a few px below the baseline
- **Active:** underline stays, text shifts to `accent-hover`
- **Padding:** minimal — just enough for the focus ring to not clip (`px-1 py-0.5`)

Implementation note: the underline is a `::after` pseudo-element with
`transition: transform`, not `text-decoration` (which can't be animated smoothly). This
means the underline animation must live in `global.css` as a utility rule (`.btn-underline::after`),
since `.astro` scoped `<style>` blocks are invisible to Tailwind's token pruner (see
Known Issues in AGENTS.md).

### 4. `press`

Raised, physical button with a bottom shadow that compresses on click — the "pushable
button" effect.

- **Idle:** `bg-accent`, `text-on-accent`, a visible `box-shadow` on the bottom edge
  using `accent-hover` (darker teal) to simulate depth — roughly
  `0 4px 0 0 var(--color-accent-hover)`
- **Hover:** shadow grows slightly (`0 5px 0 0`), button translates up 1px
  (`-translate-y-px`)
- **Active:** shadow collapses to `0 1px 0 0`, button translates *down*
  (`translate-y-[3px]`) — the physical "push" — with a very fast transition
  (`duration-[75ms]`)
- **Focus-visible:** standard focus ring
- **Transition:** `transition-all duration-(--duration-fast)`, with active state
  overriding to `75ms` for snap

### 5. `text`

Bare text, no decoration, no background. For header nav links, breadcrumbs, "read more"
links, footer links — anywhere the context already implies interactivity.

- **Idle:** `text-content-muted`, no background, no border, no underline
- **Hover:** `text-accent`
- **Active:** `text-accent-hover`
- **Padding:** compact (`px-2 py-1`) — just enough for a clean focus ring

---

## Inverse support

The current `inverse` variant exists for buttons on `surface-inverse` (the footer's ink
band). Rather than a sixth variant, inverse behaviour is a **modifier prop**:

```astro
<Button variant="filled" inverse>CTA on dark</Button>
<Button variant="text" inverse>Link on dark</Button>
```

When `inverse` is truthy, token swaps:

| Normal token        | Inverse replacement      |
|---------------------|--------------------------|
| `bg-accent`         | `bg-accent-soft`         |
| `text-on-accent`    | `text-content`           |
| `hover:bg-accent-hover` | `hover:bg-accent-soft/80` |
| `text-content`      | `text-content-inverse`   |
| `text-content-muted`| `text-content-inverse`   |
| `text-accent`       | `text-accent-soft`       |
| `border-line-strong`| `border-content-inverse` |

This keeps the variant count at 5 while still covering the footer.

---

## Component API

```ts
type Props = {
  variant?: 'filled' | 'outline' | 'underline' | 'press' | 'text';
  inverse?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
} & Omit<HTMLAttributes<'a'> & HTMLAttributes<'button'>, 'href' | 'type'>;
```

- Default variant: `filled` (replaces current `primary` default)
- `href` still controls `<a>` vs `<button>` rendering
- `class` pass-through preserved for layout overrides (margins, width)

---

## Migration map

Every current usage must be updated in the same PR:

| File | Current | New |
|------|---------|-----|
| `src/pages/index.astro` | `<Button href="/projects">` (primary) | `variant="filled"` (default) |
| `src/pages/index.astro` | `variant="secondary"` | `variant="outline"` |
| `src/pages/contact.astro` | primary | `variant="filled"` (default) |
| `src/pages/contact.astro` | `variant="secondary"` | `variant="outline"` |
| `src/pages/404.astro` | `variant="secondary"` | `variant="outline"` |
| `src/components/layout/Footer.astro` | `variant="inverse"` | `variant="filled" inverse` |
| `src/components/layout/Header.astro` | hardcoded nav `<a>` tags | `variant="text"` |

---

## CSS work in `global.css`

The `underline` variant's `::after` pseudo-element needs a rule in `global.css` (not a
scoped `<style>` block — those are invisible to Tailwind's pruner). Add in `@layer
utilities`:

```css
.btn-underline {
  position: relative;
}

.btn-underline::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-fast) var(--ease-out-soft);
}

.btn-underline:hover::after {
  transform: scaleX(1);
}
```

No new `@theme` tokens needed — the existing semantic palette covers every state.

---

## New tokens needed

None. The existing palette (`accent`, `accent-hover`, `accent-soft`, `on-accent`,
`content`, `content-muted`, `content-inverse`, `line-strong`) covers all five variants
plus their inverse forms.

---

## Acceptance criteria

- [ ] `Button.astro` supports all 5 variants + `inverse` modifier
- [ ] Every `<Button>` call site in `src/` uses the new variant names
- [ ] No hardcoded `<a>` or `<button>` elements with inline/ad-hoc colour classes
      remain outside of `Button.astro` (exception: the demo toggle in `DemoFrame.astro`
      which is a custom element with its own semantics)
- [ ] `npm run verify` passes (lint + typecheck + build)
- [ ] Keyboard focus ring visible on every variant
- [ ] `prefers-reduced-motion` respected (transitions already go to ~0ms globally)
- [ ] No new hex literals, `rgb()`, or stock Tailwind colours introduced
- [ ] Header nav links use `variant="text"` instead of bare `<a>` tags
