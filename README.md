# WHANE — Shopify Theme (Online Store 2.0)

A radically reduced streetwear storefront. Two colors only — **Cobalt `#1B2BC4`**
on **White `#FFFFFF`** — a condensed display wordmark (**`WHANE.`**), monospace
meta type, flat/square/no-shadow surfaces, generous intentional whitespace.

**Every page fills the screen exactly — no scrolling.**

## The four pages

| Page | Template | Notes |
|---|---|---|
| **Home** | `templates/index.json` (section `wordmark-hero`) | Giant `WHANE.` on white, minimal nav (Shop · Lookbook · Info), a single **„Zum Shop"** button. No menu band. |
| **Shop / Drops** | `templates/page.drops.json` (section `drop-shop`) | Full-screen **product carousel** — click ← → or **swipe** between products. **No countdown**; scarcity shown as a live **stock counter** (`available / limited`) + bar. |
| **Lookbook** | `templates/page.lookbook.json` (section `editorial-lookbook`) | Full-bleed on-figure image, sparse white overlay, menu band in white. |
| **Info** | `templates/page.info.json` (section `info`) | Sparse page content, menu band. |

The **menu band** (wordmark + Shop · Lookbook · Info) appears on **every page
except the homepage** — including product / collection / cart / 404.

### Set it up in Shopify
1. Create three **Pages** in admin and assign their templates:
   - Page "Shop" → template **`page.drops`**
   - Page "Lookbook" → template **`page.lookbook`**
   - Page "Info" → template **`page.info`**
2. **Theme settings → Navigation:** point the three links at those pages
   (defaults: `/pages/shop`, `/pages/lookbook`, `/pages/info`).
3. **Shop section:** in the theme editor, pick the **Drop collection** whose
   products fill the carousel.

### Local preview (no Shopify needed)
Open `preview/index.html` in a browser — all four pages at 1440px desktop width
with the real Druk Condensed font; the shop carousel arrows/swipe work live.

## Structure
```
assets/    whane.css · carousel.js · DrukCondLCGSuper(.ttf/Italic)
layout/    theme.liquid
snippets/  menu-band.liquid            (shared header, default + white overlay)
sections/  wordmark-hero · drop-shop · editorial-lookbook · info
           whane-header · minimal-footer
           main-product · main-collection · main-cart · main-page · main-404
templates/ index · page.drops · page.lookbook · page.info
           product · collection · cart · page · 404
config/    settings_schema.json · settings_data.json
locales/   en.default.json
```

## Brand rules enforced in `assets/whane.css`
- Colors from theme settings (`color_cobalt`, `color_white`) — no third color.
- `border-radius:0` and `box-shadow:none` forced globally.
- Display face: **Druk Condensed** via `@font-face` (licensed files included),
  **Anton** (Google Fonts) as metric fallback. Body/meta: `Courier New` monospace.
- Diagonal stripe texture (`.whane-placeholder--*`) is only an image placeholder;
  it disappears once real photography is added.
- Full-screen sections use `height:100vh; overflow:hidden` so pages never scroll.

## Shop carousel & scarcity
- Products come from the section's **Drop collection** setting.
- Navigation: prev/next arrows, native touch **swipe** (CSS scroll-snap),
  ← → keyboard, and a live **`NN / TOTAL`** counter — all in `assets/carousel.js`.
- **Stock counter:** `available` is summed from tracked variant inventory; if a
  product isn't inventory-tracked it falls back to the section setting.
- **Bar** width = `(limited_to − available) / limited_to` (fills as it sells out).
- **Sold out** is shown struck-through, never hidden (scarcity is the story).

### Drop metafields (namespace `custom`)
| Metafield | Type | Purpose |
|---|---|---|
| `custom.drop_number` | single line text | e.g. `01` (eyebrow on each slide) |
| `custom.limited_to` | integer | the drop cap, e.g. `100` |

(`drop_closes_at` is no longer used — the countdown was removed.)

## Notes
- Imagery is placeholder (striped texture). Add real product images (carousel)
  and a full-body shot (lookbook image picker).
- Druk Condensed is a Commercial Type license — the supplied files ship in `assets/`.
