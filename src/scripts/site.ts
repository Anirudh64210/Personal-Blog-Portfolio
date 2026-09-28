// Site-wide enhancements. Every page works without this file; it only adds behaviour.
import "pixel-anirudh/element";

const root = document.documentElement;

// ---------- theme toggle ----------
// data-theme is set before paint by the inline script in Base.astro when a choice is stored.
// With no stored choice the page follows the system through the media query in tokens.css.
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const resolved = (): "light" | "dark" => {
  const t = root.getAttribute("data-theme");
  if (t === "light" || t === "dark") return t;
  return systemDark.matches ? "dark" : "light";
};
const toggles = document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]");
const syncToggle = () => {
  const next = resolved() === "dark" ? "light" : "dark";
  toggles.forEach((b) => b.setAttribute("aria-label", `Switch to ${next} mode`));
};
toggles.forEach((b) =>
  b.addEventListener("click", () => {
    const next = resolved() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* storage blocked: the choice lasts for this page */ }
    syncToggle();
  }),
);
systemDark.addEventListener("change", syncToggle);
syncToggle();

// ---------- mobile menu ----------
const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu]");
const nav = document.getElementById("site-nav");
if (menuBtn && nav) {
  const setOpen = (open: boolean) => {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  };
  menuBtn.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); menuBtn.focus(); }
  });
  document.addEventListener("click", (e) => {
    const t = e.target as Node;
    if (nav.classList.contains("is-open") && !nav.contains(t) && !menuBtn.contains(t)) setOpen(false);
  });
  nav.addEventListener("click", (e) => { if ((e.target as Element).closest("a")) setOpen(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
}

// ---------- copy email (falls back to the mailto link) ----------
document.addEventListener("click", (e) => {
  const el = (e.target as Element).closest<HTMLAnchorElement>("[data-copy-email]");
  if (!el || !navigator.clipboard) return;
  e.preventDefault();
  const addr = el.dataset.copyEmail ?? "";
  const label = el.dataset.label ?? el.textContent ?? "";
  el.dataset.label = label;
  navigator.clipboard.writeText(addr).then(
    () => {
      el.textContent = "▸ copied to clipboard";
      window.setTimeout(() => { el.textContent = label; }, 1600);
    },
    () => { window.location.href = `mailto:${addr}`; },
  );
});
