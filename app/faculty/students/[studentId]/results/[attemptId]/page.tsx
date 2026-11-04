"use client";

import { useParams } from "next/navigation";
import { ReportLoading, ReportMissing, ReportView } from "@/components/ReportView";
import { useRoster } from "@/lib/roster";

export default function FacultyReportPage() {
  const { studentId, attemptId } = useParams<{ studentId: string; attemptId: string }>();
  const roster = useRoster();
  if (!roster) return <ReportLoading />;
  const entry = roster.find((e) => e.profile.id === studentId);
  const item = entry?.items.find((i) => i.attempt.id === attemptId);
  if (!entry || !item) return <ReportMissing href="/faculty/students" label="Back to students" />;
  return (
    <ReportView
      attempt={item.attempt}
      profile={entry.profile}
      viewer="faculty"
      backHref={`/faculty/students/${entry.profile.id}`}
      backLabel={entry.profile.fullName}
    />
  );
}
