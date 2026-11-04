"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/Brand";
import { MasteryChart, statusColor } from "@/components/MasteryChart";
import { analyse, fmtTime } from "@/lib/analysis";
import { topicById } from "@/lib/bank";
import { sampleAttempt } from "@/lib/sample";
import { loadAttempt } from "@/lib/storage";
import { templateSummary, toSummaryInput } from "@/lib/summary";
import type { Attempt, ErrorType, TopicStatus } from "@/lib/types";

const statusPill: Record<TopicStatus, string> = {
  Strong: "bg-teal-100 text-teal",
  "On track": "bg-saffron-100 text-saffron-600",
  Focus: "bg-rose-100 text-rose",
};

const errorMeta: Record<ErrorType, { label: string; hint: string; cls: string }> = {
  "concept gap": { label: "Concept gap", hint: "Needs re-teaching", cls: "bg-rose-100 text-rose" },
  "calculation slip": { label: "Calculation slip", hint: "Needs careful practice", cls: "bg-saffron-100 text-saffron-600" },
  misread: { label: "Misread", hint: "Needs exam technique", cls: "bg-paper-200 text-navy" },
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`print-card rounded-2xl bg-white p-5 ring-1 ring-paper-300 sm:p-6 ${className}`}>{children}</section>;
}

function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-[11px] font-bold tracking-[0.16em] text-saffron-600 uppercase">{kicker}</p>}
      <h2 className="text-xl font-bold text-navy sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl bg-paper/70 p-3.5 ring-1 ring-paper-300">
      <p className="text-[11px] font-bold tracking-wide text-muted uppercase">{label}</p>
      <p className="font-display mt-1 text-2xl font-bold text-navy">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function ReportPage() {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  useEffect(() => {
    setAttempt(loadAttempt() ?? sampleAttempt);
  }, []);

  const report = useMemo(() => (attempt ? analyse(attempt) : null), [attempt]);
  const summaryInput = useMemo(() => (report ? toSummaryInput(report) : null), [report]);

  const [ai, setAi] = useState<{ text: string; source: "claude" | "template" } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  useEffect(() => {
    if (!summaryInput) return;
    const ctrl = new AbortController();
    setAi(null);
    setLoadingAi(true);
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryInput),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.summary && setAi({ text: d.summary, source: d.source }))
      .catch(() => {})
      .finally(() => setLoadingAi(false));
    return () => ctrl.abort();
  }, [summaryInput]);

  if (!report || !attempt || !summaryInput) {
    return (
      <main className="min-h-dvh bg-paper">
        <SiteHeader />
        <div className="mx-auto max-w-5xl animate-pulse space-y-4 px-4 sm:px-6">
          <div className="h-10 rounded-xl bg-paper-200" />
          <div className="h-48 rounded-2xl bg-paper-200" />
          <div className="h-72 rounded-2xl bg-paper-200" />
        </div>
      </main>
    );
  }

  const summary = ai?.text ?? templateSummary(summaryInput);
  const name = report.studentName || "Student";
  const dateStr = new Date(attempt.startedAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const totalErrors = report.wrong.length;

  return (
    <main className="min-h-dvh bg-paper print:bg-white">
      <SiteHeader
        right={
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-paper transition hover:bg-navy-700"
          >
            <span className="sm:hidden">Download PDF</span>
            <span className="hidden sm:inline">Download report as PDF</span>
          </button>
        }
      />

      <div className="mx-auto max-w-5xl space-y-5 px-4 pb-16 sm:px-6 print:space-y-3 print:px-0 print:pb-0">
        {/* Demo banner */}
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-saffron bg-saffron-100/60 px-4 py-3 text-sm text-navy sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="mr-2 rounded bg-saffron px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">
              Demo data
            </span>
            {attempt.isSample
              ? "You're viewing a sample student's report. Take the test to generate your own."
              : "Proof-of-concept report, computed in your browser. Nothing is stored."}
          </p>
          {attempt.isSample && (
            <Link href="/test" className="no-print shrink-0 font-bold text-saffron-600 underline underline-offset-4">
              Take the test →
            </Link>
          )}
        </div>

        {/* Header */}
        <Card>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] text-teal uppercase">
                Ekagra diagnostic report · Chemistry
              </p>
              <h1 className="mt-1.5 text-3xl font-bold text-navy sm:text-4xl">{name}</h1>
              <p className="mt-1 text-sm text-muted">
                Class 11–12 · JEE / NEET · {dateStr}
              </p>
            </div>
            <div className="flex items-end gap-2">
              <p className="font-display text-6xl leading-none font-bold text-navy">{report.score}</p>
              <p className="pb-1 text-lg text-muted">/ {report.total}</p>
              <span className="mb-1 ml-2 rounded-full bg-navy px-2.5 py-1 text-sm font-bold text-paper">
                {report.percent}%
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total time" value={fmtTime(report.totalTimeSec)} sub={`avg ${fmtTime(report.totalTimeSec / report.total)} / question`} />
            <Stat label="Misconceptions" value={report.misconceptions.length} sub="wrong but sure" />
            <Stat label="Lucky guesses" value={report.luckyGuesses.length} sub="right but unsure" />
            <Stat label="Speed flags" value={report.slowTopics.length} sub="topics slower than target" />
          </div>
        </Card>

        {/* Parent summary */}
        <section className="print-card rounded-2xl bg-navy p-5 text-paper sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold tracking-[0.16em] text-saffron uppercase">For parents</p>
            <span className="no-print text-[11px] text-paper/60">
              {loadingAi ? "Personalising…" : ai?.source === "claude" ? "Written with Claude AI" : "Auto-generated summary"}
            </span>
          </div>
          <p className={`font-display mt-3 text-[1.05rem] leading-relaxed sm:text-lg ${loadingAi ? "opacity-70" : ""}`}>
            {summary}
          </p>
        </section>

        {/* Mastery */}
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] print:grid-cols-[1.25fr_1fr]">
          <Card>
            <SectionTitle
              kicker="Mastery"
              title="Mastery by topic"
              sub="Weighted by difficulty (easy ×1, medium ×2, hard ×3). Dashed lines mark 50% and 75%."
            />
            <MasteryChart topics={report.topics} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
              {(Object.keys(statusColor) as TopicStatus[]).map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: statusColor[s] }} />
                  {s} {s === "Strong" ? "≥75%" : s === "On track" ? "50–74%" : "<50%"}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle kicker="Status" title="Topic breakdown" />
            <ul className="divide-y divide-paper-200">
              {report.topics.map((t) => (
                <li key={t.topic.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-bold text-navy">{t.topic.name}</p>
                    <p className="text-xs text-muted">
                      {t.correct}/{t.total} correct · avg {fmtTime(t.avgTimeSec)}
                      {t.slowCorrect.length > 0 && (
                        <span className="ml-1.5 inline-flex items-center gap-1 font-semibold text-saffron-600">
                          · <ClockIcon /> slow
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusPill[t.status]}`}>
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Focus */}
        <Card className="border-l-4 border-saffron">
          <SectionTitle
            kicker="Tutor plan"
            title="Focus for the next 2 weeks"
            sub="The two weakest topics, with the sub-concepts to cover first."
          />
          <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
            {report.focus.map((f, i) => (
              <div key={f.topic.id} className="rounded-xl bg-paper/70 p-4 ring-1 ring-paper-300">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-lg font-bold text-navy">
                    <span className="mr-2 text-saffron">Week {i + 1}</span>
                    {f.topic.name}
                  </p>
                  <span className="text-sm font-bold text-rose">{f.mastery}%</span>
                </div>
                <p className="text-xs text-muted">{f.topic.chapter}</p>
                <ol className="mt-3 space-y-2">
                  {f.subConcepts.map((c, j) => (
                    <li key={c} className="flex gap-2.5 text-sm text-ink">
                      <span className="font-display grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-paper">
                        {j + 1}
                      </span>
                      {c}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Card>

        {/* Speed + confidence */}
        <div className="grid gap-5 md:grid-cols-3 print:grid-cols-3">
          <Card>
            <SectionTitle kicker="Speed" title="Right, but slow" sub="Correct answers that took longer than the target time." />
            {report.slowTopics.length === 0 ? (
              <Empty text="Every correct answer was within exam pace." />
            ) : (
              <ul className="space-y-3">
                {report.slowTopics.flatMap((t) =>
                  t.slowCorrect.map(({ question, timeSec }) => (
                    <FlagItem
                      key={question.id}
                      topic={t.topic.name}
                      concept={question.concept}
                      meta={`${fmtTime(timeSec)} vs ${question.targetSec}s target`}
                    />
                  )),
                )}
              </ul>
            )}
          </Card>
          <Card>
            <SectionTitle kicker="Confidence" title="Lucky guesses" sub="Correct, but marked unsure — not yet secure." />
            {report.luckyGuesses.length === 0 ? (
              <Empty text="No lucky guesses — correct answers were confident." />
            ) : (
              <ul className="space-y-3">
                {report.luckyGuesses.map(({ question, timeSec }) => (
                  <FlagItem
                    key={question.id}
                    topic={topicById.get(question.topic)!.name}
                    concept={question.concept}
                    meta={fmtTime(timeSec)}
                  />
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <SectionTitle kicker="Confidence" title="Misconceptions" sub="Wrong, but marked sure — tackle these first." />
            {report.misconceptions.length === 0 ? (
              <Empty text="No confident wrong answers." />
            ) : (
              <ul className="space-y-3">
                {report.misconceptions.map((w) => (
                  <FlagItem
                    key={w.question.id}
                    topic={topicById.get(w.question.topic)!.name}
                    concept={w.question.concept}
                    meta={errorMeta[w.chosen.errorType ?? "concept gap"].label}
                    tone="rose"
                  />
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Error analysis */}
        <Card>
          <SectionTitle
            kicker="Error analysis"
            title="Why each answer went wrong"
            sub="Every wrong option in the question bank is pre-labelled with the mistake it reveals."
          />
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(errorMeta) as ErrorType[]).map((k) => {
              const n = report.errorCounts[k];
              return (
                <div key={k} className="rounded-xl bg-paper/70 p-3.5 ring-1 ring-paper-300">
                  <p className="font-display text-2xl font-bold text-navy">{n}</p>
                  <p className="text-sm font-bold text-navy">{errorMeta[k].label}</p>
                  <p className="hidden text-xs text-muted sm:block">{errorMeta[k].hint}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-paper-200">
                    <div
                      className="h-1.5 rounded-full bg-navy"
                      style={{ width: `${totalErrors ? (n / totalErrors) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {report.wrong.length === 0 ? (
            <div className="mt-5">
              <Empty text="A perfect score — no wrong answers to analyse." />
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {report.wrong.map((w) => {
                const meta = errorMeta[w.chosen.errorType ?? "concept gap"];
                return (
                  <li key={w.question.id} className="print-card rounded-xl p-4 ring-1 ring-paper-300">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.cls}`}>{meta.label}</span>
                      <span className="text-xs font-semibold text-muted">
                        {topicById.get(w.question.topic)!.name} · {w.question.concept}
                      </span>
                      {w.confidence === "sure" && (
                        <span className="rounded-full bg-rose px-2 py-0.5 text-[11px] font-bold text-white">Marked sure</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-navy">{w.question.text}</p>
                    <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                      <p>
                        <span className="text-muted">Chose: </span>
                        <span className="font-semibold text-rose line-through decoration-rose/40">{w.chosen.text}</span>
                      </p>
                      <p>
                        <span className="text-muted">Correct: </span>
                        <span className="font-semibold text-teal">{w.correct.text}</span>
                      </p>
                    </div>
                    {w.chosen.why && <p className="mt-2 text-sm text-ink">{w.chosen.why}</p>}
                    <p className="mt-1 text-xs text-muted">{w.question.explanation}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="no-print flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
          <Link href="/" className="rounded-xl px-5 py-3 text-center font-bold text-navy ring-1 ring-navy/20 hover:ring-navy">
            ← Back to home
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/test" className="rounded-xl bg-white px-5 py-3 text-center font-bold text-navy ring-1 ring-paper-300 hover:ring-navy">
              Retake test
            </Link>
            <button onClick={() => window.print()} className="rounded-xl bg-saffron px-5 py-3 font-bold text-white hover:bg-saffron-600">
              Download report as PDF
            </button>
          </div>
        </div>

        <p className="hidden pt-4 text-center text-xs text-muted print:block">
          Ekagra · AI-enabled home tuition for JEE &amp; NEET · Demo report
        </p>
      </div>
    </main>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function FlagItem({ topic, concept, meta, tone }: { topic: string; concept: string; meta: string; tone?: "rose" }) {
  return (
    <li className="border-l-2 border-paper-300 pl-3">
      <p className="text-sm font-bold text-navy">{concept}</p>
      <p className="text-xs text-muted">
        {topic} · <span className={tone === "rose" ? "font-semibold text-rose" : "font-semibold text-saffron-600"}>{meta}</span>
      </p>
    </li>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl bg-teal-100/60 px-3 py-2.5 text-sm text-teal">{text}</p>;
}
