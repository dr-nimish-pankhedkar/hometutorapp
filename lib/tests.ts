import { bank, testQuestions } from "./bank";
import type { Difficulty, Question } from "./types";

export interface TestDef {
  id: string;
  kind: "full" | "topic";
  title: string;
  subtitle: string;
  topicId?: string;
  questions: Question[];
  minutes: number;
}

const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
const minutesFor = (qs: Question[]) => Math.max(3, Math.round(qs.reduce((s, q) => s + q.targetSec, 0) / 60));

const full: TestDef = {
  id: "full",
  kind: "full",
  title: "Chemistry progress check",
  subtitle: "All 5 topics · easy to hard",
  questions: testQuestions,
  minutes: minutesFor(testQuestions),
};

const topicTests: TestDef[] = bank.topics.map((t) => {
  const qs = bank.questions.filter((q) => q.topic === t.id).sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  return {
    id: t.id,
    kind: "topic",
    title: t.name,
    subtitle: t.chapter,
    topicId: t.id,
    questions: qs,
    minutes: minutesFor(qs),
  };
});

export const tests: TestDef[] = [full, ...topicTests];
const byId = new Map(tests.map((t) => [t.id, t]));

export function getTest(id: string): TestDef | undefined {
  return byId.get(id);
}
