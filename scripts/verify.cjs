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
let commands=[];
const draw = new Proxy({}, { get(_t,key){return (...args)=>{commands.push([key,...args]);if(key==='createRadialGradient')return {addColorStop:(...a)=>commands.push(['stop',...a])};};}, set(_t,key,value){commands.push(['set',key,value]);return true;} });
function element(id=''){return {id,style:{},dataset:{},value:'0',textContent:'',offsetTop:0,offsetHeight:900,querySelector(){return null;},setAttribute(k,v){this[k]=v;},addEventListener(k,fn){this.events[k]=fn;},events:{},classList:{toggle(){}},getContext(){return draw;}};}
function boot(isReduced=false){
  const elements=Object.fromEntries(ids.map(id=>[id,element(id)]));
  const chapters=['top','delivery','systems','experience','work','speaking','contact'].map((id,i)=>Object.assign(elements[id],{offsetTop:i*1000,dataset:{number:String(i+1).padStart(2,'0'),chapter:id}}));
  const sets={'.chapter':chapters,'.trace':[element(),element()],'.orbit-node':[element(),element(),element(),element()],'.gallery-controls button':[]};
  const orbit=element(),media={matches:isReduced,addEventListener(){}};
  const context={console,URLSearchParams,innerWidth:1440,innerHeight:900,devicePixelRatio:1,scrollY:0,location:{search:''},matchMedia:()=>media,requestAnimationFrame:()=>1,cancelAnimationFrame(){},document:{hidden:false,activeElement:null,documentElement:{scrollHeight:7500},getElementById:id=>elements[id],querySelector:()=>orbit,querySelectorAll:s=>sets[s],fonts:{ready:Promise.resolve()},addEventListener(){}},addEventListener(){}};
  context.window=context;vm.createContext(context);vm.runInContext(source,context);
  return {context,elements,sets};
}
const {context,elements}=boot();
assert.equal(context.DURATION,24);
const sample=t=>{commands=[];context.renderFrame(t);return JSON.stringify({commands,title:elements['film-title'].textContent,style:elements['film-title'].style,clock:elements['film-clock'].textContent});};
for(const t of [0,.2,3,6,8,12,16,18,22,24,30]){
  const first=sample(t);sample(t+5);assert.equal(sample(t),first,`Nondeterministic sample ${t}`);
}
context.renderFrame(14);assert.equal(elements['film-title'].textContent,'推进到可验证的结果。');
elements['film-time'].value='20';elements['film-time'].events.input();assert.equal(elements['film-title'].textContent,'让交付继续生长。');
const reduced=boot(true);assert.equal(reduced.elements['motion-toggle'].textContent,'开启动效');
console.log('PASS: anchors, assets, public boundaries, seven chapters, deterministic seek, slider and reduced-motion default');
