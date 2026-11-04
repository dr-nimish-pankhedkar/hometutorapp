"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/AppShell";
import { RosterTable, summarise } from "@/components/FacultyRoster";
import { useRoster } from "@/lib/roster";

export default function FacultyStudents() {
  const roster = useRoster();
  const rows = useMemo(() => roster?.map((e) => ({ e, s: summarise(e) })) ?? null, [roster]);
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader kicker="Chemistry batch" title="Students" sub="Open a student to see their progress, plan and every report." />
      {rows ? (
        <section className="rounded-2xl bg-white px-5 ring-1 ring-paper-300 sm:px-6">
          <RosterTable rows={rows} />
        </section>
      ) : (
        <div className="h-72 animate-pulse rounded-2xl bg-paper-200" />
      )}
    </main>
  );
}
