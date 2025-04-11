"use client";

import { useState, useEffect, useMemo, RefObject, useCallback } from "react";
import { debounce } from "lodash";
import { DictionaryEntry, DictionaryInfo, SortOrder } from "../types";
import { DictionaryType } from "@/services/dictionary.service";

export function useDictionaryInfo(dictionaryType: DictionaryType = "vi-ru") {
  const [dictionaryInfo, setDictionaryInfo] = useState<DictionaryInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionaryInfo = async () => {
      try {
        const response = await fetch(
          `/api/dictionary/info?dict=${dictionaryType}`
        );
        if (response.ok) {
          const data = await response.json();
          setDictionaryInfo(data.results || data.data);
        }
      } catch (error) {
        console.error("Error fetching dictionary info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDictionaryInfo();
  }, [dictionaryType]);

  return dictionaryInfo;
}

export function useRecentSearches(dictionaryType: DictionaryType = "vi-ru") {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const maxRecentSearches = 10;
  const storageKey = `recentDictionarySearches_${dictionaryType}`;

  // Khởi tạo state từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSearches = localStorage.getItem(storageKey);
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (e) {
        console.error(
          `Lỗi khi tải lịch sử tìm kiếm từ điển ${dictionaryType}:`,
          e
        );
        // Nếu có lỗi, xóa dữ liệu cũ
        localStorage.removeItem(storageKey);
      }
    }
  }, [dictionaryType, storageKey]);

  const addRecentSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      setRecentSearches((prev) => {
        // Tạo mảng mới không bao gồm query hiện tại (nếu đã tồn tại)
        const filtered = prev.filter((item) => item !== query);

        // Thêm query mới vào đầu mảng và giới hạn số lượng
        const updated = [query, ...filtered].slice(0, maxRecentSearches);

        // Lưu vào localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        }

        return updated;
      });
    },
    [storageKey, maxRecentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}

export function useDictionarySearch(dictionaryType: DictionaryType = "vi-ru") {
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [totalResults, setTotalResults] = useState<number>(0);
  const { addRecentSearch } = useRecentSearches(dictionaryType);

  const searchDictionary = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const query = searchQuery.trim();
      addRecentSearch(query);

      const response = await fetch(
        `/api/dictionary?q=${encodeURIComponent(
          searchQuery
        )}&sort=${sortOrder}&dict=${dictionaryType}`
      );
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || data.data || []);
        setTotalResults(data.results?.length || data.data?.length || 0);
      } else {
        setResults([]);
        setTotalResults(0);
        setError("Không tìm thấy kết quả phù hợp");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm từ điển:", error);
      setResults([]);
      setTotalResults(0);
      setError("Đã xảy ra lỗi khi tìm kiếm, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const changeSortOrder = (order: SortOrder) => {
    setSortOrder(order);
  };

  return {
    results,
    loading,
    error,
    sortOrder,
    totalResults,
    searchDictionary,
    changeSortOrder,
  };
}

export function useDictionarySuggestions(
  dictionaryType: DictionaryType = "vi-ru"
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = useCallback(
    async (query: string, limit: number = 10) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/dictionary/suggest?q=${encodeURIComponent(
            query
          )}&limit=${limit}&dict=${dictionaryType}`
        );
        const data = await response.json();

        if (response.ok) {
          setSuggestions(data.results || data.data || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [dictionaryType]
  );

  return { suggestions, loading, getSuggestions };
}

export function useSuggestions(
  inputRef: RefObject<HTMLInputElement | null>,
  dictionaryType: DictionaryType
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim() || query.length < 2) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `/api/dictionary/suggest?q=${encodeURIComponent(
              query
            )}&dict=${dictionaryType}`
          );
          const data = await response.json();

          if (response.ok) {
            setSuggestions(data.results || data.data || []);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy gợi ý:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [dictionaryType]
  );

  const handleSuggestionSelect = (index: number) => {
    if (index >= 0 && index < suggestions.length) {
      setSelectedIndex(index);
      setShowSuggestions(false);
    }
  };

  return {
    suggestions,
    isLoading,
    selectedIndex,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions,
    handleSuggestionSelect,
  };
}

export function useAudio() {
  const playPronunciation = (
    text: string,
    lang: "ru-RU" | "vi-VN" = "ru-RU"
  ) => {
    if ("speechSynthesis" in window) {
      // Tạo utterance mới
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // Lấy danh sách các giọng nói có sẵn
      const voices = window.speechSynthesis.getVoices();

      // Tìm giọng phù hợp với ngôn ngữ được chỉ định
      const voice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));

      // Nếu tìm thấy giọng phù hợp, sử dụng nó
      if (voice) {
        utterance.voice = voice;
      }

      // Điều chỉnh tốc độ và cao độ để phù hợp hơn với ngôn ngữ
      utterance.rate = 0.9; // Hơi chậm hơn để rõ ràng hơn

      // Dừng bất kỳ phát âm nào đang chạy
      window.speechSynthesis.cancel();

      // Phát âm mới
      window.speechSynthesis.speak(utterance);
    }
  };

  // Đảm bảo danh sách giọng nói được tải
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Một số trình duyệt cần gọi getVoices() sau sự kiện voiceschanged
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return { playPronunciation };
}

export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T>[],
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem click có nằm ngoài tất cả các ref không
      const isOutside = refs.every(
        (ref) => !ref.current || !ref.current.contains(event.target as Node)
      );

      if (isOutside) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler]);
}
