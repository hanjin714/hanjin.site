/* A deterministic, one-pass narrative. No progress UI or particle loop. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.getElementById('motion-toggle');
  const scenes=[...document.querySelectorAll('.film-scene')];
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),3);
  let paused=reduced.matches,time=reduced.matches?23:0,last=null,raf=null;
  function renderFrame(t){
    const sample=Math.max(0,Math.min(24,Number(t)||0));
    scenes.forEach((scene,i)=>{
      const u=sample-i*6,entry=ease(u/.9),exit=i===3?1:1-ease(u-5);
      scene.style.opacity=String(u<0||u>6?0:entry*exit);
      scene.style.transform='translateY('+((1-entry)*35-(1-exit)*25)+'px) scale('+(1.035-entry*.035)+')';
      scene.setAttribute('aria-hidden',String(u<0||u>=6&&i!==3));
      [...scene.querySelectorAll('.scene-items b')].forEach((item,j)=>{
        const k=ease((u-.5-j*.28)/.8);item.style.opacity=String(k);item.style.transform='translateY('+((1-k)*24)+'px)';
      });
    });
  }
  function controls(){toggle.textContent=paused?'开启动效':'暂停动效';toggle.setAttribute('aria-pressed',String(paused));}
  function tick(stamp){raf=null;if(paused||document.hidden){last=null;return;}if(last!==null)time=Math.min(24,time+(stamp-last)/1000);last=stamp;renderFrame(time);if(time<24)raf=requestAnimationFrame(tick);else{paused=true;controls();}}
  function play(value){paused=value;last=null;if(raf!==null)cancelAnimationFrame(raf);raf=null;if(!paused&&time>=24)time=0;controls();renderFrame(time);if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);}
  toggle.addEventListener('click',()=>play(!paused));
  reduced.addEventListener('change',()=>{if(reduced.matches)time=23;play(reduced.matches);});
  document.addEventListener('visibilitychange',()=>{last=null;if(document.hidden){if(raf!==null)cancelAnimationFrame(raf);raf=null;}else if(!paused&&time<24&&raf===null)raf=requestAnimationFrame(tick);});
  document.querySelectorAll('.gallery-controls button').forEach(button=>button.addEventListener('click',()=>{
    const image=document.getElementById('speaking-image');image.src='./assets/speaking/'+button.dataset.image;image.alt=button.dataset.caption;
    document.getElementById('speaking-caption').textContent=button.dataset.caption;
    document.querySelectorAll('.gallery-controls button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  }));
  document.getElementById('print-resume').addEventListener('click',()=>window.print());
  window.DURATION=24;window.renderFrame=t=>{play(true);time=Math.max(0,Math.min(24,Number(t)||0));renderFrame(time);};window.resumeFilm=()=>play(false);
  const params=new URLSearchParams(location.search);controls();renderFrame(time);if(params.has('t'))window.renderFrame(params.get('t'));else if(!paused)raf=requestAnimationFrame(tick);
})();
