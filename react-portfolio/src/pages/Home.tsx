/**
 * Anjana Deivasigamani Portfolio — minimal build
 * Background: single fixed Cursor-reactive Gradient Mesh (CursorMesh)
 * Cards: Spotlight Glow + Zoom/Lift (SpotlightZoomCard)
 * Scroll: Stagger Fade-Up on all section blocks
 * Mode: Dark / Light toggle
 *
 * All copy is the original content from the static index.html — UI only was
 * changed. Do not paraphrase this content.
 *
 * Palette: rose #c2748a | lavender #b497cf | bg-light #fdf6f9 | bg-dark #1a0f14
 * Fonts: Playfair Display (headings) · DM Sans (body) · JetBrains Mono (tags/labels)
 */
import { useEffect, useRef, useState, useCallback } from "react";
import CursorMesh from "../components/CursorMesh";
import SpotlightZoomCard from "../components/SpotlightZoomCard";
import { Github, Linkedin, FileText, Mail, Sun, Moon } from "lucide-react";

// ── Constants ───────────────────────────────────────────────────────────────
const SITE = "https://anjanadevan27.github.io";
const RESUME_URL = `${SITE}/resume/Anjana_Deivasigamani_Resume_main.pdf`;
const PROFILE_URL = `${SITE}/images/profile.jpg`;
const GITHUB_URL = "https://github.com/AnjanaDevan27";
const LINKEDIN_URL = "https://www.linkedin.com/in/anjana-deivasigamani";
const EMAIL = "anjanadevan27@gmail.com";

// ── Palette helper ────────────────────────────────────────────────────────────
const P = (dark: boolean) =>
  dark
    ? {
        bg: "#1a0f14",
        bgAlt: "#221319",
        border: "rgba(194,116,138,0.22)",
        text: "#fdf6f9",
        textMuted: "#c4a0b0",
        textFaint: "#8a6070",
        rose: "#e08fa6",
        lavender: "#c9aee8",
        glow: "rgba(194,116,138,0.35)",
      }
    : {
        bg: "#fdf6f9",
        bgAlt: "#f7eef3",
        border: "rgba(194,116,138,0.18)",
        text: "#2d1f26",
        textMuted: "#7a5c68",
        textFaint: "#b09098",
        rose: "#c2748a",
        lavender: "#b497cf",
        glow: "rgba(194,116,138,0.22)",
      };

// ── Data (verbatim from index.html) ────────────────────────────────────────────
const PROJECTS = [
  {
    categories: ["LLM / NLP", "Cloud"],
    label: "LLM / NLP",
    title: "SellerCentral Chatbot",
    description: "Production-grade RAG pipeline (LangChain + LLaMA, FAISS retrieval) for Amazon sellers — 95% response accuracy at sub-2s latency, deployed on GCP Cloud Run.",
    tags: ["RAG", "LangChain", "FAISS", "LLaMA", "GCP"],
    link: `${SITE}/projects/project1.html`,
  },
  {
    categories: ["ML", "Data / SQL"],
    label: "ML",
    title: "The Beauty of Safety",
    description: "Toxicity analysis of 110K+ cosmetic-product records in R — 97% accuracy classifying product toxicity (Random Forest).",
    tags: ["R", "ggplot2", "Random Forest", "LightGBM"],
    link: `${SITE}/projects/project2.html`,
  },
  {
    categories: ["Data / SQL", "Cloud"],
    label: "Data / SQL",
    title: "DineTrack",
    description: "Cloud SQL restaurant analytics pipeline in R — tracked revenue growth from $303K to $1.26M across 2018–2024.",
    tags: ["MySQL", "GCP Cloud SQL", "R", "RMarkdown"],
    link: `${SITE}/projects/project3.html`,
  },
  {
    categories: ["ML"],
    label: "ML",
    title: "Customer Churn Prediction",
    description: "Streamlit app predicting telecom churn — Logistic Regression chosen from 5 models via GridSearchCV.",
    tags: ["Streamlit", "sklearn", "Joblib", "Python"],
    link: `${SITE}/projects/project4.html`,
  },
  {
    categories: ["Data / SQL", "Cloud"],
    label: "Cloud",
    title: "Boston MBTA Real-Time Dashboard",
    description: "Production ETL pipeline pulling live MBTA transit data every 2 minutes via Airflow on AWS — 16M+ predictions ingested, visualized in a live Streamlit dashboard.",
    tags: ["Airflow", "PostgreSQL", "AWS", "Streamlit", "Python"],
    link: `${SITE}/projects/project5.html`,
  },
  {
    categories: ["LLM / NLP", "Cloud"],
    label: "LLM / NLP",
    title: "AI Teaching Assistant",
    description: "AI platform for university courses — RAG Q&A over lecture PDFs, at-risk student detection, and AI quiz/slide generation, deployed on GCP Cloud Run.",
    tags: ["RAG", "FastAPI", "React", "pgvector", "GCP"],
    link: `${SITE}/projects/project6.html`,
  },
];

