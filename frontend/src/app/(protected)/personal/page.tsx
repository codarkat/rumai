"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PersonalPage() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 bg-clip-text text-transparent">
            Bảng điều khiển
          </h1>
          <Link
            href="/personal/settings"
            className="px-4 py-2 bg-white/80 border border-sky-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Cài đặt tài khoản
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl border border-sky-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h2 className="text-xl font-semibold mb-4">Tiến độ học tập</h2>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 w-3/4 transition-all duration-500 ease-out hover:w-[76%]"></div>
            </div>
            <p className="mt-2 text-gray-600">75% hoàn thành</p>
          </div>

          <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl border border-sky-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h2 className="text-xl font-semibold mb-4">Từ vựng đã học</h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              248
            </p>
            <p className="mt-2 text-gray-600">từ vựng</p>
          </div>

          <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl border border-sky-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h2 className="text-xl font-semibold mb-4">Thời gian học</h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              12.5
            </p>
            <p className="mt-2 text-gray-600">giờ</p>
          </div>
        </div>

        <div className="mt-8 backdrop-blur-lg bg-white/60 p-6 rounded-2xl border border-sky-100/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h2 className="text-2xl font-semibold mb-6">Bài học gần đây</h2>
          <div className="space-y-4">
            {recentLessons.map((lesson, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-4 bg-white/70 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.date}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-sky-200">
                    {lesson.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const recentLessons = [
  {
    title: "Chào hỏi cơ bản trong tiếng Nga",
    date: "15/03/2023",
    status: "Hoàn thành",
  },
  {
    title: "Số đếm từ 1-20",
    date: "14/03/2023",
    status: "Hoàn thành",
  },
  {
    title: "Các từ vựng về gia đình",
    date: "12/03/2023",
    status: "Hoàn thành",
  },
];
