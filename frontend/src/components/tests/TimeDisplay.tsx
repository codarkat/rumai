import React from "react";
import { Clock } from "lucide-react";

interface TimeDisplayProps {
  timeLeft: number;
}

export function TimeDisplay({ timeLeft }: TimeDisplayProps) {
  // Format time từ giây sang MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Hiệu ứng nhấp nháy cho đồng hồ khi sắp hết giờ
  const getTimeLeftClass = () => {
    if (timeLeft <= 60) return "animate-pulse bg-red-100 text-red-600"; // Dưới 1 phút - nhấp nháy đỏ
    if (timeLeft <= 300) return "bg-red-50 text-red-600"; // Dưới 5 phút - đỏ
    if (timeLeft <= 600) return "bg-orange-50 text-orange-600"; // Dưới 10 phút - cam
    return "bg-blue-50 text-blue-600"; // Thời gian bình thường - xanh
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${getTimeLeftClass()}`}
    >
      <Clock className="h-5 w-5" />
      <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
}
