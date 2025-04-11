"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SearchSuggestionsProps {
  suggestions: string[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions = forwardRef<HTMLDivElement, SearchSuggestionsProps>(
  ({ suggestions, showSuggestions, onSuggestionClick }, ref) => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden"
      >
        <div className="p-2">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4" />
            <span>Gợi ý tìm kiếm</span>
          </div>
          <ul className="pt-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-800 dark:hover:scrollbar-thumb-blue-700">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: index * 0.05 },
                }}
                className="px-4 py-2 hover:bg-slate-50 hover:rounded-md cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }
);

SearchSuggestions.displayName = "SearchSuggestions";

export default SearchSuggestions;
