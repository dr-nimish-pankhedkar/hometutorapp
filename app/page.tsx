import Link from "next/link";
import { Logo } from "@/components/Brand";

/* Public marketing site. Nothing here opens the platform itself — tests, results and
   reports are only reachable after a student or faculty login. */

const subjects = [
  {
    name: "Physics",
    blurb: "Mechanics, electrostatics, optics, modern physics",
    active: false,
    glyph: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" strokeLinecap="round" />,
  },
  {
    name: "Chemistry",
    blurb: "Physical, organic and inorganic chemistry",
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
      <path d="M7 3c0 4 10 5 10 9s-10 5-10 9M17 3c0 4-10 5-10 9s10 5 10 9M8.5 6.5h7M8.5 17.5h7" strokeLinecap="round" />
    ),
  },
];

const team = [
  { subject: "Physics", name: "Vijay Shukla", cred: "IIT Bombay", initials: "VS" },
  { subject: "Chemistry", name: "Dr. Nimish Pankhedkar", cred: "PhD, IIT Bombay", initials: "NP" },
  { subject: "Maths", name: "Ankit Jain", cred: "NIT Rourkela", initials: "AJ" },
  { subject: "Biology", name: "Dr. Harshal Thakur", cred: "Biology faculty", initials: "HT" },
];

const pillars = [
  {
    title: "Expert home tutors",
    body: "Every subject is led by a specialist from IIT, NIT or medicine, who trains the tutors that teach at home.",
    icon: (
      <>
        <path d="M3 9.5 12 5l9 4.5-9 4.5z" strokeLinejoin="round" />
        <path d="M7 11.5V16c1.4 1.3 3.1 2 5 2s3.6-.7 5-2v-4.5M21 9.5V15" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "AI progress analysis",
    body: "Short progress checks record answers, timing and confidence. The analysis shows exactly which sub-concepts to teach next.",
    icon: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-6M22 19H2" strokeLinecap="round" />
        <circle cx="19" cy="6" r="2.5" />
      </>
    ),
  },
  {
    title: "Parents in the loop",
    body: "After every check, parents get a clear report that starts with strengths and lays out the next two weeks.",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" strokeLinecap="round" />
      </>
    ),
  },
];

const steps = [
  { n: "01", title: "Meet your tutor", body: "A subject expert is matched to the student's class, exam target and schedule." },
  { n: "02", title: "Progress check", body: "A 15-minute check records each answer, the time taken and how sure the student felt." },
  { n: "03", title: "Two-week plan", body: "Strengths and focus areas are mapped to sub-concepts, so every session has a clear goal." },
  { n: "04", title: "Track and repeat", body: "Quick topic checks after sessions show progress — for the student, the tutor and the parents." },
];

const audiences = [
  {
    who: "For students",
    points: ["Short progress checks for each topic", "Strengths shown first, then what's next", "A personal dashboard with your score trend"],
  },
  {
    who: "For faculty",
    points: ["Every student's progress in one view", "A ready session plan for each student", "Concepts to revisit flagged automatically"],
  },
  {
    who: "For parents",
    points: ["A plain-English summary after each check", "Downloadable PDF report", "A clear view of the next two weeks"],
  },
];

