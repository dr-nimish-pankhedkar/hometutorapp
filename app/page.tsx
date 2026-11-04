import Link from "next/link";
import { Logo, SiteHeader } from "@/components/Brand";

const subjects = [
  {
    name: "Physics",
    blurb: "Mechanics, electrostatics, optics, modern physics",
    active: false,
    glyph: (
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" strokeLinecap="round" />
    ),
  },
  {
    name: "Chemistry",
    blurb: "Physical, organic & inorganic — 15-question progress check",
    active: true,
    glyph: (
      <>
        <path d="M9 3h6M10 3v6.2L4.6 18.4A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V3" strokeLinejoin="round" />
        <path d="M7.3 15h9.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Maths",
    blurb: "Calculus, algebra, coordinate geometry, vectors",
    active: false,
    glyph: <path d="M4 7h7M7.5 3.5v7M14 5l5 5M19 5l-5 5M4 17h7M14 15.5h5M14 18.5h5" strokeLinecap="round" />,
  },
  {
    name: "Biology",
    blurb: "Genetics, human physiology, plant biology (NEET)",
    active: false,
    glyph: (
      <path
        d="M7 3c0 4 10 5 10 9s-10 5-10 9M17 3c0 4-10 5-10 9s10 5 10 9M8.5 6.5h7M8.5 17.5h7"
        strokeLinecap="round"
      />
    ),
  },
];

const team = [
  { subject: "Physics", name: "Vijay Shukla", cred: "IIT Bombay", initials: "VS" },
  { subject: "Chemistry", name: "Dr. Nimish Pankhedkar", cred: "PhD, IIT Bombay", initials: "NP" },
  { subject: "Maths", name: "Ankit Jain", cred: "NIT Rourkela", initials: "AJ" },
  { subject: "Biology", name: "Dr. Harshal Thakur", cred: "Biology faculty", initials: "HT" },
];

const steps = [
  {
    n: "01",
    title: "Analyse",
    body: "A 15-minute progress check records each answer, the time taken and how sure the student felt.",
  },
  {
    n: "02",
    title: "Pinpoint",
    body: "Every answer choice is mapped to what it tells us — a concept to revisit, a calculation slip, or a cue to read the question again.",
  },
  {
    n: "03",
    title: "Target",
    body: "Your tutor gets a two-week plan that builds on strengths, so every home-tuition hour moves the score forward.",
  },
];

function PreviewCard() {
  const rows = [
    { t: "Mole concept", v: 17, c: "bg-rose" },
    { t: "Atomic structure", v: 100, c: "bg-teal" },
    { t: "Thermodynamics", v: 50, c: "bg-saffron" },
    { t: "Chemical equilibrium", v: 17, c: "bg-rose" },
    { t: "GOC", v: 100, c: "bg-teal" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-3 -z-10 rotate-2 rounded-3xl bg-saffron-100" aria-hidden />
      <div className="rounded-2xl border border-paper-300 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(22,35,63,0.35)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Progress report</p>
            <p className="font-display mt-1 text-lg font-bold text-navy">Aarav · Chemistry</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-navy">
              10<span className="text-base text-muted">/15</span>
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {rows.map((r) => (
            <div key={r.t}>
              <div className="flex justify-between text-[13px]">
                <span className="text-ink">{r.t}</span>
                <span className="font-semibold text-navy">{r.v}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-paper-200">
                <div className={`h-2 rounded-full ${r.c}`} style={{ width: `${r.v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose">3 concepts to revisit</span>
          <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-saffron-600">2 to confirm</span>
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal">Next: Equilibrium · Mole</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="paper-grain">
      <SiteHeader
        right={
          <Link
            href="/report"
            className="text-sm font-semibold text-navy underline decoration-saffron decoration-2 underline-offset-4 hover:text-saffron-600"
          >
            See a sample report
          </Link>
        }
      />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-6 pb-16 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-14 md:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-paper-300 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> AI-enabled home tuition · JEE &amp; NEET
          </p>
          <h1 className="mt-5 text-[2.35rem] leading-[1.08] font-bold text-navy sm:text-5xl lg:text-[3.6rem]">
            Every student understood.
            <br />
            <span className="text-saffron">Every hour well spent.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            AI-enabled home tuition for Physics, Chemistry, Maths and Biology — taught by IIT, NIT and medical
            specialists.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-base font-bold text-paper shadow-lg shadow-navy/20 transition hover:bg-navy-700"
            >
              Take a progress check
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-sm text-muted">15 questions · ~15 minutes · no sign-up</span>
          </div>
        </div>
        <PreviewCard />
      </section>

      {/* Subjects */}
      <section className="border-y border-paper-300 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rule w-full max-w-[220px]" />
          <h2 className="mt-4 text-3xl font-bold text-navy">Four subjects. One method.</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Chemistry is live for this preview. Physics, Maths and Biology progress checks follow the same approach.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((s) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${s.active ? "bg-saffron text-white" : "bg-paper-200 text-navy-300"}`}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        {s.glyph}
                      </svg>
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${s.active ? "bg-teal-100 text-teal" : "bg-paper-200 text-muted"}`}
                    >
                      {s.active ? "Live" : "Coming soon"}
                    </span>
                  </div>
                  <h3 className={`mt-5 text-xl font-bold ${s.active ? "text-navy" : "text-navy/50"}`}>{s.name}</h3>
                  <p className={`mt-1 text-sm ${s.active ? "text-muted" : "text-muted/70"}`}>{s.blurb}</p>
                  {s.active && (
                    <p className="mt-4 text-sm font-bold text-saffron-600 group-hover:underline">Start progress check →</p>
                  )}
                </>
              );
              return s.active ? (
                <Link
                  key={s.name}
                  href="/test"
                  className="group rounded-2xl border-2 border-saffron bg-white p-5 shadow-[0_10px_30px_-18px_rgba(224,137,43,0.8)] transition hover:-translate-y-0.5"
                >
                  {inner}
                </Link>
              ) : (
                <div key={s.name} aria-disabled className="rounded-2xl border border-paper-300 bg-paper/60 p-5">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rule w-full max-w-[220px]" />
        <h2 className="mt-4 text-3xl font-bold text-navy">How a progress check works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-white p-6 ring-1 ring-paper-300">
              <p className="font-display text-sm font-bold text-saffron">{s.n}</p>
              <h3 className="mt-2 text-xl font-bold text-navy">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold tracking-[0.18em] text-saffron uppercase">The faculty</p>
          <h2 className="mt-3 text-3xl font-bold">Taught by people who have cracked it</h2>
          <p className="mt-2 max-w-2xl text-paper/70">
            Each subject is led by an expert who designs its progress check and trains the tutors who deliver it.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-4">
                  <span className="font-display grid h-14 w-14 shrink-0 place-items-center rounded-full bg-paper text-lg font-bold text-navy ring-2 ring-saffron ring-offset-2 ring-offset-navy">
                    {m.initials}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.14em] text-saffron uppercase">{m.subject}</p>
                    <p className="font-display mt-0.5 leading-snug font-bold">{m.name}</p>
                  </div>
                </div>
                <p className="mt-4 border-t border-white/10 pt-3 text-sm text-paper/70">{m.cred}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-navy">See what a progress check reveals</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Take the Chemistry progress check yourself — the report is generated instantly in your browser.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/test" className="rounded-xl bg-saffron px-6 py-3.5 font-bold text-white transition hover:bg-saffron-600">
            Take a progress check
          </Link>
          <Link
            href="/report"
            className="rounded-xl border border-navy/20 bg-white px-6 py-3.5 font-bold text-navy transition hover:border-navy"
          >
            View sample report
          </Link>
        </div>
      </section>

      <footer className="border-t border-paper-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>Demo preview for partners · No data is stored</p>
        </div>
      </footer>
    </main>
  );
}
