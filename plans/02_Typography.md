# 02 — Typography: Space Grotesk + Inter, one responsive ladder

## Context

The colour system landed as a two-layer token architecture with zero hardcoded literals
(`plans/01_Colors.md`). Typography never got the same treatment, and it shows:

1. **There is no typography system at all.** `global.css` contains zero `--text-*`,
   `--leading-*`, `--tracking-*` and `--font-weight-*` tokens — the entire scale is
   Tailwind's stock default, and there are no `h1`–`h6` size rules in `@layer base`.
   Every heading gets its size from a per-element utility string in markup.
2. **81 hardcoded typography utilities across 13 files** — 45 sizes across nine stock
   steps (including one arbitrary `text-[0.7rem]`), 20 weights, 14 `tracking-*`, two
   `leading-*`. The same "page title" recipe (`text-3xl font-bold tracking-tight
   sm:text-4xl`) is duplicated byte-for-byte in `PageLayout` and `ArticleLayout` —
   exactly the drift the colour pass eliminated for `Tag.astro`.
3. **One typeface, no display face.** Inter carries both body and the 60px hero.
   `src/pages/index.astro:16` carries the standing TODO: *"the colour theme has landed;
   the words and the expressive typography still haven't."*
4. **Three weights render synthesized.** Inter is loaded at `[400, 600, 700]` but
   `font-medium` (500) appears 6× in markup; the prose plugin asks for `800` on `h1`; and
   `global.css:273` asks inline code for `500` while JetBrains Mono is loaded at 400 only.
   None of those faces exist — the browser fakes all three.

**Outcome:** one responsive type ladder as a two-layer token system — Space Grotesk for
display, Inter for body — where markup writes exactly one class per element, that class
carries size + line-height + tracking + weight, and Tailwind's stock scale is *deleted*
so a hardcoded size cannot be written.

**Decisions settled up front:** Space Grotesk + Inter; tracking tapers by size rather than
a flat −6%; 80px is the homepage hero alone, with page titles at 56; `--container-prose`
narrows 68ch → 58ch. See Appendix B for how these sit against the source notes.

---

## Architecture: two layers, mirroring the colour system

```
:root { --step-h1: 2rem; @media (min-width:48rem){ --step-h1: 3.5rem } }
        ↓  RAMP — plain CSS vars, stepped at breakpoints.
           Deliberately NOT in @theme, so no `text-step-h1` utility can exist.
@theme { --text-h1: var(--step-h1);
         --text-h1--line-height: 1.05;
         --text-h1--letter-spacing: -0.06em;
         --text-h1--font-weight: 700; }
        ↓  SEMANTIC — the only layer markup may touch.
class="text-h1"                    ← ONE class. Responsive. No `sm:` variant.
```

Two properties make this work, both verified by reading `tailwindcss@4.3.3`'s compiled
engine (`node_modules/tailwindcss/dist/lib.js`) rather than assumed:

- **The `--text-*` namespace carries four things, not one.** The `text-*` utility calls
  `resolveWith(value, ["--text"], ["--line-height", "--letter-spacing", "--font-weight"])`
  and emits all four declarations. So `text-h1` emits size *and* leading *and* tracking
  *and* weight — which is why markup needs no companion classes.
- **The `var()` indirection is preserved, not resolved at build time.** This is the load-
  bearing bit: `resolveWith` returns `l.options & 1 ? l.value : this.#t(n)`, so for a
  normal (non-`inline`) `@theme` it emits the *variable reference* — `font-size:
  var(--text-h1)` — and `--text-h1: var(--step-h1)` lands on `:root` as a real custom
  property. Redefining `--step-h1` in a media query therefore propagates. If Tailwind
  inlined the computed value here the whole design would collapse; it does not.
- **Unitless line-height and `em` tracking scale with font-size automatically.** Only the
  *size* has to change at a breakpoint, so the entire responsive ramp lives in CSS and
  markup never writes a breakpoint variant. Five `--step-*` vars carry the whole ramp,
  instead of restating size, leading, tracking and weight at every breakpoint.

