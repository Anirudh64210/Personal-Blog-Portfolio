// Pixel-level checks for every frame of every state. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { A, frameKey, hash, ticksFor } from './helpers.mjs';
import ESM from '../src/engine.mjs';

const N4 = [[1,0],[-1,0],[0,1],[0,-1]];
const each = (fn) => { for (const m of A.MOODS) for (const t of ticksFor(m)) fn(m, t); };
const grid = (m, t, opts) => A.build(m, t, opts).c;
const at = (g, x, y) => (g[y] && g[y][x]) || null;

// The timeline poses (v1.3) are approved art, verified pixel identical to the approved sheets in
// poses.test.mjs. A few of their pixels break the strict rules below by design (the cut where the
// envelope was, the ink rings on the barbell plates, the book edge). Those exact pixels are listed
// here; any other pixel, and every pixel of the original eight states, is still checked.
const APPROVED = {
  plant: { unoutlined: '34,18 34,19', stray: '36,23 43,23', floating: '36,23 42,23 43,23' },
  lift: { unoutlined: '30,41 31,41', isolated: '14,29',
    floating: '7,27 8,27 41,27 42,27 8,28 41,28 8,29 41,29 8,34 41,34 8,35 41,35 7,36 8,36 41,36 42,36 7,28 42,28 8,30 41,30 7,37 8,37 41,37 42,37' },
  read: { isolated: '33,34', floating: '30,27 33,30 33,31 33,32 34,34' },
};
const ok = (m, rule, x, y) => ((APPROVED[m] || {})[rule] || '').split(' ').includes(x + ',' + y);

test('public API', () => {
  assert.match(A.VERSION, /^\d+\.\d+\.\d+$/);
  assert.equal(A.W, 50); assert.equal(A.H, 64);
  assert.deepEqual(A.MOODS, ['idle','sleep','awake','hello','work','eat','ask','reach','plant','lift','lab','celebrate','read']);
  for (const m of A.MOODS) assert.ok(A.LOOPS[m] > 0, `loop length for ${m}`);
  ['build','draw','paint','rgba'].forEach(f => assert.equal(typeof A[f], 'function'));
});

test('palette: valid hex colors, every key used in a frame is defined', () => {
  for (const [k, v] of Object.entries(A.PAL)) assert.match(v, /^#[0-9A-F]{6}$/i, `color ${k}`);
  each((m, t) => grid(m, t, { noFx:true }).forEach((row, y) => row.forEach((c, x) => {
    if (c) assert.ok(c in A.PAL, `${m} t${t}: unknown key ${c} at ${x},${y}`);
  })));
});

test('bounds: nothing touches the canvas edge, including effects', () => {
  each((m, t) => grid(m, t).forEach((row, y) => row.forEach((c, x) => {
    if (c) assert.ok(x > 0 && y > 0 && x < A.W - 1 && y < A.H - 1, `${m} t${t}: pixel on edge at ${x},${y}`);
  })));
});

test('silhouette: every pixel that meets empty space is outline', () => {
  each((m, t) => { const g = grid(m, t, { noFx:true });
    g.forEach((row, y) => row.forEach((c, x) => {
      if (!c || c === 'o') return;
      if (ok(m, 'unoutlined', x, y)) return;
      for (const [dx, dy] of N4) assert.ok(at(g, x+dx, y+dy), `${m} t${t}: unoutlined edge at ${x},${y}`);
    }));
  });
});

test('no isolated pixels and no stray outline dots', () => {
  each((m, t) => { const g = grid(m, t, { noFx:true });
    g.forEach((row, y) => row.forEach((c, x) => {
      if (!c) return;
      const n = N4.map(([dx, dy]) => at(g, x+dx, y+dy));
      if (c !== 'o') assert.ok(ok(m, 'isolated', x, y) || n.some(v => v && v !== 'o'), `${m} t${t}: isolated ${c} at ${x},${y}`);
      else assert.ok(ok(m, 'stray', x, y) || n.some(v => v && v !== 'o') || n.filter(v => v === 'o').length >= 2, `${m} t${t}: stray outline at ${x},${y}`);
    }));
  });
});

test('outline is never thicker than it needs to be (no outline pixel floats outside the silhouette)', () => {
  each((m, t) => { const g = grid(m, t, { noFx:true });
    g.forEach((row, y) => row.forEach((c, x) => {
      if (c !== 'o') return;
      if (!N4.some(([dx, dy]) => !at(g, x+dx, y+dy))) return;   // interior dark pixels are part of the art (hair)
      if (ok(m, 'floating', x, y)) return;
      const near = [];
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (dx || dy) near.push(at(g, x+dx, y+dy));
      assert.ok(near.some(v => v && v !== 'o'), `${m} t${t}: outline pixel with no art around it at ${x},${y}`);
    }));
  });
});

test('loops are seamless: frame t equals frame t + loop length', () => {
  for (const m of A.MOODS){ if (m === 'awake') continue;
    for (let t = 0; t < A.LOOPS[m] * 2; t++) assert.equal(frameKey(A, m, t), frameKey(A, m, t + A.LOOPS[m]), `${m} breaks at t${t}`);
  }
});

test('awake is a one-shot that settles and holds', () => {
  const last = frameKey(A, 'awake', 3);
  for (let t = 3; t < 200; t += 7) assert.equal(frameKey(A, 'awake', t), last);
});

test('every state actually animates', () => {
  for (const m of A.MOODS){
    const seen = new Set(ticksFor(m).map(t => frameKey(A, m, t)));
    assert.ok(seen.size >= 2, `${m} has only one frame`);
  }
});

test('deterministic, and the ES module build matches the CommonJS build', () => {
  each((m, t) => {
    const a = frameKey(A, m, t);
    assert.equal(a, frameKey(A, m, t), `${m} t${t} not deterministic`);
    assert.equal(a, frameKey(ESM, m, t), `${m} t${t} differs between engine.js and engine.mjs`);
  });
});

test('draw() only paints whole, non-overlapping device pixels at the requested scale', () => {
  for (const scale of [1, 3, 4, 7]){
    const rects = [];
    const ctx = { set fillStyle(v){ this._c = v; }, get fillStyle(){ return this._c; }, fillRect(x, y, w, h){ rects.push([x, y, w, h]); } };
    A.draw(ctx, 'hello', 0, scale);
    const seen = new Set();
    for (const [x, y, w, h] of rects){
      assert.ok(Number.isInteger(x) && Number.isInteger(y), 'integer position');
      assert.equal(w, scale); assert.equal(h, scale);
      assert.equal(x % scale, 0); assert.equal(y % scale, 0);
      const k = x + ',' + y; assert.ok(!seen.has(k), 'overlap at ' + k); seen.add(k);
    }
    assert.ok(rects.length > 500);
  }
});

test('rgba() is fully opaque or fully transparent (no soft edges)', () => {
  each((m, t) => {
    const px = A.rgba(m, t);
    assert.equal(px.length, A.W * A.H * 4);
    for (let i = 3; i < px.length; i += 4) assert.ok(px[i] === 0 || px[i] === 255, `${m} t${t}: partial alpha`);
  });
});

test('golden frames match (run "npm run golden" only after reviewing an intentional art change)', () => {
  const golden = JSON.parse(readFileSync(new URL('./golden.json', import.meta.url), 'utf8'));
  for (const m of A.MOODS) assert.deepEqual(ticksFor(m).map(t => hash(frameKey(A, m, t))), golden.frames[m], `${m} frames changed`);
});
