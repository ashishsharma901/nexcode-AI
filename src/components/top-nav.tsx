import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";

type NavItem = { to: string; label: string };

const studentNav: NavItem[] = [
  { to: "/dashboard", label: "Problems" },
  { to: "/problems", label: "Browse" },
  { to: "/contests", label: "Contests" },
  { to: "/practice", label: "Practice" },
  { to: "/leaderboard", label: "Leaderboard" },
];

const teacherNav: NavItem[] = [
  { to: "/teacher", label: "Question bank" },
  { to: "/teacher/contests", label: "Contests" },
  { to: "/teacher/students", label: "Students" },
  { to: "/teacher/analytics", label: "Analytics" },
  { to: "/teacher/reports", label: "Reports" },
];

export function TopNav({ role = "student" }: { role?: "student" | "teacher" }) {
  const items = role === "teacher" ? teacherNav : studentNav;
  const { pathname } = useLocation();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link to="/dashboard" className="font-serif text-2xl tracking-tight text-foreground">
          codelab
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`relative text-sm transition-colors duration-150 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {it.label}
                {active && (
                  <span className="absolute -bottom-[18px] left-0 right-0 h-px bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Notifications" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-serif text-sm text-primary">
            A
          </Link>
        </div>
      </div>
    </header>
  );
}

export function ContextBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border bg-context-bar">
      <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-6 text-sm">
        {children}
      </div>
    </div>
  );
}
