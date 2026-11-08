import { useState } from 'react';
import { wedding } from '../data/wedding';
import { useTilt } from '../hooks/motion';
import { Reveal, Eyebrow } from './Common';

/**
 * Thiệp: tấm thiệp 3D hai mặt.
 *  - Nghiêng theo con trỏ, có vệt sáng (glare) chạy theo
 *  - Bấm vào thiệp hoặc nút "Lật thiệp" để lật 180°
 */
export default function InviteCard() {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useTilt({ source: 'local', ease: 0.1 });
  const { invite, groom, bride } = wedding;

  return (
    <section className="invite container">
      <Reveal className="invite__text" variant="up">
        <Eyebrow>{invite.eyebrow}</Eyebrow>
        <h2 className="h2">
          Một lời mời <em className="accent">nhỏ</em>,<br />
          cho một ngày <em className="accent">lớn</em>.
        </h2>
        <p className="invite__body">{invite.body}</p>
        <button type="button" className="btn btn--outline" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
          {flipped ? 'Xem mặt trước' : 'Lật thiệp'}
        </button>
      </Reveal>

      <Reveal className="invite__scene" variant="flip" delay={150}>
        <div className="invite__tilt" ref={tiltRef}>
          <button
            type="button"
            className={`card3d ${flipped ? 'is-flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Thiệp — mặt sau, bấm để lật lại' : 'Thiệp — mặt trước, bấm để lật'}
          >
            {/* MẶT TRƯỚC */}
            <span className="card3d__face card3d__front">
              <img src={wedding.images.cardFront} alt="" />
              <span className="card3d__shade" />
              <span className="card3d__front-text">
                <span className="card3d__eyebrow">The Wedding of</span>
                <strong>
                  {groom.short} &amp; {bride.short}
                </strong>
                <span className="card3d__small">{wedding.dateText}</span>
              </span>
              <span className="card3d__glare" />
            </span>

            {/* MẶT SAU */}
            <span className="card3d__face card3d__back">
              <span className="card3d__eyebrow card3d__eyebrow--dark">Thiệp mời</span>
              <span className="card3d__couple">
                {groom.full}
                <br />
                <em className="accent">&amp;</em>
                <br />
                {bride.full}
              </span>
              <span className="rule" />
              <span className="card3d__p">Tiệc cưới được tổ chức vào lúc</span>
              <span className="card3d__time">{invite.partyTime}</span>
              <span className="card3d__p">
                {wedding.weekday}, {wedding.dateText}
              </span>
              <span className="rule" />
              <span className="card3d__venue">{invite.venue}</span>
              <span className="card3d__addr">{invite.venueAddress}</span>
              <span className="card3d__glare" />
            </span>

            {/* Độ dày giấy */}
            <span className="card3d__edge" aria-hidden="true" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
