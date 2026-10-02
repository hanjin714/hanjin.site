/* Analytic spatial showcase. No player, keyword carousel or progress UI. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.getElementById('motion-toggle');
  const scenes=[...document.querySelectorAll('.orbit-panel')];
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),3);
  let paused=reduced.matches,time=0,last=null,raf=null;
  function renderFrame(t){
    const sample=Math.max(0,Number(t)||0);
    scenes.forEach((scene,i)=>{
      const a=i*Math.PI/2+sample*Math.PI/24;
      const depth=Math.sin(a),x=Math.cos(a)*195,y=depth*108,z=depth*100;
      scene.style.opacity=String(.48+(depth+1)*.26);
      scene.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+(-Math.cos(a)*12)+'deg) rotateZ('+(-Math.cos(a)*4)+'deg) scale('+( .83+(depth+1)*.09)+')';
      scene.style.zIndex=String(Math.round((depth+1)*10)+2);
      scene.setAttribute('aria-hidden','false');
    });
  }
  function controls(){toggle.textContent=paused?'开启动效':'暂停动效';toggle.setAttribute('aria-pressed',String(paused));}
  function tick(stamp){raf=null;if(paused||document.hidden){last=null;return;}if(last!==null)time+=(stamp-last)/1000;last=stamp;renderFrame(time);raf=requestAnimationFrame(tick);}
  function play(value){paused=value;last=null;if(raf!==null)cancelAnimationFrame(raf);raf=null;controls();renderFrame(time);if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);}
  toggle.addEventListener('click',()=>play(!paused));
  reduced.addEventListener('change',()=>play(reduced.matches));
  document.addEventListener('visibilitychange',()=>{last=null;if(document.hidden){if(raf!==null)cancelAnimationFrame(raf);raf=null;}else if(!paused&&raf===null)raf=requestAnimationFrame(tick);});
  document.querySelectorAll('.gallery-controls button').forEach(button=>button.addEventListener('click',()=>{
    const image=document.getElementById('speaking-image');image.src='./assets/speaking/'+button.dataset.image;image.alt=button.dataset.caption;
    document.getElementById('speaking-caption').textContent=button.dataset.caption;
    document.querySelectorAll('.gallery-controls button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  }));
  document.getElementById('print-resume').addEventListener('click',()=>window.print());
  window.DURATION=48;window.renderFrame=t=>{play(true);time=Math.max(0,Number(t)||0);renderFrame(time);};window.resumeFilm=()=>play(false);
  const params=new URLSearchParams(location.search);controls();renderFrame(time);if(params.has('t'))window.renderFrame(params.get('t'));else if(!paused)raf=requestAnimationFrame(tick);
})();
