import Link from "next/link";
import { DocumentInfo } from "@/services/document.service";
import { formatDistanceToNow } from "date-fns";
import { FileText, Calendar, FileIcon } from "lucide-react";

interface DocumentListProps {
  documents: DocumentInfo[];
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Không tìm thấy tài liệu nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Link
          href={`/documents/${doc.id}`}
          key={doc.id}
          title={`Xem tài liệu: ${doc.title}`}
          aria-label={`Mở tài liệu ${doc.title}`}
          className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg mr-4 flex-shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/40 transition-colors duration-300">
                <FileIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors duration-300 uppercase">
                {doc.title}
              </h2>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">
                  {formatDistanceToNow(new Date(doc.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="text-sm font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                {(doc.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
