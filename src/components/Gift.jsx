import { useState } from 'react';
import { wedding } from '../data/wedding';
import { useTilt } from '../hooks/motion';
import { Reveal, SectionHead, Eyebrow } from './Common';

/** Ảnh QR chuyển khoản tạo bởi VietQR (quét được bằng mọi app ngân hàng VN) */
const qrUrl = (g) =>
  `https://img.vietqr.io/image/${g.bin}-${g.account}-compact.png?accountName=${encodeURIComponent(g.holder)}`;

function GiftCard({ g, i }) {
  const [copied, setCopied] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const tiltRef = useTilt({ source: 'local', ease: 0.1 });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(g.account);
    } catch {
      const t = document.createElement('textarea');
      t.value = g.account;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Reveal variant="flip" delay={i * 160} className="gift-scene">
      <div className="gift" ref={tiltRef}>
        <Eyebrow>{g.role}</Eyebrow>
        <div className="gift__qr">
          {qrFailed ? (
            <span className="gift__qr-fallback">MÃ QR</span>
          ) : (
            <img
              src={qrUrl(g)}
              alt={`Mã QR chuyển khoản ${g.bank} – ${g.holder}`}
              loading="lazy"
              onError={() => setQrFailed(true)}
            />
          )}
        </div>
        <p className="gift__bank">{g.bank}</p>
        <p className="gift__holder">{g.holder}</p>
        <p className="gift__acc">{g.account}</p>
        <button type="button" className="btn btn--outline btn--sm" onClick={copy}>
          {copied ? 'Đã sao chép ✓' : 'Sao chép số tài khoản'}
        </button>
        <span className="gift__glare" aria-hidden="true" />
      </div>
    </Reveal>
  );
}

export default function Gift() {
  return (
    <section className="section section--tint">
      <SectionHead eyebrow="Hộp mừng cưới">
        Gửi <em className="accent">yêu thương</em>
      </SectionHead>
      <div className="gifts">
        {wedding.gifts.map((g, i) => (
          <GiftCard key={g.account} g={g} i={i} />
        ))}
      </div>
    </section>
  );
}
