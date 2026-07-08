/**
 * Anjana Deivasigamani Portfolio — minimal build
 * Background: single fixed Cursor-reactive Gradient Mesh (CursorMesh)
 * Cards: Spotlight Glow + Zoom/Lift (SpotlightZoomCard)
 * Scroll: Stagger Fade-Up on all section blocks
 * Mode: Dark / Light toggle
 *
 * Palette: rose #c2748a | lavender #b497cf | bg-light #fdf6f9 | bg-dark #1a0f14
 * Fonts: Playfair Display (headings) · DM Sans (body) · JetBrains Mono (tags/labels)
 */
import { useEffect, useRef, useState, useCallback } from "react";
import CursorMesh from "../components/CursorMesh";
import SpotlightZoomCard from "../components/SpotlightZoomCard";
import { Github, Linkedin, FileText, Mail, Sun, Moon } from "lucide-react";

// ── Constants ───────────────────────────────────────────────────────────────
const RESUME_URL = "https://anjanadevan27.github.io/resume/Anjana_Deivasigamani_Resume_main.pdf";
const PROFILE_URL = "https://anjanadevan27.github.io/images/profile.jpg";
const GITHUB_URL = "https://github.com/anjanadevan27";
const LINKEDIN_URL = "https://linkedin.com/in/anjana-deivasigamani";
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

// ── Data ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { label: "LLM / NLP", title: "SellerCentral Chatbot", description: "Production RAG pipeline (LangChain + LLaMA, FAISS) for Amazon sellers — 95% accuracy at sub-2s latency on GCP Cloud Run.", tags: ["RAG", "LangChain", "FAISS", "LLaMA", "GCP"], link: GITHUB_URL },
  { label: "ML", title: "The Beauty of Safety", description: "Toxicity analysis of 110K+ cosmetic records in R — 97% accuracy classifying product toxicity with Random Forest.", tags: ["R", "ggplot2", "Random Forest", "LightGBM"], link: GITHUB_URL },
  { label: "Data / SQL", title: "DineTrack", description: "Cloud SQL restaurant analytics pipeline — tracked revenue growth from $303K to $1.26M across 2018–2024.", tags: ["MySQL", "GCP Cloud SQL", "R", "RMarkdown"], link: GITHUB_URL },
  { label: "ML", title: "Customer Churn Prediction", description: "Streamlit app predicting telecom churn — Logistic Regression chosen from 5 models via GridSearchCV.", tags: ["Streamlit", "sklearn", "Joblib", "Python"], link: GITHUB_URL },
  { label: "Cloud", title: "Boston MBTA Dashboard", description: "ETL pipeline pulling live MBTA transit data every 2 min via Airflow on AWS — 16M+ predictions, live Streamlit dashboard.", tags: ["Airflow", "PostgreSQL", "AWS", "Streamlit"], link: GITHUB_URL },
  { label: "LLM / NLP", title: "AI Teaching Assistant", description: "RAG Q&A over lecture PDFs, at-risk student detection, AI quiz/slide generation — deployed on GCP Cloud Run.", tags: ["RAG", "FastAPI", "React", "pgvector", "GCP"], link: GITHUB_URL },
];

const SKILLS: Record<string, string[]> = {
  Languages: ["Python", "R", "SQL", "Bash"],
  "AI & LLMs": ["RAG", "LangChain", "FAISS", "LLaMA", "Hugging Face", "OpenAI API", "pgvector", "Embeddings"],
  "ML Libraries": ["scikit-learn", "PyTorch", "TensorFlow", "XGBoost", "spaCy", "NLTK"],
  "Data Engineering": ["Apache Airflow", "FastAPI", "Docker", "Pandas", "BeautifulSoup"],
  "Data Validation": ["Great Expectations", "Anomaly Detection", "Data Profiling"],
  "Cloud & Platforms": ["GCP", "BigQuery", "Cloud Run", "Cloud SQL", "GCS", "GitHub Actions"],
  Databases: ["MySQL", "PostgreSQL"],
  Dashboards: ["Tableau", "Streamlit", "Matplotlib", "Seaborn", "ggplot2"],
};

const EXPERIENCE = [
  {
    period: "Jul 2025 – Dec 2025",
    role: "Data Scientist Intern",
    company: "Beauty Intelligence LLC",
    location: "Alabama, US",
    bullets: [
      "Re-engineered bi-weekly Nielsen POS validation with Python + Apache Airflow — eliminated ~4 hrs of manual processing per cycle across 2M+ transactions.",
      "Built validation logic to detect malformed UPCs, schema inconsistencies, and anomalous product descriptors before BigQuery ingestion.",
      "Detected SKU-level anomalies across 40GB+ data for 300+ hair care CPG brands; applied FP-Growth market basket analysis to surface co-purchase patterns.",
      "Built a BigQuery ingestion pipeline surfacing cross-brand affinity signals for 10+ brands, replacing manual ad hoc reporting with self-serve Streamlit dashboards.",
    ],
  },
  {
    period: "Jan 2023 – Jul 2023",
    role: "Software Developer Intern",
    company: "Mr. Cooper (Xome Pvt. Ltd.)",
    location: "Chennai, India",
    bullets: [
      "Designed a relational data model in MS SQL Server for Xome's auction platform — 875,000+ registered bidders.",
      "Authored complex SQL queries and stored procedures for auction lifecycle operations on a $16B+ gross sales platform.",
      "Built a full-stack auction management prototype in C# and ASP.NET Core MVC to validate end-to-end data flows.",
    ],
  },
];

