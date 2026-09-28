import { site } from "../config";
import { getPosts, postUrl } from "../lib/posts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const base = site.url.replace(/\/$/, "");
  const posts = await getPosts();
  const items = posts
    .map((p) => {
      const url = `${base}${postUrl(p)}`;
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <description>${esc(p.data.description)}</description>
      <category>${esc(p.data.category)}</category>
      <pubDate>${p.data.planted.toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} · Writing</title>
    <link>${esc(`${base}/blog`)}</link>
    <atom:link href="${esc(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>Notes on LLMs, interpretability and building AI products by ${esc(site.name)}.</description>
    <language>en-us</language>
    <managingEditor>${esc(site.email)} (${esc(site.name)})</managingEditor>
${posts[0] ? `    <lastBuildDate>${posts[0].data.planted.toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
