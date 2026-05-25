import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Search, User, Settings, LogOut, ShieldAlert, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
];

type Notification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "DSA Lab Exam 3 is Live",
    desc: "The contest has started. Duration is 90 minutes.",
    time: "5m ago",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Submission Accepted",
    desc: "Your solution for 'Two Sum' passed all test cases.",
    time: "2h ago",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Plagiarism Alert",
    desc: "High similarity detected in 'Course Schedule II'. Click to review.",
    time: "1d ago",
    type: "alert",
    read: true,
  },
  {
    id: "4",
    title: "New Hint Available",
    desc: "AI has generated a new hint for 'LRU Cache'.",
    time: "2d ago",
    type: "info",
    read: true,
  },
];

export function TopNav({ role = "student" }: { role?: "student" | "teacher" | "admin" }) {
  const items = role === "teacher" ? teacherNav : studentNav;
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link to={role === "teacher" ? "/teacher" : role === "admin" ? "/admin" : "/dashboard"} className="font-serif text-2xl tracking-tight text-foreground transition-opacity hover:opacity-90">
          nexcode-ai
        </Link>
        
        <nav className="hidden items-center gap-8 md:flex">
          {role !== "admin" && items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`relative text-sm font-medium transition-colors duration-150 py-1 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {it.label}
                {active && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          {role === "admin" && (
            <>
              <Link to="/admin" className={`relative text-sm font-medium transition-colors py-1 ${pathname === "/admin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Dashboard
                {pathname === "/admin" && <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
              <Link to="/admin/teachers" className={`relative text-sm font-medium transition-colors py-1 ${pathname.startsWith("/admin/teachers") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Teachers
                {pathname.startsWith("/admin/teachers") && <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
              <Link to="/admin/settings" className={`relative text-sm font-medium transition-colors py-1 ${pathname.startsWith("/admin/settings") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Settings
                {pathname.startsWith("/admin/settings") && <span className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUserOpen(false);
              }}
              aria-label="Notifications"
              className="relative rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold">Notifications</span>
                  <Link to="/notifications" onClick={() => setNotifOpen(false)} className="text-xs text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-border">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 ${!n.read ? "bg-muted/20" : ""}`}>
                      <div className="mt-0.5">
                        {n.type === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                        {n.type === "info" && <Info className="h-4 w-4 text-primary" />}
                        {n.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                        {n.type === "alert" && <ShieldAlert className="h-4 w-4 text-danger" />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className={`text-xs ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-normal">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground/80">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setUserOpen(!userOpen);
                setNotifOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-serif text-sm text-primary transition-all duration-150 hover:ring-2 hover:ring-primary/30"
            >
              {role === "teacher" ? "TR" : role === "admin" ? "AD" : "AM"}
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-semibold truncate">
                    {role === "teacher" ? "dr.rao@college.edu" : role === "admin" ? "admin@college.edu" : "aarav@college.edu"}
                  </p>
                </div>
                <div className="p-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    <User className="h-3.5 w-3.5" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" /> Settings
                  </Link>
                  
                  {role === "student" && (
                    <>
                      <Link
                        to="/teacher"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted text-primary transition-colors border-t border-border mt-1 pt-1.5"
                      >
                        Teacher Desk
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted text-primary transition-colors"
                      >
                        Admin Panel
                      </Link>
                    </>
                  )}
                  {role === "teacher" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted text-primary transition-colors border-t border-border mt-1 pt-1.5"
                    >
                      Student Desk
                    </Link>
                  )}
                  {role === "admin" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted text-primary transition-colors border-t border-border mt-1 pt-1.5"
                    >
                      Student Desk
                    </Link>
                  )}

                  <hr className="border-border my-1" />
                  <Link
                    to="/"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-destructive/10 text-danger transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>
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

