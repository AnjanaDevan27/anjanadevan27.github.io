/* ================================================
   script.js  — Shared across index + project pages
   Load on EVERY page (before </body>):
     <script src="script.js"></script>       ← index.html
     <script src="../script.js"></script>    ← projects/project#.html
================================================ */


/* ================================================
   1. AOS  — scroll-reveal animations
================================================ */
if (window.AOS) {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out',
    anchorPlacement: 'top-bottom'
  });
}


/* ================================================
   2. Theme Toggle  — persists across all pages
   Default: light (pink). Toggle → dark-theme.
================================================ */
const themeBtn = document.getElementById("theme-toggle");

// Apply saved theme immediately (prevents flash)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  if (themeBtn) themeBtn.innerHTML = `<i class="fas fa-sun"></i>`;
} else {
  if (themeBtn) themeBtn.innerHTML = `<i class="fas fa-moon"></i>`;
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeBtn.innerHTML = isDark
      ? `<i class="fas fa-sun"></i>`   // sun = go back to light
      : `<i class="fas fa-moon"></i>`; // moon = go to dark
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}


/* ================================================
   3. Nav: solid background on scroll
================================================ */
const navEl = document.querySelector("nav");

function setNavScrolled() {
  if (!navEl) return;
  navEl.classList.toggle("scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", setNavScrolled);
setNavScrolled(); // run once on load


/* ================================================
   4. Active nav link highlight while scrolling
   Works on index (section[id]) and project pages
   (highlights the "Projects" link via data-page attr)
================================================ */
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll("nav ul li a");

function activateNav() {
  // Project pages: mark active via data-page on <body>
  const bodyPage = document.body.dataset.page;
  if (bodyPage) {
    navLinks.forEach(a => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href.includes(bodyPage));
    });
    return;
  }

  // Index page: highlight by scroll position
  let currentId = "";
  const midpoint = window.innerHeight / 2;
  sections.forEach(sec => {
    const r = sec.getBoundingClientRect();
    if (r.top <= midpoint && r.bottom >= midpoint) currentId = sec.id;
  });
  navLinks.forEach(a => {
    const target = a.getAttribute("href")?.replace(/.*#/, "");
    a.classList.toggle("active", target === currentId);
  });
}

window.addEventListener("scroll", activateNav);
window.addEventListener("resize", activateNav);
window.addEventListener("load",   activateNav);


/* ================================================
   5. Typed.js  — index.html About heading only
================================================ */
const typedEl = document.querySelector("#about-typed");
if (typedEl && window.Typed) {
  new Typed("#about-typed", {
    strings: ["I'm Anjana", "Data Scientist.", "Data Analyst.", "AI/ML Engineer."],
    typeSpeed: 62,
    backSpeed: 28,
    backDelay: 1200,
    loop: true,
    smartBackspace: true,
    showCursor: true,
    cursorChar: "▌"
  });
}


/* ================================================
   6. Profile image modal  — index.html only
================================================ */
function openFullImage() {
  const m = document.getElementById("fullImageModal");
  if (m) m.style.display = "block";
}

function closeFullImage() {
  const m = document.getElementById("fullImageModal");
  if (m) m.style.display = "none";
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeFullImage();
});


/* ================================================
   7. Dynamic cursor CSS vars  — index.html only
   (drives radial-gradient glow if re-enabled)
================================================ */
document.addEventListener("mousemove", e => {
  document.documentElement.style.setProperty("--x", e.clientX + "px");
  document.documentElement.style.setProperty("--y", e.clientY + "px");
});


/* ================================================
   8. Back link  — project pages only
   Enables browser back OR falls back to index
================================================ */
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