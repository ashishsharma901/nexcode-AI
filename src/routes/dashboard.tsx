import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/top-nav";
import { ArrowRight, Flame } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const submissions = [
  { v: "ok", title: "Two Sum", lang: "Python", time: "2m ago" },
  { v: "wa", title: "Course Schedule II", lang: "C++", time: "1h ago" },
  { v: "ok", title: "LRU Cache", lang: "Java", time: "3h ago" },
  { v: "tle", title: "Word Ladder", lang: "Python", time: "yesterday" },
  { v: "ok", title: "Valid Parentheses", lang: "Go", time: "yesterday" },
];

const verdictColor = { ok: "bg-success", wa: "bg-danger", tle: "bg-warning" } as const;

function Heatmap() {
  const cells = Array.from({ length: 7 * 18 }, (_, i) => Math.floor((Math.sin(i * 1.7) + 1) * 2));
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((v, i) => (
        <div key={i} className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: `oklch(${0.95 - v * 0.08} ${0.02 + v * 0.04} 50)` }} />
      ))}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopNav role="student" />
      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-12">
        <div>
          <h1 className="font-serif text-5xl leading-tight text-foreground">Good morning, Aarav.</h1>
          <p className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-primary" />
            3-day streak <span className="text-border">·</span> 47 problems solved <span className="text-border">·</span> Rating 1340
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-12">
            <section>
              <div className="mb-4 text-sm text-muted-foreground">Continue where you left off</div>
              <div className="rounded-md border border-border bg-surface p-8">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-0.5 text-warning">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Medium
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5">Graphs</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl text-foreground">Shortest Bridge Between Islands</h2>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                  You're 60% through. Multi-source BFS with island marking — pick up where the editor was paused.
                </p>
                <Link to="/problem" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                  Resume <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
            <section>
              <div className="mb-3 flex items-baseline justify-between">
                <div className="text-sm text-foreground">Recent submissions</div>
                <Link to="/profile" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {submissions.map((s, i) => (
                  <div key={i} className="group flex items-center gap-4 px-1 py-3 transition-colors hover:bg-hover-row">
                    <span className={`h-1.5 w-1.5 rounded-full ${verdictColor[s.v as keyof typeof verdictColor]}`} />
                    <Link to="/problem" className="flex-1 text-sm text-foreground group-hover:underline">{s.title}</Link>
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{s.lang}</span>
                    <span className="w-20 text-right text-xs text-muted-foreground">{s.time}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-10">
            <section>
              <div className="mb-4 text-sm text-foreground">Your activity</div>
              <div className="rounded-md border border-border bg-surface p-5">
                <Heatmap />
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>18 weeks</span>
                  <span className="flex items-center gap-1">
                    less <span className="h-2 w-2 rounded-[2px] bg-secondary" />
                    <span className="h-2 w-2 rounded-[2px] bg-primary/30" />
                    <span className="h-2 w-2 rounded-[2px] bg-primary/60" />
                    <span className="h-2 w-2 rounded-[2px] bg-primary" /> more
                  </span>
                </div>
              </div>
            </section>
            <section>
              <div className="mb-3 text-sm text-foreground">Weak spots</div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-danger/10 px-3 py-1.5 text-xs text-danger">Graphs · 31%</span>
                <span className="rounded-full bg-warning/15 px-3 py-1.5 text-xs text-warning">DP · 44%</span>
                <span className="rounded-full bg-warning/15 px-3 py-1.5 text-xs text-warning">Trees · 52%</span>
              </div>
            </section>
            <section>
              <div className="mb-3 text-sm text-foreground">Upcoming</div>
              <div className="rounded-md border border-border bg-surface p-5">
                <div className="font-serif text-xl text-foreground">DSA Lab Exam 4</div>
                <div className="mt-1 text-xs text-muted-foreground">Friday, 2:00 PM · 90 min</div>
                <div className="mt-3 inline-flex items-center rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] text-foreground">starts in 2d 14h</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
