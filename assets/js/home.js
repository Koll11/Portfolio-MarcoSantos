// Gallery navigation shares ScrollTrigger's measured bounds; native scrolling remains in charge.
(() => {
  // Ensure direct/fresh visits always start at Hero (scrollY = 0)
  // while preserving legitimate browser Back/Forward traversal scroll positions.
  const navEntry = performance.getEntriesByType('navigation')[0];
  const isDirectVisit = !navEntry || navEntry.type === 'navigate' || navEntry.type === 'reload';
  if (isDirectVisit && !location.hash) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  } else if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  window.addEventListener('pageshow', e => {
    if (e.persisted && 'scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  });

  window.addEventListener('pagehide', () => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  });

  const worlds = [...document.querySelectorAll('.world')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const landingProgress = [0.0, 0.34, 0.66, 1.0];

  function go(world, behavior = reduced.matches ? 'instant' : 'smooth') {
    const trigger = window.ScrollTrigger?.getById('selected-work');
    const index = worlds.indexOf(world);
    if (trigger && index >= 0) {
      const p = landingProgress[index] !== undefined ? landingProgress[index] : index / (worlds.length - 1);
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * p, behavior });
    } else {
      world.scrollIntoView({ behavior, block: 'start' });
    }
  }

  document.addEventListener('click', event => {
    const a = event.target.closest('a[href^="#"]');
    if (!a || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const world = worlds.find(w => `#${w.id}` === a.getAttribute('href'));
    if (!world) return;
    event.preventDefault();
    history.pushState(null, '', `#${world.id}`);
    go(world);
  });

  document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
    const progress = window.ScrollTrigger?.getById('selected-work')?.progress || 0;
    let closestIndex = 0, minDiff = Infinity;
    landingProgress.forEach((lp, i) => {
      const diff = Math.abs(progress - lp);
      if (diff < minDiff) { minDiff = diff; closestIndex = i; }
    });
    const targetIndex = Math.max(0, Math.min(worlds.length - 1, closestIndex + Number(button.dataset.direction)));
    go(worlds[targetIndex]);
  }));

  document.querySelector('.gallery-track').addEventListener('focusin', event => {
    if (window._isPinRefreshing) return;
    if (!event.target.matches(':focus-visible')) return;
    const world = event.target.closest('.world');
    const trigger = window.ScrollTrigger?.getById('selected-work');
    if (world && trigger) {
      const index = worlds.indexOf(world);
      const current = trigger.progress >= 0.82 ? 3 : trigger.progress >= 0.50 ? 2 : trigger.progress >= 0.20 ? 1 : 0;
      if (index !== current) {
        go(world, 'instant');
      }
    }
  });

  const restore = () => {
    if (!location.hash) return;
    const world = worlds.find(w => `#${w.id}` === location.hash);
    if (world) go(world, 'instant');
  };
  window.addEventListener('hashchange', restore);
  window.addEventListener('load', () => {
    if (location.hash) restore();
  });
})();
