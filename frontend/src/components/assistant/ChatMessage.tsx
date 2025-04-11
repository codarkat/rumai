"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/assistant";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import {
  Bot,
  User,
  Image as ImageIcon,
  Copy,
  Check,
  Volume2,
  Download,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { CustomDialogContent } from "@/components/custom/CustomDialog";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [inlineImageLoaded, setInlineImageLoaded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);

  // Xác định nếu tin nhắn có hình ảnh
  const hasImage =
    typeof message.content !== "string" && message.content.imageFile;
  const messageText =
    typeof message.content === "string"
      ? message.content
      : message.content.text || "";
  const imageFile =
    typeof message.content !== "string" ? message.content.imageFile : null;

  // Xác định nếu tin nhắn chỉ có hình ảnh mà không có văn bản
  const isImageOnly = hasImage && !messageText.trim();

  // Chuyển đổi File thành URL khi cần thiết
  useEffect(() => {
    if (imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImageFileUrl(objectUrl);

      // Cleanup function to revoke the URL when component unmounts
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof imageFile === "string") {
      setImageFileUrl(imageFile);
    } else {
      setImageFileUrl(null);
    }
  }, [imageFile]);

  // Sử dụng useEffect để đảm bảo thời gian chỉ được tính toán ở phía client
  useEffect(() => {
    const date = new Date(message.timestamp);
    setFormattedTime(format(date, "HH:mm", { locale: vi }));
  }, [message.timestamp]);

  // Reset trạng thái hình ảnh khi message thay đổi
  useEffect(() => {
    setMainImageLoaded(false);
    setInlineImageLoaded(false);
  }, [message]);

  // Hàm xử lý đọc tin nhắn
  const handleSpeakMessage = () => {
    if (!messageText || isImageOnly) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(messageText);

    // Thiết lập giọng đọc tiếng Việt nếu có
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find((voice) => voice.lang.includes("vi"));
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Hàm xử lý tải xuống hình ảnh
  const handleDownloadImage = () => {
    if (!imageFileUrl) return;

    // Tạo một thẻ a ẩn để tải xuống
    const link = document.createElement("a");
    link.href = imageFileUrl;
    link.download = `image_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hàm xử lý sao chép tin nhắn
  const handleCopyMessage = () => {
    // Nếu tin nhắn chỉ có hình ảnh, không sao chép
    if (isImageOnly) {
      return;
    }

    navigator.clipboard
      .writeText(messageText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Không thể sao chép tin nhắn:", err);
      });
  };

  // Hàm xử lý khi nhấp vào hình ảnh để xem toàn màn hình
  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex w-full gap-3 p-4",
          isUser ? "justify-end" : "justify-start",
          "relative"
        )}
      >
        {!isUser && (
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm flex-shrink-0">
            <AvatarImage src="/assistant-avatar.png" alt="Trợ lý" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-sky-400 text-white">
              <Bot size={18} />
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "flex flex-col max-w-[80%] md:max-w-[70%]",
            isUser ? "items-end" : "items-start"
          )}
        >
          {/* Hiển thị hình ảnh nếu chỉ có hình ảnh mà không có văn bản */}
          {isImageOnly ? (
            <div
              className="rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative min-h-[100px] cursor-pointer"
              onClick={handleImageClick}
            >
              {!mainImageLoaded && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
              )}
              {imageFileUrl && (
                <div className="relative w-full max-w-[400px]">
                  <Image
                    src={imageFileUrl}
                    alt="Hình ảnh được gửi"
                    width={400}
                    height={300}
                    className={cn(
                      "w-full h-auto object-contain bg-white dark:bg-gray-900 transition-opacity duration-300",
                      !mainImageLoaded && "opacity-0"
                    )}
                    style={{ maxHeight: "400px" }}
                    onLoad={() => setMainImageLoaded(true)}
                    priority
                    unoptimized={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "rounded-2xl px-5 py-3 shadow-sm overflow-hidden",
                isUser
                  ? "bg-gradient-to-r from-blue-600 to-sky-400 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200",
                "break-words"
              )}
            >
              {/* Hiển thị hình ảnh nếu có cả hình ảnh và văn bản */}
              {imageFileUrl && (
                <div
                  className="mb-3 rounded-lg overflow-hidden relative min-h-[100px] cursor-pointer"
                  onClick={handleImageClick}
                >
                  {!inlineImageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  <div className="relative w-full max-w-[400px]">
                    <Image
                      src={imageFileUrl}
                      alt="Hình ảnh được gửi"
                      width={400}
                      height={300}
                      className={cn(
                        "w-full h-auto object-contain transition-opacity duration-300",
                        !inlineImageLoaded && "opacity-0"
                      )}
                      style={{ maxHeight: "300px" }}
                      onLoad={() => setInlineImageLoaded(true)}
                      priority
                      unoptimized={true}
                    />
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <ImageIcon size={12} className="mr-1" />
                      <span>Hình ảnh đã gửi (nhấp để xem)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hiển thị văn bản */}
              {messageText && (
                <div className="prose dark:prose-invert prose-sm max-w-none break-words overflow-hidden">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // Tùy chỉnh các thẻ để đảm bảo hiển thị đúng
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0 overflow-hidden text-ellipsis">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            isUser
                              ? "text-white underline break-all"
                              : "text-blue-600 dark:text-blue-400 underline break-all"
                          }
                        >
                          {children}
                        </a>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md overflow-x-auto my-2 text-sm max-w-full">
                          {children}
                        </pre>
                      ),
                      code: ({ children }) => (
                        <code
                          className={`${
                            isUser
                              ? "bg-blue-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          } px-1 py-0.5 rounded text-sm overflow-x-auto max-w-full`}
                        >
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 my-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 my-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-lg font-bold my-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-bold my-2">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold my-1">
                          {children}
                        </h3>
                      ),
                      // Xử lý bảng nâng cao
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-blue-50 dark:bg-blue-900/30">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          {children}
                        </tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => {
                        // Kiểm tra nếu cell chứa cả tiếng Nga và phiên âm Latin
                        const content = children?.toString() || "";
                        const hasTransliteration =
                          content.includes("(") && content.includes(")");

                        if (hasTransliteration) {
                          // Tách phần tiếng Nga và phiên âm
                          const parts = content.split(/(\(.+?\))/);
                          return (
                            <td className="px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {parts[0].trim()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {parts[1]}
                              </div>
                            </td>
                          );
                        }

                        // Kiểm tra nếu cell chứa dấu * (ghi chú)
                        const hasNote = content.includes("*");

                        // Kiểm tra nếu cell là header của hàng (thường là cột đầu tiên và in đậm)
                        const isBold = content.includes("**");

                        return (
                          <td
                            className={`px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                              isBold
                                ? "font-semibold bg-gray-50 dark:bg-gray-700/30"
                                : ""
                            } ${hasNote ? "relative" : ""}`}
                          >
                            {children}
                            {hasNote && (
                              <span className="absolute top-1 right-1 text-xs text-blue-500">
                                *
                              </span>
                            )}
                          </td>
                        );
                      },
                    }}
                  >
                    {messageText}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}

          <div
            className={cn(
              "flex items-center mt-1",
              isUser
                ? "flex-row-reverse space-x-reverse space-x-2"
                : "flex-row space-x-2"
            )}
          >
            <span
              className="text-xs text-gray-400 whitespace-nowrap"
              suppressHydrationWarning
            >
              {formattedTime}
            </span>

            <div
              className={cn(
                "flex items-center gap-1",
                isUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Nút đọc tin nhắn - chỉ hiển thị nếu có văn bản */}
              {messageText && !isImageOnly && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-5 w-5 rounded-full opacity-70 hover:opacity-100 transition-opacity",
                          isUser
                            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
                            : "text-blue-500/70 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        )}
                        onClick={handleSpeakMessage}
                      >
                        {isSpeaking ? (
                          <VolumeX size={12} />
                        ) : (
                          <Volume2 size={12} />
                        )}
                        <span className="sr-only">
                          {isSpeaking ? "Dừng đọc" : "Đọc tin nhắn"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side={isUser ? "left" : "right"}
                      className="text-xs"
                    >
                      <p>{isSpeaking ? "Dừng đọc" : "Đọc tin nhắn"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Nút tải xuống hình ảnh - chỉ hiển thị nếu có hình ảnh */}
              {imageFileUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-5 w-5 rounded-full opacity-70 hover:opacity-100 transition-opacity",
                          isUser
                            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
                            : "text-blue-500/70 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        )}
                        onClick={handleDownloadImage}
                      >
                        <Download size={12} />
                        <span className="sr-only">Tải xuống hình ảnh</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side={isUser ? "left" : "right"}
                      className="text-xs"
                    >
                      <p>Tải xuống hình ảnh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Nút sao chép tin nhắn - không hiển thị nếu chỉ có hình ảnh */}
              {messageText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-5 w-5 rounded-full opacity-70 hover:opacity-100 transition-opacity",
                          isUser
                            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
                            : "text-blue-500/70 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        )}
                        onClick={handleCopyMessage}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span className="sr-only">Sao chép tin nhắn</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side={isUser ? "left" : "right"}
                      className="text-xs"
                    >
                      <p>{isCopied ? "Đã sao chép!" : "Sao chép tin nhắn"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {isUser && (
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm flex-shrink-0">
            <AvatarImage src="/default-avatar.png" alt="Người dùng" />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-400 text-white">
              <User size={18} />
            </AvatarFallback>
          </Avatar>
        )}
      </motion.div>

      {/* Modal xem hình ảnh toàn màn hình */}
      {imageFileUrl && (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogTitle className="hidden">
            Xem hình ảnh toàn màn hình
          </DialogTitle>
          <CustomDialogContent className="max-w-full max-h-full p-0 overflow-hidden rounded-none border-none bg-transparent shadow-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Nút đóng */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 z-50 text-white bg-black/50 hover:bg-black/70 hover:text-white"
                onClick={() => setIsImageModalOpen(false)}
              >
                <X size={20} />
                <span className="sr-only">Đóng</span>
              </Button>

              {/* Hình ảnh toàn màn hình */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image
                  src={imageFileUrl}
                  alt="Hình ảnh toàn màn hình"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
          </CustomDialogContent>
        </Dialog>
      )}
    </>
  );
};
