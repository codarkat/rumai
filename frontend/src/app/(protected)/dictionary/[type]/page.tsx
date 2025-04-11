"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDictionarySearch } from "./../hooks/hooks";
import DictionaryHeader from "./../components/DictionaryHeader";
import SearchForm from "./../components/SearchForm";
import SearchResults from "./../components/SearchResults";
import { motion } from "framer-motion";
import { DictionaryType } from "@/services/dictionary.service";

export default function DictionaryPage() {
  const router = useRouter();
  const params = useParams();
  const dictionaryType = params.type as DictionaryType;
  const [query, setQuery] = useState("");

  // Kiểm tra loại từ điển hợp lệ
  useEffect(() => {
    if (dictionaryType !== "vi-ru" && dictionaryType !== "ru-vi") {
      router.push("/dictionary/vi-ru");
    }
  }, [dictionaryType, router]);

  const {
    results,
    loading,
    error,
    sortOrder,
    searchDictionary,
    changeSortOrder,
  } = useDictionarySearch(dictionaryType);

  const handleSearch = (searchQuery: string) => {
    searchDictionary(searchQuery);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-2xl shadow-sm space-y-6"
        >
          <DictionaryHeader dictionaryType={dictionaryType} />
          <SearchForm
            query={query}
            setQuery={setQuery}
            isLoading={loading}
            sortOrder={sortOrder}
            onSearch={handleSearch}
            onSortChange={changeSortOrder}
            dictionaryType={dictionaryType}
          />
        </motion.div>

        <SearchResults
          results={results}
          isLoading={loading}
          error={error}
          dictionaryType={dictionaryType}
          query={query}
        />
      </div>
    </div>
  );
}
