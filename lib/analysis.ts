import { bank } from "./bank";
import type {
  Attempt,
  Difficulty,
  ErrorType,
  Report,
  TopicResult,
  TopicStatus,
  WrongAnswer,
} from "./types";

const weight: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

export function statusFor(mastery: number): TopicStatus {
  if (mastery >= 75) return "Strong";
  if (mastery >= 50) return "On track";
  return "Focus";
}

export function analyse(attempt: Attempt): Report {
  const byQ = new Map(attempt.responses.map((r) => [r.questionId, r]));
  const wrong: WrongAnswer[] = [];
  const luckyGuesses: Report["luckyGuesses"] = [];
  const errorCounts: Record<ErrorType, number> = {
    "concept gap": 0,
    "calculation slip": 0,
    misread: 0,
  };

  const topics: TopicResult[] = bank.topics.map((topic) => {
    const qs = bank.questions.filter((q) => q.topic === topic.id);
    let earned = 0;
    let possible = 0;
    let correct = 0;
    let time = 0;
    const slowCorrect: TopicResult["slowCorrect"] = [];
    const lucky: TopicResult["luckyGuesses"] = [];
    const misconceptions: TopicResult["misconceptions"] = [];

    for (const q of qs) {
      possible += weight[q.difficulty];
      const r = byQ.get(q.id);
      if (!r) continue;
      time += r.timeSec;
      const isCorrect = r.selected === q.answer;
      if (isCorrect) {
        correct++;
        earned += weight[q.difficulty];
        if (r.timeSec > q.targetSec) slowCorrect.push({ question: q, timeSec: r.timeSec });
        if (r.confidence === "unsure") {
          lucky.push(q);
          luckyGuesses.push({ question: q, timeSec: r.timeSec });
        }
      } else {
        const chosen = q.options.find((o) => o.id === r.selected)!;
        const right = q.options.find((o) => o.id === q.answer)!;
        const w: WrongAnswer = {
          question: q,
          chosen,
          correct: right,
          confidence: r.confidence,
          timeSec: r.timeSec,
        };
        wrong.push(w);
        errorCounts[chosen.errorType ?? "concept gap"]++;
        if (r.confidence === "sure") misconceptions.push(q);
      }
    }

    const mastery = possible ? Math.round((earned / possible) * 100) : 0;
    return {
      topic,
      correct,
      total: qs.length,
      mastery,
      status: statusFor(mastery),
      avgTimeSec: qs.length ? Math.round(time / qs.length) : 0,
      slowCorrect,
      luckyGuesses: lucky,
      misconceptions,
    };
  });

  const score = topics.reduce((s, t) => s + t.correct, 0);
  const total = bank.questions.length;
  const totalTimeSec = attempt.responses.reduce((s, r) => s + r.timeSec, 0);

  // Weakest first: lowest mastery, then most misconceptions, then lucky guesses.
  const ranked = [...topics].sort(
    (a, b) =>
      a.mastery - b.mastery ||
      b.misconceptions.length - a.misconceptions.length ||
      b.luckyGuesses.length - a.luckyGuesses.length,
  );

  const focus = ranked.slice(0, 2).map((t) => {
    // Lead with the concepts the student actually got wrong / guessed, then fill from the syllabus list.
    const missed = wrong
      .filter((w) => w.question.topic === t.topic.id)
      .map((w) => w.question.concept);
    const guessed = t.luckyGuesses.map((q) => q.concept);
    const subConcepts = Array.from(new Set([...missed, ...guessed, ...t.topic.focusConcepts])).slice(0, 4);
    return { topic: t.topic, mastery: t.mastery, subConcepts };
  });

  const misconceptions = wrong.filter((w) => w.confidence === "sure");

  return {
    studentName: attempt.studentName,
    score,
    total,
    percent: Math.round((score / total) * 100),
    totalTimeSec,
    topics,
    wrong,
    errorCounts,
    luckyGuesses,
    misconceptions,
    slowTopics: topics.filter((t) => t.slowCorrect.length > 0),
    focus,
  };
}


export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}
