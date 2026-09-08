// Gallery navigation shares ScrollTrigger's measured bounds; native scrolling remains in charge.
(() => {
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
    const world = event.target.closest('.world');
    if (world && window.ScrollTrigger?.getById('selected-work')) go(world, 'instant');
  });

  const restore = () => { const world = worlds.find(w => `#${w.id}` === location.hash); if (world) go(world, 'instant'); };
  window.addEventListener('hashchange', restore);
  window.addEventListener('load', () => { window.ScrollTrigger?.refresh(); restore(); });
})();
