document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.menu'),n=document.querySelector('.nav');if(b&&n)b.addEventListener('click',function(){var open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open));b.textContent=open?'×':'☰';});document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear();});var form=document.querySelector('[data-form]');if(!form)return;var select=form.querySelector('[name=service]'),s=new URLSearchParams(location.search).get('service');if(s&&Array.from(select.options).some(function(x){return x.value===s;}))select.value=s;document.querySelectorAll('[data-service]').forEach(function(a){a.addEventListener('click',function(){select.value=a.getAttribute('data-service');});});form.addEventListener('submit',function(e){e.preventDefault();if(!form.reportValidity())return;var d=new FormData(form);var txt=['Name: '+d.get('name'),'Phone: '+d.get('phone'),'Email: '+(d.get('email')||'Not provided'),'Service: '+d.get('service'),'Location: '+d.get('location'),'Timing: '+(d.get('timing')||'Flexible'),'','Details: ',d.get('details')].join('\n');form.querySelector('.form-msg').textContent='Your email app should open. Review the message and press Send to submit the quote request.';window.location.href='mailto:four.shore21@gmail.com?subject='+encodeURIComponent('Four Shore free quote: '+d.get('service'))+'&body='+encodeURIComponent(txt);});});

/* FOUR SHORE / MOTION CONCEPT — PREVIEW ONLY */
(function(){
'use strict';
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const pageReady=()=> {
 if(reduce.matches)return;
 const bar=document.createElement('div');bar.className='motion-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
 let ticking=false;
 function progress(){const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?Math.min(1,Math.max(0,scrollY/max)):0)+')';ticking=false;}
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress)}},{passive:true});progress();
 const revealSelectors=['.section .heading','.section .eyebrow','.section h2','.section .card','.section .step','.section .person','.season','.job','.gallery figure','.quote-intro','.form','.faq details','.page-hero .wrap','.hero .wrap'];
 const nodes=new Set();
 revealSelectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>nodes.add(el)));
 if('IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{rootMargin:'0px 0px -35px 0px',threshold:.07});
 nodes.forEach((el,i)=>{el.classList.add('motion-reveal');if(el.matches('.card,.person,.step,.gallery figure'))el.setAttribute('data-motion-delay',String(i%4));io.observe(el)});
 }else{nodes.forEach(el=>el.classList.add('is-visible'));}
 const hero=document.querySelector('.hero');
 if(hero){
  const orbit=document.createElement('span');orbit.className='motion-orbit';orbit.setAttribute('aria-hidden','true');hero.appendChild(orbit);
  const scroll=document.createElement('span');scroll.className='motion-scroll';scroll.setAttribute('aria-hidden','true');scroll.textContent='SCROLL TO EXPLORE';hero.appendChild(scroll);
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=hero.getBoundingClientRect();hero.style.setProperty('--spot-x',((e.clientX-rect.left)/rect.width*100).toFixed(1)+'%');hero.style.setProperty('--spot-y',((e.clientY-rect.top)/rect.height*100).toFixed(1)+'%');},{passive:true});
 }
 if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.querySelectorAll('.card').forEach(card=>{
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*5).toFixed(2)+'deg) translateY(-5px)'},{passive:true});
   card.addEventListener('pointerleave',()=>{card.style.transform=''});
  });
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pageReady);else pageReady();
})();
