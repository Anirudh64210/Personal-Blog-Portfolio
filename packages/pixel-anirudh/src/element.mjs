/*!
 * <pixel-anirudh> v1.3
 * Web component that runs the companion on a site: asleep, wakes when a visitor arrives,
 * waves hello, goes back to work, takes pizza breaks, naps when the visitor goes idle,
 * and opens an "ask me anything / reach out" bubble when clicked.
 */
import PixelAnirudh from './engine.mjs';

const A = PixelAnirudh;
const TICK_MS = 125;
const WAKE_GRACE_MS = 2500;

const DEFAULTS = {
  scale: 4,
  greeting: 'Hey! I’m Anirudh.',
  'greeting-back': 'Oh hey, welcome back!',
  'greeting-note': 'Click me if you want to ask something.',
  'menu-title': 'Ask me anything, or reach out.',
  'ask-label': 'Ask me anything',
  'reach-label': 'Reach out',
  'ask-title': 'What do you want to know?',
  'ask-placeholder': 'What are you building right now?',
  'send-label': 'Send',
  'reach-title': 'Let’s talk.',
  'thanks-text': 'Got it, thanks!',
  'idle-sleep': 60000,
  'snack-interval': 45000,
  'bubble-position': 'left'
};

const STYLE = `
:host{ display:inline-block; position:relative; line-height:1.4; font-family:var(--pa-font, inherit);
  --pa-bg:#FFFFFF; --pa-fg:#1E1B2B; --pa-muted:#6F6A73; --pa-border:#1E1B2B; --pa-accent:#1E1B2B; --pa-accent-fg:#FFFFFF;
  --pa-input-bg:#F3F0EA; --pa-radius:4px; --pa-shadow:4px 4px 0 var(--pa-border); --pa-focus:#2E5AAC; }
@media (prefers-color-scheme: dark){
  :host{ --pa-bg:#1E1C26; --pa-fg:#EEEAF2; --pa-muted:#9892A0; --pa-border:#EEEAF2; --pa-accent:#EEEAF2; --pa-accent-fg:#1E1C26;
    --pa-input-bg:#15141B; --pa-focus:#7FA4EC; }
}
:host([hidden]){ display:none; }
*{ box-sizing:border-box; }
.wrap{ position:relative; display:inline-block; }
.sprite{ all:unset; display:block; cursor:pointer; border-radius:6px; }
.sprite:focus-visible{ outline:2px solid var(--pa-focus); outline-offset:2px; }
canvas{ display:block; image-rendering:pixelated; image-rendering:crisp-edges; }
.bubble{ position:absolute; z-index:10; width:max-content; max-width:min(280px, 80vw);
  background:var(--pa-bg); color:var(--pa-fg); border:2px solid var(--pa-border); border-radius:var(--pa-radius);
  box-shadow:var(--pa-shadow); padding:10px 12px; display:flex; flex-direction:column; gap:10px; font-size:14px;
  opacity:0; transform:translateY(6px); transition:opacity .18s ease, transform .18s ease; pointer-events:none; }
.bubble.show{ opacity:1; transform:none; pointer-events:auto; }
.bubble[data-pos="left"]{ right:calc(100% - var(--pa-u) * 9); top:calc(var(--pa-u) * 4); }
.bubble[data-pos="right"]{ left:100%; top:calc(var(--pa-u) * 4); }
.bubble[data-pos="top"]{ left:50%; bottom:calc(100% - var(--pa-u) * 4); transform:translate(-50%, 6px); }
.bubble[data-pos="top"].show{ transform:translate(-50%, 0); }
.title{ font-weight:700; font-size:15px; padding-right:18px; }
.note{ font-size:12px; color:var(--pa-muted); }
.row{ display:flex; gap:8px; flex-wrap:wrap; }
.btn{ font:inherit; font-size:13px; font-weight:600; cursor:pointer; color:var(--pa-fg); background:var(--pa-bg);
  border:2px solid var(--pa-border); border-radius:3px; padding:5px 10px; box-shadow:2px 2px 0 var(--pa-border); }
.btn.solid{ background:var(--pa-accent); color:var(--pa-accent-fg); border-color:var(--pa-accent); }
.btn:active{ transform:translate(2px,2px); box-shadow:none; }
.btn:focus-visible, input:focus-visible, .x:focus-visible{ outline:2px solid var(--pa-focus); outline-offset:2px; }
input{ font:inherit; font-size:14px; width:100%; color:var(--pa-fg); background:var(--pa-input-bg);
  border:2px solid var(--pa-border); border-radius:3px; padding:6px 8px; }
form{ display:flex; flex-direction:column; gap:8px; margin:0; }
.x{ position:absolute; top:4px; right:4px; font:inherit; font-size:16px; line-height:1; cursor:pointer;
  background:none; border:0; color:var(--pa-muted); padding:3px 5px; border-radius:3px; }
.links ::slotted(*){ font:inherit; font-size:13px; font-weight:600; color:var(--pa-fg); background:var(--pa-bg); text-decoration:none;
  border:2px solid var(--pa-border); border-radius:3px; padding:5px 10px; box-shadow:2px 2px 0 var(--pa-border); }
.links ::slotted(*:focus-visible){ outline:2px solid var(--pa-focus); outline-offset:2px; }
.links{ display:flex; gap:8px; flex-wrap:wrap; }
[hidden]{ display:none !important; }
.sr{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
@media (prefers-reduced-motion: reduce){ .bubble{ transition:none; } }
`;

