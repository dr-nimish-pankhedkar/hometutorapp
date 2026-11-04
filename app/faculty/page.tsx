"use client";

import Link from "next/link";
import { useMemo } from "react";
import { statusColor } from "@/components/MasteryChart";
import { bank } from "@/lib/bank";
import { RosterTable, statusPill, summarise } from "@/components/FacultyRoster";
import { useRoster } from "@/lib/roster";
import { statusFor } from "@/lib/analysis";
import { faculty } from "@/lib/user";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-5 ring-1 ring-paper-300 sm:p-6 ${className}`}>{children}</section>;
}
function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-[0.16em] text-saffron-600 uppercase">{children}</p>;
}

export default function FacultyOverview() {
  const roster = useRoster();
  const rows = useMemo(() => roster?.map((e) => ({ e, s: summarise(e) })) ?? [], [roster]);

  if (!roster) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse space-y-4 px-4 py-8 sm:px-6">
        <div className="h-28 rounded-2xl bg-paper-200" />
        <div className="h-72 rounded-2xl bg-paper-200" />
      </main>
    );
  }

  // Batch heatmap: average of each student's latest mastery per topic
  const batchTopics = bank.topics.map((topic) => {
    const vals = rows.flatMap(({ s }) => s.latest.filter((t) => t.topic.id === topic.id).map((t) => t.mastery));
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { topic, avg, focusCount: vals.filter((v) => v < 50).length };
  });
  const priority = [...rows]
    .filter(({ s }) => s.focus && s.focus.status === "Focus area")
    .sort((a, b) => (a.s.focus?.mastery ?? 0) - (b.s.focus?.mastery ?? 0));
  const testsThisWeek = rows.reduce(
    (n, { e }) => n + e.items.filter((i) => Date.now() - new Date(i.attempt.completedAt).getTime() < 7 * 864e5).length,
    0,
  );
  const batchAvg = Math.round(rows.reduce((a, { s }) => a + (s.avgMastery ?? 0), 0) / rows.length);
  const hour = new Date().getHours();

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-paper sm:p-8">
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full border border-white/10" aria-hidden />
        <div className="absolute top-8 right-10 h-4 w-4 rounded-full bg-saffron" aria-hidden />
        <p className="text-sm text-paper/70">
          {faculty.subject} · {faculty.credential}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          {hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}, {faculty.fullName.split(" ").slice(0, 2).join(" ")}
        </h1>
        <p className="mt-2 max-w-2xl text-paper/80">
          {rows.length} students in your Chemistry batch · {testsThisWeek} {testsThisWeek === 1 ? "check" : "checks"} completed this week.
          {priority.length > 0 && ` ${priority.length} ${priority.length === 1 ? "student has" : "students have"} a focus area to plan for.`}
        </p>
      </section>

      <p className="rounded-xl border border-dashed border-saffron bg-saffron-100/60 px-4 py-2.5 text-sm text-navy">
        <span className="mr-2 rounded bg-saffron px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">Demo data</span>
        Aarav&apos;s results are the tests taken in this browser. The other students have generated demo results.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Students", value: rows.length, sub: "in this batch" },
          { label: "Batch mastery", value: `${batchAvg}%`, sub: "average across topics" },
          { label: "Checks this week", value: testsThisWeek, sub: "full and topic checks" },
          { label: "Focus areas", value: priority.length, sub: "students to plan for" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 ring-1 ring-paper-300">
            <p className="text-[11px] font-bold tracking-wide text-muted uppercase">{s.label}</p>
            <p className="font-display mt-1 text-3xl font-bold text-navy">{s.value}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Batch topic map */}
        <Panel>
          <Kicker>Batch</Kicker>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Topic map</h2>
          <p className="mt-1 mb-4 text-sm text-muted">Each student&apos;s latest mastery per topic.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-1 text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-muted">Student</th>
                  {bank.topics.map((t) => (
                    <th key={t.id} className="px-1 text-center text-[11px] leading-tight font-bold text-muted">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ e, s }) => (
                  <tr key={e.profile.id}>
                    <td className="pr-2 font-semibold whitespace-nowrap text-navy">
                      <Link href={`/faculty/students/${e.profile.id}`} className="hover:underline">
                        {e.profile.fullName}
                      </Link>
                    </td>
                    {bank.topics.map((t) => {
                      const r = s.latest.find((x) => x.topic.id === t.id);
                      return (
                        <td
                          key={t.id}
                          className="h-9 rounded-md text-center text-xs font-bold"
                          style={
                            r
                              ? { background: statusColor[r.status] + "26", color: statusColor[r.status] }
                              : { background: "#F7F4EC", color: "#8792A8" }
                          }
                          title={r ? `${r.mastery}% · ${r.status}` : "Not attempted"}
                        >
                          {r ? `${r.mastery}%` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="pt-1 text-xs font-bold text-muted">Batch average</td>
                  {batchTopics.map((b) => (
                    <td key={b.topic.id} className="pt-1 text-center text-xs font-bold" style={{ color: statusColor[statusFor(b.avg)] }}>
                      {b.avg}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Priorities */}
        <Panel className="border-l-4 border-saffron">
          <Kicker>This week</Kicker>
          <h2 className="mt-1 text-xl font-bold text-navy">Session priorities</h2>
          <p className="mt-1 text-sm text-muted">Each student&apos;s lowest topic right now.</p>
          <ul className="mt-4 space-y-3">
            {(priority.length ? priority : rows).slice(0, 5).map(({ e, s }) => (
              <li key={e.profile.id}>
                <Link href={`/faculty/students/${e.profile.id}`} className="group flex items-center gap-3">
                  <span className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-xs font-bold text-navy ring-1 ring-paper-300">
                    {e.profile.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-navy group-hover:underline">{e.profile.fullName}</span>
                    <span className="block truncate text-xs text-muted">
                      {s.focus ? `${s.focus.topic.name} · ${s.focus.mastery}%` : "No checks yet"}
                      {s.toRevisit > 0 && ` · ${s.toRevisit} to revisit`}
                    </span>
                  </span>
                  {s.focus && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${statusPill[s.focus.status]}`}>{s.focus.status}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Roster */}
      <Panel>
        <div className="flex items-end justify-between gap-3">
          <div>
            <Kicker>Students</Kicker>
            <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">Your batch</h2>
          </div>
          <Link href="/faculty/students" className="text-sm font-bold text-saffron-600 hover:underline">
            All students →
          </Link>
        </div>
        <RosterTable rows={rows} />
      </Panel>
    </main>
  );
}
