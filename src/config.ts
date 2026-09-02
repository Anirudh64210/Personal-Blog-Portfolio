// ───────────────────────────────────────────────────────────
//  EDIT SITE HERE. Everything below feeds the homepage.
//  (Blog posts live in src/content/blog/*.md, see README.)
// ───────────────────────────────────────────────────────────

export const site = {
  name: "Sai Anirudh Siddi",
  role: "AI & Data Engineer",
  url: "https://www.saianirudh.blog/",
  description:
    "Sai Anirudh Siddi - AI Engineer working on ML systems, LLMs, model evaluation and SaaS. Projects, writing, and experience.",
  email: "siddish@mail.uc.edu",
  location: "Las Vegas, Nevada",
  coords: "36.17°N 115.14°W",
  fileNo: "AS-001",
};

export const hero = {
  eyebrow: "// engineer · ai · ml · data · saas",
  tagline: "I build on ideas I find cool - and try out new things.",
};

// About terminal. [type, text]; type is "cmd" (prompt line) or "out" (output line)
export const terminal: [("cmd" | "out"), string][] = [
  ["cmd", "whoami"],
  ["out", "sai anirudh siddi · ai & data engineer"],
  ["cmd", "cat focus.txt"],
  ["out", "ml systems, llms, models, eval and saas."],
  ["cmd", "cat now.txt"],
  ["out", "ai fellow @ handshake ai · llm evaluation. m.eng cs @ university of cincinnati · gpa 3.95. building glassbox: seeing inside medical llms."],
  ["cmd", 'echo "$MANTRA"'],
  ["out", "solve real-world problems using technology."],
];

export const facts: [string, string, boolean?][] = [
  ["Based", "Las Vegas, NV"],
  ["Focus", "AI · ML · Data"],
  ["Stack", "Python · LLMs · React.js"],
  ["Status", "Open to AI · Data roles", true],
];

