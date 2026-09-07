# Phase 1 — homepage foundation

## Approval and pending interaction work

Phase 1 is visually approved. The user reports that hero scroll expansion and
horizontal Selected Work scrolling are currently not working. Both remain OPEN;
earlier automated checks below do not establish resolution in the user's browser.
Do not debug them during Phase 2. Return to them in isolation after Phase 2 and
before the project case studies. Preserve the approved visual architecture.

Scroll behaviour remains in `assets/js/hero.js` and `assets/js/home.js`;
Phase 2 has no dependency on either script and does not modify them.

Start the local preview with `node tools/serve.cjs`, then open http://localhost:4173.
The site remains plain HTML/CSS/JavaScript and requires no production build.

## Design review

Open `/?type=instrument` for the typography switcher. It compares Instrument Serif,
Bodoni Moda and Inter Tight with Inter body/UI text in the actual homepage layouts.
The audition controls only appear when `type` is in the URL. The public typography
is Inter Tight + Inter, following the selected pairing. At widths of 1000px and
above, hero expansion and the horizontal gallery are on by default unless the
browser requests reduced motion. Smaller layouts are vertical. Neither behaviour
reads storage or motion query parameters; the old mode selectors were removed.

The hero uses one dominant monochrome media surface, occupying 66% of its initial
stage height. Four project frames crossfade at equal intervals, with manual frame
selection and a pause control. Over a short scroll, the frame expands to the full
stage while the title and statement recede, then releases into Selected Work.
Reduced-motion visitors receive a static hero with manual frame selection. The
sequence stops when offscreen or the browser tab is hidden.
Project worlds start in Selected Work: the cathedral-and-moon screenshot for
Nocturne, three staggered portrait frames for Cyber Engineer, three unstretched
frames within Save State's pastel composition, and more negative space around
Lusíada-1's nebula. About introduces the existing portrait. Oversized italics have
been removed in favour of clearer typography and compact technical metadata.

The horizontal gallery uses CSS sticky positioning and a small native scroll handler.
GSAP and Lenis are not loaded by the new homepage. The existing case-study pages
retain their existing dependencies and composition, with baseline accessibility repairs.
Both native scroll handlers refresh on window load, pageshow, resize, font loading
and image loading. Gallery measurements also refresh after video metadata loads
and when the hero or Selected Work introduction changes size.

## Media

All homepage video is opt-in, muted, and pauses outside the nearby viewport or when
the tab is hidden. No source MP4 or GIF is fetched by the homepage. Posters load near
visibility. Original files remain untouched. Five-second previews total approximately
658 KB; each is below 225 KB. The hero uses larger lightweight WebP derivatives.
Pausing Nocturne's gameplay restores its environment poster, sourced from
`NocturneBattlegrounds/RobloxScreenShot20260905_170611850.png`.

To regenerate, install Pillow and imageio-ffmpeg in the Python environment (the tool
also checks `.tools/`), then run `python tools/prepare_media.py`.

## Checks

- `node --check assets/js/home.js`
- `node --check assets/js/hero.js`
- `node --check assets/js/media.js`
- `node --check assets/js/legacy-accessibility.js`
- `python tools/check_site.py`
- `node tools/check_scroll.cjs` (requires Playwright and installed Chrome): fresh
  isolated headless contexts with empty storage and no parameters; short desktop;
  stale stored settings; ignored motion parameter; reduced motion; tablet; mobile.
  Exercises wheel scrolling, typography fading, gallery completion and return to
  vertical scrolling, then reloads after media and fonts finish loading.
- Browser review: 1440×900, 1366×768, 820×1180, 390×844, and 320×740.
- Horizontal project index and arrow navigation; vertical reduced-motion layout;
  preview playback; keyboard opening/Escape/focus restoration in the existing viewer.

## Scope

About, Skills, CV, Contact and Footer are now implemented in Phase 2;
see `PHASE-2.md` for scope and validation.
Project case studies remain for Phases 3–4. The homepage has no artificial loader,
custom cursor or elaborate page transitions. Fonts are delivered by Google Fonts
with fallback fonts and swap behaviour. No deployment was performed.

Final integration update (2026-09-07): scroll controllers replaced and fresh-context geometry tests passed. See FINAL-INTEGRATION.md for conditions, evidence and remaining acceptance checks. Earlier unresolved reports above are retained as history.
