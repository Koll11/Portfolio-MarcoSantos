// Homepage scroll enhancement. No preferences, URL switches or preview dependencies.
(() => {
  if (!window.gsap || !window.ScrollTrigger) return; // Static vertical layout remains usable.
  gsap.registerPlugin(ScrollTrigger);
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.hero-scene');
  const work = document.querySelector('.work');
  const stage = document.querySelector('.gallery-stage');
  const track = document.querySelector('.gallery-track');
  const worlds = [...track.querySelectorAll('.world')];
  const links = [...document.querySelectorAll('.gallery-index a')];
  const buttons = [...document.querySelectorAll('[data-direction]')];
  const output = document.querySelector('.gallery-controls output');
  const header = () => document.querySelector('.site-header').offsetHeight;
  // Pin refresh temporarily reparents content. Preserve keyboard focus across that operation.
  let focusedBeforeRefresh;
  ScrollTrigger.addEventListener('refreshInit', () => { focusedBeforeRefresh = document.activeElement; });
  ScrollTrigger.addEventListener('refresh', () => {
    if (focusedBeforeRefresh?.isConnected && focusedBeforeRefresh !== document.body && document.activeElement === document.body) focusedBeforeRefresh.focus({preventScroll:true});
  });
  const mm = gsap.matchMedia();
  const colors = ['#150e13','#111e2b','#edc7b7','#090f18'];
  mm.add('(min-width:1100px) and (pointer:fine) and (prefers-reduced-motion:no-preference)', () => {
    hero.classList.add('is-scroll-hero');
    work.classList.add('is-horizontal');
    // A full takeover, followed by a short hold before the pin releases.
    const takeover = gsap.timeline({scrollTrigger:{id:'hero-expansion',trigger:scene,
      start:()=>`top ${header()}`,end:()=>`+=${Math.round(innerHeight * 1.4)}`,
      pin:scene,scrub:.35,invalidateOnRefresh:true,anticipatePin:1}});
    takeover.fromTo(hero, {'--hero-progress':0}, {'--hero-progress':1,duration:1,ease:'none'},0)
      .fromTo('.hero-cinema',{left:'8vw',right:'8vw',top:'28%',bottom:'6%'},
        {left:0,right:0,top:0,bottom:0,duration:1,ease:'power1.inOut'},0)
      .fromTo('.hero h1, .hero-kicker, .hero-statement',{opacity:1,y:0},
        {opacity:0,y:-85,duration:.65,ease:'power1.in'},0)
      .fromTo('.hero-cinema img',{scale:1},{scale:1.12,duration:1,ease:'none'},0)
      .to({}, {duration:.18});
    const distance = () => track.scrollWidth - stage.clientWidth;
    const journey = gsap.to(track, {
      x:()=>-distance(),ease:'none',
      scrollTrigger:{id:'selected-work',trigger:stage,start:()=>`top ${header()}`,end:()=>`+=${distance()}`,pin:stage,scrub:.35,invalidateOnRefresh:true,anticipatePin:1,
        onUpdate(self) {
          const position=self.progress*(worlds.length-1), current=Math.round(position);
          const from=Math.min(worlds.length-2,Math.floor(position));
          stage.style.backgroundColor=gsap.utils.interpolate(colors[from],colors[from+1],position-from);
          links.forEach((a,i)=>i===current?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'));
          output.value=`${String(current+1).padStart(2,'0')} / 04`;
          buttons[0].disabled=current===0; buttons[1].disabled=current===worlds.length-1;
        }
      }
    });
    worlds.forEach(world => {
      gsap.from(world.querySelector('h3'), {y:42,opacity:0,duration:.65,ease:'power2.out',
        scrollTrigger:{trigger:world,containerAnimation:journey,start:'left 78%',toggleActions:'play none none reverse'}});
      gsap.from(world.querySelector('.world-top'), {y:16,opacity:0,duration:.5,delay:.12,
        scrollTrigger:{trigger:world,containerAnimation:journey,start:'left 78%',toggleActions:'play none none reverse'}});
    });
    return () => {
      hero.classList.remove('is-scroll-hero'); work.classList.remove('is-horizontal');
      stage.style.backgroundColor=''; links.forEach(a=>a.removeAttribute('aria-current'));
    };
  });
  mm.add('(prefers-reduced-motion:no-preference)', () => {
    document.querySelectorAll('.work-intro > *, .p2-section-heading, .phase-two h2, .p2-portrait, .p2-bio, .p2-skills-intro, .p2-skill-row').forEach(element => {
      gsap.from(element,{y:28,opacity:0,duration:.75,ease:'power2.out',
        scrollTrigger:{trigger:element,start:'top 92%',toggleActions:'play none none none'}});
    });
  });
  // Coalesce late font/media changes; GSAP owns resize/pin measurement and cleanup.
  let refreshTimer;
  const refresh=()=>{clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),100);};
  window.addEventListener('load',refresh);
  window.addEventListener('pageshow',refresh);
  document.fonts.ready.then(refresh);
  document.fonts.addEventListener('loadingdone',refresh);
  document.querySelectorAll('img,video').forEach(media=>{
    media.addEventListener('load',refresh);media.addEventListener('loadedmetadata',refresh);
  });
})();
