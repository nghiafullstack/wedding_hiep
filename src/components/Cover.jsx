import { useEffect, useState } from 'react';
import { wedding } from '../data/wedding';
import { requestGyroPermission, prefersReducedMotion } from '../hooks/motion';

/**
 * Màn bìa: hai cánh cửa 3D mở theo trục Y.
 * Mỗi cánh mang một nửa ảnh nền + nửa nội dung, nên khi đóng chúng ghép lại liền mạch.
 * Một lớp phủ trong suốt cùng bố cục chứa nút "Mở thiệp" thật (bấm được, đọc màn hình được).
 */
export default function Cover({ onOpen }) {
  const [state, setState] = useState('closed'); // closed → opening → gone

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', state !== 'gone');
    return () => document.documentElement.classList.remove('is-locked');
  }, [state]);

  const open = () => {
    if (state !== 'closed') return;
    requestGyroPermission();
    onOpen?.();
    setState('opening');
    setTimeout(() => setState('gone'), prefersReducedMotion() ? 50 : 2000);
  };

  if (state === 'gone') return null;

  const Content = ({ interactive }) => (
    <div className={`cover__content ${interactive ? 'cover__content--overlay' : ''}`}>
      <p className="eyebrow">Thiệp mời cưới</p>
      <div className="cover__mono">
        {wedding.monogram[0]}
        <em className="accent">&amp;</em>
        {wedding.monogram[1]}
      </div>
      <h1 className="cover__names">
        {wedding.groom.short} <em className="accent">&amp;</em> {wedding.bride.short}
      </h1>
      <p className="cover__date">{wedding.dateText}</p>
      {interactive ? (
        <button type="button" className="btn btn--solid cover__btn" onClick={open} autoFocus>
          Mở thiệp
        </button>
      ) : (
        <span className="btn btn--solid">Mở thiệp</span>
      )}
    </div>
  );

  return (
    <div className={`cover cover--${state}`} role="dialog" aria-modal="true" aria-label="Thiệp mời cưới">
      <div className="cover__stage" aria-hidden="true">
        {['left', 'right'].map((side) => (
          <div key={side} className={`cover__door cover__door--${side}`}>
            <div className="cover__door-face">
              <img src={wedding.images.cover} alt="" className="cover__bg" />
              <Content />
            </div>
          </div>
        ))}
      </div>
      <Content interactive />
      <div className="cover__line" aria-hidden="true" />
    </div>
  );
}
