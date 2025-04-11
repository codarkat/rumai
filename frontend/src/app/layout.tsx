import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { googleSans } from "@/fonts";

export const metadata: Metadata = {
  title: "RumAI",
  description:
    "RumAI là một nền tảng học tiếng Nga miễn phí, mã nguồn mở, sử dụng AI để cá nhân hóa trải nghiệm học tập, hỗ trợ dịch thuật, luyện kỹ năng nghe nói và xây dựng cộng đồng học tập. Dự án hướng đến sinh viên, người đi làm, người yêu thích tiếng Nga, với mục tiêu hỗ trợ tự học một cách hiệu quả nhất",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="mdl-js">
      <body className={googleSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
