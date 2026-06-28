import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// 👇 CHANGE `site` to your real domain (drives canonical URLs, sitemap, RSS, OG tags)
export default defineConfig({
  site: "https://www.saianirudh.blog/",
  output: "static",
  integrations: [mdx()],
});