// One constructable stylesheet shared by every instance. Adopted sheets are not subject to the
// page's style-src CSP, unlike a <style> tag injected into the shadow root. Created lazily so the
// module can be imported where CSSStyleSheet does not exist (Node, old browsers).
let SHEET = null;
function sheet(){
  if (!SHEET && typeof CSSStyleSheet === 'function'){
    try { SHEET = new CSSStyleSheet(); SHEET.replaceSync(STYLE); } catch (e) { SHEET = null; }
  }
  return SHEET;
}

const TEMPLATE = `
<div class="wrap" part="wrap">
  <div class="bubble" part="bubble" data-pos="left">
    <button class="x" type="button" part="close" aria-label="Close" hidden>×</button>
    <div class="title" part="title"></div>
    <div class="view say-view"><div class="note" part="note"></div></div>
    <div class="view menu-view row" part="menu">
      <button class="btn solid" type="button" data-act="ask" part="button button-ask"></button>
      <button class="btn" type="button" data-act="reach" part="button button-reach"></button>
    </div>
    <form class="view ask-view" part="ask-form">
      <label class="sr" for="q">Your question</label>
      <input id="q" name="q" type="text" autocomplete="off" maxlength="500" part="input">
      <div class="row"><button class="btn solid" type="submit" part="button button-send"></button></div>
    </form>
    <div class="view reach-view links" part="links"><slot name="links"></slot></div>
  </div>
  <button class="sprite" type="button" part="sprite"><canvas part="canvas"></canvas></button>
  <span class="sr" aria-live="polite"></span>
</div>`;

export class PixelAnirudhElement extends HTMLElement {
  static get observedAttributes(){ return ['scale','state','bubble-position','autoplay']; }

