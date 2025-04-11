"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  CircleHelp,
  Book,
  Brain,
  Timer,
  BrainCircuit,
  ArrowRight,
  Sigma,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tests = [
  {
    id: "proficiency-test",
    title: "Kiểm tra trình độ",
    description:
      "Đánh giá mức độ thành thạo tiếng Nga của bạn với nhiều cấp độ khác nhau",
    icon: <FileCheck className="text-emerald-500" size={28} />,
    time: "20-30 phút",
    disabled: false,
  },
  {
    id: "vocabulary-test",
    title: "Kiểm tra từ vựng",
    description:
      "Kiểm tra lượng từ vựng tiếng Nga của bạn với các chủ đề khác nhau",
    icon: <Book className="text-indigo-500" size={28} />,
    time: "15-20 phút",
    disabled: false,
  },
  {
    id: "grammar-test",
    title: "Kiểm tra ngữ pháp",
    description:
      "Đánh giá kiến thức ngữ pháp tiếng Nga của bạn qua các bài tập thực hành",
    icon: <Sigma className="text-blue-500" size={28} />,
    time: "25-30 phút",
    disabled: true,
  },
  {
    id: "listening-test",
    title: "Kiểm tra nghe hiểu",
    description:
      "Kiểm tra khả năng nghe và hiểu tiếng Nga qua các đoạn hội thoại thực tế",
    icon: <Brain className="text-purple-500" size={28} />,
    time: "15-20 phút",
    disabled: true,
  },
  {
    id: "speaking-test",
    title: "Kiểm tra khả năng nói",
    description:
      "Đánh giá khả năng giao tiếp tiếng Nga của bạn qua các tình huống thực tế",
    icon: <BrainCircuit className="text-amber-500" size={28} />,
    time: "20-25 phút",
    disabled: true,
  },
  {
    id: "certification-test",
    title: "Thi thử TORFL",
    description:
      "Mô phỏng kỳ thi TORFL (Tiếng Nga như một Ngoại ngữ) chính thức",
    icon: <Award className="text-rose-500" size={28} />,
    time: "60 phút",
    disabled: true,
  },
];

export default function TestsPage() {
  const router = useRouter();

  const handleStartTest = (testId: string) => {
    if (testId === "proficiency-test") {
      router.push("/tests/proficiency-test");
    } else {
      router.push(`/tests/${testId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Kiểm tra trình độ tiếng Nga
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`rounded-xl border border-gray-200 p-6 h-full flex flex-col ${
                  test.disabled
                    ? "opacity-60"
                    : "bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                }`}
              >
                <div className="flex items-start mb-4">
                  <div className="p-2 rounded-lg bg-gray-50 mr-4">
                    {test.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                      {test.title}
                      {test.disabled && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          Sắp ra mắt
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Timer size={14} className="mr-1" />
                      <span>{test.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm flex-grow">
                  {test.description}
                </p>
                <Button
                  onClick={() => handleStartTest(test.id)}
                  disabled={test.disabled}
                  className={`w-full ${
                    test.disabled
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
                  }`}
                >
                  {test.disabled ? "Sắp ra mắt" : "Bắt đầu làm bài"}
                  {!test.disabled && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-start">
            <CircleHelp className="text-indigo-600 mr-4 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-medium text-indigo-700 mb-2">
                Về các bài kiểm tra
              </h3>
              <p className="text-indigo-600/70">
                Các bài kiểm tra được thiết kế để giúp bạn đánh giá trình độ
                tiếng Nga của mình một cách chính xác. Kết quả kiểm tra sẽ được
                lưu lại trong tài khoản của bạn và cung cấp các đề xuất học tập
                phù hợp.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
