import { wedding } from '../data/wedding';
import { useTilt } from '../hooks/motion';
import { Reveal, SectionHead, Eyebrow } from './Common';

function Person({ side, label, person, offset }) {
  const tiltRef = useTilt({ source: 'local', ease: 0.08 });
  return (
    <div className={`family ${offset ? 'family--offset' : ''}`}>
      <Reveal variant="flip" className="family__photo-scene">
        <div className="family__photo" ref={tiltRef}>
          <img src={person.photo} alt={side === 'groom' ? 'Chú rể' : 'Cô dâu'} loading="lazy" />
          <span className="family__glare" aria-hidden="true" />
        </div>
      </Reveal>
      <Reveal variant="up" delay={120}>
        <Eyebrow>{label}</Eyebrow>
        <h3 className="h3">{person.full}</h3>
        <p className="family__parents">
          <span className="muted">Ông</span> {person.father}
          <br />
          <span className="muted">Bà</span> {person.mother}
        </p>
        <p className="family__addr">{person.address}</p>
      </Reveal>
    </div>
  );
}

export default function Families() {
  return (
    <section className="section">
      <SectionHead eyebrow="Hai gia đình">
        Từ hai mái nhà,
        <br />
        <em className="accent">về chung một lối.</em>
      </SectionHead>
      <div className="families container">
        <Person side="groom" label="Nhà trai" person={wedding.groom} />
        <Person side="bride" label="Nhà gái" person={wedding.bride} offset />
      </div>
    </section>
  );
}
