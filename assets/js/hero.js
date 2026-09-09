(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scene = hero.querySelector('.hero-scene');
  const video = hero.querySelector('.hero-video');
  const pause = hero.querySelector('.cinema-pause');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');

  if (!video) return;

  let userPaused = false;
  let isVisible = true;

  function updatePauseButton() {
    if (!pause) return;
    if (reduced.matches) {
      pause.hidden = true;
      return;
    }
    pause.hidden = false;
    const isPaused = video.paused || userPaused;
    pause.textContent = isPaused ? 'Resume showreel' : 'Pause showreel';
    pause.setAttribute('aria-label', isPaused ? 'Resume showreel' : 'Pause showreel');
  }

  function tryPlay() {
    if (reduced.matches || userPaused || !isVisible || document.hidden) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.classList.add('is-playing');
          updatePauseButton();
        })
        .catch(() => {
          // Autoplay was prevented or interrupted
        });
    }
  }

  function pausePlayback() {
    if (!video.paused) {
      video.pause();
    }
    updatePauseButton();
  }

  // Fade video in once frames are genuinely rendering
  video.addEventListener('playing', () => {
    video.classList.add('is-playing');
    updatePauseButton();
  });

  video.addEventListener('pause', () => {
    updatePauseButton();
  });

  if (pause) {
    pause.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        tryPlay();
      } else {
        userPaused = true;
        pausePlayback();
      }
    });
  }

  // IntersectionObserver: pause playback when scrolled away from Hero to save resources
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      if (!userPaused) tryPlay();
    } else {
      pausePlayback();
    }
  }, { threshold: 0.05 });

  if (scene) {
    observer.observe(scene);
  } else {
    observer.observe(hero);
  }

  // Document visibility handling (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pausePlayback();
    } else if (isVisible && !userPaused) {
      tryPlay();
    }
  });

  // Page lifecycle handling (pagehide & bfcache pageshow)
  window.addEventListener('pagehide', () => {
    pausePlayback();
  });

  window.addEventListener('pageshow', () => {
    if (isVisible && !userPaused && !reduced.matches) {
      tryPlay();
    }
  });

  // Reduced motion preference changes
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      pausePlayback();
      video.classList.remove('is-playing');
    } else if (isVisible && !userPaused) {
      tryPlay();
    }
    updatePauseButton();
  });

  // Initial attempt
  if (!reduced.matches) {
    tryPlay();
  } else {
    if (pause) pause.hidden = true;
  }
})();
