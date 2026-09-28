// Regenerates tests/golden.json after an intentional art change. Review the art first!
// Run: npm run golden
import { writeFileSync } from 'node:fs';
import { A, frameKey, hash, ticksFor } from '../tests/helpers.mjs';
const out = { version: A.VERSION, frames: {} };
for (const m of A.MOODS) out.frames[m] = ticksFor(m).map(t => hash(frameKey(A, m, t)));
writeFileSync(new URL('../tests/golden.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log('wrote tests/golden.json');
