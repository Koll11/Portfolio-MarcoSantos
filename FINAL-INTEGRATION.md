# Final integration / 7 September 2026

All four case-study foundations are user-approved. Their structures and identities remain intact.

## Scroll resolution
Replaced the two native scroll controllers with locally served GSAP 3.13.0 + ScrollTrigger. assets/js/scroll.js owns pinning, measurements and animation. assets/js/home.js owns gallery navigation; assets/js/hero.js owns the image sequence only.

Desktop activation: at least 1100 CSS pixels wide, fine primary pointer, prefers-reduced-motion: no-preference. All other layouts use the unpinned vertical fallback. No localStorage reads/writes or motion query switches. If the libraries are unavailable, the vertical page remains usable.

The hero pins for 65% of viewport height while its media expands and text recedes. Selected Work pins for exactly track width minus visible stage width. Normal vertical scrolling continues after project four. Font/media/load/pageshow events refresh measurements; refresh preserves keyboard focus while pins are temporarily reparented.

The previous implementation passed its old tests, so no historical root cause is claimed. The live Codex preview reported reduced motion enabled and a 679px viewport during this pass: the simple version is intentional under those conditions. The normal desktop interaction was tested in separate clean Chrome browser contexts with no stored preferences and no URL parameters.

## Integration polish
- Optional native cross-document view transitions: 140–180ms fades; no intercepted links, delayed navigation or loading screen. Unsupported browsers navigate normally; reduced motion disables animation.
- Focus, play-button hover, touch target and navigation-state polish.
- Shared case-study playback, keyboard focus transfer to native video controls, offscreen/hidden-page pause and pause on a reduced-motion setting change.
- Corrected image width/height metadata; async decoding; existing below-fold lazy images and opt-in MP4 playback preserved.
- Contrast corrected for Nocturne flow numbering, Save State secondary copy, its homepage caption and the Save State skip link.
- Website copy verified as recently graduated; email marco7santos@gmail.com; project language/engine and role terminology retained.

## Verification
- tools/check_integration.cjs: fresh desktop 1440×900, large desktop 1920×1080, laptop 1280×720, tablet landscape 1024×768, tablet 820×1180, mobile 390×844, reduced motion and stale storage/query tests. Checks media expansion geometry, text opacity, stable pin position, all four gallery positions, release to vertical scrolling, reload, overflow, HTML language, h1 count, deferred videos and page errors across all five pages.
- tools/check_interactions.cjs: skip link/focus, keyboard entry into a horizontal panel, Enter navigation, next/back-to-work navigation, native playback/offscreen pause, resize and live reduced-motion pin cleanup, unavailable-library fallback.
- tools/check_site.py: local asset and fragment checks, homepage preview budget.
- Desktop/mobile screenshots reviewed. Solid-background text contrast audit performed; imagery-backed text also relies on existing overlays. This is not a formal accessibility certification or real-device Safari/Firefox test.

## Performance / remaining items
No MP4 or GIF requests before explicit play. Homepage's four optional preview videos total 673,521 bytes. Full case-study clips are roughly 0.4–1.7 MB each and stay deferred. GSAP/ScrollTrigger are local assets, with license notices preserved. Google Fonts remain external and use swap; system font fallback works. Original GIF quality limits some enlarged gameplay imagery; higher-resolution source captures would improve detail without changing composition.

CV PDF is unchanged and still contains university “Current”; updating it needs the user's explicit request. No deployment performed. No remaining reproduced scroll failure in the test matrix. Real-device Safari/Firefox and the user's normal browser remain useful final acceptance checks, particularly its OS reduced-motion setting.

Additional checks passed: 2560×1440 display and 1366×650 short laptop across all five pages. CV SHA-256 matched the pre-case-study baseline. Locally served GSAP + ScrollTrigger total 116,592 bytes uncompressed.
## Visible motion refinement — 7 September 2026

Following user review, the hero now pins over 1.4 viewport heights. Direct GSAP timelines animate media insets from 8vw side margins to zero, scale imagery to 1.12, translate/fade typography by 85px, and hold the finished takeover before releasing. Selected Work visibly translates on X with a short scrub response; project title and metadata reveals follow horizontal entry. Homepage labels, About and Skills receive restrained scroll-triggered entrances. Case-study structures are unchanged.

The user explicitly reconfirmed retaining reduced-motion fallback. Desktop animation still requires the existing desktop media condition and no reduced-motion preference; the recording does not change OS settings or rely on site preferences.

Recorded the complete rendered homepage in a fresh 1440×900 Chrome context with wheel scrolling, no storage and no query parameters. The capture contains 1,187 rendered frames over about 32 seconds. Reviewed its complete chronological one-second frame sequence: hero expansion/text recession, sideways Nocturne → Cyber → Save State → Lusíada, release into About, Skills/CV/Contact entrances. Recording: .preview/recordings/homepage-1440.mp4. Recording utility: tools/record_homepage.cjs. This visual review supplements rather than replaces browser interaction checks; user visual acceptance remains the deciding criterion.
