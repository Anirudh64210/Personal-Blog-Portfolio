const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const CHARS='!<>-_\\/[]{}=+*^?#__01';
class Scramble{
  constructor(el,o){o=o||{};this.el=el;this.update=this.update.bind(this);
    this.speed=o.speed||1;this.spread=o.spread||30;this.dur=o.dur||8;this.intensity=(o.intensity!=null)?o.intensity:0.28;}
  set(text){
    if(reduced){this.el.textContent=text;return Promise.resolve();}
    const old=this.el.textContent||'';const len=Math.max(old.length,text.length);
    const p=new Promise(r=>this.resolve=r);this.queue=[];
    for(let i=0;i<len;i++){const start=Math.floor(Math.random()*this.spread);const end=start+Math.floor(Math.random()*this.spread)+this.dur;
      this.queue.push({from:old[i]||'',to:text[i]||'',start,end,char:''});}
    cancelAnimationFrame(this.req);this.acc=0;this.frame=0;this.update();return p;
  }
  update(){
    let out='',done=0;
    for(const q of this.queue){
      if(this.frame>=q.end){done++;out+=q.to;}
      else if(this.frame>=q.start){if(!q.char||Math.random()<this.intensity)q.char=CHARS[Math.floor(Math.random()*CHARS.length)];out+='<span class="scr">'+q.char+'</span>';}
      else out+=q.from;
    }
    this.el.innerHTML=out;
    if(done===this.queue.length){this.resolve&&this.resolve();return;}
    this.acc+=this.speed;this.frame=Math.floor(this.acc);this.req=requestAnimationFrame(this.update);
  }
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

window.addEventListener('load',()=>{
  const name=document.querySelector('.name'),tag=document.getElementById('tagline');
  if(name&&tag){
    const sName=new Scramble(name,{speed:0.5,spread:46,dur:16,intensity:0.06});
    const sTag =new Scramble(tag ,{speed:0.55,spread:48,dur:14,intensity:0.06});
    sName.set(name.dataset.text).then(()=>setTimeout(()=>{sTag.set(tag.dataset.text).then(()=>{tag.innerHTML+='<span class="cursor"></span>';});},260));
  }
});

document.querySelectorAll('.label[data-text]').forEach(l=>{l.classList.add('reveal');if(!reduced)l.textContent='';});
const ioReveal=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ioReveal.unobserve(e.target);}});},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>ioReveal.observe(el));
const ioLabel=new IntersectionObserver((es)=>{es.forEach(e=>{const l=e.target;if(!e.isIntersecting||l.dataset.done)return;l.dataset.done='1';new Scramble(l,{speed:0.55,spread:44,dur:14,intensity:0.12}).set(l.dataset.text);ioLabel.unobserve(l);});},{threshold:0,rootMargin:'-18% 0px -32% 0px'});
document.querySelectorAll('.label[data-text]').forEach(l=>ioLabel.observe(l));

document.querySelectorAll('.proj').forEach(card=>{const code=card.querySelector('.code');
  card.addEventListener('mouseenter',()=>new Scramble(code,{speed:0.5,spread:30,dur:12,intensity:0.12}).set(code.dataset.text));});

/* TERM_LINES injected by layout */
async function runTerminal(host){
  if(reduced){host.innerHTML=TERM_LINES.map(l=>l.t==='cmd'?'<div class="line"><span class="pmt">$</span> '+l.x+'</div>':'<div class="line out">'+l.x+'</div>').join('')+'<div class="line"><span class="pmt">$</span> <span class="cur"></span></div>';return;}
  host.innerHTML='';
  for(const l of TERM_LINES){
    const div=document.createElement('div');div.className='line';host.appendChild(div);
    if(l.t==='cmd'){
      div.innerHTML='<span class="pmt">$</span> <span class="ct"></span><span class="cur"></span>';
      const ct=div.querySelector('.ct'),cur=div.querySelector('.cur');
      for(const c of l.x){ct.textContent+=c;await sleep(32+Math.random()*46);}
      cur.remove();await sleep(240);
    }else{div.className='line out';await new Scramble(div,{speed:0.7,spread:16,dur:8,intensity:0.14}).set(l.x);await sleep(120);}
  }
  const end=document.createElement('div');end.className='line';end.innerHTML='<span class="pmt">$</span> <span class="cur"></span>';host.appendChild(end);
}
const term=document.getElementById('term');let termRun=false;
const ioTerm=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting&&!termRun){termRun=true;runTerminal(term);ioTerm.unobserve(e.target);}});},{threshold:.35});
if(term)ioTerm.observe(term);

document.querySelectorAll('.chip').forEach(c=>c.addEventListener('mouseenter',()=>new Scramble(c,{speed:0.8,spread:16,dur:6,intensity:0.18}).set(c.dataset.text)));
if(!reduced){const _chips=[...document.querySelectorAll('.chip')];setInterval(()=>{const c=_chips[Math.floor(Math.random()*_chips.length)];if(c){c.classList.add('lit');setTimeout(()=>c.classList.remove('lit'),520);}},2200);}

function tick(){const t=new Date().toLocaleTimeString('en-GB',{hour12:false});const a=document.getElementById('clock'),b=document.getElementById('clock2');if(a)a.textContent=t;if(b)b.textContent=t;}
tick();setInterval(tick,1000);