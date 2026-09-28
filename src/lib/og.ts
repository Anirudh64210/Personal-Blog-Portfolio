// Build-time share cards (1200x630 PNG) for posts, in the Pixel Desk style.
// satori lays out the card from a plain element tree, resvg rasterises it.
// No network, no browser: it runs inside `astro build` on Vercel.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const font = (p: string) => readFileSync(require.resolve(p));
const FONTS = [
  { name: "Bricolage", data: font("@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff"), weight: 800 as const, style: "normal" as const },
  { name: "Figtree", data: font("@fontsource/figtree/files/figtree-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
  { name: "Silkscreen", data: font("@fontsource/silkscreen/files/silkscreen-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
];

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

const INK = "#1E1B2B";

export async function postCard(o: { title: string; category: string; date: string; minutes: number; series?: string; name: string }) {
  const size = o.title.length > 70 ? 56 : o.title.length > 44 ? 66 : 78;
  const tree = h("div", { width: 1200, height: 630, display: "flex", background: "#EDE6D8", padding: 56 }, [
    h("div", {
      display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1,
      background: "#FFFCF5", border: `3px solid ${INK}`, borderRadius: 8, boxShadow: `10px 10px 0 ${INK}`, padding: "48px 56px",
    }, [
      h("div", { display: "flex", flexDirection: "column", gap: 22 }, [
        h("div", { display: "flex", fontFamily: "Silkscreen", fontSize: 22, color: "#8A4B2A" }, `WRITING · ${o.category.toUpperCase()}`),
        h("div", { display: "flex", fontFamily: "Bricolage", fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.03em", color: INK }, o.title),
      ]),
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("div", { display: "flex", flexDirection: "column", gap: 6 }, [
          h("div", { display: "flex", fontFamily: "Bricolage", fontWeight: 800, fontSize: 30, color: INK }, o.name),
          h("div", { display: "flex", fontFamily: "Figtree", fontSize: 22, color: "#6B6472" },
            `${o.date} · ${o.minutes} min read${o.series ? ` · ${o.series}` : ""}`),
        ]),
        h("div", { display: "flex", fontFamily: "Silkscreen", fontSize: 20, background: "#F2B33D", color: INK, border: `3px solid ${INK}`, padding: "8px 14px" }, "SAIANIRUDH.BLOG"),
      ]),
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
