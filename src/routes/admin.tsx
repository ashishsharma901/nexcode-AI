import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { TopNav } from "@/components/top-nav";
import { Users, Shield, Settings, Activity, AlertTriangle, UserPlus, Server } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

const stats = [
  { label: "Total Users", value: "482", icon: Users, change: "+12 this week" },
  { label: "Active Contests", value: "2", icon: Activity, change: "DSA Lab 3, Weekly #18" },
  { label: "Submissions Today", value: "214", icon: Server, change: "↑ 18% vs yesterday" },
  { label: "Flagged Accounts", value: "1", icon: AlertTriangle, change: "Kabir T. — plagiarism" },
];

const recentActivity = [
  { action: "Teacher approved", detail: "Dr. Meena K. — ECE Department", time: "10m ago", type: "success" },
  { action: "Student suspended", detail: "Kabir T. — repeated plagiarism violations", time: "2h ago", type: "danger" },
  { action: "Contest created", detail: "Algorithm Sprint V by Dr. Rao", time: "5h ago", type: "info" },
  { action: "New registration", detail: "Sara Mehta — CSE 2027 batch", time: "1d ago", type: "info" },
  { action: "System update", detail: "Docker sandbox images updated to v2.4", time: "2d ago", type: "info" },
];

const pendingTeachers = [
  { name: "Dr. Ananya Iyer", dept: "CSE", email: "ananya.iyer@college.edu", date: "May 24" },
  { name: "Prof. Vikram Das", dept: "IT", email: "vikram.das@college.edu", date: "May 23" },
];

function Admin() {
  const { pathname } = useLocation();
  if (pathname !== "/admin") return <Outlet />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="admin" />
      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Super Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">Platform-wide oversight and configuration panel.</p>
          </div>
          <div className="text-xs text-muted-foreground">Monday, 25 May 2026</div>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{s.change}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* Left: Recent Activity */}
          <section>
            <div className="mb-4 text-sm font-semibold text-foreground">Recent platform activity</div>
            <div className="divide-y divide-border border-y border-border">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${
                      a.type === "success" ? "bg-success" : a.type === "danger" ? "bg-danger" : "bg-primary"
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{a.action}</div>
                      <div className="text-xs text-muted-foreground">{a.detail}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Pending Approvals + Quick Links */}
          <aside className="space-y-10">
            <section>
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserPlus className="h-4 w-4 text-warning" /> Pending teacher approvals
              </div>
              <div className="space-y-3">
                {pendingTeachers.map((t) => (
                  <div key={t.email} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.dept} · {t.email}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{t.date}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success hover:bg-success/25 transition-colors cursor-pointer">
                        Approve
                      </button>
                      <button className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 text-sm font-semibold text-foreground">Quick links</div>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/admin/teachers" className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-hover-row transition-colors">
                  <span className="flex items-center gap-2 text-foreground"><Users className="h-4 w-4 text-primary" /> Manage Teachers</span>
                </Link>
                <Link to="/admin/settings" className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-hover-row transition-colors">
                  <span className="flex items-center gap-2 text-foreground"><Settings className="h-4 w-4 text-primary" /> Platform Settings</span>
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
