# WHANE — Shopify Theme (Online Store 2.0)

A radically reduced streetwear storefront. Two colors only — **Cobalt `#1B2BC4`**
on **White `#FFFFFF`** — a condensed display wordmark (**`WHANE.`**), monospace
meta type, flat/square/no-shadow surfaces, and generous intentional whitespace.

This theme implements the **three homepage directions** from the design handoff
as interchangeable OS 2.0 templates so the brand can compare and pick.

## The three directions

| Template | Direction | Assign in admin as |
|---|---|---|
| `templates/index.json` | **01 — Maximal reduziert** (gallery): giant wordmark, one product, minimal nav | *default homepage* |
| `templates/index.drop.json` | **02 — Drop-fokussiert** (scarcity): the homepage *is* the current drop — availability bar + live countdown + reserve | assign a page/home to template `index.drop` |
| `templates/index.lookbook.json` | **03 — Editorial / Lookbook**: full-bleed on-figure image, sparse white overlay, hidden shop entrance | assign to template `index.lookbook` |

To switch the live homepage, change which `index*` template is active
(Online Store → Themes → Customize, or set the home page's template), or copy a
variant's sections into `index.json`.

### Local preview (no Shopify needed)
Open `preview/index.html` in a browser — it renders all three directions at
1440px desktop width using the real Druk Condensed font and the live countdown.

## Structure
```
assets/    whane.css · drop-countdown.js · DrukCondLCGSuper(.ttf/Italic)
layout/    theme.liquid
sections/  wordmark-hero · drop-hero · editorial-lookbook
           whane-header · minimal-footer
           main-product · main-collection · main-cart · main-page · main-404
templates/ index · index.drop · index.lookbook · product · collection · cart · page · 404
config/    settings_schema.json · settings_data.json
locales/   en.default.json
```

## Brand rules enforced in `assets/whane.css`
- Colors come from theme settings (`color_cobalt`, `color_white`) — no third color.
- `border-radius:0` and `box-shadow:none` are forced globally.
- Display face: **Druk Condensed** via `@font-face` (licensed files included),
  **Anton** (Google Fonts) as metric fallback. Body/meta: `Courier New` monospace.
- The diagonal stripe texture (`.whane-placeholder--*`) is **only** an
  image placeholder; it disappears once real photography is added.

## Drop data — metafields (namespace `custom`)
The Drop hero and product page read these where present, with section settings
as fallbacks so it renders before metafields exist:

| Metafield | Type | Purpose |
|---|---|---|
| `custom.drop_number` | single line text | e.g. `01` |
| `custom.drop_date` | single line text | label, e.g. `24.06.26` |
| `custom.drop_closes_at` | date & time | drives the live countdown |
| `custom.limited_to` | integer | the drop's cap, e.g. `100` |

- **Availability:** `available` is summed from tracked variant inventory when
  inventory is managed; otherwise the section's *Available (fallback)* setting.
- **Scarcity bar** width = `(limited_to − available) / limited_to` (fills as it sells).
- **Countdown:** `assets/drop-countdown.js` reads `data-closes-at` (ISO datetime),
  ticks every second as `HH:MM:SS`, clamps at `00:00:00`. With no close time set
  it falls back to a demo window so the interaction is visible in the editor.
- **Sold out** is shown struck-through, never hidden (scarcity is the story).

## Notes
- Imagery is placeholder (striped texture). Add real photos via the section image
  pickers / product images: one studio still (Dir 01), one drop shot (Dir 02),
  one full-body on-figure shot (Dir 03).
- Druk Condensed is a Commercial Type license — the supplied files ship in `assets/`.
