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


/* ADVANCED EXPERIENCE / progressive, lightweight, accessible enhancements */
(function(){
'use strict';
function initialize(){
 const osReduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let savedMotion='on';
 try{savedMotion=localStorage.getItem('fourshore-motion')||'on';}catch(err){}
 const root=document.documentElement;
 const motionBtn=document.createElement('button');
 motionBtn.type='button';
 motionBtn.className='experience-motion-toggle';
 motionBtn.setAttribute('aria-label','Toggle website animations');
 const setMotion=(enabled)=>{
  const on=enabled&&!osReduced;
  root.classList.toggle('motion-paused',!on);
  motionBtn.textContent=osReduced?'MOTION OFF · DEVICE SETTING':on?'✦ MOTION ON':'○ MOTION OFF';
  motionBtn.setAttribute('aria-pressed',String(on));
  motionBtn.setAttribute('aria-label',on?'Turn animations off':'Turn animations on');
  motionBtn.title=osReduced?'Animations disabled by your device preference':'Toggle visual animations';
 };
 motionBtn.disabled=!!osReduced;
 setMotion(savedMotion!=='off');
 if(!osReduced)motionBtn.addEventListener('click',()=>{
  const enable=root.classList.contains('motion-paused');
  try{localStorage.setItem('fourshore-motion',enable?'on':'off');}catch(err){}
  setMotion(enable);
 });
 document.body.appendChild(motionBtn);

 const hero=document.querySelector('.hero');
 if(hero){
  const aurora=document.createElement('div');
  aurora.className='experience-aurora';
  aurora.setAttribute('aria-hidden','true');
  hero.prepend(aurora);
 }

 const services=document.querySelector('[data-experience-services]');
 if(services){
  const tabs=Array.from(services.querySelectorAll('[role="tab"]'));
  const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
  function selectTab(index,focus){
   tabs.forEach((tab,i)=>{
    const selected=i===index;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
    if(panels[i])panels[i].hidden=!selected;
   });
   if(focus)tabs[index].focus();
  }
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>selectTab(index,false));
   tab.addEventListener('keydown',(event)=>{
    let next;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+tabs.length)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();
    selectTab(next,true);
   });
  });
  selectTab(0,false);
 }

 const search=document.getElementById('services-search');
 if(search){
  const counter=document.getElementById('services-count');
  const blocks=Array.from(document.querySelectorAll('section.season'));
  const jobs=Array.from(document.querySelectorAll('article.job'));
  function filter(){
   const q=search.value.trim().toLowerCase();
   let count=0;
   jobs.forEach(job=>{
    const match=!q||job.textContent.toLowerCase().includes(q);
    job.hidden=!match;
    if(match)count++;
   });
   blocks.forEach(block=>{block.hidden=!!q&&!Array.from(block.querySelectorAll('article.job')).some(job=>!job.hidden);});
   if(counter)counter.textContent=count+' '+(count===1?'service':'services')+' found'+(q?' for "'+search.value.slice(0,40)+'"':'');
   if(!q&&counter)counter.textContent=count+' services available';
  }
  search.addEventListener('input',filter);
  filter();
 }

 document.querySelectorAll('form[data-form]').forEach(form=>{
  const required=Array.from(form.querySelectorAll('input[required],select[required],textarea[required]'));
  if(!required.length)return;
  const progress=document.createElement('div');
  progress.className='experience-quote-progress';
  progress.innerHTML='<div class="experience-progress-top"><span>YOUR PROJECT BRIEF</span><span data-quote-progress-label>0 of 5 details completed</span></div><div class="experience-progress-track" role="progressbar" aria-label="Required quote details completed" aria-valuemin="0" aria-valuemax="'+required.length+'" aria-valuenow="0"><div class="experience-progress-fill"></div></div>';
  const intro=form.querySelector('p');
  if(intro)intro.insertAdjacentElement('afterend',progress);
  else form.prepend(progress);
  const label=progress.querySelector('[data-quote-progress-label]');
  const track=progress.querySelector('[role="progressbar"]');
  const fill=progress.querySelector('.experience-progress-fill');
  function update(){
   const done=required.filter(field=>field.value.trim()&&field.checkValidity()).length;
   label.textContent=done+' of '+required.length+' details completed';
   track.setAttribute('aria-valuenow',String(done));
   fill.style.width=(100*done/required.length)+'%';
  }
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  // Service selection from another button may be applied in a separate click handler.
  document.querySelectorAll('a[data-service]').forEach(link=>link.addEventListener('click',()=>requestAnimationFrame(update)));
  update();
 });

 const gallery=document.querySelector('[data-job-gallery]');
 if(gallery){
  const figures=Array.from(gallery.querySelectorAll('figure')).filter(fig=>fig.querySelector('img'));
  if(figures.length){
   const items=figures.map(figure=>{
    const image=figure.querySelector('img');
    const label=figure.querySelector('figcaption');
    return {src:image.getAttribute('src'),alt:image.getAttribute('alt')||'Project photo',caption:label?label.textContent.trim():'Job 1 photo'};
   });
   const dialog=document.createElement('dialog');
   dialog.className='experience-lightbox';
   dialog.setAttribute('aria-label','Job 1 photo viewer');
   dialog.innerHTML='<div class="experience-lightbox-inner"><button class="experience-lightbox-control experience-lightbox-close" type="button" aria-label="Close photo viewer">×</button><img src="" alt=""><div class="experience-lightbox-bottom"><div class="experience-lightbox-nav"><button type="button" class="experience-lightbox-control" data-photo-previous aria-label="Previous photo">‹</button><button type="button" class="experience-lightbox-control" data-photo-next aria-label="Next photo">›</button></div><span class="experience-lightbox-caption" aria-live="polite"></span></div></div>';
   document.body.appendChild(dialog);
   const big=dialog.querySelector('img'),caption=dialog.querySelector('.experience-lightbox-caption');
   let current=0,lastFocus=null;
   const show=(index)=>{
    current=(index+items.length)%items.length;
    big.src=items[current].src;
    big.alt=items[current].alt;
    caption.textContent=(current+1)+' / '+items.length+' · '+items[current].caption;
   };
   const close=()=>{if(dialog.open)dialog.close();};
   figures.forEach((figure,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.setAttribute('aria-label','Open photo '+(index+1)+' of '+items.length+': '+items[index].alt);
    while(figure.firstChild)button.appendChild(figure.firstChild);
    figure.appendChild(button);
    button.addEventListener('click',()=>{
     if(typeof dialog.showModal!=='function'){window.open(items[index].src,'_blank','noopener');return;}
     lastFocus=button;show(index);dialog.showModal();
    });
   });
   dialog.querySelector('.experience-lightbox-close').addEventListener('click',close);
   dialog.querySelector('[data-photo-next]').addEventListener('click',()=>show(current+1));
   dialog.querySelector('[data-photo-previous]').addEventListener('click',()=>show(current-1));
   dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
   dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
    else if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
   });
   dialog.addEventListener('close',()=>{big.removeAttribute('src');if(lastFocus)lastFocus.focus();});
  }
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
