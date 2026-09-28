import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { categories } from "./config";

// Drop a .md file in src/content/blog/ and the site picks it up: home LATEST card,
// side list, archive, category chips and counts, /blog, search.json, RSS and sitemap.
// Template: docs/post-template.md
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Chip + filter. Any name works: a new one gets its own chip automatically.
    // A case-insensitive match to a known category ("llms") is snapped to its spelling ("LLMs")
    // so near-duplicates never split into two chips.
    category: z
      .string()
      .trim()
      .min(1)
      .transform((c) => categories.find((k) => k.toLowerCase() === c.toLowerCase()) ?? c),
    topic: z.string().default(""),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    tldr: z.string().optional(),
    series: z.object({ name: z.string(), part: z.number().int().positive() }).optional(),
    // Kept valid for older posts; the growth badge is not shown in this design.
    status: z.enum(["seed", "sprout", "mature", "decaying"]).optional(),
    backlinkLabel: z.string().optional(),
    // .url() so a `javascript:` value can never reach an href
    backlinkHref: z.string().url().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
