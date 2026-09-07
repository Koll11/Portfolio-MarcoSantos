# Phase 3 — Nocturne first visual implementation

Status: approved by the user as the case-study foundation. Preserve its current
visual direction and structure without further polish yet. Route remains
`nocturne.html`.

Sequence: atmospheric hero → overview and ownership → two key contributions →
large combat capture → client/server system outline → replication gameplay →
environment and gameplay moments → technical takeaways → Cyber Engineer.

The technical claims use the original Nocturne page: raycast hit detection,
client-initiated attacks, server validation and replication of accepted VFX.
The 15-player figure is presented as design scope, not a performance benchmark.
No new ownership claims for abilities, sunlight, UI, art or movement were added.
The system diagram is an explanatory outline, not an exact code execution trace.
The old mixed client/server code excerpt was not used as a source listing.

## Boundaries and reuse

- Shared typography, spacing tokens and accessibility baseline remain reusable.
- `assets/css/nocturne-case.css` owns this project's composition and atmosphere.
- `assets/js/nocturne-case.js` handles opt-in playback only. No scroll libraries,
  hidden-on-load content, animated system diagram or parallax in this review pass.
- Homepage, its scroll logic, approved Phase 2 and other project pages unchanged.
- Future cases can reuse semantic section patterns without inheriting identical
  media proportions, atmosphere or section order.

## Media and validation

`tools/prepare_nocturne.py` generates WebP posters/stills and two 960px-wide H.264
gameplay clips, about 1.7 MB each, from the existing ~50 MB captures. Both clips
retain their full original duration. Video sources are attached only on explicit
play, with native controls afterward; playback pauses offscreen and in hidden tabs.
The existing cathedral/moon WebP is the hero. Original media is unchanged.

Checks: desktop/mobile visual review; source/anchor checks; script syntax;
opt-in playback and no initial video source; preserved homepage/CV hashes.

## Still pending (do not debug in this phase)

Phase 1 and Phase 2 are visually approved. Hero scroll expansion and horizontal
Selected Work scrolling remain OPEN. The existing CV PDF still lists university
as “Current” and needs a later content update. None of these were changed here.
