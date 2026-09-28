# Pixel Anirudh: website handoff (v1.3.0)

A full-body pixel companion for the personal site. It is a plain web component with no dependencies, so it works in plain HTML, Next.js, Astro or anything else that renders HTML.

## What it does on the site

| Moment | State | What you see |
|---|---|---|
| Page opens | `sleep` | In bed, head on the pillow, blanket breathing, Zs drifting up (1.5 s) |
| Visitor is here | `awake` | Eyes pop open, jolt, "!" (1 s) |
| Greeting | `hello` | Arm up, open-palm wave, grin, bubble: "Hey! I’m Anirudh." (3.25 s) |
| After that | `work` | Seated at the desk, typing on the laptop, coffee mug, code sparks |
| Every ~45 s of work | `eat` | Pizza break: raise, bite, chew, slice shrinks (9 s) |
| Visitor idle for 60 s | `sleep` | Back to bed. Any mouse, key, scroll or touch wakes him: `awake`, then `hello` with "Oh hey, welcome back!" |
| Tab hidden longer than 60 s | `awake` then `hello` | Same welcome back when the visitor returns |
| Click or Enter on him | `ask` | Palm out, bobbing "?", bubble with **Ask me anything** and **Reach out** |
| Hover or focus Reach out | `reach` | Holds up a sealed envelope. Click shows your links |
| Question sent | `hello`, then `work` | Fires an `ask` event with the question and thanks the visitor |
| Reduced motion | `idle` | One still frame, no timers. The menu still works |

`idle` (standing, soft smile, hand in pocket) is also used for stills and the reduced motion fallback.

### Timeline poses (v1.3)

Held with the `state` attribute, for example on the experience scrubber. Each is a 48-frame loop at 8 fps.

| State | What you see |
|---|---|
| `plant` | Holds a small terracotta pot with a green sprout; the leaves sway |
| `lift` | Gym clothes, barbell at shoulder height; the bar bobs, a sweat drop comes and goes |
| `lab` | White lab coat, ID badge, pen, clear safety glasses; the lens glint slides |
| `celebrate` | The hello wave with confetti drifting down |
| `read` | Holds a blue book at chest height; the book dips now and then |

Their frames are checked pixel for pixel against the approved sheets in `assets/sheets/` (`tests/poses.test.mjs`).

## Quick start

Copy `dist/pixel-anirudh.js` into the site's public folder, then:

```html
<pixel-anirudh autoplay scale="4">
  <a slot="links" href="mailto:YOU@EXAMPLE.COM">Email</a>
  <a slot="links" href="https://www.linkedin.com/in/YOUR-HANDLE" target="_blank" rel="noopener">LinkedIn</a>
  <a slot="links" href="https://github.com/YOUR-HANDLE" target="_blank" rel="noopener">GitHub</a>
</pixel-anirudh>
<script src="/pixel-anirudh.js" defer></script>
```

The **Reach out** button only appears when at least one `slot="links"` child exists. The links in `demo/index.html` are placeholders.

### ES module

```js
import 'pixel-anirudh/element';          // or './src/element.mjs'; defines <pixel-anirudh>
import PixelAnirudh from 'pixel-anirudh'; // engine only, if you want to draw frames yourself
```

### Next.js (App Router)

The element touches `window`, so load it on the client only:

```jsx
'use client';
import { useEffect } from 'react';
export default function Companion(){
  useEffect(() => { import('pixel-anirudh/element'); }, []);
  return (
    <pixel-anirudh autoplay scale="4">
      <a slot="links" href="mailto:YOU@EXAMPLE.COM">Email</a>
    </pixel-anirudh>
  );
}
```

For TypeScript, add `declare namespace JSX { interface IntrinsicElements { 'pixel-anirudh': any } }` in a `.d.ts` file. React 19 passes custom element events through `onask` and `onstatechange`. On React 18, attach them with a ref and `addEventListener`.

### Astro

```astro
<pixel-anirudh autoplay scale="4"><a slot="links" href="mailto:YOU@EXAMPLE.COM">Email</a></pixel-anirudh>
<script>import 'pixel-anirudh/element';</script>
```

## API

### Attributes

| Attribute | Default | Notes |
|---|---|---|
| `autoplay` | off | Runs the visit sequence on load. Without it and without `state`, it also autoplays |
| `state` | none | Hold one state: `idle sleep awake hello work eat ask reach plant lift lab celebrate read` |
| `scale` | `4` | Whole number. Art is 50 x 64, so scale 4 is 200 x 256 CSS px |
| `bubble-position` | `left` | `left`, `right` or `top`. Where the speech bubble opens |
| `idle-sleep` | `60000` | ms without visitor activity before he naps. `0` turns it off |
| `snack-interval` | `45000` | Average ms of work between pizza breaks (±25% jitter). `0` turns it off |
| `greeting` | `Hey! I’m Anirudh.` | First greeting |
| `greeting-back` | `Oh hey, welcome back!` | Greeting after a nap |
| `greeting-note` | `Click me if you want to ask something.` | Small line under the greeting |
| `menu-title`, `ask-label`, `reach-label`, `ask-title`, `ask-placeholder`, `send-label`, `reach-title`, `thanks-text` | see `src/element.mjs` | All bubble copy is overridable |
| `label` | `Pixel Anirudh. Open ask me anything and contact options.` | Accessible name of the button |

