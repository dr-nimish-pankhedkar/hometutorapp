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
  return "Focus area";
}

export function analyse(attempt: Attempt): Report {
  const byQ = new Map(attempt.responses.map((r) => [r.questionId, r]));
  const wrong: WrongAnswer[] = [];
  const needsConfirmation: Report["needsConfirmation"] = [];
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
    const toConfirm: TopicResult["needsConfirmation"] = [];
    const revisitConcepts: TopicResult["revisitConcepts"] = [];

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
          toConfirm.push(q);
          needsConfirmation.push({ question: q, timeSec: r.timeSec });
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
        if (r.confidence === "sure") revisitConcepts.push(q);
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
      needsConfirmation: toConfirm,
      revisitConcepts,
    };
  });

  const score = topics.reduce((s, t) => s + t.correct, 0);
  const total = bank.questions.length;
  const totalTimeSec = attempt.responses.reduce((s, r) => s + r.timeSec, 0);

  // Focus areas first: lowest mastery, then most concepts to revisit, then answers needing confirmation.
  const ranked = [...topics].sort(
    (a, b) =>
      a.mastery - b.mastery ||
      b.revisitConcepts.length - a.revisitConcepts.length ||
      b.needsConfirmation.length - a.needsConfirmation.length,
  );

  const focus = ranked.slice(0, 2).map((t) => {
    // Lead with the concepts the student actually got wrong / guessed, then fill from the syllabus list.
    const missed = wrong
      .filter((w) => w.question.topic === t.topic.id)
      .map((w) => w.question.concept);
    const guessed = t.needsConfirmation.map((q) => q.concept);
    const subConcepts = Array.from(new Set([...missed, ...guessed, ...t.topic.focusConcepts])).slice(0, 4);
    return { topic: t.topic, mastery: t.mastery, subConcepts };
  });

  const revisitConcepts = wrong.filter((w) => w.confidence === "sure");

  // Strengths never overlap with the 2-week plan topics, so the report doesn't contradict itself.
  const planIds = new Set(focus.map((f) => f.topic.id));
  const byMasteryDesc = [...topics].sort((a, b) => b.mastery - a.mastery).filter((t) => !planIds.has(t.topic.id));
  const strongTopics = byMasteryDesc.filter((t) => t.status !== "Focus area");
  const correctSure = bank.questions.filter((q) => {
    const r = byQ.get(q.id);
    return r && r.selected === q.answer && r.confidence === "sure";
  });
  const strengths: Report["strengths"] = {
    topics: strongTopics.length ? strongTopics : byMasteryDesc.filter((t) => t.mastery > 0).slice(0, 1),
    secureConcepts: correctSure.map((q) => ({ topic: q.topic, concept: q.concept })),
    onPace: bank.questions.filter((q) => {
      const r = byQ.get(q.id);
      return r && r.selected === q.answer && r.timeSec <= q.targetSec;
    }).length,
  };

  return {
    studentName: attempt.studentName,
    score,
    total,
    percent: Math.round((score / total) * 100),
    totalTimeSec,
    topics,
    wrong,
    errorCounts,
    needsConfirmation,
    revisitConcepts,
    slowTopics: topics.filter((t) => t.slowCorrect.length > 0),
    strengths,
    focus,
  };
}


export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}
