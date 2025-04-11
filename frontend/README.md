# RussianAI - Ứng dụng học tiếng Nga với AI

## Cấu trúc thư mục

Ứng dụng được tổ chức theo cấu trúc route groups của Next.js:

- `src/app/(auth)`: Chứa các trang xác thực (đăng nhập, đăng ký) không có navbar

  - `login`: Trang đăng nhập
  - `register`: Trang đăng ký

- `src/app/(main)`: Chứa các trang đã xác thực có navbar

  - `page.tsx`: Trang chủ
  - `dictionary`: Từ điển Việt-Nga và Nga-Việt
  - `personal`: Bảng điều khiển người dùng

- `src/app/page.tsx`: Trang chuyển hướng

## Luồng xác thực

Middleware (`src/middleware.ts`) sẽ kiểm tra token và chuyển hướng người dùng:

- Nếu không có token và truy cập vào trang được bảo vệ (`/`, `/dictionary`, `/personal`): Chuyển hướng đến `/login`
- Nếu có token và truy cập vào trang xác thực (`/login`, `/register`): Chuyển hướng đến `/`

## Công nghệ sử dụng

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- NextAuth.js

# Từ điển Việt-Nga và Nga-Việt

Ứng dụng từ điển song ngữ Việt-Nga và Nga-Việt với khả năng tìm kiếm nhanh chóng và chính xác.

## Cấu trúc dự án

```
src/
├── app/
│   ├── api/
│   │   └── dictionary/
│   │       ├── info/
│   │       ├── suggest/
│   │       └── examples/
│   └── dictionary/
│       ├── [type]/
│       │   └── page.tsx
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── data/
│   ├── ru-vi/
│   │   ├── ru-vi.ifo
│   │   ├── ru-vi.idx
│   │   └── ru-vi.dict
│   └── vi-ru/
│       ├── vi-ru.ifo
│       ├── vi-ru.idx
│       └── vi-ru.dict
└── lib/
    └── dict.ts
```

## Cách sử dụng

Ứng dụng hỗ trợ hai loại từ điển:

- Từ điển Việt-Nga: `/dictionary/vi-ru`
- Từ điển Nga-Việt: `/dictionary/ru-vi`

### Tính năng chính

- **Tìm kiếm từ điển**: Tìm kiếm từ trong cả hai loại từ điển Việt-Nga và Nga-Việt
- **Gợi ý từ khóa**: Hiển thị gợi ý từ khóa khi nhập
- **Lịch sử tìm kiếm**: Lưu lịch sử tìm kiếm riêng biệt cho mỗi loại từ điển
- **Phát âm**: Phát âm từ tiếng Nga và tiếng Việt
- **Ví dụ câu**: Tạo ví dụ câu cho từ vựng

## API Endpoints

- `GET /api/dictionary?q=<query>&sort=<sort>&dict=<dict>`: Tìm kiếm từ điển
- `GET /api/dictionary/suggest?q=<query>&dict=<dict>`: Lấy gợi ý từ khóa
- `GET /api/dictionary/info?dict=<dict>`: Lấy thông tin từ điển

Trong đó:

- `<query>`: Từ khóa tìm kiếm
- `<sort>`: Cách sắp xếp kết quả (`relevance` hoặc `alphabetical`)
- `<dict>`: Loại từ điển (`vi-ru` hoặc `ru-vi`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Gemini API Integration

This project uses Google's Gemini API to generate example sentences for Russian words. To use this feature:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the root directory
3. Add your API key to the `.env.local` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Restart the development server

The example sentences will be automatically generated when you click on a dictionary entry.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Telegram Logger

Telegram Logger là một utility giúp gửi các log messages đến Telegram channel thông qua Webhook URL. Logger này được thiết kế để xử lý nhiều loại dữ liệu khác nhau một cách an toàn và tuân thủ các giới hạn của Telegram Webhook API.

## Cài đặt

1. Thêm Telegram Webhook URL vào file môi trường (`.env.local`):

```env
NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL="your_telegram_webhook_url"
```

2. Import Telegram Logger:

```typescript
import { botLogger } from "@/utils/telegram-logger";
```

## Cách sử dụng

### 1. Gửi thông tin (Info Log)

```typescript
// Log thông tin đơn giản
await botLogger.info("User logged in successfully");

// Log thông tin với chi tiết bổ sung
await botLogger.info("Payment processed", {
  userId: "123456",
  amount: 100,
  currency: "USD",
  timestamp: new Date(),
});
```

### 2. Gửi cảnh báo (Warning Log)

```typescript
// Log cảnh báo đơn giản
await botLogger.warn("High CPU usage detected");

// Log cảnh báo với chi tiết
await botLogger.warn("Rate limit approaching", {
  currentRate: "85%",
  threshold: "90%",
  service: "API Gateway",
  timeWindow: "5 minutes",
});
```

### 3. Gửi lỗi (Error Log)

```typescript
// Log lỗi từ Error object
try {
  throw new Error("Database connection failed");
} catch (error) {
  await botLogger.error(error, {
    context: "Database Service",
    attemptCount: 3,
    lastAttempt: new Date(),
  });
}

// Log lỗi từ string
await botLogger.error("Authentication failed", {
  userId: "123456",
  reason: "Invalid credentials",
  ipAddress: "192.168.1.1",
});
```

## Tính năng

- **Auto-formatting**: Tự động định dạng và làm đẹp các message gửi đến Telegram
- **Error Handling**: Xử lý an toàn các lỗi và stack traces
- **Data Sanitization**: Tự động cắt ngắn nội dung dài và đảm bảo tuân thủ giới hạn của Telegram
- **Type Safety**: Hỗ trợ TypeScript với type definitions đầy đủ
- **Flexible Details**: Cho phép thêm các trường thông tin tùy chỉnh

## Giới hạn

Logger tự động tuân thủ các giới hạn của Telegram Webhook:

- Độ dài description tối đa: 4096 ký tự
- Độ dài field value tối đa: 1024 ký tự
- Độ dài field name tối đa: 256 ký tự
- Độ dài title tối đa: 256 ký tự
- Số lượng fields tối đa: 25 fields

## Xử lý lỗi

Logger tự động xử lý và log các lỗi liên quan đến việc gửi message:

- Lỗi kết nối
- Lỗi response từ Telegram API
- Lỗi định dạng dữ liệu

## Best Practices

1. **Phân loại log phù hợp**:

   - Sử dụng `info()` cho thông tin thông thường
   - Sử dụng `warn()` cho cảnh báo cần chú ý
   - Sử dụng `error()` cho các lỗi nghiêm trọng

2. **Cung cấp context đầy đủ**:

   ```typescript
   await botLogger.error(error, {
     component: "AuthService",
     method: "validateToken",
     userId: user.id,
     // Thêm các thông tin context khác
   });
   ```

3. **Xử lý bất đồng bộ**:

   ```typescript
   try {
     await someAsyncOperation();
   } catch (error) {
     await botLogger.error(error);
     // Xử lý lỗi tiếp theo nếu cần
   }
   ```

4. **Gom nhóm thông tin liên quan**:
   ```typescript
   await botLogger.info("System Status", {
     cpu: cpuUsage,
     memory: memoryUsage,
     disk: diskSpace,
     uptime: systemUptime,
   });
   ```
