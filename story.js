(() => {
  const story = document.querySelector('.story');
  const scenes = [...document.querySelectorAll('.story-scene')];
  const links = [...document.querySelectorAll('.story-nav a')];
  const current = document.getElementById('story-current');
  const progress = document.querySelector('.story-track i');
  if (!story || !scenes.length || !current || !progress) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  function render() {
    queued = false;
    const rect = story.getBoundingClientRect();
    const range = Math.max(1, story.offsetHeight - innerHeight);
    const amount = Math.min(1, Math.max(0, -rect.top / range));
    if (innerWidth <= 700) { progress.style.width = `${amount * 100}%`; progress.style.height = '1px'; }
    else { progress.style.height = `${amount * 100}%`; progress.style.width = '1px'; }
    let active = 0;
    scenes.forEach((scene, i) => {
      const bounds = scene.getBoundingClientRect();
      if (bounds.top <= innerHeight * .5) active = i;
      const shift = reduced.matches ? 0 : Math.max(-20, Math.min(20, (bounds.top - innerHeight * .35) * .035));
      const phase = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight * .8)));
      scene.style.setProperty('--story-shift', shift.toFixed(1));
      scene.style.setProperty('--story-phase', phase.toFixed(2));
    });
    current.textContent = scenes[active].dataset.storyIndex;
    links.forEach((link, i) => { if (i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  render();
})();
