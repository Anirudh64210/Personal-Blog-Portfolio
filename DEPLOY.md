# Deploy guide

## 1 · Run & test locally
```bash
npm install
npm run dev      # open http://localhost:4321  (live-reloads as you edit)
```
Before shipping, test the real production build:
```bash
npm run build    # must finish with no errors
npm run preview  # serves ./dist exactly as it'll be live
```

## 2 · Push to GitHub
```bash
git init
git add -A
git commit -m "Portfolio site"
git branch -M main
# create an empty repo on github.com first (e.g. "portfolio"), then:
git remote add origin https://github.com/Anirudh64210/portfolio.git
git push -u origin main
```

## 3 · Deploy on Vercel
1. Go to vercel.com → **Add New → Project** → import your GitHub repo.
2. Vercel auto-detects **Astro** (build: `astro build`, output: `dist`). Accept defaults.
3. Click **Deploy**. You'll get a free `*.vercel.app` URL in ~1 minute.

Every future `git push` to `main` redeploys automatically.

## 4 · Custom domain
1. Buy a domain (Namecheap, Cloudflare, Porkbun…).
2. In Vercel: **Project → Settings → Domains → Add**, enter your domain.
3. Vercel shows the DNS records to add at your registrar:
   - apex `yourdomain.com` → an **A** record to Vercel's IP, and
   - `www` → a **CNAME** to `cname.vercel-dns.com` (Vercel tells you exactly).
4. Wait for DNS to verify (minutes to a few hours). HTTPS is automatic.
5. **Update your domain in the code** so SEO/sitemap/RSS use it:
   - `astro.config.mjs` → `site`
   - `src/config.ts` → `site.url`
   - `public/robots.txt` → the `Sitemap:` line
   Commit & push.

## 5 · Working it after launch (blogging)
**To publish a post:** add a `.md` file in `src/content/blog/`, commit, push.
Vercel rebuilds and the new page is live — nothing else to touch.

```bash
# new post
#   1. create src/content/blog/my-post.md  (see README for frontmatter)
#   2.
git add -A && git commit -m "post: my-post" && git push
```

**Things to keep in mind when adding posts / editing code:**
- The **filename is the URL** and is permanent for SEO. Pick the slug carefully;
  renaming a published post changes its link (add a redirect if you must).
- Always fill `description` — it's your Google snippet and OG card text.
- Keep `planted` accurate; set `tended` when you make real edits (drives the badge
  and `lastmod` in the sitemap).
- Use `draft: true` to keep a work-in-progress out of the live site.
- After any change, run `npm run build` locally once before pushing — if it builds
  clean here, it'll build clean on Vercel.
- Don't commit `node_modules/` or `dist/` (already in `.gitignore`).
- Images for posts go in `public/` and are referenced like `/my-image.jpg`.
