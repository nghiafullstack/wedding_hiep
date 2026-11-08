import { useEffect, useState } from 'react';
import { wedding } from '../data/wedding';
import { useTilt, useScrollProgress } from '../hooks/motion';

/**
 * Hero: chồng 3 ảnh trong không gian 3D.
 *  - Nghiêng theo chuột (desktop) hoặc con quay (điện thoại)
 *  - Khi cuộn xuống, 3 lớp ảnh tách xa nhau theo trục Z
 */
export default function Hero({ opened }) {
  const tiltRef = useTilt({ source: 'global', ease: 0.06 });
  const scrollRef = useScrollProgress({ start: 0, end: -0.8 });
  const [settled, setSettled] = useState(false);
  const { groom, bride, images } = wedding;

  // Cảnh mở màn bay vào xong (~2.6s) thì chuyển sang chế độ bám theo cuộn
  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setSettled(true), 2700);
    return () => clearTimeout(id);
  }, [opened]);

  return (
    <section
      className={`hero ${opened ? 'is-opened' : ''} ${settled ? 'is-settled' : ''}`}
      ref={scrollRef}
      aria-label="Tên cô dâu chú rể"
    >
      <div className="hero__grid">
        <h1 className="hero__name hero__name--left">{groom.short}</h1>

        <div className="hero__stack-wrap" ref={tiltRef}>
          <div className="hero__stack">
            <img className="hero__photo hero__photo--back" src={images.heroBack} alt="" />
            <img className="hero__photo hero__photo--mid" src={images.heroMid} alt="" />
            <img className="hero__photo hero__photo--front" src={images.heroFront} alt="Cô dâu và chú rể" />
            <div className="hero__glare" aria-hidden="true" />
          </div>
        </div>

        <h1 className="hero__name hero__name--right">
          <em className="accent">&amp;</em> {bride.short}
        </h1>
      </div>

      <div className="hero__meta">
        <span>{wedding.weekday}</span>
        <span className="hero__date">{wedding.dateText}</span>
        <span>{wedding.lunarText}</span>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
