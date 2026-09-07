(() => {
  const lightbox = document.querySelector('.video-lightbox');
  if (!lightbox) return;
  const close = lightbox.querySelector('.lightbox-close');
  let opener;
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label','Gameplay viewer');
  lightbox.setAttribute('aria-hidden','true');
  lightbox.inert = true;
  document.querySelectorAll('.project-video').forEach((media,index) => {
    media.tabIndex = 0;
    media.setAttribute('role','button');
    media.setAttribute('aria-label', `Open gameplay clip ${index + 1}`);
    media.setAttribute('aria-haspopup','dialog');
    media.addEventListener('click', () => { opener = media; });
    media.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); media.click(); }
    });
  });
  new MutationObserver(() => {
    const open = lightbox.classList.contains('active');
    lightbox.inert = !open;
    lightbox.setAttribute('aria-hidden', String(!open));
    if (open) close.focus();
    else opener?.focus();
  }).observe(lightbox,{attributes:true,attributeFilter:['class']});
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Escape') close.click();
    if (event.key === 'Tab') {
      const items = [...lightbox.querySelectorAll('button,video[controls],a[href]')].filter(el => el.getClientRects().length);
      const first = items[0],last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
