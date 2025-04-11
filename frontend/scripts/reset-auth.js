/**
 * Script để xóa cookie cũ và khởi động lại ứng dụng
 * Chạy script này khi gặp lỗi JWEDecryptionFailed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Đang xóa thư mục .next...');
try {
  fs.rmSync(path.join(__dirname, '..', '.next'), { recursive: true, force: true });
  console.log('Đã xóa thư mục .next thành công');
} catch (error) {
  console.error('Lỗi khi xóa thư mục .next:', error);
}

console.log('Đang khởi động lại ứng dụng...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Lỗi khi khởi động lại ứng dụng:', error);
} 