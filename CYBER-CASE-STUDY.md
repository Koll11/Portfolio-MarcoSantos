# Cyber Engineer — adapted case study

Full visual implementation at the existing `cyber.html` URL, following the approved
case-study logic: context → contributions → systems → gameplay → takeaway.

Cyber's composition is independent of Nocturne: staggered portrait hero sequence;
upgrade selection beside a secondary gameplay frame; a compact upgrade-data flow;
large 20-wave editorial marker and a three-constraint spawning explanation; arena
footage and original character artwork; a warm transition to Save State.

Content is grounded in the previous Cyber page: upgrade array, auxiliary available
lists by class/type, three upgrade classes, 20 waves, enemy eligibility and limits,
and player-relative spawning within a safe distance and allowed zone. The diagrams
explain those concepts without inventing enemy schedules, measurements or source
code. The old invalid C# excerpt was not reused as a code listing.

## Implementation

- `assets/css/cyber-case.css`: project-specific composition and responsive layouts.
- `assets/js/case-media.js`: isolated opt-in playback, native controls after play,
  pauses offscreen or when the tab is hidden. No scroll or animation dependencies.
- `tools/prepare_cyber.py`: native-size 240×426 portrait assets from original GIFs;
  three full-duration MP4s total 1,280,171 bytes. Originals are unchanged.
- Shared tokens and base typography are reused; Nocturne's files are unchanged.

## Checks and pending work

Desktop and mobile visual checks, initial videos unloaded, playback verified,
local assets/links/anchors validated and preservation hashes checked.
No animation polish or homepage interaction work was performed.

Nocturne and homepage Phases 1–2 remain approved. The hero scroll expansion and
horizontal Selected Work scrolling remain OPEN. The CV PDF's university “Current”
wording still needs a later update. Save State and Lusíada case studies are pending.

Status: User approved the Cyber Engineer case-study foundation. Preserve its current composition; no further polish in the Save State pass.
