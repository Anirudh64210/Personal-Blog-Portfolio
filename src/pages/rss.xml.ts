import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL(site.url)).href.replace(/\/$/, "");
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => (b.data.tended ?? b.data.planted).valueOf() - (a.data.tended ?? a.data.planted).valueOf()
  );
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${base}/blog/${p.id}</link>
      <guid>${base}/blog/${p.id}</guid>
      <description>${esc(p.data.description)}</description>
      <pubDate>${(p.data.tended ?? p.data.planted).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} — Writing</title>
    <link>${base}/blog</link>
    <description>${esc(site.description)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
