import type { Attempt, Confidence } from "./types";

type Row = [string, string, number, Confidence]; // questionId, selected, seconds, confidence

const toResponses = (rows: Row[]) =>
  rows.map(([questionId, selected, timeSec, confidence]) => ({ questionId, selected, timeSec, confidence }));

/** Full progress check, a few days ago. */
const fullCheck: Row[] = [
  ["q1", "b", 32, "sure"],
  ["q2", "c", 61, "sure"], // revisit concept — added masses
  ["q3", "a", 118, "unsure"], // concept to revisit — n-factor
  ["q4", "c", 28, "sure"],
  ["q5", "d", 58, "sure"],
  ["q6", "a", 96, "unsure"], // needs confirmation
  ["q7", "b", 30, "sure"],
  ["q8", "a", 92, "sure"], // calculation slip, sure → revisit concept flag
  ["q9", "b", 112, "sure"], // correct but slow
  ["q10", "c", 52, "unsure"], // correct, slow, needs confirmation
  ["q11", "a", 70, "sure"], // read the question again, sure
  ["q12", "c", 131, "unsure"], // calculation slip
  ["q13", "d", 22, "sure"],
  ["q14", "a", 41, "sure"],
  ["q15", "b", 88, "sure"],
];

/** Follow-up Mole concept check after a tutoring session — shows improvement. */
const moleCheck: Row[] = [
  ["q1", "b", 26, "sure"],
  ["q2", "a", 58, "sure"],
  ["q3", "a", 101, "unsure"],
];

const daysAgo = (n: number, hour = 17) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

/** Seeded on first login so the dashboard isn't empty. Marked isSample so the UI can label it. */
export function seedHistory(studentName: string): Attempt[] {
  return [
    {
      id: "demo-full",
      testId: "full",
      studentName,
      startedAt: daysAgo(6),
      completedAt: daysAgo(6),
      isSample: true,
      responses: toResponses(fullCheck),
    },
    {
      id: "demo-mole",
      testId: "mole",
      studentName,
      startedAt: daysAgo(2),
      completedAt: daysAgo(2),
      isSample: true,
      responses: toResponses(moleCheck),
    },
  ];
}
