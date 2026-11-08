import { useEffect, useRef } from 'react';

/** Xem ảnh lớn: ← → để chuyển, Esc để đóng, vuốt ngang trên điện thoại */
export default function Lightbox({ images, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const touch = useRef(null);
  const n = images.length;
  const go = (d) => onChange((index + d + n) % n);

  useEffect(() => {
    closeRef.current?.focus();
    document.documentElement.classList.add('is-locked');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
    };
  });

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh ${index + 1} trên ${n}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <img key={index} className="lightbox__img" src={images[index]} alt={`Ảnh cưới ${index + 1}`} />
      <button type="button" ref={closeRef} className="icon-btn icon-btn--light lightbox__close" onClick={onClose} aria-label="Đóng">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Ảnh trước">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Ảnh sau">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <p className="lightbox__count">
        {index + 1} / {n}
      </p>
    </div>
  );
}
