import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { TestResultSummary } from "../TestResultSummary";
import { LevelDescription } from "./LevelDescription";
import { LevelGuide } from "./LevelGuide";
import { Question } from "@/types/tests";

type SummaryTabContentProps = {
  russianLevel: string;
  score: number;
  questions: Question[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  updating: boolean;
  onRetakeTest: () => void;
  onBackToTests: () => void;
};

export function SummaryTabContent({
  russianLevel,
  score,
  questions,
  correctAnswers,
  incorrectAnswers,
  updating,
  onRetakeTest,
  onBackToTests,
}: SummaryTabContentProps) {
  // Get text color for level
  const getLevelTextColor = (level: string) => {
    switch (level) {
      case "A1":
        return "text-sky-500";
      case "A2":
        return "text-sky-600";
      case "B1":
        return "text-blue-500";
      case "B2":
        return "text-blue-600";
      case "C1":
        return "text-blue-700";
      case "C2":
        return "text-blue-800";
      default:
        return "text-blue-500";
    }
  };

  // Get color for level
  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
        return "bg-sky-500";
      case "A2":
        return "bg-sky-600";
      case "B1":
        return "bg-blue-500";
      case "B2":
        return "bg-blue-600";
      case "C1":
        return "bg-blue-700";
      case "C2":
        return "bg-blue-800";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Main result summary card */}
      <Card className="border border-sky-200 rounded-xl overflow-hidden bg-white p-0">
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 py-4 px-6">
          <div className="flex items-center justify-center">
            <h2 className="text-lg font-semibold text-center text-white uppercase">
              Thông tin chi tiết kết quả
            </h2>
          </div>
        </div>
        <CardContent className="p-6">
          <TestResultSummary
            score={score}
            questions={questions}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
            updating={updating}
            onRetakeTest={onRetakeTest}
            onBackToTests={onBackToTests}
          />

          {/* Level Information */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-sky-200">
            <h3
              className={`text-lg font-semibold mb-3 flex items-center gap-2 ${getLevelTextColor(
                russianLevel
              )}`}
            >
              <div className={`p-1 rounded ${getLevelColor(russianLevel)}`}>
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              Trình độ {russianLevel} - Thông tin chi tiết
            </h3>
            <div className="space-y-4">
              <LevelDescription level={russianLevel} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Guide */}
      <LevelGuide currentLevel={russianLevel} />
    </motion.div>
  );
}
