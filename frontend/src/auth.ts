import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService, calculateExpiryTime } from "./services/auth.service";
import { JWT } from "next-auth/jwt";
import { botLogger } from "../utils/bot-logger";

/**
 * Chuyển đổi chuỗi thời gian sang milliseconds
 * @param timeString Chuỗi thời gian dạng "30d", "24h", "60m", "60s"
 * @returns Số milliseconds
 */
export function convertToMilliseconds(timeString: string): number {
  const value = parseInt(timeString);
  const unit = timeString.slice(-1);

  switch (unit) {
    case "d": // days
      return value * 24 * 60 * 60 * 1000;
    case "h": // hours
      return value * 60 * 60 * 1000;
    case "m": // minutes
      return value * 60 * 1000;
    case "s": // seconds
      return value * 1000;
    default:
      throw new Error(`Không hỗ trợ đơn vị thời gian: ${unit}`);
  }
}

// Mở rộng kiểu dữ liệu cho NextAuth
declare module "next-auth" {
  interface User {
    token: string;
    refreshToken?: string;
    tokenExpires?: string;
    refreshTokenExpires?: string;
    metadata?: {
      username?: string;
      is_active?: boolean;
      age?: number | null;
      gender?: string | null;
      russian_level?: string | null;
      gemini_api_key?: string | null;
    };
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      token: string;
      refreshToken?: string;
      tokenExpires?: string;
      refreshTokenExpires?: string;
      metadata?: {
        username?: string;
        is_active?: boolean;
        age?: number | null;
        gender?: string | null;
        russian_level?: string | null;
        gemini_api_key?: string | null;
      };
    };
  }

  interface JWT {
    token: string;
    refreshToken?: string;
    tokenExpires?: string;
    refreshTokenExpires?: string;
    metadata?: {
      username?: string;
      is_active?: boolean;
      age?: number | null;
      gender?: string | null;
      russian_level?: string | null;
      gemini_api_key?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
        token: { label: "Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập email và mật khẩu");
        }

        try {
          // Kiểm tra nếu token đã được cung cấp
          if (credentials.token) {
            // Gọi API để lấy thông tin chi tiết của người dùng
            const userData = await authService.getCurrentUser(
              credentials.token as string
            );
            console.log("Thông tin người dùng từ API:", userData);

            if (userData) {
              // Nếu token được cung cấp nhưng không có thời gian hết hạn, tính toán
              const accessTokenExpireEnv =
                process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE || "30m";
              const refreshTokenExpireEnv =
                process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE || "30d";

              const tokenExpires =
                calculateExpiryTime(accessTokenExpireEnv).toISOString();
              const refreshTokenExpires = calculateExpiryTime(
                refreshTokenExpireEnv
              ).toISOString();

              return {
                id: String(userData.id || "unknown"),
                email: userData.email || (credentials.email as string),
                name: userData.name || "Guest",
                metadata: {
                  username: userData.username || "guest",
                  is_active: userData.is_active || false,
                  age: userData.age || null,
                  gender: userData.gender || null,
                  russian_level: userData.russian_level || null,
                  gemini_api_key: userData.gemini_api_key || null,
                },
                token: credentials.token as string,
                refreshToken: (credentials.refreshToken as string) || "",
                tokenExpires,
                refreshTokenExpires,
              };
            }
          } else {
            // Không có token, thực hiện đăng nhập
            const authResponse = await authService.login({
              email: credentials.email as string,
              password: credentials.password as string,
            });

            const token = authResponse.access_token || authResponse.token || "";
            const refreshToken = authResponse.refresh_token || "";
            const tokenExpires = authResponse.access_token_expires_at;
            const refreshTokenExpires = authResponse.refresh_token_expires_at;

            return {
              id: String(authResponse.user.id || "unknown"),
              email: authResponse.user.email || "guest@mail.com",
              name: authResponse.user.name || "Guest",
              metadata: {
                username: authResponse.user.username || "guest",
                is_active: authResponse.user.is_active || false,
                age: authResponse.user.age || null,
                gender: authResponse.user.gender || null,
                russian_level: authResponse.user.russian_level || null,
                gemini_api_key: authResponse.user.gemini_api_key || null,
              },
              token,
              refreshToken,
              tokenExpires,
              refreshTokenExpires,
            };
          }
        } catch (userError) {
          console.error("Lỗi khi xác thực:", userError);
        }

        // Fallback nếu không xác thực được
        throw new Error("Không thể xác thực người dùng");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        console.log("newSession jwt", session);
        botLogger.info("newSession jwt", session);
        token.metadata = {
          ...session.user.metadata,
        };
        return token;
      }
      if (user) {
        return {
          ...token,
          token: user.token,
          refreshToken: user.refreshToken,
          tokenExpires: user.tokenExpires,
          refreshTokenExpires: user.refreshTokenExpires,
          metadata: user.metadata,
        };
      } else if (
        new Date().getTime() < new Date(token.tokenExpires as string).getTime()
      ) {
        return token;
      } else {
        if (!token.refreshToken) throw new TypeError("Missing refresh_token");
        try {
          const results = await authService.refreshToken(
            token.refreshToken as string
          );
          return {
            ...token,
            token: results.token,
            tokenExpires: results.tokenExpires,
            // refreshToken: results.refreshToken,
            // refreshTokenExpires: results.refreshTokenExpires,
          };
        } catch (error) {
          console.error("Error refreshing access_token", error);
          return token;
        }
      }
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          token: token.token as string,
          refreshToken: token.refreshToken as string,
          tokenExpires: token.tokenExpires as string,
          refreshTokenExpires: token.refreshTokenExpires as string,
          metadata: token.metadata,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Chuyển hướng đến trang home của main sau khi đăng nhập thành công
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/personal`;
      }
      // Nếu URL là URL tương đối, thêm baseUrl vào trước
      else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: convertToMilliseconds(
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE || "30d"
    ),
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".rumai.app" : undefined,
      },
    },
  },
});
