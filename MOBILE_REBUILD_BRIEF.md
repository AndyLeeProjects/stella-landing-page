# Mobile-only rebuild brief — WRM landing page

## Scope (read this twice)
- **MOBILE ONLY.** Do NOT touch desktop layout, desktop CSS rules, or anything gated behind
  `@media (min-width:761px)` / the default (non-mobile) code paths. The desktop version is
  approved and frozen — leave it byte-for-byte as it is.
- All mobile rendering lives behind `window.matchMedia('(max-width:760px)').matches` checks in
  `js/app.js` (see `pages.home()` at line ~190 which branches to `pages.homeMobile()` vs
  `pages.homeDesktop()`) and the `@media (max-width:760px)` block at the bottom of
  `css/styles.css` (currently lines 384-420) plus the dedicated mobile-only rule blocks already
  present (`.mh`, `.mh-plate`, `.mh-hero`, `.mh-concept`, etc. around lines 202-219).
- Goal: make every mobile page **pixel/layout-match** the design mockups in
  `design-ref/mobile/*.png`. These are the source of truth — Google Drive folder
  "WRM mobile designs" (files: `mobile_HOME.png`, `mobile_Purse.png`, `mobile_Bookmark.png`,
  `mobile_Product List Page.png` (saved as `mobile_Product_List_Page.png`), `mobile_SHOP.png`,
  `mobile_About Material-08/09/10.png`, `mobile_FAQ.png`, `mobile_MENU-05/06/07.png`,
  `mobile_WRM WORLD.png` (saved as `mobile_WRM_WORLD.png`).
- Each PNG is a full-page vertical mockup (e.g. mobile_HOME.png is 1563×13969px) — scroll through
  it top to bottom mentally / by cropping and compare section-by-section against what
  `pages.homeMobile()` (and other mobile page functions in `js/app.js`) currently renders.

## Explicit decisions — do not re-ask
1. **Use the site's existing real product photos**, not the mockup's placeholder/stock photography.
   The mockups may show generic/placeholder images in some product photo slots — that's expected,
   ignore the *specific pixels* of product photography in the mockup and instead match the mockup's
   LAYOUT, spacing, typography, caption placement, and structure using the real images already in
   `/img/` (m-purse.jpg, m-bookmark.jpg, m-tote.jpg, purse-light.jpg, purse-dark.jpg,
   bookmark-blue.jpg, bookmark-detail.jpg, algae-tote.jpg, m-hero.jpg, m-ocean.jpg, m-materials.jpg,
   illustration-salmon.png, illustration-seaweed.png, illustration-ocean.png, etc). Never introduce
   a new/fake image asset — only reuse what's already in `img/`.
2. Do not change product copy/pricing/names — those come from the `PRODUCTS`/`FAQ`/nav data objects
   already in `js/app.js`. Only touch markup/CSS structure to match the mockup's visual layout.
3. Site tokens (fonts, colors: --paper #E8DFC8, --ink #1C1A17, --olive #8B7B2B, Instrument Serif /
   EB Garamond / DM Sans / JetBrains Mono) are fixed — don't introduce new fonts or colors not
   already defined in `:root` in `css/styles.css` unless the mockup unambiguously shows a different
   dark/olive/paper tone already used elsewhere on the mobile pages (e.g. `.mh` sections are
   intentionally near-black `#0f0f0f`/`#111`, matching the mockup's dark plates).
4. Breakpoint is `max-width:760px` (already established, matches iPhone widths ~390px). Use real
   device widths (390px is Andy's iPhone) as your primary QA target, not just resizing a desktop
   browser.
5. This is a static site (no build step) — `index.html` + `css/styles.css` + `js/app.js`,
   client-side routed. Just edit in place.

## Process
1. For each mockup PNG, crop it into ~1400px-tall vertical slices (a quick local Python/PIL script
   is fine, already done once at `design-ref/mobile/` — feel free to redo) and inspect closely.
2. Compare each section's real rendered mobile output (use a headless browser / puppeteer-style
   screenshot at 390px width, or curl+read the rendered HTML structure) against the corresponding
   mockup slice.
3. Fix CSS/markup differences: spacing, image aspect ratios, caption text position/size, section
   backgrounds, hero text overlay copy/position, dividers, "Coming Soon" tags, etc. — restricted to
   the mobile-only code paths described above.
4. Do this for ALL mobile pages that have a corresponding mockup: Home, Shop/Product List, Purse
   (product detail), Bookmark (product detail), About Materials, FAQ, Menu (all 3 states — closed
   sub-menus expanded to different depths), WRM World.
5. After each page is fixed, take a fresh screenshot at 390px width and diff mentally against the
   mockup before moving to the next page. Do not declare a page "done" without this visual check.
6. Run through all pages one more time at the end for a final pass.

## Constraints
- No new npm deps, no build tooling, no framework rewrite. Pure vanilla JS/CSS edits matching
  the existing style already in the file.
- Do not modify README, vercel.json, or any file outside `index.html`, `css/styles.css`,
  `js/app.js`, unless a page route is genuinely missing and needs adding to `js/app.js`'s router.
- Commit incrementally (one commit per page fixed) with clear messages, e.g.
  "Mobile FAQ: match mockup spacing/dividers exactly (mobile_FAQ.png)".
- Do NOT push to origin — leave commits local so Andy/Hermes can review the diff before pushing.
- Delete this brief file (`MOBILE_REBUILD_BRIEF.md`) in your final commit once all pages are done.

## Verification checklist for your final report
- List every mobile page checked, what specific mismatches you found vs the mockup, and what you
  changed for each.
- Confirm (explicitly) that no desktop CSS rule outside a `max-width:760px` media query, and no
  code path outside a `matchMedia('(max-width:760px)')` branch, was touched — grep your own diff
  for `@media` and `matchMedia` to prove this before reporting done.
- Include actual screenshot-based confirmation (e.g. via a headless browser at 390px) for at least
  the Home and Shop pages, not just "should look right now."
