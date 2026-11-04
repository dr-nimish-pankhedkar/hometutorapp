import { AppShell } from "@/components/AppShell";
import { student } from "@/lib/user";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      nav={[
        { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { href: "/tests", label: "Tests", icon: "tests" },
        { href: "/results", label: "Results", icon: "results" },
      ]}
      user={{
        name: student.fullName,
        firstName: student.firstName,
        initials: student.initials,
        detail: `${student.grade} · ${student.target}`,
        roleLabel: "Student",
      }}
    >
      {children}
    </AppShell>
  );
}
