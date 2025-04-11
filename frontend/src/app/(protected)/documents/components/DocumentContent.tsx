import { DocumentContent as DocumentContentType } from "@/services/document.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DocumentContentProps {
  document: DocumentContentType;
}

export function DocumentContent({ document }: DocumentContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/documents"
          className="inline-flex items-center text-sky-600 hover:text-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách tài liệu
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {document.title}
        </h1>

        <div
          className="prose dark:prose-invert max-w-none 
            prose-headings:text-sky-700 dark:prose-headings:text-sky-400 
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            prose-li:my-1
            prose-table:border-collapse prose-table:w-full
            prose-table:my-6 prose-table:overflow-hidden
            prose-th:bg-gray-100 dark:prose-th:bg-gray-700 
            prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600
            prose-td:p-3 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600"
          dangerouslySetInnerHTML={{ __html: document.content }}
        />
      </div>
    </div>
  );
}
