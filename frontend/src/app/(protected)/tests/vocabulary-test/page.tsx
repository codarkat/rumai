"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  SkipForward,
  Brain,
  Book,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { vocabularyService } from "@/services/ai/test";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TestResultSummary } from "@/components/tests/TestResultSummary";
import { TestResultDetails } from "@/components/tests/TestResultDetails";

interface VocabularyItem {
  id: number;
  russian: string;
  vietnamese: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export default function VocabularyTestPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // Increased from 20 to 40 minutes for 20 questions
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [testMode, setTestMode] = useState<
    "russian_to_vietnamese" | "vietnamese_to_russian"
  >("russian_to_vietnamese");
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const generateVocabularyTest = async () => {
      setIsGeneratingTest(true);
      setErrorMessage(null);

      try {
        // Get user's Russian level from session if available
        const userLevel = session?.user?.metadata?.russian_level || "A1";

        // Call Gemini AI service to generate vocabulary test
        const items = await vocabularyService.generateVocabularyTest({
          level: userLevel as any,
          count: 20,
          topic: "general",
        });

        setVocabularyItems(items);
        setIsLoading(false);
        setIsGeneratingTest(false);

        toast.success("Bài kiểm tra từ vựng đã được tạo thành công!", {
          description:
            "Sử dụng Gemini AI để tạo các câu hỏi phù hợp với trình độ của bạn.",
          duration: 5000,
        });
      } catch (error) {
        console.error("Error generating vocabulary test:", error);
        setErrorMessage("Không thể tạo bài kiểm tra. Vui lòng thử lại sau.");
        setIsLoading(false);
        setIsGeneratingTest(false);

        toast.error("Lỗi khi tạo bài kiểm tra", {
          description: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
        });

        // Fallback to mock data if Gemini AI fails
        const mockItems: VocabularyItem[] = [
          {
            id: 1,
            russian: "Здравствуйте",
            vietnamese: "Xin chào",
            options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
            correct_answer: "Xin chào",
          },
          {
            id: 2,
            russian: "Спасибо",
            vietnamese: "Cảm ơn",
            options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
            correct_answer: "Cảm ơn",
          },
          {
            id: 3,
            russian: "До свидания",
            vietnamese: "Tạm biệt",
            options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
            correct_answer: "Tạm biệt",
          },
          {
            id: 4,
            russian: "Извините",
            vietnamese: "Xin lỗi",
            options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
            correct_answer: "Xin lỗi",
          },
          {
            id: 5,
            russian: "Да",
            vietnamese: "Có",
            options: ["Có", "Không", "Được", "Tốt"],
            correct_answer: "Có",
          },
          {
            id: 6,
            russian: "Нет",
            vietnamese: "Không",
            options: ["Có", "Không", "Được", "Tốt"],
            correct_answer: "Không",
          },
          {
            id: 7,
            russian: "Хорошо",
            vietnamese: "Tốt",
            options: ["Có", "Không", "Được", "Tốt"],
            correct_answer: "Tốt",
          },
          {
            id: 8,
            russian: "Пожалуйста",
            vietnamese: "Làm ơn",
            options: ["Làm ơn", "Cảm ơn", "Xin lỗi", "Tạm biệt"],
            correct_answer: "Làm ơn",
          },
          {
            id: 9,
            russian: "Как дела?",
            vietnamese: "Bạn khỏe không?",
            options: [
              "Bạn khỏe không?",
              "Tôi khỏe",
              "Bạn tên gì?",
              "Gặp lại sau",
            ],
            correct_answer: "Bạn khỏe không?",
          },
          {
            id: 10,
            russian: "Я не понимаю",
            vietnamese: "Tôi không hiểu",
            options: [
              "Tôi không hiểu",
              "Tôi hiểu",
              "Tôi không biết",
              "Tôi biết",
            ],
            correct_answer: "Tôi không hiểu",
          },
          {
            id: 11,
            russian: "Меня зовут",
            vietnamese: "Tôi tên là",
            options: [
              "Tôi tên là",
              "Bạn tên là",
              "Anh ấy tên là",
              "Cô ấy tên là",
            ],
            correct_answer: "Tôi tên là",
          },
          {
            id: 12,
            russian: "Доброе утро",
            vietnamese: "Chào buổi sáng",
            options: [
              "Chào buổi sáng",
              "Chào buổi chiều",
              "Chào buổi tối",
              "Chúc ngủ ngon",
            ],
            correct_answer: "Chào buổi sáng",
          },
          {
            id: 13,
            russian: "Добрый вечер",
            vietnamese: "Chào buổi tối",
            options: [
              "Chào buổi sáng",
              "Chào buổi chiều",
              "Chào buổi tối",
              "Chúc ngủ ngon",
            ],
            correct_answer: "Chào buổi tối",
          },
          {
            id: 14,
            russian: "Один",
            vietnamese: "Một",
            options: ["Một", "Hai", "Ba", "Bốn"],
            correct_answer: "Một",
          },
          {
            id: 15,
            russian: "Два",
            vietnamese: "Hai",
            options: ["Một", "Hai", "Ba", "Bốn"],
            correct_answer: "Hai",
          },
          {
            id: 16,
            russian: "Три",
            vietnamese: "Ba",
            options: ["Một", "Hai", "Ba", "Bốn"],
            correct_answer: "Ba",
          },
          {
            id: 17,
            russian: "Вода",
            vietnamese: "Nước",
            options: ["Nước", "Lửa", "Đất", "Không khí"],
            correct_answer: "Nước",
          },
          {
            id: 18,
            russian: "Хлеб",
            vietnamese: "Bánh mì",
            options: ["Bánh mì", "Cơm", "Thịt", "Rau"],
            correct_answer: "Bánh mì",
          },
          {
            id: 19,
            russian: "Книга",
            vietnamese: "Sách",
            options: ["Sách", "Bút", "Bàn", "Ghế"],
            correct_answer: "Sách",
          },
          {
            id: 20,
            russian: "Дом",
            vietnamese: "Nhà",
            options: ["Nhà", "Trường học", "Công viên", "Bệnh viện"],
            correct_answer: "Nhà",
          },
        ];

        setVocabularyItems(mockItems);
        setIsLoading(false);
        setIsGeneratingTest(false);

        toast.info("Đang sử dụng dữ liệu dự phòng", {
          description:
            "Không thể kết nối với Gemini AI. Đang sử dụng bài kiểm tra cơ bản.",
        });
      }
    };

