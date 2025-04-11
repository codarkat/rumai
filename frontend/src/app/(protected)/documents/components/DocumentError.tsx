import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

interface DocumentErrorProps {
  error: string | null;
}

export function DocumentError({ error }: DocumentErrorProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="text-center py-8">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Không tìm thấy tài liệu</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Tài liệu không tồn tại hoặc đã bị xóa'}</p>
        <Link 
          href="/documents" 
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách tài liệu
        </Link>
      </div>
    </div>
  );
} 