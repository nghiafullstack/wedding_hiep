// ─────────────────────────────────────────────────────────────
//  TOÀN BỘ NỘI DUNG THIỆP NẰM Ở ĐÂY — sửa file này là đủ.
//  Các chỗ trong [ngoặc vuông] là thông tin còn thiếu trong thiết kế.
// ─────────────────────────────────────────────────────────────

const BASE = import.meta.env.BASE_URL;
const img = (name) => `${BASE}images/${name}`;

export const wedding = {
  // Màu nhấn (thiết kế có 4 tuỳ chọn: #2b3a8c, #5f6f52, #8a5a44, #1c1c1a)
  accent: '#2b3a8c',

  groom: {
    short: 'Hiệp',
    full: 'Nguyễn Hiệp',
    father: 'Nguyễn Khanh',
    mother: 'Trần Thị Hà',
    address: 'Số 12, xóm Thanh Quang, thôn Cộng Hoà, xã Sóc Sơn, Hà Nội',
    photo: img('groom.jpg'),
  },
  bride: {
    short: 'Thương',
    full: 'Lê Thị Hoài Thương',
    father: 'Lê Văn Bắc',
    mother: 'Nguyễn Thị Thuỷ',
    address: 'Xóm Núi Bé, xã Nam Phương Tiến, huyện Chương Mỹ, Hà Nội',
    photo: img('bride.jpg'),
  },
  monogram: ['H', 'T'],

  // Mốc giờ dùng cho đồng hồ đếm ngược (giờ Việt Nam, +07:00)
  dateISO: '2026-11-28T17:30:00+07:00',
  dateText: '28 · 11 · 2026',
  weekday: 'Thứ Bảy',
  lunarText: '[Tức ngày ... tháng ... năm Bính Ngọ]',
  rsvpDeadline: '[trước ngày ...]',

  invite: {
    eyebrow: 'Trân trọng kính mời',
    body:
      'Trân trọng kính mời bạn đến chung vui cùng gia đình chúng mình trong ngày trọng đại. Sự hiện diện của bạn là niềm vinh hạnh lớn nhất.',
    partyTime: '17:30',
    venue: '[Tên nhà hàng]',
    venueAddress: '[Địa chỉ nhà hàng]',
  },

  events: [
    {
      idx: '01',
      title: 'Lễ Vu Quy',
      time: '08:00',
      start: '2026-11-28T08:00:00+07:00',
      place: 'Tư gia nhà gái',
      address: 'Xóm Núi Bé, xã Nam Phương Tiến, huyện Chương Mỹ, Hà Nội',
    },
    {
      idx: '02',
      title: 'Lễ Thành Hôn',
      time: '10:00',
      start: '2026-11-28T10:00:00+07:00',
      place: 'Tư gia nhà trai',
      address: 'Số 12, xóm Thanh Quang, thôn Cộng Hoà, xã Sóc Sơn, Hà Nội',
    },
    {
      idx: '03',
      title: 'Tiệc Cưới',
      time: '17:30',
      start: '2026-11-28T17:30:00+07:00',
      place: '[Tên nhà hàng]',
      address: '[Địa chỉ nhà hàng]',
    },
  ],

  images: {
    cover: img('card-front.jpg'),
    heroBack: img('portrait-1.jpg'),
    heroMid: img('bride.jpg'),
    heroFront: img('couple.jpg'),
    cardFront: img('card-front.jpg'),
    closing: img('closing.jpg'),
    // Áo Nhật Bình — xếp từ trái sang phải
    fan: [img('ao-nhat-binh-1.jpg'), img('ao-nhat-binh-2.jpg'), img('portrait-1.jpg'), img('ao-nhat-binh-3.jpg')],
    // Album vòng 3D — thêm/bớt ảnh tuỳ ý (đẹp nhất 8–14 ảnh)
    album: [
      img('album-1.jpg'),
      img('album-2.jpg'),
      img('card-front.jpg'),
      img('album-3.jpg'),
      img('bride.jpg'),
      img('couple.jpg'),
      img('ao-nhat-binh-2.jpg'),
      img('groom.jpg'),
      img('portrait-1.jpg'),
      img('ao-nhat-binh-1.jpg'),
    ],
  },

  // Hộp mừng cưới — mã QR tạo tự động bằng VietQR từ BIN ngân hàng + số tài khoản
  gifts: [
    { role: 'Chú rể', bank: 'MB Bank', bin: '970422', account: '070520023333', holder: 'Nguyễn Hiệp' },
    { role: 'Cô dâu', bank: 'Techcombank', bin: '970407', account: '19036214742018', holder: 'Lê Thị Hoài Thương' },
  ],

  // Gửi RSVP về đâu: dán URL Google Apps Script / API của anh vào đây.
  // Để trống thì form vẫn chạy, câu trả lời lưu tạm trên máy khách.
  rsvpEndpoint: '',

  // Nhạc nền (tuỳ chọn): đặt file vào public/music/ rồi ghi đường dẫn, ví dụ img-style: `${BASE}music/song.mp3`
  music: '',
};
