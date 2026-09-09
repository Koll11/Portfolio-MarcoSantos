// Progressive navigation polish and contextual cursor
(() => {
  // 1. Navigation location cue
  const nav = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  if (nav.length) {
    const sections = nav.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    function update() {
      const active = sections.filter(s => s.getBoundingClientRect().top < innerHeight * 0.45).at(-1);
      nav.forEach(a => active && a.hash === `#${active.id}` ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
    }
    let queued = false;
    addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => { queued = false; update(); });
      }
    }, { passive: true });
    addEventListener('pageshow', update);
    update();
  }

  // 2. Subtle film grain layer injection
  if (!document.querySelector('.film-grain')) {
    const grain = document.createElement('div');
    grain.className = 'film-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  // 3. Truthful contextual cursor for interactive targets
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'context-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const cursorLabel = document.createElement('span');
  cursor.appendChild(cursorLabel);
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;
  let activeLabel = '';
  let isHovering = false;
  let isVisible = false;

  // Track preview button video states
  function isVideoPlaying(btn) {
    const parent = btn.closest('.media, .case-film-stage, .case-film, .world');
    const vid = parent?.querySelector('video');
    return vid && !vid.paused;
  }

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      cursorX = mouseX;
      cursorY = mouseY;
      isVisible = true;
    }

    const target = e.target;
    if (!target) return;

    // Truthful action targets ONLY
    const playTarget = target.closest('.preview-toggle, .case-play');
    const projectTarget = !playTarget && target.closest('[data-project-href], a.case-next, a.lu-next');
    const extTarget = !playTarget && !projectTarget && target.closest('a[target="_blank"], a[href$=".pdf"]');

    if (playTarget) {
      activeLabel = isVideoPlaying(playTarget) ? 'PAUSE Ⅱ' : 'PLAY ↗';
      isHovering = true;
    } else if (projectTarget) {
      activeLabel = 'VIEW ↗';
      isHovering = true;
    } else if (extTarget) {
      activeLabel = 'OPEN ↗';
      isHovering = true;
    } else {
      isHovering = false;
    }

    if (isHovering) {
      cursorLabel.textContent = activeLabel;
      cursor.classList.add('is-active');
    } else {
      cursor.classList.remove('is-active');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-active');
    isVisible = false;
  });

  // Clicking project media navigates truthfully
  document.addEventListener('click', e => {
    if (e.target.closest('.preview-toggle, .case-play, a, button, input, select')) return;
    const projectTarget = e.target.closest('[data-project-href]');
    if (projectTarget) {
      const href = projectTarget.getAttribute('data-project-href');
      if (href) {
        window.location.href = href;
      }
    }
  });

  // Accessible keyboard activation for media cards
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const active = document.activeElement;
      if (active && active.hasAttribute('data-project-href') && !e.target.closest('.preview-toggle')) {
        e.preventDefault();
        window.location.href = active.getAttribute('data-project-href');
      }
    }
  });

  // Smooth cursor trailing loop
  function loop() {
    if (isVisible) {
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;
      cursor.style.left = `${cursorX.toFixed(1)}px`;
      cursor.style.top = `${cursorY.toFixed(1)}px`;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // 4. Scoped View Transition Management & Lifecycle
  function getProjectKey(str) {
    if (!str) return null;
    if (str.includes('nocturne.html') || str.includes('nocturne')) return 'nocturne';
    if (str.includes('cyber.html') || str.includes('cyber')) return 'cyber';
    if (str.includes('savestate.html') || str.includes('save-state')) return 'save-state';
    if (str.includes('lusiada1.html') || str.includes('lusiada')) return 'lusiada';
    return null;
  }

  function setTransitionTarget(key) {
    document.querySelectorAll('[data-transition-active]').forEach(el => el.removeAttribute('data-transition-active'));
    const world = document.getElementById(key);
    if (world) {
      world.setAttribute('data-transition-active', 'true');
    }
  }

  function clearTransitionTarget() {
    document.querySelectorAll('[data-transition-active]').forEach(el => el.removeAttribute('data-transition-active'));
  }

  // Pre-tag target on direct user clicks so names are attached before navigation snapshot
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href$=".html"], [data-project-href]');
    if (!link) return;
    const href = link.getAttribute('href') || link.getAttribute('data-project-href');
    const key = getProjectKey(href);
    if (key) {
      setTransitionTarget(key);
      try { sessionStorage.setItem('activeTransitionProject', key); } catch (_) {}
    }
  }, { capture: true });

  // Outgoing page swap: coordinate shared-element target with View Transition
  window.addEventListener('pageswap', e => {
    const targetUrl = e.activation?.entry?.url;
    const key = getProjectKey(targetUrl);
    if (key) {
      setTransitionTarget(key);
      try { sessionStorage.setItem('activeTransitionProject', key); } catch (_) {}
    } else {
      // Returning to homepage from a case study
      const body = document.body;
      const caseKey = body.classList.contains('nocturne-case') ? 'nocturne' :
                      body.classList.contains('cyber-case') ? 'cyber' :
                      body.classList.contains('save-case') ? 'save-state' :
                      body.classList.contains('lusiada-case') ? 'lusiada' : null;
      if (caseKey) {
        try { sessionStorage.setItem('activeTransitionProject', caseKey); } catch (_) {}
      }
    }
  });

  // Incoming page reveal: attach transition name on homepage destination card
  window.addEventListener('pagereveal', e => {
    let activeKey = null;
    try { activeKey = sessionStorage.getItem('activeTransitionProject'); } catch (_) {}
    if (activeKey) {
      setTransitionTarget(activeKey);
    }
    if (e.viewTransition) {
      e.viewTransition.finished.finally(() => {
        clearTransitionTarget();
        try { sessionStorage.removeItem('activeTransitionProject'); } catch (_) {}
      });
    } else {
      setTimeout(clearTransitionTarget, 320);
    }
  });

  // bfcache & restore cleanup
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      clearTransitionTarget();
      try { sessionStorage.removeItem('activeTransitionProject'); } catch (_) {}
      cursor.classList.remove('is-active');
      isVisible = false;
    }
  });

  window.addEventListener('pagehide', () => {
    cursor.classList.remove('is-active');
    isVisible = false;
  });
})();


