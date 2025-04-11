import React from "react";
import { Question } from "@/types/tests";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface TestResultDetailsProps {
  questions: Question[];
  answers: Record<number, string | string[]>;
  correctAnswers: number[];
}

export function TestResultDetails({
  questions,
  answers,
  correctAnswers,
}: TestResultDetailsProps) {
  return (
    <div className="space-y-2">
      <Accordion type="multiple" className="w-full">
        {questions.map((question, idx) => {
          const userAnswer = answers[question.id];
          const isCorrect = correctAnswers.includes(question.id);
          const isAnswered = userAnswer !== undefined;

          // Define classes based on answer status
          const bgGradient = !isAnswered
            ? "from-gray-100 to-gray-50"
            : isCorrect
            ? "from-emerald-100 to-green-50"
            : "from-red-100 to-rose-50";

          const borderColor = !isAnswered
            ? "border-gray-200"
            : isCorrect
            ? "border-emerald-200"
            : "border-red-200";

          const iconColor = !isAnswered
            ? "text-gray-400"
            : isCorrect
            ? "text-emerald-500"
            : "text-red-500";

          return (
            <AccordionItem
              key={question.id}
              value={`question-${question.id}`}
              className={`mb-3 rounded-lg border-2 ${borderColor} bg-gradient-to-br ${bgGradient} overflow-hidden`}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                    ${
                      !isAnswered
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : isCorrect
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    } text-white font-semibold text-sm`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isAnswered ? (
                      <HelpCircle className={`h-5 w-5 ${iconColor}`} />
                    ) : isCorrect ? (
                      <CheckCircle className={`h-5 w-5 ${iconColor}`} />
                    ) : (
                      <XCircle className={`h-5 w-5 ${iconColor}`} />
                    )}
                    <span className="text-sm font-medium">
                      {question.question}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                {isAnswered ? (
                  <div className="ml-11 mt-1 space-y-3">
                    {question.type === "multiple" ? (
                      // For multiple choice questions
                      <>
                        <div>
                          <span className="block text-gray-600 mb-1 text-xs font-medium">
                            Câu trả lời của bạn:
                          </span>
                          <ul className="list-disc list-inside space-y-1">
                            {(userAnswer as string[]).map((ans) => (
                              <li key={ans} className="text-gray-700">
                                {ans}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="block text-gray-600 mb-1 text-xs font-medium">
                            Đáp án đúng:
                          </span>
                          <ul className="list-disc list-inside space-y-1">
                            {(question.correct_answer as string[]).map(
                              (ans) => (
                                <li
                                  key={ans}
                                  className="text-emerald-600 font-medium"
                                >
                                  {ans}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    ) : (
                      // For single choice or text questions
                      <>
                        <div>
                          <span className="block text-gray-600 mb-1 text-xs font-medium">
                            Câu trả lời của bạn:
                          </span>
                          <span
                            className={`block ${
                              isCorrect
                                ? "text-emerald-600 font-medium"
                                : "text-red-600 font-medium"
                            }`}
                          >
                            {userAnswer as string}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div>
                            <span className="block text-gray-600 mb-1 text-xs font-medium">
                              Đáp án đúng:
                            </span>
                            <span className="block text-emerald-600 font-medium">
                              {question.correct_answer as string}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="ml-11 text-gray-500 italic text-sm">
                    Chưa có câu trả lời
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
