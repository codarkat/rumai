'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Languages, Lightbulb } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho tính năng
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const AssistantSidebar: React.FC = () => {
  // Danh sách các tính năng của trợ lý
  const features: Feature[] = [
    { 
      icon: <Languages className="h-5 w-5 text-blue-500" />, 
      title: 'Dịch thuật', 
      description: 'Dịch giữa tiếng Việt và tiếng Nga với độ chính xác cao' 
    },
    { 
      icon: <GraduationCap className="h-5 w-5 text-green-500" />, 
      title: 'Ngữ pháp', 
      description: 'Giải thích và sửa lỗi ngữ pháp tiếng Nga' 
    },
    { 
      icon: <BookOpen className="h-5 w-5 text-amber-500" />, 
      title: 'Từ vựng', 
      description: 'Học từ vựng mới với ví dụ và cách phát âm' 
    },
    { 
      icon: <Lightbulb className="h-5 w-5 text-purple-500" />, 
      title: 'Văn hóa', 
      description: 'Tìm hiểu về văn hóa, lịch sử và phong tục Nga' 
    },
  ];

  return (
    <div className="hidden lg:block">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-sky-100/50 dark:border-sky-900/50 shadow-lg p-6 sticky top-0"
      >
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Tính năng trợ lý</h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/30 flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Mẹo sử dụng</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Hỏi về ngữ pháp, từ vựng hoặc phát âm</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Yêu cầu dịch câu hoặc đoạn văn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Tìm hiểu về văn hóa và phong tục Nga</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}; 