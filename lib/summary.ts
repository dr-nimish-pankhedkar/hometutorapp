import { topicById } from "./bank";
import { ERROR_LABEL, type ErrorType, type Report } from "./types";

/** Compact, PII-light digest of a report — what the summary (template or Claude) is written from. */
export interface SummaryInput {
  studentName: string;
  testTitle: string;
  score: number;
  total: number;
  percent: number;
  strengths: { topics: string[]; secureConcepts: string[]; answersOnPace: number };
  topics: { name: string; mastery: number; status: string; buildSpeed: boolean }[];
  /** Keyed by friendly label: "Concept to revisit", "Calculation slip", "Read the question again" */
  answerPatterns: Record<string, number>;
  needsConfirmation: number;
  revisitConcepts: { topic: string; concept: string }[];
  nextTwoWeekPlan: { topic: string; subConcepts: string[] }[];
}

export function toSummaryInput(r: Report): SummaryInput {
  return {
    studentName: r.studentName,
    testTitle: r.testId === "full" ? r.testTitle : `${r.testTitle} topic check`,
    score: r.score,
    total: r.total,
    percent: r.percent,
    strengths: {
      topics: r.strengths.topics.map((t) => t.topic.name),
      secureConcepts: r.strengths.secureConcepts.slice(0, 4).map((c) => c.concept),
      answersOnPace: r.strengths.onPace,
    },
    topics: r.topics.map((t) => ({
      name: t.topic.name,
      mastery: t.mastery,
      status: t.status,
      buildSpeed: t.slowCorrect.length > 0,
    })),
    answerPatterns: Object.fromEntries(
      (Object.keys(r.errorCounts) as ErrorType[]).map((k) => [ERROR_LABEL[k], r.errorCounts[k]]),
    ),
    needsConfirmation: r.needsConfirmation.length,
    revisitConcepts: r.revisitConcepts.map((m) => ({
      topic: topicById.get(m.question.topic)!.name,
      concept: m.question.concept,
    })),
    nextTwoWeekPlan: r.focus.map((f) => ({ topic: f.topic.name, subConcepts: f.subConcepts.slice(0, 2) })),
  };
}

function list(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Parent-facing paragraph: result → strengths → next 2-week plan → encouragement. */
export function templateSummary(s: SummaryInput): string {
  const name = s.studentName || "Your child";
  const they = s.studentName || "they";
  const parts: string[] = [];

  const tone =
    s.percent >= 75 ? "an excellent result" : s.percent >= 50 ? "a solid base to build on" : "a clear starting point for steady progress";
  parts.push(`${name} answered ${s.score} of ${s.total} questions correctly (${s.percent}%) on the ${s.testTitle} — ${tone}.`);

  // Strengths first
  const strong = s.strengths.topics;
  if (strong.length) {
    const secure = s.strengths.secureConcepts[0];
    parts.push(
      `${list(strong)} ${strong.length > 1 ? "are" : "is"} already going well${secure ? `, with confident, correct work on ${secure}` : ""}.`,
    );
  } else {
    parts.push(`${name} attempted every question, which gives the tutor a complete picture to plan from.`);
  }
  if (s.strengths.answersOnPace >= 3) parts.push(`${s.strengths.answersOnPace} correct answers came in at exam pace.`);

  // Then focus areas, framed as the plan
  const plan = s.nextTwoWeekPlan;
  if (plan.length) {
    parts.push(
      `Over the next two weeks, sessions will build on this with ${list(plan.map((p) => p.topic))} as focus areas, beginning with “${plan[0].subConcepts[0]}”.`,
    );
  }
  if (s.revisitConcepts.length) {
    parts.push(
      `${s.revisitConcepts.length === 1 ? "One idea" : `${s.revisitConcepts.length} ideas`} ${they} felt sure about will be revisited early so ${s.revisitConcepts.length === 1 ? "it becomes" : "they become"} fully secure.`,
    );
  }
  const closeCalls = (s.answerPatterns["Calculation slip"] ?? 0) + (s.answerPatterns["Read the question again"] ?? 0);
  if (closeCalls >= 2) {
    parts.push(`Several answers were very close — simple habits like checking units and re-reading the question will add marks quickly.`);
  }
  const speed = s.topics.filter((t) => t.buildSpeed && t.status !== "Focus area").map((t) => t.name);
  if (speed.length) parts.push(`In ${list(speed)} the understanding is already there, and timed practice will build speed.`);

  return parts.join(" ");
}
