import { BaseAIService } from "./base";
import { WordWithMeaning } from "@/types";
import { SYSTEM_INSTRUCTION_DICTIONARY_EXAMPLE } from "@/constants/prompts/dictionary";

/**
 * Service xử lý các tác vụ từ điển liên quan đến AI
 */
export class DictionaryAIService extends BaseAIService {
  /**
   * Tạo ví dụ cho danh sách các từ tiếng Nga
   */
  async generateExamples(
    russianWords: string[],
    vietnameseMeaning: string
  ): Promise<WordWithMeaning[]> {
    try {
      // Chuẩn bị prompt
      const userMessage = `Tạo ví dụ cho các từ tiếng Nga sau:
      Các từ: ${russianWords.join(", ")}
      Nghĩa tiếng Việt: ${vietnameseMeaning}
      
      Hãy tạo các ví dụ hữu ích và thiết thực trong ngữ cảnh hàng ngày.`;

      // Tạo model với hướng dẫn hệ thống
      const model = this.getModel({
        role: "system",
        text: SYSTEM_INSTRUCTION_DICTIONARY_EXAMPLE
      });

      // Gọi API
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: userMessage }] },
        ],
      });
      
      const text = result.response.text();
      
      // Xử lý kết quả
      const examples = this.parseJsonResponse(text);
      if (!examples || !Array.isArray(examples)) {
        console.error("Không thể nhận dạng kết quả JSON từ Gemini");
        return [];
      }

      // Kiểm tra số lượng ví dụ
      if (examples.length < russianWords.length) {
        console.warn(
          `Số câu ví dụ (${examples.length}) ít hơn số từ yêu cầu (${russianWords.length})`
        );
      }

      return examples;
    } catch (error) {
      console.error("Lỗi khi tạo ví dụ từ Gemini:", error);
      return [];
    }
  }
}

// Export singleton instance
export const dictionaryAIService = new DictionaryAIService();
