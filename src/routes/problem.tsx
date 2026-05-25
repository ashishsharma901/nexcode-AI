import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Sparkles, CheckCircle2, XCircle, AlertCircle, Play, Check } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/problem")({ component: ProblemPage });

const initialCode = `from collections import deque

class Solution:
    def shortestBridge(self, grid: List[List[int]]) -> int:
        n = len(grid)
        seen = set()
        
        def dfs(r, c):
            if (r, c) in seen or grid[r][c] == 0:
                return
            seen.add((r, c))
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < n and 0 <= nc < n:
                    dfs(nr, nc)
                    
        # Find first island, then BFS outward
        # TODO: Implement BFS from seen island coordinates
        return 0`;

function ProblemPage() {
  const [tab, setTab] = useState("problem");
  const [code, setCode] = useState(initialCode);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "fail" | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);

  const lines = useMemo(() => code.split("\n"), [code]);

  const requestHint = () => {
    setIsGeneratingHint(true);
    setTimeout(() => {
      setHintLevel((prev) => prev + 1);
      setIsGeneratingHint(false);
    }, 1000);
  };

  const handleRun = () => {
    setShowResults(true);
    setSubmitResult(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setShowResults(false);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult("success");
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-serif text-lg text-foreground">Shortest Bridge Between Islands</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-medium text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" /> Medium
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <select className="bg-transparent border-0 text-xs text-muted-foreground hover:text-foreground outline-none cursor-pointer">
            <option className="bg-popover text-foreground">Python 3</option>
            <option className="bg-popover text-foreground">C++20</option>
            <option className="bg-popover text-foreground">Java 17</option>
            <option className="bg-popover text-foreground">Go 1.21</option>
          </select>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-hover-row cursor-pointer"
          >
            <Play className="h-3 w-3" /> Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </header>
      
      <div className="grid flex-1 grid-cols-[45fr_55fr] overflow-hidden">
        {/* Left Side: Description, Submissions, Hints */}
        <div className="flex flex-col border-r border-border overflow-hidden">
          <div className="flex gap-6 border-b border-border px-10 pt-4">
            {["problem", "submissions", "hints"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                  tab === t
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {tab === "problem" && (
              <article className="max-w-prose text-[15px] leading-relaxed text-foreground space-y-5">
                <p>
                  You are given an <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">n × n</code> binary matrix <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">grid</code>. An island is a 4-directionally connected group of 1s. There are exactly two islands in <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">grid</code>.
                </p>
                <p>
                  You may change 0s to 1s to connect the two islands to form one island. Return the smallest number of 0s you must flip.
                </p>
                
                <div className="rounded-xl bg-context-bar p-5 border border-border">
                  <div className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Constraints</div>
                  <ul className="list-disc list-inside space-y-1.5 font-mono text-[12.5px] text-muted-foreground">
                    <li>n == grid.length == grid[i].length</li>
                    <li>2 ≤ n ≤ 100</li>
                    <li>grid[i][j] is either 0 or 1</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-primary bg-muted/20 px-5 py-4 font-mono text-[12.5px] text-foreground rounded-r-lg">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Example 1</div>
                    <div className="space-y-1">
                      <div><span className="text-muted-foreground">Input:</span> grid = [[0,1],[1,0]]</div>
                      <div><span className="text-muted-foreground">Output:</span> 1</div>
                    </div>
                  </div>

                  <div className="border-l-2 border-primary bg-muted/20 px-5 py-4 font-mono text-[12.5px] text-foreground rounded-r-lg">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Example 2</div>
                    <div className="space-y-1">
                      <div><span className="text-muted-foreground">Input:</span> grid = [[0,1,0],[0,0,0],[0,0,1]]</div>
                      <div><span className="text-muted-foreground">Output:</span> 2</div>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {tab === "submissions" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Submission History</h3>
                <div className="divide-y divide-border border-y border-border">
                  {[
                    { id: 1, status: "Accepted", runtime: "38 ms", lang: "Python 3", date: "10m ago", codeLen: "284 bytes" },
                    { id: 2, status: "Wrong Answer", runtime: "N/A", lang: "Python 3", date: "1h ago", codeLen: "142 bytes", details: "Failed at test case 48/100" },
                    { id: 3, status: "Time Limit Exceeded", runtime: "N/A", lang: "C++20", date: "2d ago", codeLen: "410 bytes" },
                    { id: 4, status: "Accepted", runtime: "28 ms", lang: "Go 1.21", date: "3d ago", codeLen: "312 bytes" },
                  ].map((sub) => (
                    <div key={sub.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {sub.status === "Accepted" ? (
                            <span className="flex items-center gap-1 text-xs text-success font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                            </span>
                          ) : sub.status === "Wrong Answer" ? (
                            <span className="flex items-center gap-1 text-xs text-danger font-semibold">
                              <XCircle className="h-3.5 w-3.5" /> Wrong Answer
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-warning font-semibold">
                              <AlertCircle className="h-3.5 w-3.5" /> Time Limit Exceeded
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">· {sub.lang}</span>
                        </div>
                        {sub.details && <p className="text-xs text-danger/80">{sub.details}</p>}
                        <p className="text-[11px] text-muted-foreground">{sub.date} · {sub.codeLen}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">{sub.runtime}</span>
                        <button className="text-xs text-primary hover:underline font-semibold cursor-pointer">View Code</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "hints" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <h3 className="text-sm font-semibold text-foreground">AI Guided Hints</h3>
                </div>
                
                <p className="text-xs text-muted-foreground leading-normal">
                  Unlock progressive, tailored hints from NexCode's AI engine. We nudge you towards the right path without spoiling the solution.
                </p>

                <div className="space-y-4">
                  {hintLevel >= 1 && (
                    <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-[10px]">1</span>
                        Identify the First Island
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Use Depth First Search (DFS) or Breadth First Search (BFS) to traverse the grid. Once you hit a 1, search all of its connected 1s and save their coordinates in a set (or mark them as visited) to establish the complete first island.
                      </p>
                    </div>
                  )}

                  {hintLevel >= 2 && (
                    <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-[10px]">2</span>
                        Multi-Source BFS
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Once you have the coordinates of all cells in the first island, think of finding the shortest path to the second island. The most efficient way is a Multi-Source BFS starting from all cells of the first island simultaneously.
                      </p>
                    </div>
                  )}

                  {hintLevel >= 3 && (
                    <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-[10px]">3</span>
                        Shortest Distance Calculation
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Initialize a queue with all the first island's cells, along with a distance of 0. Perform BFS level-by-level. As soon as your traversal encounters a cell belonging to the second island (value 1 and not part of the first island), return its distance minus 1.
                      </p>
                    </div>
                  )}
                </div>

                {hintLevel < 3 && (
                  <button
                    onClick={requestHint}
                    disabled={isGeneratingHint}
                    className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 text-xs font-semibold text-primary transition-all disabled:opacity-50 w-full cursor-pointer mt-4"
                  >
                    {isGeneratingHint ? (
                      <span>Consulting AI Engine...</span>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{hintLevel === 0 ? "Request First Hint" : "Request Next Hint"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor and Output Console */}
        <div className="flex flex-col bg-code-bg overflow-hidden relative">
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Line Numbers */}
            <div className="py-6 px-3 bg-code-bg text-right font-mono text-[13px] text-muted-foreground/40 select-none border-r border-border/10 leading-6 min-w-[3rem]">
              {lines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            
            {/* Editor Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 py-6 px-4 bg-transparent font-mono text-[13px] leading-6 text-foreground outline-none resize-none overflow-y-auto h-full"
              spellCheck="false"
            />
          </div>

          {/* Test results overlay */}
          {showResults && (
            <div className="border-t border-border bg-background px-6 py-5 animate-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success font-semibold">Accepted</span>
                  <span className="text-muted-foreground">· 3/3 tests passed · 42 ms</span>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-[12px]">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Expected Output</div>
                  <div className="rounded-lg bg-context-bar px-3 py-2 text-foreground border border-border">1</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Your Output</div>
                  <div className="rounded-lg bg-context-bar px-3 py-2 text-foreground border border-border">1</div>
                </div>
              </div>
            </div>
          )}

          {/* Submission feedback overlay */}
          {submitResult === "success" && (
            <div className="border-t border-border bg-background px-6 py-6 animate-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">All Test Cases Passed!</h4>
                    <p className="text-xs text-muted-foreground">Successfully submitted to production server.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
              <div className="mt-4 flex gap-6 font-mono text-[11px] text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border">
                <div>Runtime: <span className="text-foreground font-semibold">32 ms (Top 94%)</span></div>
                <div>Memory: <span className="text-foreground font-semibold">16.4 MB (Top 88%)</span></div>
                <div>Points: <span className="text-foreground font-semibold">+100 XP</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

