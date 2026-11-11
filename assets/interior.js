/* Four Shore / unified interior interactions. No libraries required. */
(()=>{'use strict';
const init=()=>{
 const site=document.querySelector('.interior-site');
 if(!site)return;
 const root=document.documentElement;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 const animated=()=>!reduce.matches&&!root.classList.contains('motion-paused');
 const hero=document.querySelector('.interior-hero');
 if(hero&&fine){
  const arc=hero.querySelector('.interior-hero-arc');
  let lastX=.76,lastY=.42,queued=false;
  const apply=()=>{
   queued=false;
   hero.style.setProperty('--interior-x',(lastX*100).toFixed(1)+'%');
   hero.style.setProperty('--interior-y',(lastY*100).toFixed(1)+'%');
   if(arc&&animated()){
    arc.style.setProperty('--interior-arc-x',((lastX-.5)*-20).toFixed(1)+'px');
    arc.style.setProperty('--interior-arc-y',((lastY-.5)*-17).toFixed(1)+'px');
   }
  };
  hero.addEventListener('pointermove',event=>{
   if(!animated())return;
   const box=hero.getBoundingClientRect();
   if(!box.width||!box.height)return;
   lastX=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width));
   lastY=Math.max(0,Math.min(1,(event.clientY-box.top)/box.height));
   if(!queued){queued=true;requestAnimationFrame(apply);}
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
   if(arc){arc.style.setProperty('--interior-arc-x','0px');arc.style.setProperty('--interior-arc-y','0px');}
   hero.style.setProperty('--interior-x','75%');
   hero.style.setProperty('--interior-y','42%');
  });
 }
 // Keep seasonal chips highlighted as visitors move through the four sections.
 const nav=document.querySelector('.pill-nav');
 if(nav){
  const links=[...nav.querySelectorAll('a[href^="#"]')];
  const seasons=links.map(link=>document.querySelector(link.getAttribute('href')));
  let queued=false;
  const active=()=>{
   queued=false;
   let found=-1;
   seasons.forEach((season,i)=>{
    if(season&&season.getBoundingClientRect().top<=innerHeight*.42)found=i;
   });
   links.forEach((link,i)=>{
    if(i===found)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
   });
  };
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(active);}},{passive:true});
  addEventListener('resize',active,{passive:true});
  active();
 }
 // Dynamic, subtle lighting in crew cards. Never hides content or overrides clicks.
 if(fine){
  document.querySelectorAll('.team .person').forEach(card=>{
   let ticking=false,x=50,y=20;
   card.addEventListener('pointermove',event=>{
    if(!animated())return;
    const b=card.getBoundingClientRect();
    x=(event.clientX-b.left)/Math.max(b.width,1)*100;
    y=(event.clientY-b.top)/Math.max(b.height,1)*100;
    if(!ticking){ticking=true;requestAnimationFrame(()=>{
     card.style.setProperty('--crew-x',x.toFixed(1)+'%');
     card.style.setProperty('--crew-y',y.toFixed(1)+'%');
     ticking=false;
    });}
   },{passive:true});
   card.addEventListener('pointerleave',()=>{
    card.style.setProperty('--crew-x','70%');
    card.style.setProperty('--crew-y','10%');
   });
  });
 }
 // Link hover effects are decorative; controls keep native keyboard behavior.
 const photos=document.querySelectorAll('.interior-site .section .photo img');
 if(photos.length&&fine&&!reduce.matches){
  photos.forEach(img=>{
   const container=img.closest('.photo');
   if(!container)return;
   container.addEventListener('pointermove',event=>{
    if(!animated())return;
    const b=container.getBoundingClientRect();
    const dx=((event.clientX-b.left)/b.width-.5)*5;
    const dy=((event.clientY-b.top)/b.height-.5)*5;
    container.style.setProperty('--photo-x',dx.toFixed(1)+'px');
    container.style.setProperty('--photo-y',dy.toFixed(1)+'px');
   },{passive:true});
   container.addEventListener('pointerleave',()=>{
    container.style.setProperty('--photo-x','0px');
    container.style.setProperty('--photo-y','0px');
   });
  });
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();