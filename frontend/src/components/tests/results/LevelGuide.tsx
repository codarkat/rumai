import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  PenLine,
  MessageCircle,
  BookOpen,
  BarChart3,
  CheckCheck,
} from "lucide-react";

type LevelGuideProps = {
  currentLevel: string;
};

export function LevelGuide({ currentLevel }: LevelGuideProps) {
  // Get primary color based on level for backgrounds
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

  // Get border color for level
  const getLevelBorderColor = (level: string) => {
    switch (level) {
      case "A1":
        return "border-sky-200";
      case "A2":
        return "border-sky-300";
      case "B1":
        return "border-blue-200";
      case "B2":
        return "border-blue-300";
      case "C1":
        return "border-blue-400";
      case "C2":
        return "border-blue-500";
      default:
        return "border-blue-200";
    }
  };

  // Get light bg color for level
  const getLevelBgColor = (level: string) => {
    switch (level) {
      case "A1":
        return "bg-sky-50";
      case "A2":
        return "bg-sky-100";
      case "B1":
        return "bg-blue-50";
      case "B2":
        return "bg-blue-100";
      case "C1":
        return "bg-blue-50";
      case "C2":
        return "bg-blue-100";
      default:
        return "bg-blue-50";
    }
  };

  // Get icon for level
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "A1":
        return <Lightbulb className="h-3.5 w-3.5" />;
      case "A2":
        return <PenLine className="h-3.5 w-3.5" />;
      case "B1":
        return <MessageCircle className="h-3.5 w-3.5" />;
      case "B2":
        return <BookOpen className="h-3.5 w-3.5" />;
      case "C1":
        return <BarChart3 className="h-3.5 w-3.5" />;
      case "C2":
        return <CheckCheck className="h-3.5 w-3.5" />;
      default:
        return <Lightbulb className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
        <Card
          key={level}
          className={`border ${
            currentLevel === level
              ? `${getLevelBorderColor(level)} ${getLevelBgColor(level)}`
              : "border-gray-200 bg-white hover:bg-gray-50"
          } rounded-xl overflow-hidden transition-colors group`}
        >
          <div className={`h-1 ${getLevelColor(level)}`}></div>
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span
                className={`inline-flex items-center justify-center h-5 w-5 rounded-md ${getLevelColor(
                  level
                )} text-xs text-white`}
              >
                {level}
              </span>
              <span
                className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${
                  currentLevel === level
                    ? "border-2 border-blue-300 bg-blue-100 text-blue-500"
                    : "border border-gray-200"
                }`}
              >
                {getLevelIcon(level)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {level === "A1"
                  ? "Beginner"
                  : level === "A2"
                  ? "Elementary"
                  : level === "B1"
                  ? "Intermediate"
                  : level === "B2"
                  ? "Upper Interm."
                  : level === "C1"
                  ? "Advanced"
                  : "Proficiency"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {level === "A1"
                  ? "500-800 từ"
                  : level === "A2"
                  ? "1.500 từ"
                  : level === "B1"
                  ? "2.500 từ"
                  : level === "B2"
                  ? "4.000 từ"
                  : level === "C1"
                  ? "8.000 từ"
                  : "10.000+ từ"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
