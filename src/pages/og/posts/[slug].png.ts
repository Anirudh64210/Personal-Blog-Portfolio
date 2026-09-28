import type { APIRoute } from "astro";
import { site } from "../../../config";
import { getPosts, longDate, minutes, type Post } from "../../../lib/posts";
import { postCard } from "../../../lib/og";

// One share card per post, generated at build time: /og/posts/<slug>.png
// A post's `ogImage` frontmatter still wins when set.
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const d = post.data;
  const png = await postCard({
    title: d.title,
    category: d.category,
    date: longDate(d.planted),
    minutes: minutes(post),
    series: d.series ? `${d.series.name} series, part ${d.series.part}` : undefined,
    name: site.name,
  });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
