import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL("https://saianirudhsiddi.com")).href.replace(/\/$/, "");
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const urls = [
    { loc: `${base}/`, lastmod: new Date().toISOString() },
    { loc: `${base}/blog`, lastmod: new Date().toISOString() },
    ...posts.map((p) => ({
      loc: `${base}/blog/${p.id}`,
      lastmod: (p.data.tended ?? p.data.planted).toISOString(),
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