### Events

| Event | `detail` | When |
|---|---|---|
| `ask` | `{ question }` | The visitor submits a question. Wire it to your inbox, a form endpoint or an AI answer |
| `statechange` | `{ state }` | Every state change |
| `open`, `close` | none | The menu opens or closes |

```js
document.querySelector('pixel-anirudh').addEventListener('ask', async (e) => {
  await fetch('/api/ask', { method:'POST', body: JSON.stringify({ q: e.detail.question }) });
});
```

### Methods and properties

`el.visit(back)`, `el.play(state, ticks?)`, `el.open()`, `el.close()`, `el.say(text, ms = 3000)`, `el.state`.

### Styling

The bubble uses the site font by default and follows light and dark mode. Override these on the element:

```css
pixel-anirudh{
  --pa-font: "Your Font", system-ui, sans-serif;
  --pa-bg:#fff; --pa-fg:#1E1B2B; --pa-muted:#6F6A73; --pa-border:#1E1B2B;
  --pa-accent:#1E1B2B; --pa-accent-fg:#fff; --pa-input-bg:#F3F0EA;
  --pa-radius:4px; --pa-shadow:4px 4px 0 var(--pa-border); --pa-focus:#2E5AAC;
}
pixel-anirudh::part(bubble){ /* anything else */ }
```

Parts: `wrap bubble title note menu button button-ask button-reach button-send ask-form input links close sprite canvas`.

## Why it stays sharp

- The canvas backing store is sized in whole **device** pixels per art pixel (`round(scale × devicePixelRatio)`) and its CSS size is set so one canvas pixel lands on exactly one screen pixel. It stays crisp at DPR 1, 1.25, 1.5, 2 and 3, and it re-sizes when the window moves between screens.
- Every art pixel is painted as one solid rectangle, with smoothing off, no transforms, no CSS scaling and no partial alpha.
- Every shape has a 1 px outline in `#1E1B2B`. Props that cross the body (laptop, hands, pizza, mug, envelope, chair) get their own outline so nothing bleeds into the jacket.
- Tests enforce all of this for every frame (see below).
- Don't put the element inside anything with `transform: scale()` or a fractional `zoom`. That is the one thing that can blur it.

## Performance

One 8 fps timer, only while the element is on screen and the tab is visible (IntersectionObserver plus `visibilitychange`). A frame is at most about 3,200 `fillRect` calls. There are no network requests and no images.

## Tests

```bash
npm test            # pixel tests, Node only, no install needed
npm i -D playwright && npx playwright install chromium
npm run test:e2e    # browser tests for the element
npm run test:all    # build, then both
```

`tests/sprite.test.mjs` checks every frame of every state:

- the palette is valid
- nothing touches the canvas edge, effects included
- every silhouette edge is outlined
- there are no isolated pixels, no stray or doubled outline dots and no partial alpha
- loops are seamless, and `awake` settles and holds
- the ESM and CommonJS builds match
- `draw()` paints only whole, non-overlapping device pixels
- the frames match `tests/golden.json`
- the timeline poses match their approved sheets pixel for pixel (`tests/poses.test.mjs`)

`tests/element.e2e.mjs` runs the visit sequence with a fake clock and checks:

- crispness at DPR 1, 1.25, 2 and 3 by reading back canvas pixels
- the menu, the hover on Reach out, the `ask` event, Escape, the slotted links and the hidden Reach out button
- napping and waking, the pizza break, reduced motion and keyboard access

## Changing the art

1. Edit `src/engine.js`, the only source of truth for the art.
2. `npm run build` regenerates `src/engine.mjs` and `dist/pixel-anirudh.js`.
3. `npm test`. When the golden test fails after an intentional change, review the frames and then run `npm run golden`.
4. `npm run export` regenerates GIFs, PNGs and sprite sheets into `assets/export` (needs Python and Pillow).

## Files

```
src/engine.js          art + renderer (CommonJS / global). Edit this one
src/engine.mjs         generated ES module
src/element.mjs        <pixel-anirudh> web component
dist/pixel-anirudh.js  generated single-file bundle for a <script> tag
demo/index.html        standalone demo (open it directly in a browser)
tests/                 pixel tests, browser tests, golden hashes
scripts/               build, golden update, asset export
assets/sheets/         1x sprite sheets per state + frames.json (timeline pose sheets are the approved references)
assets/fallback/       idle still at 4x and 8x (for <noscript> or social previews)
```
