export type Difficulty = "easy" | "medium" | "hard";
/** Keys used in data/questions.json. Show them to people via ERROR_LABEL, never raw. */
export type ErrorType = "concept gap" | "calculation slip" | "misread";

export const ERROR_LABEL: Record<ErrorType, string> = {
  "concept gap": "Concept to revisit",
  "calculation slip": "Calculation slip",
  misread: "Read the question again",
};
export type Confidence = "sure" | "unsure";

export interface Option {
  id: string;
  text: string;
  errorType?: ErrorType;
  why?: string;
}

export interface Question {
  id: string;
  topic: string;
  chapter: string;
  concept: string;
  difficulty: Difficulty;
  targetSec: number;
  text: string;
  options: Option[];
  answer: string;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  chapter: string;
  focusConcepts: string[];
}

export interface QuestionBank {
  subject: string;
  level: string;
  topics: Topic[];
  questions: Question[];
}

export interface Response {
  questionId: string;
  selected: string;
  timeSec: number;
  confidence: Confidence;
}

export interface Attempt {
  studentName: string;
  startedAt: string;
  responses: Response[];
  isSample?: boolean;
}

export type TopicStatus = "Strong" | "On track" | "Focus area";

export interface TopicResult {
  topic: Topic;
  correct: number;
  total: number;
  mastery: number; // 0–100, difficulty-weighted
  status: TopicStatus;
  avgTimeSec: number;
  slowCorrect: { question: Question; timeSec: number }[];
  needsConfirmation: Question[];
  revisitConcepts: Question[];
}

export interface WrongAnswer {
  question: Question;
  chosen: Option;
  correct: Option;
  confidence: Confidence;
  timeSec: number;
}

export interface Report {
  studentName: string;
  score: number;
  total: number;
  percent: number;
  totalTimeSec: number;
  topics: TopicResult[];
  wrong: WrongAnswer[];
  errorCounts: Record<ErrorType, number>;
  needsConfirmation: { question: Question; timeSec: number }[];
  revisitConcepts: WrongAnswer[];
  slowTopics: TopicResult[];
  strengths: {
    topics: TopicResult[]; // Strong / On track topics, best first (or the best single topic if none yet)
    secureConcepts: { topic: string; concept: string }[]; // correct and marked "sure"
    onPace: number; // correct answers within target time
  };
  focus: { topic: Topic; mastery: number; subConcepts: string[] }[];
}
