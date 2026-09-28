import { getPosts, postUrl } from "../lib/posts";

// Build-time search index (title, description, category, slug, date). No Pagefind:
// it needs 'wasm-unsafe-eval' in the CSP.
export async function GET() {
  const posts = await getPosts();
  const data = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    category: p.data.category,
    series: p.data.series?.name ?? null,
    slug: p.id,
    url: postUrl(p),
    date: p.data.planted.toISOString().slice(0, 10),
  }));
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
