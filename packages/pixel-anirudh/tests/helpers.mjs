import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
export const A = require('../src/engine.js');

/** Frame as one string of palette keys ('.' = empty), rows joined with '\n'. */
export function frameKey(engine, mood, t, opts){
  return engine.build(mood, t, opts).c.map(r => r.map(c => c || '.').join('')).join('\n');
}
export const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
/** Every tick worth checking for a state: one full loop, or the settle window for the one-shot. */
export function ticksFor(mood){ const n = mood === 'awake' ? 12 : A.LOOPS[mood]; return [...Array(n).keys()]; }
