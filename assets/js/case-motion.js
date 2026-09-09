// Dedicated case-study motion module for Marco Santos portfolio
// Implements restrained, cinematic scroll reveals and hero choreography.
// Strictly respects prefers-reduced-motion. Does not hide content in CSS.

(() => {
  'use strict';

  // 1. Accessibility & Environment Checks
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) return;

  // Listen for dynamic changes to reduced motion
  prefersReduced.addEventListener('change', e => {
    if (e.matches && window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(t => t.kill(true));
      gsap.globalTimeline.clear();
    }
  });

  // Track incoming View Transition lifecycle
  let transitionFinishedPromise = Promise.resolve();
  window.addEventListener('pagereveal', e => {
    if (e.viewTransition) {
      transitionFinishedPromise = e.viewTransition.finished.catch(() => {});
    }
  });

  // Verify GSAP and ScrollTrigger presence
  function initMotion() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const body = document.body;

    // Detect which project case study is active
    const isNocturne = body.classList.contains('nocturne-case');
    const isCyber = body.classList.contains('cyber-case');
    const isSaveState = body.classList.contains('save-case');
    const isLusiada = body.classList.contains('lusiada-case');

    if (!isNocturne && !isCyber && !isSaveState && !isLusiada) return;

    // Project-specific character profiles
    const config = isNocturne ? {
      ease: 'power3.out',
      headingDuration: 0.65,
      mediaDuration: 0.85,
      yOffset: 22,
      stagger: 0.14
    } : isCyber ? {
      ease: 'power2.out',
      headingDuration: 0.48,
      mediaDuration: 0.55,
      yOffset: 18,
      stagger: 0.11
    } : isSaveState ? {
      ease: 'sine.out',
      headingDuration: 0.68,
      mediaDuration: 0.75,
      yOffset: 14,
      stagger: 0.14
    } : {
      // Lusíada-1: expansive, calm, exploration feeling
      ease: 'power2.out',
      headingDuration: 0.75,
      mediaDuration: 0.95,
      yOffset: 20,
      stagger: 0.16
    };

    // Wait for incoming View Transition to finish before orchestrating entry reveals
    Promise.race([
      transitionFinishedPromise,
      new Promise(r => setTimeout(r, 280))
    ]).then(() => {
      initHero(config, { isNocturne, isCyber, isSaveState, isLusiada });
      initHeadings(config);
      initFeatureSections(config, { isNocturne, isCyber, isSaveState, isLusiada });
      initMedia(config, { isNocturne, isCyber, isSaveState, isLusiada });
      initSystemDiagrams(config, { isNocturne, isCyber, isSaveState, isLusiada });
      initNextProject(config);

      // Recompute trigger bounds once fonts & media settle
      window.addEventListener('load', () => ScrollTrigger.refresh());
    });
  }

  // ==========================================
  // 1. HERO CHOREOGRAPHY
  // Title reveals first -> metadata follows -> hero media reveals via mask/clip -> intro text last
  // ==========================================
  function initHero(config, flags) {
    const tl = gsap.timeline({ defaults: { ease: config.ease } });

    if (flags.isNocturne) {
      const hero = document.querySelector('.case-hero');
      if (!hero) return;
      const title = hero.querySelector('.case-hero-title');
      const meta = hero.querySelector('.case-hero-top');
      const media = hero.querySelector('.case-hero-image');
      const intro = hero.querySelector('.case-hero-bottom');

      if (title) tl.from(title, { opacity: 0, y: config.yOffset + 4, duration: 0.65 }, 0.05);
      if (meta) tl.from(meta, { opacity: 0, y: -10, duration: 0.5 }, 0.18);
      if (media) {
        // Emerges from darkness with subtle scale settle
        tl.from(media, {
          opacity: 0.25,
          scale: 1.035,
          duration: 0.9,
          ease: 'power2.out'
        }, 0.22);
      }
      if (intro) tl.from(intro, { opacity: 0, y: 16, duration: 0.55 }, 0.42);
    }
    else if (flags.isCyber) {
      const hero = document.querySelector('.ce-hero');
      if (!hero) return;
      const title = hero.querySelector('.ce-hero-copy h1, .ce-hero-copy .eyebrow');
      const meta = hero.querySelectorAll('.ce-label, .ce-hero-base');
      const sequence = hero.querySelector('.ce-hero-sequence');
      const intro = hero.querySelectorAll('.ce-hero-intro, .ce-hero-copy .text-link');

      if (title) tl.from(title, { opacity: 0, y: config.yOffset, duration: 0.48 }, 0.05);
      if (meta.length) tl.from(meta, { opacity: 0, y: -8, duration: 0.45 }, 0.16);
      if (sequence) {
        // Crisp high-tech sequence reveal
        tl.from(sequence, {
          opacity: 0,
          scale: 0.98,
          duration: 0.58,
          ease: 'power2.out'
        }, 0.20);
      }
      if (intro.length) tl.from(intro, { opacity: 0, y: 14, duration: 0.45 }, 0.36);
    }
    else if (flags.isSaveState) {
      const hero = document.querySelector('.ss-hero');
      if (!hero) return;
      const title = hero.querySelector('.ss-hero-title');
      const meta = hero.querySelectorAll('.ss-label, .ss-hero-bottom');
      const frame = hero.querySelector('.ss-hero-frame');
      const intro = hero.querySelector('.ss-hero-copy');

      if (title) tl.from(title, { opacity: 0, y: config.yOffset, duration: 0.68, ease: 'power1.out' }, 0.05);
      if (meta.length) tl.from(meta, { opacity: 0, y: -8, duration: 0.55, ease: 'power1.out' }, 0.20);
      if (frame) {
        // Softer lift, tactile settle on workbench
        tl.from(frame, {
          opacity: 0,
          y: 18,
          scale: 1.02,
          duration: 0.75,
          ease: 'sine.out'
        }, 0.26);
      }
      if (intro) tl.from(intro, { opacity: 0, y: 12, duration: 0.6, ease: 'power1.out' }, 0.42);
    }
    else if (flags.isLusiada) {
      const hero = document.querySelector('.lu-hero');
      if (!hero) return;
      const title = hero.querySelector('.lu-title');
      const meta = hero.querySelectorAll('.lu-label, .lu-hero-bottom');
      const world = hero.querySelector('.lu-hero-world');
      const intro = hero.querySelector('.lu-hero-copy');

      if (title) tl.from(title, { opacity: 0, y: config.yOffset, duration: 0.75 }, 0.05);
      if (meta.length) tl.from(meta, { opacity: 0, y: -10, duration: 0.65 }, 0.22);
      if (world) {
        // Expansive cosmic drift
        tl.from(world, {
          opacity: 0,
          scale: 1.05,
          x: 24,
          duration: 1.05,
          ease: 'power1.out'
        }, 0.28);
      }
      if (intro) tl.from(intro, { opacity: 0, y: 16, duration: 0.7 }, 0.48);
    }
  }

  // ==========================================
  // 2. SECTION LABELS & HEADINGS
  // Clean, restrained opacity + small translateY (16-24px), 0.5-0.7s duration
  // ==========================================
  function initHeadings(config) {
    const headingPairs = [
      // Nocturne
      '.case-section:not(#systems):not(#replication) .case-section-label',
      '.case-overview h2',
      '.case-contributions h2',
      '.case-outcome h2',
      // Cyber
      '.ce-section:not(#upgrades):not(#waves):not(.ce-gameplay) .ce-label',
      '.ce-overview h2',
      '.ce-contributions h2',
      '.ce-takeaway h2',
      // Save State
      '.ss-section:not(#assembly):not(#system):not(.ss-showcase) .ss-label',
      '.ss-overview h2',
      '.ss-contributions h2',
      '.ss-takeaway h2',
      // Lusíada
      '.lu-section:not(#lighting):not(#system):not(.lu-camera):not(.lu-exploration) .lu-label',
      '.lu-overview h2',
      '.lu-contributions h2',
      '.lu-takeaway h2'
    ];

    headingPairs.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          opacity: 0,
          y: config.yOffset,
          duration: config.headingDuration,
          ease: config.ease
        });
      });
    });
  }

  // ==========================================
  // 3. FEATURE SECTIONS (MEDIA + TEXT HIERARCHY)
  // Strict sequence: 1. Media reveals -> 2. Title follows -> 3. Supporting text follows
  // ==========================================
  function initFeatureSections(config, flags) {
    function wireFeature(sectionEl, mediaEl, titleEl, textEl) {
      if (!sectionEl || !mediaEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          once: true
        },
        defaults: { ease: config.ease }
      });

      // 1. Media reveals first
      tl.from(mediaEl, {
        opacity: 0,
        scale: flags.isLusiada ? 1.04 : 1.025,
        duration: config.mediaDuration,
        ease: flags.isSaveState ? 'sine.out' : 'power2.out'
      }, 0);

      // 2. Title follows slightly after
      if (titleEl) {
        tl.from(titleEl, {
          opacity: 0,
          y: config.yOffset,
          duration: config.headingDuration
        }, 0.12);
      }

      // 3. Supporting text follows last
      if (textEl) {
        tl.from(textEl, {
          opacity: 0,
          y: Math.round(config.yOffset * 0.75),
          duration: config.headingDuration
        }, 0.22);
      }
    }

    if (flags.isNocturne) {
      // 03 / Combat
      const combat = document.querySelector('.case-combat');
      if (combat) {
        wireFeature(
          combat,
          combat.querySelector('.case-film'),
          combat.querySelector('.case-feature-heading'),
          combat.querySelector('.case-insight')
        );
      }
      // 05 / Replication
      const rep = document.querySelector('.case-replication');
      if (rep) {
        wireFeature(
          rep,
          rep.querySelector('.case-film'),
          rep.querySelector('.case-section-label, .case-replication-copy h2'),
          rep.querySelector('.case-replication-copy p')
        );
      }
      // 06 / Showcase
      const showcase = document.querySelector('.case-showcase');
      if (showcase) {
        wireFeature(
          showcase,
          showcase.querySelector('.case-town'),
          showcase.querySelector('.case-showcase-heading'),
          showcase.querySelector('.case-moments')
        );
      }
    }
    else if (flags.isCyber) {
      // 03 / Upgrades
      const upgrades = document.querySelector('.ce-upgrades');
      if (upgrades) {
        wireFeature(
          upgrades,
          upgrades.querySelector('.ce-upgrade-media'),
          upgrades.querySelector('.ce-label, .ce-upgrade-copy h2'),
          upgrades.querySelector('.ce-upgrade-copy p, .ce-class-list')
        );
      }
      // 04 / Waves & Spawning
      const waves = document.querySelector('.ce-waves');
      if (waves) {
        wireFeature(
          waves,
          waves.querySelector('.ce-spawn-layout figure.ce-film'),
          waves.querySelector('.ce-wave-heading'),
          waves.querySelector('.ce-wave-range, .ce-spawn-rules')
        );
      }
      // 05 / Arena Gameplay
      const gameplay = document.querySelector('.ce-gameplay');
      if (gameplay) {
        wireFeature(
          gameplay,
          gameplay.querySelector('figure.ce-film'),
          gameplay.querySelector('.ce-run-copy h2'),
          gameplay.querySelector('.ce-run-copy p, .ce-character')
        );
      }
    }
    else if (flags.isSaveState) {
      // 03 / Assembly
      const assembly = document.querySelector('.ss-assembly');
      if (assembly) {
        wireFeature(
          assembly,
          assembly.querySelector('.ss-film'),
          assembly.querySelector('.ss-label, .ss-assembly-heading h2'),
          assembly.querySelector('.ss-note')
        );
      }
      // 05 / Showcase
      const showcase = document.querySelector('.ss-showcase');
      if (showcase) {
        wireFeature(
          showcase,
          showcase.querySelector('.ss-sequence'),
          showcase.querySelector('.ss-label, .ss-showcase-heading h2'),
          showcase.querySelector('.ss-showcase-heading p')
        );
      }
    }
    else if (flags.isLusiada) {
      // 03 / Lighting
      const lighting = document.querySelector('.lu-lighting');
      if (lighting) {
        wireFeature(
          lighting,
          lighting.querySelector('.lu-film.lu-wide'),
          lighting.querySelector('.lu-label, .lu-lighting-heading h2'),
          lighting.querySelector('.lu-lighting-notes')
        );
      }
      // 05 / Camera
      const camera = document.querySelector('.lu-camera');
      if (camera) {
        wireFeature(
          camera,
          camera.querySelector('.lu-camera-grid figure.lu-film'),
          camera.querySelector('.lu-label, .lu-camera-grid h2'),
          camera.querySelector('.lu-camera-grid p')
        );
      }
      // 06 / Exploration
      const exploration = document.querySelector('.lu-exploration');
      if (exploration) {
        wireFeature(
          exploration,
          exploration.querySelector('.lu-exploration-grid figure.lu-film'),
          exploration.querySelector('.lu-exploration-heading'),
          exploration.querySelector('.lu-exploration-grid > p')
        );
      }
    }
  }

  // ==========================================
  // 4. MEDIA & SECONDARY VISUAL ELEMENTS
  // Non-uniform reveal timing, restrained clip/scale + opacity
  // ==========================================
  function initMedia(config, flags) {
    const secondaryFigures = [
      '.lu-departure',
      '.case-moments figure'
    ];

    secondaryFigures.forEach(sel => {
      document.querySelectorAll(sel).forEach((fig, i) => {
        gsap.from(fig, {
          scrollTrigger: {
            trigger: fig,
            start: 'top 86%',
            once: true
          },
          opacity: 0,
          scale: 1.02,
          duration: config.mediaDuration * 0.9,
          delay: i * 0.08,
          ease: config.ease
        });
      });
    });
  }

  // ==========================================
  // 5. SYSTEM DIAGRAMS & TECHNICAL FLOW SEQUENCING
  // Sequential step-by-step stagger communicating directional flow
  // ==========================================
  function initSystemDiagrams(config, flags) {
    if (flags.isNocturne) {
      // Nocturne: 01 Client -> 02 Combat -> 03 Server -> 04 All clients
      const systemSec = document.querySelector('.case-system');
      if (!systemSec) return;
      const steps = systemSec.querySelectorAll('.case-flow li');
      const note = systemSec.querySelector('.case-system-note');
      const heading = systemSec.querySelector('.case-system-heading');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: systemSec,
          start: 'top 80%',
          once: true
        },
        defaults: { ease: 'power2.out' }
      });

      if (heading) tl.from(heading, { opacity: 0, y: config.yOffset, duration: config.headingDuration }, 0);
      if (steps.length) {
        tl.from(steps, {
          opacity: 0,
          x: -14,
          duration: 0.55,
          stagger: 0.14
        }, 0.15);
      }
      if (note) tl.from(note, { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
    }
    else if (flags.isCyber) {
      // Cyber: Pool flow (01 Source -> 02 Availability -> 03 Presentation)
      const upgradeSys = document.querySelector('.ce-upgrade-system');
      if (upgradeSys) {
        const flowItems = upgradeSys.querySelectorAll('.ce-pool-flow li');
        const sysHeading = upgradeSys.querySelector('.ce-system-heading');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: upgradeSys,
            start: 'top 82%',
            once: true
          },
          defaults: { ease: 'power2.out' }
        });

        if (sysHeading) tl.from(sysHeading, { opacity: 0, y: config.yOffset, duration: config.headingDuration }, 0);
        if (flowItems.length) {
          tl.from(flowItems, {
            opacity: 0,
            y: 14,
            duration: 0.45,
            stagger: 0.11
          }, 0.12);
        }
      }

      // Spawn rules in waves section
      const spawnLayout = document.querySelector('.ce-spawn-layout');
      if (spawnLayout) {
        const rules = spawnLayout.querySelectorAll('.ce-spawn-rules li');
        if (rules.length) {
          gsap.from(rules, {
            scrollTrigger: {
              trigger: spawnLayout,
              start: 'top 80%',
              once: true
            },
            opacity: 0,
            x: -12,
            duration: 0.45,
            stagger: 0.10,
            ease: 'power2.out'
          });
        }
      }
    }
    else if (flags.isSaveState) {
      // Save State: Flow (01 Assemble -> 02 Deliver -> 03 Check attachments -> Outcomes)
      const sysSec = document.querySelector('.ss-system');
      if (sysSec) {
        const flowSteps = sysSec.querySelectorAll('.ss-flow li');
        const outcomes = sysSec.querySelector('.ss-outcomes');
        const note = sysSec.querySelector('.ss-system-note');
        const heading = sysSec.querySelector('.ss-two-col');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sysSec,
            start: 'top 80%',
            once: true
          },
          defaults: { ease: 'sine.out' }
        });

        if (heading) tl.from(heading, { opacity: 0, y: config.yOffset, duration: config.headingDuration }, 0);
        if (flowSteps.length) {
          tl.from(flowSteps, {
            opacity: 0,
            x: -10,
            duration: 0.6,
            stagger: 0.14
          }, 0.14);
        }
        if (outcomes) tl.from(outcomes, { opacity: 0, y: 12, duration: 0.55 }, '-=0.2');
        if (note) tl.from(note, { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
      }

      // Implementation note attachment diagram in Assembly
      const attach = document.querySelector('.ss-attachment');
      if (attach) {
        const parts = attach.querySelectorAll('span, strong');
        if (parts.length) {
          gsap.from(parts, {
            scrollTrigger: {
              trigger: attach,
              start: 'top 85%',
              once: true
            },
            opacity: 0,
            y: 8,
            duration: 0.45,
            stagger: 0.10,
            ease: 'sine.out'
          });
        }
      }
    }
    else if (flags.isLusiada) {
      // Lusíada-1: Diagram (Inputs -> Arrow -> Result)
      const diagram = document.querySelector('.lu-diagram');
      if (diagram) {
        const inputs = diagram.querySelectorAll('.lu-inputs > div');
        const arrow = diagram.querySelector('.lu-join');
        const result = diagram.querySelector('.lu-result');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagram,
            start: 'top 82%',
            once: true
          },
          defaults: { ease: 'power2.out' }
        });

        if (inputs.length) {
          tl.from(inputs, {
            opacity: 0,
            x: -16,
            duration: 0.6,
            stagger: 0.16
          }, 0);
        }
        if (arrow) tl.from(arrow, { opacity: 0, scale: 0.8, duration: 0.5 }, 0.28);
        if (result) tl.from(result, { opacity: 0, x: 16, duration: 0.65 }, 0.38);
      }
    }
  }

  // ==========================================
  // 6. NEXT PROJECT TEASER
  // Restrained entrance when scrolling to the bottom
  // ==========================================
  function initNextProject(config) {
    const nextLink = document.querySelector('.case-next, .ce-next, .ss-next, .lu-next');
    if (!nextLink) return;

    gsap.from(nextLink, {
      scrollTrigger: {
        trigger: nextLink,
        start: 'top 90%',
        once: true
      },
      opacity: 0,
      y: config.yOffset,
      duration: config.headingDuration,
      ease: config.ease
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }

  // Handle bfcache restoration
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(t => t.kill(true));
      }
      if (window.gsap) {
        gsap.globalTimeline.clear();
      }
      initMotion();
    }
  });
})();