This also reproduces the ladder's **plateaus** exactly — H2 is 56px at both tablet and
desktop. A `clamp()` would interpolate smoothly through that and land ~44px at tablet
width, quietly contradicting the spec. Stepped vars are the faithful implementation.

### The enforcement move

`@theme` gets `--text-*: initial`, `--leading-*: initial`, `--tracking-*: initial`, which
**deletes Tailwind's stock scale**. `text-4xl`, `leading-snug` and `tracking-tight` cease
to exist. Role tokens become the only way to set type, exactly as keeping the colour
palette out of `@theme` makes `bg-aqua-600` impossible.

`--font-weight-*` is trimmed rather than cleared — down to precisely the four faces that
are actually loaded (`normal` 400, `medium` 500, `semibold` 600, `bold` 700).
`font-thin`/`extralight`/`light`/`extrabold`/`black` are removed, so asking for a weight
the browser would have to synthesize is no longer expressible. That is the fix for problem
4 above, made structural rather than a one-time correction.

**`--text-*: initial` is safe, and specifically does not collide with `--text-shadow-*`.**
Namespace clearing is prefix-based (`clearNamespace` walks keys with `startsWith`) *but*
consults an explicit exclusion map, `Qr`, which lists for `--text`:

```
--text-color  --text-decoration-color  --text-decoration-thickness
--text-indent  --text-shadow  --text-underline-offset
```

So the clear removes `--text-xs` … `--text-9xl` and their sub-properties and leaves
`--text-shadow-*` intact. Colour utilities are unaffected on a second count: `text-content`
resolves through a separate `["--text-color", "--color"]` lookup. And `prose`/`prose-lg`
are unaffected because `@tailwindcss/typography` hardcodes literal values and never reads
`--text-*` (verified in its `styles.js`).

> **Two traps in the enforcement.**
>
> 1. Tailwind does **not** error on an unknown utility — it silently emits nothing. A stale
>    `text-4xl` will not fail `npm run verify`; it will just render at 1rem.
> 2. Clearing a namespace does not disable **arbitrary values**. `text-[20px]`,
>    `leading-[1.2]` and `tracking-[-0.05em]` bypass the theme entirely and still compile —
>    in fact the engine emits `line-height: var(--tw-leading, …)`, `letter-spacing:
>    var(--tw-tracking, …)` and `font-weight: var(--tw-font-weight, …)` precisely so a
>    utility can override a token.
>
> The grep in *Verification* is the only gate, and it must cover bracket syntax as well as
> named utilities. Same posture as the colour system's grep.

**Biome handles all of it — checked, not assumed.** `--text-*` is not a legal CSS custom
property name, and `biome check` runs *first* in `npm run verify` with the CSS linter and
formatter both enabled, so a parse failure there would break the whole pipeline. Piping the
ramp + `@theme` block through `biome check --stdin-file-path=src/styles/global.css`
(Biome 2.5.12, with this repo's `css.parser.tailwindDirectives: true`) returns **zero
diagnostics and byte-identical output** — the namespace clears, the `var(--step-*)`
indirection and the double-dash sub-properties (`--text-display--line-height`) all parse
and survive formatting untouched.

---

## The ladder

Nine roles. Names are **size roles, not element names** — the same "roles, not hues"
principle as the colour layer. The right-hand column maps them back onto the labels in
the original notes.

| Token | Mobile | Tablet ≥48rem | Desktop ≥64rem | Weight | Line-height | Tracking | Used for | Notes' label |
|---|---|---|---|---|---|---|---|---|
| `text-display` | 44 | 64 | **80** | 700 | 1.0 | −0.06em | homepage hero only | H1 |
| `text-h1` | 32 | 56 | 56 | 700 | 1.05 | −0.06em | page + article titles | H2 |
| `text-h2` | 28 | 32 | 32 | 600 | 1.15 | −0.045em | section headings | H3 |
| `text-h3` | 18 | 20 | 20 | 600 | 1.2 | −0.03em | card titles, subheads | H4 |
| `text-body` | 16 | 18 | 18 | 400 | 1.6 | −0.02em | **default** body, ledes, hero sub, prose | body / Body-large |
| `text-body-sm` | 16 | 16 | 16 | 400 | 1.65 | −0.02em | secondary + dense body copy | body-s |
| `text-caption` | 14 | 14 | 14 | 400 | 1.5 | −0.01em | meta, dates, nav, buttons | — |
| `text-label` | 13 | 13 | 13 | 600 | 1.2 | **+0.01em** | ALL-CAPS eyebrows, chips | — |
| `text-micro` | 12 | 12 | 12 | 400 | 1.4 | 0 | dense style-guide captions | — |

Only `display` needs all three tiers; everything else steps once, at `48rem`. `caption`,
`label` and `micro` are constant — *"smaller sizes stay the same."*

**`body` is 18px, not 16px** — the notes' `body: 18px` and `Body-large: 18` are the same
step, so `text-body` is the *default* and `@layer base` sets `body { font-size:
var(--text-body) }`. `text-body-sm` is the notes' `body-s`. (No cascade surprise: `rem`
resolves against `html`, not `body`, so the rest of the ladder is unaffected. On mobile the
two coincide at 16px, exactly as the ramp specifies.)

