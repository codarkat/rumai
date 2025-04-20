import httpx
import json
import logging
from typing import List, Dict, Any

from app.core.config import settings
from app.models.schemas import GenerateExerciseRequest, VocabularyExerciseDBCreate # Import necessary schemas
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

# Mapping from internal levels (1-4) to CEFR levels for the prompt
LEVEL_MAP = {
    1: "A1",
    2: "A2",
    3: "B1",
    4: "B2", # Or map 4 to B2/C1 depending on desired difficulty
}

def _construct_gemini_prompt(params: GenerateExerciseRequest) -> str:
    """Constructs the prompt for Gemini based on request parameters."""
    level_cefr = LEVEL_MAP.get(params.level, "A1") # Default to A1 if level is invalid
    count = params.count
    topic = params.topic

    # Reusing the prompt structure from the frontend example
    prompt = f"""Tạo bài kiểm tra từ vựng cho người học tiếng Nga ở trình độ {level_cefr}.
Vui lòng tạo {count} câu hỏi về chủ đề "{topic}".

Vai trò của bạn là thiết kế các bài kiểm tra từ vựng tiếng Nga hiệu quả và phù hợp theo ngữ cảnh với các nguyên tắc sau:

1. PHÂN LOẠI TỪ VỰNG:
   - Nhóm từ vựng theo chủ đề cụ thể "{topic}"
   - Phân loại từ vựng và cấu trúc câu hỏi theo cấp độ CEFR {level_cefr}

2. TÍCH HỢP NGỮ PHÁP:
   - Lồng ghép các điểm ngữ pháp quan trọng liên quan đến từ vựng:
     - Biến cách danh từ (6 cách) phù hợp với trình độ {level_cefr}
     - Chia động từ (thì, thể hoàn thành/chưa hoàn thành, thức) phù hợp với trình độ {level_cefr}
     - Sử dụng đúng giới từ đi kèm với các cách
     - Sử dụng liên từ để tạo câu phức (ở cấp độ phù hợp)

3. NGỮ CẢNH THỰC TẾ:
   - Đặt từ vựng vào các ngữ cảnh giao tiếp tự nhiên và các tình huống thực tế
   - Sử dụng các câu hoặc đoạn hội thoại ngắn để làm ví dụ hoặc câu hỏi
   - Đảm bảo các ví dụ thiết thực, hữu ích và phù hợp với cấp độ {level_cefr}

4. DẠNG CÂU HỎI:
   - Tạo câu hỏi trắc nghiệm đa lựa chọn để người dùng chọn bản dịch tiếng Việt chính xác
   - Đảm bảo các lựa chọn sai (nhiễu) có tính hợp lý và hữu ích cho việc học

5. ĐỘ CHÍNH XÁC VÀ SỰ LIÊN QUAN:
   - Đảm bảo tính chính xác về ngữ pháp và chính tả tiếng Nga
   - Sử dụng từ vựng phổ biến và có thể bao gồm các từ hiện đại nếu phù hợp
   - Đảm bảo tất cả các bản dịch tiếng Việt chính xác và tự nhiên

Mỗi câu hỏi nên có một từ/cụm từ/câu tiếng Nga, bản dịch tiếng Việt, và 4 lựa chọn tiếng Việt để chọn.
Đáp án đúng phải khớp với bản dịch tiếng Việt.

Định dạng phản hồi dưới dạng mảng JSON hợp lệ với cấu trúc sau cho mỗi mục:
{{
  "russian": "Từ/cụm từ/câu tiếng Nga",
  "vietnamese": "Bản dịch tiếng Việt",
  "options": ["lựa chọn1", "lựa chọn2", "lựa chọn3", "lựa chọn4"],
  "correct_answer": "Bản dịch tiếng Việt chính xác",
  "explanation": "Giải thích ngắn gọn về đáp án, đặc biệt nếu liên quan đến một điểm ngữ pháp cụ thể"
}}

Đảm bảo:
- Tất cả các lựa chọn là từ/cụm từ tiếng Việt hợp lệ
- Đáp án đúng được bao gồm trong mảng các lựa chọn
- Đối với trình độ cao hơn (B1+), bao gồm một số cụm từ hoặc câu ngắn thể hiện cấu trúc ngữ pháp
- Cung cấp giải thích ngắn gọn cho các mục liên quan đến ngữ pháp
- Độ khó phù hợp với cấp độ CEFR yêu cầu ({level_cefr})

Chỉ trả về mảng JSON, không có văn bản bổ sung nào khác."""
    return prompt

async def generate_exercises_via_gemini(params: GenerateExerciseRequest) -> List[Dict[str, Any]]:
    """
    Calls the gemini_service to generate vocabulary exercises.

    Args:
        params: Parameters for generation (level, count, topic).

    Returns:
        A list of dictionaries, where each dictionary represents a generated exercise item.

    Raises:
        HTTPException: If the call to gemini_service fails or returns an error.
    """
    prompt = _construct_gemini_prompt(params)
    gemini_request_payload = {"message": prompt}
    # Optionally add model_name if needed:
    # gemini_request_payload["model_name"] = "specific-model-if-needed"

    # Retrieve API key from settings (loaded from main .env)
    api_key = settings.DEFAULT_GOOGLE_API_KEY # Assuming gemini_service uses this setting name
    if not api_key:
         logger.error("GOOGLE_API_KEY is not configured for Exercise Management Service to call Gemini Service.")
         raise HTTPException(
             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
             detail="Internal configuration error: Missing API key for AI service communication."
         )

    headers = {"X-API-Key": api_key, "Content-Type": "application/json"}
    gemini_service_url = f"{settings.GEMINI_SERVICE_URL}/generate-text" # Updated to use new endpoint path

    logger.info(f"Calling Gemini Service at {gemini_service_url} for topic '{params.topic}' level {params.level}")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(gemini_service_url, headers=headers, json=gemini_request_payload, timeout=120.0) # Increased timeout
            response.raise_for_status() # Raise exception for 4xx or 5xx status codes

            gemini_response = response.json()
            generated_text = gemini_response.get("result")

            if not generated_text:
                logger.error("Gemini service returned an empty result.")
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI service returned empty result.")

            # Attempt to parse the generated text as JSON array
            try:
                # Find the JSON array within the response text if necessary
                json_match = json.loads(generated_text) # Assume result is directly the JSON string
                if isinstance(json_match, list):
                     logger.info(f"Successfully generated and parsed {len(json_match)} exercises from Gemini.")
                     return json_match
                else:
                     logger.error(f"Gemini service result is not a JSON array: {generated_text[:200]}...")
                     raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI service returned invalid format (not a JSON array).")
            except json.JSONDecodeError as json_err:
                logger.error(f"Failed to parse JSON response from Gemini service: {json_err}. Response text: {generated_text[:500]}...")
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Failed to parse AI service response: {json_err}")

        except httpx.RequestError as exc:
            logger.error(f"HTTP request to Gemini service failed: {exc}")
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Could not connect to AI service: {exc}")
        except httpx.HTTPStatusError as exc:
            logger.error(f"Gemini service returned error status {exc.response.status_code}: {exc.response.text}")
            detail = f"AI service error: {exc.response.status_code}"
            try: # Try to get detail from AI service response
                 error_detail = exc.response.json().get("detail", exc.response.text)
                 detail += f" - {error_detail}"
            except:
                 pass
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)
        except Exception as e:
            logger.exception(f"An unexpected error occurred while calling Gemini service: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error during AI interaction: {e}")