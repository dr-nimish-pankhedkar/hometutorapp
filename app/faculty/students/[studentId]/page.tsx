"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { statusPill, summarise } from "@/components/FacultyRoster";
import { MasteryChart } from "@/components/MasteryChart";
import { ScoreTrend } from "@/components/ScoreTrend";
import { fmtTime } from "@/lib/analysis";
import { topicById } from "@/lib/bank";
import { fmtDate } from "@/lib/progress";
import { useRoster } from "@/lib/roster";
import { ERROR_LABEL } from "@/lib/types";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-5 ring-1 ring-paper-300 sm:p-6 ${className}`}>{children}</section>;
}
function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-[0.16em] text-saffron-600 uppercase">{children}</p>;
}

export default function FacultyStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const roster = useRoster();

  if (!roster) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse space-y-4 px-4 py-8 sm:px-6">
        <div className="h-28 rounded-2xl bg-paper-200" />
        <div className="h-72 rounded-2xl bg-paper-200" />
      </main>
    );
  }
  const entry = roster.find((e) => e.profile.id === studentId);
  if (!entry) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-navy">Student not found</h1>
        <Link href="/faculty/students" className="mt-4 inline-block font-bold text-saffron-600 underline underline-offset-4">
          Back to students
        </Link>
      </main>
    );
  }

  const { profile, items, live } = entry;
  const s = summarise(entry);
  const lastFull = items.find((i) => i.report.testId === "full");
  const trend = [...items].reverse().map((i) => ({
    label: i.report.testTitle,
    date: fmtDate(i.attempt.completedAt),
    percent: i.report.percent,
  }));
  const base = `/faculty/students/${profile.id}`;

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/faculty/students" className="text-sm font-semibold text-muted hover:text-navy">
        ← All students
      </Link>

      {/* Profile header */}
      <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 ring-1 ring-paper-300 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display grid h-16 w-16 shrink-0 place-items-center rounded-full bg-saffron text-xl font-bold text-white">
            {profile.initials}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">
              {profile.fullName}
              <span
                className={`ml-2 rounded px-1.5 py-0.5 align-middle text-[10px] font-bold tracking-wide uppercase ${live ? "bg-teal-100 text-teal" : "bg-paper-200 text-muted"}`}
              >
                {live ? "Live" : "Demo"}
              </span>
            </h1>
            <p className="text-sm text-muted">
              {profile.grade} · {profile.target} · {profile.city}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Checks", value: items.length },
            { label: "Avg mastery", value: s.avgMastery === null ? "—" : `${s.avgMastery}%` },
            { label: "Since last full", value: s.change === null ? "—" : `${s.change > 0 ? "+" : ""}${s.change}` },
          ].map((x) => (
            <div key={x.label} className="rounded-xl bg-paper/70 px-4 py-2.5 ring-1 ring-paper-300">
              <p className="font-display text-xl font-bold text-navy">{x.value}</p>
              <p className="text-[11px] font-bold tracking-wide text-muted uppercase">{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      {items.length === 0 ? (
        <Panel>
          <p className="py-8 text-center text-muted">{profile.firstName} hasn&apos;t taken a check yet.</p>
        </Panel>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Panel>
              <Kicker>Mastery</Kicker>
              <h2 className="text-xl font-bold text-navy">Where {profile.firstName} is now</h2>
              <p className="mt-1 mb-4 text-sm text-muted">Latest check in each topic.</p>
              <MasteryChart topics={s.latest} />
            </Panel>
            <Panel>
              <Kicker>Progress</Kicker>
              <h2 className="text-xl font-bold text-navy">Score trend</h2>
              {trend.length > 1 ? (
                <div className="mt-3">
                  <ScoreTrend data={trend} />
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-paper px-4 py-8 text-center text-sm text-muted">One check so far.</p>
              )}
            </Panel>
          </div>

          {lastFull && (
            <div className="grid gap-5 md:grid-cols-2">
              <Panel className="border-l-4 border-saffron">
                <Kicker>Session plan</Kicker>
                <h2 className="text-xl font-bold text-navy">Next 2 weeks</h2>
                <p className="mt-1 text-sm text-muted">From the full check on {fmtDate(lastFull.attempt.completedAt)}.</p>
                <div className="mt-4 space-y-4">
                  {lastFull.report.focus.map((f, i) => (
                    <div key={f.topic.id}>
                      <p className="font-bold text-navy">
                        <span className="mr-2 text-saffron">Week {i + 1}</span>
                        {f.topic.name} <span className="text-sm font-semibold text-muted">· {f.mastery}%</span>
                      </p>
                      <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-sm text-ink">
                        {f.subConcepts.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel>
                <Kicker>Start here</Kicker>
                <h2 className="text-xl font-bold text-navy">Concepts to revisit first</h2>
                <p className="mt-1 text-sm text-muted">Answered with confidence, but worth a second look.</p>
                {lastFull.report.revisitConcepts.length ? (
                  <ul className="mt-4 space-y-3">
                    {lastFull.report.revisitConcepts.map((w) => (
                      <li key={w.question.id} className="border-l-2 border-paper-300 pl-3">
                        <p className="text-sm font-bold text-navy">{w.question.concept}</p>
                        <p className="text-xs text-muted">
                          {topicById.get(w.question.topic)!.name} ·{" "}
                          <span className="font-semibold text-rose">{ERROR_LABEL[w.chosen.errorType ?? "concept gap"]}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl bg-teal-100/60 px-3 py-2.5 text-sm text-teal">Confidence matched the answers — nothing to revisit.</p>
                )}
              </Panel>
            </div>
          )}

          <Panel>
            <Kicker>Reports</Kicker>
            <h2 className="text-xl font-bold text-navy">All checks</h2>
            <ul className="mt-3 divide-y divide-paper-200">
              {items.map(({ attempt, report }) => {
                const top = [...report.topics].sort((a, b) => a.mastery - b.mastery)[0];
                return (
                  <li key={attempt.id}>
                    <Link href={`${base}/results/${attempt.id}`} className="group flex items-center gap-4 py-3.5">
                      <span className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-lg font-bold text-paper">
                        {report.percent}
                        <span className="-mt-1 text-[10px] text-paper/70">%</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-navy group-hover:underline">{report.testTitle}</span>
                        <span className="block text-xs text-muted">
                          {fmtDate(attempt.completedAt, true)} · {report.score}/{report.total} correct · {fmtTime(report.totalTimeSec)}
                        </span>
                      </span>
                      {top && (
                        <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold sm:inline ${statusPill[top.status]}`}>
                          Focus: {top.topic.name}
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
          </Panel>
        </>
      )}
    </main>
  );
}
