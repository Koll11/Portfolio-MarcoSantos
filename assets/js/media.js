(() => {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const media = [...document.querySelectorAll('video[data-src]')];
  function loadPoster(video) { if (!video.poster) video.poster = video.dataset.poster; }
  function label(video) {
    const button = video.parentElement.querySelector('.preview-toggle');
    button.textContent = video.paused ? 'Play preview ↗' : 'Pause preview Ⅱ';
    button.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'} ${video.getAttribute('aria-label')} preview`);
    button.setAttribute('aria-pressed', String(!video.paused));
  }
  // Posters load near the viewport. Video downloads require an explicit play action.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target: video,isIntersecting}) => {
      if (isIntersecting) loadPoster(video);
      else video.pause();
    });
  }, { rootMargin: '150px', threshold: 0 });
  media.forEach(video => {
    observer.observe(video);
    const button = video.parentElement.querySelector('.preview-toggle');
    button.addEventListener('click', async () => {
      loadPoster(video);
      if (!video.paused) { video.pause(); return; }
      media.forEach(other => { if (other !== video) other.pause(); });
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      try { await video.play(); }
      catch { button.textContent = 'Retry preview ↗'; }
    });
    video.addEventListener('play', () => label(video));
    video.addEventListener('pause', () => {
      if (video.dataset.restorePoster && video.getAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
      label(video);
    });
    video.addEventListener('error', () => { button.textContent = 'Preview unavailable'; button.disabled = true; });
  });
  const pauseAll = () => media.forEach(video => video.pause());
  reduced.addEventListener('change', pauseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
})();
