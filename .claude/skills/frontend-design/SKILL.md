---
name: frontend-design
description: Folio's premium-futuristic design language. Read before making visual or design decisions in this project — covers color tokens, type scale, spacing rhythm, radius/shadow scale, motion, hierarchy, contrast, and accessibility rules. Applies across Dashboard, Editor, Settings, and any new surfaces.
---

# Folio Frontend Design Skill

Use this skill whenever a visual or design decision is about to be made: choosing a color, size, weight, radius, shadow, or motion. Do **not** default to browser or component-library defaults; the whole point of Folio's look is that nothing is stock.

## When to use

- Adding a new UI surface (screen, panel, card, modal).
- Restyling an existing surface.
- Adding an interactive element (button, input, chip, badge, toggle).
- Anywhere you would otherwise reach for `border-radius: 4px`, `box-shadow: 0 1px 3px rgba(0,0,0,.1)`, `color: #999`, or `transition: all .2s`. Stop, come here, pick from the scales below.

## When NOT to use

- Domain logic, data flow, API shape — this skill is only for the visible layer.
- Debugging a broken layout that is already using the scales correctly — that's a bug, not a design decision.

## Core principle: deliberate, not templated

Every value that ships must exist because it maps to something in this file. If a value doesn't map, either extend a scale here (with reasoning in the commit) or pick the nearest one.

Three signs the work is drifting toward templated:

1. Round numbers everywhere (`padding: 20px`, `border-radius: 8px`) with no relation to the scale.
2. Grey `#999` / black `#000` / pure `#fff` used for text or borders.
3. Default `transition: all` with no chosen duration or easing.

## Color

### Brand foundation

The brand purple is `#7c5cfc` (`F.purple`). Do not shift the hue. Depth comes from paired gradients, tint layers, and glow — not from swapping the hue.

### Tokens (source of truth: `src/shared/theme.ts`)

Use `F.*` for inline styles (prototype-ported screens) or the CSS custom properties in `src/index.css` for Tailwind utilities. Both resolve to the same values.

**Neutrals** — cool-warm balanced, never pure black or pure white for text:
- `F.ink` `#37352f` — primary text
- `F.sub` `#787774` — secondary text
- `F.muted` `#b4b4b0` — tertiary / hints
- `F.border` `#ebebea` — 1px dividers
- `F.hover` `#f1f1ef` — passive hover fill
- `F.active` `#e9e9e6` — pressed fill
- `F.side` `#f9f9f8` — panel background
- `F.bg` `#ffffff` — surface

**Accents** — use exactly these; do not introduce ad-hoc hues:
- `F.purple` `#7c5cfc` — primary brand + interactive
- `F.purpleL` `#f3f0ff` — purple tint background
- `F.orange` `#ff8c42` — warning / attention
- `F.pink` `#e85d8f` — audio type
- `F.teal` `#2dd4a8` — link type / positive secondary
- `F.blue` `#4a9eff` — file/image type / info
- `F.green` `#44b556` — success / confirmed
- `F.yellow` `#f0b429` — AI / highlight
- `F.red` `#eb5757` — destructive

### Layering with alpha

Instead of new hues, add depth by layering an accent at low alpha. Use the appended-hex-alpha convention already in the codebase:

- `+ '08'` (3%) — barely-there tint background
- `+ '0c'` (5%) — resting card fill on brand accent
- `+ '14'` (8%) — icon avatar background
- `+ '22'` (13%) — hover / selected fill
- `+ '40'` (25%) — subtle border on colored surface
- `+ '55'`–`'88'` — shadow / glow tint

Example:
```css
background: #7c5cfc0c;    /* resting tinted card */
border: 1px solid #7c5cfc22;
box-shadow: 0 8px 30px #7c5cfc22;
```

### Gradients

Reserved for premium moments — hero panels, primary CTAs, avatar chips. Two-stop, same-family:

- Brand: `linear-gradient(135deg, #7c5cfc, #a78bfa)`
- Warm accent: `linear-gradient(135deg, #ff8c42, #2dd4a8)`
- Sale / featured: `linear-gradient(135deg, #7c5cfc, #e85d8f)`

Do not stack gradients on top of gradients; the surface underneath should be flat.

### Contrast rules

- Text on `F.bg`: always `F.ink` or `F.sub`. Never `F.muted` for body copy — muted is for labels ≤ 10px only.
- Text on tinted accent (e.g. `F.purple + '14'`): keep text as the accent hex or `F.ink`. Never white on 8-13% tints.
- White text is reserved for solid accent fills (`background: F.purple`, `background: F.red`) and dark surfaces.

## Typography

Fonts are loaded once at the top of `index.css`. Do not import Google Fonts inline in components.

- `SANS` `'DM Sans', system-ui, sans-serif` — every UI surface by default.
- `SERIF` `'DM Serif Display', Georgia, serif` — reserved for hero headlines on the Dashboard and marketing surfaces. Never for body copy or controls.

### Type scale (px, tight)

Use these values exactly. Anything else is drift.

