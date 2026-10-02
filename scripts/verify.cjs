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
function element(){return {style:{},events:{},setAttribute(k,v){this[k]=v;},addEventListener(k,fn){this.events[k]=fn;},querySelectorAll(){return this.items||[];}};}
function boot(reduced=false){
  const scenes=Array.from({length:4},()=>Object.assign(element(),{items:Array.from({length:3},element)}));
  const toggle=element(),print=element();
  const context={URLSearchParams,location:{search:''},matchMedia:()=>({matches:reduced,addEventListener(){}}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},document:{hidden:false,getElementById:id=>id==='motion-toggle'?toggle:print,querySelectorAll:s=>s==='.orbit-panel'?scenes:[],addEventListener(){}}};
  context.window=context;vm.createContext(context);vm.runInContext(source,context);return {context,scenes,toggle};
}
const {context,scenes}=boot();
assert.equal(context.DURATION,48);
const sample=t=>{context.renderFrame(t);return JSON.stringify(scenes);};
for(const t of [0,.2,3,6,8,12,16,18,22,24,30]){const first=sample(t);sample(t+5);assert.equal(sample(t),first);}
context.renderFrame(14);assert(scenes.every(s=>Number(s.style.opacity)>=.48));
context.renderFrame(24);assert(scenes.every(s=>s['aria-hidden']==='false'));
const reduced=boot(true);assert.equal(reduced.toggle.textContent,'开启动效');assert(reduced.scenes.every(s=>s.style.transform.includes('translate3d')));
console.log('PASS: assets, anchors, public boundaries, four spatial project panels, no progress UI, deterministic sampling and reduced motion');
