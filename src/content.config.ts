import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string().default(""),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    status: z.enum(["seed", "sprout", "mature", "decaying"]).optional(),
    backlinkLabel: z.string().optional(),
    backlinkHref: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