    generateVocabularyTest();
  }, [session]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || testCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, testCompleted]);

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [vocabularyItems[currentItemIndex].id]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentItemIndex < vocabularyItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    let correctCount = 0;
    const correct: number[] = [];
    const incorrect: number[] = [];

    vocabularyItems.forEach((item) => {
      const userAnswer = answers[item.id];
      if (userAnswer === item.correct_answer) {
        correctCount++;
        correct.push(item.id);
      } else if (userAnswer) {
        incorrect.push(item.id);
      }
    });

    const finalScore = Math.round(
      (correctCount / vocabularyItems.length) * 100
    );

    setScore(finalScore);
    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);
    setTestCompleted(true);

    toast.success(
      `Bạn đã hoàn thành bài kiểm tra với số điểm: ${finalScore}%`,
      {
        description: `Số câu đúng: ${correctCount}/${vocabularyItems.length}`,
        duration: 5000,
      }
    );
  };

  const handleRetakeTest = async () => {
    setAnswers({});
    setCurrentItemIndex(0);
    setTestCompleted(false);
    setTimeLeft(40 * 60); // Increased from 20 to 40 minutes for 20 questions
    setCorrectAnswers([]);
    setIncorrectAnswers([]);
    setIsLoading(true);

    toast.info("Đang tạo bài kiểm tra mới", {
      description: "Gemini AI đang tạo bài kiểm tra mới cho bạn.",
    });

    // Generate a new test with Gemini AI
    const generateVocabularyTest = async () => {
      setIsGeneratingTest(true);
      setErrorMessage(null);

      try {
        // Get user's Russian level from session if available
        const userLevel = session?.user?.metadata?.russian_level || "A1";

        // Call Gemini AI service to generate vocabulary test
        const items = await vocabularyService.generateVocabularyTest({
          level: userLevel as any,
          count: 20,
          topic: "general",
        });

        setVocabularyItems(items);
        setIsLoading(false);
        setIsGeneratingTest(false);

        toast.success("Bài kiểm tra từ vựng mới đã được tạo!", {
          description: "Hãy cố gắng và đạt điểm cao hơn!",
        });
      } catch (error) {
        console.error("Error generating vocabulary test:", error);
        // Use the same test again if Gemini AI fails
        setIsLoading(false);
        setIsGeneratingTest(false);

        toast.info("Sử dụng lại bài kiểm tra hiện tại", {
          description:
            "Không thể tạo bài kiểm tra mới. Đang sử dụng lại bài kiểm tra hiện tại.",
        });
      }
    };

    generateVocabularyTest();
  };

  const handleBackToTests = () => {
    router.push("/tests");
  };

  const handleSkipTest = () => {
    setShowSkipDialog(false);
    router.push("/tests");
    toast.info("Đã bỏ qua bài kiểm tra", {
      description: "Bạn có thể quay lại làm bài kiểm tra bất cứ lúc nào.",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Book className="mx-auto text-indigo-600 mb-6 h-16 w-16 animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">
            {isGeneratingTest
              ? "Đang tạo bài kiểm tra từ vựng..."
              : "Đang tải bài kiểm tra..."}
          </h2>
          <p className="text-gray-600 mb-4">
            {isGeneratingTest
              ? "Gemini AI đang tạo các câu hỏi từ vựng phù hợp với trình độ của bạn."
              : "Vui lòng đợi trong giây lát"}
          </p>

          {errorMessage && (
            <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={handleBackToTests}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách bài kiểm tra
        </Button>

        {/* Title Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Kết Quả Bài Kiểm Tra Từ Vựng
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Cảm ơn bạn đã hoàn thành bài kiểm tra. Dưới đây là kết quả của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Results Summary */}
          <div className="lg:col-span-8">
            <TestResultSummary
              score={score}
              questions={vocabularyItems.map((item) => ({
                id: item.id,
                question:
                  testMode === "russian_to_vietnamese"
                    ? item.russian
                    : item.vietnamese,
                options: item.options,
                correct_answer: item.correct_answer,
                type: "single",
              }))}
              correctAnswers={correctAnswers}
              incorrectAnswers={incorrectAnswers}
              updating={false}
              onRetakeTest={handleRetakeTest}
              onBackToTests={handleBackToTests}
            />
          </div>

          {/* Questions Review */}
          <div className="lg:col-span-4">
            <TestResultDetails
              questions={vocabularyItems.map((item) => ({
                id: item.id,
                question:
                  testMode === "russian_to_vietnamese"
                    ? item.russian
                    : item.vietnamese,
                options: item.options,
                correct_answer: item.correct_answer,
                type: "single",
              }))}
              answers={answers}
              correctAnswers={correctAnswers}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-start items-start gap-4">
          <div
            onClick={() => setShowSkipDialog(true)}
            className="flex text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <ChevronLeft className="h-9 w-9" />
          </div>
          {/* Title Section */}
          <div className="mb-6 text-start">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Kiểm tra từ vựng
            </h1>
            <p className="text-sky-500 max-w-2xl">
              {testMode === "russian_to_vietnamese"
                ? "Chọn nghĩa tiếng Việt cho từ tiếng Nga"
                : "Chọn từ tiếng Nga cho nghĩa tiếng Việt"}
            </p>
          </div>
          <div className="ml-auto flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium text-gray-500">
                  Câu {currentItemIndex + 1}/{vocabularyItems.length}
                </Label>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600"
                    onClick={() => {
                      setTestMode(
                        testMode === "russian_to_vietnamese"
                          ? "vietnamese_to_russian"
                          : "russian_to_vietnamese"
                      );
                      toast.info(
                        testMode === "russian_to_vietnamese"
                          ? "Chuyển sang kiểm tra Việt-Nga"
                          : "Chuyển sang kiểm tra Nga-Việt"
                      );
                    }}
                  >
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Đổi chế độ
                  </Button>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {testMode === "russian_to_vietnamese"
                    ? vocabularyItems[currentItemIndex].russian
                    : vocabularyItems[currentItemIndex].vietnamese}
                </h2>
                <p className="text-gray-600">
                  {testMode === "russian_to_vietnamese"
                    ? "Chọn nghĩa tiếng Việt đúng"
                    : "Chọn từ tiếng Nga đúng"}
                </p>
              </div>

              <div className="space-y-3">
                {vocabularyItems[currentItemIndex].options.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      answers[vocabularyItems[currentItemIndex].id] === option
                        ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentItemIndex === 0}
                variant="outline"
              >
                Câu trước
              </Button>
              {currentItemIndex === vocabularyItems.length - 1 ? (
                <Button onClick={handleSubmitTest}>Hoàn thành</Button>
              ) : (
                <Button onClick={handleNextQuestion}>Câu tiếp theo</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {vocabularyItems.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-10 w-10 p-0 ${
                answers[vocabularyItems[index].id]
                  ? "bg-indigo-100 border-indigo-300 hover:bg-indigo-200"
                  : ""
              } ${index === currentItemIndex ? "ring-2 ring-indigo-500" : ""}`}
              onClick={() => setCurrentItemIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </motion.div>

      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn dừng?</AlertDialogTitle>
            <AlertDialogDescription>
              Tiến trình làm bài kiểm tra của bạn sẽ bị mất. Bạn sẽ phải bắt đầu
              lại từ đầu vào lần sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkipTest}>
              Dừng bài kiểm tra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
