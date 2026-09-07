// Gallery navigation shares ScrollTrigger's measured bounds; native scrolling remains in charge.
(() => {
  const worlds=[...document.querySelectorAll('.world')];
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  function go(world,behavior=reduced.matches?'instant':'smooth') {
    const trigger=window.ScrollTrigger?.getById('selected-work');
    if(trigger) window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*worlds.indexOf(world)/(worlds.length-1),behavior});
    else world.scrollIntoView({behavior,block:'start'});
  }
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href^="#"]');
    if(!a || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const world=worlds.find(w=>`#${w.id}`===a.getAttribute('href'));
    if(!world)return;
    event.preventDefault();history.pushState(null,'',`#${world.id}`);go(world);
  });
  document.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>{
    const progress=window.ScrollTrigger?.getById('selected-work')?.progress||0;
    go(worlds[Math.max(0,Math.min(worlds.length-1,Math.round(progress*(worlds.length-1))+Number(button.dataset.direction)))]);
  }));
  document.querySelector('.gallery-track').addEventListener('focusin',event=>{
    const world=event.target.closest('.world');
    if(world && window.ScrollTrigger?.getById('selected-work'))go(world,'instant');
  });
  const restore=()=>{const world=worlds.find(w=>`#${w.id}`===location.hash);if(world)go(world,'instant');};
  window.addEventListener('hashchange',restore);
  window.addEventListener('load',()=>{window.ScrollTrigger?.refresh();restore();});
})();
