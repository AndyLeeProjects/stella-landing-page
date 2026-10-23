# Mobile redesign — implement new Drive mockups, MOBILE ONLY

Andy shared a new Google Drive folder with a full mobile redesign of the WRM
site plus original photography. Your job: rebuild every mobile page to match
the new mockups pixel-exact, using real original photos where new photography
is needed. **Do NOT touch the desktop experience in any way.** Desktop must
render identically after your changes as before. This repo has NO build step
(static vanilla JS/CSS/HTML, served by serve.py) — just edit the files.

## Explicit decisions already made — do not re-ask
1. Mobile scope ONLY. Breakpoint is `max-width:760px` (see css/styles.css).
   Desktop lives in css/desktop.css + js/desktop.js and is gated by
   `isMobile()` (`window.matchMedia('(max-width:760px)')`) in js/app.js. Any
   shared selector you touch (not inside a `@media (max-width:760px)` block)
   MUST be scoped so desktop (>760px) renders byte-identical to before your
   change. When in doubt, add a new mobile-only class rather than edit a
   shared rule.
2. The WRM World page (`/wrm-world`) stays — do NOT delete it, despite the
   Edit Notes doc saying "Remove this page". Andy confirmed: keep the route,
   rebuild it to match the new `WRM_WORLD@2x.png` mockup.
3. Everything else in Edit Notes below IS the literal spec — implement it.
4. "Looks EXACTLY the same" means pixel-faithful to the new mockups: same
   measured layout, type, spacing, photo crops/compositions as the current
   mobile implementation already does for the old mockups (see the existing
   `mh-original-art` / hit-region pattern in js/app.js `pages.homeMobile()`,
   `pages.materials()`, `pages.world()` for the established technique: a
   full-bleed original artwork image with percentage-positioned transparent
   hit regions laid on top for interactivity). Follow the SAME technique
   for any new full-bleed pages; for grid/list/detail pages that are built
   from real HTML (shop list, product detail, about-materials detail, FAQ),
   match the mockup's measured proportions the way `.mshop`, `.mpl`, `.mpd`,
   `.mat-detail` etc. already do (vw-based height/position percentages
   measured off the actual mockup pixel dimensions).

## Inputs (already downloaded into this repo — look here first)
- `design-ref/mobile-v2/*.png` — 12 new mockups, all RGBA PNGs, 751px wide
  (this is a "@2x" export, so divide/measure proportionally like the
  existing `design-ref/mobile/*` set). Files:
  - `HOME@2x.png` (751×5762) — new Home page
  - `MENU@2x.png` (751×1267), `MENU_1@2x.png` (751×1277) — new mobile menu
    (two states — figure out which is collapsed vs an expanded/sub-menu
    state by looking at both images)
  - `SHOP@2x.png` (751×3225) — new Shop / product list page
  - `Purse@2x.png` (751×2317) — new Salmon Purse product detail page
  - `Bookmark@2x.png` (751×2316) — new Salmon Bookmark product detail page
  - `Algae_Tote@2x.png` (751×2418) — Algae Tote — figure out from the image
    content whether this is a new product detail page for the (coming soon)
    Algae Tote, or additional shop-grid imagery; implement whichever the
    image actually shows.
  - `About_Material@2x.png` (751×2265) — new About Materials index/landing
  - `Salmon_About_Material@2x.png` (751×3364) — new About Materials detail,
    fish leather
  - `Algae_About_Material@2x.png` (751×3810) — new About Materials detail,
    algae
  - `FAQ@2x.png` (751×1624) — new FAQ page
  - `WRM_WORLD@2x.png` (751×3882) — new WRM World page
  These PNGs have transparency including BLACK TEXT on transparent regions —
  composite on WHITE before viewing them or the text disappears invisible.
  Use `Image.open(f).convert('RGBA')` then paste onto a white RGB canvas
  using the alpha channel as mask, the same way `scripts/crop.py` already
  trims/crops the old mockups.
- `img/photos-v2/*` — 17 original photography/source files (HEIC already
  converted to .jpg alongside the originals, use the .jpg): `2560dpi.png`,
  `Ecomm.jpg`, `IMG_0611.jpg`, `IMG_2192.jpg`, `IMG_3794.jpg`, `IMG_4241.jpg`,
  `IMG_4585.jpg`, `IMG_7171.jpg`, `IMG_8111.jpg`, `IMG_8245.jpg`,
  `IMG_9859.jpg`, `L1040784.JPEG`, `L1040785.JPEG`, `L1040793.JPEG`,
  `WRM3172-Edit.jpg`, `WRM3221-Edit.jpg`, `WRM3266-Edit.jpg`. Use these as the
  source for ANY new photography the mockups show that isn't already covered
  by an existing crop in `img/` (e.g. `img/purse-light.jpg`, `img/m-hero.jpg`
  etc. — reuse those if the new mockup still uses the same photo in the same
  place; only re-crop from `img/photos-v2/` when the new mockup shows a
  DIFFERENT photo or composition). Generate web-sized JPEG derivatives into
  `img/` (new filenames, do not overwrite the existing ones used elsewhere)
  following the pattern in `scripts/crop.py` (crop box measured from the
  mockup region, resize to a sane mobile width, `trim_edges()` if needed).
  Never invent or hotlink imagery — only use these 17 files and the existing
  `img/*` assets already in the repo.