**Why `display` and not `h1`=80.** The notes describe a *size* ladder, and the site has
four heading levels plus a hero. Naming the 80px step `display` keeps `text-h1` on the
thing that is actually an `<h1>` on every page, instead of styling page titles with a
token called `h2`. Each notes label maps one step up the table.

**Why the ladder gains three steps below `body-sm`.** The notes stop at 16px, but the
inventory needs more: `text-sm` appears 17× (dates, nav, buttons, `<dl>` strips),
`text-xs` 8× (uppercase eyebrows, tag chips) and `text-[0.7rem]` once. Those become
`caption` / `label` / `micro`. `label` is the all-caps role and is the only token with
positive tracking, per the notes.

**Why tracking tapers.** The notes specify −6% for headings, which is correct at 80px and
cramped at 20px — optical tracking conventionally scales inversely with size, and this
ladder spans 4×. −6% is kept on `display` and `h1`, easing to −3% at `h3`. Body holds the
specified −2%, all-caps +1%.

**Line-heights** sit inside the specified bands: 100–120% for headings (1.0 → 1.2),
140–175% for body (1.5 → 1.65).

### Weights

Weight is baked into each token, so markup normally writes none. `font-medium` /
`font-semibold` / `font-bold` remain available as *emphasis on top of a role* — the notes
explicitly allow body at regular **or** medium and "body accent" at semibold/bold. The
active nav pill is the one current example.

Note the notes place 20px in the `Body(16–20)` bracket, not `Heading(24+)`, so `text-h3`
at 600 is "body accent" weight — consistent, not an exception.

---

## The typefaces

**Space Grotesk** (display) + **Inter** (body). Both OFL, both on Fontsource, both
self-hosted through Astro's Fonts API with metrics-matched fallbacks — no third-party
request, no layout shift. Verified against `api.fontsource.org`:

| | Weights available | Styles | Taking |
|---|---|---|---|
| Space Grotesk | 300–700, variable | **`normal` only — no italic** | 600, 700 |
| Inter | 100–900, variable | normal + italic | 400, 500, 600 |

Space Grotesk's tight geometric forms hold up at 80px with −6% tracking and echo the
deco palette; Inter stays on body, so the migration's rendering risk is confined to
headings. It is the free half of the notes' *"Sohne + Space Grotesk"* entry.

> **No italic in Space Grotesk.** Never put `italic` on a heading — the browser would
> synthesize a mechanical oblique. Body italic is unaffected; Inter has real italics.

**Inter's weight list changes from `[400, 600, 700]` to `[400, 500, 600]`.** 500 is added
because it is genuinely used (6 call sites + inline code); 700 is dropped because after
migration every bold thing is a heading, and headings are Space Grotesk. File count is
unchanged at 6 (3 weights × 2 styles), plus 2 new Space Grotesk files.

Keep static instances rather than a variable-range request: the browser fetches only the
faces a page actually uses, and eight small statics beat two large variable files here. The
existing "deliberately no `preload`" reasoning in `astro.config.mjs` still holds and gains
two more faces' worth of force.

### How headings get the display face

A `--text-*` token **cannot** carry a font-family — the namespace only supports the three
sub-properties above. So the family is bound in `@layer base` to the *elements*:

