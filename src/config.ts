// Draft replacement for src/config.ts. All site copy lives here; blog posts stay in src/content/blog/.
// Copy is Anirudh's own voice (lowercase intro is intentional). No em or en dashes anywhere.

export const site = {
  name: "Sai Anirudh Siddi",
  shortName: "ani",
  role: "AI Engineer",
  url: "https://www.saianirudh.blog/",
  title: "Sai Anirudh Siddi · AI Engineer in Las Vegas",
  description:
    "Sai Anirudh Siddi (ani) is an AI engineer and product dev in Las Vegas. AI Fellow at Handshake AI, building Toki. Writing on LLMs, interpretability and shipping AI products.",
  email: "saianirudhsiddi4@gmail.com",
  location: { city: "Las Vegas", region: "NV", country: "US" },
  portrait: "/portrait-hero.jpg",
  portraitAlt: "Sai Anirudh Siddi, AI engineer, smiling in a brown sherpa jacket",
  resumePdf: "/resume/Sai_Anirudh_Siddi_Resume.pdf",
};

export const hero = {
  eyebrow: "PLAYER 1 · AI ENGINEER · LAS VEGAS",
  intro: [
    "hi, i'm ani. i work with ai for a living. after hours i build hobby projects for fun and solve problems with technology.",
    "master of engineering in cs from the university of cincinnati. now in las vegas, fuelled by a desire to do something different. something great.",
  ],
  photoCaption: "PLAYER 1 · IRL LARPING",
};

// Rendered as a terminal ("ani --about", "ani --abilities"). Real HTML text, not typed in by JS.
export const about = {
  handle: "ani@saianirudh.blog",
  fields: [
    ["class", ["ai engineer, product dev"]],
    ["base", ["las vegas, nv"]],
    ["status", ["ai fellow at handshake ai", "volunteer engineer at an ngo", "building toki (in progress)"]],
  ] as [string, string[]][],
  abilities: [
    ["ai engineering", "llm apps and agents, prototype to production"],
    ["product dev", "idea to shipped product, end to end"],
    ["data + ml pipelines", "pipelines that stay up at 3am"],
    ["iot + ml", "sensors in, decisions out"],
    ["interpretability", "opening models up to see what they compute"],
  ] as [string, string][],
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sai-anirudh-siddi/" },
  { label: "GitHub", href: "https://github.com/Anirudh64210" },
];

// Wins and press. Only real links; an item without href renders as plain text (no arrow).
export const wins = [
  { tag: "WIN", date: "2025", title: "Best Use of NASA Data, NASA Space Apps Challenge", source: "ExoSeeker · 2,000+ participants",
    href: "https://www.uc.edu/news/articles/2025/11/cincinnati-teams-blast-off-to-global-stage-in-nasa-hackathon.html" },
  { tag: "WIN", date: "2025", title: "1st Place, Best Project Overall, Ohio's largest hackathon", source: "NeedleHelp · 140+ teams · via 1819 Innovation Hub",
    href: "https://www.linkedin.com/pulse/hub-happenings-1819-innovation-hub-zo2jc/" },
  { tag: "PRESS", date: "Nov 2025", title: "Cincinnati teams blast off to the global stage in NASA hackathon", source: "uc.edu",
    href: "https://www.uc.edu/news/articles/2025/11/cincinnati-teams-blast-off-to-global-stage-in-nasa-hackathon.html" },
];

