import { useState } from 'react';
import { wedding } from '../data/wedding';
import { Reveal, SectionHead } from './Common';

/**
 * Xác nhận tham dự.
 * - Có wedding.rsvpEndpoint: POST form-data tới đó (vd. Google Apps Script ghi vào Google Sheet)
 * - Không có: lưu tạm vào localStorage của khách để form vẫn hoạt động khi demo
 */
export default function Rsvp() {
  const [form, setForm] = useState({ name: '', phone: '', attend: '', guests: '1', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Bạn cho chúng mình xin tên nhé.');
    if (!form.attend) return setError('Bạn chọn giúp "Chắc chắn rồi" hoặc "Rất tiếc, không thể" nhé.');
    setError('');
    setStatus('sending');
    const payload = { ...form, sentAt: new Date().toISOString() };
    try {
      if (wedding.rsvpEndpoint) {
        const body = new FormData();
        Object.entries(payload).forEach(([k, v]) => body.append(k, v));
        await fetch(wedding.rsvpEndpoint, { method: 'POST', body, mode: 'no-cors' });
      } else {
        try {
          const list = JSON.parse(localStorage.getItem('rsvp') || '[]');
          list.push(payload);
          localStorage.setItem('rsvp', JSON.stringify(list));
        } catch {
          /* trình duyệt chặn bộ nhớ: bỏ qua */
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus('done');
    } catch {
      setStatus('error');
      setError('Gửi chưa được, bạn thử lại giúp chúng mình nhé.');
    }
  };

  return (
    <section className="section" id="rsvp">
      <SectionHead
        eyebrow="Xác nhận tham dự"
        sub={`Vui lòng phản hồi ${wedding.rsvpDeadline ? wedding.rsvpDeadline + ' ' : ''}để ${wedding.groom.display} & ${wedding.bride.display} chuẩn bị chu đáo nhất.`}
      >
        Bạn sẽ <em className="accent">đến chứ?</em>
      </SectionHead>

      <Reveal variant="flip" className="rsvp-scene">
        <div className={`rsvp-card ${status === 'done' ? 'is-done' : ''}`}>
          {/* Mặt trước: form */}
          <form className="rsvp" onSubmit={submit} noValidate aria-hidden={status === 'done'}>
            <div className="field">
              <label htmlFor="rsvp-name">Họ và tên</label>
              <input id="rsvp-name" value={form.name} onChange={set('name')} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="rsvp-phone">Số điện thoại</label>
              <input id="rsvp-phone" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
            </div>

            <div className="field field--full">
              <span className="field__label" id="rsvp-attend">Bạn sẽ tham dự?</span>
              <div className="choice" role="group" aria-labelledby="rsvp-attend">
                <button type="button" className={`choice__btn ${form.attend === 'yes' ? 'is-on' : ''}`} aria-pressed={form.attend === 'yes'} onClick={() => setForm((f) => ({ ...f, attend: 'yes' }))}>
                  Chắc chắn rồi
                </button>
                <button type="button" className={`choice__btn ${form.attend === 'no' ? 'is-on' : ''}`} aria-pressed={form.attend === 'no'} onClick={() => setForm((f) => ({ ...f, attend: 'no' }))}>
                  Rất tiếc, không thể
                </button>
              </div>
            </div>

            {form.attend === 'yes' && (
              <div className="field field--full">
                <label htmlFor="rsvp-guests">Số người đi cùng (kể cả bạn)</label>
                <select id="rsvp-guests" value={form.guests} onChange={set('guests')}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} người
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="field field--full">
              <label htmlFor="rsvp-msg">Lời chúc</label>
              <textarea id="rsvp-msg" rows={3} value={form.message} onChange={set('message')} />
            </div>

            {error && (
              <p className="rsvp__error field--full" role="alert">
                {error}
              </p>
            )}

            <div className="field--full rsvp__submit">
              <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
                {status === 'sending' ? 'Đang gửi…' : 'Gửi xác nhận'}
              </button>
            </div>
          </form>

          {/* Mặt sau: lời cảm ơn (thẻ lật 180° khi gửi xong) */}
          <div className="rsvp-thanks" aria-hidden={status !== 'done'} role="status">
            <p className="eyebrow">Đã nhận</p>
            <p className="rsvp-thanks__title">
              Cảm ơn <em className="accent">{form.name.trim() || 'bạn'}</em>!
            </p>
            <p className="muted">
              {form.attend === 'yes'
                ? `Hẹn gặp bạn ngày ${wedding.dateText}.`
                : 'Cảm ơn lời chúc của bạn, chúng mình rất trân trọng.'}
            </p>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                setStatus('idle');
                setForm({ name: '', phone: '', attend: '', guests: '1', message: '' });
              }}
            >
              Gửi thêm một xác nhận
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
