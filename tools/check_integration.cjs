const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const config of [{name:'fresh desktop',width:1440,height:900},{name:'large desktop',width:1920,height:1080},{name:'1440p display',width:2560,height:1440},{name:'short laptop',width:1366,height:650},{name:'small laptop',width:1280,height:720},{name:'tablet landscape',width:1024,height:768},{name:'tablet',width:820,height:1180},{name:'mobile',width:390,height:844},{name:'reduced',width:1440,height:900,reduced:true},{name:'stale settings',width:1440,height:900,stored:true}]){
 if(process.env.CHECK_FILTER&&!config.name.includes(process.env.CHECK_FILTER))continue;
 const ctx=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.reduced?'reduce':'no-preference'});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const media=[];page.on('request',r=>{if(/\.(mp4|gif)(\?|$)/.test(r.url()))media.push(r.url());});
 if(config.stored)await ctx.addInitScript(()=>{localStorage.setItem('portfolio-gallery-view','reduced');localStorage.setItem('portfolio-hero-motion','reduced');});
 await page.goto('http://localhost:4173/'+(config.stored?'?motion=reduced':''),{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const active=config.width>=1100&&!config.reduced;
 assert.equal(await page.evaluate(()=>!!window.ScrollTrigger?.getById('selected-work')),active,config.name+' gallery default');
 assert.equal(await page.evaluate(()=>!!window.ScrollTrigger?.getById('hero-expansion')),active,config.name+' hero default');
 if(!config.stored)assert.equal(await page.evaluate(()=>localStorage.length),0);
 if(active){
 assert(await page.locator('.world').evaluateAll(ws=>ws.every(w=>{const a=w.querySelector('.text-link').getBoundingClientRect(),b=w.getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom;})),'project links fit pinned stage');
 const initial=await page.locator('.hero-cinema').boundingBox();
 const range=await page.evaluate(()=>{const t=ScrollTrigger.getById('hero-expansion');return{start:t.start,end:t.end}});
 await page.mouse.wheel(0,Math.round((range.end-range.start)*.65));await page.waitForTimeout(300);
 const after=await page.locator('.hero-cinema').boundingBox();assert(after.width>initial.width+20,'media expands');assert(after.height>initial.height+50,'media height expands');
 assert(await page.locator('h1').evaluate(e=>+getComputedStyle(e).opacity)<.5,'title recedes');
 const g=await page.evaluate(()=>{const t=ScrollTrigger.getById('selected-work');return{start:t.start,end:t.end}});
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.start+1);await page.waitForTimeout(150);
 const pinned=(await page.locator('.gallery-stage').boundingBox()).y;
 for(let i=1;i<=3;i++){await page.mouse.wheel(0,(g.end-g.start)/3);await page.waitForTimeout(200);assert.equal(await page.locator('.gallery-controls output').textContent(),`0${i+1} / 04`);if(i<3)assert(Math.abs((await page.locator('.gallery-stage').boundingBox()).y-pinned)<3,'stable pin');}
 const about=(await page.locator('#about').boundingBox()).y;await page.mouse.wheel(0,500);await page.waitForTimeout(200);assert((await page.locator('#about').boundingBox()).y<about-300,'vertical resumes');
 await page.reload({waitUntil:'networkidle'});assert(await page.evaluate(()=>!!ScrollTrigger.getById('selected-work')),'reload');
 }
 assert.deepEqual(media,[],'no video/GIF fetch before play');
 for(const path of ['','nocturne.html','cyber.html','savestate.html','lusiada1.html']){
 if(path)await page.goto('http://localhost:4173/'+path,{waitUntil:'networkidle'});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),config.name+' overflow '+path);
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 assert.equal(await page.locator('h1').count(),1);
 assert(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.preload==='none'&&!v.autoplay&&!v.getAttribute('src'))),'video deferred '+path);
 const bad=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));assert.deepEqual(bad,[]);
 if(config.name==='fresh desktop'||config.name==='mobile')await page.screenshot({path:'.preview/polish-'+config.name.replaceAll(' ','-')+'-'+(path||'home')+'.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS',config.name,'scroll/defaults + all five pages');await ctx.close();
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
