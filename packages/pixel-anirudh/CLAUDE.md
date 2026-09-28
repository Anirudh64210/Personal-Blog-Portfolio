# CLAUDE.md: pixel-anirudh

Notes for a Claude session that integrates this package into the personal website repo.

## Ground rules
- `src/engine.js` is the only source of the art. Never hand-edit `src/engine.mjs` or `dist/pixel-anirudh.js`; run `npm run build`.
- The art is final and approved. Don't redraw, recolor or "improve" pixels unless Anirudh asks. If he asks, run `npm test` after every change and show him the frames before running `npm run golden`.
- Keep it crisp: never wrap the element in CSS `transform: scale()`, `zoom`, or a width/height that is not the size the element sets for itself. Change size only with the `scale` attribute (whole numbers).
- No em dashes or en dashes in any copy you write for him.

## Integration checklist
1. Copy this folder into the repo (for example `packages/pixel-anirudh` or `lib/pixel-anirudh`), or copy `dist/pixel-anirudh.js` into the public folder.
2. Place `<pixel-anirudh autoplay scale="4">` in the hero, usually bottom-right of the intro block. Pick `bubble-position` so the bubble opens over empty space (`left` when he sits on the right edge).
3. Add the real links as `slot="links"` children (Email, LinkedIn, GitHub). Ask Anirudh for the exact URLs; don't guess them.
4. Wire the `ask` event (`e.detail.question`) to whatever he chooses: email, form endpoint, or an AI answer. Until then, keep the default thank-you.
5. Match the bubble to the site with the `--pa-*` CSS variables (font, colors). Check light and dark mode.
6. On narrow screens, try `scale="3"` and `bubble-position="top"`.
7. Run `npm test` and `npm run test:e2e` (needs Playwright) before shipping.

## Behavior summary
sleep (1.5 s) → awake (1 s) → hello with greeting (3.25 s) → work. Pizza break about every 45 s. Naps after 60 s of visitor inactivity and says "welcome back" on return. Click opens Ask me anything / Reach out. Reduced motion shows a still `idle` frame.
