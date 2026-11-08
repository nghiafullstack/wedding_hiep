import { wedding } from '../data/wedding';
import { useScrollProgress } from '../hooks/motion';

/** Lời kết: ảnh nền phóng chậm & trôi parallax, chữ hiện dần theo chiều sâu */
export default function Closing() {
  const ref = useScrollProgress({ start: 1, end: 0 });
  return (
    <footer className="closing" ref={ref}>
      <img className="closing__bg" src={wedding.images.closing} alt="" loading="lazy" />
      <div className="closing__veil" />
      <div className="closing__content">
        <p className="eyebrow eyebrow--light">Thank you</p>
        <p className="closing__title">
          Hẹn gặp bạn
          <br />
          <em>trong ngày vui.</em>
        </p>
        <p className="closing__sign">
          {wedding.groom.display} &amp; {wedding.bride.display} · {wedding.dateText}
        </p>
      </div>
    </footer>
  );
}
