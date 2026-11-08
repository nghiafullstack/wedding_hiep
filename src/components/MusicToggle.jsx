import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { wedding } from '../data/wedding';

/** Nút nhạc nền nổi — chỉ hiện khi wedding.music có đường dẫn */
const MusicToggle = forwardRef(function MusicToggle(_, ref) {
  const audio = useRef(null);
  const [on, setOn] = useState(false);

  const play = async () => {
    try {
      await audio.current?.play();
      setOn(true);
    } catch {
      setOn(false);
    }
  };
  useImperativeHandle(ref, () => ({ play }));

  if (!wedding.music) return null;
  return (
    <>
      <audio ref={audio} src={wedding.music} loop preload="none" />
      <button
        type="button"
        className={`music ${on ? 'is-on' : ''}`}
        aria-pressed={on}
        aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'}
        onClick={() => {
          if (on) {
            audio.current.pause();
            setOn(false);
          } else play();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
      </button>
    </>
  );
});

export default MusicToggle;
