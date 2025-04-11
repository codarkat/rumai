import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Question } from "@/types/tests";

interface TestResultSummaryProps {
  score: number;
  questions: Question[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  updating: boolean;
  onRetakeTest: () => void;
  onBackToTests: () => void;
}

export function TestResultSummary({
  score,
  questions,
  correctAnswers,
  incorrectAnswers,
  updating,
  onRetakeTest,
  onBackToTests,
}: TestResultSummaryProps) {
  const answeredQuestions = correctAnswers.length + incorrectAnswers.length;
  const unansweredQuestions = questions.length - answeredQuestions;

  // Calculate proficiency level based on score
  let proficiencyLevel = "";
  let proficiencyDescription = "";
  let levelColor = "";
  let bgColor = "";
  let levelIcon = null;

  if (score >= 90) {
    proficiencyLevel = "C2 - Thành thạo";
    proficiencyDescription =
      "Bạn có khả năng sử dụng tiếng Nga ở trình độ gần với người bản ngữ.";
    levelColor = "text-emerald-600";
    bgColor =
      "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200";
    levelIcon = <CheckCircle className="h-6 w-6 text-emerald-500" />;
  } else if (score >= 75) {
    proficiencyLevel = "C1 - Nâng cao";
    proficiencyDescription =
      "Bạn có thể sử dụng tiếng Nga một cách linh hoạt và hiệu quả trong hầu hết các tình huống.";
    levelColor = "text-green-600";
    bgColor = "bg-gradient-to-r from-green-50 to-green-100 border-green-200";
    levelIcon = <CheckCircle className="h-6 w-6 text-green-500" />;
  } else if (score >= 60) {
    proficiencyLevel = "B2 - Trên trung cấp";
    proficiencyDescription =
      "Bạn có thể giao tiếp tương đối trôi chảy và tự nhiên với người bản ngữ.";
    levelColor = "text-blue-600";
    bgColor = "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200";
    levelIcon = <CheckCircle className="h-6 w-6 text-blue-500" />;
  } else if (score >= 45) {
    proficiencyLevel = "B1 - Trung cấp";
    proficiencyDescription =
      "Bạn có thể giao tiếp trong các tình huống quen thuộc và có thể xử lý các tình huống thông thường.";
    levelColor = "text-blue-600";
    bgColor = "bg-gradient-to-r from-blue-50 to-sky-100 border-blue-200";
    levelIcon = <CheckCircle className="h-6 w-6 text-blue-500" />;
  } else if (score >= 30) {
    proficiencyLevel = "A2 - Sơ cấp";
    proficiencyDescription =
      "Bạn có thể giao tiếp cơ bản, trao đổi thông tin về những chủ đề đơn giản.";
    levelColor = "text-orange-600";
    bgColor = "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200";
    levelIcon = <AlertCircle className="h-6 w-6 text-orange-500" />;
  } else {
    proficiencyLevel = "A1 - Nhập môn";
    proficiencyDescription =
      "Bạn đang ở giai đoạn bắt đầu học tiếng Nga, có thể hiểu và sử dụng các biểu thức quen thuộc hàng ngày.";
    levelColor = "text-orange-600";
    bgColor = "bg-gradient-to-r from-orange-50 to-amber-100 border-orange-200";
    levelIcon = <AlertCircle className="h-6 w-6 text-orange-500" />;
  }

  return (
    <>
      {updating && (
        <p className="text-center text-blue-500 mb-4">
          Đang cập nhật thông tin...
        </p>
      )}

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-52 h-52 mb-4">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              {score}%
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#blueGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.83} ${283 - score * 2.83}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className={`flex items-center gap-2 ${levelColor} font-bold text-2xl mb-2 rounded-full px-5 py-2 ${bgColor} border shadow-sm`}
        >
          {levelIcon}
          {proficiencyLevel}
        </div>
        <p className="text-center text-gray-600 max-w-lg">
          {proficiencyDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Câu trả lời đúng</h3>
          </div>
          <p className="text-3xl font-bold text-center mt-2 text-emerald-600">
            {correctAnswers.length}{" "}
            <span className="text-base font-normal text-gray-500">
              / {questions.length}
            </span>
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Câu trả lời sai</h3>
          </div>
          <p className="text-3xl font-bold text-center mt-2 text-red-600">
            {incorrectAnswers.length}{" "}
            <span className="text-base font-normal text-gray-500">
              / {questions.length}
            </span>
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold">Câu hỏi chưa trả lời</h3>
          </div>
          <p className="text-3xl font-bold text-center mt-2 text-gray-600">
            {unansweredQuestions}{" "}
            <span className="text-base font-normal text-gray-500">
              / {questions.length}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-gray-100">
        <Button
          onClick={onRetakeTest}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500 shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
          Làm lại bài kiểm tra
        </Button>
        <Button
          onClick={onBackToTests}
          variant="outline"
          className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>
    </>
  );
}
