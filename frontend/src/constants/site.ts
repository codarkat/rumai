import { ReactNode } from "react";

// Navigation menu items
export const NAV_MENU = [
  { name: "Cá nhân", href: "/personal" },
  { name: "Khóa học", href: "/courses" },
  { name: "Bảng chữ cái", href: "/alphabet" },
  { name: "Tài nguyên", href: "/resources" },
  { name: "Giới thiệu", href: "/about" },
];

// Feature type definition
export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

// Footer link type definition
export interface FooterLink {
  name: string;
  href: string;
}

// Site configuration
export const SITE_CONFIG = {
  name: "RumAI",
  slogan: "Học tiếng Nga mọi lúc, mọi nơi",
  heroTitle: "Học tiếng Nga hiệu quả và thú vị",
  heroDescription: "Khám phá phương pháp học tiếng Nga hiện đại, tương tác và phù hợp với mọi trình độ. Bắt đầu hành trình ngôn ngữ của bạn ngay hôm nay!",
  ctaTitle: "Sẵn sàng bắt đầu hành trình?",
  ctaDescription: "Đăng ký ngay hôm nay để truy cập đầy đủ các khóa học, tài nguyên và công cụ học tập tiếng Nga.",
  ctaButtonText: "Bắt đầu miễn phí",
  featuresTitle: "Tại sao chọn chúng tôi?",
}; 