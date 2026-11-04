import type { Report } from "./types";

/** Compact, PII-light digest of a report — what the summary (template or Claude) is written from. */
export interface SummaryInput {
  studentName: string;
  score: number;
  total: number;
  percent: number;
  topics: { name: string; mastery: number; status: string; slow: boolean }[];
  errorCounts: Record<string, number>;
  luckyGuesses: number;
  misconceptions: { topic: string; concept: string }[];
  focus: { topic: string; subConcepts: string[] }[];
}

export function toSummaryInput(r: Report): SummaryInput {
  return {
    studentName: r.studentName,
    score: r.score,
    total: r.total,
    percent: r.percent,
    topics: r.topics.map((t) => ({
      name: t.topic.name,
      mastery: t.mastery,
      status: t.status,
      slow: t.slowCorrect.length > 0,
    })),
    errorCounts: r.errorCounts,
    luckyGuesses: r.luckyGuesses.length,
    misconceptions: r.misconceptions.map((m) => ({
      topic: r.topics.find((t) => t.topic.id === m.question.topic)!.topic.name,
      concept: m.question.concept,
    })),
    focus: r.focus.map((f) => ({ topic: f.topic.name, subConcepts: f.subConcepts.slice(0, 2) })),
  };
}

function list(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function templateSummary(s: SummaryInput): string {
  const name = s.studentName || "Your child";
  const strong = s.topics.filter((t) => t.status === "Strong").map((t) => t.name);
  const focus = s.focus.map((f) => f.topic);
  const slow = s.topics.filter((t) => t.slow && t.status !== "Focus").map((t) => t.name);
  const dominant = Object.entries(s.errorCounts).sort((a, b) => b[1] - a[1])[0];

  const parts: string[] = [];
  const tone =
    s.percent >= 75 ? "a strong start" : s.percent >= 50 ? "a solid base to build on" : "a clear picture of where to begin";
  parts.push(
    `${name} scored ${s.score} out of ${s.total} (${s.percent}%) on the Chemistry diagnostic — ${tone}.`,
  );
  if (strong.length) parts.push(`${list(strong)} ${strong.length > 1 ? "are" : "is"} already a strength.`);
  if (focus.length)
    parts.push(
      `For the next two weeks, sessions will concentrate on ${list(focus)}, starting with “${s.focus[0].subConcepts[0]}”.`,
    );
  if (dominant && dominant[1] > 0) {
    const explain: Record<string, string> = {
      "concept gap": "most mistakes point to specific gaps in understanding — exactly what one-to-one teaching fixes fastest",
      "calculation slip": "most mistakes were calculation slips rather than gaps in understanding — careful, step-by-step practice will help",
      misread: "most mistakes came from misreading the question, so we will build a habit of underlining what is asked",
    };
    parts.push(`${explain[dominant[0]][0].toUpperCase()}${explain[dominant[0]].slice(1)}.`);
  }
  if (s.misconceptions.length)
    parts.push(
      `${s.misconceptions.length} answer${s.misconceptions.length > 1 ? "s were" : " was"} marked “sure” but wrong — we will address ${s.misconceptions.length > 1 ? "these misconceptions" : "this misconception"} first.`,
    );
  if (slow.length) parts.push(`${list(slow)} answers were correct but slower than exam pace, so timed practice is planned.`);
  return parts.join(" ");
}
