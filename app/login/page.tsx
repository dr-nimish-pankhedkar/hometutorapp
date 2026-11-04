"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Brand";
import { demoCredentials } from "@/lib/user";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get("next");
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  async function signIn(u: string, p: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error ?? "Couldn't sign in. Please try again.");
        setBusy(false);
        return;
      }
      router.replace(dest);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-bold text-navy">Student login</h1>
      <p className="mt-2 text-muted">Welcome back. Pick up where you left off.</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          signIn(username, password);
        }}
      >
        <div>
          <label htmlFor="username" className="text-sm font-bold text-navy">
            Username
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

      <div className="mt-8 rounded-2xl border border-dashed border-saffron bg-saffron-100/50 p-4">
        <p className="text-[11px] font-bold tracking-[0.14em] text-saffron-600 uppercase">Demo account</p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted">Username</dt>
          <dd className="font-mono font-semibold text-navy">{demoCredentials.username}</dd>
          <dt className="text-muted">Password</dt>
          <dd className="font-mono font-semibold text-navy">{demoCredentials.password}</dd>
        </dl>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setUsername(demoCredentials.username);
            setPassword(demoCredentials.password);
            signIn(demoCredentials.username, demoCredentials.password);
          }}
          className="mt-3 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-navy ring-1 ring-saffron/50 transition hover:ring-saffron disabled:opacity-60"
        >
          Sign in as Aarav (demo)
        </button>
      </div>
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
            Take a progress check, see your strengths, and get a two-week plan your tutor builds every session around.
          </p>
        </div>
        <p className="text-sm text-paper/50">AI-enabled home tuition · JEE &amp; NEET</p>
      </aside>

      <section className="flex flex-col bg-paper px-4 py-6 sm:px-10">
        <div className="md:hidden">
          <Logo />
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
