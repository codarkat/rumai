"use client";

import { useDictionaryInfo } from "../hooks/hooks";
import { DictionaryType } from "@/services/dictionary.service";
import DictionarySwitch from "./DictionarySwitch";

interface DictionaryHeaderProps {
  dictionaryType: DictionaryType;
}

export default function DictionaryHeader({
  dictionaryType,
}: DictionaryHeaderProps) {
  const dictionaryInfo = useDictionaryInfo(dictionaryType);

  const getDictionaryTitle = () => {
    return dictionaryType === "vi-ru"
      ? "Từ điển Việt - Nga"
      : "Từ điển Nga - Việt";
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">
        {getDictionaryTitle()}
      </h1>
      <div className="h-1 w-24 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600 mb-4">
        {dictionaryInfo
          ? `${dictionaryInfo.wordCount.toLocaleString()} từ`
          : "Đang tải..."}
      </p>
      <div className="flex justify-center mb-4">
        <DictionarySwitch dictionaryType={dictionaryType} />
      </div>
    </div>
  );
}
