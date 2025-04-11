import { apiAxios } from "@/lib/apiAxios";
import { BaseAIService } from "./base";
import {
  SYSTEM_INSTRUCTION_ASSISTANT,
  SYSTEM_INSTRUCTION_ASSISTANT_IMAGE_OCR,
} from "@/constants/prompts/assistant";
import { OCRResult } from "@/types/assistant";
import { fileToBase64 } from "@/utils/file";

export interface OCRRequestData {
  image: File;
}

export interface ChatMessage {
  role: string;
  content: string;
  imageData?: string;
}

export interface Message {
  role: string;
  content:
    | string
    | {
        text?: string;
        imageFile?: File;
      };
}

/**
 * Service xử lý các tác vụ trợ lý ảo liên quan đến AI
 */
export class AssistantAIService extends BaseAIService {
  /**
   * Gửi và xử lý tin nhắn từ người dùng
   */
  async sendMessage(messages: Message[]): Promise<string> {
    try {
      // Chuẩn bị tin nhắn để xử lý
      const lastMessage = messages[messages.length - 1];
      const hasImage =
        typeof lastMessage.content !== "string" &&
        lastMessage.content.imageFile;

      if (hasImage && typeof lastMessage.content !== "string") {
        // Xử lý tin nhắn có hình ảnh
        const imageData = await fileToBase64(lastMessage.content.imageFile!);
        const text = lastMessage.content.text || "";

        // Kết hợp phân tích OCR và phản hồi thông thường
        const [assistantResponse, ocrResult] = await Promise.all([
          this.processImage(imageData, text),
          this.ocrFromAPI({ image: lastMessage.content.imageFile! }),
        ]);

        return `${assistantResponse} \n---\n**Phân tích OCR từ API:** \n\n ${ocrResult.text}`;
      } else {
        // Xử lý tin nhắn văn bản thông thường
        const conversationHistory = messages
          .filter((msg) => typeof msg.content === "string")
          .map(
            (msg) =>
              `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.content}`
          );

        // Lấy nội dung tin nhắn cuối cùng từ người dùng
        const lastUserContent =
          typeof lastMessage.content === "string"
            ? lastMessage.content
            : lastMessage.content.text || "";

        return await this.processTextMessage(
          lastUserContent,
          conversationHistory
        );
      }
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);
      return "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.";
    }
  }

  /**
   * Phân tích OCR từ hình ảnh sử dụng Gemini trực tiếp
   */
  async ocrFromAPI(data: OCRRequestData): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append("file", data.image);
      // Gọi API OCR theo documentation: https://ocr.rumai.app/docs
      const response = await apiAxios.post("/v1/ocr/detect-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);
      return response.data;
    } catch (error: any) {
      console.error("Lỗi khi nhận diện văn bản:", error.message);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
      }
      throw error;
    }
  }

  /**
   * Phân tích OCR từ hình ảnh sử dụng Gemini trực tiếp
   */
  // async ocrDetectText(data: OCRRequestData): Promise<{ text: string }> {
  //   try {
  //     // Chuyển file sang base64
  //     const imageData = await fileToBase64(data.image);

  //     // Phân tích OCR bằng Gemini
  //     const result = await this.analyzeOCRContent(imageData);

  //     return { text: result.extractedText };
  //   } catch (error: any) {
  //     console.error("Lỗi khi nhận diện văn bản:", error.message);
  //     return {
  //       text: "Không thể phân tích văn bản trong hình ảnh. Vui lòng thử lại sau.",
  //     };
  //   }
  // }

  /**
   * Xử lý tin nhắn văn bản và trả về phản hồi
   */
  async processTextMessage(
    message: string,
    conversationHistory: string[] = []
  ): Promise<string> {
    try {
      const context =
        conversationHistory.length > 0
          ? `Lịch sử cuộc trò chuyện:\n${conversationHistory.join("\n")}\n\n`
          : "";

      const prompt = `${context}Người dùng: ${message}\n\nTrợ lý:`;

      // Sử dụng system prompt từ constants
      return await this.generateTextContent(
        prompt,
        SYSTEM_INSTRUCTION_ASSISTANT
      );
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);
      return "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.";
    }
  }

  /**
   * Xử lý hình ảnh và trả về phân tích
   */
  async processImage(imageData: string, prompt?: string): Promise<string> {
    try {
      const userPrompt = prompt
        ? `Hình ảnh này có kèm câu hỏi: ${prompt}. Hãy phân tích nội dung hình ảnh và trả lời câu hỏi của người dùng.`
        : "Vui lòng phân tích nội dung văn bản tiếng Nga trong hình ảnh này. Nếu có văn bản tiếng Nga, hãy trích xuất và giải thích nghĩa của nó.";

      return await this.generateImageContent(
        userPrompt,
        imageData,
        SYSTEM_INSTRUCTION_ASSISTANT_IMAGE_OCR
      );
    } catch (error) {
      console.error("Lỗi khi xử lý hình ảnh:", error);
      return "Xin lỗi, đã xảy ra lỗi khi xử lý hình ảnh của bạn. Vui lòng thử lại sau.";
    }
  }

  /**
   * Phân tích văn bản OCR và trả về kết quả có cấu trúc
   */
  // async analyzeOCRContent(
  //   imageBase64: string
  // ): Promise<{ extractedText: string; translation: string }> {
  //   try {
  //     // Gọi model để phân tích hình ảnh với system instruction từ constants
  //     const ocrText = await this.generateImageContent(
  //       "Phân tích văn bản trong hình ảnh này theo định dạng đã hướng dẫn.",
  //       imageBase64,
  //       SYSTEM_INSTRUCTION_ASSISTANT_IMAGE_OCR
  //     );

  //     // Trích xuất văn bản và bản dịch từ kết quả
  //     const extractedMatch = ocrText.match(
  //       /VĂN BẢN ĐƯỢC TRÍCH XUẤT:([\s\S]*?)(?=(DỊCH NGHĨA:|GIẢI THÍCH:|$))/i
  //     );
  //     const translationMatch = ocrText.match(
  //       /DỊCH NGHĨA([\s\S]*?)(?=(GIẢI THÍCH:|$))/i
  //     );
  //     const explanationMatch = ocrText.match(/GIẢI THÍCH:([\s\S]*?)(?=$)/i);

  //     const extractedText = extractedMatch
  //       ? extractedMatch[1].trim()
  //       : "Không phát hiện được văn bản";
  //     const translation = translationMatch ? translationMatch[1].trim() : "";
  //     const explanation = explanationMatch ? explanationMatch[1].trim() : "";

  //     const formattedResult = [
  //       `**Văn bản được trích xuất:**\n${extractedText}`,
  //       translation ? `**Dịch nghĩa:**\n${translation}` : "",
  //       explanation ? `**Giải thích:**\n${explanation}` : "",
  //     ]
  //       .filter(Boolean)
  //       .join("\n\n");

  //     return {
  //       extractedText: formattedResult,
  //       translation: translation,
  //     };
  //   } catch (error) {
  //     console.error("Lỗi khi phân tích OCR:", error);
  //     return {
  //       extractedText: "Không thể phân tích văn bản trong hình ảnh.",
  //       translation: "Không thể dịch văn bản. Vui lòng thử lại.",
  //     };
  //   }
  // }

  /**
   * Xử lý văn bản và hình ảnh để trả lời dựa trên URL hình ảnh
   */
  // async processVisionContent(text: string, imageUrl: string): Promise<string> {
  //   try {
  //     // Xử lý hình ảnh với prompt cụ thể
  //     return await this.generateImageContent(text, imageUrl);
  //   } catch (error) {
  //     console.error("Lỗi khi xử lý hình ảnh:", error);
  //     return "Xin lỗi, đã xảy ra lỗi khi xử lý hình ảnh của bạn. Vui lòng thử lại sau.";
  //   }
  // }
}

// Export singleton instance
export const assistantAIService = new AssistantAIService();
