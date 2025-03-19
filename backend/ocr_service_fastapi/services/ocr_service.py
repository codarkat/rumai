from google.cloud import vision
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
        response = self.client.text_detection(image=image)

        if response.error.message:
            raise Exception(f"Lỗi khi nhận dạng văn bản: {response.error.message}")

        texts = response.text_annotations

        if not texts:
            return {"text": "", "details": []}

        # Tổng hợp kết quả
        full_text = texts[0].description
        details = []

        for text in texts[1:]:  # Bỏ qua phần tử đầu tiên (vì nó chứa toàn bộ văn bản)
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
