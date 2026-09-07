(() => {
  const hero = document.querySelector('.hero');
  const scene = hero.querySelector('.hero-scene');
  const frames = [...hero.querySelectorAll('.hero-frame')];
  const controls = hero.querySelector('.cinema-controls');
  const buttons = [...hero.querySelectorAll('.cinema-index button')];
  const pause = hero.querySelector('.cinema-pause');
  const names = ['Nocturne Battlegrounds', 'Cyber Engineer', 'Save State', 'LusÃ­ada-1'];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const desktop = matchMedia('(min-width:1100px) and (pointer:fine)');
  const motionEnabled = () => desktop.matches && !reduced.matches;
  let index = 0, stopped = !motionEnabled(), visible = true, timer, pending = false;
  controls.hidden = false;
  function show(next) {
    index = next;
    frames.forEach((frame,i) => {
      frame.classList.toggle('is-current',i === index);
      frame.setAttribute('aria-hidden',String(i !== index));
      buttons[i].setAttribute('aria-pressed',String(i === index));
    });
    hero.querySelector('#hero-frame-name').textContent = names[index];
  }
  function schedule() {
    clearTimeout(timer);
    pause.hidden = reduced.matches;
    pause.textContent = stopped ? 'Resume sequence' : 'Pause sequence';
    pause.setAttribute('aria-label',pause.textContent);
    if (!stopped && visible && !document.hidden) timer = setTimeout(() => { show((index + 1) % frames.length); schedule(); }, 5500);
  }
  buttons.forEach((button,i) => button.addEventListener('click', () => { stopped = true; show(i); schedule(); }));
  pause.addEventListener('click', () => {
    stopped = !stopped;
    schedule();
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold:.05}).observe(scene);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change', () => { stopped = true; schedule(); });
  desktop.addEventListener('change', () => { if (!desktop.matches) stopped = true; schedule(); });
  schedule();
})();
