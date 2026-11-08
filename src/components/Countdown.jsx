import { useEffect, useRef, useState } from 'react';
import { wedding } from '../data/wedding';
import { useCountdown } from '../hooks/motion';
import { Eyebrow, Reveal } from './Common';

/**
 * Số lật kiểu split-flap theo trục X.
 * Nửa trên tĩnh hiện số MỚI, nửa dưới tĩnh hiện số CŨ;
 * lá trên (số cũ) gập xuống -90°, rồi lá dưới (số mới) mở từ 90° về 0°.
 */
function FlipNumber({ value }) {
  const text = String(value).padStart(2, '0');
  const prevRef = useRef(text);
  const [flip, setFlip] = useState({ key: 0, from: text, to: text });

  useEffect(() => {
    if (text !== prevRef.current) {
      setFlip((f) => ({ key: f.key + 1, from: prevRef.current, to: text }));
      prevRef.current = text;
    }
  }, [text]);

  return (
    <span className="flip" aria-hidden="true">
      <span className="flip__half flip__top">
        <span>{flip.to}</span>
      </span>
      <span className="flip__half flip__bottom">
        <span>{flip.key ? flip.from : flip.to}</span>
      </span>
      {flip.key > 0 && (
        <span key={flip.key} className="flip__leaves">
          <span className="flip__half flip__top flip__leaf-out">
            <span>{flip.from}</span>
          </span>
          <span className="flip__half flip__bottom flip__leaf-in">
            <span>{flip.to}</span>
          </span>
        </span>
      )}
    </span>
  );
}

export default function Countdown() {
  const t = useCountdown(wedding.dateISO);
  const units = [
    ['Ngày', t.days],
    ['Giờ', t.hours],
    ['Phút', t.minutes],
    ['Giây', t.seconds],
  ];

  return (
    <section className="countdown">
      <Eyebrow light>{t.done ? 'Hôm nay là ngày vui' : 'Đếm ngược đến ngày vui'}</Eyebrow>
      <Reveal className="countdown__row" variant="tilt">
        <p className="sr-only">
          Còn {t.days} ngày {t.hours} giờ {t.minutes} phút
        </p>
        {units.map(([label, v]) => (
          <div className="countdown__unit" key={label}>
            <FlipNumber value={v} />
            <span className="countdown__label">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
