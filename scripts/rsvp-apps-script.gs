/**
 * RSVP thiệp cưới → Google Sheet + email báo cô dâu chú rể.
 *
 * Cách dùng:
 * 1. Tạo Google Sheet mới (bằng Gmail của anh hoặc của cô dâu).
 * 2. Tiện ích mở rộng → Apps Script → xoá hết, dán file này vào.
 * 3. Sửa EMAILS và COUPLE bên dưới → Lưu.
 * 4. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *      Thực thi với tư cách: Tôi
 *      Ai có quyền truy cập: Bất kỳ ai
 *    → Triển khai → cấp quyền → copy "URL ứng dụng web".
 * 5. Dán URL đó vào rsvpEndpoint trong src/data/wedding.js rồi build lại.
 *
 * Sửa script sau khi đã triển khai: Triển khai → Quản lý triển khai → sửa (bút chì)
 * → Phiên bản: Phiên bản mới → Triển khai (URL giữ nguyên).
 */

// Email nhận thông báo — cách nhau bằng dấu phẩy. Để '' nếu chỉ muốn lưu Sheet.
const EMAILS = 'chure@gmail.com, codau@gmail.com';
const COUPLE = 'Nguyễn Hiệp & Hoài Thương';

const HEADERS = ['Thời gian', 'Họ và tên', 'Số điện thoại', 'Tham dự', 'Số người', 'Lời chúc'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // nhiều khách gửi cùng lúc không bị ghi đè dòng
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    const going = p.attend === 'yes';
    const row = [
      new Date(),
      clean(p.name),
      "'" + clean(p.phone), // giữ số 0 đầu
      going ? 'Có' : 'Không',
      going ? Number(p.guests || 1) : 0,
      clean(p.message),
    ];
    sh.appendRow(row);

    if (EMAILS) {
      const subject = `[Thiệp cưới] ${row[1] || 'Khách'} ${going ? 'sẽ tham dự' : 'không tham dự được'}`;
      const body = [
        `Có khách vừa xác nhận trên thiệp cưới ${COUPLE}:`,
        '',
        `Họ và tên: ${row[1]}`,
        `Số điện thoại: ${clean(p.phone)}`,
        `Tham dự: ${row[3]}${going ? ` (${row[4]} người)` : ''}`,
        `Lời chúc: ${row[5] || '(không có)'}`,
        '',
        `Xem toàn bộ danh sách: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
      ].join('\n');
      MailApp.sendEmail(EMAILS, subject, body);
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

// Chặn công thức độc hại (=, +, -, @ ở đầu) và cắt chuỗi quá dài
function clean(v) {
  const s = String(v || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
