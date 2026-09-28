import { site } from "../config";
import { getPosts, postUrl, updated } from "../lib/posts";

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Every indexable page. Posts use their own date; the rest use the build date.
export async function GET() {
  const base = site.url.replace(/\/$/, "");
  const posts = await getPosts();
  const built = new Date().toISOString();
  const urls = [
    { loc: `${base}/`, lastmod: built },
    { loc: `${base}/blog`, lastmod: built },
    { loc: `${base}/experience`, lastmod: built },
    { loc: `${base}/resume`, lastmod: built },
    { loc: `${base}/privacy`, lastmod: built },
    ...posts.map((p) => ({ loc: `${base}${postUrl(p)}`, lastmod: updated(p).toISOString() })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