// Work bento. `featured` takes the 2x2 tile, `wip` gets the dashed tile, everything else fills in order.
// `repo` links the tile to GitHub. A tile with `series` and no public repo links to the first
// post of that blog series instead (GlassBox's repo is not public, github.com/Anirudh64210/glassbox 404s).
export const projects = [
  { code: "MECH INTERP · FEATURED", title: "GlassBox", featured: true, series: "GlassBox",
    summary: "x-ray for medical llms. 15+ sae features live during inference, flags when the model is unsure of itself." },
  { code: "IN PROGRESS", title: "Toki", wip: true,
    summary: "fully offline meeting intelligence: asr, diarization and a 4-bit qwen3-4b on a 4gb gpu. live transcription from 21s to ~1s, 9.2% wer. nothing leaves the laptop." },
  { code: "NASA · AI", title: "ExoSeeker", repo: "https://github.com/Anirudh64210/mlp_model",
    summary: "exoplanets in kepler data, >90% accuracy.", loot: "best use of nasa data, space apps" },
  { code: "MEDTECH · IOT", title: "NeedleHelp", repo: "https://github.com/needlehelp",
    summary: "iot + ml for real-time robotic control.", loot: "1st of 140 teams, ohio's largest hackathon" },
  { code: "IOT · ML", title: "Aquaponics", repo: "https://github.com/Anirudh64210",
    summary: "taught a working fish farm to run itself. 1,000 readings a day, 40% less babysitting, 20% more yield." },
];

// XP log. Chronological. `pose` is the pixel-anirudh state shown on the scrubber thumb.
// `logo` (128px PNG in public/logos/orgs/) shows beside the stop; `plate` is "light" (white chip,
// for dark or white-background marks) or "full" (the logo already has its own brand background).
// Stops without a logo get a two-letter pixel monogram (`mono`, or initials of `short`).
// New states (plant, lift, lab, celebrate, read) must be added to the companion engine; see HANDOFF.md.
export const xp = [
  { label: "JNTU '20", logo: "/logos/orgs/jntu.png", plate: "light", short: "JNTU Hyderabad", years: "2020 to 2024", kind: "EDUCATION", period: "Jul 2020 to May 2024", place: "Hyderabad, India",
    role: "B.Tech, Computer Science", org: "Jawaharlal Nehru Technological University, Hyderabad", pose: "hello", act: "saying hi",
    points: ["computer science undergrad in hyderabad.", "the aquaponics project ran alongside it from 2022 to 2024."] },
  { label: "AQUAPONICS '22", mono: "AQ", short: "Automating Aquaponics", years: "2022 to 2024", kind: "PROJECT", period: "2022 to 2024", place: "alongside undergrad",
    role: "Automating Aquaponics", org: "Startup incubator project, with professors and a local business", pose: "plant", act: "growing things",
    points: ["taught a working fish farm to run itself: iot monitoring across water, ph and environment sensors, 1,000+ readings a day, 40% less manual babysitting.",
      "ml yield forecasting that contributed to a 20% improvement in crop yield.",
      "tableau dashboards that drove a 10% profit increase for the business; research paper under peer review."] },
  { label: "DSIGN '22", logo: "/logos/orgs/dsign-code.png", plate: "light", short: "Dsign Code LLC", years: "2022", kind: "EXPERIENCE", period: "May to Sep 2022", place: "Michigan, USA (remote)",
    role: "Data Engineer", org: "Dsign Code LLC", pose: "lift", act: "lifting",
    points: ["sql and pl/sql reporting workflows across 20+ enterprise modules.", "analyzed 50k+ monthly transactional records; improved system performance by 15%."] },
  { label: "DRDO '23", logo: "/logos/orgs/drdo.png", plate: "light", short: "DRDO", years: "2023", kind: "EXPERIENCE", period: "Aug to Nov 2023", place: "Hyderabad, India",
    role: "Software Engineer, Digital Forensics", org: "DRDO, Defense Research and Development of India", pose: "lab", act: "in the lab",
    points: ["processed 700+ structured and unstructured forensic artifacts per run.", "built data ingestion, management and validation pipelines for downstream investigative analysis.", "improved system reliability and investigative efficiency by 30%."] },
  { label: "UC '24", logo: "/logos/orgs/uc.png", plate: "full", short: "University of Cincinnati", years: "2024 to 2025", kind: "EDUCATION", period: "Aug 2024 to Dec 2025", place: "Cincinnati, Ohio",
    role: "Master of Engineering, Computer Science", org: "University of Cincinnati", pose: "celebrate", act: "celebrating",
    points: ["grad school in ohio.", "best use of nasa data at nasa space apps (exoseeker), 1st of 140+ teams at ohio's largest hackathon (needlehelp)."] },
  { label: "GAIG '25", logo: "/logos/orgs/gaig.png", plate: "light", short: "Great American", years: "2025 to 2026", kind: "EXPERIENCE", period: "May 2025 to Jan 2026", place: "Cincinnati, Ohio",
    role: "Data Engineer, Predictive Analytics", org: "Great American Insurance Group", pose: "eat", act: "pizza break",
    points: ["analyzed 1m+ underwriting and litigation records; 10% improvement in decision accuracy.", "built optimized data management pipelines and reporting across multiple systems.", "validated an ai-assisted analytics tool with stakeholders; 60% better processing efficiency."] },
  { label: "HANDSHAKE '26", logo: "/logos/orgs/handshake.png", plate: "full", short: "Handshake AI", years: "2026 to now", kind: "NOW", period: "Aug 2026 to now", place: "Remote",
    role: "AI Fellow", org: "Handshake AI", pose: "read", act: "reading up",
    points: ["author adversarial evaluation sets and rl environments for frontier llms, with rubric-based reward functions; over 50% stumping rate on multi-step quantitative reasoning.",
      "build and curate labeled evaluation datasets, refining prompts against model reasoning traces.", "score outputs against calibrated rubrics that serve as rl reward signals."] },
  { label: "EXPANDRANGE", mono: "ER", short: "ExpandRange", years: "soon", kind: "UPCOMING", period: "soon", place: "Las Vegas, NV",
    role: "ExpandRange", org: "in the works", highlight: true, pose: "work", act: "building",
    points: ["building our own ai products and services."] },
];

