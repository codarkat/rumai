"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  BadgeX,
  MessageCircleQuestion,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";
import { useSession } from "next-auth/react";
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

// Import các component đã tách
import { QuestionReviewPanel } from "@/components/tests/QuestionReviewPanel";
import { QuestionRenderer } from "@/components/tests/QuestionRenderer";
import { TestResultSummary } from "@/components/tests/TestResultSummary";
import { TestResultDetails } from "@/components/tests/TestResultDetails";
import { TimeDisplay } from "@/components/tests/TimeDisplay";
import { Question, TestMetadata } from "@/types/tests";

// Import localStorage utilities
import {
  getTestState,
  initTestState,
  updateTestState,
  clearTestState,
  calculateRemainingTime,
} from "@/utils/test-storage";

export default function ProficiencyTestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testMetadata, setTestMetadata] = useState<TestMetadata | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [textInputs, setTextInputs] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // Default: 40 minutes in seconds
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  // Check for existing test session on component mount
  useEffect(() => {
    const existingTest = getTestState();

    if (existingTest) {
      // Test already in progress
      if (existingTest.testCompleted) {
        // If test is completed, redirect to results page
        router.push("/tests/proficiency-test/results");
        return;
      }

      // Resume existing test
      setQuestions(existingTest.questions);
      setTestMetadata(existingTest.testMetadata);
      setCurrentQuestionIndex(existingTest.currentQuestionIndex);
      setAnswers(existingTest.answers);
      setTextInputs(existingTest.textInputs);

      // Calculate remaining time based on when the test started
      const totalDurationSeconds = existingTest.testMetadata?.duration
        ? existingTest.testMetadata.duration * 60
        : 40 * 60;

      const remainingTime = calculateRemainingTime(
        existingTest.timeStarted,
        totalDurationSeconds
      );

      if (remainingTime <= 0) {
        // Time's up - automatically submit the test
        handleSubmitTest();
      } else {
        setTimeLeft(remainingTime);
        setIsLoading(false);
      }
    } else {
      // No existing test, fetch questions
      fetchQuestions();
    }
  }, []);

  // Update localStorage whenever state changes
  useEffect(() => {
    if (isLoading || !questions.length) return;

    updateTestState({
      questions,
      testMetadata,
      currentQuestionIndex,
      answers,
      textInputs,
      timeLeft,
    });
  }, [
    questions,
    testMetadata,
    currentQuestionIndex,
    answers,
    textInputs,
    timeLeft,
  ]);

  // Fetch test questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/tests/proficiency-test");
      const data = await response.json();

      let typedQuestions: Question[] = [];
      let metadata: TestMetadata | null = null;

      if (data.questions) {
        // Add type property to each question if not already present
        typedQuestions = data.questions.map((q: any) => ({
          ...q,
          type: q.type || "single", // Set default type as single choice if not specified
        }));

        setQuestions(typedQuestions);
      }

      if (data.metadata) {
        metadata = data.metadata;
        setTestMetadata(metadata);
        // Set time based on metadata
        if (data.metadata.duration) {
          setTimeLeft(data.metadata.duration * 60); // Convert minutes to seconds
        }
      }

      // Initialize test state in localStorage
      initTestState({
        questions: typedQuestions,
        testMetadata: metadata,
        timeStarted: Date.now(),
        timeLeft: metadata?.duration ? metadata.duration * 60 : 40 * 60,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Fallback to static data for now
      try {
        const data = await import("@/data/tests/proficiency-test.json");
        // Add type property to each question
        const typedData = data.default.map((q: any) => ({
          ...q,
          type: "single", // Set default type as single choice for existing questions
        }));

        setQuestions(typedData);

        // Initialize test state in localStorage with fallback data
        initTestState({
          questions: typedData,
          timeStarted: Date.now(),
        });

        setIsLoading(false);
      } catch (fallbackError) {
        console.error("Error loading fallback data:", fallbackError);
      }
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isLoading) return;

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
  }, [isLoading]);

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "multiple") {
      // For multiple choice questions, handle selecting/deselecting options
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      let newAnswers: string[];

      if (currentAnswers.includes(answer)) {
        // If already selected, remove it
        newAnswers = currentAnswers.filter((item) => item !== answer);
      } else {
        // If not selected, add it
        newAnswers = [...currentAnswers, answer];
      }

      setAnswers({
        ...answers,
        [currentQuestion.id]: newAnswers,
      });
    } else {
      // For single choice questions
      setAnswers({
        ...answers,
        [currentQuestion.id]: answer,
      });
    }
  };

  const handleTextInputChange = (text: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setTextInputs({
      ...textInputs,
      [currentQuestion.id]: text,
    });

    // Also update answers for consistency in score calculation
    setAnswers({
      ...answers,
      [currentQuestion.id]: text,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Calculate score
    let correctCount = 0;
    const correct: number[] = [];
    const incorrect: number[] = [];

    questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (!userAnswer) {
        // Skip unanswered questions
        return;
      }

      let isCorrect = false;

      if (question.type === "multiple") {
        // For multiple choice, check if arrays match (order doesn't matter)
        const correctAnswerArray = question.correct_answer as string[];
        const userAnswerArray = userAnswer as string[];

        // Check if user selected all correct answers and no incorrect ones
        isCorrect =
          correctAnswerArray.length === userAnswerArray.length &&
          correctAnswerArray.every((ans) => userAnswerArray.includes(ans));
      } else if (question.type === "text") {
        // For text input, compare case-insensitive
        const correctAnswerText = question.correct_answer as string;
        const userAnswerText = userAnswer as string;

        isCorrect =
          userAnswerText.toLowerCase() === correctAnswerText.toLowerCase();
      } else {
        // For single choice
        isCorrect = userAnswer === question.correct_answer;
      }

      if (isCorrect) {
        correctCount++;
        correct.push(question.id);
      } else {
        incorrect.push(question.id);
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);

    // Xác định russian_level dựa trên điểm số
    let russianLevel = "";
    if (finalScore >= 90) {
      russianLevel = "C2";
    } else if (finalScore >= 75) {
      russianLevel = "C1";
    } else if (finalScore >= 60) {
      russianLevel = "B2";
    } else if (finalScore >= 45) {
      russianLevel = "B1";
    } else if (finalScore >= 30) {
      russianLevel = "A2";
    } else {
      russianLevel = "A1";
    }

    // Update test state in localStorage
    updateTestState({
      testCompleted: true,
      score: finalScore,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      russianLevel,
    });

    // Cập nhật russian_level của người dùng
    try {
      await authService.updateProfile({
        russian_level: russianLevel,
      });

      // Redirect to results page
      router.push("/tests/proficiency-test/results");
    } catch (error) {
      console.error("Lỗi khi cập nhật russian_level:", error);
      // Still redirect to results even if profile update fails
      router.push("/tests/proficiency-test/results");
    }
  };

  const handleBackToTests = () => {
    router.push("/tests");
  };

  const handleSkipTest = async () => {
    try {
      // Set level to A1 when skipping the test
      await authService.updateProfile({
        russian_level: "A1",
      });

      // Clear test state and redirect to tests page
      clearTestState();
      router.push("/tests");
    } catch (error) {
      console.error("Lỗi khi cập nhật russian_level:", error);
      router.push("/tests");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Đang tải bài kiểm tra...</p>
      </div>
    );
  }

  // Test taking view
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Helper to check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === "multiple") {
      const ans = answers[currentQuestion.id] as string[] | undefined;
      return ans !== undefined && ans.length > 0;
    }

    return answers[currentQuestion.id] !== undefined;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start gap-4 justify-start">
        <div onClick={handleBackToTests} className="h-10 w-10 text-blue-500">
          <ChevronLeft className="h-9 w-9" />
        </div>
        {/* Title Section */}
        <div className="mb-6 text-start">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            {testMetadata?.title || "Bài Kiểm Tra Trình Độ Tiếng Nga"}
          </h1>
          <p className="text-blue-900/60 max-w-2xl mt-2">
            {testMetadata?.description ||
              "Hãy hoàn thành các câu hỏi dưới đây để xác định trình độ tiếng Nga của bạn từ A1 đến C2"}
          </p>
        </div>
      </div>

      {/* Skip Test Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ qua bài kiểm tra?</AlertDialogTitle>
            <AlertDialogDescription>
              Nếu bạn bỏ qua, trình độ của bạn sẽ được đặt mặc định là A1 (Sơ
              cấp). Bạn có thể làm lại bài kiểm tra này sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkipTest}
              className="bg-red-500 hover:bg-red-600"
            >
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Review Panel - Left Side */}
        <div className="lg:col-span-3">
          <QuestionReviewPanel
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onSelectQuestion={setCurrentQuestionIndex}
            onSubmitTest={handleSubmitTest}
            onShowSkipDialog={() => setShowSkipDialog(true)}
            timeLeft={timeLeft}
          />
        </div>

        {/* Main Question Area - Right Side */}
        <div className="lg:col-span-9">
          {currentQuestion ? (
            <Card className="border border-blue-100 mb-4 overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-sky-500 font-medium flex items-center gap-1">
                    <MessageCircleQuestion className="h-4 w-4" />
                    Câu hỏi {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                      {currentQuestion.question}
                    </h2>

                    {/* Sử dụng component QuestionRenderer */}
                    <QuestionRenderer
                      question={currentQuestion}
                      answers={answers}
                      textInputs={textInputs}
                      onSelectAnswer={handleAnswerSelect}
                      onTextInputChange={handleTextInputChange}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                  >
                    Câu trước
                  </Button>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitTest}
                      disabled={!isCurrentQuestionAnswered()}
                      className="px-6 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500"
                    >
                      Hoàn thành bài kiểm tra
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!isCurrentQuestionAnswered()}
                      className="px-6 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500"
                    >
                      Câu tiếp theo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Không có câu hỏi nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