```css
:is(h1, h2, h3, h4, h5, h6) { font-family: var(--font-display); }
```

Binding to semantic headings rather than to the size tokens is the right coupling: markup
still writes one class, `.prose` headings are covered for free, and something that merely
*looks* like a heading doesn't inherit the display face by accident. The one deliberate
exception is the `Header.astro` wordmark, an `<a>`, which takes `font-display` explicitly.

`--font-display` survives `@theme` pruning because that hand-authored rule references it —
the same mechanism that keeps `--color-focus` alive today.

---

## Files to change

### 1. `src/styles/global.css` — the core work

- **`:root`** — add the `--step-*` ramp: five vars, plus a `@media (min-width: 48rem)`
  block redefining all five and a `@media (min-width: 64rem)` block redefining only
  `--step-display`. Document that these are deliberately outside `@theme`, in the same
  voice as the palette comment above them.
- **`@theme`** — add `--font-display: var(--font-space-grotesk), …`; add the nine
  `--text-*` roles with their three sub-properties each; add `--text-*: initial`,
  `--leading-*: initial`, `--tracking-*: initial` and the five `--font-weight-*: initial`
  clears; change `--container-prose` to `58ch`.
- **`@layer base`** — add `:is(h1…h6) { font-family: var(--font-display) }` and
  `body { font-size: var(--text-body); letter-spacing: -0.02em }` so 18px is the site
  default. The existing `text-wrap: balance` on headings stays and matters more at 80px.
- **The prose remap** — extend the existing unlayered `.prose` block (unlayered on
  purpose; it must outrank the plugin's cascade layer) so markdown headings land on the
  same ladder:

  ```css
  .prose { font-size: var(--step-body); line-height: 1.6; letter-spacing: -0.02em; }
  .prose h1 { font-size: var(--step-h1);   line-height: 1.05; letter-spacing: -0.06em;  font-weight: 700; }
  .prose h2 { font-size: var(--step-h2);   line-height: 1.15; letter-spacing: -0.045em; font-weight: 600; }
  .prose h3 { font-size: var(--step-h3);   line-height: 1.2;  letter-spacing: -0.03em;  font-weight: 600; }
  .prose h4 { font-size: var(--step-body); line-height: 1.3;  letter-spacing: -0.02em;  font-weight: 600; }
  ```

  The remap is **mandatory, not cosmetic**. Because the plugin hardcodes its own values,
  markdown headings would otherwise keep the plugin's scale — `prose-lg` gives h1 =
  2.667em (48px), h2 = 1.667em (30px), h3 = 1.333em (24px), h4 inheriting 18px — and
  silently diverge from the ladder on exactly the pages with the most heading text. The
  plugin also asks for `font-weight: 800` on h1, a face that is loaded in neither family;
  the remap's `700` is what stops that synthesizing.

  **`prose prose-lg` stays** on `ArticleLayout` and `about.astro`. Its contribution after
  the remap is its vertical rhythm, whose margins are `em`-based and therefore recompute
  against whatever font-size we set — including dropping to 16px on mobile. Overriding a
  heading's size does shift its own margins proportionally (prose-lg's h2 goes 30→32px, so
  its 1.867em top margin goes 56→60px); that is a rhythm change of a few px and needs no
  compensation.
- **Inline code weight** — the rule at `global.css:273` asks for `font-weight: 500`, but
  JetBrains Mono is loaded at 400 only, so it renders synthesized. Set it to `400`; the
  aqua wash already marks inline code. (Alternative: add 500 to the mono entry — one more
  file for a weight nothing else needs.)

### 2. `astro.config.mjs`

