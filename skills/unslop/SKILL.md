---
name: unslop
description: Turn a vibecoded UI into a calm, honest one. Use when someone asks to unslop, de-vibe, clean up or polish an app screen, dashboard or component, or says it "looks AI-generated"; when a UI has purple gradients, emoji icons, glowing cards, hype copy or uneven spacing; or when they want a before/after "unslopping" animation of their UI. Measures with a bundled audit script, fixes in five passes (spacing, surfaces, icons, type, data) and re-measures until the audit is clean.
---

# unslop

Vibecoded UIs fail in the same five ways, in the same order. This skill fixes them by measuring first, changing tokens rather than individual elements, and proving the result with an audit.

| Pass | Principle | Slop | Unslopped |
|---|---|---|---|
| 1. Spacing | Measure, then snap to a 4pt scale | gaps of 9, 3, 14, 6, 11 | 4, 4, 4, 4, 4 |
| 2. Surfaces | Calm the colour | purple-pink gradient, neon glow | one neutral ramp, one accent |
| 3. Icons | Real icons, not emoji | 🚀 📁 ⚙️ | one line icon set, `currentColor` |
| 4. Type | Honest type | "✨ Deploy now 🚀", "blazing fast!!" | "Deploy", "−3.4s this week" |
| 5. Data | Data that reads | spinning donut, "94%!!" | sparklines, 90-day uptime, context |

The full rulebook, with the reason for each rule and how it is checked, is in [references/rules.md](references/rules.md). Read the sections for the passes you are about to do.

## Workflow

1. **Look.** Open the UI in a real browser (Playwright, the IDE preview, or whatever browser tool you have) at a desktop width. Take a screenshot. Note the slop tells you see (list in rules.md).
2. **Measure.** Run the audit and keep the result as the baseline:
   - Node: `node scripts/audit-url.mjs <url>` (needs `playwright`; exits 1 when errors remain). Add `--json` for the full report.
   - Any "evaluate JavaScript" tool: evaluate the contents of `scripts/audit.js`; the completion value is the report `{ counts, rules, issues }`.
   - DevTools: paste the file; it logs a table.
3. **Fix in pass order: spacing → surfaces → icons → type → data.** Within each pass:
   - Find where values come from (CSS variables, Tailwind config, theme file, component styles) and fix them at the source. Introduce tokens if none exist (starting set in rules.md). Do not hand-tune single elements to make the audit pass.
   - Use the project's existing icon set; if it has none, use Lucide.
   - Rewrite copy to say what things are. Keep meaning, names and data; remove hype, emoji and exclamation marks.
4. **Re-measure after every pass.** Re-run the audit and screenshot. The target is **0 errors**. Every remaining warning is either fixed or justified in your report.
5. **Report.** Give a before → after table of audit counts per rule, before/after screenshots, the tokens you introduced, and anything you deliberately left (with the reason).

## Guardrails

- Do not change behaviour, routes, data, component APIs or the meaning of copy. This is a visual and editorial pass.
- Keep the brand. If there is a brand colour, it becomes the one accent; it is not removed.
- Calm does not mean grey mush. Keep hierarchy: one primary action, clear headings, an accent for the current state.
- Emoji in user-generated content (messages, commit titles, names) stay.
- No new dependencies beyond an icon set when the project has none.

## Audit notes

- Read-only; it never changes the page. Elements inside `[data-unslop-ignore]` are skipped. Use that for non-UI overlays and intentional "before" examples, never to hide real problems.
- Contrast is measured against the nearest opaque ancestor background. Text over images, gradients or sibling backdrops is skipped or misread: check those by eye.
- Rendered gaps are measured in screen pixels, so CSS transforms (zoomed previews) scale them.
- Rules and severities: `spacing/off-grid`, `spacing/uneven-siblings`, `icons/emoji`, `surface/gradient-text` and `contrast/text` (<3:1) are errors. `surface/vivid-gradient`, `surface/colored-glow`, `surface/text-glow`, `surface/too-many-accents`, `type/exclamation`, `type/hype`, `type/too-many-weights`, `type/too-many-sizes`, `radius/no-scale` and `motion/infinite` are warnings. `surface/glass` and `type/proportional-figures` are info.

## Optional: a before/after film

If the user wants to show the work (a tweet, a PR, a case study), `assets/before-after.html` is a complete, dependency-free reference that animates a vibecoded dashboard through the five passes. How it works:

- Each pass is a cumulative class on the app root (`s-space`, `s-color`, `s-icons`, `s-type`, `s-data`). Slop values are inline custom properties; clean values are `.s-*` overrides; CSS transitions do the motion.
- Colours are `@property`-registered custom properties, so the whole theme interpolates from neon to calm.
- Redlines are measured live from the DOM each frame and turn blue with a ✓ when a gap hits its target.
- Text swaps use `data-clean` with a short blur cross-fade.
- A camera (`translate` + `scale`) frames each pass; a small timeline runs the events.
- URL options: `?stage=N` starts at pass N, `&hold` stops at the end of it, `&embed` hides captions. Keys: space pauses, arrows step, `r` restarts.

To adapt it, copy the file, replace the markup with the user's UI, put their current values in as slop and their unslopped values as stage overrides, and update the `MEAS` list to the gaps you fixed. To record it, use a Playwright CDP screencast (`Page.startScreencast`) and encode the frames with ffmpeg.
