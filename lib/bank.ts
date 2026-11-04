import raw from "@/data/questions.json";
import type { Difficulty, Question, QuestionBank, Topic } from "./types";

export const bank = raw as QuestionBank;

const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

/** Test order: warm-up (easy) first, then medium, then hard — topics interleaved. */
export const testQuestions: Question[] = [...bank.questions].sort(
  (a, b) => order[a.difficulty] - order[b.difficulty],
);

export const questionById = new Map(bank.questions.map((q) => [q.id, q]));
export const topicById = new Map<string, Topic>(bank.topics.map((t) => [t.id, t]));
