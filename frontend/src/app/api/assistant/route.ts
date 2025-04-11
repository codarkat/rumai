import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { assistantService, Message } from "@/services/ai";

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra xác thực người dùng
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để sử dụng tính năng này" },
        { status: 401 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Định dạng tin nhắn không hợp lệ" },
        { status: 400 }
      );
    }

    // Xử lý tin nhắn thông qua assistant service
    const response = await assistantService.sendMessage(messages as Message[]);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Lỗi trong API assistant:", error.message);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
