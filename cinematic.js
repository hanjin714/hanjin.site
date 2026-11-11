(() => {
  const section = document.querySelector('.intro-film');
  const canvas = document.getElementById('intro-canvas');
  const copy = document.querySelector('.intro-copy');
  const wordmark = document.querySelector('.intro-wordmark');
  const progressBar = document.querySelector('.intro-progress i');
  if (!section || !canvas || !copy || !window.THREE) { if (copy) { copy.style.opacity = '1'; copy.classList.add('is-visible'); } return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true}); }
  catch (_) { copy.style.opacity = '1'; copy.classList.add('is-visible'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x060908,1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37,1,.1,100); camera.position.z = 13;
  scene.add(new THREE.AmbientLight(0xb7d6bb,1.2));
  const key = new THREE.DirectionalLight(0xc8ffa8,4); key.position.set(4,6,8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x80caca,3); rim.position.set(-6,-2,-4); scene.add(rim);
  const world = new THREE.Group(); scene.add(world);
  const rings = new THREE.Group(); world.add(rings);
  const metal = new THREE.MeshStandardMaterial({color:0x98b37d,metalness:.8,roughness:.25,emissive:0x182a0e,emissiveIntensity:.5});
  const luminous = new THREE.MeshBasicMaterial({color:0xd3ff9b,transparent:true,opacity:.78});
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5,.11,18,200),metal); rings.add(ring);
  for (let i=0;i<9;i++) { const fine = new THREE.Mesh(new THREE.TorusGeometry(2.16+i*.08,.008,5,180),luminous); fine.position.z=(i-4)*.045; rings.add(fine); }
  const ticks = new THREE.Group(); rings.add(ticks);
  const tickMat = new THREE.MeshBasicMaterial({color:0xcaff9c,transparent:true,opacity:.6});
  for (let i=0;i<120;i++) { const a=i/120*Math.PI*2, len=i%10===0?.18:.07; const mesh=new THREE.Mesh(new THREE.BoxGeometry(.012,len,.012),tickMat); mesh.position.set(Math.sin(a)*2.78,Math.cos(a)*2.78,0); mesh.rotation.z=-a; ticks.add(mesh); }
  const core = new THREE.Group(); world.add(core);
  const darkMetal = new THREE.MeshStandardMaterial({color:0x1b2620,metalness:.75,roughness:.26});
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12,1),darkMetal); core.add(shell);
  const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.13,1)),new THREE.LineBasicMaterial({color:0xbaf779,transparent:true,opacity:.8})); core.add(cage);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.56,1),new THREE.MeshStandardMaterial({color:0xe6ffd4,emissive:0x86d744,emissiveIntensity:1.4,metalness:.55,roughness:.26})); core.add(inner);
  for (let i=0;i<3;i++){ const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.55+i*.13,.013,6,120),luminous); orbit.rotation.set(i*.9,.35+i*.7,0); core.add(orbit); }
  const coords=[]; for(let i=0;i<650;i++){const a=i*2.39996,r=2.5+(i%83)*.038; coords.push(Math.cos(a)*r,Math.sin(a)*r,(Math.sin(i*21.1))*2.8);}
  const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
  const dust=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xb9efab,size:.025,transparent:true,opacity:.68})); world.add(dust);
  const clamp=(x)=>Math.max(0,Math.min(1,x)); const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
  let width=0,height=0;
  function render(){
    const distance=Math.max(1,section.offsetHeight-innerHeight);
    const p=reduced.matches?1:clamp(-section.getBoundingClientRect().top/distance);
    const appear=smooth(.12,.58,p), settle=smooth(.45,.88,p), show=smooth(.62,.92,p);
    const mobile=width<680;
    world.position.x=(mobile?0:2.5)*settle; world.position.y=(mobile?-2.8:0)*settle;
    world.scale.setScalar(mobile ? .82 : 1);
    world.rotation.y=-.2+p*1.25; world.rotation.x=.18+p*.22;
    rings.rotation.x=.15+p*.85; rings.rotation.y=p*.55; rings.scale.setScalar(1.3-.33*appear);
    core.scale.setScalar(.001+appear*1.4); core.rotation.y=p*2.8; core.rotation.z=p*.8;
    dust.rotation.z=p*.25;
    copy.style.opacity=String(show); copy.classList.toggle('is-visible',show>.8);
    wordmark.style.opacity=String(1-smooth(.18,.45,p)); progressBar.style.width=(p*100)+'%';
    renderer.render(scene,camera);
  }
  function resize(){ const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;if(!width||!height)return; renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.z=width<680?17:13;camera.updateProjectionMatrix();render(); }
  let pending=false; function schedule(){if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;render();});}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize);reduced.addEventListener('change',resize);resize();
})();
