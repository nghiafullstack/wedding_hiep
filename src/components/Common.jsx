import { useInView } from '../hooks/motion';

/** Hiện dần khi cuộn tới. variant: 'up' | 'tilt' | 'fade' | 'flip' */
export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{children}</p>;
}

/** Tiêu đề section: eyebrow + h2, chữ tách từng dòng bay lên theo chiều sâu */
export function SectionHead({ eyebrow, children, sub }) {
  return (
    <Reveal className="section-head" variant="tilt">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="h2">{children}</h2>
      {sub && <p className="section-head__sub">{sub}</p>}
    </Reveal>
  );
}

export const Amp = () => <em className="accent">&amp;</em>;
