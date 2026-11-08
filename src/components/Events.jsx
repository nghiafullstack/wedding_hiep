import { wedding } from '../data/wedding';
import { useTilt } from '../hooks/motion';
import { Reveal, SectionHead } from './Common';

const isPlaceholder = (s) => /^\[.*\]$/.test(s.trim());

function mapsUrl(p) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;
}

/** Tạo file .ics để khách bấm "Lưu lịch" là thêm vào Lịch điện thoại */
function downloadIcs(ev) {
  const start = new Date(ev.start);
  const end = new Date(start.getTime() + 2 * 3600 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = `${ev.title} — ${wedding.groom.display} & ${wedding.bride.display}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//thiep-cuoi//VI',
    'BEGIN:VEVENT',
    `UID:${ev.idx}-${start.getTime()}@thiep-cuoi`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${ev.places.map((p) => `${p.place}: ${p.address}`).join(' / ')}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.title}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EventCard({ ev, i }) {
  const tiltRef = useTilt({ source: 'local', ease: 0.12 });
  return (
    <Reveal variant="flip" delay={i * 140} className="event-scene">
      <article className="event" ref={tiltRef}>
        <span className="event__idx accent">{ev.idx}</span>
        <h3 className="event__title">{ev.title}</h3>
        <p className="event__time">{ev.time}</p>
        <p className="event__date">
          {ev.weekday} · {ev.dateText}
        </p>
        <span className="rule" />
        <div className="event__places">
          {ev.places.map((p) => (
            <div className="event__place-block" key={p.place}>
              <p className="event__place">{p.place}</p>
              <p className="event__addr">{p.address}</p>
              {isPlaceholder(p.address) ? (
                <span className="btn btn--outline btn--sm is-disabled" aria-disabled="true">
                  Chỉ đường
                </span>
              ) : (
                <a
                  className="btn btn--outline btn--sm"
                  href={mapsUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Chỉ đường tới ${p.place.toLowerCase()}`}
                >
                  Chỉ đường
                </a>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--ghost btn--sm event__save" onClick={() => downloadIcs(ev)}>
          Lưu lịch
        </button>
      </article>
    </Reveal>
  );
}

export default function Events() {
  return (
    <section className="section">
      <SectionHead eyebrow="Chương trình">
        Lịch trình <em className="accent">ngày cưới</em>
      </SectionHead>
      <div className="events container">
        {wedding.events.map((ev, i) => (
          <EventCard key={ev.idx} ev={ev} i={i} />
        ))}
      </div>
    </section>
  );
}
