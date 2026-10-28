# The unslop rules

Five passes, always in this order. Spacing first because it is structural and invisible once colour changes; data last because it depends on the type and colour decisions before it.

Each rule says **why** and how it is **checked**. `audit: <id>` means `scripts/audit.js` finds it; `eye` means you have to look.

---

## 1. Spacing: measure, then snap

Vibecoded spacing is guessed per element: 9px here, 14px there, 31px above a heading. Nobody sees a 3px difference, but everybody feels the rhythm is off.

1. **Measure the rendered gap, not the CSS you think applies.** Margins collapse, borders add 1px, line-height adds invisible space above and below text. Use `getBoundingClientRect` or the audit. *Check: audit `spacing/uneven-siblings`.*
2. **Every spacing value comes from one scale:** `4 8 12 16 20 24 32 40 48 64 80 96`. Below 8px, 2px half-steps (2, 6) are allowed for hairline tuning; 1px is a border. *audit: `spacing/off-grid`.*
3. **Repeated siblings sit at identical gaps.** Put `gap` on the parent; never give children individual margins. Nav items, list rows, cards in a row, all identical. *audit: `spacing/uneven-siblings`.*
4. **Proximity shows grouping.** Space inside a group is smaller than space between groups (item gap 4, group gap 24). If two values are close (12 vs 16), they read as a mistake. Make them clearly different or the same. *eye.*
5. **Padding is consistent per component type.** Every card has the same inner padding; every row the same vertical padding. Card padding ≤ the gap between cards' sections. *eye + audit.*
6. **Align to shared edges.** Labels, values and charts inside a card start at the same x. Icons are optically centred on the text cap height, not the line box. *eye.*
7. **Corner radii form a scale of at most four:** e.g. `6 8 12` plus pills. Nested radius = outer radius − padding (or just smaller). *audit: `radius/no-scale`.*

## 2. Surfaces: calm the colour

The vibecoded palette is a purple-to-pink gradient, neon glows and glass. It makes every element shout, so nothing is important.

1. **One neutral ramp plus one accent.** Background, surface, line, muted text, text. The accent (or ink, for a primary button) marks the one primary action and the current state. Nothing else. *audit: `surface/too-many-accents`.*
2. **No gradient backgrounds on app chrome.** Sidebars, cards, buttons and pills are flat. A brand gradient can live in one marketing illustration, not the UI. *audit: `surface/vivid-gradient`.*
3. **No gradient text.** Ever, in product UI. *audit: `surface/gradient-text`.*
4. **No glow.** No coloured `box-shadow`, `drop-shadow` or `text-shadow`. Elevation is a 1px border *or* a soft neutral shadow, not both heavy. *audit: `surface/colored-glow`, `surface/text-glow`.*
5. **Glass is a special effect, not a surface.** `backdrop-filter: blur` only for things that genuinely float over content (a toolbar over a canvas). *audit: `surface/glass` (info).*
6. **Status colours are for status.** Green, amber, red and blue mean something. Use them desaturated, small (a dot, a word), and always with a label. Never for decoration. *eye.*
7. **Contrast is not optional.** Body and muted text ≥ 4.5:1, large text ≥ 3:1. Calm palettes fail this the most: muted grey on off-white is usually 3.5:1. *audit: `contrast/text`.*
8. **Dark mode is not purple.** If it is dark, it is neutral dark (`#111`–`#1a1a1a` surfaces), with the same single accent. *eye.*

## 3. Icons: real icons, not emoji

Emoji render differently per OS, cannot take `currentColor`, have their own baseline and size, and read as a toy.

1. **No emoji in UI chrome:** not in nav, labels, buttons, statuses, headings, badges or empty decoration. Emoji in user-generated content (messages, commit titles) stay. *audit: `icons/emoji`.*
2. **One icon set, one stroke.** Pick the set the project already uses (Lucide, Heroicons, Phosphor, SF Symbols). If none, Lucide. Stroke 1.5 at 16–20px. Never mix sets or mix outline and filled. *eye.*
3. **Icons inherit colour.** `stroke="currentColor"`, muted by default, ink when active. *eye.*
4. **One size per context:** 16 inline with text, 16–20 in nav, 20–24 in empty states. *eye.*
5. **Icons earn their place.** Nav and actions get icons. A card title that already says "Deploys today" does not also need a rocket. Decorative icons that repeat the label are deleted. *eye.*
6. **Status uses a dot or a shape plus a word,** not ✅ ⏳ ❌. *audit: `icons/emoji`.*

