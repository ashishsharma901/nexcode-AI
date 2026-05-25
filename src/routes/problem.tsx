import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/problem")({ component: ProblemPage });

function ProblemPage() {
  const [tab, setTab] = useState("problem");
  const [showResults, setShowResults] = useState(false);
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
          <h1 className="font-serif text-lg text-foreground">Shortest Bridge Between Islands</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Medium
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <button className="text-muted-foreground hover:text-foreground">Python ▾</button>
          <button onClick={() => setShowResults(true)} className="rounded-md border border-border px-3 py-1 text-xs text-foreground transition-colors hover:bg-hover-row">Run</button>
          <button className="rounded-md bg-primary px-4 py-1 text-xs text-primary-foreground transition-opacity hover:opacity-90">Submit</button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-[45fr_55fr] overflow-hidden">
        <div className="overflow-y-auto border-r border-border px-10 py-10">
          <div className="flex gap-6 border-b border-border">
            {["problem", "submissions", "hints"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-2 text-sm transition-colors ${tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <article className="mt-8 max-w-prose text-[15px] leading-relaxed text-foreground">
            <p>You are given an <em>n × n</em> binary matrix grid. An island is a 4-directionally connected group of 1s. There are exactly two islands in grid.</p>
            <p className="mt-4">You may change 0s to 1s to connect the two islands to form one island. Return the smallest number of 0s you must flip.</p>
            <div className="mt-8 rounded-md bg-context-bar p-5 text-[13px] text-muted-foreground">
              <div className="mb-2 font-medium text-foreground">Constraints</div>
              n == grid.length == grid[i].length<br />
              2 ≤ n ≤ 100<br />
              grid[i][j] is either 0 or 1
            </div>
            <div className="mt-6 border-l-2 border-primary bg-code-bg px-5 py-4 font-mono text-[12.5px] text-foreground">
              <div className="text-muted-foreground">Example 1</div>
              <div className="mt-2">Input: grid = [[0,1],[1,0]]</div>
              <div>Output: 1</div>
            </div>
          </article>
        </div>
        <div className="relative flex flex-col bg-code-bg">
          <pre className="flex-1 overflow-auto p-6 font-mono text-[13px] leading-6 text-foreground">{`  1  from collections import deque
  2
  3  class Solution:
  4      def shortestBridge(self, grid):
  5          n = len(grid)
  6          seen = set()
  7
  8          def dfs(r, c):
  9              if (r, c) in seen or grid[r][c] == 0:
 10                  return
 11              seen.add((r, c))
 12              for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
 13                  nr, nc = r+dr, c+dc
 14                  if 0 <= nr < n and 0 <= nc < n:
 15                      dfs(nr, nc)
 16
 17          # find first island, then BFS outward
 18          ...`}</pre>
          {showResults && (
            <div className="border-t border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-success">Accepted</span>
                  <span className="text-muted-foreground">· 3/3 tests passed · 42 ms</span>
                </div>
                <button onClick={() => setShowResults(false)} className="text-xs text-muted-foreground hover:text-foreground">close</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 font-mono text-[12px]">
                <div><div className="text-muted-foreground">expected</div><div className="mt-1 rounded bg-context-bar px-3 py-2 text-foreground">1</div></div>
                <div><div className="text-muted-foreground">your output</div><div className="mt-1 rounded bg-context-bar px-3 py-2 text-foreground">1</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
