export type MessageRole = "user" | "assistant";

export type MessageContent =
  | string
  | {
      text?: string;
      imageUrl?: string;
      imageData?: string; // base64 encoded image data
      imageFile?: File;
    };

export interface Message {
  id: string;
  role: MessageRole;
  content: MessageContent;
  timestamp: Date | string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface OCRResult {
  text: string;
  confidence?: number;
}
