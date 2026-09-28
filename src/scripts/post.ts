// Post page enhancements: reading progress with the pizza rider, "on this page"
// highlighting, and the copy buttons. The post reads fine without any of it.

// ---------- reading progress + rider ----------
const lane = document.querySelector<HTMLElement>("[data-progress]");
const rider = document.querySelector<HTMLElement>("[data-rider]");
const article = document.querySelector<HTMLElement>(".post-body");
if (lane && article) {
  const bar = lane.querySelector<HTMLElement>(".progress")!;
  let queued = false;
  const update = () => {
    queued = false;
    const top = article.getBoundingClientRect().top + window.scrollY;
    const span = article.offsetHeight - window.innerHeight + lane.offsetHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - top + lane.offsetHeight) / span)) : 1;
    lane.style.setProperty("--p", p.toFixed(4));
    if (rider) {
      // whole pixels only, so the sprite never lands between device pixels
      const x = Math.max(0, Math.min(bar.clientWidth - 50, Math.round(p * bar.clientWidth) - 25));
      rider.style.setProperty("left", `${x}px`);
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  update();
}

// ---------- on this page: mark the current section ----------
const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];
if (links.length && "IntersectionObserver" in window) {
  const heads = links
    .map((a) => document.getElementById(a.dataset.tocLink ?? ""))
    .filter((h): h is HTMLElement => !!h);
  const mark = (id: string) => links.forEach((a) => a.setAttribute("aria-current", String(a.dataset.tocLink === id)));
  const pick = () => {
    const line = 140;
    let current = heads[0]?.id ?? "";
    for (const h of heads) if (h.getBoundingClientRect().top <= line) current = h.id;
    mark(current);
  };
  const io = new IntersectionObserver(pick, { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] });
  heads.forEach((h) => io.observe(h));
  window.addEventListener("scroll", () => requestAnimationFrame(pick), { passive: true });
  pick();
}

// ---------- copy buttons ----------
const flash = (el: HTMLElement, text: string) => {
  const label = el.dataset.label ?? el.textContent ?? "";
  el.dataset.label = label;
  el.textContent = text;
  window.setTimeout(() => { el.textContent = label; }, 1500);
};
document.addEventListener("click", (e) => {
  const t = e.target as Element;
  const code = t.closest<HTMLButtonElement>(".code-copy");
  if (code) {
    const pre = code.closest(".code-frame")?.querySelector("pre");
    if (pre && navigator.clipboard) {
      navigator.clipboard.writeText(pre.innerText.replace(/\n$/, "")).then(() => flash(code, "COPIED"), () => flash(code, "PRESS CTRL+C"));
    }
    return;
  }
  const link = t.closest<HTMLButtonElement>("[data-copy-link]");
  if (link && navigator.clipboard) {
    navigator.clipboard.writeText(link.dataset.copyLink ?? location.href).then(() => flash(link, "Link copied"), () => flash(link, "Copy failed"));
  }
});
