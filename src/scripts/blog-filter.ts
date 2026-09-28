// /blog search and category filter. Filters the server-rendered list in place and keeps
// ?q= and ?cat= in the URL, so links like /blog?cat=LLMs and the header's "Search posts"
// (/blog?q=) land on the right view. Without JS the full list is shown.

const form = document.querySelector<HTMLFormElement>("[data-search]");
const input = form?.querySelector<HTMLInputElement>("input");
const chips = [...document.querySelectorAll<HTMLButtonElement>(".filter-chips [data-cat]")];
const rows = [...document.querySelectorAll<HTMLElement>(".blog-row")];
const years = [...document.querySelectorAll<HTMLElement>("[data-year]")];
const status = document.querySelector<HTMLElement>("[data-status]");
const empty = document.querySelector<HTMLElement>("[data-empty]");

if (form && input) {
  const params = new URLSearchParams(location.search);
  const known = new Set(chips.map((c) => c.dataset.cat ?? ""));
  let cat = known.has(params.get("cat") ?? "") ? (params.get("cat") ?? "") : "";
  input.value = params.get("q") ?? "";

  const apply = () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const r of rows) {
      const hay = r.dataset.hay ?? "";
      const ok = (!cat || r.dataset.cat === cat) && words.every((w) => hay.includes(w));
      r.classList.toggle("is-filtered-out", !ok);
      if (ok) shown++;
    }
    for (const y of years) y.classList.toggle("is-filtered-out", !y.querySelector(".blog-row:not(.is-filtered-out)"));
    chips.forEach((c) => c.setAttribute("aria-pressed", String((c.dataset.cat ?? "") === cat)));
    empty?.classList.toggle("is-filtered-out", shown > 0);
    const filtered = words.length > 0 || cat !== "";
    if (status) status.textContent = filtered ? `${shown} of ${rows.length} ${rows.length === 1 ? "post" : "posts"}` : "";

    const next = new URLSearchParams();
    if (input.value.trim()) next.set("q", input.value.trim());
    if (cat) next.set("cat", cat);
    const qs = next.toString();
    history.replaceState(null, "", qs ? `/blog?${qs}` : "/blog");
  };

  input.addEventListener("input", apply);
  form.addEventListener("submit", (e) => { e.preventDefault(); apply(); input.blur(); });
  chips.forEach((c) => c.addEventListener("click", () => { cat = c.dataset.cat ?? ""; apply(); }));
  apply();
  if (params.has("q")) input.focus();
}
