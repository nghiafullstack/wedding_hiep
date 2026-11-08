import { wedding } from '../data/wedding';

export default function Marquee() {
  const text = `Save the date — ${wedding.groom.short} & ${wedding.bride.short} — ${wedding.dateText} — `;
  return (
    <div className="marquee" aria-label={`Save the date: ${wedding.dateText}`}>
      <div className="marquee__track" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
