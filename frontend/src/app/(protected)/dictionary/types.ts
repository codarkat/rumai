import { DictionaryType } from "@/services/dictionary.service";

export interface DictionaryEntry {
  word: string;
  definition: string;
}

export interface DictionaryInfo {
  wordCount: number;
  dictionaryType?: DictionaryType;
}

export type SortOrder = "relevance" | "alphabetical";

export interface Example {
  russian: string;
  vietnamese: string;
}
