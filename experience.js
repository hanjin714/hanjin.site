(() => {
  const stories = [
    { year:'2022', kicker:'CHAPTER 01 / THE FIRST FRAME', heading:'从镜头开始，<br>理解人和表达。', description:'从新媒体运营、拍摄与剪辑出发，学习如何发现故事、组织内容，也开始理解作品怎样抵达真实的人。', image:'agent-community-talk-01.webp', alt:'韩金在线下交流现场，资料照片', label:'社区分享 / 资料照片', href:'#work', link:'探索公开作品' },
    { year:'2023', kicker:'CHAPTER 02 / INTO THE FIELD', heading:'走进门店，<br>理解真实经营。', description:'作为连锁宠物门店合伙人之一，参与经营与数字化建设。从客户、库存到团队协作，开始在真实业务中寻找问题。', image:'agent-community-talk-03.webp', alt:'韩金在线下活动中交流，资料照片', label:'社区分享 / 资料照片', href:'#experience', link:'了解经营经历' },
    { year:'2025', kicker:'CHAPTER 03 / AI IN PRACTICE', heading:'让 AI 不止回答，<br>开始参与工作。', description:'围绕门店复购、客户跟进和日常协同，实践 AI SCRM、Agent 与自动化工作流；也开始在线下分享这些经验。', image:'agent-community-talk-05.webp', alt:'韩金在线下分享 AI 应用', label:'FIELD NOTES / COMMUNITY', href:'#speaking', link:'走进分享现场' },
    { year:'2026', kicker:'CHAPTER 04 / BUILD & DELIVER', heading:'从一个想法，<br>走向团队交付。', description:'在企业业务现场拆解需求、构建关键执行环节，与团队及合作伙伴一起推进 AI 项目，也持续探索自己的产品。', image:'agent-community-talk-02.webp', alt:'韩金在 Agent 开发者社区分享', label:'FIELD NOTES / BUILDING', href:'#delivery', link:'查看代表交付' }
  ];
  const tabs = [...document.querySelectorAll('.journey-tab')];
  const panel = document.getElementById('journey-panel');
  function select(index, focus = false) {
    const story = stories[index];
    if (!story || !panel) return;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    document.getElementById('journey-kicker').textContent = story.kicker;
    document.getElementById('journey-heading').innerHTML = story.heading;
    document.getElementById('journey-description').textContent = story.description;
    const image = document.getElementById('journey-image'); image.src = './assets/speaking/' + story.image; image.alt = story.alt;
    document.getElementById('journey-photo-label').textContent = story.label;
    document.getElementById('journey-counter').textContent = '0' + (index + 1) + ' / 04';
    const link = document.getElementById('journey-link'); link.href = story.href; link.innerHTML = story.link + ' <span>↗</span>';
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      let next = i;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); select(next, true);
    });
  });

  const canvas = document.getElementById('universe');
  if (!canvas || !window.THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'low-power'}); }
  catch (_) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100); camera.position.set(0, 0, 15);
  const group = new THREE.Group(); scene.add(group);
  const colors = [0xbaf779, 0xe9c491, 0x75aeb0];
  for (let line = 0; line < 46; line++) {
    const points = [];
    for (let i = 0; i <= 140; i++) {
      const a = i / 140 * Math.PI * 2;
      const r = 2.35 + .34 * Math.sin(3 * a + line * .25);
      points.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * .77, .8 * Math.sin(a * 2 + line * .17) + (line - 23) * .035));
    }
    const material = new THREE.LineBasicMaterial({color:colors[line % 3], transparent:true, opacity: line % 7 === 0 ? .48 : .115});
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
    ring.rotation.x = (line - 23) * .018; ring.rotation.y = (line - 23) * .025; ring.rotation.z = line * .011; group.add(ring);
  }
  const coordinates = [];
  for (let i = 0; i < 480; i++) { const a = i * 2.39996; const r = 2 + (i % 31) / 18; coordinates.push(Math.cos(a) * r, Math.sin(a) * r * .76, Math.sin(i * 7.7) * 1.4); }
  const dotsGeometry = new THREE.BufferGeometry(); dotsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coordinates, 3));
  group.add(new THREE.Points(dotsGeometry, new THREE.PointsMaterial({color:0xdfffd1, size:.024, transparent:true, opacity:.8})));
  const axisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5,0,0),new THREE.Vector3(5,0,0),new THREE.Vector3(0,-5,0),new THREE.Vector3(0,5,0)]);
  group.add(new THREE.LineSegments(axisGeometry,new THREE.LineBasicMaterial({color:0x8da99b,transparent:true,opacity:.16})));
  let pointerX = 0, pointerY = 0, visible = true, raf = 0, time = 0, last = 0;
  const toggle = document.getElementById('motion-toggle');
  function resize() { const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); group.position.x = camera.aspect < 1 ? 0 : 3; group.position.y = camera.aspect < 1 ? -3.4 : -.15; group.scale.setScalar(camera.aspect < 1 ? .8 : 1); render(); }
  function render() { group.rotation.y = time * .085 + pointerX * .18; group.rotation.x = -.3 + pointerY * .12; group.rotation.z = -.16 + time * .025; renderer.render(scene,camera); }
  function tick(now) { raf = 0; if (!visible || document.hidden || reduced.matches || toggle?.getAttribute('aria-pressed') === 'true') { last = 0; return; } if (last) time += Math.min((now-last)/1000,.05); last = now; render(); raf = requestAnimationFrame(tick); }
  function sync() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; render(); if (visible && !document.hidden && !reduced.matches && toggle?.getAttribute('aria-pressed') !== 'true') raf = requestAnimationFrame(tick); }
  window.addEventListener('resize',resize); document.addEventListener('visibilitychange',sync); reduced.addEventListener('change',sync); toggle?.addEventListener('click', () => requestAnimationFrame(sync));
  window.addEventListener('pointermove', event => { pointerX = event.clientX / innerWidth - .5; pointerY = event.clientY / innerHeight - .5; }, {passive:true});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {visible = entries[0].isIntersecting; sync();}, {threshold:.01}).observe(canvas);
  resize(); sync();
})();
