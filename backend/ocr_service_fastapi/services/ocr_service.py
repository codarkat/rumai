from google.cloud import vision
from google.api_core.exceptions import GoogleAPIError, PermissionDenied, ResourceExhausted, InvalidArgument
import io
from typing import List, Dict, Any


class OCRService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient()

    async def detect_text(self, image_content: bytes) -> Dict[str, Any]:
        """
        Nhận dạng văn bản từ hình ảnh sử dụng Google Vision API
        """
        image = vision.Image(content=image_content)

        # Bắt lỗi chi tiết khi gọi Google Vision
        try:
            response = self.client.text_detection(image=image)
        except PermissionDenied as e:
            # Lỗi key không đúng hoặc chưa đủ quyền
            raise PermissionDenied(str(e))
        except ResourceExhausted as e:
            # Lỗi vượt quota
            raise ResourceExhausted(str(e))
        except InvalidArgument as e:
            # Lỗi file ảnh không hợp lệ
            raise InvalidArgument(str(e))
        except GoogleAPIError as e:
            # Lỗi chung khác của Google
            raise GoogleAPIError(str(e))

        # Kiểm tra lỗi trả về trong response
        if response.error.message:
            # Tùy ý bạn, có thể raise GoogleAPIError hoặc Exception
            raise GoogleAPIError(f"Error in text recognition: {response.error.message}")

        texts = response.text_annotations
        if not texts:
            return {"text": "", "details": []}

        # Tổng hợp kết quả
        full_text = texts[0].description
        details = []

        for text in texts[1:]:  # Bỏ qua phần tử đầu tiên vì nó chứa toàn bộ văn bản
            vertices = []
            for vertex in text.bounding_poly.vertices:
                vertices.append({"x": vertex.x, "y": vertex.y})

            details.append({
                "text": text.description,
                "bounding_box": vertices
            })

        return {
            "text": full_text,
            "details": details
        }