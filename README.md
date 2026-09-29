# saianirudh.blog

Personal site and blog of Sai Anirudh Siddi. Built with Astro, fully static, deployed on Vercel.

Live at [www.saianirudh.blog](https://www.saianirudh.blog)

## Run locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into ./dist
```

## Writing a post

Add a Markdown file to `src/content/blog/` (start from `docs/post-template.md`) and push. The file name becomes the URL, `/blog/your-slug`.

Required frontmatter: `title`, `description`, `category`, `planted` (publish date). Any category name works; new ones get their own filter chip automatically. Set `draft: true` to keep a post unpublished.

The home page, `/blog`, search, RSS, sitemap and the post's share image all update on their own.

## Structure

| What | Where |
|---|---|
| Site copy (hero, projects, experience, résumé) | `src/config.ts` |
| Blog posts | `src/content/blog/` |
| Pages | `src/pages/` |
| Styles | `src/styles/` |
| Pixel companion | `packages/pixel-anirudh/` |
