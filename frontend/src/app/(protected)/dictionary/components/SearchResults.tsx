"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DictionaryEntry as DictionaryEntryType } from "../types";
import DictionaryEntry from "./DictionaryEntry";
import { AlertCircle, BookOpen, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DictionaryType } from "@/services/dictionary.service";

interface SearchResultsProps {
  results: DictionaryEntryType[];
  query: string;
  isLoading: boolean;
  error: string | null;
  dictionaryType: DictionaryType;
}

export default function SearchResults({
  results,
  query,
  isLoading,
  error,
  dictionaryType,
}: SearchResultsProps) {
  const [selectedEntry, setSelectedEntry] =
    useState<DictionaryEntryType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Reset selected entry when results or query changes
  useEffect(() => {
    setSelectedEntry(null);
    setSelectedIndex(null);
  }, [results, query]);

  const handleEntryClick = (entry: DictionaryEntryType, index: number) => {
    if (selectedIndex === index) {
      setSelectedEntry(null);
      setSelectedIndex(null);
    } else {
      setSelectedEntry(entry);
      setSelectedIndex(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md border-slate-200/60">
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center text-slate-700">
            <Search className="h-4 w-4 mr-2 text-slate-400" />
            Kết quả tìm kiếm{" "}
            {dictionaryType === "vi-ru" ? "Việt-Nga" : "Nga-Việt"}
            {results.length > 0 && query && (
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 py-1 px-2 rounded-full">
                {results.length} kết quả
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {results.length > 0 && query ? (
            <div className="divide-y divide-slate-100">
              {results.map((entry, index) => (
                <DictionaryEntry
                  key={index}
                  entry={entry}
                  isSelected={selectedIndex === index}
                  onClick={(entry) => handleEntryClick(entry, index)}
                  index={index}
                  dictionaryType={dictionaryType}
                />
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="py-8 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                Không tìm thấy kết quả nào cho "{query}"
              </p>
            </div>
          ) : !query ? (
            <div className="py-8 text-center">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              {dictionaryType === "vi-ru" ? (
                <p className="text-slate-500">
                  Nhập từ tiếng Việt để bắt đầu tìm kiếm
                </p>
              ) : (
                <p className="text-slate-500">
                  Nhập từ tiếng Nga để bắt đầu tìm kiếm
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
