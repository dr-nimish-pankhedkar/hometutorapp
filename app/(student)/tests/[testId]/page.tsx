"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { bank, topicById } from "@/lib/bank";
import { addAttempt, newAttemptId } from "@/lib/storage";
import { getTest, type TestDef } from "@/lib/tests";
import type { Confidence, Response } from "@/lib/types";
import { student } from "@/lib/user";

const letters = ["A", "B", "C", "D"];
const diffStyle = {
  easy: "bg-teal-100 text-teal",
  medium: "bg-saffron-100 text-saffron-600",
  hard: "bg-rose-100 text-rose",
} as const;

function Intro({ test, onStart }: { test: TestDef; onStart: () => void }) {
  const topicNames = Array.from(new Set(test.questions.map((q) => topicById.get(q.topic)!.name)));
  return (
    <div className="mx-auto max-w-xl px-4 pt-8 pb-16 sm:px-6">
      <Link href="/tests" className="text-sm font-semibold text-muted hover:text-navy">
        ← All tests
      </Link>
      <p className="mt-6 text-xs font-bold tracking-[0.16em] text-teal uppercase">
        {test.kind === "full" ? bank.level : "Quick topic check"}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{test.title}</h1>
      <p className="mt-3 leading-relaxed text-muted">
        {test.questions.length} questions{test.kind === "full" ? ` across ${topicNames.join(", ")}` : ` on ${test.subtitle}`}.
        They get harder as you go. About {test.minutes} minutes.
      </p>
      <ul className="mt-6 space-y-3 rounded-2xl bg-white p-5 ring-1 ring-paper-300">
        {[
          ["One question at a time", "No going back — answer as you would in the exam."],
          ["Each question is timed", "The clock helps us plan your sessions — there is no pressure and no cut-off."],
          ["Tell us if you're sure", "Mark Sure or Unsure honestly. It helps your tutor see which ideas are secure and which need confirming."],
        ].map(([t, d]) => (
          <li key={t} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-saffron" />
            <span>
              <span className="font-bold text-navy">{t}.</span> <span className="text-muted">{d}</span>
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 w-full rounded-xl bg-navy px-6 py-3.5 text-base font-bold text-paper transition hover:bg-navy-700"
      >
        Start, {student.firstName}
      </button>
    </div>
  );
}

function Timer({ elapsed, target }: { elapsed: number; target: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const frac = Math.min(elapsed / target, 1);
  const over = elapsed > target;
  const mm = Math.floor(elapsed / 60);
  const ss = Math.floor(elapsed % 60).toString().padStart(2, "0");
  return (
    <div className="flex items-center gap-2.5" aria-label={`Time on this question ${mm} minutes ${ss} seconds`}>
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90" aria-hidden>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#E4DCC7" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={over ? "#E0892B" : "#1F6B60"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: "stroke-dashoffset 0.25s linear" }}
        />
      </svg>
      <div className="leading-tight">
        <p className={`font-display text-lg font-bold tabular-nums ${over ? "text-saffron-600" : "text-navy"}`}>
          {mm}:{ss}
        </p>
        <p className="text-[11px] text-muted">target {target}s</p>
      </div>
    </div>
  );
}

export default function TestPage() {
  const router = useRouter();
  const { testId } = useParams<{ testId: string }>();
  const test = getTest(testId);
  const testQuestions = test?.questions ?? [];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const responses = useRef<Response[]>([]);
  const startedAt = useRef<number>(0);
  const testStartedAt = useRef<string>("");

  const q = testQuestions[idx];

  useEffect(() => {
    if (!started || finishing) return;
    startedAt.current = performance.now();
    setElapsed(0);
    const t = setInterval(() => setElapsed((performance.now() - startedAt.current) / 1000), 250);
    return () => clearInterval(t);
  }, [idx, started, finishing]);

  const next = useCallback(() => {
    if (!selected || !confidence || finishing || !test) return;
    const timeSec = Math.max(1, Math.round((performance.now() - startedAt.current) / 1000));
    responses.current = [...responses.current, { questionId: q.id, selected, timeSec, confidence }];
    if (idx + 1 < testQuestions.length) {
      setIdx(idx + 1);
      setSelected(null);
      setConfidence(null);
      window.scrollTo({ top: 0 });
    } else {
      setFinishing(true);
      const id = newAttemptId();
      addAttempt({
        id,
        testId: test.id,
        studentName: student.firstName,
        startedAt: testStartedAt.current,
        completedAt: new Date().toISOString(),
        responses: responses.current,
      });
      router.push(`/results/${id}`);
    }
  }, [selected, confidence, finishing, q, idx, router, test, testQuestions.length]);

  // Keyboard: 1–4 / A–D choose, S / U confidence, Enter next
  useEffect(() => {
    if (!started || !q) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const k = e.key.toLowerCase();
      const i = ["1", "2", "3", "4"].indexOf(k);
      const j = ["a", "b", "c", "d"].indexOf(k);
      const pick = i >= 0 ? i : j;
      if (pick >= 0 && q.options[pick]) setSelected(q.options[pick].id);
      else if (k === "s") setConfidence("sure");
      else if (k === "u") setConfidence("unsure");
      else if (k === "enter") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, q, next]);

  if (!test) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-navy">We couldn&apos;t find that test</h1>
        <Link href="/tests" className="mt-4 inline-block font-bold text-saffron-600 underline underline-offset-4">
          Browse all tests
        </Link>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="paper-grain min-h-[calc(100dvh-57px)]">
        <Intro
          test={test}
          onStart={() => {
            testStartedAt.current = new Date().toISOString();
            setStarted(true);
          }}
        />
      </main>
    );
  }

  const topic = topicById.get(q.topic)!;
  const progress = ((idx + (finishing ? 1 : 0)) / testQuestions.length) * 100;
  const ready = !!selected && !!confidence;

  return (
    <main className="bg-paper">
      <div className="mx-auto max-w-2xl px-4 pt-5 pb-32 sm:px-6">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-bold text-navy">{test.title}</span>
          <span className="font-semibold text-muted tabular-nums">
            Question <span className="text-navy">{idx + 1}</span> / {testQuestions.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-paper-300" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-saffron transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold tracking-wide text-paper uppercase">
              {topic.name}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${diffStyle[q.difficulty]}`}>
              {q.difficulty}
            </span>
          </div>
          <Timer elapsed={elapsed} target={q.targetSec} />
        </div>

        <h1 key={q.id} className="mt-5 text-xl leading-snug font-bold text-navy sm:text-2xl">
          {q.text}
        </h1>

        <fieldset className="mt-6">
          <legend className="sr-only">Choose one answer</legend>
          <div className="space-y-3">
            {q.options.map((o, i) => {
              const on = selected === o.id;
              return (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-white px-4 py-3.5 transition ${
                    on ? "border-navy shadow-[0_8px_24px_-14px_rgba(22,35,63,0.6)]" : "border-transparent ring-1 ring-paper-300 hover:ring-navy/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={on}
                    onChange={() => setSelected(o.id)}
                    className="sr-only"
                  />
                  <span
                    className={`font-display grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      on ? "bg-navy text-paper" : "bg-paper-200 text-navy"
                    }`}
                  >
                    {letters[i]}
                  </span>
                  <span className="text-base text-ink">{o.text}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-7">
          <p className="text-sm font-bold text-navy">How confident are you?</p>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-paper-200 p-1" role="radiogroup" aria-label="Confidence">
            {(["sure", "unsure"] as const).map((c) => {
              const on = confidence === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setConfidence(c)}
                  className={`rounded-lg py-2.5 text-sm font-bold transition ${
                    on ? (c === "sure" ? "bg-teal text-white shadow" : "bg-saffron text-white shadow") : "text-muted hover:text-navy"
                  }`}
                >
                  {c === "sure" ? "Sure" : "Unsure"}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-6 hidden text-xs text-muted sm:block">Shortcuts: 1–4 to choose · S / U for confidence · Enter for next</p>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-paper-300 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-xs text-muted sm:text-sm">
            {!selected ? "Choose an answer" : !confidence ? "Mark Sure or Unsure" : "Ready"}
          </p>
          <button
            type="button"
            onClick={next}
            disabled={!ready || finishing}
            className="rounded-xl bg-navy px-6 py-3 font-bold text-paper transition enabled:hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {finishing ? "Building report…" : idx + 1 === testQuestions.length ? "Finish & see report" : "Next question"}
          </button>
        </div>
      </div>
    </main>
  );
}
