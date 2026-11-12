(() => {
  const section = document.querySelector('.spatial-gallery');
  const cards = [...document.querySelectorAll('.gallery-item')];
  const count = document.getElementById('gallery-count');
  const bar = document.querySelector('.gallery-progress i');
  const heading = document.querySelector('.gallery-heading');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!section || !cards.length || !count || !bar || !window.THREE) return;
  let queued = false;
  function render() {
    queued = false;
    const enabled = innerWidth > 700 && !motion.matches;
    document.documentElement.classList.toggle('gallery-ready', enabled);
    if (!enabled) {
      cards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; card.style.zIndex = ''; card.removeAttribute('inert'); });
      if (heading) heading.style.opacity = '';
      return;
    }
    const rect = section.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(-rect.top / Math.max(1, section.offsetHeight - innerHeight), 0, 1);
    const position = progress * (cards.length - 1);
    if (heading) heading.style.opacity = String(1 - THREE.MathUtils.clamp(progress * 8, 0, 1));
    const active = Math.round(position);
    cards.forEach((card, i) => {
      const distance = i - position;
      const x = 15 + distance * 48;
      const depth = -Math.abs(distance) * 410;
      const rotation = THREE.MathUtils.clamp(-distance * 26, -48, 48);
      const opacity = THREE.MathUtils.clamp(1.6 - Math.abs(distance) * .65, 0, 1);
      card.style.transform = `translate(-50%,-50%) translate3d(${x}vw,0,${depth}px) rotateY(${rotation}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(20 - Math.round(Math.abs(distance) * 4));
      card.classList.toggle('is-active', i === active);
      if (i === active) card.removeAttribute('inert'); else card.setAttribute('inert', '');
    });
    count.textContent = `0${active + 1} / 04`;
    bar.style.width = `${(position + 1) / cards.length * 100}%`;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  render();
})();
