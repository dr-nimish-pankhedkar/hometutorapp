"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { statusColor } from "@/components/MasteryChart";
import { fmtTime } from "@/lib/analysis";
import { analysed, fmtDate } from "@/lib/progress";
import { resetAttempts, useAttempts } from "@/lib/storage";

export default function ResultsPage() {
  const attempts = useAttempts();
  const items = useMemo(() => analysed(attempts ?? []), [attempts]);
  const [confirming, setConfirming] = useState(false);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        kicker="Results"
        title="Your results"
        sub="Every test you've taken, newest first. Open one for the full report."
        action={
          <Link href="/tests" className="rounded-xl bg-navy px-5 py-3 text-center font-bold text-paper hover:bg-navy-700">
            Take a test
          </Link>
        }
      />

      {!attempts ? (
        <div className="h-64 animate-pulse rounded-2xl bg-paper-200" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-paper-300">
          <p className="font-display text-xl font-bold text-navy">No results yet</p>
          <p className="mt-1 text-muted">Take the progress check to see your strengths and your 2-week plan.</p>
          <Link href="/tests/full" className="mt-5 inline-block rounded-xl bg-saffron px-5 py-3 font-bold text-white hover:bg-saffron-600">
            Start the progress check
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map(({ attempt, report }) => (
            <li key={attempt.id}>
              <Link
                href={`/results/${attempt.id}`}
                className="group block rounded-2xl bg-white p-4 ring-1 ring-paper-300 transition hover:ring-navy/30 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="font-display grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-navy text-xl font-bold text-paper">
                    {report.percent}
                    <span className="-mt-1.5 text-[10px] text-paper/70">%</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-navy group-hover:underline">{report.testTitle}</p>
                      <span className="rounded bg-paper-200 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted uppercase">
                        {report.testId === "full" ? "Full check" : "Topic check"}
                      </span>
                      {attempt.isSample && (
                        <span className="rounded bg-saffron-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-saffron-600 uppercase">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {fmtDate(attempt.completedAt, true)} · {report.score}/{report.total} correct · {fmtTime(report.totalTimeSec)}
                    </p>
                    {/* Mini topic bars */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {report.topics.map((t) => (
                        <div key={t.topic.id} className="w-[120px]">
                          <div className="flex justify-between text-[11px]">
                            <span className="truncate text-muted">{t.topic.name}</span>
                            <span className="font-bold text-navy">{t.mastery}%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-paper-200">
                            <div className="h-1.5 rounded-full" style={{ width: `${t.mastery}%`, background: statusColor[t.status] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="hidden self-center text-muted group-hover:text-navy sm:block" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {attempts && attempts.length > 0 && (
        <div className="flex flex-col items-start gap-2 border-t border-paper-300 pt-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Results are saved in this browser only (demo — no database).</p>
          {confirming ? (
            <span className="flex items-center gap-3">
              <span className="text-navy">Clear all results and restore the demo history?</span>
              <button
                onClick={() => {
                  resetAttempts();
                  setConfirming(false);
                }}
                className="font-bold text-rose underline underline-offset-4"
              >
                Yes, reset
              </button>
              <button onClick={() => setConfirming(false)} className="font-bold text-navy">
                Cancel
              </button>
            </span>
          ) : (
            <button onClick={() => setConfirming(true)} className="font-bold text-navy underline underline-offset-4">
              Reset demo data
            </button>
          )}
        </div>
      )}
    </main>
  );
}
