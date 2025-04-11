import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";
// Khởi tạo Google Generative AI với API key từ biến môi trường
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Kiểm tra xác thực người dùng
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để sử dụng tính năng này" },
        { status: 401 }
      );
    }

    // Lấy dữ liệu hình ảnh từ request
    const { imageData } = await req.json();

    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json(
        { error: "Dữ liệu hình ảnh không hợp lệ" },
        { status: 400 }
      );
    }

    // Xử lý base64 image data (loại bỏ phần header nếu có)
    const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, "");

    // Khởi tạo model Gemini Pro Vision
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Tạo prompt cho OCR
    const prompt =
      "Hãy trích xuất tất cả văn bản có trong hình ảnh này. Chỉ trả về văn bản đã trích xuất, không thêm bất kỳ giải thích nào.";

    // Gửi yêu cầu đến model
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    // Lấy kết quả
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      result: {
        text: text.trim(),
      },
    });
  } catch (error) {
    console.error("Lỗi khi xử lý OCR:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý OCR" },
      { status: 500 }
    );
  }
}
