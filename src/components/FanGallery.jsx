import { wedding } from '../data/wedding';
import { useScrollProgress, useTilt } from '../hooks/motion';
import { SectionHead } from './Common';

/**
 * Áo Nhật Bình: 4 ảnh xếp chồng ở giữa, khi cuộn tới sẽ xoè ra như quạt
 * (tịnh tiến X, lùi Z, xoay Y) — điều khiển bằng biến CSS --p (0 → 1).
 */
const LAYOUT = [
  { x: -390, z: -135, ry: 24, rz: -6 },
  { x: -130, z: -15, ry: 8, rz: -2 },
  { x: 130, z: -15, ry: -8, rz: 2 },
  { x: 390, z: -135, ry: -24, rz: 6 },
];

export default function FanGallery() {
  const scrollRef = useScrollProgress({ start: 0.95, end: 0.15 });
  const tiltRef = useTilt({ source: 'global', ease: 0.05 });
  const imgs = wedding.images.fan;

  return (
    <section className="fan section section--tint" ref={scrollRef}>
      <SectionHead eyebrow="Áo Nhật Bình">
        Nét xưa <em className="accent">trong</em> ngày mới.
      </SectionHead>
      <div className="fan__stage">
        <div className="fan__rig" ref={tiltRef}>
          {imgs.map((src, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            return (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="fan__card"
                style={{
                  '--x': `${l.x}px`,
                  '--z': `${l.z}px`,
                  '--ry': `${l.ry}deg`,
                  '--rz': `${l.rz}deg`,
                  zIndex: i === 1 || i === 2 ? 2 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
