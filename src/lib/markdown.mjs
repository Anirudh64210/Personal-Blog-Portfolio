// Markdown plugins for blog posts. Zero dependencies: plain tree walks.
// Everything here emits classes only, never inline styles (the CSP blocks them).

function walk(node, fn, parent = null, index = 0) {
  fn(node, parent, index);
  if (node.children) for (let i = 0; i < node.children.length; i++) walk(node.children[i], fn, node, i);
}

/**
 * remark: turns a blockquote that starts with [!POINT] into the key point pull quote:
 *   <figure class="key-point"><blockquote><p>...</p></blockquote><figcaption>The main point</figcaption></figure>
 * Fails the build when a post has more than one.
 */
export function remarkKeyPoint() {
  return (tree, file) => {
    let count = 0;
    walk(tree, (node) => {
      if (node.type !== "blockquote") return;
      const first = node.children?.[0];
      const text = first?.type === "paragraph" ? first.children?.[0] : null;
      if (!text || text.type !== "text" || !/^\s*\[!POINT\]/i.test(text.value)) return;
      count++;
      text.value = text.value.replace(/^\s*\[!POINT\]\s*/i, "");
      if (!text.value) first.children.shift();
      if (first.children.length && first.children[0].type === "break") first.children.shift();
      const inner = { type: "blockquote", children: node.children };
      node.data = { hName: "figure", hProperties: { className: ["key-point"] } };
      node.children = [
        inner,
        { type: "paragraph", data: { hName: "figcaption" }, children: [{ type: "text", value: "The main point" }] },
      ];
    });
    if (count > 1) {
      throw new Error(`${file?.path ?? "post"}: ${count} key points ([!POINT]); a post can have at most one.`);
    }
  };
}

const LANGS = { py: "python", js: "javascript", ts: "typescript", sh: "shell", bash: "shell", zsh: "shell" };

/**
 * rehype: wraps every <pre> in a code frame with a language label and a COPY button.
 * The button is hidden until JavaScript is available (see site.css).
 */
export function rehypeCodeFrame() {
  return (tree) => {
    walk(tree, (node, parent, index) => {
      if (!parent || node.type !== "element" || node.tagName !== "pre") return;
      if (parent.type === "element" && parent.properties?.className?.includes?.("code-frame")) return;
      const code = node.children?.find((c) => c.tagName === "code");
      const cls = [...(node.properties?.className ?? []), ...(code?.properties?.className ?? [])].join(" ");
      const m = cls.match(/language-([\w+-]+)/);
      const raw = m ? m[1].toLowerCase() : "";
      const lang = raw && raw !== "plaintext" && raw !== "text" ? (LANGS[raw] ?? raw) : "code";
      node.properties = { ...(node.properties ?? {}), tabIndex: 0 };
      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["code-frame"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-head"] },
            children: [
              { type: "element", tagName: "span", properties: { className: ["code-lang"] }, children: [{ type: "text", value: lang.toUpperCase() }] },
              { type: "element", tagName: "button", properties: { type: "button", className: ["code-copy"], "aria-label": "Copy code" }, children: [{ type: "text", value: "COPY" }] },
            ],
          },
          node,
        ],
      };
    });
  };
}

/** rehype: external links open in a new tab with rel="noopener noreferrer". */
export function rehypeExternalLinks() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "a") return;
      const href = String(node.properties?.href ?? "");
      if (!/^https?:\/\//i.test(href)) return;
      if (/^https?:\/\/(www\.)?saianirudh\.blog(\/|$)/i.test(href)) return;
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
    });
  };
}
