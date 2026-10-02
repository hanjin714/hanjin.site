/* Typed native interactions; GitHub Pages serves the compiled script.js. */
(() => {
  const get = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) throw new Error('Missing element: ' + id);
    return el as T;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = get<HTMLButtonElement>('motion-toggle');
  const stage = document.querySelector<HTMLElement>('.spatial-portrait');
  const panels = [...document.querySelectorAll<HTMLAnchorElement>('.orbit-panel')];
  let userPaused = reduced.matches, hovered = false, focused = false, inView = true;
  let time = 0, last: number | null = null, raf: number | null = null;

  function renderFrame(t: number): void {
    const sample = Math.max(0, Number(t) || 0) % 48;
    panels.forEach((panel, i) => {
      const angle = i * Math.PI / 2 + sample * Math.PI / 24;
      const depth = Math.sin(angle);
      panel.style.opacity = String(.7 + (depth + 1) * .15);
      panel.style.transform = 'translate3d(' + Math.cos(angle) * 218 + 'px,' + depth * 163 + 'px,' + depth * 70 + 'px) rotateY(' + -Math.cos(angle) * 8 + 'deg) rotateZ(' + -Math.cos(angle) * 3 + 'deg) scale(' + (.87 + (depth + 1) * .065) + ')';
      panel.style.zIndex = String(Math.round((depth + 1) * 8) + 2);
    });
  }
  function canRun(): boolean { return !userPaused && !hovered && !focused && inView && !document.hidden; }
  function tick(stamp: number): void {
    raf = null;
    if (!canRun()) { last = null; return; }
    if (last !== null) time += Math.min(.05, (stamp - last) / 1000);
    last = stamp;
    renderFrame(time);
    raf = requestAnimationFrame(tick);
  }
  function sync(): void {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null; last = null;
    toggle.textContent = userPaused ? '开启动效' : '暂停动效';
    toggle.setAttribute('aria-pressed', String(userPaused));
    if (canRun()) raf = requestAnimationFrame(tick);
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  reduced.addEventListener('change', () => { userPaused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  stage?.addEventListener('pointerenter', (event: PointerEvent) => { if (event.pointerType === 'mouse') { hovered = true; sync(); } });
  stage?.addEventListener('pointerleave', () => { hovered = false; sync(); });
  stage?.addEventListener('focusin', () => { focused = true; sync(); });
  stage?.addEventListener('focusout', (event: FocusEvent) => {
    focused = !!event.relatedTarget && stage.contains(event.relatedTarget as Node); sync();
  });
  if (stage && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? false; sync(); }, { threshold: .05 }).observe(stage);
  }

  const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a')];
  const chapters = [...document.querySelectorAll<HTMLElement>('.chapter')];
  let navRaf: number | null = null;
  function updateNav(): void {
    navRaf = null;
    let active = 'top';
    chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top <= innerHeight * .35) active = chapter.id; });
    if (active === 'systems') active = 'delivery';
    if (active === 'speaking') active = 'work';
    links.forEach(link => {
      if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => { if (navRaf === null) navRaf = requestAnimationFrame(updateNav); }, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    document.querySelectorAll<HTMLElement>('.section-head,.career-history,.capability-archive').forEach(el => {
      el.classList.add('reveal-ready'); observer.observe(el);
    });
  }
  document.querySelectorAll<HTMLButtonElement>('.gallery-controls button').forEach(button => button.addEventListener('click', () => {
    const image = get<HTMLImageElement>('speaking-image');
    image.src = './assets/speaking/' + button.dataset.image;
    image.alt = button.dataset.caption || '';
    get('speaking-caption').textContent = image.alt;
    document.querySelectorAll('.gallery-controls button').forEach(b => {
      b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));
    });
  }));
  get('print-resume').addEventListener('click', () => window.print());
  get('copy-email').addEventListener('click', async () => {
    const feedback = get('contact-feedback');
    try { await navigator.clipboard.writeText('han714jin@gmail.com'); feedback.textContent = '邮箱已复制，可以直接粘贴。'; }
    catch { feedback.textContent = '未能自动复制，请直接选择上方邮箱，或点击面试交流发送邮件。'; }
  });
  const controls = window as typeof window & { DURATION?: number; renderFrame?: (t: number) => void; resumeFilm?: () => void };
  controls.DURATION = 48;
  controls.renderFrame = (t: number) => { userPaused = true; time = Math.max(0, Number(t) || 0); renderFrame(time); sync(); };
  controls.resumeFilm = () => { userPaused = false; sync(); };
  const params = new URLSearchParams(location.search);
  renderFrame(time);
  if (params.has('t')) controls.renderFrame(Number(params.get('t'))); else sync();
})();
