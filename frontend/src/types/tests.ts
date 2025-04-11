export interface Question {
  id: number;
  question: string;
  type: "single" | "multiple" | "text"; // Question type: single choice, multiple choice, or text input
  options?: string[]; // Optional for text input questions
  correct_answer: string | string[]; // Can be a string or array of strings for multiple choice
}

export interface TestResult {
  score: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
}

export interface TestStatus {
  isLoading: boolean;
  testCompleted: boolean;
  updating: boolean;
}

export interface TestMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  levels: string[];
  questionTypes: string[];
}

export interface ProficiencyTestState {
  questions: Question[];
  testMetadata: TestMetadata | null;
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  textInputs: Record<number, string>;
  testCompleted: boolean;
  score: number;
  timeLeft: number;
  timeStarted: number; // Unix timestamp when the test started
  correctAnswers: number[];
  incorrectAnswers: number[];
  russianLevel: string;
  lastUpdated: number; // Unix timestamp for when the state was last updated
}
