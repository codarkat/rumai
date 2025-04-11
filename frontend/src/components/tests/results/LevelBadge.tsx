import React from "react";
import { motion } from "framer-motion";

type LevelBadgeProps = {
  level: string;
};

export function LevelBadge({ level }: LevelBadgeProps) {
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

  return (
    <motion.div
      className="relative z-10 w-full mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-bold text-blue-900 mb-3">
          Trình độ của bạn: {level}
        </h2>

        <div className="relative">
          <div
            className={`flex items-center justify-center h-20 w-20 rounded-2xl rotate-45 ${getLevelColor(
              level
            )} border ${getLevelBorderColor(level)}`}
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
            <div className="-rotate-45">
              <span className="text-2xl font-bold text-white">{level}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
