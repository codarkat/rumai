"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Message, ChatState } from "@/types/assistant";
import { assistantService } from "@/services/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Bot, RefreshCw, Volume2, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  INITIAL_GREETING_MESSAGE,
  QUESTION_SUGGESTIONS,
} from "@/constants/assistant";

// Đảm bảo timestamp là chuỗi ISO để tránh lỗi hydration
const INITIAL_MESSAGES: Message[] = [
  {
    id: uuidv4(),
    role: "assistant",
    content: INITIAL_GREETING_MESSAGE,
    timestamp: new Date().toISOString(),
  },
];

// Các gợi ý câu hỏi
const SUGGESTIONS = QUESTION_SUGGESTIONS;

export const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: INITIAL_MESSAGES,
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll container chứa tin nhắn xuống cuối
    if (chatContainerRef.current) {
      const { scrollHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    // Sử dụng requestAnimationFrame để đảm bảo DOM đã được cập nhật
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();

        // Phương pháp backup để đảm bảo scroll hoạt động
        setTimeout(() => {
          if (chatContainerRef.current) {
            const { scrollHeight, clientHeight, scrollTop } =
              chatContainerRef.current;
            // Nếu chưa scroll xuống cuối, thử scroll lại
            if (scrollTop + clientHeight < scrollHeight - 10) {
              chatContainerRef.current.scrollTop = scrollHeight;
            }
          }
        }, 200);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [chatState.messages]);

  // Scroll xuống dưới khi component được mount
  useEffect(() => {
    // Đảm bảo scroll xuống dưới khi component được mount
    scrollToBottom();

    // Thêm event listener để xử lý resize window
    const handleResize = () => {
      scrollToBottom();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Đảm bảo scroll xuống dưới khi có thay đổi về kích thước nội dung
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSendMessage = async (content: string, imageFile?: File) => {
    // Nếu không có nội dung văn bản và không có hình ảnh, không làm gì cả
    if (!content.trim() && !imageFile) return;

    // Tạo nội dung tin nhắn dựa trên văn bản và hình ảnh
    const messageContent = imageFile
      ? { text: content.trim(), imageFile: imageFile }
      : content;

    // Thêm tin nhắn của người dùng vào state
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    if (imageFile) {
      try {
        // Gọi API để lấy phản hồi
        const response = await assistantService.sendMessage([
          ...chatState.messages,
          userMessage,
        ]);
        // Thêm phản hồi từ trợ lý vào state
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      } catch (error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.",
        }));
      }
    } else {
      try {
        // Gọi API để lấy phản hồi
        const response = await assistantService.sendMessage([
          ...chatState.messages,
          userMessage,
        ]);

        // Thêm phản hồi từ trợ lý vào state
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      } catch (error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.",
        }));
      }
    }
  };

  const handleReset = () => {
    setChatState({
      messages: INITIAL_MESSAGES,
      isLoading: false,
      error: null,
    });
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] backdrop-blur-lg bg-white/80 border border-sky-100/50 shadow-xl rounded-2xl overflow-hidden p-0 gap-0">
      <CardHeader className="py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-100 to-sky-50 dark:from-blue-950/50 dark:to-sky-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 shadow-sm flex-shrink-0">
              <AvatarImage src="/assistant-avatar.png" alt="Trợ lý" />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-sky-400 text-white">
                <Bot size={18} />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                Trợ lý học tiếng Nga
              </CardTitle>
              <CardDescription className="text-blue-600/70 dark:text-blue-400/70 text-xs">
                Powered by Gemini AI
              </CardDescription>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <Settings size={16} />
              <span className="sr-only">Cài đặt</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              onClick={handleReset}
            >
              <RefreshCw size={16} />
              <span className="sr-only">Làm mới cuộc trò chuyện</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-0 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-950/50 dark:to-gray-900/50 
        scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-800 dark:hover:scrollbar-thumb-blue-700 relative"
      >
        <div className="flex flex-col min-h-full">
          {chatState.messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 text-center"
            >
              <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Bắt đầu học tiếng Nga cùng trợ lý AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                Hãy đặt câu hỏi về ngữ pháp, từ vựng, phát âm, hoặc bất kỳ điều
                gì liên quan đến tiếng Nga.
              </p>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30 whitespace-normal h-auto py-2"
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex-1">
            {chatState.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          {chatState.isLoading && (
            <div className="flex items-center justify-start p-4">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm flex-shrink-0 mr-3">
                <AvatarImage src="/assistant-avatar.png" alt="Trợ lý" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-sky-400 text-white">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-2xl px-3 py-2 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Đang trả lời...
                </span>
              </motion.div>
            </div>
          )}

          {chatState.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 mx-4 my-2 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30"
            >
              <p className="text-red-600 dark:text-red-300 text-sm">
                {chatState.error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                onClick={() =>
                  setChatState((prev) => ({ ...prev, error: null }))
                }
              >
                Thử lại
              </Button>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </CardContent>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
      />
    </Card>
  );
};