const STRENGTHS = [
  { n: "01", t: "Data Engineering on GCP", d: "Automated data validation and ETL pipelines — flagging anomalous records before BigQuery ingestion." },
  { n: "02", t: "LLM & RAG Systems", d: "RAG apps with LangChain, LLaMA, and pgvector, with Pydantic schema validation on LLM outputs." },
  { n: "03", t: "Reliability End to End", d: "Evaluating RAG for faithfulness, grounding, and hallucination — so systems hold up beyond the demo." },
];

const SKILLS: Record<string, string[]> = {
  Languages: ["Python", "R", "SQL", "Bash"],
  "AI & LLMs": ["RAG", "LangChain", "FAISS", "LLaMA", "Hugging Face", "OpenAI API", "pgvector", "Embeddings", "Prompt Engineering"],
  "ML Libraries": ["scikit-learn", "PyTorch", "TensorFlow", "XGBoost", "spaCy", "NLTK"],
  "Data Engineering": ["Apache Airflow", "FastAPI", "Docker", "Pandas", "BeautifulSoup"],
  "Data Validation & QA": ["Great Expectations", "Anomaly Detection", "Data Profiling", "JSON / Metadata"],
  "Cloud & Platforms": ["GCP", "BigQuery", "Cloud Run", "Cloud SQL", "GCS", "GitHub Actions"],
  Databases: ["MySQL", "PostgreSQL"],
  "Dashboards & Reporting": ["Tableau", "Streamlit", "Matplotlib", "Seaborn", "ggplot2"],
};

const EXPERIENCE = [
  {
    period: "Jul 2025 – Dec 2025",
    role: "Data Scientist Intern",
    company: "Beauty Intelligence LLC · Alabama, US",
    bullets: [
      "Eliminated ~4 hours of manual processing per cycle across 2M+ transactions per export by re-engineering bi-weekly Nielsen syndicated POS validation — migrating from manual Power Query workflows to automated Python scripts orchestrated via Apache Airflow.",
      "Built validation logic to detect and resolve malformed UPCs, schema inconsistencies, and anomalous product descriptors, ensuring data completeness before downstream BigQuery ingestion.",
      "Detected SKU-level anomalies across 40GB+ of data spanning 300+ hair care CPG brands; applied FP-Growth market basket analysis to surface co-purchase patterns that informed marketing and promotional strategy.",
      "Built a BigQuery ingestion pipeline surfacing cross-brand affinity signals for 10+ brands, replacing manual ad hoc reporting with self-serve Streamlit co-purchase dashboards.",
    ],
  },
  {
    period: "Jan 2023 – Jul 2023",
    role: "Software Developer Intern",
    company: "Mr. Cooper (Xome Pvt. Ltd.) · Chennai, India",
    bullets: [
      "Designed a relational data model in MS SQL Server for Xome's high-volume auction platform supporting 875,000+ registered bidders; defined indexing strategies and integrity constraints that improved lookup performance and prevented duplicate bids and race conditions during concurrent transactions.",
      "Authored complex SQL queries and stored procedures for auction lifecycle operations — bid tracking and transaction reconciliation supporting a platform with $16B+ in cumulative gross sales.",
      "Performed root-cause analysis on reconciliation mismatches, resolving data discrepancies to ensure transactional accuracy.",
      "Built a full-stack auction management prototype in C# and ASP.NET Core MVC to validate end-to-end data flows, surfacing schema design issues prior to production deployment.",
    ],
  },
];