- Literal written changes, from the Drive "Edit Notes" doc (dated 9/7),
  copied verbatim below — implement every bullet exactly:

  ```
  Home Page
  * WRM logo in the top middle needs to increase in weight to match the hamburger menu line weight.
  * Photo needs to get closer between the first and second image. Remove the white gap
  * Make font size for Explore WRM World bigger (match
  * Move 'for ocean collection, wrm explores two materials: fish leather and algae film.' to be below the CHAPTER 1 OCEAN
  * "The products at WRM come as a proof of concept, bringing these materials to everyday life" needs to match font size to the line before (make it smaller)
  * Remove extra line above the salmon purse
  * Salmon bookmark image needs to move lower
  * Algae tote image needs to move lower

  Menu
  * Color needs to match image
  * The colors of the X & WRM on menu bar need to all be black
  * Footer is missing
  * Arrows need to all match, doesn't matter which one
  * Remove all shop
  * Remove all ocean season (when you click ocean season, it should take to the page that shows all products)
  * Remove all fish leather
  * Remove WRM World

  WRM World
  * Remove this page   [OVERRIDDEN — see decision #2 above: KEEP this page]

  FAQ
  * Remove if yours isn't here, write to hello@withrwmaterials.com
  * Remove everything except for shipping

  About Materials
  Add below questions as drop down. For Salmon Leather:
  1. Material & Performance
     * How strong is it? Salmon leather is stronger than cowhide of the same weight. Its fibers cross rather than run in a single direction, a structure shaped by the fish's need to move through water.
     * Is it waterproof? Not by nature. We recommend keeping it dry and away from prolonged moisture.
     * How does it wear over time? The leather softens with use, and patinas into a natural darker shade over time. A natural patina rather than wear.
     * Does the texture vary piece to piece? Yes. Please understand that each skin is unique, and no two pieces are identical!
     * Does the color fade in sunlight? As with any natural leather, prolonged direct sunlight will expedite the darkening of the tone over time. We recommend storing it out of direct light.
  2. Living With It
     * What does it smell like? Properly tanned leather carries zero to barely any scent of fish.
     * Will my pet eat it? It is leather, and should be treated with the same care as any fine leather good around pets.
     * How do I clean it? Wipe with a soft, dry cloth. Avoid water and household cleaning products. You may use wax to buff the area afterwards.
     * Can it get wet? If you get caught in the rain, this is not the bag to use as cover. We recommend against getting wet. If it happens, allow it to air dry away from direct heat.
     * How should I store it? In a cool, dry place, away from direct sunlight — ideally in its dust bag.
     * Does it need conditioning? No regular conditioning is required.
  3. Origin & Sourcing
     * Where does the salmon skin come from? The tannery works closely with a sushi restaurant group to collect the skins. The restaurant uses ocean-caught Alaskan salmon; the tannery takes what would otherwise be discarded.
     * Is this a byproduct, or is the fish farmed for the leather? A byproduct of the restaurant industry. No fish is farmed for the leather.
     * Is the fish also used for food? Yes. The fillet is served at the restaurant the tannery works with.
     * Is it vegan? No. This is an animal material.
  4. Circularity & End of Life
     * What happens to it, eventually? The leather is tanned without chromium, so it can return to soil at the end of its life. Thread selection and full compostability testing for the finished object are ongoing.
  5. Value & Ownership
     * How long will it last? The material is built for use over years.
     * Is each piece one of one? Each bag is one of one. no two are identical due to the nature of the skin
     * Can it be repaired if damaged? Contact us directly to discuss repair.

  For Algae: add below questions as drop down.
  1. Material & Performance
     * How strong is it? It's a seaweed-derived sheet material, structurally different from a woven textile or hide. In practice, it holds up well to regular handling, however similarly to plastic film it will stretch with force.
     * Is it waterproof? It's moisture-resistant rather than fully waterproof. We'd treat it the way you'd treat any considered object — dry it if it gets wet.
     * How does it wear over time? This is a newer material category than leather, without the same century of reference. What we've seen so far points to a material that holds its shape and resists moisture well under regular use. We'll continue to share what we learn as pieces move through the world. It's similar to waxed canvas.
     * What does it smell like? It does not smell like seaweed. The material is designed and processed to be completely scent-free so it does not transfer any ocean or plant odors to the packaged goods inside.
  2. Origin & Sourcing
     * Where does the algae material come from? The material begins as seaweed. Under the right conditions, kelp can grow as much as two feet in a single day — making it one of the fastest-growing plants on earth — and it's cultivated without the water, land, or fertilizer inputs most raw materials require. It's grown on ocean farms, then processed by a California-based material studio into a flexible sheet form, which we cut and sew into finished objects in San Francisco.
  3. Circularity & End of Life
     * What happens to it, eventually? The material is designed to compost. We're still testing how the finished object performs in home versus industrial composting environments. We'll share results as that testing completes.
  4. Value & Ownership
     * Can it be repaired if damaged? Contact us directly to discuss repair.
  ```

