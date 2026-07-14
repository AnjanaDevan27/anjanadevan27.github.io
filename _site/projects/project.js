/* Project detail pages — theme toggle, scroll progress, and a cursor-reactive
   gradient mesh that mirrors the React portfolio's CursorMesh. Vanilla JS, no deps. */
(function () {
  // ── Theme (persisted, respects system preference) ──
  var saved = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) document.body.classList.add("dark");

  var toggle = document.getElementById("theme-toggle");
  function syncIcon() {
    if (!toggle) return;
    var dark = document.body.classList.contains("dark");
    toggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  syncIcon();
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      syncIcon();
    });
  }

  // ── Scroll progress bar ──
  var bar = document.getElementById("scrollProgress");
  if (bar) {
    window.addEventListener(
      "scroll",
      function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      },
      { passive: true },
    );
  }

  // ── Cursor-reactive gradient mesh ──
  var canvas = document.getElementById("mesh");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var mouse = { x: 0.5, y: 0.5 };
  var target = { x: 0.5, y: 0.5 };

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", function (e) {
    target.x = e.clientX / window.innerWidth;
    target.y = e.clientY / window.innerHeight;
  });
  window.addEventListener(
    "touchmove",
    function (e) {
      if (!e.touches[0]) return;
      target.x = e.touches[0].clientX / window.innerWidth;
      target.y = e.touches[0].clientY / window.innerHeight;
    },
    { passive: true },
  );

  function draw(ts) {
    var t = ts * 0.0004;
    var W = canvas.offsetWidth;
    var H = canvas.offsetHeight;
    var dark = document.body.classList.contains("dark");

    mouse.x += (target.x - mouse.x) * 0.5;
    mouse.y += (target.y - mouse.y) * 0.5;
    var mx = mouse.x;
    var my = mouse.y;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = dark ? "#1a0f14" : "#fdf6f9";
    ctx.fillRect(0, 0, W, H);

    var blobs = [
      { cx: 0.2 + Math.sin(t * 0.7) * 0.12, cy: 0.3 + Math.cos(t * 0.5) * 0.1, r: 0.55, color: dark ? "rgba(194,116,138,0.18)" : "rgba(194,116,138,0.12)" },
      { cx: 0.8 + Math.cos(t * 0.6) * 0.1, cy: 0.7 + Math.sin(t * 0.8) * 0.12, r: 0.5, color: dark ? "rgba(180,151,207,0.15)" : "rgba(180,151,207,0.1)" },
      { cx: 0.5 + Math.sin(t * 0.4) * 0.08, cy: 0.5 + Math.cos(t * 0.9) * 0.08, r: 0.4, color: dark ? "rgba(235,183,208,0.1)" : "rgba(235,183,208,0.08)" },
      { cx: 0.1 + Math.cos(t * 1.1) * 0.06, cy: 0.8 + Math.sin(t * 0.7) * 0.07, r: 0.35, color: dark ? "rgba(194,116,138,0.1)" : "rgba(194,116,138,0.07)" },
      { cx: 0.9 + Math.sin(t * 0.9) * 0.06, cy: 0.2 + Math.cos(t * 1.2) * 0.06, r: 0.38, color: dark ? "rgba(180,151,207,0.12)" : "rgba(180,151,207,0.08)" },
    ];
    blobs.forEach(function (b) {
      var grd = ctx.createRadialGradient(b.cx * W, b.cy * H, 0, b.cx * W, b.cy * H, b.r * Math.max(W, H));
      grd.addColorStop(0, b.color);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    });

    var spotR = Math.max(W, H) * 0.45;
    var spot = ctx.createRadialGradient(mx * W, my * H, 0, mx * W, my * H, spotR);
    spot.addColorStop(0, dark ? "rgba(194,116,138,0.22)" : "rgba(194,116,138,0.16)");
    spot.addColorStop(0.35, dark ? "rgba(180,151,207,0.1)" : "rgba(180,151,207,0.07)");
    spot.addColorStop(1, "transparent");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = dark ? 0.06 : 0.04;
    ctx.globalCompositeOperation = "overlay";
    var conicX = (0.5 + Math.sin(t * 0.3) * 0.1) * W;
    var conicY = (0.5 + Math.cos(t * 0.4) * 0.1) * H;
    for (var i = 0; i < 12; i++) {
      var angle = (i / 12) * Math.PI * 2 + t * 0.15;
      var grd2 = ctx.createLinearGradient(conicX, conicY, conicX + Math.cos(angle) * W * 0.8, conicY + Math.sin(angle) * H * 0.8);
      grd2.addColorStop(0, i % 2 === 0 ? (dark ? "rgba(194,116,138,0.5)" : "rgba(194,116,138,0.4)") : "transparent");
      grd2.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(conicX, conicY);
      ctx.arc(conicX, conicY, Math.max(W, H), angle, angle + Math.PI / 12);
      ctx.closePath();
      ctx.fillStyle = grd2;
      ctx.fill();
    }
    ctx.restore();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
