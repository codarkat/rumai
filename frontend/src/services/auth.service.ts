import { apiAxios, isBrowser } from "@/lib/apiAxios";
import { getSession, signOut } from "next-auth/react";

// Hàm tính thời gian hết hạn của token dựa vào định dạng như '30m', '1h', '30d'
export const calculateExpiryTime = (duration: string): Date => {
  const now = new Date();
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));

  switch (unit) {
    case "m":
      return new Date(now.getTime() + value * 60 * 1000);
    case "h":
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case "d":
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 30 * 60 * 1000); // Default: 30 minutes
  }
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  username: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface TokenData {
  token: string;
  refreshToken?: string;
  tokenExpires?: string;
  refreshTokenExpires?: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  access_token_expires_at?: string;
  refresh_token_expires_at?: string;
  user: {
    id: string | number;
    email: string;
    full_name?: string;
    username?: string;
    is_active?: boolean;
    age?: number | null;
    gender?: string | null;
    russian_level?: string | null;
    gemini_api_key?: string | null;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log(`Gọi API: /auth/login với email: ${credentials.email}`);
      const response = await apiAxios.post("/auth/login", credentials);
      console.log("Kết quả đăng nhập:", response.data);

      // Lấy thông tin token từ response
      const token = response.data.access_token || response.data.token;
      const refreshToken = response.data.refresh_token;

      // Tính thời gian hết hạn dựa vào env
      const accessTokenExpireEnv =
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE || "30m";
      const refreshTokenExpireEnv =
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE || "30d";

      const tokenExpires =
        calculateExpiryTime(accessTokenExpireEnv).toISOString();
      const refreshTokenExpires = calculateExpiryTime(
        refreshTokenExpireEnv
      ).toISOString();

      // Thêm thông tin thời gian hết hạn vào response
      response.data.access_token_expires_at = tokenExpires;
      response.data.refresh_token_expires_at = refreshTokenExpires;

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenData> {
    try {
      if (!refreshToken) {
        throw new Error("Refresh token không tồn tại");
      }

      const response = await apiAxios.post("/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      const newToken = response.data.access_token || response.data.token;
      // const newRefreshToken = response.data.refresh_token;

      // Tính thời gian hết hạn dựa vào env
      const accessTokenExpireEnv =
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE || "30m";
      // const refreshTokenExpireEnv =
      //   process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE || "30d";

      const tokenExpires =
        calculateExpiryTime(accessTokenExpireEnv).toISOString();
      // const refreshTokenExpires = calculateExpiryTime(
      //   refreshTokenExpireEnv
      // ).toISOString();

      return {
        token: newToken,
        tokenExpires,
        // refreshToken: newRefreshToken,
        // refreshTokenExpires,
      };
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);

      // Đăng xuất người dùng khi gặp lỗi
      await signOut({ redirect: false });
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiAxios.post("/auth/register", data);
      console.log("Kết quả đăng ký:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Lỗi đăng ký:", error);
      console.error("Lỗi đăng ký:", error.message);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
      }
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await apiAxios.post("/auth/forgot-password", data);
      return response.data;
    } catch (error: any) {
      console.error("Lỗi quên mật khẩu:", error.message);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
      }
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await apiAxios.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      console.error("Lỗi đặt lại mật khẩu:", error.message);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut({ redirect: false });
  }

  async getCurrentUser(token: string): Promise<AuthResponse["user"] | null> {
    try {
      if (!token) return null;

      console.log(
        "Gọi API getCurrentUser với token:",
        token.substring(0, 15) + "..."
      );

      // Sử dụng config đặc biệt để override token từ session
      const response = await apiAxios.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin người dùng:", error.message);
      if (error.response) {
        console.error("Mã lỗi:", error.response.status);
        console.error("Dữ liệu lỗi:", error.response.data);
      }
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session?.user?.token;
  }

  async getStoredToken(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.token || null;
  }

  async getStoredRefreshToken(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.refreshToken || null;
  }

  async getTokenExpiry(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.tokenExpires || null;
  }

  async getRefreshTokenExpiry(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.refreshTokenExpires || null;
  }

  async isTokenExpired(): Promise<boolean> {
    const expiryStr = await this.getTokenExpiry();
    if (!expiryStr) return true;

    const expiry = new Date(expiryStr);
    const now = new Date();

    return now >= expiry;
  }

  async isRefreshTokenExpired(): Promise<boolean> {
    const expiryStr = await this.getRefreshTokenExpiry();
    if (!expiryStr) return true;

    const expiry = new Date(expiryStr);
    const now = new Date();

    return now >= expiry;
  }

  async updateProfile(
    data: Partial<AuthResponse["user"]>
  ): Promise<AuthResponse["user"]> {
    try {
      // Sử dụng path tương đối vì đã có baseURL trong apiAxios
      const response = await apiAxios.put("/auth/profile", data);
      return response.data;
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error.message);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
