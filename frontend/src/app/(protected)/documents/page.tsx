"use client";

import { useEffect, useState } from "react";
import { documentService, DocumentInfo } from "@/services/document.service";
import { DocumentList } from "./components/DocumentList";
import { DocumentLoading } from "./components/DocumentLoading";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await documentService.getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  if (loading) {
    return <DocumentLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">
          Tài liệu học tiếng Nga
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá bộ sưu tập tài liệu học tiếng Nga đa dạng và phong phú, được
          thiết kế để hỗ trợ bạn trong hành trình học ngôn ngữ.
        </p>
      </div>
      <DocumentList documents={documents} />
    </div>
  );
}
