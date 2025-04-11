import slugify from "slugify";

/**
 * Chuyển đổi tên tài liệu thành slug URL an toàn
 * @param text Tên tài liệu cần chuyển đổi
 * @returns Chuỗi slug đã được xử lý
 */
export function createDocumentSlug(text: string): string {
  return slugify(text, {
    lower: true, // Chuyển thành chữ thường
    strict: true, // Loại bỏ các ký tự đặc biệt
    locale: "vi", // Hỗ trợ tiếng Việt
    trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
  });
}

/**
 * Lấy tên tài liệu từ slug URL
 * @param slug Slug URL cần chuyển đổi ngược
 * @returns Tên tài liệu gốc (nếu có thể)
 */
export function getDocumentNameFromSlug(slug: string): string {
  // Chuyển đổi dấu gạch ngang thành khoảng trắng và viết hoa chữ cái đầu
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
