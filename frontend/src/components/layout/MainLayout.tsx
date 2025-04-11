"use client";

import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/home/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Đặc biệt xử lý các trang có thiết kế riêng
  const specialPages = ["/assistant", "/documents", "/dictionary", "/tests"];
  const isSpecialPage = specialPages.some((page) => pathname.startsWith(page));

  // Background style cho các trang đặc biệt
  const specialPageBackground = (
    <>
      {/* Background pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/auth-pattern.svg')] opacity-15 z-0"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-sky-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar với chiều cao cố định 64px */}
      <Navbar />

      {/* Phần tử chiếm không gian cho Navbar cố định */}
      <div className={isHomePage ? "" : "h-[64px] w-full"}></div>

      {/* Main content with appropriate padding */}
      <main
        className={`flex-grow relative ${
          isHomePage
            ? "pt-0" // Trang chủ thường có hero section riêng
            : isSpecialPage
            ? "bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 relative overflow-hidden"
            : "py-10 px-4 md:px-6"
        }`}
      >
        {isSpecialPage && specialPageBackground}

        <div
          className={`${fullWidth ? "w-full" : "container mx-auto"} ${
            isSpecialPage ? "relative z-10 py-6" : ""
          }`}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
