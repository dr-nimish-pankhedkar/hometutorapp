"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MasteryChart, statusColor } from "@/components/MasteryChart";
import { ScoreTrend } from "@/components/ScoreTrend";
import { analysed, fmtDate, latestTopicResults, recommendedTopic } from "@/lib/progress";
import { useAttempts } from "@/lib/storage";
import { getTest } from "@/lib/tests";
import type { TopicStatus } from "@/lib/types";
import { student } from "@/lib/user";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const statusPill: Record<TopicStatus, string> = {
  Strong: "bg-teal-100 text-teal",
  "On track": "bg-saffron-100 text-saffron-600",
  "Focus area": "bg-rose-100 text-rose",
};

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-5 ring-1 ring-paper-300 sm:p-6 ${className}`}>{children}</section>;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-[0.16em] text-saffron-600 uppercase">{children}</p>;
}

export default function Dashboard() {
  const attempts = useAttempts();
  const items = useMemo(() => (attempts ? analysed(attempts) : []), [attempts]);

  if (!attempts) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse space-y-4 px-4 py-8 sm:px-6">
        <div className="h-24 rounded-2xl bg-paper-200" />
        <div className="grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-paper-200" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-paper-200" />
      </main>
    );
  }

  const latest = latestTopicResults(items);
  const rec = recommendedTopic(items);
  const recTest = getTest(rec.topic.id)!;
  const totalQs = items.reduce((s, i) => s + i.report.total, 0);
  const totalCorrect = items.reduce((s, i) => s + i.report.score, 0);
  const avg = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;
  const strong = latest.filter((t) => t.status === "Strong");
  const trend = [...items].reverse().map((i) => ({
    label: i.report.testTitle,
    date: fmtDate(i.attempt.completedAt),
    percent: i.report.percent,
  }));
  const hasDemo = attempts.some((a) => a.isSample);

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-paper sm:p-8">
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full border border-white/10" aria-hidden />
        <div className="absolute top-8 right-10 h-4 w-4 rounded-full bg-saffron" aria-hidden />
        <p className="text-sm text-paper/70">
          {student.grade} · {student.target} · Tutor: {student.tutor}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          {greeting()}, {student.firstName}
        </h1>
        <p className="mt-2 max-w-xl text-paper/80">
          {items.length
            ? strong.length
              ? `${strong.map((s) => s.topic.name).join(" and ")} ${strong.length > 1 ? "are" : "is"} looking strong. Next up: ${rec.topic.name}.`
              : `You've completed ${items.length} ${items.length === 1 ? "check" : "checks"}. Next up: ${rec.topic.name}.`
            : "Start with the full progress check — it takes about 15 minutes and shapes your tutor's plan."}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/tests/${items.length ? recTest.id : "full"}`}
            className="rounded-xl bg-saffron px-5 py-3 text-center font-bold text-white transition hover:bg-saffron-600"
          >
            {items.length ? `Start ${rec.topic.name} check` : "Start the progress check"}
          </Link>
          <Link href="/tests" className="rounded-xl px-5 py-3 text-center font-bold text-paper ring-1 ring-white/25 transition hover:ring-white/60">
            Browse all tests
          </Link>
        </div>
      </section>

      {hasDemo && (
        <p className="rounded-xl border border-dashed border-saffron bg-saffron-100/60 px-4 py-2.5 text-sm text-navy">
          <span className="mr-2 rounded bg-saffron px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">Demo data</span>
          Two earlier results are pre-loaded so the dashboard has history. Your own tests are added alongside them.
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Tests taken", value: items.length, sub: "on this device" },
          { label: "Average score", value: `${avg}%`, sub: `${totalCorrect} of ${totalQs} correct` },
          { label: "Strong topics", value: `${strong.length}/${latest.length || 5}`, sub: "75% and above" },
          {
            label: "Latest result",
            value: items[0] ? `${items[0].report.percent}%` : "—",
            sub: items[0] ? `${items[0].report.testTitle} · ${fmtDate(items[0].attempt.completedAt)}` : "No tests yet",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 ring-1 ring-paper-300">
            <p className="text-[11px] font-bold tracking-wide text-muted uppercase">{s.label}</p>
            <p className="font-display mt-1 text-3xl font-bold text-navy">{s.value}</p>
            <p className="truncate text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <Kicker>Chemistry</Kicker>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Where you are now</h2>
          <p className="mt-1 mb-4 text-sm text-muted">Mastery from your most recent check in each topic.</p>
          {latest.length ? (
            <>
              <MasteryChart topics={latest} />
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                {(Object.keys(statusColor) as TopicStatus[]).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: statusColor[s] }} />
                    {s}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-xl bg-paper px-4 py-10 text-center text-sm text-muted">Your topic map appears after your first test.</p>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel className="border-l-4 border-saffron">
            <Kicker>Recommended next</Kicker>
            <h2 className="mt-1 text-xl font-bold text-navy">{rec.topic.name}</h2>
            <p className="text-xs text-muted">{rec.topic.chapter}</p>
            <p className="mt-3 text-sm text-ink">{rec.reason}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-muted">
                {recTest.questions.length} questions · ~{recTest.minutes} min
              </span>
              <Link href={`/tests/${recTest.id}`} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-paper hover:bg-navy-700">
                Start
              </Link>
            </div>
          </Panel>

          <Panel>
            <Kicker>Progress</Kicker>
            <h2 className="mt-1 text-xl font-bold text-navy">Score trend</h2>
            {trend.length > 1 ? (
              <div className="mt-3">
                <ScoreTrend data={trend} />
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-paper px-4 py-8 text-center text-sm text-muted">
                Take two or more tests to see your trend.
              </p>
            )}
          </Panel>
        </div>
      </div>

      {/* Recent results */}
      <Panel>
        <div className="flex items-end justify-between gap-3">
          <div>
            <Kicker>Results</Kicker>
            <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Recent results</h2>
          </div>
          <Link href="/results" className="text-sm font-bold text-saffron-600 hover:underline">
            View all →
          </Link>
        </div>
        {items.length ? (
          <ul className="mt-4 divide-y divide-paper-200">
            {items.slice(0, 4).map(({ attempt, report }) => {
              const top = [...report.topics].sort((a, b) => b.mastery - a.mastery)[0];
              return (
                <li key={attempt.id}>
                  <Link href={`/results/${attempt.id}`} className="group flex items-center gap-4 py-3.5">
                    <span className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-paper text-lg font-bold text-navy ring-1 ring-paper-300">
                      {report.percent}
                      <span className="-mt-1 text-[10px]">%</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-navy group-hover:underline">
                        {report.testTitle}
                        {attempt.isSample && (
                          <span className="ml-2 rounded bg-paper-200 px-1.5 py-0.5 align-middle text-[10px] font-bold tracking-wide text-muted uppercase">
                            Demo
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {fmtDate(attempt.completedAt, true)} · {report.score}/{report.total} correct
                      </p>
                    </div>
                    {top && (
                      <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold sm:inline ${statusPill[top.status]}`}>
                        Best: {top.topic.name}
                      </span>
                    )}
                    <span className="text-muted group-hover:text-navy" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-paper px-4 py-8 text-center text-sm text-muted">No results yet — your first report will appear here.</p>
        )}
      </Panel>
    </main>
  );
}
