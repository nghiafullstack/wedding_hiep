import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '../data/wedding';
import { prefersReducedMotion } from '../hooks/motion';
import { SectionHead } from './Common';
import Lightbox from './Lightbox';

/**
 * Album: vòng ảnh 3D.
 *  - Kéo (chuột / vuốt) để xoay, thả tay có quán tính
 *  - Tự xoay chậm khi để yên
 *  - Ảnh quay mặt về phía người xem sáng hơn, ảnh phía sau tối & mờ
 *  - Chạm vào ảnh để xem lớn
 */
export default function RingGallery() {
  const imgs = wedding.images.album;
  const N = imgs.length;
  const step = 360 / N;

  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const s = useRef({ angle: 0, vel: 0, target: null, dragging: false, lastX: 0, moved: 0, radius: 400, visible: true });
  const [open, setOpen] = useState(-1);

  // Bán kính vòng theo kích thước thẻ ảnh hiện tại
  useEffect(() => {
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      const w = card.offsetWidth;
      s.current.radius = Math.round((w / 2) / Math.tan(Math.PI / N) + w * 0.18);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [N]);

  // Vòng lặp hoạt ảnh
  useEffect(() => {
    const st = s.current;
    const auto = prefersReducedMotion() ? 0 : -0.06;
    const io = new IntersectionObserver(([e]) => (st.visible = e.isIntersecting));
    if (stageRef.current) io.observe(stageRef.current);
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!st.visible) return;
      if (!st.dragging) {
        if (st.target != null) {
          const d = st.target - st.angle;
          st.angle += d * 0.12;
          if (Math.abs(d) < 0.05) st.target = null;
        } else {
          st.angle += st.vel;
          st.vel *= 0.94;
          if (Math.abs(st.vel) < 0.04) st.angle += auto;
        }
      }
      const R = st.radius;
      if (ringRef.current) {
        ringRef.current.style.setProperty('--r', `${R}px`);
        ringRef.current.style.transform = `translateZ(${-R * 0.55}px) rotateX(-7deg) rotateY(${st.angle}deg)`;
      }
      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const a = ((i * step + st.angle) * Math.PI) / 180;
        const face = (Math.cos(a) + 1) / 2; // 1 = đối diện người xem, 0 = phía sau
        el.style.setProperty('--face', face.toFixed(3));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [N, step]);

  // Kéo: nghe move/up trên window (không dùng pointer capture để click vào ảnh vẫn hoạt động)
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.lastX = e.clientX;
    st.moved = 0;
    st.vel = 0;
    st.target = null;
    const onMove = (ev) => {
      const dx = ev.clientX - st.lastX;
      st.lastX = ev.clientX;
      st.moved += Math.abs(dx);
      const d = dx * 0.22;
      st.angle += d;
      st.vel = d;
    };
    const onUp = () => {
      st.dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const rotateBy = (dir) => {
    const st = s.current;
    const snapped = Math.round(st.angle / step) * step;
    st.vel = 0;
    st.target = snapped + dir * step;
  };

  const frontIndex = useCallback(() => {
    const a = ((-s.current.angle % 360) + 360) % 360;
    return Math.round(a / step) % N;
  }, [N, step]);

  return (
    <section className="ring-section section">
      <SectionHead eyebrow="Album" sub="Kéo để xoay · chạm vào ảnh để xem lớn">
        Khoảnh khắc <em className="accent">của chúng mình</em>
      </SectionHead>

      <div
        className="ring__stage"
        ref={stageRef}
        onPointerDown={onDown}
      >
        <div className="ring__floor" aria-hidden="true" />
        <div className="ring" ref={ringRef}>
          {imgs.map((src, i) => (
            <button
              type="button"
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="ring__card"
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r, 0px))` }}
              onClick={() => {
                if (s.current.moved > 6) return;
                setOpen(i);
              }}
              aria-label={`Xem ảnh ${i + 1} trên ${N}`}
            >
              <img src={src} alt="" draggable="false" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="ring__controls">
        <button type="button" className="icon-btn" onClick={() => rotateBy(1)} aria-label="Ảnh trước">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => setOpen(frontIndex())}>
          Xem ảnh
        </button>
        <button type="button" className="icon-btn" onClick={() => rotateBy(-1)} aria-label="Ảnh sau">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {open >= 0 && <Lightbox images={imgs} index={open} onChange={setOpen} onClose={() => setOpen(-1)} />}
    </section>
  );
}
