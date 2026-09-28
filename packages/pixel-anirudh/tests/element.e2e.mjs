// Browser checks for the <pixel-anirudh> element. Needs Playwright:
//   npm i -D playwright && npx playwright install chromium
//   npm run test:e2e
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

let chromium;
try { ({ chromium } = await import('playwright')); } catch { /* optional */ }
const DEMO = new URL('../demo/index.html', import.meta.url).href;
const T = 125;
const skip = !chromium && 'playwright is not installed';

async function open(browser, opts = {}){
  const ctx = await browser.newContext({ deviceScaleFactor: opts.dpr || 1, reducedMotion: opts.reduce ? 'reduce' : 'no-preference', viewport:{ width:1000, height:700 } });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.clock.install();
  await page.goto(DEMO);
  return { ctx, page, errors };
}
const state = (page) => page.$eval('pixel-anirudh', el => el.state);
const bubbleShown = (page) => page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('.bubble').classList.contains('show'));
const bubbleTitle = (page) => page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('.title').textContent);

test('element', { skip }, async (t) => {
  const browser = await chromium.launch();
  try {
    await t.test('visit: asleep, awake, hello with greeting, then work', async () => {
      const { ctx, page, errors } = await open(browser);
      assert.equal(await state(page), 'sleep');
      await page.clock.runFor(13 * T); assert.equal(await state(page), 'awake');
      await page.clock.runFor(8 * T);  assert.equal(await state(page), 'hello');
      assert.ok(await bubbleShown(page)); assert.match(await bubbleTitle(page), /Anirudh/);
      await page.clock.runFor(27 * T); assert.equal(await state(page), 'work');
      assert.ok(!(await bubbleShown(page)));
      assert.deepEqual(errors, []);
      await ctx.close();
    });

    for (const dpr of [1, 1.25, 2, 3]){
      await t.test(`crisp at devicePixelRatio ${dpr}: whole device pixels, no soft edges`, async () => {
        const { ctx, page } = await open(browser, { dpr });
        const r = await page.$eval('pixel-anirudh', el => {
          const c = el.shadowRoot.querySelector('canvas'), b = c.getBoundingClientRect();
          const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          let soft = 0; for (let i = 3; i < d.length; i += 4) if (d[i] !== 0 && d[i] !== 255) soft++;
          const px = c.width / 50, cells = new Set(); let mixed = 0;
          for (let y = 0; y < 64; y++) for (let x = 0; x < 50; x++){
            const at = (xx, yy) => { const i = ((yy) * c.width + xx) * 4; return d[i] + ',' + d[i+1] + ',' + d[i+2] + ',' + d[i+3]; };
            const a = at(x*px, y*px), z = at(x*px + px - 1, y*px + px - 1);
            if (a !== z) mixed++;
          }
          return { w:c.width, h:c.height, cssW:b.width, soft, mixed, px };
        });
        const px = Math.round(4 * dpr);
        assert.equal(r.w, 50 * px); assert.equal(r.h, 64 * px);
        assert.ok(Math.abs(r.cssW * dpr - r.w) < 0.01, 'one canvas pixel per device pixel');
        assert.equal(r.soft, 0, 'no partially transparent pixels');
        assert.equal(r.mixed, 0, 'every art pixel is one solid block');
        await ctx.close();
      });
    }

    await t.test('click opens the menu; reach hover; ask sends an event; Escape closes', async () => {
      const { ctx, page } = await open(browser);
      await page.clock.runFor(60 * T);
      await page.click('pixel-anirudh');
      assert.equal(await state(page), 'ask'); assert.ok(await bubbleShown(page));
      const reach = page.locator('pixel-anirudh').locator('[data-act="reach"]');
      await reach.hover(); assert.equal(await state(page), 'reach');
      await page.locator('pixel-anirudh').locator('[data-act="ask"]').click();
      assert.equal(await state(page), 'ask');
      await page.evaluate(() => { window.__q = null; document.getElementById('me').addEventListener('ask', e => { window.__q = e.detail.question; }); });
      await page.locator('pixel-anirudh').locator('input').fill('What are you building?');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => window.__q), 'What are you building?');
      assert.equal(await state(page), 'hello');
      await page.clock.runFor(21 * T); assert.equal(await state(page), 'work');
      await page.click('pixel-anirudh'); assert.ok(await bubbleShown(page));
      await page.keyboard.press('Escape'); assert.ok(!(await bubbleShown(page))); assert.equal(await state(page), 'work');
      await ctx.close();
    });

    await t.test('reach out shows the slotted links', async () => {
      const { ctx, page } = await open(browser);
      await page.clock.runFor(60 * T);
      await page.click('pixel-anirudh');
      await page.locator('pixel-anirudh').locator('[data-act="reach"]').click();
      assert.equal(await state(page), 'reach');
      assert.ok(await page.locator('pixel-anirudh a[slot="links"]').first().isVisible());
      await ctx.close();
    });

    await t.test('reach out button hides when no links are provided', async () => {
      const { ctx, page } = await open(browser);
      await page.evaluate(() => document.querySelectorAll('a[slot="links"]').forEach(a => a.remove()));
      await page.clock.runFor(T);
      const hidden = await page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('[data-act="reach"]').hidden);
      assert.equal(hidden, true);
      await ctx.close();
    });

    await t.test('naps when the visitor goes idle, wakes and says welcome back on activity', async () => {
      const { ctx, page } = await open(browser);
      await page.$eval('pixel-anirudh', el => el.setAttribute('idle-sleep', '4000'));
      await page.clock.runFor(48 * T); assert.equal(await state(page), 'work');
      await page.clock.runFor(5000); assert.equal(await state(page), 'sleep');
      await page.clock.runFor(3000);
      await page.mouse.move(200, 200); await page.mouse.move(260, 240);
      assert.equal(await state(page), 'awake');
      await page.clock.runFor(9 * T); assert.equal(await state(page), 'hello');
      assert.match(await bubbleTitle(page), /welcome back/i);
      await ctx.close();
    });

    await t.test('takes a pizza break while working', async () => {
      const { ctx, page } = await open(browser);
      await page.$eval('pixel-anirudh', el => { el.setAttribute('snack-interval', '2000'); el.setAttribute('idle-sleep', '0'); });
      await page.clock.runFor(48 * T);
      await page.clock.runFor(3000);
      assert.equal(await state(page), 'eat');
      await page.clock.runFor(73 * T); assert.equal(await state(page), 'work');
      await ctx.close();
    });

    await t.test('reduced motion: static idle frame, no timer, menu still works', async () => {
      const { ctx, page } = await open(browser, { reduce:true });
      assert.equal(await state(page), 'idle');
      const before = await page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('canvas').toDataURL());
      await page.clock.runFor(5000);
      const after = await page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('canvas').toDataURL());
      assert.equal(before, after);
      await page.click('pixel-anirudh'); assert.equal(await state(page), 'ask');
      await ctx.close();
    });

    await t.test('keyboard: the sprite is a focusable button with a label', async () => {
      const { ctx, page } = await open(browser);
      const label = await page.$eval('pixel-anirudh', el => el.shadowRoot.querySelector('.sprite').getAttribute('aria-label'));
      assert.match(label, /Anirudh/);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      assert.equal(await state(page), 'ask');
      await ctx.close();
    });
  } finally { await browser.close(); }
});
