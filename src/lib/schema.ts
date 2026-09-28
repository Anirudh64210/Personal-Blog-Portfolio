import { site, socials, xp } from "../config";

// Structured data shared across pages (HANDOFF 8.3). The Person node lives on the home
// page; other pages point at it by @id.
const base = site.url.replace(/\/$/, "");
export const PERSON_ID = `${base}/#person`;
export const WEBSITE_ID = `${base}/#website`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  alternateName: ["Anirudh Siddi", "Ani"],
  url: `${base}/`,
  image: `${base}${site.portrait}`,
  jobTitle: "AI Engineer",
  worksFor: { "@type": "Organization", name: "Handshake AI" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Cincinnati" },
    { "@type": "CollegeOrUniversity", name: "Jawaharlal Nehru Technological University, Hyderabad" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Las Vegas", addressRegion: "NV", addressCountry: "US" },
  knowsAbout: ["Large language models", "LLM evaluation", "Mechanistic interpretability", "Machine learning", "Data engineering"],
  sameAs: socials.map((s) => s.href),
};

export const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${base}/`,
  name: site.name,
  publisher: { "@id": PERSON_ID },
};

/** ProfilePage for a URL (home, /experience, /resume) with the Person as its main entity. */
export function profilePage(path: string, name?: string) {
  const url = path === "/" ? `${base}/` : `${base}${path}`;
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    ...(name ? { name } : {}),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: path === "/" ? { "@id": PERSON_ID } : personDetailed,
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path === "/" ? `${base}/` : `${base}${it.path}`,
    })),
  };
}

/** Person with every role from the XP log, for /experience and /resume. */
export const personDetailed = {
  ...person,
  hasOccupation: xp
    .filter((s) => s.kind === "EXPERIENCE" || s.kind === "NOW")
    .map((s) => ({
      "@type": "Occupation",
      name: s.role,
      description: `${s.org}, ${s.period}. ${s.points.join(" ")}`,
      occupationLocation: { "@type": "Place", name: s.place },
    })),
};
