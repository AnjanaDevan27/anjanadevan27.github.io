/**
 * CursorMesh — Cursor-reactive gradient mesh background
 * The mesh spotlight follows cursor movement, creating a living, breathing background.
 * Palette: rose #c2748a / lavender #b497cf, adapts to dark/light mode.
 */
import { useEffect, useRef } from "react";

interface CursorMeshProps {
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function CursorMesh({ dark = false, className = "", style = {} }: CursorMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const target = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      target.current = {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    const draw = (ts: number) => {
      timeRef.current = ts * 0.0004;
      const t = timeRef.current;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Smooth cursor lerp — higher factor tracks the cursor faster (less trail)
      mouse.current.x += (target.current.x - mouse.current.x) * 0.5;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.5;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      ctx.clearRect(0, 0, W, H);

      // ── Base background ──
      ctx.fillStyle = dark ? "#1a0f14" : "#fdf6f9";
      ctx.fillRect(0, 0, W, H);

      // ── Slowly drifting mesh blobs ──
      const blobs = [
        { cx: 0.2 + Math.sin(t * 0.7) * 0.12, cy: 0.3 + Math.cos(t * 0.5) * 0.1, r: 0.55, color: dark ? "rgba(194,116,138,0.18)" : "rgba(194,116,138,0.12)" },
        { cx: 0.8 + Math.cos(t * 0.6) * 0.1, cy: 0.7 + Math.sin(t * 0.8) * 0.12, r: 0.5, color: dark ? "rgba(180,151,207,0.15)" : "rgba(180,151,207,0.1)" },
        { cx: 0.5 + Math.sin(t * 0.4) * 0.08, cy: 0.5 + Math.cos(t * 0.9) * 0.08, r: 0.4, color: dark ? "rgba(235,183,208,0.1)" : "rgba(235,183,208,0.08)" },
        { cx: 0.1 + Math.cos(t * 1.1) * 0.06, cy: 0.8 + Math.sin(t * 0.7) * 0.07, r: 0.35, color: dark ? "rgba(194,116,138,0.1)" : "rgba(194,116,138,0.07)" },
        { cx: 0.9 + Math.sin(t * 0.9) * 0.06, cy: 0.2 + Math.cos(t * 1.2) * 0.06, r: 0.38, color: dark ? "rgba(180,151,207,0.12)" : "rgba(180,151,207,0.08)" },
      ];

      blobs.forEach((b) => {
        const grd = ctx.createRadialGradient(b.cx * W, b.cy * H, 0, b.cx * W, b.cy * H, b.r * Math.max(W, H));
        grd.addColorStop(0, b.color);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });

      // ── Cursor-reactive spotlight ──
      const spotR = Math.max(W, H) * 0.45;
      const spot = ctx.createRadialGradient(mx * W, my * H, 0, mx * W, my * H, spotR);
      spot.addColorStop(0, dark ? "rgba(194,116,138,0.22)" : "rgba(194,116,138,0.16)");
      spot.addColorStop(0.35, dark ? "rgba(180,151,207,0.1)" : "rgba(180,151,207,0.07)");
      spot.addColorStop(1, "transparent");
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, W, H);

      // ── Subtle conic mesh overlay ──
      ctx.save();
      ctx.globalAlpha = dark ? 0.06 : 0.04;
      ctx.globalCompositeOperation = "overlay";
      const conicX = (0.5 + Math.sin(t * 0.3) * 0.1) * W;
      const conicY = (0.5 + Math.cos(t * 0.4) * 0.1) * H;
      // Draw conic-like effect using multiple thin radial sectors
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.15;
        const grd2 = ctx.createLinearGradient(conicX, conicY, conicX + Math.cos(angle) * W * 0.8, conicY + Math.sin(angle) * H * 0.8);
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

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      ro.disconnect();
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
