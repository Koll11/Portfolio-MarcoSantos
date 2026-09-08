// Homepage scroll enhancement. No preferences, URL switches or preview dependencies.
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.hero-scene');
  const work = document.querySelector('.work');
  const stage = document.querySelector('.gallery-stage');
  const track = document.querySelector('.gallery-track');
  const worlds = [...track.querySelectorAll('.world')];
  const links = [...document.querySelectorAll('.gallery-index a')];
  const buttons = [...document.querySelectorAll('[data-direction]')];
  const output = document.querySelector('.gallery-controls output');
  const header = () => document.querySelector('.site-header').offsetHeight;

  // Pin refresh temporarily reparents content. Preserve keyboard focus across that operation.
  let focusedBeforeRefresh;
  ScrollTrigger.addEventListener('refreshInit', () => { focusedBeforeRefresh = document.activeElement; });
  ScrollTrigger.addEventListener('refresh', () => {
    if (focusedBeforeRefresh?.isConnected && focusedBeforeRefresh !== document.body && document.activeElement === document.body) {
      focusedBeforeRefresh.focus({ preventScroll: true });
    }
  });

  // Save initial styles before ScrollTrigger modifies anything
  ScrollTrigger.saveStyles('.hero, .hero-scene, .hero-cinema, .hero h1, .hero-kicker, .hero-statement, .hero-base, .hero-cinema img');

  const mm = gsap.matchMedia();

  // Atmospheric color interpolation with early warm twilight transition into Save State pastel
  function getAtmosphere(progress) {
    // progress ranges from 0 to 1 across the gallery timeline
    if (progress <= 0.34) {
      // Nocturne (#150e13) -> Cyber Engineer (#111e2b)
      const u = Math.min(1, Math.max(0, progress / 0.34));
      return gsap.utils.interpolate('#150e13', '#111e2b', u);
    } else if (progress <= 0.66) {
      // Cyber Engineer (#111e2b) -> Save State (#edc7b7)
      // Warmth begins appearing earlier through a dusky violet/terracotta bridge
      const u = Math.min(1, Math.max(0, (progress - 0.34) / 0.32));
      if (u < 0.35) {
        return gsap.utils.interpolate('#111e2b', '#2e2330', u / 0.35);
      } else if (u < 0.72) {
        return gsap.utils.interpolate('#2e2330', '#8c6670', (u - 0.35) / 0.37);
      } else {
        return gsap.utils.interpolate('#8c6670', '#edc7b7', (u - 0.72) / 0.28);
      }
    } else {
      // Save State (#edc7b7) -> Lusíada-1 (#090f18)
      // Soft transition from bright pastel through cosmic deep space
      const u = Math.min(1, Math.max(0, (progress - 0.66) / 0.34));
      if (u < 0.45) {
        return gsap.utils.interpolate('#edc7b7', '#251d2a', u / 0.45);
      } else {
        return gsap.utils.interpolate('#251d2a', '#090f18', (u - 0.45) / 0.55);
      }
    }
  }

  mm.add('(min-width:1100px) and (prefers-reduced-motion:no-preference)', () => {
    hero.classList.add('is-scroll-hero');
    work.classList.add('is-horizontal');

    // 1. CINEMATIC HERO TAKEOVER: Typography recedes early -> Media expands outward -> Brief immersive hold
    const takeover = gsap.timeline({
      scrollTrigger: {
        id: 'hero-expansion',
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(innerHeight * 1.8)}`,
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: false,
        anticipatePin: 1,
        onLeaveBack: () => {
          takeover.progress(0);
          hero.style.setProperty('--hero-progress', '0');
        },
        onUpdate: (self) => {
          if (self.progress === 0) {
            hero.style.setProperty('--hero-progress', '0');
          }
        }
      }
    });

    takeover
      // Typography gently recedes in the first portion (0.0 to 0.4) so media becomes protagonist
      .fromTo('.hero h1, .hero-kicker, .hero-statement',
        { opacity: 1, y: 0 },
        { opacity: 0, y: -75, duration: 0.4, ease: 'power2.inOut' }, 0)
      // Hero base fades out early
      .fromTo('.hero-base',
        { opacity: 1 },
        { opacity: 0, duration: 0.28, ease: 'power1.in' }, 0)
      // Media opens up smoothly to full bleed (0.0 to 0.82) driven by --hero-progress
      .fromTo(hero, { '--hero-progress': 0 }, { '--hero-progress': 1, duration: 0.82, ease: 'power1.inOut' }, 0)
      // Restrained image scale
      .fromTo('.hero-cinema img', { scale: 1 }, { scale: 1.07, duration: 0.82, ease: 'power1.out' }, 0)
      // Dedicated hold at full-bleed before releasing into Selected Work (0.82 to 1.0)
      .to({}, { duration: 0.18 });

    // 2. HORIZONTAL GALLERY: Continuous scroll with soft landing/plateaus for each project
    const distance = () => track.scrollWidth - stage.clientWidth;
    const step = () => distance() / 3;

    const journey = gsap.timeline({
      scrollTrigger: {
        id: 'selected-work',
        trigger: stage,
        start: () => `top ${header()}`,
        end: () => `+=${Math.round(distance() * 1.25)}`,
        pin: stage,
        scrub: 0.45,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate(self) {
          const p = self.progress;
          // Determine current project index from normalized position
          let current = 0;
          if (p >= 0.82) current = 3;
          else if (p >= 0.50) current = 2;
          else if (p >= 0.20) current = 1;

          // Atmospheric color transition
          stage.style.backgroundColor = getAtmosphere(p);

          // Update navigation states
          links.forEach((a, i) => i === current ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
          output.value = `${String(current + 1).padStart(2, '0')} / 04`;
          buttons[0].disabled = current === 0;
          buttons[1].disabled = current === worlds.length - 1;
        }
      }
    });

    // Paced movement across duration 3.20:
    // 0.00 - 0.20: Nocturne lands & breathes
    // 0.20 - 1.00: Smooth transition to Cyber Engineer
    // 1.00 - 1.20: Cyber Engineer settles in center
    // 1.20 - 2.00: Smooth transition to Save State
    // 2.00 - 2.20: Save State gets moment to breathe
    // 2.20 - 3.00: Smooth transition to Lusíada-1
    // 3.00 - 3.20: Lusíada-1 final destination hold
    journey
      .to(track, { x: () => 0, duration: 0.2, ease: 'none' }, 0)
      .to(track, { x: () => -step(), duration: 0.8, ease: 'power1.inOut' }, 0.2)
      .to(track, { x: () => -step(), duration: 0.2, ease: 'none' }, 1.0)
      .to(track, { x: () => -step() * 2, duration: 0.8, ease: 'power1.inOut' }, 1.2)
      .to(track, { x: () => -step() * 2, duration: 0.2, ease: 'none' }, 2.0)
      .to(track, { x: () => -distance(), duration: 0.8, ease: 'power1.inOut' }, 2.2)
      .to(track, { x: () => -distance(), duration: 0.2, ease: 'none' }, 3.0);

    // Subtle project heading entrance reveals
    worlds.forEach(world => {
      gsap.from(world.querySelector('h3'), {
        y: 36,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: world,
          containerAnimation: journey,
          start: 'left 80%',
          toggleActions: 'play none none reverse'
        }
      });
      gsap.from(world.querySelector('.world-top'), {
        y: 16,
        opacity: 0,
        duration: 0.5,
        delay: 0.08,
        scrollTrigger: {
          trigger: world,
          containerAnimation: journey,
          start: 'left 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    return () => {
      hero.classList.remove('is-scroll-hero');
      work.classList.remove('is-horizontal');
      stage.style.backgroundColor = '';
      links.forEach(a => a.removeAttribute('aria-current'));
    };
  });

  // 3. EDITORIAL REVEALS & SKILLS ENTRY RHYTHM
  mm.add('(prefers-reduced-motion:no-preference)', () => {
    // Editorial section headings and intros
    document.querySelectorAll('.work-intro > *, .p2-section-heading, .p2-about h2, .p2-portrait, .p2-bio, .p2-skills-heading, .p2-cv, .p2-contact h2, .p2-contact-bottom').forEach(element => {
      gsap.from(element, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Staggered rhythmic reveal for skills rows
    const skillRows = document.querySelectorAll('.p2-skill-row');
    if (skillRows.length) {
      gsap.from(skillRows, {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.p2-skills',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // Coalesce late font/media changes; GSAP owns resize/pin measurement and cleanup.
  let refreshTimer;
  const refresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
  };
  window.addEventListener('load', refresh);
  window.addEventListener('pageshow', refresh);
  document.fonts.ready.then(refresh);
  document.fonts.addEventListener('loadingdone', refresh);
  document.querySelectorAll('img,video').forEach(media => {
    media.addEventListener('load', refresh);
    media.addEventListener('loadedmetadata', refresh);
  });
})();
