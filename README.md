# Sai Anirudh Siddi — portfolio & blog

Dark, grainy "dossier" portfolio built with **Astro** (static output). One scrolling
homepage + an SEO-optimized blog where every Markdown file becomes its own page.

## Edit your site

**All homepage content lives in `src/config.ts`** — name, tagline, terminal lines,
facts, socials, press links, projects, experience, education, skills. Edit that one
file and rebuild.

- **Projects** (`projects` array): each card links to `repo` (its GitHub URL).
  Replace the placeholder `repo` values with your real repos.
- **Socials / email**: `socials` + `site.email`.
- **Your domain**: set it in **three** places when you have one —
  `astro.config.mjs` (`site`), `src/config.ts` (`site.url`), and `public/robots.txt`.

## Add a blog post (the pipeline)

1. Create a file: `src/content/blog/my-post-slug.md`
   The filename (minus `.md`) becomes the URL: `/blog/my-post-slug`.
2. Add frontmatter at the top:

```md
---
title: "Your post title"
description: "1–2 sentences. Shows in Google results, OG cards, and the RSS feed."
topic: "interpretability · probes"   # the small decoding label on the page
planted: 2026-06-01                  # first published (YYYY-MM-DD)
tended: 2026-06-20                   # optional: last meaningful edit
backlinkLabel: "GlassBox"            # optional: shows a ↩ link…
backlinkHref: "https://github.com/Anirudh64210"   # …to a repo/project
draft: false                         # true = excluded from the site
---

Write your post in **Markdown** here. Code blocks, > quotes, ## headings,
lists and links all render in the noir style automatically.
```

3. Save. The page, the homepage list, the `/blog` index, the sitemap, and the RSS
   feed all update automatically on the next build. No code changes needed.

### Status badges are automatic
The seed / sprout / mature / decaying badge is computed from `planted` + `tended`
(see `src/lib/status.ts`). Override it by adding `status: "mature"` to frontmatter.

## Commands
```bash
npm install      # first time only
npm run dev      # local dev at http://localhost:4321
npm run build    # production build → ./dist
npm run preview  # preview the production build
```

## Structure
```
src/
  config.ts              ← edit your info here
  content/blog/*.md      ← your blog posts (add files here)
  content.config.ts      ← blog frontmatter schema
  lib/status.ts          ← growth-badge logic
  components/            ← ProjectCard, GrowthBadge
  layouts/Base.astro     ← <head>/SEO, header, footer, all interactions
  pages/
    index.astro          ← homepage (8 sections)
    blog/index.astro     ← /blog list
    blog/[...slug].astro ← a page per post
    sitemap.xml.ts       ← sitemap
    rss.xml.ts           ← RSS feed
  styles/gotham.css      ← the whole theme
public/                  ← portrait.jpg, robots.txt, favicon
```
