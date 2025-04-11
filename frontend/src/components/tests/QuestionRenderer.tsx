import React from "react";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/tests";
import { motion } from "framer-motion";

interface QuestionRendererProps {
  question: Question;
  answers: Record<number, string | string[]>;
  textInputs: Record<number, string>;
  onSelectAnswer: (answer: string) => void;
  onTextInputChange: (text: string) => void;
}

export function QuestionRenderer({
  question,
  answers,
  textInputs,
  onSelectAnswer,
  onTextInputChange,
}: QuestionRendererProps) {
  // Render dựa trên loại câu hỏi
  if (question.type === "text") {
    // Text input question
    return (
      <div className="mb-4">
        <input
          type="text"
          value={textInputs[question.id] || ""}
          onChange={(e) => onTextInputChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
          placeholder="Nhập câu trả lời của bạn..."
        />
      </div>
    );
  } else if (question.type === "multiple") {
    // Multiple choice question
    return (
      <div className="space-y-3">
        {question.options?.map((option) => {
          const selectedAnswers = (answers[question.id] as string[]) || [];
          const isSelected = selectedAnswers.includes(option);

          return (
            <motion.div
              key={option}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
              onClick={() => onSelectAnswer(option)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`w-5 h-5 mr-3 flex items-center justify-center rounded border ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-sky-400 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-3 h-3"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <Label className="flex-grow cursor-pointer text-base">
                {option}
              </Label>
            </motion.div>
          );
        })}
      </div>
    );
  } else {
    // Single choice question
    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <motion.div
            key={option}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm ${
              answers[question.id] === option
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => onSelectAnswer(option)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center ${
                answers[question.id] === option
                  ? "bg-gradient-to-r from-blue-600 to-sky-400 border-blue-500"
                  : "border-gray-600"
              }`}
            >
              {answers[question.id] === option && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <Label
              className={`flex-grow cursor-pointer text-base ${
                answers[question.id] === option
                  ? "bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent font-medium"
                  : "text-gray-600"
              }`}
            >
              {option}
            </Label>
          </motion.div>
        ))}
      </div>
    );
  }
}
