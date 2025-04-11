import fs from 'fs';
import path from 'path';

export interface DictionaryInfo {
  version: string;
  wordCount: number;
  idxFileSize: number;
  bookName: string;
  sameTypeSequence: string;
}

export interface DictionaryEntry {
  word: string;
  definition: string;
}

interface IdxEntry {
  word: string;
  offset: number;
  size: number;
}

export type DictionaryType = 'vi-ru' | 'ru-vi';

/**
 * Service xử lý từ điển
 */
export class DictionaryService {
  private dictPath: string;
  private info: DictionaryInfo | null = null;
  private idxEntries: IdxEntry[] = [];
  private isLoaded: boolean = false;
  private dictBuffer: Buffer | null = null;
  private dictionaryType: DictionaryType;

  constructor(dictPath: string, dictionaryType: DictionaryType) {
    this.dictPath = dictPath;
    this.dictionaryType = dictionaryType;
  }

  /**
   * Tải từ điển từ file
   */
  async loadDictionary(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Đọc file .ifo
      const ifoPath = path.join(this.dictPath, `${this.dictionaryType}.ifo`);
      const ifoContent = await fs.promises.readFile(ifoPath, 'utf-8');
      this.info = this.parseIfoFile(ifoContent);

      // Đọc file .idx (nhị phân)
      const idxPath = path.join(this.dictPath, `${this.dictionaryType}.idx`);
      const idxBuffer = await fs.promises.readFile(idxPath);
      this.parseIdxFile(idxBuffer);

      // Đọc file .dict (nhị phân)
      const dictPath = path.join(this.dictPath, `${this.dictionaryType}.dict`);
      this.dictBuffer = await fs.promises.readFile(dictPath);

      this.isLoaded = true;
      console.log(`Đã tải từ điển với ${this.idxEntries.length} từ`);
    } catch (error) {
      console.error(`Lỗi khi tải từ điển ${this.dictionaryType}:`, error);
      throw new Error(`Không thể tải từ điển ${this.dictionaryType}`);
    }
  }

  /**
   * Phân tích file .ifo của từ điển
   */
  private parseIfoFile(content: string): DictionaryInfo {
    const lines = content.split('\n');
    const info: Partial<DictionaryInfo> = {};

    for (const line of lines) {
      if (line.includes('=')) {
        const [key, value] = line.split('=');
        switch (key) {
          case 'version':
            info.version = value;
            break;
          case 'wordcount':
            info.wordCount = parseInt(value, 10);
            break;
          case 'idxfilesize':
            info.idxFileSize = parseInt(value, 10);
            break;
          case 'bookname':
            info.bookName = value;
            break;
          case 'sametypesequence':
            info.sameTypeSequence = value;
            break;
        }
      }
    }

    return info as DictionaryInfo;
  }

  /**
   * Phân tích file .idx của từ điển
   */
  private parseIdxFile(buffer: Buffer): void {
    let position = 0;
    this.idxEntries = [];

    while (position < buffer.length) {
      // Tìm vị trí kết thúc của từ (ký tự null)
      let wordEnd = position;
      while (wordEnd < buffer.length && buffer[wordEnd] !== 0) {
        wordEnd++;
      }

      if (wordEnd >= buffer.length) break;

      // Đọc từ
      const word = buffer.slice(position, wordEnd).toString('utf8');
      position = wordEnd + 1; // Bỏ qua ký tự null

      // Đọc offset (4 bytes)
      const offset = buffer.readUInt32BE(position);
      position += 4;

      // Đọc size (4 bytes)
      const size = buffer.readUInt32BE(position);
      position += 4;

      this.idxEntries.push({ word, offset, size });
    }
  }

  /**
   * Lấy định nghĩa từ từ file .dict
   */
  private getDefinition(offset: number, size: number): string {
    if (!this.dictBuffer) return '';

    // Đọc định nghĩa từ file .dict dựa trên offset và size
    const definitionBuffer = this.dictBuffer.slice(offset, offset + size);
    
    // Giả định rằng định nghĩa được lưu dưới dạng UTF-8
    return definitionBuffer.toString('utf8');
  }

  /**
   * Tính điểm liên quan của từ với query
   */
  private calculateRelevanceScore(word: string, query: string): number {
    const wordLower = word.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Từ khớp chính xác có điểm cao nhất
    if (wordLower === queryLower) {
      return 100;
    }
    
    // Từ bắt đầu bằng query có điểm cao
    if (wordLower.startsWith(queryLower)) {
      return 80;
    }
    
    // Từ chứa query có điểm thấp hơn
    if (wordLower.includes(queryLower)) {
      return 60;
    }
    
    // Các từ trong query xuất hiện trong word (không liên tiếp)
    const queryWords = queryLower.split(/\s+/);
    let matchCount = 0;
    
    for (const qWord of queryWords) {
      if (wordLower.includes(qWord)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      return 40 * (matchCount / queryWords.length);
    }
    
    return 0;
  }

  /**
   * Tìm kiếm từ trong từ điển
   */
  async search(query: string, sortOrder: 'relevance' | 'alphabetical' = 'relevance'): Promise<DictionaryEntry[]> {
    if (!this.isLoaded) {
      await this.loadDictionary();
    }

    query = query.toLowerCase().trim();
    
    if (!query) {
      return [];
    }
    
    // Tìm kiếm từ khớp hoặc bắt đầu bằng query
    const results: Array<DictionaryEntry & { score: number }> = [];
    const maxResults = 50; // Giới hạn số lượng kết quả
    
    for (const entry of this.idxEntries) {
      const score = this.calculateRelevanceScore(entry.word, query);
      
      if (score > 0) {
        const definition = this.getDefinition(entry.offset, entry.size);
        results.push({ 
          word: entry.word, 
          definition,
          score
        });
        
        if (results.length >= maxResults * 2) break; // Lấy nhiều hơn để sắp xếp
      }
    }
    
    // Sắp xếp kết quả
    if (sortOrder === 'alphabetical') {
      results.sort((a, b) => a.word.localeCompare(b.word));
    } else {
      // Mặc định: sắp xếp theo relevance
      results.sort((a, b) => b.score - a.score);
    }
    
    // Trả về kết quả với số lượng giới hạn
    return results.slice(0, maxResults).map(({ word, definition }) => ({
      word,
      definition
    }));
  }

  /**
   * Lấy gợi ý từ khóa trong từ điển
   */
  async getSuggestions(prefix: string, limit: number = 10): Promise<string[]> {
    if (!this.isLoaded) {
      await this.loadDictionary();
    }

    prefix = prefix.toLowerCase().trim();
    
    if (!prefix) {
      return [];
    }
    
    const suggestions: string[] = [];
    
    for (const entry of this.idxEntries) {
      if (entry.word.toLowerCase().startsWith(prefix)) {
        suggestions.push(entry.word);
        
        if (suggestions.length >= limit) break;
      }
    }
    
    return suggestions;
  }

  /**
   * Lấy thông tin từ điển
   */
  getInfo(): DictionaryInfo | null {
    return this.info;
  }

  /**
   * Lấy số lượng từ trong từ điển
   */
  getWordCount(): number {
    return this.idxEntries.length;
  }

  /**
   * Lấy loại từ điển
   */
  getDictionaryType(): DictionaryType {
    return this.dictionaryType;
  }
}

/**
 * Factory để tạo và quản lý các instance từ điển
 */
export class DictionaryServiceFactory {
  private static dictionaries = new Map<DictionaryType, DictionaryService>();
  private static dictBasePath = process.env.DICTIONARY_PATH || 
    path.join(process.cwd(), 'src/data/dictionaries');
  
  /**
   * Lấy instance từ điển theo loại
   */
  static getDictionary(type: DictionaryType): DictionaryService {
    if (!this.dictionaries.has(type)) {
      const dictionaryPath = path.join(this.dictBasePath, type);
      this.dictionaries.set(type, new DictionaryService(dictionaryPath, type));
    }
    return this.dictionaries.get(type)!;
  }
}
