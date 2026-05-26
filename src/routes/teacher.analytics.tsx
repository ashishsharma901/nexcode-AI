import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { TrendingUp, Users, FileText, BarChart3, PieChart, Activity } from "lucide-react";

export const Route = createFileRoute("/teacher/analytics")({ component: TeacherAnalytics });

const contestStats = [
  { name: "DSA Lab Exam 3", participants: 64, avgScore: 72, completion: 94, date: "May 25" },
  { name: "Weekly Practice #18", participants: 142, avgScore: 58, completion: 67, date: "May 24" },
  { name: "DSA Lab Exam 2", participants: 62, avgScore: 68, completion: 91, date: "May 11" },
  { name: "Algo Sprint III", participants: 134, avgScore: 45, completion: 78, date: "Apr 28" },
  { name: "Weekly Practice #17", participants: 86, avgScore: 61, completion: 72, date: "Apr 20" },
];

const questionStats = [
  { title: "Two Sum", attempts: 312, acceptance: 72, avgTime: "4.2 min", avgAttempts: 1.3 },
  { title: "LRU Cache", attempts: 189, acceptance: 44, avgTime: "18.5 min", avgAttempts: 2.8 },
  { title: "Maximum Network Flow", attempts: 94, acceptance: 28, avgTime: "32.1 min", avgAttempts: 4.1 },
  { title: "Course Schedule II", attempts: 245, acceptance: 47, avgTime: "12.8 min", avgAttempts: 2.2 },
  { title: "Word Ladder", attempts: 156, acceptance: 24, avgTime: "28.4 min", avgAttempts: 3.9 },
  { title: "Coin Change", attempts: 278, acceptance: 39, avgTime: "15.2 min", avgAttempts: 2.5 },
];

const topicCoverage = [
  { topic: "Arrays", questions: 28, solved: 892, color: "bg-success" },
  { topic: "Graphs", questions: 22, solved: 634, color: "bg-primary" },
  { topic: "DP", questions: 18, solved: 412, color: "bg-warning" },
  { topic: "Strings", questions: 15, solved: 567, color: "bg-purple-500" },
  { topic: "Trees", questions: 12, solved: 345, color: "bg-orange-500" },
  { topic: "Design", questions: 8, solved: 189, color: "bg-pink-500" },
  { topic: "Sorting", questions: 6, solved: 234, color: "bg-cyan-500" },
];

const dailySubmissions = [42, 38, 55, 67, 214, 89, 45, 52, 61, 78, 92, 110, 85, 63];

function MiniBarChart({ data, height = 60 }: { data: number[]; height?: number }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-primary/60 hover:bg-primary transition-colors"
          style={{ height: `${(v / max) * 100}%` }}
          title={`${v} submissions`}
        />
      ))}
    </div>
  );
}

function TeacherAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const totalSubmissions = dailySubmissions.reduce((a, b) => a + b, 0);
  const totalQuestions = topicCoverage.reduce((a, b) => a + b.questions, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Period:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
          >
            <option value="7d" className="bg-popover text-foreground">Last 7 days</option>
            <option value="30d" className="bg-popover text-foreground">Last 30 days</option>
            <option value="90d" className="bg-popover text-foreground">Last 90 days</option>
            <option value="all" className="bg-popover text-foreground">All time</option>
          </select>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Performance insights across your contests, questions, and student activity.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Submissions", value: totalSubmissions.toLocaleString(), icon: Activity, sub: "↑ 18% vs last period" },
            { label: "Questions Created", value: totalQuestions.toString(), icon: FileText, sub: "across 7 topics" },
            { label: "Avg Contest Score", value: "61%", icon: BarChart3, sub: "across 5 contests" },
            { label: "Active Students", value: "380", icon: Users, sub: "in your batches" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Submission Volume Chart */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Daily Submission Volume</h2>
                <span className="text-xs text-muted-foreground">Last 14 days</span>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <MiniBarChart data={dailySubmissions} height={80} />
                <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </section>

            {/* Contest Performance Table */}
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-4">Contest Performance</h2>
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                      <th className="py-3 px-5 font-semibold">Contest</th>
                      <th className="py-3 px-5 font-semibold text-center">Participants</th>
                      <th className="py-3 px-5 font-semibold text-center">Avg Score</th>
                      <th className="py-3 px-5 font-semibold text-center">Completion</th>
                      <th className="py-3 px-5 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {contestStats.map((c) => (
                      <tr key={c.name} className="text-sm hover:bg-hover-row transition-colors">
                        <td className="py-3 px-5 font-medium text-foreground">{c.name}</td>
                        <td className="py-3 px-5 text-center font-mono text-muted-foreground">{c.participants}</td>
                        <td className="py-3 px-5 text-center">
                          <span className={`font-mono font-semibold ${c.avgScore >= 60 ? "text-success" : c.avgScore >= 40 ? "text-warning" : "text-danger"}`}>
                            {c.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="h-1.5 w-16 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${c.completion}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{c.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-right text-xs text-muted-foreground">{c.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Question Difficulty Stats */}
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-4">Question Difficulty Analysis</h2>
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                      <th className="py-3 px-5 font-semibold">Problem</th>
                      <th className="py-3 px-5 font-semibold text-center">Attempts</th>
                      <th className="py-3 px-5 font-semibold text-center">Acceptance</th>
                      <th className="py-3 px-5 font-semibold text-center">Avg Solve Time</th>
                      <th className="py-3 px-5 font-semibold text-right">Avg Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {questionStats.map((q) => (
                      <tr key={q.title} className="text-sm hover:bg-hover-row transition-colors">
                        <td className="py-3 px-5 font-medium text-foreground">{q.title}</td>
                        <td className="py-3 px-5 text-center font-mono text-muted-foreground">{q.attempts}</td>
                        <td className="py-3 px-5 text-center">
                          <span className={`font-mono font-semibold ${q.acceptance >= 50 ? "text-success" : q.acceptance >= 30 ? "text-warning" : "text-danger"}`}>
                            {q.acceptance}%
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center font-mono text-xs text-muted-foreground">{q.avgTime}</td>
                        <td className="py-3 px-5 text-right font-mono text-xs text-muted-foreground">{q.avgAttempts}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {/* Topic Coverage */}
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5">Topic Coverage</h3>
              <div className="space-y-4">
                {topicCoverage.map((t) => {
                  const maxQ = Math.max(...topicCoverage.map((x) => x.questions));
                  return (
                    <div key={t.topic}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-foreground">{t.topic}</span>
                        <span className="text-muted-foreground font-mono">{t.questions} Qs</span>
                      </div>
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${t.color}`} style={{ width: `${(t.questions / maxQ) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground">
                  <span className="text-warning font-semibold">Gap detected:</span> Trees and Design have fewer questions. Consider adding more to balance coverage.
                </p>
              </div>
            </section>

            {/* Verdict Distribution */}
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5">Verdict Distribution</h3>
              <div className="space-y-3">
                {[
                  { verdict: "Accepted", pct: 42, color: "bg-success" },
                  { verdict: "Wrong Answer", pct: 28, color: "bg-danger" },
                  { verdict: "TLE", pct: 15, color: "bg-warning" },
                  { verdict: "Runtime Error", pct: 10, color: "bg-orange-500" },
                  { verdict: "Compilation Error", pct: 5, color: "bg-muted-foreground" },
                ].map((v) => (
                  <div key={v.verdict} className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${v.color}`} />
                    <span className="flex-1 text-xs text-foreground">{v.verdict}</span>
                    <span className="font-mono text-xs text-muted-foreground">{v.pct}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Insights */}
            <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">AI Insights</h3>
              <div className="space-y-3 text-xs text-foreground leading-relaxed">
                <p>• Students struggle most with <span className="font-semibold">Graph BFS</span> problems — 76% failure rate on first attempt.</p>
                <p>• <span className="font-semibold">Word Ladder</span> has the highest retry count (3.9× avg). Consider adding a simpler BFS warm-up problem.</p>
                <p>• Contest completion drops significantly after 60 minutes. Consider shorter contests for lab exams.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