const EDUCATION = [
  { year: "May 2026", degree: "Master of Science — Data Science", meta: "Northeastern University · Boston, MA", gpa: "3.67 / 4.0" },
  { year: "May 2023", degree: "Bachelor of Engineering — Computer Science & Engineering", meta: "Anna University · Chennai, India", gpa: "8.49 / 10.0" },
];

const PUBLICATIONS = [
  {
    title: "Customer Emotion Analysis on Food Review Images Using Deep Learning: A Review",
    link: "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003428473-44/customer-emotion-analysis-food-review-images-using-deep-learning-review-jagadeesh-akhilesh-ravikumar-anjana-deivasigamani-dharshini",
  },
  { title: "IEEE Smart Dustbin Using Node MCU", link: "https://ieeexplore.ieee.org/document/10128567" },
];

// ── Stagger fade-up hook ──────────────────────────────────────────────────────
function useFadeUp(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Scroll-spy: which nav section is currently centered ───────────────────────
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -55% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ value, dark }: { value: string; dark: boolean }) {
  const p = P(dark);
  const [n, setN] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const num = parseInt(value);
        if (isNaN(num)) {
          setN(value);
          return;
        }
        let start = 0;
        const dur = 1200,
          step = 16;
        const t = setInterval(() => {
          start += step;
          const prog = Math.min(start / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          setN(String(Math.round(ease * num)) + (value.includes("+") ? "+" : ""));
          if (prog >= 1) clearInterval(t);
        }, step);
        obs.disconnect();
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref} style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", fontWeight: 700, color: p.rose, lineHeight: 1 }}>{n}</span>;
}

// ── Section wrapper with fade-up (transparent — sits over the fixed mesh) ─────
function Section({ id, children, dark }: { id: string; children: React.ReactNode; dark: boolean }) {
  const { ref, visible } = useFadeUp(0.05);
  return (
    <section
      id={id}
      ref={ref}
      style={{
        position: "relative",
        padding: "6rem 0",
        transition: "opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
    >
      {children}
    </section>
  );
}

// ── Stagger-animated card wrapper ─────────────────────────────────────────────
function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeUp(0.1);
  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </div>
  );
}