## Requirements
1. First inspect all existing code (`js/app.js`, `css/styles.css`, read the
   FULL files — they're ~640 and ~834 lines) and ALL 12 new mockups (view
   them white-composited) before changing anything. Derive concrete measured
   layout geometry (percentages/vw units, same technique as the existing
   mobile code) rather than guessing.
2. Rebuild, mobile-only, matching the new mockups exactly:
   - Home (`/`)
   - Menu (mobile menu overlay)
   - Shop (`/shop` and any list it feeds)
   - Salmon Purse detail (`/product/salmon-purse`)
   - Salmon Bookmark detail (`/product/salmon-bookmark`)
   - Algae Tote (map per your mockup inspection — see Inputs note above)
   - About Materials index (`/about-materials`)
   - About Materials → Fish Leather detail (`/about-materials/fish-leather`)
     with the new Salmon Leather FAQ accordion from Edit Notes
   - About Materials → Algae detail (`/about-materials/algae`) with the new
     Algae FAQ accordion from Edit Notes
   - FAQ (`/faq`) — reduced to shipping only, per Edit Notes
   - WRM World (`/wrm-world`) — kept per decision #2, rebuilt to new mockup
3. Apply every Menu edit literally: match the mockup's panel color exactly
   (sample real pixel color from the mockup, don't guess), X/WRM in the bar
   are black, footer must be present in the mobile menu (it was present
   before — check `buildMenu()`'s `isMobile()` branch in js/app.js, don't
   regress it), arrow glyphs consistent (pick ONE style used site-wide, not
   per-item), remove Shop/Ocean Season/Fish Leather/WRM World as standalone
   menu rows but make "Ocean Season" (if it remains as any label) route
   directly to the page that lists all products instead of an intermediate
   season page, per the note.
4. Protect desktop. Capture baseline screenshots of EVERY route at 1280px
   width BEFORE you touch anything, and compare pixel-for-pixel equal
   AFTER, for every route. Any difference = regression, fix it. Use
   `scripts/qa.py` as a starting point (note: it currently targets a macOS
   Chrome path — on this Linux VPS, run your own isolated headless Chrome
   instance with `executablePath=/usr/bin/google-chrome` instead, one
   instance at a time, `/tmp/wrm-redesign-chrome` profile, kill it in a
   `finally`).
5. Keep all existing interactions working: router, cart (add/remove/qty),
   mobile menu open/close/sub-menu expand, FAQ accordion, product gallery
   swipe/thumbnails, newsletter signup forms, scroll lock under
   menu/cart. No console errors, no broken images, no horizontal overflow
   at 390px.
6. Use real HTML for all text (headings, FAQ answers, accordions) — never
   bake copy into a flattened screenshot image. Full-bleed artwork pages
   (if any page is still best done as one original image with transparent
   hit regions, matching the established `mh-original-art` pattern) are the
   one exception, same as today's Home/Materials/World pages — your call
   per page based on what the new mockup actually looks like (if it's now a
   real list/grid layout instead of one tall artboard, build it as real
   HTML/CSS instead, matching whichever approach the mockup structure calls
   for).
7. Do NOT commit, push, or deploy. Leave changes in the working tree. Do
   NOT touch `.impact-graph.json` or `DESKTOP_REPLICATION_BRIEF.md` (pending
   unrelated desktop work, leave it alone — note it refers to past/ongoing
   desktop work, not this task).
8. Produce `/tmp/wrm-redesign-audit/IMPLEMENTATION_REPORT.md`: full mapping
   of mockup → route, which pages used original-artwork-with-hit-regions vs
   real HTML, every original photo file used and where, exact Edit Notes
   items implemented (check each one off), before/after desktop screenshot
   comparison results (must be "identical, 0 diff" for every route), mobile
   screenshot paths for every new/changed route at 390px, remaining
   discrepancies or blockers (if a mockup detail is ambiguous/undecided,
   document it here — do NOT silently skip or guess silently on anything
   material to the design, flag it instead).

## Runtime constraints
Static vanilla JS/CSS site. No package.json, no build step. Python3 has
Pillow. Shared 2-core/8GB VPS — sequential image processing only (no
parallel Pillow calls), one Chrome instance at a time. You run INSIDE a
load-gate lock already — do NOT call `load-gate run` yourself (nested calls
deadlock); `load-gate check` is fine before a heavy step. No subagents. No
`npm`/build command (there isn't one). Don't read secrets. No git resets.
Keep working until all pages are implemented and verified — don't stop at a
plan or the first page. User approval required before any deploy (there is
none configured for this task anyway).
