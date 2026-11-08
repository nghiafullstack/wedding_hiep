import { useEffect, useRef, useState } from 'react';

/* ───────────── Trạng thái chuyển động dùng chung ─────────────
   Một nguồn duy nhất cho vị trí chuột (desktop) và con quay
   hồi chuyển (điện thoại). Giá trị chuẩn hoá về [-1, 1].        */

const pointer = { x: 0, y: 0 };
const gyro = { x: 0, y: 0, active: false };
let listening = false;

const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));

function listen() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return;
    gyro.active = true;
    gyro.x = clamp(e.gamma / 25);
    gyro.y = clamp((e.beta - 45) / 25);
  });
}

export function getPointer() {
  listen();
  return gyro.active ? gyro : pointer;
}

/** iOS 13+ bắt buộc xin quyền con quay trong một thao tác bấm của người dùng. */
export async function requestGyroPermission() {
  listen();
  try {
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') {
      await DOE.requestPermission();
    }
  } catch {
    /* người dùng từ chối: vẫn chạy bình thường bằng chuột / tĩnh */
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────── useInView: phần tử đã vào màn hình chưa ───────────── */
export function useInView(options = { threshold: 0.2, once: true }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.once !== false) io.disconnect();
        } else if (options.once === false) {
          setInView(false);
        }
      },
      { threshold: options.threshold ?? 0.2, rootMargin: options.rootMargin ?? '0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/* ───────────── useTilt: nghiêng 3D mượt theo chuột / con quay ─────────────
   Ghi 2 biến CSS --tx, --ty (∈ [-1,1], đã làm mượt) lên phần tử.
   source 'global'  → theo chuột trên cả cửa sổ / con quay
   source 'local'   → chỉ khi rê chuột trên chính phần tử               */
export function useTilt({ source = 'global', ease = 0.08 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const local = { x: 0, y: 0, hover: false };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      local.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
      local.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
      local.hover = true;
    };
    const onLeave = () => {
      local.hover = false;
      local.x = 0;
      local.y = 0;
    };
    if (source === 'local') {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = source === 'local' ? (local.hover ? local : gyro.active ? gyro : local) : getPointer();
      cur.x += (t.x - cur.x) * ease;
      cur.y += (t.y - cur.y) * ease;
      el.style.setProperty('--tx', cur.x.toFixed(4));
      el.style.setProperty('--ty', cur.y.toFixed(4));
      el.style.setProperty('--hover', local.hover ? '1' : '0');
    };
    listen();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [source, ease]);
  return ref;
}

/* ───────────── useScrollProgress: tiến độ cuộn qua một section ─────────────
   Ghi biến CSS --p ∈ [0,1]: 0 khi đỉnh section chạm đáy màn hình,
   1 khi section đã đi được `span` phần chiều cao màn hình.            */
export function useScrollProgress({ start = 1, end = 0.35 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // vị trí đỉnh section tính theo tỉ lệ màn hình
      const pos = r.top / vh;
      const p = clamp((start - pos) / (start - end), 0, 1);
      // easeOutCubic cho chuyển động mềm
      const eased = 1 - Math.pow(1 - p, 3);
      el.style.setProperty('--p', eased.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [start, end]);
  return ref;
}

/* ───────────── useCountdown ───────────── */
export function useCountdown(targetISO) {
  const target = new Date(targetISO).getTime();
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      done: diff === 0,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}
