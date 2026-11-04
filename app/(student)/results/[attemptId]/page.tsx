"use client";

import { useParams } from "next/navigation";
import { ReportLoading, ReportMissing, ReportView } from "@/components/ReportView";
import { useAttempts } from "@/lib/storage";
import { student } from "@/lib/user";

export default function StudentReportPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const attempts = useAttempts();
  if (!attempts) return <ReportLoading />;
  const attempt = attempts.find((a) => a.id === attemptId);
  if (!attempt) return <ReportMissing href="/results" label="See all results" />;
  return <ReportView attempt={attempt} profile={student} viewer="student" backHref="/results" backLabel="All results" />;
}
