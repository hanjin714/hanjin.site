/* Deterministic renderFrame(t), plus an independent live browser playback driver.
 * This native webpage borrows the reference's code-video techniques; it is not an MP4.
 */
(() => {
  'use strict';
  const canvas=document.getElementById('field'),ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const chapters=[...document.querySelectorAll('.chapter')];
  const headings=chapters.map(el=>el.querySelector('h2')).filter(Boolean);
  const toggle=document.getElementById('motion-toggle'),play=document.getElementById('film-play');
  const slider=document.getElementById('film-time'),clock=document.getElementById('film-clock');
  const kicker=document.getElementById('film-kicker'),title=document.getElementById('film-title'),copy=document.getElementById('film-copy');
  const word=document.querySelector('.orbit-word'),traces=[...document.querySelectorAll('.trace')],nodes=[...document.querySelectorAll('.orbit-node')];
  const phases=[
    {kicker:'01 / UNDERSTAND',title:'先读懂业务。',copy:'从真实需求、使用者和业务约束开始。',word:'FIELD'},
    {kicker:'02 / BUILD',title:'亲自构建关键环节。',copy:'将模型、代码与系统能力组织成执行路径。',word:'BUILD'},
    {kicker:'03 / DELIVER',title:'推进到可验证的结果。',copy:'连接业务方、组员与外部技术伙伴。',word:'SHIP'},
    {kicker:'04 / ITERATE',title:'让交付继续生长。',copy:'完成、验证、迭代，每一阶段都有边界。',word:'GROW'}
  ];
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),3);
  function mulberry32(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  const random=mulberry32(7142026);
  const particles=Array.from({length:150},()=>({x:random(),y:random(),z:random(),phase:random()*Math.PI*2,size:random()*1.3+.3}));
  let width=0,height=0,bounds=[],chapter=0;
  let paused=reduced.matches,time=0,lastStamp=null,raf=null,external=false,lastPhase=-1;
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);bounds=chapters.map(el=>({top:el.offsetTop,height:el.offsetHeight}));updateChapter();renderFrame(time);}
  function updateChapter(){const y=scrollY+height*.36;chapter=0;bounds.forEach((b,i)=>{if(y>=b.top)chapter=i;});document.getElementById('chapter-number').textContent=chapters[chapter].dataset.number;document.getElementById('chapter-label').textContent=chapters[chapter].dataset.chapter;document.getElementById('scroll-fill').style.height=`${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-height))*100}%`;headings.forEach((heading,i)=>{const k=reduced.matches||paused?1:ease((scrollY+height-bounds[i+1].top-100)/(height*.55));heading.style.transform=`translateY(${(1-k)*18}px)`;heading.style.opacity=String(.65+.35*k);});if(paused||external)renderFrame(time);}
  function drawParticles(t){
    if(!ctx)return;ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(width*.75,height*.35,0,width*.75,height*.35,width*.7);glow.addColorStop(0,'rgba(83,48,145,.25)');glow.addColorStop(.55,'rgba(30,46,77,.08)');glow.addColorStop(1,'rgba(7,7,19,0)');ctx.fillStyle='#070713';ctx.fillRect(0,0,width,height);ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    const count=width<640?65:150;
    const points=particles.slice(0,count).map(p=>{const angle=p.phase+t*.045,ribbon=chapter===1||chapter===3;return{x:p.x*width+Math.sin(angle)*35,y:ribbon?height*.52+Math.sin(p.x*6.28+t*.1)*height*.15+(p.y-.5)*height*.25:p.y*height+Math.cos(angle*.8)*25,p};});
    ctx.lineWidth=.5;
    for(let i=0;i<count;i++){const a=points[i];for(let j=i+1;j<Math.min(i+8,count);j++){const b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<125){ctx.strokeStyle=`rgba(99,246,255,${.095*(1-d/125)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}ctx.fillStyle=`rgba(${i%5===0?'255,214,107':'99,246,255'},${.12+a.p.z*.25})`;ctx.beginPath();ctx.arc(a.x,a.y,a.p.size,0,Math.PI*2);ctx.fill();}
    ctx.strokeStyle='rgba(139,92,255,.045)';ctx.lineWidth=.6;
    for(let i=0;i<8;i++){const y=height*.3+Math.pow(i/7,2)*height*.8;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    for(let i=-4;i<9;i++){ctx.beginPath();ctx.moveTo(width*.6,height*.3);ctx.lineTo(i*width/5,height*1.1);ctx.stroke();}
    if(width>1000){ctx.font='9px "JetBrains Mono",monospace';ctx.fillStyle='rgba(183,182,205,.09)';['const goal = understand(context);','const plan = harness.compose(goal);','await execute(plan);','verify(result);'].forEach((line,i)=>ctx.fillText(line,width*.65,height*.13+i*19));}
  }
  function renderFrame(t){
    const sample=Math.max(0,Number(t)||0),local=sample===24?23.999:sample%24;
    drawParticles(sample);const index=Math.floor(local/6),u=local%6,p=phases[index];
    if(index!==lastPhase){kicker.textContent=p.kicker;title.textContent=p.title;copy.textContent=p.copy;word.textContent=p.word;lastPhase=index;}
    const enter=ease(u/.85);title.style.transform=`translateY(${(1-enter)*12}px)`;title.style.opacity=String(.5+.5*enter);word.style.transform=`translate(-50%,-50%) scale(${1+.035*Math.sin(sample*.3)})`;
    traces.forEach((path,i)=>{path.style.strokeDashoffset=String(1-clamp((u-i*.35)/2));});nodes.forEach((node,i)=>{node.style.opacity=String(i<=index?1:.35);});
    if(document.activeElement!==slider)slider.value=String(sample===24?24:local);clock.textContent=`00:${String(sample===24?24:Math.floor(local)).padStart(2,'0')} / 00:24`;
  }
  function tick(stamp){raf=null;if(paused||external||document.hidden){lastStamp=null;return;}if(lastStamp!==null)time+=(stamp-lastStamp)/1000;lastStamp=stamp;renderFrame(time);raf=requestAnimationFrame(tick);}
  function syncControls(){toggle.textContent=paused?'开启动效':'暂停动效';toggle.setAttribute('aria-pressed',String(paused));play.textContent=paused?'▶':'Ⅱ';play.setAttribute('aria-label',paused?'播放演示':'暂停演示');}
  function setPaused(value){paused=value;external=false;lastStamp=null;if(raf!==null){cancelAnimationFrame(raf);raf=null;}syncControls();renderFrame(time);if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);}
  toggle.addEventListener('click',()=>setPaused(!paused));play.addEventListener('click',()=>setPaused(!paused));
  slider.addEventListener('input',()=>{const value=Number(slider.value);setPaused(true);time=value;renderFrame(time);});
  reduced.addEventListener('change',()=>setPaused(reduced.matches));
  document.addEventListener('visibilitychange',()=>{lastStamp=null;if(document.hidden){if(raf!==null)cancelAnimationFrame(raf);raf=null;}else if(!paused&&!external&&raf===null)raf=requestAnimationFrame(tick);});
  window.addEventListener('resize',resize);window.addEventListener('scroll',updateChapter,{passive:true});document.fonts.ready.then(resize);
  document.querySelectorAll('.gallery-controls button').forEach(button=>button.addEventListener('click',()=>{document.getElementById('speaking-image').src=`./assets/speaking/${button.dataset.image}`;document.getElementById('speaking-image').alt=button.dataset.caption;document.getElementById('speaking-caption').textContent=button.dataset.caption;document.querySelectorAll('.gallery-controls button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
  document.getElementById('print-resume').addEventListener('click',()=>window.print());
  window.DURATION=24;window.renderFrame=t=>{external=true;if(raf!==null)cancelAnimationFrame(raf);raf=null;time=Number(t)||0;renderFrame(time);};window.resumeFilm=()=>setPaused(false);
  const params=new URLSearchParams(location.search);resize();syncControls();if(params.has('t')){paused=true;syncControls();window.renderFrame(Number(params.get('t'))||0);}else if(!paused)raf=requestAnimationFrame(tick);
})();
