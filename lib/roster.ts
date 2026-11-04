"use client";

import { useMemo } from "react";
import { bank } from "./bank";
import { analysed, type AnalysedAttempt } from "./progress";
import { useAttempts } from "./storage";
import { getTest } from "./tests";
import type { Attempt, Confidence, Difficulty } from "./types";
import { otherStudents, student, type StudentProfile } from "./user";

export interface RosterEntry {
  profile: StudentProfile;
  /** Newest first */
  items: AnalysedAttempt[];
  /** True for Aarav: results come from tests actually taken in this browser */
  live: boolean;
}

/* ---------- Deterministic demo results for the rest of the batch ---------- */

// Topic skill (0–1) per demo student: mole, atomic, thermo, equilibrium, goc
const skills: Record<string, Record<string, number>> = {
  priya: { mole: 0.7, atomic: 0.85, thermo: 0.35, equilibrium: 0.6, goc: 0.9 },
  rohan: { mole: 0.8, atomic: 0.75, thermo: 0.7, equilibrium: 0.6, goc: 0.5 },
  sneha: { mole: 0.5, atomic: 0.6, thermo: 0.3, equilibrium: 0.25, goc: 0.45 },
  kabir: { mole: 0.4, atomic: 0.75, thermo: 0.6, equilibrium: 0.5, goc: 0.3 },
};
const diffShift: Record<Difficulty, number> = { easy: 0.15, medium: 0, hard: -0.15 };

function rng(seedText: string) {
  let h = 1779033703;
  for (const c of seedText) h = Math.imul(h ^ c.charCodeAt(0), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

function daysAgo(n: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function generate(profile: StudentProfile, testId: string, ago: number, boost: number, idx: number): Attempt {
  const rand = rng(`${profile.id}:${testId}:${idx}`);
  const test = getTest(testId)!;
  const skill = skills[profile.id];
  const responses = test.questions.map((q) => {
    const s = Math.min(0.97, skill[q.topic] + boost);
    const correct = rand() < s + diffShift[q.difficulty];
    const wrongs = q.options.filter((o) => o.id !== q.answer);
    const selected = correct ? q.answer : wrongs[Math.floor(rand() * wrongs.length)].id;
    const confidence: Confidence = rand() < (correct ? 0.55 + 0.4 * s : 0.35) ? "sure" : "unsure";
    const timeSec = Math.round(q.targetSec * (0.55 + rand() * 0.7 + (1 - s) * 0.35));
    return { questionId: q.id, selected, timeSec, confidence };
  });
  const when = daysAgo(ago, 16 + (idx % 4));
  return { id: `${profile.id}-${idx}`, testId, studentName: profile.firstName, startedAt: when, completedAt: when, isSample: true, responses };
}

function demoHistory(profile: StudentProfile): Attempt[] {
  const skill = skills[profile.id];
  const lowest = bank.topics.map((t) => t.id).sort((a, b) => skill[a] - skill[b])[0];
  return [
    generate(profile, lowest, 1 + (profile.id.length % 3), 0.2, 3), // topic follow-up after sessions
    generate(profile, "full", 5 + (profile.id.length % 2), 0.08, 2), // second full check
    generate(profile, "full", 13, 0, 1), // first full check
  ];
}

let demoCache: RosterEntry[] | null = null;
function demoRoster(): RosterEntry[] {
  if (!demoCache) {
    demoCache = otherStudents.map((profile) => ({ profile, items: analysed(demoHistory(profile)), live: false }));
  }
  return demoCache;
}

/** Dr. Pankhedkar's batch: Aarav (live from this browser) + the generated demo students. `null` until hydrated. */
export function useRoster(): RosterEntry[] | null {
  const attempts = useAttempts();
  return useMemo(() => {
    if (!attempts) return null;
    return [{ profile: student, items: analysed(attempts), live: true }, ...demoRoster()];
  }, [attempts]);
}

export const allStudentIds = [student.id, ...otherStudents.map((s) => s.id)];
