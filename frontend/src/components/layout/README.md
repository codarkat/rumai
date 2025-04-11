# Layout Components

Các components layout được sử dụng để tạo cấu trúc cơ bản cho trang web.

## MainLayout

`MainLayout` là layout chính được sử dụng cho hầu hết các trang trong ứng dụng. Nó bao gồm:

- Navbar (từ `@/components/navigation/Navbar`)
- Main content area
- Footer

### Cách sử dụng

```tsx
"use client";

import { MainLayout } from "@/components/layout/MainLayout";

export default function YourPage() {
  return (
    <MainLayout>
      {/* Nội dung trang của bạn */}
      <div className="container mx-auto">
        <h1>Tiêu đề trang</h1>
        <p>Nội dung trang...</p>
      </div>
    </MainLayout>
  );
}
```

### Tính năng

- **Tự động điều chỉnh padding**: MainLayout tự động thêm padding cho nội dung dựa vào loại trang. Trang chủ ("/") không có padding để cho phép thiết kế hero section đầy đủ chiều rộng, trong khi các trang khác có padding phù hợp.

- **Responsive**: Layout được thiết kế để hiển thị tốt trên mọi kích thước màn hình.

- **SEO-friendly**: Bạn có thể thêm các thuộc tính metadata trong các trang con của mình.

### Props

MainLayout nhận các props sau:

| Prop     | Loại      | Mô tả                                      |
| -------- | --------- | ------------------------------------------ |
| children | ReactNode | Nội dung trang sẽ được render trong layout |

### Ví dụ

Xem ví dụ về cách sử dụng MainLayout tại `src/app/example-page/page.tsx`.