const EDUCATION = [
  { year: "May 2026", degree: "Master of Science — Data Science", school: "Northeastern University", location: "Boston, MA", gpa: "3.67 / 4.0" },
  { year: "May 2023", degree: "B.E. — Computer Science & Engineering", school: "Anna University", location: "Chennai, India", gpa: "8.49 / 10.0" },
];

const PUBLICATIONS = [
  { title: "Customer Emotion Analysis on Food Review Images Using Deep Learning: A Review", link: "#" },
  { title: "IEEE Smart Dustbin Using Node MCU", link: "#" },
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
  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter((proj) => proj.label === activeFilter);

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
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <nav className="nav-links" style={{ display: "flex", gap: "1.75rem" }}>
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => scrollTo(e, l.id)}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: p.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = p.rose)}
                onMouseLeave={(e) => (e.currentTarget.style.color = p.textMuted)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${p.border}`,
              borderRadius: "999px",
              padding: "0.4rem 0.9rem",
              cursor: "pointer",
              color: p.text,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.66rem",
              letterSpacing: "0.06em",
              transition: "all 0.25s ease",
            }}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>
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
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: p.rose, letterSpacing: "0.08em" }}>Open to full-time roles · Boston, MA</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 6.5rem)", fontWeight: 700, color: p.text, lineHeight: 1.0, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
                  Anjana
                  <br />
                  <em style={{ color: p.rose, fontStyle: "italic" }}>Deivasigamani</em>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ height: 1, width: 40, background: p.rose }} />
                  <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: p.textMuted, fontWeight: 400, letterSpacing: "0.02em", margin: 0 }}>Data Scientist · ML Engineer</p>
                </div>
                <p style={{ fontSize: "0.87rem", color: p.textFaint, marginBottom: "2.5rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>MS @ Northeastern · LLMs · Cloud Pipelines · Analytics</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  <a
                    href="#projects"
                    onClick={(e) => scrollTo(e, "projects")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: p.rose, color: "#fff", padding: "0.85rem 2rem", borderRadius: "999px", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "transform 0.15s ease, box-shadow 0.15s ease", boxShadow: `0 4px 20px ${p.glow}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    See the work →
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
                    Let's talk
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
              {/* Portrait */}
              <div className="portrait-col" style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: "-14px", borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%", border: `1px solid ${p.border}`, animation: "morphRing 8s ease-in-out infinite", pointerEvents: "none" }} />
                <div style={{ width: 290, height: 350, borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%", overflow: "hidden", border: `2px solid ${p.border}`, background: "linear-gradient(135deg, rgba(194,116,138,0.1), rgba(180,151,207,0.1))", animation: "morphRing 8s ease-in-out infinite" }}>
                  <img src={PROFILE_URL} alt="Anjana Deivasigamani" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
                <div style={{ position: "absolute", bottom: -14, left: -22, background: dark ? "rgba(34,19,25,0.95)" : "rgba(253,246,249,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${p.border}`, borderRadius: "1rem", padding: "0.7rem 1.2rem", boxShadow: `0 8px 24px ${p.glow}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: p.rose, lineHeight: 1 }}>6</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: p.textMuted, marginTop: 2 }}>Projects shipped</div>
                </div>
                <div style={{ position: "absolute", top: -14, right: -22, background: dark ? "rgba(34,19,25,0.95)" : "rgba(253,246,249,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${p.border}`, borderRadius: "1rem", padding: "0.7rem 1.2rem", boxShadow: `0 8px 24px ${p.glow}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: p.lavender, lineHeight: 1 }}>3.67</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: p.textMuted, marginTop: 2 }}>MS GPA</div>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="hero-stats" style={{ display: "flex", marginTop: "5rem", borderTop: `1px solid ${p.border}`, paddingTop: "2rem", maxWidth: 700 }}>
              {[
                { v: "6", l: "Projects" },
                { v: "2", l: "Publications" },
                { v: "2", l: "Internships" },
                { v: "3+", l: "Years Coding" },
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
            @keyframes morphRing{0%,100%{border-radius:40% 60% 55% 45%/45% 40% 60% 55%}33%{border-radius:55% 45% 40% 60%/60% 55% 45% 40%}66%{border-radius:45% 55% 60% 40%/40% 60% 55% 45%}}
          `}</style>
        </section>

        {/* ── ABOUT ── */}
        <Section id="about" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start", marginBottom: "3.5rem" }}>
              <div>
                <SectionLabel n="01" text="About" dark={dark} />
                <SectionHeading line1="Data science" line2="that ships." dark={dark} />
              </div>
              <div style={{ paddingTop: "1rem" }}>
                <p style={{ color: p.textMuted, lineHeight: 1.85, fontSize: "1.05rem", marginBottom: "1.25rem", fontWeight: 300 }}>
                  I build RAG-powered chatbots, toxicity classifiers, churn prediction models, and cloud data pipelines — across GCP, BigQuery, MySQL, and more. Actively seeking full-time roles as a <strong style={{ color: p.rose, fontWeight: 600 }}>Data Scientist</strong>, <strong style={{ color: p.rose, fontWeight: 600 }}>Data Analyst</strong>, or <strong style={{ color: p.rose, fontWeight: 600 }}>AI/ML Engineer</strong>.
                </p>
                <p style={{ color: p.textFaint, lineHeight: 1.85, fontSize: "0.95rem", fontWeight: 300 }}>The best insights come from asking the right question — and I'm never short of those.</p>
              </div>
            </div>
            <div className="grid-collapse" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
              {[
                { n: "01", t: "End-to-End Ownership", d: "EDA → modeling → deployed product with FastAPI & Streamlit on GCP." },
                { n: "02", t: "Production-Minded ML", d: "Automated validation, test suites, and CI/CD over cloud pipelines." },
                { n: "03", t: "Business Impact", d: "Co-purchase insights, revenue trends, dashboards teams actually use." },
                { n: "04", t: "Clarity & Curiosity", d: "Complex results, plain language. I ask the question behind the question." },
              ].map((item, i) => (
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
              {filtered.map((proj, i) => (
                <FadeCard key={proj.title} delay={i * 90}>
                  <SpotlightZoomCard {...proj} linkLabel="View Project" dark={dark} />
                </FadeCard>
              ))}
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
                <p style={{ color: p.textMuted, marginTop: "1rem", fontSize: "0.88rem", lineHeight: 1.7 }}>Two internships. Real pipelines. Production impact.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {EXPERIENCE.map((exp, i) => (
                  <FadeCard key={i} delay={i * 150}>
                    <SpotlightZoomCard label={exp.period} title={`${exp.role} · ${exp.company}`} description={exp.bullets.join(" ")} tags={[exp.location]} dark={dark} />
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
                  <SpotlightZoomCard label={edu.year} title={edu.degree} description={`${edu.school} · ${edu.location}`} tags={[`GPA ${edu.gpa}`]} dark={dark} />
                </FadeCard>
              ))}
            </div>
          </div>
        </Section>

        {/* ── PUBLICATIONS ── */}
        <Section id="publications" dark={dark}>
          <div className="section-inner" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 3rem" }}>
            <SectionLabel n="05" text="Publications" dark={dark} />
            <SectionHeading line1="Research" line2="that ships." dark={dark} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "3rem" }}>
              {PUBLICATIONS.map((pub, i) => (
                <FadeCard key={i} delay={i * 120}>
                  <SpotlightZoomCard label={`0${i + 1}`} title={pub.title} description="" link={pub.link !== "#" ? pub.link : undefined} linkLabel="Read →" dark={dark} />
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
                <p style={{ color: p.textMuted, marginTop: "1rem", fontSize: "0.88rem", lineHeight: 1.7 }}>Tools I reach for when the problem gets hard.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: "1rem" }}>
                {Object.entries(SKILLS).map(([cat, skills], i) => (
                  <FadeCard key={cat} delay={i * 70}>
                    <SpotlightZoomCard label={cat} title="" description="" tags={skills} dark={dark} />
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
                <p style={{ color: p.textMuted, fontSize: "1rem", lineHeight: 1.7, marginTop: "1.25rem" }}>One document. Every proof point. View or download below.</p>
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
                  Download PDF
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
                Have a hard
                <br />
                problem?
                <br />
                <em style={{ color: "#e08fa6", fontStyle: "italic" }}>I'll ship it.</em>
              </h2>
              <p style={{ color: "rgba(253,246,249,0.55)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 480 }}>Open to full-time Data Scientist, Data Analyst, and AI/ML Engineer roles. Reach out directly — I respond within 24 hours.</p>
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
        <footer style={{ background: dark ? "#0f080c" : "#2d1f26", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "rgba(253,246,249,0.45)" }}>Anjana Deivasigamani</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(253,246,249,0.28)", letterSpacing: "0.05em" }}>© 2026</span>
        </footer>
      </div>
    </div>
  );
}
