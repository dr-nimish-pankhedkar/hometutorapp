"use client";

import Link from "next/link";
import { fmtDate, latestTopicResults } from "@/lib/progress";
import type { RosterEntry } from "@/lib/roster";
import type { TopicStatus } from "@/lib/types";

export const statusPill: Record<TopicStatus, string> = {
  Strong: "bg-teal-100 text-teal",
  "On track": "bg-saffron-100 text-saffron-600",
  "Focus area": "bg-rose-100 text-rose",
};

export function summarise(e: RosterEntry) {
  const latest = latestTopicResults(e.items);
  const focus = [...latest].sort((a, b) => a.mastery - b.mastery)[0];
  const strongest = [...latest].sort((a, b) => b.mastery - a.mastery)[0];
  const last = e.items[0];
  const lastFull = e.items.find((i) => i.report.testId === "full");
  const prevFull = e.items.filter((i) => i.report.testId === "full")[1];
  const avgMastery = latest.length ? Math.round(latest.reduce((s, t) => s + t.mastery, 0) / latest.length) : null;
  const toRevisit = lastFull?.report.revisitConcepts.length ?? 0;
  return {
    latest,
    focus,
    strongest,
    last,
    avgMastery,
    toRevisit,
    change: lastFull && prevFull ? lastFull.report.percent - prevFull.report.percent : null,
  };
}

export function RosterTable({ rows }: { rows: { e: RosterEntry; s: ReturnType<typeof summarise> }[] }) {
  return (
    <ul className="mt-4 divide-y divide-paper-200">
      {rows.map(({ e, s }) => (
        <li key={e.profile.id}>
          <Link href={`/faculty/students/${e.profile.id}`} className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
            <span className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-full bg-saffron text-sm font-bold text-white">
              {e.profile.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-navy group-hover:underline">
                {e.profile.fullName}
                {e.live && (
                  <span className="ml-2 rounded bg-teal-100 px-1.5 py-0.5 align-middle text-[10px] font-bold tracking-wide text-teal uppercase">
                    Live
                  </span>
                )}
              </span>
              <span className="block text-xs text-muted">
                {e.profile.grade} · {e.profile.target}
              </span>
            </span>
            <span className="w-28 text-xs text-muted">
              <span className="block font-bold text-navy">{s.avgMastery ?? "—"}{s.avgMastery !== null && "%"}</span>
              avg mastery
            </span>
            <span className="w-24 text-xs text-muted">
              <span className={`block font-bold ${s.change === null ? "text-navy" : s.change >= 0 ? "text-teal" : "text-saffron-600"}`}>
                {s.change === null ? "—" : `${s.change > 0 ? "+" : ""}${s.change} pts`}
              </span>
              since last full
            </span>
            <span className="w-36 text-xs text-muted">
              <span className="block truncate font-bold text-navy">{s.strongest ? s.strongest.topic.name : "—"}</span>
              strongest
            </span>
            <span className="w-28 text-xs text-muted">
              <span className="block font-bold text-navy">{s.last ? fmtDate(s.last.attempt.completedAt) : "—"}</span>
              last check
            </span>
            <span className="text-muted group-hover:text-navy" aria-hidden>
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
