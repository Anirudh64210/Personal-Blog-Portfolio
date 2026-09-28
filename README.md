# https://www.saianirudh.blog

Personal site and blog of Sai Anirudh Siddi. Astro 7, fully static, deployed on Vercel.
Design: "Pixel Desk" (cream paper, 2px ink outlines, hard shadows), light and dark themes.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # serve ./dist locally
```

> If the repo lives in a folder whose path contains a colon (for example `portfolio:blog`),
> `npm run` cannot find the `astro` binary, because `:` separates entries in `PATH`.
> Rename the folder, or run `./node_modules/.bin/astro dev` directly.

## Write a post (the site grows by itself)

1. Copy `docs/post-template.md` to `src/content/blog/your-slug.md`. The file name is the URL: `/blog/your-slug`.
2. Fill in the frontmatter. Required: `title`, `description`, `category`, `planted`.
3. `npm run dev` and check it. Then push; Vercel rebuilds.

Nothing else to edit. The new post automatically updates the home LATEST card, the side list,
the archive by year, the category chips and counts, `/blog`, `/search.json`, `/rss.xml` and `/sitemap.xml`.

Frontmatter reference:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Sentence case |
| `description` | yes | Dek, meta description, card blurb and search snippet |
| `category` | yes | `Interpretability`, `LLMs`, `ML`, `Toki` or `Building` (add more in `src/content.config.ts` and `src/config.ts`) |
| `planted` | yes | Publish date `YYYY-MM-DD`; drives the order |
| `tended` | no | Last meaningful update |
| `tldr` | no | Renders the TL;DR box |
| `series` | no | `{ name, part }`; gives prev and next inside the series |
| `topic` | no | Short subtitle, used by search |
| `backlinkLabel`, `backlinkHref` | no | "From project" link in the post rail |
| `ogImage` | no | Share image in `public/og/` (1200x630) |
| `draft` | no | `true` keeps it out of the build |

Markdown extras:
- `> [!POINT]` on the first line of a blockquote turns it into the "main point" pull quote. One per post; the build fails if there are two.
- `## Headings` become the "On this page" list.
- Fenced code blocks get a language label and a COPY button.
- External links open in a new tab automatically.

House rule: no em dashes or en dashes anywhere. SmartyPants is set so `--` never turns into one.

## Where things live

| What | Where |
|---|---|
| All site copy (hero, terminal, projects, wins, experience timeline, résumé) | `src/config.ts` |
| Design tokens, light and dark | `src/styles/tokens.css` |
| Site styles | `src/styles/site.css` |
| Pages | `src/pages/` (`index`, `blog/index`, `blog/[...slug]`, `experience`, `resume`, `404`, feeds) |
| Markdown plugins | `src/lib/markdown.mjs` |
| Pixel companion (web component, art engine, tests) | `packages/pixel-anirudh/` |
| Résumé PDF | `public/resume/Sai_Anirudh_Siddi_Resume.pdf` (keep `/resume` in `src/config.ts` in sync) |

## Security and privacy

- No secrets anywhere: the site is fully static, with no API keys, env vars or backend. Keep it that way;
  `.gitignore` blocks `.env*`, `*.pem` and `*.key` just in case.
- `/privacy` describes exactly what the site does (cookie-free Vercel Web Analytics, a local `theme`
  preference). Update it in the same change if that ever changes.
- The web résumé omits phone and GPA. The PDF keeps both, and is served with `X-Robots-Tag: noindex`
  so search engines index the HTML résumé instead.
- The companion's "Ask me anything" box is hidden (it has no backend). Wire its `ask` event to something
  real before showing it again.
- `/.well-known/security.txt` gives a contact for security reports; renew its `Expires` date yearly.
- `npm audit` is clean; run it before publishing.

- CSP is emitted as a meta tag (see `astro.config.mjs`). Astro hashes bundled scripts; the inline
  no-flash theme script is hashed from `src/lib/theme-script.mjs`. No `'unsafe-inline'`.
- No inline `style=""` attributes (the CSP would block them). Dynamic values go through
  `el.style.setProperty` from JS.
- Fonts are self-hosted (`@fontsource`), so the CSP has no third-party hosts.
- Security headers live in `vercel.json`.

## Companion package

`packages/pixel-anirudh` holds the pixel companion. Its `src/engine.js` is the only source of the art.

```bash
cd packages/pixel-anirudh
node scripts/build.mjs          # regenerate engine.mjs and dist/
node --test tests/sprite.test.mjs tests/poses.test.mjs
```
