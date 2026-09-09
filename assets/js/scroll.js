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
  const progressEditorial = document.querySelector('.gallery-progress-editorial');
  const ambient = document.querySelector('.gallery-ambient');
  const projectTitleNames = ['Nocturne Battlegrounds', 'Cyber Engineer', 'Save State', 'Lusíada-1'];
  const projectKeys = ['nocturne', 'cyber', 'save-state', 'lusiada'];
  const header = () => document.querySelector('.site-header').offsetHeight;

  // Pin refresh temporarily reparents content. Preserve keyboard focus and normalized progress across that operation.
  let focusedBeforeRefresh;
  let preservedProgress = null;
  ScrollTrigger.addEventListener('refreshInit', () => {
    window._isPinRefreshing = true;
    focusedBeforeRefresh = document.activeElement;
    const st = ScrollTrigger.getById('selected-work');
    if (st && st.progress > 0.001 && st.isActive) {
      preservedProgress = st.progress;
    } else {
      preservedProgress = null;
    }
  });
  ScrollTrigger.addEventListener('refresh', () => {
    const st = ScrollTrigger.getById('selected-work');
    if (st && preservedProgress !== null && preservedProgress > 0.001) {
      st.scroll(st.start + (st.end - st.start) * preservedProgress);
      st.progress = preservedProgress;
      preservedProgress = null;
    }
    if (focusedBeforeRefresh?.isConnected && focusedBeforeRefresh !== document.body && document.activeElement === document.body) {
      focusedBeforeRefresh.focus({ preventScroll: true });
    }
    requestAnimationFrame(() => {
      window._isPinRefreshing = false;
    });
  });

  // Save initial styles before ScrollTrigger modifies anything
  ScrollTrigger.saveStyles('.hero, .hero-scene, .hero-cinema, .hero h1, .hero-kicker, .hero-statement, .hero-base, .hero-cinema img, .hero-cinema video');

  const mm = gsap.matchMedia();

  // Atmospheric color interpolation with overlapping ambient twilight transitions between distinct world palettes
  function getAtmosphere(progress) {
    if (progress <= 0.33) {
      // Nocturne (#150e13) -> Cyber Engineer (#111e2b)
      // Blood-red ambience slowly cools into slate-blue
      const u = Math.min(1, Math.max(0, progress / 0.33));
      if (u < 0.35) {
        return gsap.utils.interpolate('#150e13', '#16131c', u / 0.35);
      } else {
        return gsap.utils.interpolate('#16131c', '#111e2b', (u - 0.35) / 0.65);
      }
    } else if (progress <= 0.67) {
      // Cyber Engineer (#111e2b) -> Save State (#edc7b7)
      // Cold blue -> desaturates into dusky indigo -> warm peach/pink ambient light bleeds in -> Save State dominant
      const u = Math.min(1, Math.max(0, (progress - 0.33) / 0.34));
      if (u < 0.25) {
        return gsap.utils.interpolate('#111e2b', '#1b1b28', u / 0.25);
      } else if (u < 0.55) {
        return gsap.utils.interpolate('#1b1b28', '#643e4c', (u - 0.25) / 0.30);
      } else {
        return gsap.utils.interpolate('#643e4c', '#edc7b7', (u - 0.55) / 0.45);
      }
    } else {
      // Save State (#edc7b7) -> Lusíada-1 (#090f18)
      // Pastel warmth -> edges darken -> deep blue space atmosphere emerges -> Lusíada dominant
      const u = Math.min(1, Math.max(0, (progress - 0.67) / 0.33));
      if (u < 0.25) {
        return gsap.utils.interpolate('#edc7b7', '#735061', u / 0.25);
      } else if (u < 0.60) {
        return gsap.utils.interpolate('#735061', '#181b2c', (u - 0.25) / 0.35);
      } else {
        return gsap.utils.interpolate('#181b2c', '#090f18', (u - 0.60) / 0.40);
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
          document.documentElement.style.setProperty('--grain-opacity', '0.032');
          document.documentElement.removeAttribute('data-active-project');
          if (ambient) {
            ambient.style.removeProperty('--ambient-opacity');
            ambient.style.removeProperty('--ambient-opacity2');
          }
        },
        onUpdate: (self) => {
          if (self.progress === 0) {
            hero.style.setProperty('--hero-progress', '0');
            document.documentElement.style.setProperty('--grain-opacity', '0.032');
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
      // Restrained image/video scale
      .fromTo('.hero-cinema img, .hero-cinema video', { scale: 1 }, { scale: 1.07, duration: 0.82, ease: 'power1.out' }, 0)
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
        invalidateOnRefresh: false,
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

          // Overlapping ambient washes: next world subtly influences atmosphere before its panel arrives
          if (ambient) {
            if (p < 0.33) {
              // Approaching Cyber from Nocturne
              const bleed = Math.max(0, Math.min(1, (p - 0.12) / 0.21));
              ambient.style.setProperty('--ambient-glow', 'rgba(34, 73, 104, 0.42)');
              ambient.style.setProperty('--ambient-opacity', (bleed * 0.75).toFixed(3));
              ambient.style.setProperty('--ambient-x', `${(92 - bleed * 22).toFixed(1)}%`);
              ambient.style.setProperty('--ambient-opacity2', '0');
            } else if (p < 0.67) {
              // Approaching Save State from Cyber
              // Warm peach/pink ambient light bleeds into Cyber composition early
              const bleed = Math.max(0, Math.min(1, (p - 0.40) / 0.24));
              ambient.style.setProperty('--ambient-glow', 'rgba(237, 199, 183, 0.55)');
              ambient.style.setProperty('--ambient-opacity', (bleed * 0.85).toFixed(3));
              ambient.style.setProperty('--ambient-x', `${(94 - bleed * 32).toFixed(1)}%`);
              // Fade out Cyber blue glow on the left
              const fadeBlue = Math.max(0, 1 - (p - 0.33) / 0.20);
              ambient.style.setProperty('--ambient-glow2', 'rgba(34, 73, 104, 0.3)');
              ambient.style.setProperty('--ambient-opacity2', (fadeBlue * 0.5).toFixed(3));
              ambient.style.setProperty('--ambient-x2', '12%');
            } else {
              // Approaching Lusíada-1 from Save State
              // Deep cosmic blue/space atmosphere emerges on the right edge
              const bleed = Math.max(0, Math.min(1, (p - 0.70) / 0.24));
              ambient.style.setProperty('--ambient-glow', 'rgba(16, 28, 48, 0.75)');
              ambient.style.setProperty('--ambient-opacity', (bleed * 0.9).toFixed(3));
              ambient.style.setProperty('--ambient-x', `${(95 - bleed * 35).toFixed(1)}%`);
              // Fade out Save State warmth on the left
              const fadePeach = Math.max(0, 1 - (p - 0.67) / 0.22);
              ambient.style.setProperty('--ambient-glow2', 'rgba(237, 199, 183, 0.4)');
              ambient.style.setProperty('--ambient-opacity2', (fadePeach * 0.6).toFixed(3));
              ambient.style.setProperty('--ambient-x2', '15%');
            }
          }

          // Update editorial progress indicator & active project label
          if (progressEditorial) {
            progressEditorial.style.setProperty('--journey-progress', p.toFixed(4));
            const nameEl = progressEditorial.querySelector('.editorial-project-name');
            if (nameEl && projectTitleNames[current]) {
              nameEl.textContent = projectTitleNames[current];
            }
          }

          // Subtle grain adaptation (quieter on Save State)
          document.documentElement.setAttribute('data-active-project', projectKeys[current]);
          document.documentElement.style.setProperty('--grain-opacity', current === 2 ? '0.008' : '0.032');

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

    // 4 & 5. CHOREOGRAPHED TYPOGRAPHIC RHYTHM & ATMOSPHERIC MEDIA REVEALS
    worlds.forEach((world, idx) => {
      // 5. Typography reveal rhythm: Title -> Metadata -> Supporting copy
      const h3 = world.querySelector('h3');
      const top = world.querySelector('.world-top');
      const copy = world.querySelectorAll('.world-copy, .text-link, .world-footer, .subtitle, .system-notes, .save-caption');

      if (h3) {
        gsap.from(h3, {
          y: 34,
          opacity: 0,
          duration: 0.58,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: world,
            containerAnimation: journey,
            start: 'left 82%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      if (top) {
        gsap.from(top, {
          y: 16,
          opacity: 0,
          duration: 0.48,
          delay: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: world,
            containerAnimation: journey,
            start: 'left 82%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      if (copy.length) {
        gsap.from(copy, {
          y: 18,
          opacity: 0,
          duration: 0.52,
          delay: 0.16,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: world,
            containerAnimation: journey,
            start: 'left 82%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // 4. Media reveals tailored to each world's atmosphere
      if (idx === 0) {
        // Nocturne: Emerges softly from darkness
        const nocturneMedia = world.querySelector('.media');
        if (nocturneMedia) {
          gsap.from(nocturneMedia, {
            scale: 0.96,
            opacity: 0.4,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 90%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      } else if (idx === 1) {
        // Cyber Engineer: Clean, precise geometric reveal with rhythmic stagger
        const details = world.querySelectorAll('.cyber-detail');
        const cyberMedia = world.querySelector('.media');
        if (details.length >= 2 && cyberMedia) {
          gsap.from(details[0], {
            y: 28,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
          gsap.from(cyberMedia, {
            y: 35,
            scale: 0.96,
            opacity: 0,
            duration: 0.6,
            delay: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
          gsap.from(details[1], {
            y: 28,
            opacity: 0,
            duration: 0.55,
            delay: 0.16,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      } else if (idx === 2) {
        // Save State: Gentle soft lift and warm settling
        const saveMedia = world.querySelector('.media');
        const saveDetails = world.querySelectorAll('.save-detail');
        if (saveMedia) {
          gsap.from(saveMedia, {
            y: 26,
            rotation: -5.5,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
        }
        if (saveDetails.length) {
          gsap.from(saveDetails, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      } else if (idx === 3) {
        // Lusíada-1: Spatial calm—deep serene drift
        const lusiadaMedia = world.querySelector('.media');
        if (lusiadaMedia) {
          gsap.from(lusiadaMedia, {
            x: 40,
            scale: 1.04,
            opacity: 0,
            duration: 0.85,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: world,
              containerAnimation: journey,
              start: 'left 82%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }
    });

    // 6. RESTRAINED MICRO-DEPTH (Differential parallax across active world components)
    // Nocturne: Background cathedral media drifts slightly relative to foreground typography
    const nocturneMediaEl = document.querySelector('#nocturne .media');
    if (nocturneMediaEl) {
      gsap.to(nocturneMediaEl, {
        x: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#nocturne',
          containerAnimation: journey,
          scrub: true,
          start: 'left right',
          end: 'right left'
        }
      });
    }

    // Cyber: 3 gameplay frames move at slightly differential rates (subtle 3D depth)
    const cyberLeft = document.querySelector('#cyber .cyber-detail:first-child');
    const cyberRight = document.querySelector('#cyber .cyber-detail.encounter');
    if (cyberLeft && cyberRight) {
      gsap.to(cyberLeft, {
        x: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#cyber',
          containerAnimation: journey,
          scrub: true,
          start: 'left right',
          end: 'right left'
        }
      });
      gsap.to(cyberRight, {
        x: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#cyber',
          containerAnimation: journey,
          scrub: true,
          start: 'left right',
          end: 'right left'
        }
      });
    }

    // Save State: Secondary inspection frames drift slightly relative to main workbench
    const saveDetailsList = document.querySelectorAll('#save-state .save-detail');
    if (saveDetailsList.length) {
      gsap.to(saveDetailsList, {
        x: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#save-state',
          containerAnimation: journey,
          scrub: true,
          start: 'left right',
          end: 'right left'
        }
      });
    }

    // Lusíada: Spacecraft & nebula drift slightly slower than typography to convey vastness
    const lusiadaMediaEl = document.querySelector('#lusiada .media');
    if (lusiadaMediaEl) {
      gsap.to(lusiadaMediaEl, {
        x: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#lusiada',
          containerAnimation: journey,
          scrub: true,
          start: 'left right',
          end: 'right left'
        }
      });
    }

    return () => {
      hero.classList.remove('is-scroll-hero');
      work.classList.remove('is-horizontal');
      stage.style.backgroundColor = '';
      if (ambient) {
        ambient.style.removeProperty('--ambient-opacity');
        ambient.style.removeProperty('--ambient-opacity2');
      }
      document.documentElement.removeAttribute('data-active-project');
      document.documentElement.style.removeProperty('--grain-opacity');
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
})();
