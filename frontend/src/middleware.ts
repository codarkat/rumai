import { NextResponse } from "next/server";
import { auth } from "./auth";
import { botLogger } from "../utils/bot-logger";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Các đường dẫn auth không cần token
  const isAuthPath =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/forgot-password" ||
    path.startsWith("/auth/reset-password");

  // Các đường dẫn cần xác thực
  const isProtectedPath =
    path.startsWith("/dictionary") ||
    path.startsWith("/personal") ||
    path.startsWith("/documents") ||
    path.startsWith("/assistant") ||
    path.startsWith("/tests");

  const isAuthenticated = !!req.auth;

  // Kiểm tra xem russian_level có tồn tại không
  const russianLevel = req.auth?.user?.metadata?.russian_level;

  console.log("russianLevel", russianLevel);
  botLogger.info("russianLevel", { russianLevel });
  const isProficiencyTestPath = path === "/tests/proficiency-test";

  // Nếu người dùng đã đăng nhập, russian_level là null, và không ở trang kiểm tra trình độ
  // thì chuyển hướng đến trang kiểm tra trình độ
  if (
    isAuthenticated &&
    (russianLevel === null ||
      russianLevel === "" ||
      russianLevel === undefined) &&
    !isProficiencyTestPath
  ) {
    return NextResponse.redirect(new URL("/tests/proficiency-test", nextUrl));
  }

  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/personal", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/dictionary/:path*",
    "/personal/:path*",
    "/documents/:path*",
    "/assistant/:path*",
    "/tests/:path*",
  ],
};
