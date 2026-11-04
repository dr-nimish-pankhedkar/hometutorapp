"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Brand";

const icons = {
  dashboard: <path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 4v3h6V4z" strokeLinejoin="round" />,
  tests: (
    <>
      <path d="M8 4h8l1 3H7z" strokeLinejoin="round" />
      <rect x="5" y="7" width="14" height="13" rx="2" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </>
  ),
  results: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />,
  students: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16.5 14.2c2.4.2 4 1.9 4.5 4.8" strokeLinecap="round" />
    </>
  ),
};

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof icons;
  /** Match this path exactly instead of as a prefix */
  exact?: boolean;
}

export interface ShellUser {
  name: string;
  firstName: string;
  initials: string;
  detail: string;
  roleLabel: string;
}

export function AppShell({ nav, user, children }: { nav: NavItem[]; user: ShellUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const inTest = /^\/tests\/[^/]+/.test(pathname);
  const isOn = (n: NavItem) =>
    n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + "/");

  async function logout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="no-print sticky top-0 z-30 border-b border-paper-300 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-8">
            <Logo />
            {!inTest && (
              <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-lg px-3 py-2 text-sm font-bold transition ${isOn(n) ? "bg-navy text-paper" : "text-muted hover:text-navy"}`}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className="relative flex items-center gap-3">
            <span className="hidden rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-teal uppercase sm:inline">
              {user.roleLabel}
            </span>
            <button
              onClick={() => setMenu((m) => !m)}
              className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 ring-1 ring-paper-300 transition hover:ring-navy/30"
              aria-haspopup="menu"
              aria-expanded={menu}
            >
              <span className="font-display grid h-8 w-8 place-items-center rounded-full bg-saffron text-xs font-bold text-white">
                {user.initials}
              </span>
              <span className="hidden text-sm font-bold text-navy sm:inline">{user.firstName}</span>
            </button>
            {menu && <div className="fixed inset-0" onClick={() => setMenu(false)} aria-hidden />}
            {menu && (
              <div role="menu" className="absolute top-full right-0 z-10 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl ring-1 ring-paper-300">
                <div className="px-3 py-2">
                  <p className="font-bold text-navy">{user.name}</p>
                  <p className="text-xs text-muted">{user.detail}</p>
                </div>
                <hr className="my-1 border-paper-200" />
                <button
                  role="menuitem"
                  onClick={logout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-navy hover:bg-paper"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={inTest ? "" : "pb-20 md:pb-0"}>{children}</div>

      {!inTest && (
        <nav
          className="no-print fixed inset-x-0 bottom-0 z-30 grid border-t border-paper-300 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
          aria-label="Main"
        >
          {nav.map((n) => {
            const on = isOn(n);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold ${on ? "text-navy" : "text-muted"}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  {icons[n.icon]}
                </svg>
                {n.label}
                <span className={`h-1 w-6 rounded-full ${on ? "bg-saffron" : "bg-transparent"}`} />
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function PageHeader({ kicker, title, sub, action }: { kicker?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <p className="text-[11px] font-bold tracking-[0.16em] text-teal uppercase">{kicker}</p>}
        <h1 className="mt-1 text-3xl font-bold text-navy">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
