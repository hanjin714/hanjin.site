const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
for (const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(m[1]), `Missing anchor ${m[1]}`);
for (const m of [...html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g), ...css.matchAll(/url\('(\.\/[^']+)'\)/g)]) {
  assert(fs.existsSync(path.join(root,m[1])), `Missing asset ${m[1]}`);
}
assert(!/美团|天津中天|成都洵海|反扒|自动化招聘|jimfylu4fs2/.test(html), 'Restricted public details');
assert(html.includes('自研 Harness') && html.includes('企业 AI 协同中台'));
assert.equal((html.match(/class="chapter(?:\s|")/g)||[]).length,7);
assert(!/id="(?:film-time|film-clock|scroll-fill)"|class="chapter-meter"/.test(html),'No progress UI');
assert.equal((html.match(/class="orbit-panel"/g)||[]).length,4);

assert.equal((html.match(/<a class="orbit-panel" href="#/g)||[]).length,4,'Orbit panels must be useful links');
assert.equal((html.match(/<details>/g)||[]).length,3,'Three interview deep dives');
assert(html.includes('copy-email') && html.includes('role="status"'),'Contact feedback');
assert(!/保留重构前|mini-wiring|mini-bars/.test(html),'No editor-facing copy or pretend charts');
function element(){return {style:{},events:{},classList:{add(){},toggle(){}},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},addEventListener(k,fn){this.events[k]=fn;},contains(){return false;},querySelectorAll(){return [];}};}
function boot(reduced=false){
  const panels=Array.from({length:4},element),elements=Object.fromEntries(ids.map(id=>[id,element()]));
  const stage=element(),queue=new Map(),observers=[];let serial=0;
  class Observer{constructor(callback){this.callback=callback;observers.push(this);}observe(){}unobserve(){}}
  const context={URLSearchParams,location:{search:''},innerHeight:900,navigator:{clipboard:{writeText:async()=>{}}},matchMedia:()=>({matches:reduced,addEventListener(){}}),requestAnimationFrame:fn=>{queue.set(++serial,fn);return serial;},cancelAnimationFrame:id=>queue.delete(id),IntersectionObserver:Observer,document:{hidden:false,getElementById:id=>elements[id],querySelector:()=>stage,querySelectorAll:s=>s==='.orbit-panel'?panels:[],addEventListener(){}},addEventListener(){}};
  context.window=context;vm.createContext(context);vm.runInContext(source,context);
  return {context,panels,elements,stage,queue,observers};
}
const {context,panels}=boot();assert.equal(context.DURATION,48);
const sample=t=>{context.renderFrame(t);return JSON.stringify(panels.map(p=>p.style));};
for(const t of [0,.2,3,6,8,12,16,18,22,24,30]){const first=sample(t);sample(t+5);assert.equal(sample(t),first);}
assert.equal(sample(0),sample(48),'Orbit must return to the same composition');
context.renderFrame(14);assert(panels.every(p=>Number(p.style.opacity)>=.7));
const reduced=boot(true);assert.equal(reduced.elements['motion-toggle'].textContent,'开启动效');assert.equal(reduced.queue.size,0);
const active=boot();assert.equal(active.queue.size,1);
active.stage.events.pointerenter({pointerType:'mouse'});assert.equal(active.queue.size,0,'Pause for pointer');
active.stage.events.pointerleave();assert.equal(active.queue.size,1);
active.stage.events.focusin();assert.equal(active.queue.size,0,'Pause for keyboard');
active.stage.events.focusout({relatedTarget:null});assert.equal(active.queue.size,1);
active.observers[0].callback([{isIntersecting:false}]);assert.equal(active.queue.size,0,'Stop outside viewport');
active.observers[0].callback([{isIntersecting:true}]);assert.equal(active.queue.size,1);
console.log('PASS: public boundaries, links/assets, typed runtime, deterministic orbit, hover/focus/offscreen pause, reduced motion, deep dives and contact feedback');
