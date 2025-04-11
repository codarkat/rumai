import { ProficiencyTestState } from "@/types/tests";

const STORAGE_KEY = "proficiency_test_state";

// Initialize test state in localStorage
export const initTestState = (
  initialState: Partial<ProficiencyTestState>
): ProficiencyTestState => {
  const defaultState: ProficiencyTestState = {
    questions: [],
    testMetadata: null,
    currentQuestionIndex: 0,
    answers: {},
    textInputs: {},
    testCompleted: false,
    score: 0,
    timeLeft: 40 * 60, // Default 40 minutes in seconds
    timeStarted: Date.now(),
    correctAnswers: [],
    incorrectAnswers: [],
    russianLevel: "",
    lastUpdated: Date.now(),
  };

  const newState = { ...defaultState, ...initialState };
  saveTestState(newState);
  return newState;
};

// Get test state from localStorage
export const getTestState = (): ProficiencyTestState | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (!storedState) return null;

    return JSON.parse(storedState) as ProficiencyTestState;
  } catch (error) {
    console.error("Error getting test state from localStorage:", error);
    return null;
  }
};

// Save test state to localStorage
export const saveTestState = (state: ProficiencyTestState): void => {
  if (typeof window === "undefined") return;

  try {
    const updatedState = { ...state, lastUpdated: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error("Error saving test state to localStorage:", error);
  }
};

// Update test state in localStorage
export const updateTestState = (
  updates: Partial<ProficiencyTestState>
): ProficiencyTestState | null => {
  const currentState = getTestState();
  if (!currentState) return null;

  const updatedState = { ...currentState, ...updates, lastUpdated: Date.now() };
  saveTestState(updatedState);
  return updatedState;
};

// Clear test state from localStorage
export const clearTestState = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing test state from localStorage:", error);
  }
};

// Calculate remaining time based on timeStarted and duration
export const calculateRemainingTime = (
  timeStarted: number,
  totalDuration: number
): number => {
  const elapsedSeconds = Math.floor((Date.now() - timeStarted) / 1000);
  const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);
  return remainingSeconds;
};

// Check if test is still valid (not expired)
export const isTestValid = (state: ProficiencyTestState): boolean => {
  if (state.testCompleted) return true;

  const totalDurationSeconds = state.testMetadata?.duration
    ? state.testMetadata.duration * 60
    : 40 * 60;
  const remainingTime = calculateRemainingTime(
    state.timeStarted,
    totalDurationSeconds
  );

  return remainingTime > 0;
};
