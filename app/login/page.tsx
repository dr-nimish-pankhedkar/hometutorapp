"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Brand";
import type { Role } from "@/lib/user";

const roleCopy: Record<Role, { title: string; sub: string; userLabel: string }> = {
  student: {
    title: "Student login",
    sub: "Take progress checks, see your strengths and follow your 2-week plan.",
    userLabel: "Student username",
  },
  faculty: {
    title: "Faculty login",
    sub: "See every student's progress, focus areas and reports in one place.",
    userLabel: "Faculty username",
  },
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>(params.get("as") === "faculty" ? "faculty" : "student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get("next");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.error ?? "Couldn't sign in. Please try again.");
        setBusy(false);
        return;
      }
      const home: string = d?.home ?? "/";
      const safeNext = next && next.startsWith(home) && !next.startsWith("//") ? next : home;
      router.replace(safeNext);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  const copy = roleCopy[role];

  return (
    <div className="w-full max-w-sm">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-paper-200 p-1" role="tablist" aria-label="Login type">
        {(["student", "faculty"] as const).map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={role === r}
            onClick={() => {
              setRole(r);
              setError(null);
            }}
            className={`rounded-lg py-2.5 text-sm font-bold transition ${role === r ? "bg-white text-navy shadow" : "text-muted hover:text-navy"}`}
          >
            {r === "student" ? "Student" : "Faculty"}
          </button>
        ))}
      </div>

      <h1 className="mt-8 text-3xl font-bold text-navy">{copy.title}</h1>
      <p className="mt-2 text-muted">{copy.sub}</p>

      <form className="mt-8 space-y-4" onSubmit={signIn}>
        <div>
          <label htmlFor="username" className="text-sm font-bold text-navy">
            {copy.userLabel}
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
            className="mt-1.5 w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-base outline-none focus:border-saffron"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-bold text-navy">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-base outline-none focus:border-saffron"
          />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-rose-100 px-4 py-2.5 text-sm text-rose">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-navy px-6 py-3.5 font-bold text-paper transition hover:bg-navy-700 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Not enrolled yet?{" "}
        <Link href="/#about" className="font-bold text-saffron-600 underline underline-offset-4">
          Find out how TutorIQ works
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh md:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-10 text-paper md:flex md:flex-col md:justify-between">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full border border-white/10" aria-hidden />
        <div className="absolute -top-8 -right-8 h-48 w-48 rounded-full border border-white/10" aria-hidden />
        <div className="absolute top-20 right-20 h-6 w-6 rounded-full bg-saffron" aria-hidden />
        <Logo light />
        <div>
          <h2 className="text-4xl leading-tight font-bold">
            Every student understood.
            <br />
            <span className="text-saffron">Every hour well spent.</span>
          </h2>
          <p className="mt-4 max-w-md text-paper/70">
            One platform for students and their tutors: progress checks, clear reports and a two-week plan built
            around every student.
          </p>
        </div>
        <p className="text-sm text-paper/50">AI-enabled home tuition · JEE &amp; NEET</p>
      </aside>

      <section className="flex flex-col bg-paper px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="md:hidden">
            <Logo />
          </span>
          <Link href="/" className="ml-auto text-sm font-semibold text-muted hover:text-navy">
            ← Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
