// Shared case-study playback; independent of homepage scroll enhancement.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');

  // 1. Interactive clips with explicit play button
  const clips = [...document.querySelectorAll('video[data-clip]')];
  clips.forEach(video => {
    const button = video.parentElement.querySelector('.case-play');
    if (!button) return;
    video.controls = false;
    video.setAttribute('aria-hidden', 'true');
    button.hidden = false;
    button.addEventListener('click', async () => {
      clips.forEach(other => { if (other !== video) other.pause(); });
      if (!video.getAttribute('src')) video.src = video.dataset.clip;
      video.controls = true;
      try {
        await video.play();
        button.hidden = true;
        video.removeAttribute('aria-hidden');
        video.tabIndex = 0;
        video.focus();
      } catch {
        button.textContent = 'Retry playback ↗';
      }
    });
    video.tabIndex = -1;
  });

  // 2. Passive gameplay loop videos (muted, loop, playsinline)
  const loops = [...document.querySelectorAll('video.case-loop-video')];
  const loopObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting && !reduced.matches && !document.hidden) {
        if (!video.getAttribute('src') && video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '120px', threshold: 0.1 });
  loops.forEach(v => loopObserver.observe(v));

  // Intersection observer for interactive clips (pause when offscreen)
  const interactiveObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) entry.target.pause();
    });
  });
  clips.forEach(video => interactiveObserver.observe(video));

  // Pause all on reduced motion change or tab visibility change
  const pauseAll = () => {
    clips.forEach(v => v.pause());
    loops.forEach(v => v.pause());
  };
  reduced.addEventListener('change', () => {
    pauseAll();
    if (!reduced.matches) {
      loops.forEach(v => {
        const rect = v.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        }
      });
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAll();
    else if (!reduced.matches) {
      loops.forEach(v => {
        const rect = v.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          v.play().catch(() => {});
        }
      });
    }
  });
})();
