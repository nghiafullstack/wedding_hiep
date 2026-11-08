# Thiệp cưới 3D — Hiệp & Thương

Web thiệp cưới ReactJS (Vite) dựng theo thiết kế "Thiệp cưới — web", hiệu ứng 3D làm bằng CSS 3D transform + canvas, không dùng thư viện 3D nặng → tải nhanh, mượt trên điện thoại.

## Chạy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # xuất ra thư mục dist/ — upload lên hosting tĩnh bất kỳ
```

`dist/` chạy được ở Netlify, Vercel, GitHub Pages, Firebase Hosting hay sub-folder bất kỳ (đã đặt `base: './'`).

## Sửa nội dung

Mọi chữ, ngày giờ, địa chỉ, ảnh, số tài khoản nằm trong **`src/data/wedding.js`**. Các chỗ trong `[ngoặc vuông]` là thông tin thiết kế còn để trống:

- `lunarText` — ngày âm lịch
- `rsvpDeadline` — hạn xác nhận
- `invite.venue`, `invite.venueAddress` và sự kiện "Tiệc Cưới" — tên & địa chỉ nhà hàng (khi còn là placeholder, nút "Chỉ đường" tự mờ đi)

Ảnh nằm trong `public/images/`. Đổi màu nhấn ở `accent`.

## Hiệu ứng 3D

| Phần | Hiệu ứng | File |
|---|---|---|
| Bìa | 2 cánh cửa mở theo trục Y, monogram xoay | `Cover.jsx` |
| Hero | Chồng 3 ảnh trong không gian 3D, nghiêng theo chuột / con quay điện thoại; cuộn xuống thì các lớp tách xa theo trục Z | `Hero.jsx` |
| Thiệp | Thiệp 2 mặt, nghiêng theo con trỏ có vệt sáng, bấm để lật 180° | `InviteCard.jsx` |
| Đếm ngược | Số lật kiểu split-flap theo trục X | `Countdown.jsx` |
| Hai gia đình | Ảnh nghiêng theo con trỏ + parallax bên trong khung | `Families.jsx` |
| Áo Nhật Bình | 4 ảnh xoè như quạt theo tiến độ cuộn | `FanGallery.jsx` |
| Lịch trình | Thẻ lật vào khi cuộn tới, nổi lên khi rê chuột; nút "Lưu lịch" tải file .ics | `Events.jsx` |
| Album | Vòng ảnh 3D, kéo/vuốt để xoay có quán tính, tự xoay khi để yên, chạm để xem lớn | `RingGallery.jsx`, `Lightbox.jsx` |
| RSVP | Gửi xong thẻ lật sang mặt "Cảm ơn" | `Rsvp.jsx` |
| Mừng cưới | Mã QR VietQR tự sinh từ số tài khoản, nút sao chép, thẻ nghiêng | `Gift.jsx` |
| Toàn trang | Cánh hoa rơi trong không gian 3D (phối cảnh thật, lệch theo chuột) | `PetalField.jsx` |

Tất cả hiệu ứng tự tắt khi người xem bật "Giảm chuyển động" trong hệ điều hành. Trên iPhone, quyền con quay được xin ngay lúc bấm "Mở thiệp".

## Nhận RSVP về Google Sheet

1. Tạo Google Sheet → Tiện ích mở rộng → Apps Script, dán:

```js
function doPost(e) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const p = e.parameter;
  sh.appendRow([new Date(), p.name, p.phone, p.attend, p.guests, p.message]);
  return ContentService.createTextOutput('ok');
}
```

2. Triển khai → Ứng dụng web → Ai có quyền truy cập: **Bất kỳ ai** → copy URL.
3. Dán URL vào `rsvpEndpoint` trong `src/data/wedding.js`.

Để trống thì form vẫn chạy (lưu tạm trên máy khách) — tiện khi demo.

## Nhạc nền (tuỳ chọn)

Đặt file vào `public/music/song.mp3`, rồi trong `wedding.js` đặt `music: \`${BASE}music/song.mp3\``. Nhạc bắt đầu khi khách bấm "Mở thiệp", có nút bật/tắt ở góc phải dưới.