Add the Space Grotesk entry (`provider: fontProviders.fontsource()`, `name:
'Space Grotesk'`, `cssVariable: '--font-space-grotesk'`, `weights: [600, 700]`,
`styles: ['normal']`, `subsets: ['latin']`, fallbacks matching Inter's). Change Inter's
`weights` to `[400, 500, 600]`. Update the file-count arithmetic in the existing
`preload` comment.

### 3. `src/components/seo/BaseHead.astro`

Add `<Font cssVariable="--font-space-grotesk" />` beside the two existing tags.

### 4. Markup migration — 13 files

Every stock utility becomes one role token. The mapping, applied consistently:

| Was | Becomes |
|---|---|
| `text-4xl font-bold tracking-tight sm:text-6xl` (hero h1) | `text-display` |
| `text-3xl font-bold tracking-tight sm:text-4xl` (page/article h1) | `text-h1` |
| `text-4xl font-bold tracking-tight sm:text-5xl` (404 h1) | `text-h1` |
| `text-2xl font-semibold tracking-tight` (section h2) | `text-h2` |
| `text-xl font-semibold tracking-tight` (styles h2) | `text-h2` |
| `text-lg font-semibold` (card h3) | `text-h3` |
| `text-lg` / `text-lg sm:text-xl` (lede, hero sub) | `text-body` |
| `text-sm` (dates, nav, buttons, `<dl>`, captions) | `text-caption` |
| `text-sm font-medium uppercase tracking-wide` (eyebrow) | `text-label uppercase` |
| `text-xs uppercase tracking-wide` (card meta) | `text-label uppercase` |
| `text-xs` (tag chips, demo button) | `text-micro` |
| `text-[0.7rem] leading-snug` (Swatch value) | `text-micro` |
| `text-2xl font-semibold` (Swatch "Aa") | `text-h2` |
| bare `font-semibold tracking-tight` (wordmark) | `text-h3 font-display` |

Representative files: [PageLayout.astro:19-20](src/layouts/PageLayout.astro#L19-L20) and
[ArticleLayout.astro:40-47](src/layouts/ArticleLayout.astro#L40-L47) (the duplicated title
recipe), [index.astro:19-63](src/pages/index.astro#L19-L63) (hero + both section headings —
also delete the TODO at L16-17, which this pass resolves),
[Card.astro:24-35](src/components/ui/Card.astro#L24-L35),
[Swatch.astro:40-46](src/components/ui/Swatch.astro#L40-L46),
[Header.astro:13-19](src/components/layout/Header.astro#L13-L19),
[Button.astro:21](src/components/ui/Button.astro#L21). Remaining: `Footer.astro`,
`Tag.astro`, `DemoFrame.astro`, `404.astro`, `contact.astro`, `styles.astro`,
`projects/[...slug].astro`.

Two specifics worth calling out:

- **`Header.astro:13`** — the wordmark has *no* size class today and inherits 1rem. It
  gains `text-h3 font-display` (20px), which also restores a real size gap: the wordmark
  and the nav currently sit 2px apart.
- **`Swatch.astro:45`** — `text-[0.7rem]` is the only arbitrary type value in the
  codebase and the exact thing the namespace clear is meant to prevent.

**Not in scope:** the `sm:px-6 sm:py-16` spacing variants. The ramp uses `48rem`/`64rem`
while existing spacing uses `sm:` (40rem) — that mismatch is intentional and spacing is a
separate pass.

### 5. `--container-prose`: 68ch → 58ch

**This token is load-bearing in two places.** `--container-prose` is not part of
Tailwind's stock theme (confirmed absent from `theme.css`), so `max-w-prose` works here
*only* because this project defines it — meaning the change also narrows the five
`max-w-prose` call sites (`PageLayout` lede, `404`, `contact`, `styles` ×3), not just
`.prose`. That is the desired outcome: one measure everywhere. `ch` is the advance width
of "0" and average lowercase glyphs are narrower, so 58ch renders ≈62–66 characters —
the top of the notes' 50–60 target, with enough room for inline code and long
identifiers.

### 6. `src/pages/styles.astro` — a typography section

The style guide documents every colour token and **throws at build time** if one is
undocumented (L140–153). Type deserves the same. Add a fourth `<section>` following the
page's existing pattern (h2 + description + grid) that parses `--text-*` out of
`global.css?raw` the way `palette` and `declared` already parse colours, renders each role
as a live specimen at its real size, and asserts bidirectionally that every token in the
stylesheet is documented and every documented token exists. The page is already `noindex`
and excluded from the sitemap.

### 7. `AGENTS.md`

Add a **Typography** convention section mirroring the Colours one: the two layers, the
nine roles, the "one class per element" rule, the namespace-clear enforcement, the
no-italic-on-headings constraint, and the fact that an unknown utility fails silently. Note
`--font-display` as a fourth thing that must not be reached for directly. `src/theme.ts`
is unaffected — the favicon route already uses a system font stack deliberately, since a
rasteriser cannot reach a webfont.

---

## Verification

```bash
npm run verify                    # biome + astro check + build
npx astro dev --background        # then: astro dev logs
```

**No hardcoded typography** — all four greps must return zero hits in `src/`. They cover
bracket syntax because arbitrary values survive the namespace clear, and they match
breakpoint-prefixed forms because `:` is a non-word character, so `\b` matches after it.

```bash
# stock sizes, and any arbitrary size
grep -rnE '\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|\btext-\[' src
# leading / tracking in markup — the tokens own these now (also catches leading-[…])
grep -rnE '\b(leading|tracking)-' src
# weights outside the four loaded faces, and arbitrary weights/families
grep -rnE '\bfont-(thin|extralight|light|extrabold|black)\b|\bfont-\[' src
# breakpoint variants on type — the ramp is in CSS, markup must not restate it
grep -rnE '\b(sm|md|lg|xl):text-' src
```

No role token trips these: the size pattern is anchored at `text-`, and what follows in
`text-body-sm` is `body`, not `sm`.

**Fonts actually load, and nothing is synthesized:**

- `ls dist/_astro/*.woff2` → 8 files (Inter 400/500/600 × 2 styles, Space Grotesk 600/700).
- DevTools → Network, filter Font, on `/` and `/blog/hello-world`: every fetched file is
  one of those; nothing 404s.
- DevTools → Rendering → **"Show synthetic fonts"** / the Fonts pane on a heading and on
  inline code: no italic or bold synthesis reported anywhere.

**The ramp steps correctly.** Resize across the two thresholds and check computed
`font-size` on the hero `<h1>`:

| Width | display | h1 | h2 | h3 | body |
|---|---|---|---|---|---|
| 375px | 44 | 32 | 28 | 18 | 16 |
| 900px (≥48rem) | 64 | 56 | 32 | 20 | 18 |
| 1440px (≥64rem) | **80** | 56 | 32 | 20 | 18 |

The `48rem` step must move five sizes at once and the `64rem` step must move only
`display`. If a size is stuck, Tailwind resolved `var(--step-*)` eagerly instead of
emitting the indirection — that would invalidate the architecture, so check it first.

**Budget unaffected** — the whole system is CSS, so:

```bash
grep -c '<script[^>]*src=' dist/index.html      # → 0
```

Lighthouse ≥95 on `/` and `/blog/hello-world`, with CLS still 0 (the metrics-matched
fallbacks are what guarantee this — Space Grotesk is a new face on the critical path for
the 80px hero).

**Visual pass** at `localhost:4321`:

| Route | Look for |
|---|---|
| `/` | 80px Space Grotesk hero, tight; 32px section heads; card titles 20px; nothing at a stock size |
| `/projects` | page title 56px; card meta as all-caps `label` with positive tracking |
| `/blog/hello-world` | article title 56px; markdown h2/h3 on the ladder in the display face; body 18px at 58ch; inline code not fake-bold |
| `/styles` | the new typography section; build fails if a `--text-*` token is undocumented |
| `/404` | 56px title, mono "404" |

**Regression checks:** the duplicated page-title recipe exists in neither layout. Tab
through `/` and the footer — focus rings unchanged. Toggle OS dark mode — the site must
not change. `prefers-reduced-motion` — unaffected, but confirm the demo still renders one
static frame.

---

## Appendix A — the rest of the shortlist, for later reference

Kept because swapping the display face later is a **one-line change**: the ladder, the
ramp, the prose remap and all 13 migrated files reference `--font-display`, so only the
`astro.config.mjs` entry and the token's value move. Nothing below invalidates the plan.

| Candidate | Licence | Reachable how | Note |
|---|---|---|---|
| **Inter** | OFL | `fontsource()` ✅ **in use** | 100–900, italics. The body face. |
| **Space Grotesk** | OFL | `fontsource()` ✅ **in use** | 300–700 variable, **no italic**. The display face. |
| Work Sans | OFL | `fontsource()` | Warmer/humanist. Closer to Inter, so weaker display contrast. |
| Poppins | OFL | `fontsource()` | Geometric, single-storey `a`. Wide round forms resist −6% tracking. |
| Söhne | Commercial — Klim | purchase → `local()` | The paid half of the notes' Söhne + Space Grotesk pairing. |
| Neue Montreal | Commercial — Pangram Pangram | purchase → `local()` | |
| GT America | Commercial — Grilli Type | purchase → `local()` | Pairs with Circular Std in the notes. |
| Circular Std | Commercial — Lineto | purchase → `local()` | |
| BDO Grotesk | Commercial — Blaze Type | purchase → `local()` | |
| ASTA Sans | Commercial | purchase → `local()` | Not on Fontsource. |
| Proxima Nova Condensed | Commercial — Mark Simonson | **`adobe()`** or purchase → `local()` | Cheapest commercial path — see below. |
| Sailors | Commercial, display/script | purchase → `local()` | Notes pair it with Proxima Nova Condensed as a display accent. |

**Astro 7 ships more providers than Fontsource** (all confirmed exported from
`astro/config`'s `fontProviders`): `adobe`, `bunny`, `fontshare`, `fontsource`, `google`,
`googleicons`, `local`, `npm`. Two matter here:

- **`fontProviders.adobe(config)`** takes an Adobe Fonts web-project id. Proxima Nova is
  served by Adobe Fonts, so with a Creative Cloud plan that candidate needs no font files
  and no purchase — just the project id. It is the only commercial name on the list with a
  subscription path.
- **`fontProviders.local()`** takes no arguments; the family entry supplies
  `variants: [{ src: ['./src/assets/fonts/Foo-Bold.woff2'], weight: 700, style: 'normal' }, …]`,
  one variant per `@font-face`. Weight and style are inferred from the file if omitted, and
  a variable font takes a range (`weight: '100 900'`).

  > Astro's own guidance: **do not** put the `.woff2` files in `public/` — they get copied
  > into the build output and ship duplicated. `src/assets/fonts/` is the right home, which
  > is also where `content.config.ts` already expects `src/assets/` to exist.

**If a commercial face lands later,** check two things beyond the licence: whether it has a
real italic (Space Grotesk does not, and the base rule binds the display face to every
`<h*>`), and whether its metrics need the `fallbacks` array retuned — Astro generates the
metrics-matched fallback from the first entry, which is what keeps CLS at 0.

---

## Appendix B — the source notes, verbatim

Kept so the ladder above can be checked against what was actually specified. Every line is
implemented; the three deviations are marked.

```
- H1: 80px    - body: 18px    - H2: 56px    - H3: 32px    - body-s: 16px

- desktop --> tablet --> mobile
- H1: 80 -- 64 -- 44
- H2: 56 -- 56 -- 32
- H3: 32 -- 32 -- 28
- H4: 20 -- 20 -- 18
- Body-large: 18 -- 18 -- 16
- Smaller sizes stay the same

- Body(16-20): regular, medium
- Body accent(16-20): semibold, bold
- Heading(24+): semibold, bold

- Line Height
- 140%-175% for body text
- 100%-120% for heading

- Line length: 50-60 characters per line is optimal line length

- Tracking
- Body text: -2%    - Heading: -6%    - ALL CAPS: 1%
```

**Three deliberate deviations**, all settled before this plan was written:

1. **Tracking tapers** rather than holding −6% across every heading — −6% at 80/56,
   −4.5% at 32, −3% at 20. One value across a 4× size range is either loose at the top or
   cramped at the bottom.
2. **The 80px step is named `display` and is the homepage hero alone**; page and article
   titles take the 56px step. Each notes label therefore maps one row up the ladder table.
3. **The measure is 58ch, ≈62–66 rendered characters** — the top of the 50–60 target
   rather than its middle, because `ch` is the advance width of "0" and average lowercase
   glyphs are narrower, and because technical prose carries inline code and long
   identifiers that break badly in a narrower column.
