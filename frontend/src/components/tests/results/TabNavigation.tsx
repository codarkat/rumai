import React from "react";
import { BookOpen, ListChecks } from "lucide-react";

type TabNavigationProps = {
  activeTab: string;
  onTabChange: (tab: "summary" | "details") => void;
};

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="relative z-10 flex justify-center mb-6">
      <div className="inline-flex bg-white rounded-full border border-sky-200 p-1">
        <button
          className={`px-5 py-2 rounded-full ${
            activeTab === "summary"
              ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white"
              : "text-blue-700 hover:bg-sky-50"
          } font-medium text-sm flex items-center gap-2 transition-colors`}
          onClick={() => onTabChange("summary")}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chi tiết trình độ</span>
        </button>
        <button
          className={`px-5 py-2 rounded-full ${
            activeTab === "details"
              ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white"
              : "text-blue-700 hover:bg-sky-50"
          } font-medium text-sm flex items-center gap-2 transition-colors`}
          onClick={() => onTabChange("details")}
        >
          <ListChecks className="w-4 h-4" />
          <span>Câu trả lời</span>
        </button>
      </div>
    </div>
  );
}
