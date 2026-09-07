// Case-study playback only. Independent of the homepage's deferred scroll work.
(() => {
  const clips = [...document.querySelectorAll('video[data-clip]')];
  clips.forEach(video => {
    const button = video.parentElement.querySelector('.case-play');
    video.controls = false;
    button.hidden = false;
    button.addEventListener('click', async () => {
      clips.forEach(other => { if(other !== video) other.pause(); });
      if(!video.getAttribute('src')) video.src = video.dataset.clip;
      video.controls = true;
      try { await video.play(); button.hidden = true; video.focus(); }
      catch { button.textContent = 'Retry playback ↗'; }
    });
    video.tabIndex = 0;
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(!entry.isIntersecting) entry.target.pause();
  }));
  clips.forEach(video => observer.observe(video));
  document.addEventListener('visibilitychange', () => { if(document.hidden) clips.forEach(video => video.pause()); });
})();