// ── Section label / heading ───────────────────────────────────────────────────
function SectionLabel({ n, text, dark }: { n: string; text: string; dark: boolean }) {
  const p = P(dark);
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.13em", textTransform: "uppercase" as const, color: p.rose, display: "block", marginBottom: "0.75rem" }}>
      {n} — {text}
    </span>
  );
}
function SectionHeading({ line1, line2, dark }: { line1: string; line2: string; dark: boolean }) {
  const p = P(dark);
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", fontWeight: 700, color: p.text, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 }}>
      {line1}
      <br />
      <em style={{ color: p.rose, fontStyle: "italic" }}>{line2}</em>
    </h2>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const p = P(dark);

  const filters = ["All", "LLM / NLP", "ML", "Cloud", "Data / SQL"];
  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter((proj) => proj.categories.includes(activeFilter));

  const scrollTo = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];
  const activeSection = useActiveSection(navLinks.map((l) => l.id));

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", transition: "color 0.4s ease", color: p.text, background: p.bg }}>
      {/* Single fixed cursor-reactive mesh behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <CursorMesh dark={dark} style={{ position: "absolute" }} />
      </div>

      {/* Nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backdropFilter: "blur(12px)",
          background: dark ? "rgba(26,15,20,0.55)" : "rgba(253,246,249,0.55)",
          borderBottom: `1px solid ${p.border}`,
        }}
      >
        <a href="#hero" onClick={(e) => scrollTo(e, "hero")} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: p.text, textDecoration: "none", letterSpacing: "-0.01em" }}>
          Anjana<span style={{ color: p.rose }}>.</span>
        </a>

        {/* Floating pill nav with scroll-spy active chip */}
        <nav
          className="nav-links"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.25rem",
            padding: "0.3rem",
            borderRadius: "999px",
            background: dark ? "rgba(45,20,30,0.4)" : "rgba(255,255,255,0.45)",
            border: `1px solid ${p.border}`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 2px 16px ${p.glow}`,
          }}
        >
          {navLinks.map((l) => {
            const isActive = activeSection === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => scrollTo(e, l.id)}
                style={{
                  position: "relative",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "0.45rem 0.95rem",
                  borderRadius: "999px",
                  color: isActive ? "#fff" : p.textMuted,
                  background: isActive ? p.rose : "transparent",
                  boxShadow: isActive ? `0 2px 10px ${p.glow}` : "none",
                  transition: "color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = p.rose;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = p.textMuted;
                }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: dark ? "rgba(45,20,30,0.4)" : "rgba(255,255,255,0.45)",
            border: `1px solid ${p.border}`,
            borderRadius: "999px",
            padding: "0.45rem 0.95rem",
            cursor: "pointer",
            color: p.text,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.66rem",
            letterSpacing: "0.06em",
            backdropFilter: "blur(10px)",
            transition: "all 0.25s ease",
          }}
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
          {dark ? "Light" : "Dark"}
        </button>
      </header>

      {/* Content sits above the fixed mesh */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div className="hero-inner" style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "7rem 3rem 5rem" }}>
            <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "4rem", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(194,116,138,0.1)", border: "1px solid rgba(194,116,138,0.3)", borderRadius: "999px", padding: "0.3rem 0.9rem", marginBottom: "2rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.rose, display: "inline-block", animation: "pulse 2s infinite" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: p.rose, letterSpacing: "0.08em" }}>Open to internships & full-time roles</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 6.5rem)", fontWeight: 700, color: p.text, lineHeight: 1.0, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
                  Anjana
                  <br />
                  <em style={{ color: p.rose, fontStyle: "italic" }}>Deivasigamani</em>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ height: 1, width: 40, background: p.rose }} />
                  <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: p.textMuted, fontWeight: 400, letterSpacing: "0.02em", margin: 0 }}>Data Scientist · Data Analyst · AI / ML Engineer</p>
                </div>
                <p style={{ fontSize: "0.87rem", color: p.textFaint, marginBottom: "2.5rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>MS @ Northeastern University · LLMs · Cloud Pipelines · Analytics</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  <a
                    href="#projects"
                    onClick={(e) => scrollTo(e, "projects")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: p.rose, color: "#fff", padding: "0.85rem 2rem", borderRadius: "999px", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "transform 0.15s ease, box-shadow 0.15s ease", boxShadow: `0 4px 20px ${p.glow}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    View Projects
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => scrollTo(e, "contact")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: p.text, padding: "0.85rem 2rem", borderRadius: "999px", fontWeight: 500, fontSize: "0.95rem", textDecoration: "none", border: `1.5px solid ${p.border}`, transition: "all 0.15s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = p.rose;
                      e.currentTarget.style.color = p.rose;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = p.border;
                      e.currentTarget.style.color = p.text;
                    }}
                  >
                    Get in Touch
                  </a>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {[
                    { href: GITHUB_URL, icon: <Github size={16} />, label: "GitHub" },
                    { href: LINKEDIN_URL, icon: <Linkedin size={16} />, label: "LinkedIn" },
                    { href: `mailto:${EMAIL}`, icon: <Mail size={16} />, label: "Email" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: p.textMuted, fontSize: "0.8rem", textDecoration: "none", padding: "0.4rem 0.85rem", border: `1px solid ${p.border}`, borderRadius: "999px", transition: "all 0.2s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = p.rose;
                        e.currentTarget.style.borderColor = p.rose;
                        e.currentTarget.style.background = "rgba(194,116,138,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = p.textMuted;
                        e.currentTarget.style.borderColor = p.border;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>
              {/* Portrait — static shape, animated rotating halo behind it */}
              <div className="portrait-col" style={{ position: "relative", flexShrink: 0, width: 290, height: 350, margin: "0 auto" }}>
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "-28px",
                    borderRadius: "50%",
                    background: "conic-gradient(from 0deg, rgba(194,116,138,0.55), rgba(180,151,207,0.5), rgba(194,116,138,0), rgba(194,116,138,0.55))",
                    filter: "blur(28px)",
                    animation: "haloSpin 14s linear infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
                <div style={{ position: "absolute", inset: "-14px", borderRadius: "62% 38% 55% 45% / 52% 48% 52% 48%", border: `1px solid ${p.border}`, pointerEvents: "none", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, width: 290, height: 350, borderRadius: "62% 38% 55% 45% / 52% 48% 52% 48%", overflow: "hidden", border: `2px solid ${p.border}`, background: "linear-gradient(135deg, rgba(194,116,138,0.1), rgba(180,151,207,0.1))" }}>
                  <img src={PROFILE_URL} alt="Anjana Deivasigamani" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="hero-stats" style={{ display: "flex", marginTop: "5rem", borderTop: `1px solid ${p.border}`, paddingTop: "2rem", maxWidth: 700 }}>
              {[
                { v: "6", l: "Featured Projects" },
                { v: "2", l: "Publications" },
                { v: "2", l: "Internships" },
                { v: "1+", l: "Year of Experience" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: i === 0 ? "left" : "center", paddingRight: "1rem", borderRight: i < 3 ? `1px solid ${p.border}` : "none", paddingLeft: i > 0 ? "1rem" : 0 }}>
                  <Counter value={s.v} dark={dark} />
                  <div style={{ fontSize: "0.7rem", color: p.textMuted, marginTop: 3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
            @keyframes haloSpin{to{transform:rotate(360deg)}}
          `}</style>
        </section>

        {/* ── ABOUT + WHAT I BRING ── */}
        <Section id="about" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start", marginBottom: "4rem" }}>
              <div>
                <SectionLabel n="01" text="About" dark={dark} />
                <SectionHeading line1="Data science" line2="that ships." dark={dark} />
              </div>
              <div style={{ paddingTop: "1rem" }}>
               <p style={{ color: p.textMuted, lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, margin: 0 }}>
                I'm a Data Scientist with a Master's in Data Science from Northeastern University, open to internships and full time roles as a <em style={{ color: p.rose, fontStyle: "normal", fontWeight: 600 }}>Data Scientist</em>, <em style={{ color: p.rose, fontStyle: "normal", fontWeight: 600 }}>Data Analyst</em>, or <em style={{ color: p.rose, fontStyle: "normal", fontWeight: 600 }}>AI/ML Engineer</em>. My work spans data engineering, NLP, and RAG systems — building automated validation pipelines on GCP, RAG applications with LangChain and pgvector, and evaluating LLM outputs for faithfulness and hallucination so systems hold up beyond the demo.
              </p>
              </div>
            </div>

            {/* What I Bring to the Table */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: p.text, margin: 0 }}>What I Bring to the Table</h3>
              <p style={{ color: p.textMuted, marginTop: "0.5rem", fontSize: "0.95rem" }}>More than a tech stack — here's how I work.</p>
            </div>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
              {STRENGTHS.map((item, i) => (
                <FadeCard key={i} delay={i * 90}>
                  <SpotlightZoomCard label={item.n} title={item.t} description={item.d} dark={dark} />
                </FadeCard>
              ))}
            </div>
          </div>
        </Section>

        {/* ── PROJECTS ── */}
        <Section id="projects" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <SectionLabel n="02" text="Projects" dark={dark} />
                <SectionHeading line1="The work" line2="that matters." dark={dark} />
                <p style={{ color: p.textMuted, marginTop: "0.75rem", fontSize: "0.95rem" }}>Filter by what you're looking for:</p>
              </div>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignSelf: "flex-end" }}>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", padding: "0.42rem 1rem", borderRadius: "999px", border: `1.5px solid ${activeFilter === f ? p.rose : p.border}`, background: activeFilter === f ? p.rose : "transparent", color: activeFilter === f ? "#fff" : p.rose, cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
              {filtered.map((proj, i) => {
                const { categories, ...card } = proj;
                void categories;
                return (
                  <FadeCard key={proj.title} delay={i * 90}>
                    <SpotlightZoomCard {...card} linkLabel="View Project" dark={dark} />
                  </FadeCard>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "5rem", alignItems: "start" }}>
              <div style={{ position: "sticky", top: "6rem" }}>
                <SectionLabel n="03" text="Experience" dark={dark} />
                <SectionHeading line1="Where I've" line2="shipped." dark={dark} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {EXPERIENCE.map((exp, i) => (
                  <FadeCard key={i} delay={i * 150}>
                    <SpotlightZoomCard label={exp.period} title={`${exp.role} · ${exp.company}`} bullets={exp.bullets} dark={dark} />
                  </FadeCard>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <SectionLabel n="04" text="Education" dark={dark} />
            <SectionHeading line1="Where it" line2="started." dark={dark} />
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "3rem" }}>
              {EDUCATION.map((edu, i) => (
                <FadeCard key={i} delay={i * 120}>
                  <SpotlightZoomCard label={edu.year} title={edu.degree} description={edu.meta} tags={[`GPA ${edu.gpa}`]} dark={dark} />
                </FadeCard>
              ))}
            </div>
          </div>
        </Section>

        {/* ── PUBLICATIONS ── */}
        <Section id="publications" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <SectionLabel n="05" text="Publications" dark={dark} />
            <SectionHeading line1="Research" line2="worth citing." dark={dark} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "3rem" }}>
              {PUBLICATIONS.map((pub, i) => (
                <FadeCard key={i} delay={i * 120}>
                  <SpotlightZoomCard label={`0${i + 1}`} title={pub.title} link={pub.link} linkLabel="Read Publication" dark={dark} />
                </FadeCard>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "5rem", alignItems: "start" }}>
              <div style={{ position: "sticky", top: "6rem" }}>
                <SectionLabel n="06" text="Skills" dark={dark} />
                <SectionHeading line1="The full" line2="stack." dark={dark} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: "1rem" }}>
                {Object.entries(SKILLS).map(([cat, skills], i) => (
                  <FadeCard key={cat} delay={i * 70}>
                    <SpotlightZoomCard label={cat} title="" tags={skills} dark={dark} />
                  </FadeCard>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── RESUME ── */}
        <Section id="resume" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <div>
                <SectionLabel n="07" text="Resume" dark={dark} />
                <SectionHeading line1="The full" line2="picture." dark={dark} />
                <p style={{ color: p.textMuted, fontSize: "1rem", lineHeight: 1.7, marginTop: "1.25rem" }}>You can view or download my resume below:</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: p.rose, color: "#fff", padding: "1rem 2.25rem", borderRadius: "999px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", boxShadow: `0 4px 20px ${p.glow}`, transition: "transform 0.15s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  <FileText size={18} /> View Resume
                </a>
                <a
                  href={RESUME_URL}
                  download
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "transparent", color: p.text, padding: "1rem 2.25rem", borderRadius: "999px", fontWeight: 500, fontSize: "1rem", textDecoration: "none", border: `1.5px solid ${p.border}`, transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = p.rose;
                    e.currentTarget.style.color = p.rose;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = p.border;
                    e.currentTarget.style.color = p.text;
                  }}
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* ── CONTACT ── (opaque dark section covers the mesh) */}
        <section id="contact" style={{ position: "relative", padding: "8rem 0", background: dark ? "#0f080c" : "#2d1f26", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,116,138,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,151,207,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="section-inner grid-collapse" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(224,143,166,0.7)", display: "block", marginBottom: "1rem" }}>08 — Contact</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, color: "#fdf6f9", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                Get in
                <br />
                <em style={{ color: "#e08fa6", fontStyle: "italic" }}>touch.</em>
              </h2>
              <p style={{ color: "rgba(253,246,249,0.55)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 480 }}>Have a role, a question, or just want to say hi? My inbox is open.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
              <a
                href={`mailto:${EMAIL}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "#e08fa6", color: "#fff", padding: "1.1rem 2.5rem", borderRadius: "999px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", boxShadow: "0 4px 24px rgba(194,116,138,0.45)", transition: "transform 0.15s ease", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <Mail size={18} /> {EMAIL}
              </a>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { href: GITHUB_URL, icon: <Github size={16} />, label: "GitHub" },
                  { href: LINKEDIN_URL, icon: <Linkedin size={16} />, label: "LinkedIn" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(253,246,249,0.55)", fontSize: "0.85rem", textDecoration: "none", padding: "0.5rem 1rem", border: "1px solid rgba(253,246,249,0.15)", borderRadius: "999px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#e08fa6";
                      e.currentTarget.style.borderColor = "rgba(224,143,166,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(253,246,249,0.55)";
                      e.currentTarget.style.borderColor = "rgba(253,246,249,0.15)";
                    }}
                  >
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: dark ? "#0f080c" : "#2d1f26", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 3rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(253,246,249,0.4)", letterSpacing: "0.05em" }}>© 2026 Anjana Deivasigamani</span>
        </footer>
      </div>
    </div>
  );
}
