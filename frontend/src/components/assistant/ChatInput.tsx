"use client";

import React, {
  useState,
  FormEvent,
  KeyboardEvent,
  ChangeEvent,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Loader2, Paperclip, Smile, Image, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isLoading) {
      onSendMessage(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file hình ảnh");
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Lưu file vào state
    setSelectedFile(file);

    // Tạo URL preview cho hình ảnh
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    toast.success("Đã tải lên hình ảnh. Nhấn gửi để bot phân tích.");
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
          flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl 
          ${
            isFocused
              ? "bg-white dark:bg-gray-900 shadow-lg ring-1 ring-blue-200 dark:ring-blue-800"
              : "bg-gray-50 dark:bg-gray-900"
          }
          transition-all duration-300 ease-in-out
        `}
        >
          {previewUrl && (
            <div className="relative w-full mb-2">
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[200px]">
                <img
                  src={previewUrl}
                  alt="Uploaded"
                  className="w-full h-auto max-h-[200px] object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-gray-800/70 text-white rounded-full p-1 hover:bg-gray-900/90 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <Textarea
            value={message}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              previewUrl
                ? "Thêm mô tả cho hình ảnh (tùy chọn)..."
                : "Nhập tin nhắn của bạn..."
            }
            className="min-h-[50px] max-h-[150px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 p-2 text-base focus:outline-none"
            disabled={isLoading}
            style={{ border: "none", outline: "none", boxShadow: "none" }}
          />

          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isLoading}
              />

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={triggerImageUpload}
                disabled={isLoading}
                className="h-9 w-9 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200"
                title="Tải lên hình ảnh"
              >
                <Image size={18} />
                <span className="sr-only">Tải lên hình ảnh</span>
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200 hidden sm:flex"
                title="Đính kèm tệp"
              >
                <Paperclip size={18} />
                <span className="sr-only">Đính kèm tệp</span>
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors duration-200 hidden sm:flex"
                title="Ghi âm"
              >
                <Mic size={18} />
                <span className="sr-only">Ghi âm</span>
              </Button>
            </div>

            <Button
              type="submit"
              size="icon"
              disabled={(!message.trim() && !previewUrl) || isLoading}
              className={`
                h-10 w-10 rounded-full transition-all duration-300
                ${
                  (message.trim() || previewUrl) && !isLoading
                    ? "bg-gradient-to-r from-blue-600 to-sky-400 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-sky-500 scale-100 hover:scale-105"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }
              `}
              title="Gửi tin nhắn"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Gửi tin nhắn</span>
            </Button>
          </div>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs py-1 px-3 rounded-full shadow-sm"
          >
            Đang xử lý tin nhắn...
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};