  constructor(){
    super();
    const root = this.attachShadow({ mode:'open' });
    root.innerHTML = TEMPLATE;
    const css = sheet();
    if (css && 'adoptedStyleSheets' in root) root.adoptedStyleSheets = [css];
    this.$ = {
      wrap: root.querySelector('.wrap'), bubble: root.querySelector('.bubble'), title: root.querySelector('.title'),
      note: root.querySelector('.note'), close: root.querySelector('.x'), sprite: root.querySelector('.sprite'),
      canvas: root.querySelector('canvas'), form: root.querySelector('form'), input: root.querySelector('input'),
      live: root.querySelector('[aria-live]'), links: root.querySelector('slot[name="links"]'),
      views: { say: root.querySelector('.say-view'), menu: root.querySelector('.menu-view'), ask: root.querySelector('.ask-view'), reach: root.querySelector('.reach-view') },
      askBtn: root.querySelector('[data-act="ask"]'), reachBtn: root.querySelector('[data-act="reach"]'), sendBtn: root.querySelector('[type="submit"]')
    };
    this._state = 'idle'; this._since = 0; this._tick = 0; this._queue = []; this._until = null;
    this._timer = null; this._visible = true; this._menu = null; this._lastActivity = Date.now();
    this._sleptAt = 0; this._hiddenAt = 0; this._nextSnack = 0; this._introDone = false;
    this._reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._onActivity = this._onActivity.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    this._onKey = this._onKey.bind(this);
    this._onDocPointer = this._onDocPointer.bind(this);
    this._step = this._step.bind(this);
  }

  // ---------- attributes ----------
  _attr(name){ const v = this.getAttribute(name); return v === null ? DEFAULTS[name] : v; }
  _num(name){ const n = Number(this._attr(name)); return Number.isFinite(n) ? n : Number(DEFAULTS[name]); }
  get state(){ return this._state; }
  set state(v){ this.play(v); }

