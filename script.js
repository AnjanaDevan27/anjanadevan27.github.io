/* ================================================
   script.js — shared across index + project pages
     index.html            → <script src="script.js">
     projects/project#.html → <script src="../script.js">
================================================ */

/* ── 0. Motion / device preferences ── */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ── 1. AOS — scroll-reveal animations (with staggered children) ── */
if (window.AOS) {
  // Give grid/timeline children a gentle cascade so sections "unfold"
  // instead of popping in all at once.
  if (!prefersReduced) {
    document.querySelectorAll(".grid, .skills-grid, .value-grid, .timeline").forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        if (!child.hasAttribute("data-aos")) child.setAttribute("data-aos", "fade-up");
        child.setAttribute("data-aos-delay", String((i % 4) * 90));
      });
    });
  }
  AOS.init({
    duration: 700,
    once: true,
    easing: "ease-out-cubic",
    offset: 80,
    anchorPlacement: "top-bottom"
  });
} else {
  // Safety net: if the AOS library didn't load, reveal everything so no
  // section is ever stuck invisible.
  document.querySelectorAll("[data-aos]").forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

/* ── 2. Theme toggle (persists across pages) ── */
const themeBtn = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}
function syncThemeIcon() {
  if (!themeBtn) return;
  const dark = document.body.classList.contains("dark-theme");
  themeBtn.innerHTML = dark ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
}
syncThemeIcon();

// Bridge the page theme into the same-origin thumbnail iframes so their
// animations match light/dark instead of staying bright on dark cards.
function syncThumbTheme() {
  const isDark = document.body.classList.contains("dark-theme");
  document.querySelectorAll(".card-thumb iframe").forEach(frame => {
    try {
      frame.contentDocument?.documentElement.classList.toggle("dark", isDark);
    } catch (e) { /* cross-origin / not ready — ignore */ }
  });
}
document.querySelectorAll(".card-thumb iframe").forEach(frame => {
  frame.addEventListener("load", syncThumbTheme);
});
window.addEventListener("load", syncThumbTheme);
syncThumbTheme();

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    syncThemeIcon();
    syncThumbTheme();
  });
}

/* ── 3. Scroll progress bar + topbar shadow + back-to-top ── */
const progressBar = document.getElementById("scrollProgress");
const topbar      = document.getElementById("topbar");
const backToTop   = document.getElementById("backToTop");

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = pct + "%";
  if (topbar) topbar.classList.toggle("scrolled", scrollTop > 30);
  if (backToTop) backToTop.classList.toggle("show", scrollTop > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ── 4. Active nav highlight (top nav + side dots) ── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".topnav a");

function activateNav() {
  if (!sections.length) return;
  let currentId = "";
  const probe = window.scrollY + window.innerHeight * 0.35;

  sections.forEach(sec => {
    if (sec.offsetTop <= probe) currentId = sec.id;
  });

  navLinks.forEach(a => {
    const target = (a.getAttribute("href") || "").replace(/.*#/, "");
    a.classList.toggle("active", target === currentId);
  });
}
window.addEventListener("scroll", activateNav, { passive: true });
window.addEventListener("resize", activateNav);
window.addEventListener("load", activateNav);

/* ── 5. Mobile menu toggle ── */
const navToggle = document.getElementById("nav-toggle");
const topnav    = document.getElementById("topnav");

if (navToggle && topnav) {
  navToggle.addEventListener("click", () => {
    const open = topnav.classList.toggle("open");
    navToggle.innerHTML = open
      ? `<i class="fas fa-times"></i>`
      : `<i class="fas fa-bars"></i>`;
  });
  // close after picking a link
  topnav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      topnav.classList.remove("open");
      navToggle.innerHTML = `<i class="fas fa-bars"></i>`;
    })
  );
}

/* ── 6. Typed.js — hero role + about heading ── */
if (window.Typed) {
  if (document.querySelector("#hero-typed")) {
    new Typed("#hero-typed", {
      strings: ["Data Scientist", "Data Analyst", "AI / ML Engineer"],
      typeSpeed: 60,
      backSpeed: 28,
      backDelay: 1400,
      loop: true,
      smartBackspace: true,
      cursorChar: "▌"
    });
  }
  if (document.querySelector("#about-typed")) {
    new Typed("#about-typed", {
      strings: ["Nice to meet you", "A little about me"],
      typeSpeed: 62,
      backSpeed: 28,
      backDelay: 1600,
      loop: true,
      smartBackspace: true,
      cursorChar: "▌"
    });
  }
}

/* ── 7. Animated stat counters (run when scrolled into view) ── */
const statNums = document.querySelectorAll(".stat-num");
if (statNums.length && "IntersectionObserver" in window) {
  const countUp = el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));
}

/* ── 8. Project filtering ── */
const filterBar  = document.getElementById("projectFilters");
const projItems  = document.querySelectorAll("#projectGrid .card-link");
const filterEmpty = document.getElementById("filterEmpty");

if (filterBar) {
  filterBar.addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;

    filterBar.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    let visible = 0;

    projItems.forEach(item => {
      const tags = (item.dataset.tags || "").split(/\s+/);
      const show = filter === "all" || tags.includes(filter);
      item.classList.toggle("filtered-out", !show);
      if (show) {
        visible++;
        item.classList.remove("filtering");
        void item.offsetWidth;        // restart entrance animation
        item.classList.add("filtering");
      }
    });

    if (filterEmpty) filterEmpty.hidden = visible !== 0;
  });
}

/* ── 9. Profile image modal (index only) ── */
function openFullImage() {
  const m = document.getElementById("fullImageModal");
  if (m) m.style.display = "flex";
}
function closeFullImage() {
  const m = document.getElementById("fullImageModal");
  if (m) m.style.display = "none";
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeFullImage();
});

/* ── 10. Back link (project pages) ── */
const backLink = document.querySelector(".back-link");
if (backLink) {
  backLink.addEventListener("click", e => {
    e.preventDefault();
    if (document.referrer.includes(location.hostname)) {
      history.back();
    } else {
      location.href = backLink.getAttribute("href") || "../index.html";
    }
  });
}

/* ── 11. Gentle 3D tilt on cards (desktop, motion-friendly) ── */
if (finePointer && !prefersReduced) {
  const TILT = 6; // max degrees — subtle on purpose
  document.querySelectorAll(".card, .value-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "transform 0.08s ease";
      card.style.transform =
        `perspective(800px) translateY(-6px) rotateX(${(-py * TILT).toFixed(2)}deg) rotateY(${(px * TILT).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
}

/* ── 12. Calm cursor glow that trails the pointer (desktop) ── */
if (finePointer && !prefersReduced) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let tx = gx, ty = gy, shown = false;

  window.addEventListener("pointermove", e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!shown) { glow.classList.add("visible"); shown = true; }
  });

  (function trail() {
    gx += (tx - gx) * 0.12;  // ease toward the cursor for a soft lag
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(trail);
  })();
}
