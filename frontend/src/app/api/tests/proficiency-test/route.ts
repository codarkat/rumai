import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Đọc file JSON từ đường dẫn tương đối
    const filePath = path.join(
      process.cwd(),
      "src/data/tests/proficiency-test.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const questions = JSON.parse(fileContents);

    // Thêm metadata về bài kiểm tra
    const testMetadata = {
      id: "proficiency-test",
      title: "Bài Kiểm Tra Trình Độ Tiếng Nga",
      description:
        "Bài kiểm tra này sẽ giúp xác định trình độ tiếng Nga của bạn từ A1 đến C2",
      duration: 40, // thời gian làm bài (phút)
      totalQuestions: questions.length,
      levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
      questionTypes: ["single", "multiple", "text"],
    };

    return NextResponse.json({
      metadata: testMetadata,
      questions: questions,
    });
  } catch (error) {
    console.error("Error reading proficiency test data:", error);
    return NextResponse.json(
      { error: "Failed to fetch proficiency test questions" },
      { status: 500 }
    );
  }
}
