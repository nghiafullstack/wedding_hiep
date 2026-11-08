import { useEffect, useRef } from 'react';
import { getPointer, prefersReducedMotion } from '../hooks/motion';

/**
 * Cánh hoa rơi trong không gian 3D thật (x, y, z + phép chiếu phối cảnh),
 * vẽ trên một canvas nhẹ phủ toàn trang. Cánh ở gần to & rõ, ở xa nhỏ & mờ;
 * cả trường hoa lệch nhẹ theo chuột / con quay tạo chiều sâu.
 */
export default function PetalField({ count = 34, color = '#c9a7a0' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0;
    const FOV = 600;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rnd = (a, b) => a + Math.random() * (b - a);
    const n = w < 640 ? Math.round(count * 0.6) : count;
    const spawn = (p, top) => {
      p.x = rnd(-w, w);
      p.y = top ? rnd(-h * 0.9, -h * 0.6) : rnd(-h, h);
      p.z = rnd(0, 1200);
      p.vy = rnd(0.35, 0.9);
      p.vx = rnd(-0.25, 0.25);
      p.rot = rnd(0, Math.PI * 2);
      p.vr = rnd(-0.02, 0.02);
      p.flip = rnd(0, Math.PI * 2);
      p.vf = rnd(0.01, 0.035);
      p.size = rnd(7, 13);
      p.sway = rnd(0, Math.PI * 2);
      return p;
    };
    const petals = Array.from({ length: n }, () => spawn({}, false));
    const cam = { x: 0, y: 0 };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      const ptr = getPointer();
      cam.x += (ptr.x * 60 - cam.x) * 0.03;
      cam.y += (ptr.y * 40 - cam.y) * 0.03;
      ctx.clearRect(0, 0, w, h);
      // vẽ xa trước, gần sau
      petals.sort((a, b) => b.z - a.z);
      for (const p of petals) {
        p.sway += 0.012;
        p.x += p.vx + Math.sin(p.sway) * 0.35;
        p.y += p.vy;
        p.rot += p.vr;
        p.flip += p.vf;
        const s = FOV / (FOV + p.z);
        const sx = w / 2 + (p.x - cam.x * (1 - p.z / 1400)) * s;
        const sy = h / 2 + (p.y - cam.y * (1 - p.z / 1400)) * s;
        if (sy > h + 40) spawn(p, true);
        const r = p.size * s;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(p.rot);
        // lật cánh hoa quanh trục của nó → co giãn theo cos
        ctx.scale(1, Math.max(0.15, Math.abs(Math.cos(p.flip))));
        ctx.globalAlpha = 0.18 + 0.5 * s;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.bezierCurveTo(r * 0.9, -r * 0.6, r * 0.7, r * 0.7, 0, r);
        ctx.bezierCurveTo(-r * 0.7, r * 0.7, -r * 0.9, -r * 0.6, 0, -r);
        ctx.fill();
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count, color]);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}