function PreviewCard() {
  const rows = [
    { t: "Mole concept", v: 50, c: "bg-saffron" },
    { t: "Atomic structure", v: 100, c: "bg-teal" },
    { t: "Thermodynamics", v: 83, c: "bg-teal" },
    { t: "Chemical equilibrium", v: 33, c: "bg-rose" },
    { t: "GOC", v: 67, c: "bg-saffron" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-3 -z-10 rotate-2 rounded-3xl bg-saffron-100" aria-hidden />
      <div className="rounded-2xl border border-paper-300 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(22,35,63,0.35)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Inside the student app</p>
            <p className="font-display mt-1 text-lg font-bold text-navy">Chemistry · progress report</p>
          </div>
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-bold text-teal">Illustration</span>
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
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal">Strengths first</span>
          <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-saffron-600">2-week plan</span>
          <span className="rounded-full bg-paper-200 px-2.5 py-1 text-navy">Parent summary</span>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ kicker, title, sub, light = false }: { kicker: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-bold tracking-[0.18em] uppercase ${light ? "text-saffron" : "text-saffron-600"}`}>{kicker}</p>
      <h2 className={`mt-3 text-3xl font-bold sm:text-4xl ${light ? "text-paper" : "text-navy"}`}>{title}</h2>
      {sub && <p className={`mt-3 max-w-2xl text-lg ${light ? "text-paper/70" : "text-muted"}`}>{sub}</p>}
    </div>
  );
}

const navLinks = [
  ["About", "#about"],
  ["How it works", "#how"],
  ["Platform", "#platform"],
  ["Team", "#team"],
] as const;

export default function Home() {
  return (
    <main className="paper-grain overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-transparent bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex" aria-label="Sections">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-navy">
                {label}
              </a>
            ))}
          </nav>
          <Link href="/login" className="rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-paper transition hover:bg-navy-700">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-16 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-14 md:pb-24">
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
            AI-enabled home tuition for Physics, Chemistry, Maths and Biology — taught by IIT, NIT and medical specialists.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-saffron px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-saffron/25 transition hover:bg-saffron-600"
            >
              See how it works
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-navy/20 bg-white px-6 py-3.5 text-base font-bold text-navy transition hover:border-navy"
            >
              Student &amp; faculty login
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span>
              <strong className="text-navy">Class 11–12</strong> · JEE &amp; NEET
            </span>
            <span>
              <strong className="text-navy">IIT · NIT</strong> · medical specialists
            </span>
            <span>
              <strong className="text-navy">4 subjects</strong> · one method
            </span>
          </div>
        </div>
        <PreviewCard />
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-y border-paper-300 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHead
            kicker="What is TutorIQ"
            title="Home tuition, guided by data"
            sub="TutorIQ combines one-to-one home tuition from subject experts with a platform that shows, after every check, exactly where a student stands and what to teach next."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl bg-white p-6 ring-1 ring-paper-300">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-paper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    {p.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-xl font-bold text-navy">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
        <SectionHead kicker="How it works" title="From first session to steady progress" />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-2xl bg-white p-6 ring-1 ring-paper-300">
              <p className="font-display text-3xl font-bold text-saffron">{s.n}</p>
              <h3 className="mt-2 text-lg font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Platform */}
      <section id="platform" className="scroll-mt-20 bg-navy">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHead
            light
            kicker="The platform"
            title="One platform, a view for everyone"
            sub="Students and faculty each log in to their own space. Parents receive the reports."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.who} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-display text-xl font-bold text-paper">{a.who}</h3>
                <ul className="mt-4 space-y-3">
                  {a.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-paper/80">
                      <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0892B" strokeWidth="2.5" aria-hidden>
                        <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
        <SectionHead kicker="Subjects" title="Four subjects. One method." sub="Chemistry is live on the platform today. Physics, Maths and Biology follow the same approach." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => (
            <div
              key={s.name}
              className={`rounded-2xl p-5 ${s.active ? "border-2 border-saffron bg-white shadow-[0_10px_30px_-18px_rgba(224,137,43,0.8)]" : "border border-paper-300 bg-paper/60"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.active ? "bg-saffron text-white" : "bg-paper-200 text-navy-300"}`}>
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
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="scroll-mt-20 border-y border-paper-300 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHead
            kicker="The team"
            title="The people behind TutorIQ"
            sub="Each subject is led by an expert who designs its progress checks and trains the tutors who deliver it."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl bg-white p-6 text-center ring-1 ring-paper-300">
                <span className="font-display mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy text-2xl font-bold text-paper ring-4 ring-saffron-100">
                  {m.initials}
                </span>
                <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-saffron-600 uppercase">{m.subject} lead</p>
                <p className="font-display mt-1 text-lg font-bold text-navy">{m.name}</p>
                <p className="mt-1 text-sm text-muted">{m.cred}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login CTA */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-center text-paper sm:px-12">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full border border-white/10" aria-hidden />
          <div className="absolute -right-10 -bottom-24 h-64 w-64 rounded-full border border-white/10" aria-hidden />
          <h2 className="relative text-3xl font-bold sm:text-4xl">Already part of TutorIQ?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-paper/70">
            Students and faculty log in to their own space. Interested in TutorIQ for your family or as a partner? Reach out
            to the team.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login?as=student" className="rounded-xl bg-saffron px-6 py-3.5 font-bold text-white transition hover:bg-saffron-600">
              Student login
            </Link>
            <Link href="/login?as=faculty" className="rounded-xl px-6 py-3.5 font-bold text-paper ring-1 ring-white/30 transition hover:ring-white/70">
              Faculty login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-paper-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} TutorIQ · AI-enabled home tuition for JEE &amp; NEET</p>
        </div>
      </footer>
    </main>
  );
}
