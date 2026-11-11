/* FOUR SHORE / ULTRA VISUAL ENGINE
   Built as progressive enhancement; all site content works without this file. */
(()=>{'use strict';
const ready=()=>{
 const html=document.documentElement;
 const root=document.querySelector('.ultra-site');
 if(!root)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const canAnimate=()=>!reduced.matches&&!html.classList.contains('motion-paused');
 const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 const hero=document.querySelector('.kin-hero');
 const field=document.querySelector('canvas.ultra-field');
 const holo=document.querySelector('.ultra-holo');
 const safe=(v,min,max)=>Math.min(max,Math.max(min,v));
 const seasonWrap=document.querySelector('[data-ultra-seasons]');
 // Real, keyboard-accessible seasonal tabs. Existing services remain linked.
 if(seasonWrap){
  const buttons=[...seasonWrap.querySelectorAll('[data-ultra-tab]')];
  const panels=buttons.map(btn=>document.getElementById(btn.getAttribute('aria-controls')));
  const activate=(idx,focus=false)=>{
   buttons.forEach((button,i)=>{
    const chosen=i===idx;
    button.setAttribute('aria-selected',String(chosen));
    button.tabIndex=chosen?0:-1;
    if(panels[i])panels[i].hidden=!chosen;
   });
   if(focus)buttons[idx]?.focus();
  };
  buttons.forEach((button,i)=>{
   button.addEventListener('click',()=>activate(i));
   button.addEventListener('keydown',event=>{
    let next;
    switch(event.key){
     case 'ArrowRight':case 'ArrowDown':next=(i+1)%buttons.length;break;
     case 'ArrowLeft':case 'ArrowUp':next=(i-1+buttons.length)%buttons.length;break;
     case 'Home':next=0;break;
     case 'End':next=buttons.length-1;break;
     default:return;
    }
    event.preventDefault();activate(next,true);
   });
  });
  activate(0);
 }
 // 2D depth-field: animated perspective grid + scattered particles, tuned for battery.
 if(hero&&field&&field.getContext){
  const ctx=field.getContext('2d',{alpha:true});
  if(ctx){
   let w=0,h=0,dpr=1,mouseX=.74,mouseY=.4,visible=true,raf=0,last=0,seed=37;
   const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
   const dust=Array.from({length:67},()=>({x:random(),y:random(),r:.4+random()*1.5,a:.18+random()*.44,phase:random()*6.28,speed:.3+random()}));
   const resize=()=>{
    const rect=hero.getBoundingClientRect();
    const nextW=Math.round(rect.width),nextH=Math.round(rect.height);
    if(nextW===w&&nextH===h)return;
    w=nextW;h=nextH;if(!w||!h)return;
    dpr=safe(window.devicePixelRatio||1,1,1.5);
    field.width=Math.round(w*dpr);field.height=Math.round(h*dpr);
    field.style.width=w+'px';field.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    render(performance.now(),true);
   };
   const render=(ms,still=false)=>{
    if(!w||!h)return;
    const t=ms*.001;
    ctx.clearRect(0,0,w,h);
    const vanX=w*(.74+(mouseX-.74)*.032),vanY=h*(.57+(mouseY-.4)*.018);
    const depth=h*.52;
    ctx.save();ctx.globalCompositeOperation='screen';
    // Exponentially spaced rows create a three-dimensional horizon.
    for(let row=1;row<=19;row++){
     const p=row/19;const dep=p*p;
     const y=vanY+dep*depth;
     const leftX=vanX+(0-vanX)*dep;
     const rightX=vanX+(w-vanX)*dep;
     const opacity=(.025+dep*.28).toFixed(3);
     ctx.strokeStyle='rgba(100,232,249,'+opacity+')';
     ctx.lineWidth=row===19?1.4:.7;
     ctx.beginPath();ctx.moveTo(leftX,y);ctx.lineTo(rightX,y);ctx.stroke();
    }
    for(let i=-22;i<=22;i++){
     const endX=vanX+i*w*.075;
     if(endX < -w*.1||endX>w*1.1)continue;
     const phase=(i%5===0)?'.22':'.11';
     ctx.strokeStyle='rgba(112,236,249,'+phase+')';ctx.lineWidth=i%5===0?1.1:.7;
     ctx.beginPath();ctx.moveTo(vanX,vanY);ctx.lineTo(endX,h*1.06);ctx.stroke();
    }
    // Vertical light pylons give depth and react slightly to the pointer.
    for(let i=0;i<10;i++){
     const x=w*(.47+i*.065),baseY=h*(.62+(i%3)*.065);
     const height=h*(.1+((i*7)%9)*.009);
     ctx.strokeStyle='rgba(128,247,242,'+(i%3===0?.16:.065)+')';
     ctx.beginPath();ctx.moveTo(x,baseY);ctx.lineTo(x,baseY-height);ctx.stroke();
     if(i%3===0){ctx.fillStyle='rgba(214,255,93,.45)';ctx.fillRect(x-1,baseY-height-1,2,2);}
    }
    dust.forEach((particle,i)=>{
     const twinkle=still?1:.65+.35*Math.sin(t*particle.speed+particle.phase);
     const x=particle.x*w,y=particle.y*h;
     const alpha=safe(particle.a*twinkle,0,1).toFixed(3);
     ctx.fillStyle=i%7===0?'rgba(213,255,80,'+alpha+')':'rgba(153,241,255,'+alpha+')';
     ctx.beginPath();ctx.arc(x,y,particle.r,0,Math.PI*2);ctx.fill();
    });
    // Cursor-responsive, soft energy arcs behind the real photograph.
    const px=w*(.75+(mouseX-.74)*.05),py=h*(.36+(mouseY-.4)*.08);
    for(let i=0;i<3;i++){
     ctx.strokeStyle='rgba('+(i===1?'212,255,83':'89,217,255')+','+(.08-i*.018)+')';
     ctx.lineWidth=i===1?1.5:1;
     const radius=Math.min(w,h)*(.21+i*.07);
     ctx.beginPath();ctx.ellipse(px,py,radius,radius*.74,-.25,t*(i%2===0?.032:-.025)+i*.5,t*(i%2===0?.032:-.025)+i*.5+Math.PI*.77);ctx.stroke();
    }
    ctx.restore();
   };
   const frame=ms=>{
    raf=0;if(!visible||document.hidden||!canAnimate())return;
    if(ms-last>=32){last=ms;render(ms);}
    raf=requestAnimationFrame(frame);
   };
   const start=()=>{if(raf||!visible||document.hidden||!canAnimate())return;resize();raf=requestAnimationFrame(frame);};
   const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;};
   const refresh=()=>{if(canAnimate()&&visible&&!document.hidden)start();else{stop();render(performance.now(),true);}};
   if('ResizeObserver' in window){const observer=new ResizeObserver(resize);observer.observe(hero);}
   else addEventListener('resize',resize,{passive:true});
   if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;refresh();},{threshold:0});observer.observe(hero);}
   document.addEventListener('visibilitychange',refresh);
   const motionWatch=new MutationObserver(refresh);motionWatch.observe(html,{attributes:true,attributeFilter:['class']});
   if(finePointer){
    let pointerQueued=false;
    hero.addEventListener('pointermove',event=>{
     const b=hero.getBoundingClientRect();
     mouseX=safe((event.clientX-b.left)/Math.max(b.width,1),0,1);
     mouseY=safe((event.clientY-b.top)/Math.max(b.height,1),0,1);
     if(holo&&canAnimate()&&!pointerQueued){
      pointerQueued=true;requestAnimationFrame(()=>{
       const dx=(mouseX-.5)*-20,dy=(mouseY-.5)*-17;
       holo.style.setProperty('--ultra-parallax-x',dx.toFixed(1)+'px');
       holo.style.setProperty('--ultra-parallax-y',dy.toFixed(1)+'px');
       pointerQueued=false;
      });
     }
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{if(holo){holo.style.setProperty('--ultra-parallax-x','0px');holo.style.setProperty('--ultra-parallax-y','0px');}});
   }
   resize();refresh();
  }
 }
 // Real 3D perspective tilt only when fine-pointer motion is allowed.
 if(finePointer){
  const targets=[...document.querySelectorAll('.kin-project-gallery a,.kin-crew-graphic')];
  targets.forEach(element=>{
   let queued=false,rx=0,ry=0;
   element.addEventListener('pointermove',event=>{
    if(!canAnimate())return;
    const r=element.getBoundingClientRect();
    const nx=safe((event.clientX-r.left)/r.width-.5,-.5,.5),ny=safe((event.clientY-r.top)/r.height-.5,-.5,.5);
    rx=-ny*8;ry=nx*8;
    if(!queued){queued=true;requestAnimationFrame(()=>{
     element.style.setProperty('--tilt-x',rx.toFixed(2)+'deg');
     element.style.setProperty('--tilt-y',ry.toFixed(2)+'deg');
     queued=false;
    });}
   },{passive:true});
   const reset=()=>{element.style.setProperty('--tilt-x','0deg');element.style.setProperty('--tilt-y','0deg');};
   element.addEventListener('pointerleave',reset);
   element.addEventListener('blur',reset);
  });
 }
 // Intelligent section rail. All links are real anchors and usable without JS.
 const rail=document.querySelector('.ultra-rail');
 if(rail){
  const anchors=[...rail.querySelectorAll('a[href^="#"]')];
  const sections=anchors.map(a=>document.getElementById(a.hash.slice(1)));
  let scheduled=false;
  const progress=()=>{
   rail.classList.toggle('ultra-rail-visible',scrollY>360);
   const target=innerHeight*.4;
   let idx=0;
   for(let i=0;i<sections.length;i++){
    if(sections[i]&&sections[i].getBoundingClientRect().top<target)idx=i;
   }
   anchors.forEach((a,i)=>{if(i===idx)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
   scheduled=false;
  };
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});
  addEventListener('resize',progress,{passive:true});progress();
 }
 // Deliberate magnetic motion on the main actions without breaking tab/keyboard use.
 if(finePointer){
  document.querySelectorAll('.ultra-site .kin-button,.ultra-site .kin-round-link').forEach(item=>{
   item.addEventListener('pointermove',event=>{
    if(!canAnimate())return;
    const r=item.getBoundingClientRect();
    const x=(event.clientX-r.left)/r.width-.5;
    const y=(event.clientY-r.top)/r.height-.5;
    item.style.translate=(x*8).toFixed(1)+'px '+(y*8).toFixed(1)+'px';
   },{passive:true});
   item.addEventListener('pointerleave',()=>item.style.translate='');
   item.addEventListener('blur',()=>item.style.translate='');
  });
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();