import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="TutorIQ home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14.5" fill="none" stroke={light ? "#F7F4EC" : "#16233F"} strokeWidth="1.5" />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke={light ? "#F7F4EC" : "#16233F"} strokeWidth="1.5" opacity="0.55" />
        <circle cx="16" cy="16" r="3.4" fill="#E0892B" />
      </svg>
      <span className={`font-display text-xl font-bold ${light ? "text-paper" : "text-navy"}`}>TutorIQ</span>
    </Link>
  );
}

export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="no-print mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Logo />
      {right}
    </header>
  );
}
