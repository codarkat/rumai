from abc import ABC, abstractmethod
from PIL import Image
import io
import easyocr
import torch
from config import Config
import numpy as np

class OCRService(ABC):
    @abstractmethod
    async def extract_text(self, image_bytes: bytes) -> str:
        pass

class EasyOCRService(OCRService):
    def __init__(self):
        self.reader = easyocr.Reader(Config.EASYOCR_LANGUAGES, gpu=torch.cuda.is_available())
    
    async def extract_text(self, image_bytes: bytes) -> str:
        try:
            # Đọc hình ảnh từ bytes
            image = Image.open(io.BytesIO(image_bytes))
        
            # Chuyển đổi thành định dạng NumPy array
            image_np = np.array(image)
        
            # Sử dụng EasyOCR để trích xuất văn bản
            result = self.reader.readtext(image_np)
        
            return " ".join([text for _, text, _ in result])
        except Exception as e:
            raise ValueError(f"OCR processing error: {str(e)}")

class QwenOCRService(OCRService):
    def __init__(self):
        from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = Qwen2VLForConditionalGeneration.from_pretrained(
            Config.QWEN_MODEL_PATH,
            torch_dtype="auto",
            device_map=self.device
        )
        self.processor = AutoProcessor.from_pretrained(Config.QWEN_MODEL_PATH)
    
    async def extract_text(self, image_bytes: bytes) -> str:
        try:
            # Đọc hình ảnh từ bytes
            image = Image.open(io.BytesIO(image_bytes))
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image", "image": image},
                        {"type": "text", "text": "Extract all text from this image."}
                    ]
                }
            ]
            
            # Xử lý dữ liệu đầu vào cho Qwen
            text = self.processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = self.processor(text=[text], images=[image], return_tensors="pt")
            
            if self.device == "cuda":
                inputs = inputs.to("cuda")
            
            generated_ids = self.model.generate(**inputs, max_new_tokens=512)
            output = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            
            return output
        except Exception as e:
            raise ValueError(f"OCR processing error: {str(e)}")


def get_ocr_service(engine_type: str = "easyocr") -> OCRService:
    """Factory function to get the appropriate OCR service based on hardware capabilities"""
    if engine_type.lower() == "qwen":
        try:
            # Check if we have enough resources for Qwen
            import torch
            mem_available = torch.cuda.get_device_properties(0).total_memory if torch.cuda.is_available() else 0
            
            # If we have GPU with at least 4GB memory, use Qwen
            if torch.cuda.is_available() and mem_available >= 4 * 1024 * 1024 * 1024:
                return QwenOCRService()
            else:
                print("Warning: Insufficient GPU memory for Qwen, falling back to EasyOCR")
                return EasyOCRService()
        except:
            print("Warning: Error initializing Qwen, falling back to EasyOCR")
            return EasyOCRService()
    else:
        return EasyOCRService()
