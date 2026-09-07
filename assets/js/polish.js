// A navigation cue only; never intercepts a link or controls scrolling.
(() => {
  const nav=[...document.querySelectorAll('.site-nav a[href^="#"]')];
  if(!nav.length)return;
  const sections=nav.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function update(){
    const active=sections.filter(s=>s.getBoundingClientRect().top<innerHeight*.45).at(-1);
    nav.forEach(a=>active&&a.hash===`#${active.id}`?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
  }
  let queued=false;
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;update();});}},{passive:true});
  addEventListener('pageshow',update);update();
})();
