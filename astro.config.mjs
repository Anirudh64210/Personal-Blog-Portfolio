import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// `site` drives canonical URLs, sitemap, RSS and OG tags.
export default defineConfig({
  site: "https://www.saianirudh.blog/",
  output: "static",
  integrations: [mdx()],

  // Prism, not the default Shiki: Shiki colours each token with an inline
  // `style` attribute, and the CSP below blocks inline styles. Prism emits
  // classes, styled in gotham.css under "prism syntax colours".
  markdown: { syntaxHighlight: "prism" },

  // Content-Security-Policy, emitted as a <meta> tag per page. Astro hashes every
  // inline script and style at build time, so no 'unsafe-inline' is needed and the
  // hashes regenerate automatically whenever the code changes.
  //
  // Note: because the hashes are present, a browser would IGNORE 'unsafe-inline'
  // here. That is why the site carries no inline `style=` attributes: they cannot
  // be hashed, so they would simply be blocked. Keep it that way, and put new
  // styling in gotham.css instead.
  //
  // frame-ancestors is not honoured in a <meta> policy, so framing is denied by
  // the X-Frame-Options header in vercel.json instead.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-src 'none'",
        "worker-src 'none'",
        "manifest-src 'self'",
      ],
      // Google Fonts serves the stylesheet; @vercel/analytics loads from same origin.
      styleDirective: { resources: ["'self'", "https://fonts.googleapis.com"] },
      scriptDirective: { resources: ["'self'"] },
    },
  },
});
