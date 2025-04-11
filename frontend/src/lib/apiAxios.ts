import { auth } from "@/auth";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { authService } from "@/services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helper function to check if we're in a browser environment
export const isBrowser = typeof window !== "undefined";

class ApiClient {
  private api: AxiosInstance;
  // Flag để tránh nhiều request token refresh cùng lúc
  private isRefreshing = false;
  // Hàng đợi các requests chờ refresh token
  private failedRequestsQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Nếu đang ở endpoint refresh hoặc login thì không cần kiểm tra token
        const isAuthEndpoint =
          config.url?.includes("/auth/login") ||
          config.url?.includes("/auth/refresh") ||
          config.url?.includes("/auth/register");

        if (isAuthEndpoint) {
          return config;
        }

        if (isBrowser) {
          try {
            // Kiểm tra xem token đã hết hạn chưa
            const isTokenExpired = await authService.isTokenExpired();
            if (isTokenExpired && !this.isRefreshing) {
              // Token đã hết hạn, kiểm tra refresh token
              const refreshToken = await authService.getStoredRefreshToken();
              const isRefreshTokenExpired =
                await authService.isRefreshTokenExpired();

              if (refreshToken && !isRefreshTokenExpired) {
                // Đánh dấu là đang refresh token
                this.isRefreshing = true;

                try {
                  // Thực hiện refresh token
                  const tokenData = await authService.refreshToken(
                    refreshToken
                  );
                  // Cập nhật token
                  config.headers.Authorization = `Bearer ${tokenData.token}`;

                  // Thành công, đánh dấu không còn đang refresh
                  this.isRefreshing = false;

                  return config;
                } catch (refreshError) {
                  this.isRefreshing = false;
                  // Refresh token thất bại, đăng xuất
                  await signOut({ redirect: true, callbackUrl: "/auth/login" });
                  return Promise.reject(refreshError);
                }
              } else if (isRefreshTokenExpired) {
                // Refresh token đã hết hạn, đăng xuất
                await signOut({ redirect: true, callbackUrl: "/auth/login" });
                return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));
              }
            } else {
              // Token còn hạn, lấy từ session
              const session = await getSession();
              if (session?.user?.token) {
                config.headers.Authorization = `Bearer ${session.user.token}`;
              }
            }
          } catch (error) {
            console.error("Error getting session:", error);
          }
        } else {
          // Server-side code
          try {
            const session = await auth();
            if (session?.user?.token) {
              config.headers.Authorization = `Bearer ${session.user.token}`;
            }
          } catch (error) {
            console.error("Error getting auth session:", error);
          }
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token issues
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        const isAuthEndpoint =
          originalRequest.url?.includes("/auth/login") ||
          originalRequest.url?.includes("/auth/refresh");

        // Nếu không phải lỗi 401 hoặc request đã thử refresh token rồi hoặc đang ở endpoint auth
        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          isAuthEndpoint
        ) {
          return Promise.reject(error);
        }

        if (this.isRefreshing) {
          try {
            // Nếu đang refresh token, đưa request vào hàng đợi
            return new Promise((resolve, reject) => {
              this.failedRequestsQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(originalRequest));
                },
                reject: (err) => {
                  reject(err);
                },
              });
            });
          } catch (queueError) {
            return Promise.reject(queueError);
          }
        }

        // Đánh dấu là đang refresh token
        this.isRefreshing = true;
        originalRequest._retry = true;

        try {
          let newToken: string | null = null;

          if (isBrowser) {
            // Xử lý refresh token trong browser
            const refreshToken = await authService.getStoredRefreshToken();
            if (!refreshToken) {
              throw new Error("Không có refresh token");
            }

            // Kiểm tra hạn của refresh token
            const isRefreshTokenExpired =
              await authService.isRefreshTokenExpired();
            if (isRefreshTokenExpired) {
              throw new Error("Refresh token đã hết hạn");
            }

            const tokenData = await authService.refreshToken(refreshToken);
            newToken = tokenData.token;
          } else {
            // Xử lý refresh token cho server - có thể cần triển khai tùy vào cách lưu trữ
            throw new Error("Server-side token refresh not implemented");
          }

          // Cập nhật Authorization header cho request hiện tại
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Xử lý hàng đợi các requests đang đợi
          this.failedRequestsQueue.forEach((request) => {
            request.resolve(newToken as string);
          });

          // Xóa hàng đợi
          this.failedRequestsQueue = [];

          // Thực hiện lại request ban đầu với token mới
          return this.api(originalRequest);
        } catch (refreshError) {
          // Xử lý hàng đợi các requests đang đợi với lỗi
          this.failedRequestsQueue.forEach((request) => {
            request.reject(refreshError as Error);
          });

          // Xóa hàng đợi
          this.failedRequestsQueue = [];

          // Logout nếu ở browser
          if (isBrowser) {
            try {
              await signOut({ redirect: true, callbackUrl: "/auth/login" });
            } catch (signOutError) {
              console.error("Error signing out:", signOutError);
            }
          }

          return Promise.reject(refreshError);
        } finally {
          // Kết thúc quá trình refresh
          this.isRefreshing = false;
        }
      }
    );
  }

  // Public method to get the configured axios instance
  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export const apiAxios = apiClient.getAxiosInstance();
