import type { Attempt, Confidence } from "./types";

/** A realistic sample attempt, shown on /report when no test has been taken in this session. */
const rows: [string, string, number, Confidence][] = [
  // id, selected, seconds, confidence
  ["q1", "b", 32, "sure"],
  ["q2", "c", 61, "sure"], // misconception — added masses
  ["q3", "a", 118, "unsure"], // concept gap — n-factor
  ["q4", "c", 28, "sure"],
  ["q5", "d", 58, "sure"],
  ["q6", "a", 96, "unsure"], // lucky guess
  ["q7", "b", 30, "sure"],
  ["q8", "a", 92, "sure"], // calculation slip, sure → misconception flag
  ["q9", "b", 112, "sure"], // correct but slow
  ["q10", "c", 52, "unsure"], // correct, slow, lucky
  ["q11", "a", 70, "sure"], // misread, sure
  ["q12", "c", 131, "unsure"], // calculation slip
  ["q13", "d", 22, "sure"],
  ["q14", "a", 41, "sure"],
  ["q15", "b", 88, "sure"],
];

export const sampleAttempt: Attempt = {
  studentName: "Aarav",
  startedAt: "2026-11-01T10:00:00.000Z",
  isSample: true,
  responses: rows.map(([questionId, selected, timeSec, confidence]) => ({
    questionId,
    selected,
    timeSec,
    confidence,
  })),
};
