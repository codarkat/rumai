import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { TestResultDetails } from "../TestResultDetails";
import { Question } from "@/types/tests";

type DetailsTabContentProps = {
  questions: Question[];
  answers: Record<number, string | string[]>;
  correctAnswers: number[];
};

export function DetailsTabContent({
  questions,
  answers,
  correctAnswers,
}: DetailsTabContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-sky-200 rounded-xl overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 py-4 px-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Các câu trả lời của bạn</span>
          </h2>
        </div>
        <CardContent className="p-6">
          <TestResultDetails
            questions={questions}
            answers={answers}
            correctAnswers={correctAnswers}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
