# WHANE — Shopify Theme (Online Store 2.0)

A radically reduced streetwear storefront. Two colors only — **Cobalt `#1B2BC4`**
on **White `#FFFFFF`** — a condensed display wordmark (**`WHANE.`**), monospace
meta type, flat/square/no-shadow surfaces, generous intentional whitespace.

**Every page fills the screen exactly — no scrolling.**

## The four pages

| Page | Template | Notes |
|---|---|---|
| **Home** | `templates/index.json` (section `wordmark-hero`) | Giant `WHANE.` on white, minimal nav (Shop · Lookbook · Info), a single **"Enter Shop"** button. No menu band. |
| **Shop / Drops** | `templates/page.shop.json` (section `shop-grid`) | **Overview grid** of every product in the drop — each card links to its product page. **No countdown**; scarcity shown per card as a live **stock counter** (`available / limited`) + bar; sold-out stays visible (struck through). (The old one-product-at-a-time carousel lives on in `sections/drop-shop.liquid`, now unused.) |
| **Lookbook** | `templates/page.lookbook.json` (section `editorial-lookbook`) | Full-screen **carousel of looks** (← → / swipe), sparse white overlay, white menu band. Each look is a block (image + heading + look number). |
| **Info** | `templates/page.info.json` (section `info`) | Sparse page content, menu band. |

The **menu band** (wordmark + Shop · Lookbook · Info) appears on **every page
except the homepage** — including product / collection / cart / 404.

### Set it up in Shopify — page name = handle = template (all identical)
Create three **Pages** (Admin → Online Store → Pages → *Add page*). For each,
type the **Title** exactly as below and pick the matching **Theme template**
from the right-hand "Theme template" dropdown:

| Page title | Handle (auto) | Theme template to choose |
|---|---|---|
| `Shop` | `shop` | **shop** |
| `Lookbook` | `lookbook` | **lookbook** |
| `Info` | `info` | **info** |

> The handle must match the nav link. If `/pages/shop` 404s, the page handle
> isn't `shop` (e.g. a page titled "Drops" gets handle `drops`). Open the page,
> click *Edit website SEO*, and set the URL handle to `shop` / `lookbook` /
> `info`. If the **Lookbook** page shows Info (or vice-versa), the wrong **Theme
> template** is selected on that page — re-pick it from the dropdown.

Then **set the menu links by picking the page (not by typing a URL):**
- **Theme settings → Navigation** → for each of the three URL fields, click it
  and choose the page from the dropdown (**Pages → Shop / Lookbook / Info**).
  The picker always inserts the correct address, even if a page handle differs —
  this is the #1 cause of "Lookbook shows Info" / "Shop 404": a link pointing at
  the wrong page.
- **Shop section:** in the theme editor, pick the **Drop collection** whose
  products fill the carousel. Until one is connected (or if it's empty) the
  carousel shows **demo placeholder products** so you can test arrows/swipe;
  turn off *Placeholder demo → Show demo products* for production.

> Re-upload / sync the latest theme first. The Shop template was renamed from
> `drops` to **`shop`** — if a page still shows the "drops" template, you're on
> an older copy; re-pick **shop** after updating.

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
templates/ index · page.shop · page.lookbook · page.info
           product · collection · cart · page · 404
config/    settings_schema.json · settings_data.json
locales/   en.default.json
```

## Brand rules enforced in `assets/whane.css`
- Colors from theme settings (`color_cobalt`, `color_white`) — no third color.
- `border-radius:0` and `box-shadow:none` forced globally.
- Display face: **Druk Condensed** via `@font-face` (licensed files included),
  **Anton** (Google Fonts) as metric fallback. Body/meta: `Courier New` monospace.
- **Wordmark as SVG:** upload your logo to `assets/wordmark.svg`, then enable
  *Theme settings → Brand → Use SVG wordmark*. It is inlined and **force-filled
  cobalt** (always blue, never black) everywhere it appears — home, menu band,
  lookbook overlay. Without it, the text wordmark `WHANE.` is used.
- Diagonal stripe texture (`.whane-placeholder--*`) is only an image placeholder;
  it disappears once real photography is added.
- Full-screen sections use `height:100vh; overflow:hidden` so pages never scroll.

## Shop carousel & scarcity
- Products come from the section's **Drop collection** setting.
- Navigation: prev/next arrows, native touch **swipe** (CSS scroll-snap),
  ← → keyboard, and a live **`NN / TOTAL`** counter — all in `assets/carousel.js`.
- Responsive arrows: side-centered on desktop; on mobile/tablet the layout
  stacks (image over info) and the arrows drop to a **centered pair at the
  bottom** so they never cover the product name. No fixed-position element
  overlays text on mobile.
- **Stock counter:** `available` is summed from tracked variant inventory; if a
  product isn't inventory-tracked it falls back to the section setting.
- **Bar** width = `(limited_to − available) / limited_to` (fills as it sells out).
- **Sold out** is shown struck-through, never hidden (scarcity is the story).

### Drop metafields (namespace `custom`)
| Metafield | Type | Purpose |
|---|---|---|
| `custom.drop_number` | single line text | e.g. `01` (eyebrow on each slide) |
| `custom.item_code` | single line text | e.g. `W1.1` (drop 1, item 1) — shown above the title on the product page |
| `custom.limited_to` | integer | the drop cap, e.g. `100` |

(`drop_closes_at` is no longer used — the countdown was removed.)

## Drop gate / early access (soft, test phase)
Locks the **Shop** page until a set time, with a code page for insiders.
- **Theme settings → Drop / Early access:** turn on *Lock the Shop until the
  drop*, set *Drop date & time* (ISO 8601 **with offset**, e.g.
  `2026-07-15T18:00:00+02:00`), and one or more *Early-access code(s)*
  (comma-separated, case-insensitive).
- Before the time, `/pages/shop` shows a **countdown** + an *Early access*
  button. At the time it **unlocks automatically for everyone** (enforced
  server-side in Liquid; the page auto-reloads at zero).
- **Early-access page:** create a Page with handle `early-access` and template
  **early-access** (`/pages/early-access`). Entering a valid code remembers it
  (localStorage) and reveals the Shop early. Optionally add a URL redirect
  `/early-access → /pages/early-access`.
- ⚠️ **Soft gate:** the code lives in the page source and is bypassable by
  technical users — fine for hype/testing, not a hard lock. For a hard lock use
  Shopify *scheduled publishing* or an app (e.g. Locksmith). Logic lives in
  `assets/drop-gate.js`.

## Notes
- Imagery is placeholder (striped texture). Add real product images (carousel)
  and a full-body shot (lookbook image picker).
- Druk Condensed is a Commercial Type license — the supplied files ship in `assets/`.