| Token | Size | Weight | Use |
|---|---|---|---|
| `tx-hero` | 40 | 800 | Landing hero, dashboard headline |
| `tx-h1` | 24 | 800 | Screen title |
| `tx-h2` | 18 | 700 | Section title inside a screen |
| `tx-h3` | 15 | 700 | Card title |
| `tx-body` | 13 | 500 | Default body |
| `tx-body-strong` | 13 | 700 | Emphasized body |
| `tx-ui` | 12 | 600 | Buttons, inputs, tabs |
| `tx-label` | 11 | 700 | Field labels, tab labels |
| `tx-cap` | 10 | 700 | Uppercase micro-labels (`letter-spacing: 0.5–0.9`) |
| `tx-hint` | 9.5 | 600 | Meta text under items |

Line-height:
- Headings: `1.1`
- Body: `1.45`
- Micro labels (`tx-cap`, `tx-hint`): `1.25`

Never use `letter-spacing` on body copy. Only on uppercase micro-labels (`0.5px`–`0.9px`).

## Spacing rhythm

Single scale, tight increments — the app is dense.

`0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 56, 72`

Rules:
- Card interior padding: `12` (dense) or `14` (default) or `16` (spacious).
- Gap between siblings in a stack: `6`, `8`, or `10`. Never `5` or `7`.
- Section gap on a screen: `24` or `32`.
- Icon-to-label gap in a control: `6` (small icon 12–13px) or `8` (icon 16px+).

## Radius scale

`0, 4, 6, 7, 8, 9, 10, 12, 99 (pill)`

- `4` — tiny chips
- `6` — inputs, secondary buttons
- `7`–`8` — icon avatars, small cards
- `9`–`10` — cards, panels, primary buttons
- `12` — modals, hero cards
- `99` — pills, avatars, badges

Never `5`, `11`, `15`, `20`. Never `border-radius: 50%` on non-circular boxes.

## Shadow + glow

Three levels of elevation; brand-tinted at rest, neutral at high elevation.

- `shadow-1` — resting card: `0 1px 3px rgba(0,0,0,.06)`
- `shadow-2` — hover / raised: `0 4px 14px rgba(0,0,0,.10)`
- `shadow-3` — modal / popup: `0 8px 30px rgba(0,0,0,.15)`
- `glow-brand` — premium accent: `0 8px 30px ${accent}22, 0 2px 6px ${accent}18`
- `glow-focus` — focus ring: `0 0 0 3px ${F.purple}30`

Rule: if a surface uses a brand-tinted glow, its border is either `1px solid ${accent}22` or none. Do not stack a hard grey border on top of a brand glow.

## Motion

All transitions use these durations and easings; nothing else.

- `micro` `120ms` — color/background-color hover on tiny controls.
- `standard` `160ms` — the default. Buttons, cards, tabs, inputs.
- `expressive` `220ms` — panels sliding, popovers, modals.

Easings:
- Default: `cubic-bezier(.2, .8, .2, 1)` — for enter and hover.
- Exit: `cubic-bezier(.4, 0, 1, 1)` — for close/dismiss.

Never `transition: all`. Always list the properties: `transition: background-color 160ms, box-shadow 160ms, transform 160ms`.

Interactive elements should lift on hover (`translateY(-1px)`) and press down slightly (`translateY(0)`) — but only when the surface is a card or a primary CTA. Do not lift text buttons.

## Focus

Keyboard focus is required on every interactive element. Reuse the class from `src/features/editor/stationStyle/tokens.ts`:

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg
```

For inline-style components, apply `outline: 2px solid ${F.purple}; outline-offset: 2px;` inside a `:focus-visible` selector via a CSS class or a small helper.

## Hierarchy

On any screen there is exactly **one** primary action visible at a time. Anything else drops to secondary (outlined) or tertiary (text) treatment.

- Primary: solid `F.purple` fill, white text, `shadow-2`, hover `translateY(-1px)`.
- Secondary: `F.bg` fill, `1px solid F.border`, `F.ink` text.
- Tertiary: transparent, `F.sub` text, hover `F.hover` fill.
- Destructive: `F.red + '08'` fill, `1px solid F.red + '30'`, `F.red` text.

## Component patterns

- **Card**: `background: F.bg; border: 1px solid F.border; border-radius: 10; padding: 14; box-shadow: shadow-1;` hover `shadow-2 + translateY(-1px)`.
- **Input**: `padding: 8px 10px; border-radius: 7; border: 1px solid F.border; font-size: 12; font-weight: 500;` focus `border-color: F.purple; box-shadow: 0 0 0 3px F.purple + '22';`
- **Chip / Pill**: `padding: 2px 8px; border-radius: 99; font-size: 10; font-weight: 700;` colored variants use `accent + '14'` fill and `accent` text.
- **Icon avatar** (used with a lucide icon): 22–30px square, `border-radius: 8` or `50%`, `background: accent + '14'`, icon 12–14px at `color: accent`.

## Accessibility contract

- Every icon-only button gets `aria-label`.
- Every input gets a `<label>` or `aria-label`.
- Color contrast: body text ≥ 4.5:1, large text ≥ 3:1 against its background. `F.muted` (#b4b4b0) fails on `F.bg` for body sizes — only use it for ≥ 14px semibold or larger.
- Focus ring is never removed globally. If you turn off `outline`, add a visible `:focus-visible` alternative.
- Interactive area: minimum 32×32 for pointer, 44×44 for touch.

## What to do when in doubt

1. Check `theme.ts` for a token that fits.
2. Check `src/shared/ui/` for an existing component that already made this decision — reuse it.
3. Check the scales in this file and pick the nearest one.
4. Only extend a scale if you've done 1–3 and none fit. When you extend, add the reasoning at the top of the diff.
