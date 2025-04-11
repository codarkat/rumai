import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Constants moved directly into base.ts to avoid circular dependencies
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
export const GEMINI_MODEL = process.env.GEMINI_API_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";

export interface GeminiSystemConfig {
  role: string;
  text: string;
}

// Helper function moved from lib/gemini
export const createGeminiAI = (apiKey = GEMINI_API_KEY) => {
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Base class for AI services
 */
export class BaseAIService {
  protected genAI: GoogleGenerativeAI;
  protected modelName: string;

  constructor(apiKey = GEMINI_API_KEY, modelName = GEMINI_MODEL) {
    this.genAI = createGeminiAI(apiKey);
    this.modelName = modelName;
  }

  /**
   * Tạo Gemini model với hướng dẫn hệ thống tùy chọn
   */
  protected getModel(systemInstruction?: GeminiSystemConfig): GenerativeModel {
    const modelConfig: any = { model: this.modelName };
    
    if (systemInstruction) {
      modelConfig.systemInstruction = {
        role: systemInstruction.role,
        parts: [{ text: systemInstruction.text }]
      };
    }
    
    return this.genAI.getGenerativeModel(modelConfig);
  }

  /**
   * Gửi tin nhắn văn bản đến Gemini model
   */
  async generateTextContent(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const model = this.getModel(systemPrompt ? {
        role: "system",
        text: systemPrompt
      } : undefined);
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      throw error;
    }
  }

  /**
   * Gửi hình ảnh và prompt đến Gemini Vision với system prompt tùy chọn
   */
  async generateImageContent(prompt: string, imageData: string, systemPrompt?: string): Promise<string> {
    try {
      const model = this.getModel(systemPrompt ? {
        role: "system",
        text: systemPrompt
      } : undefined);
      
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg",
          },
        },
      ]);
      
      return result.response.text();
    } catch (error) {
      console.error("Lỗi khi xử lý hình ảnh với Gemini:", error);
      throw error;
    }
  }

  /**
   * Xác minh trạng thái API key Gemini
   */
  async verifyApiKey(): Promise<boolean> {
    try {
      return Boolean(GEMINI_API_KEY);
    } catch (error) {
      console.error("Lỗi khi xác minh API key:", error);
      return false;
    }
  }

  /**
   * Xử lý phản hồi JSON từ Gemini
   */
  protected parseJsonResponse(text: string): any {
    try {
      // Tìm và trích xuất phần JSON từ response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Nếu không tìm thấy định dạng JSON rõ ràng, thử parse toàn bộ text
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Lỗi khi parse JSON từ Gemini:", parseError);
      return null;
    }
  }
}