export const socials = [
  { label: "GitHub", href: "https://github.com/Anirudh64210" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sai-anirudh-siddi/" },
  { label: "Email", href: "mailto:siddish@mail.uc.edu" },
];

export const press = [
  {
    date: "2025.11",
    src: "uc.edu",
    title: "Cincinnati teams blast off to the global stage in NASA hackathon",
    href: "https://www.uc.edu/news/articles/2025/11/cincinnati-teams-blast-off-to-global-stage-in-nasa-hackathon.html",
  },
  {
    date: "2025.10",
    src: "linkedin",
    title: "1819 Innovation Hub: Hub Happenings",
    href: "https://www.linkedin.com/pulse/hub-happenings-1819-innovation-hub-zo2jc/",
  },
];

// Card order here is the order on the page, and the morse numeral follows that
// position, so reordering is just moving an entry. Each card links straight to
// its GitHub repo; set `upcoming: true` and leave `repo` off for something not
// shipped yet, which renders as an unclickable tile marked "Upcoming".
export const projects = [
  {
    code: "ON-DEVICE · LLM",
    title: "Toki",
    summary:
      "Fully local AI meeting notetaker on Qwen 3.5. Spots your meetings, transcribes them, and writes structured notes into a searchable Library. Nothing leaves the laptop.",
    tags: ["Qwen 3.5", "Local LLM", "Transcription"],
    // No repo yet: a card without one renders as an "upcoming" tile instead of a link.
    upcoming: true,
  },
  {
    code: "MECH-INTERP",
    title: "GlassBox",
    summary:
      "Mechanistic interpretability for medical LLMs (Gemma 3), surfacing 15+ SAE feature activations with live uncertainty & harmfulness tracking during inference.",
    tags: ["PyTorch", "LLMs", "FastAPI"],
    repo: "https://github.com/Anirudh64210/glassbox",
  },
  {
    code: "NASA · AI",
    title: "ExoSeeker",
    summary:
      "AI exoplanet detection on NASA Kepler data, >90% accuracy. Won Best Use of NASA Data and advanced to the global NASA stage.",
    tags: ["PyTorch", "scikit-learn"],
    repo: "https://github.com/Anirudh64210/mlp_model",
  },
  {
    code: "MEDTECH · IOT",
    title: "NeedleHelp",
    summary:
      "End-to-end IoT + ML robotics with real-time control, >90% accuracy. 1st place overall at Ohio's largest hackathon (800+ participants).",
    tags: ["Python", "C++", "IoT/ML"],
    repo: "https://github.com/needlehelp",
  },
  {
    code: "IOT · ML",
    title: "Automating Aquaponics",
    summary:
      "IoT monitoring at 1,000+ daily data points with ML yield forecasting: 20% crop-yield gain, Tableau dashboards, peer-reviewed findings.",
    tags: ["IoT", "Forecasting", "Tableau"],
    repo: "https://github.com/Anirudh64210",
  },
];

// Experience & education rows each carry a logo tile.
//   logo  - path to the logo in public/logos/orgs/. See the README there for
//           how to add a new one.
//   plate - "light" sets the logo on a white chip; use it for marks with dark
//           ink or a white background. "full" lets the image fill the tile
//           edge to edge; use it when the logo already carries its own
//           brand-colour background (UC's red, Handshake's lime).
//   mark  - 1-3 letter monogram, the fallback when there is no `logo` yet.
//   slug  - picks the row's accent colour from the `.rec .lg-<slug>` rules in
//           gotham.css. The colour lives in CSS so no row needs an inline
//           style attribute, which would be blocked by the site's CSP.

export const experience = [
  { yr: "AUG 2026 - NOW", role: "AI Fellow", org: "Handshake AI -- LLM Evaluation · Adversarial benchmarks & data pipelines", loc: "Remote", mark: "HS", slug: "handshake", logo: "/logos/orgs/handshake.png", plate: "full" },
  { yr: "MAY - DEC 2025", role: "Data Engineer", org: "Great American Insurance -- Predictive Analytics · 1M+ records, AI-assisted analytics", loc: "Ohio, USA", mark: "GA", slug: "gaig", logo: "/logos/orgs/gaig.png", plate: "light" },
  { yr: "AUG - NOV 2023", role: "Software Engineer", org: "DRDO -- Digital Forensics · Ingestion & validation pipelines", loc: "Hyderabad, IN", mark: "DR", slug: "drdo", logo: "/logos/orgs/drdo.png", plate: "light" },
  { yr: "MAY - SEP 2022", role: "Data Engineer", org: "Dsign Code LLC -- IT · SQL/PL-SQL reporting across 20+ modules", loc: "Michigan, USA", mark: "DC", slug: "dsign", logo: "/logos/orgs/dsign-code.png", plate: "light" },
];

export const education = [
  { yr: "2024 - 2025", role: "University of Cincinnati", org: "M.Eng. Computer Science · GPA 3.95 / 4.0", loc: "Ohio, USA", mark: "UC", slug: "uc", logo: "/logos/orgs/uc.png", plate: "full" },
  { yr: "2020 - 2024", role: "JNT University Hyderabad", org: "B.Tech. Computer Science · GPA 3.9 / 4.0", loc: "India", mark: "JN", slug: "jntu", logo: "/logos/orgs/jntu.png", plate: "light" },
];

export const skills: [string, string[]][] = [
  ["languages", ["Python", "C++", "JS / TS", "SQL", "Java", "C"]],
  ["ai · ml", ["PyTorch", "Transformers", "LLMs", "LangChain", "FAISS", "scikit-learn", "TensorFlow", "Mech. Interp", "RAG", "Agentic AI"]],
  ["backend", ["FastAPI", "Node.js", "React", "REST APIs", "Microservices", "GPU Inference", "RunPod", "Docker", "Streamlit"]],
  ["data eng", ["Spark", "Hadoop", "ETL", "Data Validation", "Feature Eng", "Pandas", "NumPy"]],
  ["cloud", ["AWS", "GCP", "Azure", "Snowflake", "Git", "Linux", "MongoDB", "MySQL"]],
  ["observability", ["Arize Phoenix", "Sentry", "Experiment Tracking", "Model Eval", "Dashboards"]],
];
