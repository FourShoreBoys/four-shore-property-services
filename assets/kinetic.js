/* FOUR SHORE / KINETIC STUDIO - lightweight progressive enhancements */
(function(){
'use strict';
const start=()=>{
 const root=document.documentElement;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionOff=()=>reduced.matches||root.classList.contains('motion-paused');
 const hero=document.querySelector('.kin-hero');
 const rows=[...document.querySelectorAll('.kin-service-row')];
 const revealTargets=[...document.querySelectorAll('.kin-intro h2,.kin-intro-bottom,.kin-services-header,.kin-service-row,.kin-project-heading,.kin-project-gallery,.kin-crew-layout,.kin-process h2,.kin-process-grid>div,.kin-project-caption,.kin-services-footer')];
 if('IntersectionObserver' in window&&!reduced.matches){
  const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('kin-visible');obs.unobserve(entry.target);}
  }),{rootMargin:'0px 0px -48px 0px',threshold:.08});
  revealTargets.forEach((node,i)=>{
   node.classList.add('kin-fade');
   if(node.classList.contains('kin-service-row')||node.parentElement?.classList.contains('kin-process-grid'))node.style.transitionDelay=Math.min(i%4,3)*.075+'s';
   obs.observe(node);
  });
 }
 if(hero&&!reduced.matches){
  let queued=false,x=0,y=0;
  const move=event=>{
   if(event.pointerType==='touch'||motionOff())return;
   const b=hero.getBoundingClientRect();
   x=((event.clientX-b.left)/b.width*100);
   y=((event.clientY-b.top)/b.height*100);
   if(!queued){
    queued=true;
    requestAnimationFrame(()=>{
     hero.style.setProperty('--kin-pointer-x',x.toFixed(1)+'%');
     hero.style.setProperty('--kin-pointer-y',y.toFixed(1)+'%');
     queued=false;
    });
   }
  };
  hero.addEventListener('pointermove',move,{passive:true});
 }
 // A custom oversized cursor is only used for clickable service rows on desktop.
 if(rows.length&&window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced.matches){
  const cursor=document.createElement('div');
  cursor.className='kin-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<span>OPEN ↗</span>';
  document.body.append(cursor);
  let px=-150,py=-150,tx=-150,ty=-150,active=false,running=false;
  const render=()=>{
   if(!running)return;
   px+=(tx-px)*.19;py+=(ty-py)*.19;
   cursor.style.transform='translate3d('+(px-47).toFixed(1)+'px,'+(py-47).toFixed(1)+'px,0)';
   if(active||Math.abs(tx-px)>.2||Math.abs(ty-py)>.2)requestAnimationFrame(render);else running=false;
  };
  const step=()=>{if(!running){running=true;requestAnimationFrame(render);}};
  rows.forEach(row=>{
   row.addEventListener('pointerenter',event=>{
    if(motionOff())return;
    active=true;tx=event.clientX;ty=event.clientY;
    cursor.classList.add('active');step();
   });
   row.addEventListener('pointermove',event=>{
    if(motionOff())return;
    tx=event.clientX;ty=event.clientY;step();
   },{passive:true});
   row.addEventListener('pointerleave',()=>{active=false;cursor.classList.remove('active');step()});
   row.addEventListener('focusin',()=>cursor.classList.remove('active'));
  });
  const watch= new MutationObserver(()=>{
   if(motionOff()){cursor.classList.remove('active');active=false;running=false;}
  });
  watch.observe(root,{attributes:true,attributeFilter:['class']});
 }
 // Pause looping decorative effects when the tab is hidden; it saves battery.
 const visibility=()=>root.classList.toggle('kin-background-paused',document.hidden);
 document.addEventListener('visibilitychange',visibility);
 visibility();
 // Gently close mobile navigation after selecting a route on any page.
 const nav=document.getElementById('site-navigation'),button=document.querySelector('.menu');
 if(nav&&button)nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  if(nav.classList.contains('open')){
   nav.classList.remove('open');
   button.setAttribute('aria-expanded','false');
   button.textContent='☰';
  }
 }));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