export const contact = {
  speaker: "ANIRUDH",
  line: "want to chat? reach out to me here.",
  sub: "i'm always looking to connect and meet new people. hmu.",
};

// Header navigation. `key` marks the active pill (pages pass `active="writing"` and so on).
export const nav = [
  { key: "home", label: "Home", href: "/" },
  { key: "writing", label: "Writing", href: "/blog" },
  { key: "projects", label: "Projects", href: "/#projects" },
  { key: "experience", label: "Experience", href: "/experience" },
  { key: "resume", label: "Résumé", href: "/resume" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

// Blog categories, in chip order. Adding one here also needs it in src/content.config.ts.
export const categories = ["Interpretability", "LLMs", "ML", "Toki", "Building"] as const;

// Web résumé (/resume). Keep in sync with public/resume/Sai_Anirudh_Siddi_Resume.pdf.
// No phone number and no GPA on the web version (the PDF keeps both).
export const resume = {
  contact: [
    { text: "Las Vegas, NV" },
    { text: "saianirudhsiddi4@gmail.com", href: "mailto:saianirudhsiddi4@gmail.com" },
    { text: "LinkedIn", href: "https://www.linkedin.com/in/sai-anirudh-siddi/" },
    { text: "github.com/Anirudh64210", href: "https://github.com/Anirudh64210" },
    { text: "saianirudh.blog", href: "https://www.saianirudh.blog/" },
  ] as { text: string; href?: string }[],
  education: [
    { degree: "Master of Engineering, Computer Science", school: "University of Cincinnati", period: "Aug 2024 to Dec 2025" },
    { degree: "Bachelor of Technology, Computer Science", school: "Jawaharlal Nehru Technological University, Hyderabad", period: "Jul 2020 to May 2024" },
  ],
  skills: [
    ["Languages", "Python, SQL, Java, C, C#, Go, Rust, Scala, R, CSS"],
    ["Frameworks", "PyTorch, Transformers, LangChain, scikit-learn, TensorFlow, FastAPI, Node.js, Streamlit"],
    ["AI/ML systems", "LLMs, RL (RLHF, RLVR), reward modeling, LLM evaluation, red-teaming, adversarial prompting, rubric design, mechanistic interpretability, RAG, agentic AI, FAISS, MLOps"],
    ["Backend and infra", "Kubernetes, REST APIs, microservices, GPU inference pipelines, RunPod, Docker, CI/CD"],
    ["Data engineering", "Spark, Hadoop, ETL, pipelines, validation, feature engineering, Pandas, NumPy"],
    ["Cloud and platforms", "AWS, GCP, Azure, Snowflake, Git, Linux, MongoDB, MySQL"],
    ["Observability", "Arize Phoenix, Sentry, experiment tracking, model evaluation, Tableau, Power BI, Looker"],
  ] as [string, string][],
  experience: [
    { role: "AI Fellow", org: "Handshake AI", period: "Aug 2026 to present", points: [
      "Author adversarial evaluation sets and reinforcement learning environments for frontier LLMs, writing domain-specific scenarios, questions and rubric-based reward functions; over 50% stumping rate on multi-step quantitative reasoning tasks.",
      "Build and curate labeled evaluation datasets, refining prompts against model responses and reasoning traces to separate genuine reasoning gaps from prompt ambiguity.",
      "Score and analyze outputs against calibrated rubrics that serve as RL reward signals, surfacing systematic weakness patterns for the next round of environment design.",
    ] },
    { role: "Data Engineer", org: "Great American Insurance Group, Predictive Analytics", period: "May 2025 to Jan 2026", points: [
      "Analyzed 1M+ underwriting and litigation records using SQL and Python to surface data inconsistencies and workflow bottlenecks, improving decision accuracy by 10%.",
      "Built optimized data management pipelines and reporting across multiple systems, improving data accessibility and operational efficiency.",
      "Validated an AI-assisted analytics tool with business stakeholders, improving processing efficiency by 60%.",
    ] },
    { role: "Software Engineer", org: "DRDO, Defense Research and Development of India, Digital Forensics", period: "Aug 2023 to Nov 2023", points: [
      "Processed and analyzed 700+ structured and unstructured forensic artifacts per run.",
      "Designed data ingestion, management and validation pipelines for downstream analysis.",
      "Documented schemas and processing logic while testing outputs, improving reliability and investigative efficiency by 30%.",
    ] },
    { role: "Data Engineer", org: "Dsign Code LLC, IT", period: "May 2022 to Sep 2022", points: [
      "Developed SQL and PL/SQL reporting workflows across 20+ enterprise modules.",
      "Analyzed 50K+ monthly transactional records, improving system performance by 15%.",
      "Partnered with cross-functional teams to gather requirements and validate reporting outputs.",
    ] },
  ],
  projects: [
    { name: "Toki", kind: "On-device AI meeting assistant", points: [
      "Fully offline meeting intelligence chaining ASR, speaker diarization and a 4-bit quantized Qwen3-4B for note generation; zero cloud inference cost, no data egress.",
      "GPU inference pipeline for a 0.6B ONNX ASR model and 4B LLM on a 4GB-VRAM consumer GPU; live transcription latency from 21s to ~1s, diarization at 0.014 RTF.",
      "Sole engineer from model selection to a packaged Windows release; 9.2% WER, retrieval precision@1 from 82.9% to 87.5%.",
    ] },
    { name: "GlassBox", kind: "Mechanistic interpretability", points: [
      "Mech-interp system for medical LLMs on Gemma 3 4B/2B, surfacing 15+ SAE feature activations with real-time uncertainty and harmfulness tracking.",
      "FastAPI and RunPod GPU microservices with Claude agents, Arize Phoenix and Sentry for live interpretability monitoring.",
    ] },
    { name: "ExoSeeker", kind: "AI prediction platform", points: [
      "Exoplanet detection on Kepler data, over 90% accuracy, with PyTorch and scikit-learn pipelines.",
      "Best Use of NASA Data, NASA Space Apps Challenge (2,000+ participants); represented Cincinnati at the Global Challenge.",
    ] },
    { name: "NeedleHelp", kind: "MedTech", points: [
      "End-to-end IoT + ML system for real-time robotic control, over 90% system accuracy.",
      "1st Place, Best Project Overall, Ohio's largest hackathon (140+ teams, 800+ participants).",
    ] },
  ],
};