## 4. Type: honest type

Slop copy performs excitement: "Ready to ship? 🚀🔥", "blazing fast!!", "Absolutely elite performance". Honest type says what the thing is.

1. **Say what it is.** Names, not hype. `Deploy`, not `✨ Deploy now 🚀`. The heading is the project name, not a greeting. *eye.*
2. **No exclamation marks in UI.** *audit: `type/exclamation`.*
3. **No hype words:** blazing, crushing, elite, epic, insane, magic, supercharge, next-level, game-changing, unleash, yikes. *audit: `type/hype`.*
4. **Sentence case** for headings, labels, buttons and nav. No tracked all-caps eyebrows on every card. *eye.*
5. **A type scale of at most eight sizes,** e.g. `11 12 13 15 20 28`. No half-pixel sizes (12.5, 13.5). *audit: `type/too-many-sizes`.*
6. **Two or three weights,** usually 400/500/600. Weight 800 headlines with gradient fill are the single strongest slop tell. *audit: `type/too-many-weights`.*
7. **Numbers are data.** Real precision (`42.1s`, not `42s`), units, a comparison (`−3.4s this week`), `font-variant-numeric: tabular-nums` so digits do not jiggle. *audit: `type/proportional-figures` (info).*
8. **Monospace for machine strings:** hashes, branch names, IDs, durations in tables. *eye.*
9. **Consistent time format.** `2m`, `18m`, `1h` or `2 minutes ago`, one style, no `2 mins ago!`. *eye.*
10. **Truncate, don't wrap,** in rows and tables: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`. *eye.*

## 5. Data: data that reads

The vibecoded chart is a five-slice donut that spins forever, labelled `94%!!`. It looks like data and says nothing.

1. **Chart the question.** Trend → line or sparkline. History of states → ticks or bars. Part of a whole → a single bar or a donut with two or three parts, and only if the parts really sum. *eye.*
2. **Data never loops.** Charts animate in once (≤ 800ms) and then hold still. *audit: `motion/infinite`.*
3. **Every number has context:** a comparison, a time range, or a target. `99.982% · last 90 days · 1 incident`. *eye.*
4. **Label directly.** Put labels on or next to the series; use a legend only when direct labels collide. Axis labels sparse, in muted mono. *eye.*
5. **Colour encodes one thing.** In a status chart, green/amber/red is the encoding; everything else is neutral. *eye.*
6. **Design the edge states:** empty, loading, zero, error, one data point. *eye.*

---

## The tells (quick scan)

If you see three or more of these, it is vibecoded. Each maps to a rule above.

- purple → pink gradient on the app background, sidebar or primary button
- gradient-filled heading at weight 800
- glowing cards, glowing buttons, glowing text
- emoji as nav icons, card icons, status badges
- "Welcome back, Name! 👋" / "Ready to ship? 🚀" as the page heading
- "✨ New", "PRO ✨", "AI ✨" badges
- exclamation marks and hype adjectives in labels
- tracked uppercase eyebrow on every card
- spacing that is almost consistent (9, 12, 14, 11)
- six different corner radii
- a donut chart that spins, `94%!!` in the middle
- pills with emoji for status (`✅ LIVE`, `⏳ COOKING`)
- glass blur on surfaces that do not float

## Starting tokens

Paste, then adjust the hue of the neutrals and the accent to the brand. Every value in the UI should then be one of these.

```css
:root {
  /* spacing (4pt) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px; --s-8: 32px; --s-10: 40px; --s-12: 48px; --s-16: 64px;
  /* radius */
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-full: 999px;
  /* type */
  --t-xs: 11px; --t-sm: 12px; --t-md: 13px; --t-base: 15px; --t-lg: 20px; --t-xl: 28px;
  --w-regular: 400; --w-medium: 500; --w-semibold: 600;
  /* colour: one neutral ramp, one accent */
  --bg: #fbfaf7; --surface: #ffffff; --line: #e5e2db; --muted: #6a6660; --fg: #17161a;
  --accent: #2456e8;
  --ok: #2f8f57; --warn: #9a6416; --bad: #c2412d; --info: #2456e8;
}
```
