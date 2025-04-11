"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DictionaryEntry as DictionaryEntryType } from "../types";
import { useAudio } from "../hooks/hooks";
import { Volume2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DictionaryType } from "@/services/dictionary.service";

interface DictionaryEntryProps {
  entry: DictionaryEntryType;
  isSelected: boolean;
  onClick: (entry: DictionaryEntryType, index: number) => void;
  index: number;
  dictionaryType: DictionaryType;
}

interface Example {
  word: string;
  russian: string;
  vietnamese: string;
}

const MAX_RECENT_SEARCHES = 5;

// Hàm để loại bỏ các ký tự số La Mã (I, II, III, IV, V, etc.) khỏi từ vựng
const removeRomanNumerals = (text: string): string => {
  // Regex để nhận diện số La Mã đứng một mình hoặc ở cuối từ
  return text
    .replace(
      /\s+(?:I{1,3}|IV|V|VI{1,3}|IX|X|XI{1,3}|XIV|XV|XVI{1,3}|XIX|XX)(?:\s+|$)/g,
      " "
    )
    .trim();
};

export default function DictionaryEntry({
  entry,
  isSelected,
  onClick,
  index,
  dictionaryType,
}: DictionaryEntryProps) {
  const { playPronunciation } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const [examplesError, setExamplesError] = useState<string | null>(null);

  // Đồng bộ trạng thái isSelected với trạng thái mở rộng
  useEffect(() => {
    // Nếu mục này được chọn, mở rộng nó
    if (isSelected) {
      setIsExpanded(true);
    } else {
      // Nếu mục này không được chọn, đóng nó
      setIsExpanded(false);
    }
  }, [isSelected]);

  // Hàm để trích xuất danh sách tiếng Nga từ chuỗi definition
  const extractRussianWords = (definition: string) => {
    const definitionTrim = definition.trim();
    // Kiểm tra xem chuỗi có bắt đầu bằng "@" không
    if (!definitionTrim.startsWith("@")) return definition;

    // Loại bỏ dòng dầu tiên
    const lines = definitionTrim.split("\n");
    const remainingLines = lines.slice(1).join("\n");

    // Trích xuất chỉ phần danh sách tiếng Nga (bắt đầu từ dấu "-" đầu tiên)
    return remainingLines.trim();
  };

  // Hàm để trích xuất phần chữ tiếng Việt từ chuỗi definition
  const extractVietnameseWord = (definition: string) => {
    const definitionTrim = definition.trim();
    // Kiểm tra xem chuỗi có bắt đầu bằng "@" không
    if (!definitionTrim.startsWith("@")) return definition;

    // Lấy giá trị ở dòng đầu tiên
    const firstLine = definitionTrim.split("\n")[0];

    // Trích xuất phần tiếng Việt loại bỏ dấu @
    let vietnameseWord = firstLine.substring(1).trim();

    // Loại bỏ các ký tự số La Mã
    vietnameseWord = removeRomanNumerals(vietnameseWord);

    return vietnameseWord;
  };

  // Hàm để phân tách danh sách các từ tiếng Nga thành mảng
  const parseRussianWords = (russianText: string) => {
    // Loại bỏ dấu "-" ở đầu nếu có
    let text = russianText.startsWith("-")
      ? russianText.substring(1)
      : russianText;

    // Phân tách theo mẫu "- word;" thành mảng các từ
    return text
      .split(";")
      .map((word) => word.trim())
      .filter((word) => word.length > 0) // Loại bỏ phần tử rỗng
      .map((word) => {
        // Loại bỏ dấu "-" ở đầu của mỗi từ và các ký tự số La Mã
        let cleanWord = word.startsWith("-") ? word.substring(1).trim() : word;
        cleanWord = removeRomanNumerals(cleanWord);
        return cleanWord;
      });
  };

  // Hàm để lấy các từ tiếng Nga từ definition
  const getRussianWords = (definition: string) => {
    const text = extractRussianWords(definition);
    return parseRussianWords(text);
  };

  // Hàm để lấy các câu ví dụ từ API
  const fetchExamples = async (words: string[]) => {
    if (words.length === 0) return;

    setIsLoadingExamples(true);
    setExamplesError(null);

    try {
      const wordsParam = words.join(",");
      const vietnameseMeaning = extractVietnameseWord(entry.definition);
      const response = await fetch(
        `/api/dictionary/examples?words=${encodeURIComponent(
          wordsParam
        )}&meaning=${encodeURIComponent(vietnameseMeaning)}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setExamples(data.data);
      } else {
        setExamplesError(data.error || "Không thể tạo câu ví dụ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy câu ví dụ:", error);
      setExamplesError("Đã xảy ra lỗi khi tạo câu ví dụ");
    } finally {
      setIsLoadingExamples(false);
    }
  };

  // Lấy câu ví dụ khi mở rộng
  useEffect(() => {
    if (
      isExpanded &&
      examples.length === 0 &&
      !isLoadingExamples &&
      !examplesError
    ) {
      const russianWords = getRussianWords(entry.definition);
      if (russianWords.length > 0) {
        fetchExamples(russianWords);
      }
    }
  }, [
    isExpanded,
    entry.definition,
    examples.length,
    isLoadingExamples,
    examplesError,
  ]);

  // Component để hiển thị danh sách các từ tiếng Nga hoặc Việt
  const WordsList = ({ text }: { text: string }) => {
    const words =
      dictionaryType === "vi-ru"
        ? parseRussianWords(text)
        : text
            .split(/[,;]/)
            .map((word) => word.trim())
            .filter(Boolean);

    return (
      <div className="flex flex-wrap gap-2">
        {words.map((word, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="bg-sky-100 text-sky-800 hover:bg-sky-200 cursor-pointer px-3 py-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa lên phần tử cha
              playPronunciation(
                word,
                dictionaryType === "vi-ru" ? "ru-RU" : "ru-RU"
              );
            }}
          >
            {word}
            <Volume2 className="ml-1 h-3 w-3 opacity-70" />
          </Badge>
        ))}
      </div>
    );
  };

  // Component để hiển thị danh sách các câu ví dụ
  const ExamplesList = () => {
    if (isLoadingExamples) {
      return (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-5 w-5 text-sky-500 animate-spin" />
          <span className="ml-2 text-slate-600">Đang tạo câu ví dụ...</span>
        </div>
      );
    }

    if (examplesError) {
      return <div className="text-red-500 text-sm py-2">{examplesError}</div>;
    }

    if (examples.length === 0) {
      return <p className="text-slate-600 italic">Không có câu ví dụ nào.</p>;
    }

    return (
      <div className="space-y-4">
        {examples.map((example, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Badge
                    variant="outline"
                    className="bg-sky-50 text-sky-700 mr-2"
                  >
                    {example.word}
                  </Badge>
                </div>
                <p className="text-slate-800 font-medium">{example.russian}</p>
                <p className="text-slate-600 italic mt-1">
                  {example.vietnamese}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(example.russian, "ru-RU");
                }}
              >
                <Volume2 className="h-4 w-4 text-sky-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Xử lý khi click vào card
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Gọi onClick để thông báo cho component cha
    onClick(entry, index);
  };

  // Xác định ngôn ngữ nguồn và đích dựa trên loại từ điển
  const sourceLanguage = dictionaryType === "vi-ru" ? "Việt" : "Nga";
  const targetLanguage = dictionaryType === "vi-ru" ? "Nga" : "Việt";

  // Xác định ngôn ngữ phát âm dựa trên loại từ điển
  const pronunciationLanguage = dictionaryType === "vi-ru" ? "ru-RU" : "ru-RU";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-lg transition-all duration-200 ${
        isSelected ? "bg-slate-50" : "hover:bg-slate-50/50"
      }`}
    >
      <Accordion
        type="single"
        collapsible
        className="border-none"
        value={isExpanded ? "item-1" : undefined}
      >
        <AccordionItem value="item-1" className="border-none">
          <div
            className="p-4 cursor-pointer transition-colors hover:bg-slate-50/80"
            onClick={handleCardClick}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-slate-800">
                  {removeRomanNumerals(entry.word)}
                </h3>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-6 w-6 text-sky-600 hover:bg-sky-100 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const vietnameseWord = extractVietnameseWord(
                        entry.definition
                      );
                      playPronunciation(vietnameseWord, pronunciationLanguage);
                    }}
                  >
                    <Volume2 className="h-3 w-3 text-slate-800" />
                  </Button>
                </motion.div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  // Chỉ gọi onClick để thông báo cho component cha
                  onClick(entry, index);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            </div>

            <WordsList text={extractRussianWords(entry.definition)} />
          </div>

          <AccordionTrigger className="hidden">
            <span className="text-sm text-slate-600">Xem thêm</span>
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-4">
            <div className="bg-sky-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                <ChevronDown className="mr-1 h-4 w-4 text-sky-500" />
                Ví dụ:
              </h4>
              <ExamplesList />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