  connectedCallback(){
    const $ = this.$;
    $.sprite.setAttribute('aria-label', this.getAttribute('label') || 'Pixel Anirudh. Open ask me anything and contact options.');
    $.askBtn.textContent = this._attr('ask-label');
    $.reachBtn.textContent = this._attr('reach-label');
    $.sendBtn.textContent = this._attr('send-label');
    $.input.placeholder = this._attr('ask-placeholder');
    $.bubble.dataset.pos = this._attr('bubble-position');
    $.sprite.addEventListener('click', () => (this._menu && this._menu !== 'say') ? this.close() : this.open());
    $.close.addEventListener('click', () => this.close());
    $.askBtn.addEventListener('click', () => this._showAsk());
    $.reachBtn.addEventListener('click', () => this._showReach());
    ['mouseenter','focus'].forEach(e => $.reachBtn.addEventListener(e, () => { if (this._menu === 'menu') this._set('reach'); }));
    ['mouseleave','blur'].forEach(e => $.reachBtn.addEventListener(e, () => { if (this._menu === 'menu') this._set('ask'); }));
    $.form.addEventListener('submit', (e) => { e.preventDefault(); this._submitAsk(); });
    $.links.addEventListener('slotchange', () => this._syncReach());
    this._syncReach();

    this._resize();
    this._dprWatch();
    window.addEventListener('pointermove', this._onActivity, { passive:true });
    window.addEventListener('pointerdown', this._onActivity, { passive:true });
    window.addEventListener('keydown', this._onActivity, { passive:true });
    window.addEventListener('scroll', this._onActivity, { passive:true });
    window.addEventListener('touchstart', this._onActivity, { passive:true });
    document.addEventListener('visibilitychange', this._onVisibility);
    document.addEventListener('keydown', this._onKey);
    document.addEventListener('pointerdown', this._onDocPointer);
    if ('IntersectionObserver' in window){
      this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; this._run(); });
      this._io.observe(this);
    }

    const fixed = this.getAttribute('state');
    if (this._reduce){ this._set(fixed && A.MOODS.includes(fixed) ? fixed : 'idle'); this._render(); return; }
    if (fixed && A.MOODS.includes(fixed) && !this.hasAttribute('autoplay')) this._set(fixed);
    else if (this.hasAttribute('autoplay') || !fixed) this.visit(false);
    this._render();
    this._run();
  }

  disconnectedCallback(){
    clearInterval(this._timer); this._timer = null;
    ['pointermove','pointerdown','keydown','scroll','touchstart'].forEach(e => window.removeEventListener(e, this._onActivity));
    document.removeEventListener('visibilitychange', this._onVisibility);
    document.removeEventListener('keydown', this._onKey);
    document.removeEventListener('pointerdown', this._onDocPointer);
    if (this._io) this._io.disconnect();
    if (this._dprMq) this._dprMq.removeEventListener('change', this._dprHandler);
  }

  attributeChangedCallback(name){
    if (!this.isConnected) return;
    if (name === 'scale') this._resize();
    if (name === 'bubble-position') this.$.bubble.dataset.pos = this._attr('bubble-position');
    if (name === 'state'){ const s = this.getAttribute('state'); if (s && A.MOODS.includes(s)) this.play(s); }
  }

  // ---------- public API ----------
  /** Play one state now. Holds until something else changes it. */
  play(state, ticks){
    if (!A.MOODS.includes(state)) throw new Error('Unknown state: ' + state);
    this._queue = []; this._until = null;
    if (ticks) this._run_steps([[state, ticks], ['work', 0]]); else this._set(state);
  }
  /** Run the arrival sequence: asleep, awake, hello with a greeting, then work. */
  visit(back){
    this._closeBubble();
    const greet = back ? this._attr('greeting-back') : this._attr('greeting');
    const steps = [
      ['sleep', 12],
      ['awake', 8],
      ['hello', 26, () => this._say(greet, this._attr('greeting-note'))],
      ['work', 0, () => { this._closeBubble(); this._introDone = true; this._lastActivity = Date.now(); this._planSnack(); }]
    ];
    if (back) steps.shift();              // already in bed: skip straight to waking up
    this._run_steps(steps);
  }
  /** Open the ask / reach out menu. */
  open(){
    this._queue = []; this._until = null; this._menu = 'menu';
    this._set('ask');
    this._view('menu', this._attr('menu-title'));
    this.dispatchEvent(new CustomEvent('open'));
    requestAnimationFrame(() => this.$.askBtn.focus({ preventScroll:true }));
  }
  /** Close the bubble and go back to work. */
  close(){
    const was = !!this._menu;
    this._closeBubble();
    if (was){ this._set('work'); this.$.sprite.focus({ preventScroll:true }); this.dispatchEvent(new CustomEvent('close')); }
  }
  /** Show a short message in the bubble, then hide it. */
  say(text, ms = 3000){
    this._say(text, '');
    clearTimeout(this._sayTimer);
    this._sayTimer = setTimeout(() => { if (this._menu === 'say') this._closeBubble(); }, ms);
  }

  // ---------- state machine ----------
  _set(s){
    if (this._state === 'sleep' && s !== 'sleep') this._sleptAt = 0;
    if (s === 'sleep') this._sleptAt = Date.now();
    const changed = s !== this._state;
    this._state = s; this._since = this._tick;
    if (changed) this.dispatchEvent(new CustomEvent('statechange', { detail:{ state:s } }));
    this._render();
  }
  _run_steps(steps){ this._queue = steps.slice(); this._next(); }
  _next(){
    const s = this._queue.shift(); if (!s){ this._until = null; return; }
    this._set(s[0]); if (s[2]) s[2]();
    this._until = s[1] ? this._tick + s[1] : null;
    if (this._reduce && s[1]) this._next();
  }
  _planSnack(){
    const every = this._num('snack-interval');
    this._nextSnack = every > 0 ? Date.now() + every * (0.75 + Math.random() * 0.5) : 0;
  }
  _step(){
    this._tick++;
    if (this._until !== null && this._tick >= this._until) this._next();
    const now = Date.now();
    if (this._state === 'work' && !this._menu && this._introDone){
      const idle = this._num('idle-sleep');
      if (idle > 0 && now - this._lastActivity > idle) this._set('sleep');
      else if (this._nextSnack && now > this._nextSnack){ this._run_steps([['eat', A.LOOPS.eat], ['work', 0, () => this._planSnack()]]); }
    }
    this._render();
  }
  _run(){
    const go = !this._reduce && this._visible && document.visibilityState !== 'hidden';
    if (go && !this._timer) this._timer = setInterval(this._step, TICK_MS);
    if (!go && this._timer){ clearInterval(this._timer); this._timer = null; }
  }

  // ---------- events ----------
  _onActivity(){
    this._lastActivity = Date.now();
    if (this._state === 'sleep' && this._introDone && !this._queue.length && this._until === null && this._sleptAt && Date.now() - this._sleptAt > WAKE_GRACE_MS) this.visit(true);
  }
  _onVisibility(){
    if (document.visibilityState === 'hidden'){ this._hiddenAt = Date.now(); }
    else if (this._hiddenAt){
      const away = Date.now() - this._hiddenAt, idle = this._num('idle-sleep');
      this._hiddenAt = 0; this._lastActivity = Date.now();
      if (this._introDone && idle > 0 && away > idle && !this._menu) this.visit(true);
    }
    this._run();
  }
  _onKey(e){ if (e.key === 'Escape' && this._menu && this._menu !== 'say') this.close(); }
  _onDocPointer(e){ if (this._menu && this._menu !== 'say' && !e.composedPath().includes(this)) this.close(); }

  // ---------- bubble ----------
  _view(name, title, note){
    const $ = this.$;
    Object.keys($.views).forEach(k => $.views[k].hidden = k !== name);
    $.title.textContent = title || '';
    $.note.textContent = note || '';
    $.views.say.hidden = !(name === 'say' && note);
    $.close.hidden = name === 'say';
    $.bubble.setAttribute('role', name === 'say' ? 'status' : 'dialog');
    $.bubble.setAttribute('aria-label', title || '');
    $.bubble.classList.add('show');
    $.live.textContent = title || '';
  }
  _say(title, note){ this._menu = 'say'; this._view('say', title, note); }
  _closeBubble(){ this._menu = null; this.$.bubble.classList.remove('show'); }
  _showAsk(){
    this._menu = 'ask'; this._set('ask');
    this._view('ask', this._attr('ask-title'));
    requestAnimationFrame(() => this.$.input.focus({ preventScroll:true }));
  }
  _showReach(){ this._menu = 'reach'; this._set('reach'); this._view('reach', this._attr('reach-title')); }
  _syncReach(){ this.$.reachBtn.hidden = this.$.links.assignedElements().length === 0; }
  _submitAsk(){
    const q = this.$.input.value.trim();
    if (!q){ this.$.input.focus(); return; }
    this.dispatchEvent(new CustomEvent('ask', { detail:{ question:q }, bubbles:true, composed:true }));
    this.$.input.value = '';
    this._closeBubble();
    this._say(this._attr('thanks-text'), '');
    this._run_steps([['hello', 20], ['work', 0, () => { if (this._menu === 'say') this._closeBubble(); }]]);
  }

  // ---------- rendering ----------
  _resize(){
    const dpr = window.devicePixelRatio || 1, scale = Math.max(1, Math.round(this._num('scale')));
    const px = Math.max(1, Math.round(scale * dpr));             // whole device pixels per art pixel
    const c = this.$.canvas;
    c.width = A.W * px; c.height = A.H * px;
    c.style.width = (A.W * px / dpr) + 'px'; c.style.height = (A.H * px / dpr) + 'px';
    this._px = px;
    this.$.wrap.style.setProperty('--pa-u', (px / dpr) + 'px');
    this._render();
  }
  _dprWatch(){
    if (typeof matchMedia !== 'function') return;
    if (this._dprMq) this._dprMq.removeEventListener('change', this._dprHandler);
    this._dprMq = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this._dprHandler = () => { this._resize(); this._dprWatch(); };
    this._dprMq.addEventListener('change', this._dprHandler);
  }
  _render(){
    const c = this.$.canvas, ctx = c.getContext('2d');
    if (!ctx || !this._px) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    A.draw(ctx, this._state, this._tick - this._since, this._px);
  }
}

if (!customElements.get('pixel-anirudh')) customElements.define('pixel-anirudh', PixelAnirudhElement);
export default PixelAnirudhElement;
