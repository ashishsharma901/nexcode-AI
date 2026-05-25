import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { BookMarked, HelpCircle, RefreshCw, Sparkles, ChevronRight, Award, Layers, Cpu, Compass, BookOpen } from "lucide-react";

export const Route = createFileRoute("/practice")({ component: Practice });

interface Topic {
  name: string;
  count: number;
  solved: number;
  icon: any;
  color: string;
}

const initialTopics: Topic[] = [
  { name: "Arrays & Hashing", count: 42, solved: 28, icon: Layers, color: "oklch(0.65 0.15 140)" },
  { name: "Strings", count: 35, solved: 14, icon: BookOpen, color: "oklch(0.65 0.15 200)" },
  { name: "Trees & Graphs", count: 68, solved: 18, icon: Compass, color: "oklch(0.65 0.15 300)" },
  { name: "Dynamic Programming", count: 54, solved: 12, icon: Cpu, color: "oklch(0.65 0.15 30)" },
  { name: "Greedy Algorithms", count: 30, solved: 9, icon: Award, color: "oklch(0.65 0.15 80)" }
];

const mockBookmarks = [
  { id: "b1", title: "Median of Two Sorted Arrays", diff: "Hard", topic: "Arrays" },
  { id: "b2", title: "Course Schedule II", diff: "Medium", topic: "Graphs" },
];

const mockRetryFailed = [
  { id: "r1", title: "Word Ladder", diff: "Hard", topic: "BFS", attemptCount: 3 },
  { id: "r2", title: "Trapping Rain Water", diff: "Hard", topic: "Arrays", attemptCount: 2 },
];

const mockRecommended = [
  { id: "rec1", title: "Shortest Path in Grid with Obstacles Elimination", diff: "Hard", topic: "Graphs", reason: "Based on Graph weakness" },
  { id: "rec2", title: "Unique Paths II", diff: "Medium", topic: "DP", reason: "Strengthen DP fundamentals" },
];

function Practice() {
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="student" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Practice Desk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filter Difficulty:</span>
          <div className="flex items-center gap-1">
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-full px-3 py-0.5 text-xs font-semibold cursor-pointer transition-all ${
                  difficulty === d
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-10">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Practice Mode</h1>
          <p className="mt-2 text-sm text-muted-foreground font-sans">
            Deep dive into algorithmic paradigms. Master them topic-by-topic.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-12">
          {/* Left Column: Topics Grid */}
          <div className="space-y-10">
            <section>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Topic-wise Syllabus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialTopics.map((topic) => {
                  const pct = Math.round((topic.solved / topic.count) * 100);
                  const Icon = topic.icon;
                  return (
                    <div
                      key={topic.name}
                      className="group rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: topic.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-serif text-xl text-foreground font-medium group-hover:text-primary transition-colors">
                              {topic.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {topic.solved} of {topic.count} completed
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">{pct}%</span>
                      </div>
                      
                      {/* Custom linear progress bar */}
                      <div className="mt-6 h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: topic.color }}
                        />
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link
                          to="/problems"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors"
                        >
                          Start learning <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            
            {/* AI Recommendations */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">AI Recommended Next Steps</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRecommended.map((rec) => (
                  <div key={rec.id} className="rounded-xl border border-border bg-surface/50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                        {rec.diff}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{rec.topic}</span>
                    </div>
                    <Link to="/problem" className="font-serif text-lg text-foreground hover:underline font-medium block">
                      {rec.title}
                    </Link>
                    <p className="text-[11px] text-primary/80 font-medium">
                      💡 {rec.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Bookmarks & Retry Failed */}
          <div className="space-y-10">
            {/* Bookmarks */}
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <BookMarked className="h-4 w-4 text-primary" /> Bookmarks
              </h3>
              {mockBookmarks.length > 0 ? (
                <div className="divide-y divide-border">
                  {mockBookmarks.map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <Link to="/problem" className="text-sm font-semibold text-foreground hover:underline truncate">
                          {b.title}
                        </Link>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{b.topic} · {b.diff}</p>
                      </div>
                      <Link to="/problem" className="text-xs text-primary hover:underline font-medium">Solve</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Bookmarked problems show up here.</p>
              )}
            </section>

            {/* Retry Failed */}
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <RefreshCw className="h-4 w-4 text-warning" /> Retry Failed
              </h3>
              {mockRetryFailed.length > 0 ? (
                <div className="divide-y divide-border">
                  {mockRetryFailed.map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <Link to="/problem" className="text-sm font-semibold text-foreground hover:underline truncate">
                          {r.title}
                        </Link>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {r.topic} · {r.diff} · Failed {r.attemptCount} times
                        </p>
                      </div>
                      <Link to="/problem" className="text-xs text-warning hover:underline font-medium">Retry</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Wrong attempts show up here.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
