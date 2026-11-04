import { analyse } from "./analysis";
import { bank } from "./bank";
import type { Attempt, Report, TopicResult } from "./types";

export interface AnalysedAttempt {
  attempt: Attempt;
  report: Report;
}

const cache = new WeakMap<Attempt, Report>();

export function analysed(attempts: Attempt[]): AnalysedAttempt[] {
  return attempts.map((attempt) => {
    let report = cache.get(attempt);
    if (!report) {
      report = analyse(attempt);
      cache.set(attempt, report);
    }
    return { attempt, report };
  });
}

/** Most recent result for each topic (attempts must be newest first). Topics never attempted are omitted. */
export function latestTopicResults(items: AnalysedAttempt[]): TopicResult[] {
  return bank.topics.flatMap((topic) => {
    for (const { report } of items) {
      const t = report.topics.find((x) => x.topic.id === topic.id);
      if (t) return [t];
    }
    return [];
  });
}

/** Lowest current mastery first; untried topics count as the next thing to try. */
export function recommendedTopic(items: AnalysedAttempt[]) {
  const latest = latestTopicResults(items);
  const untried = bank.topics.find((t) => !latest.some((l) => l.topic.id === t.id));
  if (untried) return { topic: untried, mastery: null as number | null, reason: "You haven't tried this topic yet." };
  const lowest = [...latest].sort((a, b) => a.mastery - b.mastery)[0];
  return {
    topic: lowest.topic,
    mastery: lowest.mastery as number | null,
    reason:
      lowest.status === "Strong"
        ? "Everything is strong — a quick check keeps it sharp."
        : "Your current focus area — a quick check shows how the sessions are landing.",
  };
}

export function fmtDate(iso: string, withTime = false) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
