// The timeline poses must match the approved sheets frame for frame. Run: npm test
// Sheets are 1x strips of 50 x 64 frames (assets/sheets/<state>.png), 125 ms per frame.
import test from 'node:test';
import assert from 'node:assert/strict';
import { A } from './helpers.mjs';
import { decodePNG } from './png.mjs';

const NEW = ['plant', 'lift', 'lab', 'celebrate', 'read'];
const sheet = (m) => decodePNG(new URL(`../assets/sheets/${m}.png`, import.meta.url));

function diff(m, s, t){
  const px = A.rgba(m, t);
  for (let y = 0; y < A.H; y++) for (let x = 0; x < A.W; x++){
    const i = (y * A.W + x) * 4, j = (y * s.width + t * A.W + x) * 4;
    if (px[i + 3] === 0 && s.data[j + 3] === 0) continue;
    for (let k = 0; k < 4; k++) if (px[i + k] !== s.data[j + k]) return `${m} t${t}: pixel ${x},${y} differs`;
  }
  return null;
}

test('png decoder sanity: the existing sheets equal rgba()', () => {
  for (const m of ['idle', 'sleep', 'awake', 'hello', 'work', 'eat', 'ask', 'reach']){
    const s = sheet(m);
    for (let t = 0; t < s.width / A.W; t++) assert.equal(diff(m, s, t), null);
  }
});

test('new poses match the approved 48-frame sheets pixel for pixel', () => {
  for (const m of NEW){
    const s = sheet(m);
    assert.equal(s.width, A.W * 48, `${m} sheet has 48 frames`);
    assert.equal(A.LOOPS[m], 48, `${m} loops every 48 ticks`);
    for (let t = 0; t < 48; t++) assert.equal(diff(m, s, t), null);
  }
});

test('new poses use only the outline ink #1E1B2B for outlines', () => {
  assert.equal(A.PAL.o, '#1E1B2B');
  for (const m of NEW) for (let t = 0; t < 48; t++)
    A.build(m, t, { noFx: true }).c.forEach(r => r.forEach(c => { if (c) assert.ok(c in A.PAL, `${m} t${t}: unknown key ${c}`); }));
});
