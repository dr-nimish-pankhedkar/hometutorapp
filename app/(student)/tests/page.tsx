"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/AppShell";
import { analysed, fmtDate } from "@/lib/progress";
import { useAttempts } from "@/lib/storage";
import { tests, type TestDef } from "@/lib/tests";
import type { Difficulty, Report, TopicStatus } from "@/lib/types";

const statusPill: Record<TopicStatus, string> = {
  Strong: "bg-teal-100 text-teal",
  "On track": "bg-saffron-100 text-saffron-600",
  "Focus area": "bg-rose-100 text-rose",
};
const dot: Record<Difficulty, string> = { easy: "bg-teal", medium: "bg-saffron", hard: "bg-rose" };

function DifficultyDots({ test }: { test: TestDef }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Difficulty mix">
      {test.questions.map((q) => (
        <span key={q.id} title={q.difficulty} className={`h-1.5 w-1.5 rounded-full ${dot[q.difficulty]}`} />
      ))}
    </span>
  );
}

function LastResult({ last }: { last?: { report: Report; completedAt: string } }) {
  if (!last) return <span className="text-xs font-semibold text-muted">Not taken yet</span>;
  const status = last.report.topics.length === 1 ? last.report.topics[0].status : null;
  return (
    <span className="flex items-center gap-2 text-xs text-muted">
      Last:{" "}
      <span className="font-bold text-navy">
        {status ? `${last.report.score}/${last.report.total}` : `${last.report.percent}%`}
      </span>{" "}
      · {fmtDate(last.completedAt)}
      {status && <span className={`rounded-full px-2 py-0.5 font-bold ${statusPill[status]}`}>{status}</span>}
    </span>
  );
}

const locked = [
  { name: "Physics", lead: "Vijay Shukla" },
  { name: "Maths", lead: "Ankit Jain" },
  { name: "Biology", lead: "Dr. Harshal Thakur" },
];

export default function TestsPage() {
  const attempts = useAttempts();
  const lastByTest = useMemo(() => {
    const m = new Map<string, { report: Report; completedAt: string }>();
    for (const { attempt, report } of analysed(attempts ?? [])) {
      if (!m.has(attempt.testId)) m.set(attempt.testId, { report, completedAt: attempt.completedAt });
    }
    return m;
  }, [attempts]);

  const [full, ...topics] = tests;
  const fullLast = lastByTest.get(full.id);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader kicker="Test library" title="Choose a test" sub="Pick the full progress check or a quick check on one topic." />

      {/* Full check */}
      <section className="flex flex-col gap-5 rounded-2xl border-2 border-saffron bg-white p-5 shadow-[0_10px_30px_-18px_rgba(224,137,43,0.8)] sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="rounded-full bg-saffron px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
            Recommended monthly
          </span>
          <h2 className="mt-3 text-2xl font-bold text-navy">{full.title}</h2>
          <p className="mt-1 text-muted">
            {full.questions.length} questions · all 5 topics · ~{full.minutes} min · builds your 2-week plan
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <DifficultyDots test={full} />
            {attempts && <LastResult last={fullLast} />}
          </div>
        </div>
        <Link
          href={`/tests/${full.id}`}
          className="shrink-0 rounded-xl bg-navy px-6 py-3.5 text-center font-bold text-paper transition hover:bg-navy-700"
        >
          {fullLast ? "Take it again" : "Start progress check"}
        </Link>
      </section>

      {/* Topic checks */}
      <section>
        <h2 className="text-xl font-bold text-navy">Quick topic checks</h2>
        <p className="mt-1 text-sm text-muted">3 questions each, easy → hard. Great after a tutoring session.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => {
            const last = lastByTest.get(t.id);
            return (
              <div key={t.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-paper-300 transition hover:ring-navy/30">
                <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase">Chemistry</p>
                <h3 className="mt-1 text-lg font-bold text-navy">{t.title}</h3>
                <p className="text-xs text-muted">{t.subtitle}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                  <span>
                    {t.questions.length} questions · ~{t.minutes} min
                  </span>
                  <DifficultyDots test={t} />
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  {attempts ? <LastResult last={last} /> : <span />}
                  <Link
                    href={`/tests/${t.id}`}
                    className="shrink-0 rounded-lg bg-paper px-4 py-2 text-sm font-bold text-navy ring-1 ring-paper-300 transition hover:bg-navy hover:text-paper"
                  >
                    {last ? "Retake" : "Start"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Other subjects */}
      <section>
        <h2 className="text-xl font-bold text-navy">Other subjects</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {locked.map((s) => (
            <div key={s.name} className="rounded-2xl border border-paper-300 bg-paper/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-navy/50">{s.name}</h3>
                <span className="rounded-full bg-paper-200 px-2.5 py-1 text-[11px] font-bold tracking-wide text-muted uppercase">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Led by {s.lead}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
