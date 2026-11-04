import { AppShell } from "@/components/AppShell";
import { faculty } from "@/lib/user";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      nav={[
        { href: "/faculty", label: "Overview", icon: "dashboard", exact: true },
        { href: "/faculty/students", label: "Students", icon: "students" },
      ]}
      user={{
        name: faculty.fullName,
        firstName: `Dr. ${faculty.firstName}`,
        initials: faculty.initials,
        detail: `${faculty.subject} · ${faculty.credential}`,
        roleLabel: "Faculty",
      }}
    >
      {children}
    </AppShell>
  );
}
