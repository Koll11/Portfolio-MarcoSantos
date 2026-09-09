(() => {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mediaContainers = [...document.querySelectorAll('.media')];
  const items = [];

  mediaContainers.forEach(container => {
    const video = container.querySelector('video');
    const button = container.querySelector('.preview-toggle');
    if (!video || !button) return;

    button.dataset.initialText = button.textContent.trim();
    items.push({ container, video, button });

    function updateLabel() {
      button.textContent = video.paused ? button.dataset.initialText : 'Pause preview Ⅱ';
      button.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'} ${video.getAttribute('aria-label') || 'preview'}`);
      button.setAttribute('aria-pressed', String(!video.paused));
    }

    // Interactive play toggle
    button.addEventListener('click', async () => {
      if (!video.paused) {
        video.pause();
        return;
      }
      // Pause all other media videos
      items.forEach(other => {
        if (other.video !== video && !other.video.paused) {
          other.video.pause();
        }
      });
      if (!video.getAttribute('src') && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
      try {
        await video.play();
      } catch {
        button.textContent = 'Retry preview ↗';
      }
    });

    video.addEventListener('play', updateLabel);
    video.addEventListener('pause', updateLabel);
    video.addEventListener('error', () => {
      button.textContent = 'Preview unavailable';
      button.disabled = true;
    });
  });

  // Pause videos when not in view, on reduced motion, or when leaving page
  const pauseAll = () => items.forEach(({ video }) => { if (!video.paused) video.pause(); });
  reduced.addEventListener('change', pauseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
  window.addEventListener('pagehide', pauseAll);
})();

