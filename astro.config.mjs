import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { remarkKeyPoint, rehypeCodeFrame, rehypeExternalLinks } from "./src/lib/markdown.mjs";
import { THEME_SCRIPT_HASH } from "./src/lib/theme-script.mjs";

// `site` drives canonical URLs, sitemap, RSS and OG tags. The canonical host is www;
// the apex 308-redirects to it (Vercel domain settings).
export default defineConfig({
  site: "https://www.saianirudh.blog",
  output: "static",
  // URLs have no trailing slash (/blog/my-post). vercel.json matches with "trailingSlash": false.
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [mdx()],
  // Never inline assets as data: URIs. Small font files would otherwise be inlined,
  // and font-src 'self' (correctly) blocks data: fonts.
  // server.fs.strict: the dev server's file allow list breaks when the project path
  // contains a colon (e.g. "portfolio:blog") and 403s every CSS and font file.
  // Dev only; production builds are unaffected.
  vite: {
    build: { assetsInlineLimit: 0 },
    server: { fs: { strict: false } },
  },

  // Prism, not the default Shiki: Shiki colours each token with an inline
  // `style` attribute, and the CSP below blocks inline styles. Prism emits
  // classes, styled in src/styles/site.css for both themes.
  // The unified (remark/rehype) processor runs the small plugins in src/lib/markdown.mjs:
  // the [!POINT] pull quote, code frames with a COPY button, and safe external links.
  // SmartyPants keeps curly quotes but never turns "--" into an en or em dash.
  markdown: {
    syntaxHighlight: "prism",
    processor: unified({
      remarkPlugins: [remarkKeyPoint],
      rehypePlugins: [rehypeCodeFrame, rehypeExternalLinks],
      smartypants: { dashes: false },
    }),
  },

  // Content-Security-Policy, emitted as a <meta> tag per page. Astro hashes every
  // bundled script and style at build time, so no 'unsafe-inline' is needed.
  // Because hashes are present, browsers would ignore 'unsafe-inline' anyway: that is
  // why the site has no inline `style=""` attributes. Dynamic values go through the
  // CSSOM (el.style.setProperty), which the CSP allows.
  //
  // Fonts are self-hosted (@fontsource), so there are no third-party hosts at all.
  // frame-ancestors is not honoured in a <meta> policy, so framing is denied by the
  // X-Frame-Options header in vercel.json instead.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-src 'none'",
        "worker-src 'none'",
        "manifest-src 'self'",
      ],
      styleDirective: { resources: ["'self'"] },
      // The inline no-flash theme script (src/lib/theme-script.mjs) is hashed here.
      scriptDirective: { resources: ["'self'"], hashes: [THEME_SCRIPT_HASH] },
    },
  },
});
