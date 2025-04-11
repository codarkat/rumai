"use client";

import { motion } from "framer-motion";
import { useRecentSearches } from "../hooks/hooks";
import { History, Clock, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DictionaryType } from "@/services/dictionary.service";

interface RecentSearchesProps {
  onRecentSearchClick: (term: string) => void;
  dictionaryType: DictionaryType;
}

export default function RecentSearches({
  onRecentSearchClick,
  dictionaryType,
}: RecentSearchesProps) {
  const { recentSearches, clearRecentSearches } =
    useRecentSearches(dictionaryType);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden"
    >
      <div className="p-2">
        <div className="flex justify-between items-center">
          {/* <CardTitle className="text-md font-medium flex items-center text-slate-700">
              <History className="h-4 w-4 mr-2 text-slate-400" />
              Tìm kiếm gần đây ({dictionaryType === 'vi-ru' ? 'Việt-Nga' : 'Nga-Việt'})
            </CardTitle> */}
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
            <History className="h-4 w-4 mr-2 text-slate-400" />
            Tìm kiếm gần đây (
            {dictionaryType === "vi-ru" ? "Việt-Nga" : "Nga-Việt"})
          </div>
          {recentSearches.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentSearches}
              className="px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Xóa tất cả
            </Button>
          )}
        </div>
        <ul className="pt-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-800 dark:hover:scrollbar-thumb-blue-700">
          {recentSearches.length > 0 ? (
            <div className="space-y-1.5">
              {recentSearches.map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => onRecentSearchClick(term)}
                  className="w-full justify-start font-normal text-sky-600 hover:text-sky-700 hover:bg-sky-50/50"
                >
                  <Clock className="h-3.5 w-3.5 mr-2 opacity-70" />
                  {term}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-2 px-3">
              Chưa có tìm kiếm nào gần đây
            </p>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
