import axios from "axios";

export interface DocumentInfo {
  id: string;
  title: string;
  filename: string;
  size: number;
  updatedAt: Date;
}

export interface DocumentContent {
  id: string;
  title: string;
  content: string;
}

/**
 * Service xử lý các tác vụ liên quan đến tài liệu
 */
class DocumentService {
  /**
   * Lấy danh sách tất cả tài liệu
   */
  async getDocuments(): Promise<DocumentInfo[]> {
    try {
      const response = await axios.get("/api/documents");
      const documents = response.data;

      // Chuyển đổi chuỗi ngày thành đối tượng Date
      return documents.map((doc: any) => ({
        ...doc,
        updatedAt: new Date(doc.updatedAt),
      }));
    } catch (error) {
      console.error("Error getting documents:", error);
      return [];
    }
  }

  /**
   * Lấy nội dung của một tài liệu theo ID
   */
  async getDocumentById(id: string): Promise<DocumentContent | null> {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting document by ID:", error);
      return null;
    }
  }
}

export const documentService = new DocumentService();
