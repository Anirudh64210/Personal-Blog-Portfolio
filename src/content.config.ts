import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Drop a .md file in src/content/blog/ and the site picks it up: home LATEST card,
// side list, archive, category chips and counts, /blog, search.json, RSS and sitemap.
// Template: docs/post-template.md
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Chip + filter. Adding a category means adding it here and in `categories` in src/config.ts.
    category: z.enum(["Interpretability", "LLMs", "ML", "Toki", "Building"]),
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
