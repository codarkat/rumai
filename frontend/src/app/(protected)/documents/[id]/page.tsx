"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  documentService,
  DocumentContent as DocumentContentType,
} from "@/services/document.service";
import { DocumentContent } from "../components/DocumentContent";
import { DocumentError } from "../components/DocumentError";
import { DocumentLoading } from "../components/DocumentLoading";

export default function DocumentDetailPage() {
  const params = useParams();
  const [document, setDocument] = useState<DocumentContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocument() {
      try {
        if (typeof params.id !== "string") {
          throw new Error("Invalid document ID");
        }

        const doc = await documentService.getDocumentById(params.id);

        if (!doc) {
          throw new Error("Document not found");
        }

        setDocument(doc);
      } catch (error) {
        console.error("Error loading document:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải tài liệu"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [params.id]);

  if (loading) {
    return <DocumentLoading />;
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DocumentError error={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DocumentContent document={document} />
    </div>
  );
}
