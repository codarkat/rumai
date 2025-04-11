"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

// Import components
import { TestHeader } from "@/components/tests/results/TestHeader";
import { LevelBadge } from "@/components/tests/results/LevelBadge";
import { TabNavigation } from "@/components/tests/results/TabNavigation";
import { SummaryTabContent } from "@/components/tests/results/SummaryTabContent";
import { DetailsTabContent } from "@/components/tests/results/DetailsTabContent";
import { ProficiencyTestState } from "@/types/tests";

// Import localStorage utilities
import { getTestState, clearTestState } from "@/utils/test-storage";

export default function ProficiencyTestResultsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [testState, setTestState] = useState<ProficiencyTestState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary");

  // Load test state from localStorage
  useEffect(() => {
    const storedState = getTestState();

    if (!storedState || !storedState.testCompleted) {
      // If no completed test found, redirect to test page
      router.push("/tests/proficiency-test");
      return;
    }

    setTestState(storedState);
    setIsLoading(false);

    // Ensure session data is updated with the Russian level
    if (
      session?.user?.metadata &&
      (!session.user.metadata.russian_level ||
        session.user.metadata.russian_level !== storedState.russianLevel)
    ) {
      updateSessionRussianLevel(storedState.russianLevel);
    }
  }, []);

  // Update session with Russian level
  const updateSessionRussianLevel = async (russianLevel: string) => {
    if (!session?.user) return;

    try {
      setUpdating(true);

      // Update session with russian_level
      await update({
        ...session,
        user: {
          ...session.user,
          metadata: {
            ...session.user.metadata,
            russian_level: russianLevel,
          },
        },
      });

      setUpdating(false);
    } catch (error) {
      console.error("Error updating session:", error);
      setUpdating(false);
    }
  };

  const handleRetakeTest = async () => {
    // Clear current test state
    clearTestState();

    // Redirect to test page
    router.push("/tests/proficiency-test");
  };

  const handleBackToTests = () => {
    router.push("/tests");
  };

  const handleTabChange = (tab: "summary" | "details") => {
    setActiveTab(tab);
  };

  // Show loading state
  if (isLoading || !testState) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute w-16 h-16 border-2 border-sky-100 rounded-full"></div>
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-2 border-transparent border-b-blue-500 rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Đang tải kết quả bài kiểm tra...
        </p>
      </div>
    );
  }

  // Show results
  return (
    <motion.div
      className="container mx-auto px-4 py-6 md:py-10 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blue decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>

      {/* Header Section */}
      <TestHeader
        onBackToTests={handleBackToTests}
        onRetakeTest={handleRetakeTest}
      />

      {/* Proficiency Level Badge */}
      <LevelBadge level={testState.russianLevel} />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content Area */}
      <div className="relative z-10 grid grid-cols-1 gap-6">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <SummaryTabContent
            russianLevel={testState.russianLevel}
            score={testState.score}
            questions={testState.questions}
            correctAnswers={testState.correctAnswers}
            incorrectAnswers={testState.incorrectAnswers}
            updating={updating}
            onRetakeTest={handleRetakeTest}
            onBackToTests={handleBackToTests}
          />
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <DetailsTabContent
            questions={testState.questions}
            answers={testState.answers}
            correctAnswers={testState.correctAnswers}
          />
        )}
      </div>
    </motion.div>
  );
}
