// Experience scrubber. One root ([data-xp]) holds the stage, and optionally the XP log
// list (home) or the detail cards and jump list (/experience). The range input, the stop
// labels, the list rows and the jump list all stay in sync through setIndex().
// Pixel art is positioned with whole-pixel `left` values via the CSSOM (CSP safe).

const phone = window.matchMedia("(max-width: 600px)");

export function initXp(root: HTMLElement, opts: { arrowKeys?: boolean } = {}) {
  const rail = root.querySelector<HTMLElement>("[data-xp-rail]");
  const range = root.querySelector<HTMLInputElement>("[data-xp-range]");
  const pose = root.querySelector<HTMLElement>("[data-xp-pose]");
  const sprite = root.querySelector<HTMLElement>("[data-xp-sprite]");
  const knob = root.querySelector<HTMLElement>("[data-xp-knob]");
  const now = root.querySelector<HTMLElement>("[data-xp-now]");
  const cells = [...root.querySelectorAll<HTMLElement>(".xp-cell")];
  if (!rail || !range || !pose || !sprite || !knob || cells.length === 0) return;

  const n = cells.length;
  let index = Number(range.value) || 0;

  const layout = () => {
    const w = rail.clientWidth;
    const center = (i: number) => cells[i].offsetLeft + cells[i].offsetWidth / 2;
    const pw = pose.offsetWidth;
    const left = Math.max(0, Math.min(w - pw, Math.round(center(index) - pw / 2)));
    pose.style.setProperty("left", `${left}px`);
    knob.style.setProperty("left", `${Math.round(center(index))}px`);
    // The native thumb is 48px wide, so its centre runs from left + 24 to right - 24:
    // stretch the input so that span matches first stop to last stop exactly.
    const c0 = center(0), c1 = center(n - 1);
    range.style.setProperty("left", `${Math.round(c0 - 24)}px`);
    range.style.setProperty("width", `${Math.round(c1 - c0 + 48)}px`);
  };

  const setScale = () => sprite.setAttribute("scale", phone.matches ? "3" : (sprite.dataset.scale ?? "4"));

  const setIndex = (i: number) => {
    index = Math.max(0, Math.min(n - 1, i));
    const cell = cells[index];
    if (range.value !== String(index)) range.value = String(index);
    range.setAttribute("aria-valuetext", cell.dataset.vt ?? "");
    cells.forEach((c, k) => {
      c.classList.toggle("is-done", k < index);
      c.classList.toggle("is-active", k === index);
    });
    root.querySelectorAll<HTMLElement>("[data-go]").forEach((b) => {
      if (b.closest(".xp-ends")) return;
      b.setAttribute("aria-pressed", String(Number(b.dataset.go) === index));
    });
    root.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.stop) === index);
    });
    if (sprite.getAttribute("state") !== cell.dataset.pose) sprite.setAttribute("state", cell.dataset.pose ?? "idle");
    if (now) now.textContent = cell.dataset.label ?? "";
    layout();
  };

  range.addEventListener("input", () => setIndex(Number(range.value)));
  root.addEventListener("click", (e) => {
    const t = e.target as Element;
    const go = t.closest<HTMLElement>("[data-go]");
    if (go && root.contains(go)) { setIndex(Number(go.dataset.go)); return; }
    const step = t.closest<HTMLElement>("[data-step]");
    if (step && root.contains(step)) setIndex(index + Number(step.dataset.step));
  });

  if (opts.arrowKeys) {
    document.addEventListener("keydown", (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t === range || t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setIndex(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); setIndex(index + 1); }
    });
  }

  setScale();
  phone.addEventListener("change", () => { setScale(); layout(); });
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => layout());
    ro.observe(rail);
    ro.observe(pose);
  }
  window.addEventListener("resize", layout, { passive: true });
  customElements.whenDefined("pixel-anirudh").then(() => requestAnimationFrame(() => { layout(); root.classList.add("xp-ready"); }));
  setIndex(index);
}
