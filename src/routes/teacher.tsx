import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { TopNav } from "@/components/top-nav";
import { ArrowRight, ArrowUp, Plus } from "lucide-react";

export const Route = createFileRoute("/teacher")({ component: Teacher });

function Teacher() {
  const { pathname } = useLocation();
  if (pathname !== "/teacher") return <Outlet />;
  return (
    <div className="min-h-screen">
      <TopNav role="teacher" />
      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-12">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Faculty desk</h1>
            <p className="mt-2 text-sm text-muted-foreground">Welcome, Dr. Rao — CSE Department</p>
          </div>
          <div className="text-xs text-muted-foreground">Monday, 25 May</div>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
          <span><span className="text-foreground">124</span> questions</span>
          <span className="text-border">|</span>
          <span><span className="text-foreground">2</span> active contests</span>
          <span className="text-border">|</span>
          <span><span className="text-foreground">380</span> students</span>
          <span className="text-border">|</span>
          <span><span className="text-foreground">214</span> submissions today</span>
          <span className="text-border">|</span>
          <span><span className="text-danger">3</span> flagged for review</span>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[65fr_35fr]">
          <div className="space-y-12">
            <section>
              <div className="mb-4 text-sm text-foreground">Active contests</div>
              <div className="divide-y divide-border border-y border-border">
                {[
                  { name: "DSA Lab Exam 3", time: "42 min left", who: "Sec A · 64 students" },
                  { name: "Weekly Practice #18", time: "ends Sunday", who: "Open · 142 students" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-5">
                    <div>
                      <div className="font-serif text-xl text-foreground">{c.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{c.who}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-warning/15 px-3 py-1 text-xs text-warning">{c.time}</span>
                      <Link to="/teacher/plagiarism" className="text-sm text-foreground hover:underline">Manage →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <div className="mb-3 text-sm text-foreground">Recent submissions</div>
              <div className="divide-y divide-border border-y border-border">
                {[
                  { v: "ok", n: "Priya S.", t: "Course Schedule II", time: "1m" },
                  { v: "wa", n: "Rohan K.", t: "Max Flow", time: "3m" },
                  { v: "ok", n: "Diya P.", t: "LRU Cache", time: "4m" },
                  { v: "tle", n: "Kabir T.", t: "Word Ladder", time: "7m" },
                  { v: "ok", n: "Ishaan R.", t: "Two Sum", time: "9m" },
                ].map((s, i) => (
                  <div key={i} className="grid grid-cols-[16px_120px_1fr_60px] items-center gap-4 py-3 text-sm">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.v === "ok" ? "bg-success" : s.v === "wa" ? "bg-danger" : "bg-warning"}`} />
                    <span className="text-foreground">{s.n}</span>
                    <span className="text-muted-foreground">{s.t}</span>
                    <span className="text-right text-xs text-muted-foreground">{s.time} ago</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="space-y-10">
            <section>
              <div className="mb-3 text-sm text-foreground">Quick actions</div>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/teacher/new" className="group flex items-center justify-between border-b border-border py-2 text-foreground">
                  <span className="flex items-center gap-2"><Plus className="h-3.5 w-3.5" /> Create question</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <button className="group flex items-center justify-between border-b border-border py-2 text-foreground">
                  <span className="flex items-center gap-2"><Plus className="h-3.5 w-3.5" /> Create contest</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <button className="group flex items-center justify-between border-b border-border py-2 text-foreground">
                  <span className="flex items-center gap-2"><ArrowUp className="h-3.5 w-3.5" /> Bulk upload</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </div>
            </section>
            <section className="rounded-md border border-danger/30 bg-danger/5 p-5">
              <div className="text-xs text-danger">Flagged for plagiarism</div>
              <div className="mt-2 font-serif text-2xl text-foreground">3 submission pairs</div>
              <div className="mt-1 text-xs text-muted-foreground">in DSA Lab Exam 3</div>
              <Link to="/teacher/plagiarism" className="mt-3 inline-block text-sm text-foreground hover:underline">Review →</Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
