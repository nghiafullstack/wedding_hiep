import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { wedding } from '../data/wedding';

/**
 * Nhạc nền.
 *  - Bắt đầu khi khách bấm "Mở thiệp" (trình duyệt chỉ cho phát nhạc sau một lần chạm)
 *  - Âm lượng tăng dần, không giật
 *  - Khách chuyển tab / khoá màn hình → tạm dừng, quay lại → phát tiếp
 *  - Nút nổi góc phải dưới để bật / tắt
 */
const TARGET_VOLUME = 0.55;

const MusicToggle = forwardRef(function MusicToggle(_, ref) {
  const audio = useRef(null);
  const fadeRef = useRef(0);
  const wantOn = useRef(false); // khách có muốn nghe không (để biết có phát lại khi quay lại tab)
  const [on, setOn] = useState(false);

  const fadeTo = (target, ms, done) => {
    const a = audio.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / ms));
      a.volume = Math.min(1, Math.max(0, from + (target - from) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const play = () => {
    const a = audio.current;
    if (!a) return;
    wantOn.current = true;
    a.volume = 0;
    const p = a.play();
    setOn(true);
    fadeTo(TARGET_VOLUME, 2500);
    p?.catch(() => {
      wantOn.current = false;
      setOn(false);
    });
  };

  const pause = (keepIntent = false) => {
    if (!keepIntent) wantOn.current = false;
    setOn(false);
    fadeTo(0, 400, () => audio.current?.pause());
  };

  useImperativeHandle(ref, () => ({ play }));

  useEffect(() => {
    const onVis = () => {
      if (!audio.current) return;
      if (document.hidden) {
        if (!audio.current.paused) pause(true);
      } else if (wantOn.current) {
        play();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!wedding.music) return null;
  return (
    <>
      <audio ref={audio} src={wedding.music} loop preload="auto" playsInline />
      <button
        type="button"
        className={`music ${on ? 'is-on' : ''}`}
        aria-pressed={on}
        aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'}
        onClick={() => (on ? pause() : play())}
      >
        <span className="music__disc" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </span>
        <span className="music__bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {!on && <span className="music__slash" aria-hidden="true" />}
      </button>
    </>
  );
});

export default MusicToggle;
