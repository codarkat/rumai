import { dictionaryService } from "@/services/ai";

export interface VocabularyItem {
  id: number;
  russian: string;
  vietnamese: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface GenerateVocabularyTestParams {
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  count?: number;
  topic?: string;
}

/**
 * Service xử lý các tác vụ liên quan đến từ vựng
 */
class VocabularyService {
  /**
   * Tạo bài kiểm tra từ vựng
   */
  async generateVocabularyTest({
    level = "A1",
    count = 10,
    topic = "general",
  }: GenerateVocabularyTestParams): Promise<VocabularyItem[]> {
    try {
      const prompt = `Tạo bài kiểm tra từ vựng cho người học tiếng Nga ở trình độ ${level}. 
      Vui lòng tạo ${count} câu hỏi về chủ đề "${topic}".
      
      Vai trò của bạn là thiết kế các bài kiểm tra từ vựng tiếng Nga hiệu quả và phù hợp theo ngữ cảnh với các nguyên tắc sau:

      1. PHÂN LOẠI TỪ VỰNG:
         - Nhóm từ vựng theo chủ đề cụ thể "${topic}"
         - Phân loại từ vựng và cấu trúc câu hỏi theo cấp độ CEFR ${level}

      2. TÍCH HỢP NGỮ PHÁP:
         - Lồng ghép các điểm ngữ pháp quan trọng liên quan đến từ vựng:
           - Biến cách danh từ (6 cách) phù hợp với trình độ ${level}
           - Chia động từ (thì, thể hoàn thành/chưa hoàn thành, thức) phù hợp với trình độ ${level}
           - Sử dụng đúng giới từ đi kèm với các cách
           - Sử dụng liên từ để tạo câu phức (ở cấp độ phù hợp)

      3. NGỮ CẢNH THỰC TẾ:
         - Đặt từ vựng vào các ngữ cảnh giao tiếp tự nhiên và các tình huống thực tế
         - Sử dụng các câu hoặc đoạn hội thoại ngắn để làm ví dụ hoặc câu hỏi
         - Đảm bảo các ví dụ thiết thực, hữu ích và phù hợp với cấp độ ${level}

      4. DẠNG CÂU HỎI:
         - Tạo câu hỏi trắc nghiệm đa lựa chọn để người dùng chọn bản dịch tiếng Việt chính xác
         - Đảm bảo các lựa chọn sai (nhiễu) có tính hợp lý và hữu ích cho việc học

      5. ĐỘ CHÍNH XÁC VÀ SỰ LIÊN QUAN:
         - Đảm bảo tính chính xác về ngữ pháp và chính tả tiếng Nga
         - Sử dụng từ vựng phổ biến và có thể bao gồm các từ hiện đại nếu phù hợp
         - Đảm bảo tất cả các bản dịch tiếng Việt chính xác và tự nhiên

      Mỗi câu hỏi nên có một từ tiếng Nga, bản dịch tiếng Việt, và 4 lựa chọn tiếng Việt để chọn.
      Đáp án đúng phải khớp với bản dịch tiếng Việt.
      
      Định dạng phản hồi dưới dạng mảng JSON hợp lệ với cấu trúc sau cho mỗi mục:
      {
        "id": số thứ tự,
        "russian": "Từ/cụm từ/câu tiếng Nga",
        "vietnamese": "Bản dịch tiếng Việt",
        "options": ["lựa chọn1", "lựa chọn2", "lựa chọn3", "lựa chọn4"],
        "correct_answer": "Bản dịch tiếng Việt chính xác",
        "explanation": "Giải thích ngắn gọn về đáp án, đặc biệt nếu liên quan đến một điểm ngữ pháp cụ thể"
      }
      
      Đảm bảo:
      - Tất cả các lựa chọn là từ/cụm từ tiếng Việt hợp lệ
      - Đáp án đúng được bao gồm trong mảng các lựa chọn
      - Đối với trình độ cao hơn (B1+), bao gồm một số cụm từ hoặc câu ngắn thể hiện cấu trúc ngữ pháp
      - Cung cấp giải thích ngắn gọn cho các mục liên quan đến ngữ pháp
      - Độ khó phù hợp với cấp độ CEFR yêu cầu (${level})
      
      Chỉ trả về mảng JSON, không có văn bản bổ sung nào khác.`;

      // Sử dụng AI service để tạo nội dung
      const response = await dictionaryService.generateTextContent(prompt);

      // Phân tích kết quả từ phản hồi
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to parse Gemini AI response as JSON");
      }

      // Parse JSON và xác thực cấu trúc
      const vocabularyItems = JSON.parse(jsonMatch[0]) as VocabularyItem[];

      // Kiểm tra và đảm bảo các câu hỏi đúng cấu trúc
      const validatedItems = vocabularyItems.map((item, index) => {
        // Đảm bảo id liên tục
        item.id = index + 1;

        // Đảm bảo correct_answer có trong options
        if (!item.options.includes(item.correct_answer)) {
          item.options[0] = item.correct_answer;
        }

        // Đảm bảo có 4 lựa chọn
        while (item.options.length < 4) {
          item.options.push(`Lựa chọn bổ sung ${item.options.length + 1}`);
        }

        return item;
      });

      console.log(validatedItems);

      return validatedItems;
    } catch (error) {
      console.error("Lỗi khi tạo bài kiểm tra từ vựng:", error);
      return [];
    }
  }
}

export const vocabularyService = new VocabularyService();
