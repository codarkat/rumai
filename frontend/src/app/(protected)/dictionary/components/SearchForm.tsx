"use client";

import { FormEvent, useRef, useEffect, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { SortOrder } from "../types";
import SearchSuggestions from "./SearchSuggestions";
import { useSuggestions, useRecentSearches } from "../hooks/hooks";
import {
  Search,
  SortAsc,
  Loader2,
  BookOpen,
  History,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DictionaryType } from "@/services/dictionary.service";
import RecentSearches from "./RecentSearches";

const MAX_RECENT_SEARCHES = 5;

interface SearchFormProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  sortOrder: SortOrder;
  onSearch: (query: string) => void;
  onSortChange: (order: SortOrder) => void;
  dictionaryType: DictionaryType;
}

export default function SearchForm({
  query,
  setQuery,
  isLoading,
  sortOrder,
  onSearch,
  onSortChange,
  dictionaryType,
}: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Sử dụng hook useRecentSearches với loại từ điển
  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useRecentSearches(dictionaryType);

  const {
    suggestions,
    isLoading: isSuggestionsLoading,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions,
  } = useSuggestions(inputRef, dictionaryType);

  // Cập nhật hàm lưu lịch sử tìm kiếm
  const saveToRecentSearches = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm);
    }
  };

  // Đóng suggestions khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    if (value.length >= 2) {
      fetchSuggestions(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      saveToRecentSearches(query.trim());
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    saveToRecentSearches(suggestion);
    onSearch(suggestion);
  };

  // Hiển thị suggestions hoặc recent searches khi focus
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // Xử lý phím tắt
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Alt + S: Chuyển đổi kiểu sắp xếp
    if (e.altKey && e.key === "s") {
      e.preventDefault();
      onSortChange(sortOrder === "relevance" ? "alphabetical" : "relevance");
    }
    // Alt + K: Hiển thị/ẩn phím tắt
    else if (e.altKey && e.key === "k") {
      e.preventDefault();
      setShowShortcuts(!showShortcuts);
    }
    // Esc: Đóng suggestions và phím tắt
    else if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowShortcuts(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={
              dictionaryType === "vi-ru"
                ? "Nhập từ tiếng Việt cần tra cứu... (Alt + K để xem phím tắt)"
                : "Nhập từ tiếng Nga cần tra cứu... (Alt + K để xem phím tắt)"
            }
            className="pl-5 pr-6 py-6 rounded-xl"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  onSortChange(
                    sortOrder === "relevance" ? "alphabetical" : "relevance"
                  )
                }
                className="h-8 w-8 px-2"
                title={`Sắp xếp theo ${
                  sortOrder === "relevance" ? "A-Z" : "độ liên quan"
                } (Alt + S)`}
              >
                {sortOrder === "relevance" ? (
                  <BookOpen className="h-4 w-4" />
                ) : (
                  <SortAsc className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                disabled={isLoading}
                className="h-8 w-8 px-2"
                title="Tìm kiếm (Enter)"
              >
                {isSuggestionsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </>
          </div>
        </div>

        {showSuggestions && (
          <div ref={suggestionsRef}>
            {query.length >= 2 ? (
              <SearchSuggestions
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <RecentSearches
                onRecentSearchClick={handleSuggestionClick}
                dictionaryType={dictionaryType}
              />
            )}
          </div>
        )}

        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phím tắt</span>
                <Command className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tìm kiếm</span>
                  <Badge variant="secondary">Enter</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Đổi kiểu sắp xếp</span>
                  <Badge variant="secondary">Alt + S</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Hiện/ẩn phím tắt</span>
                  <Badge variant="secondary">Alt + K</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Đóng popup</span>
                  <Badge variant="secondary">Esc</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
