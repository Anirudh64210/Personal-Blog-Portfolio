import { getCollection, type CollectionEntry } from "astro:content";
import { categories } from "../config";
import { readingTime } from "./readingTime";

export type Post = CollectionEntry<"blog">;

/** Published posts, newest first by `planted`. Same-day posts fall back to series part (higher first), then title. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => {
    const d = b.data.planted.valueOf() - a.data.planted.valueOf();
    if (d) return d;
    const s = (b.data.series?.part ?? 0) - (a.data.series?.part ?? 0);
    if (s) return s;
    return a.data.title.localeCompare(b.data.title);
  });
}

export const postUrl = (p: Post) => `/blog/${p.id}`;
export const minutes = (p: Post) => readingTime(p.body);
/** Last meaningful date: `tended` when set, otherwise `planted`. */
export const updated = (p: Post) => p.data.tended ?? p.data.planted;

// Dates are written in UTC so a build in any timezone prints the same day as the frontmatter.
const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...o });
export const longDate = (d: Date) => fmt({ month: "short", day: "numeric", year: "numeric" }).format(d);
export const shortDate = (d: Date) => fmt({ month: "short", day: "numeric" }).format(d);
export const year = (d: Date) => d.getUTCFullYear();

/** "GLASSBOX 2/3" style chip, or "" when the post is not in a series. */
export function seriesChip(p: Post, all: Post[]): string {
  const s = p.data.series;
  if (!s) return "";
  return `${s.name.toUpperCase()} ${s.part}/${seriesPosts(s.name, all).length}`;
}

export function seriesPosts(name: string, all: Post[]): Post[] {
  return all.filter((p) => p.data.series?.name === name).sort((a, b) => a.data.series!.part - b.data.series!.part);
}

/** Category chips with counts, in the configured order, only categories that have posts. */
export function categoryCounts(all: Post[]) {
  return categories
    .map((name) => ({ name, n: all.filter((p) => p.data.category === name).length }))
    .filter((c) => c.n > 0);
}

/** Posts grouped by year, newest year first, keeping the incoming order inside each year. */
export function byYear(list: Post[]) {
  const groups: { y: number; items: Post[] }[] = [];
  for (const p of list) {
    const y = year(p.data.planted);
    let g = groups.find((x) => x.y === y);
    if (!g) groups.push((g = { y, items: [] }));
    g.items.push(p);
  }
  return groups;
}

/** Prev and next for the post footer: within the series when there is one, otherwise by date. */
export function neighbours(p: Post, all: Post[]) {
  const s = p.data.series;
  if (s) {
    const list = seriesPosts(s.name, all);
    const i = list.findIndex((x) => x.id === p.id);
    return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null, inSeries: s.name };
  }
  const i = all.findIndex((x) => x.id === p.id);
  // `all` is newest first, so "previous" (older) is i + 1 and "next" (newer) is i - 1.
  return { prev: all[i + 1] ?? null, next: all[i - 1] ?? null, inSeries: "" };
}

/** Number of posts that belong to a project (by series name or backlink label). */
export function postsForProject(title: string, all: Post[]) {
  const t = title.toLowerCase();
  return all.filter((p) => p.data.series?.name.toLowerCase() === t || p.data.backlinkLabel?.toLowerCase() === t).length;
}
