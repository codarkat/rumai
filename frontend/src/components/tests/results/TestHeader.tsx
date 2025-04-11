import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, RotateCcw } from "lucide-react";

type TestHeaderProps = {
  onBackToTests: () => void;
  onRetakeTest: () => void;
};

export function TestHeader({ onBackToTests, onRetakeTest }: TestHeaderProps) {
  return (
    <div className="relative z-10 mb-8 flex flex-col md:flex-row md:justify-between items-start gap-4">
      <div className="flex items-start gap-4 justify-start">
        <div onClick={onBackToTests} className="h-10 w-10 text-blue-500">
          <ChevronLeft className="h-9 w-9" />
        </div>

        {/* Title Section */}
        <div className="text-start">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Kết Quả Bài Kiểm Tra Trình Độ
            </h1>
          </div>
          <p className="text-blue-900/60 max-w-2xl mt-2">
            Cảm ơn bạn đã hoàn thành bài kiểm tra. Kết quả dưới đây xác định
            trình độ tiếng Nga của bạn từ A1 đến C2.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button
          onClick={onBackToTests}
          variant="outline"
          className="h-9 px-4 flex items-center gap-2 text-sm border-sky-200 text-blue-600 hover:bg-sky-50 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>

        <Button
          onClick={onRetakeTest}
          className="h-9 px-4 flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white border-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Làm lại</span>
        </Button>
      </div>
    </div>
  );
}
