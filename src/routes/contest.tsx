import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, X } from "lucide-react";

export const Route = createFileRoute("/contest")({ component: Contest });

const problems = [
  { p: "P1", status: "ok" },
  { p: "P2", status: "ok" },
  { p: "P3", status: "wa" },
  { p: "P4", status: "" },
];

const ranks = [
  { r: 1, n: "Priya S.", s: 380 },
  { r: 2, n: "Rohan K.", s: 360 },
  { r: 3, n: "Aarav M.", s: 340 },
  { r: 4, n: "Diya P.", s: 320 },
  { r: 5, n: "Kabir T.", s: 300 },
  { r: 6, n: "Ishaan R.", s: 280 },
];

function Contest() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between bg-[#1A1A18] px-6 text-white">
        <div className="font-serif text-base">DSA Lab Exam 3</div>
        <div className="flex items-center gap-5">
          {problems.map((p) => (
            <button key={p.p} className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <span className={`h-1.5 w-1.5 rounded-full ${p.status === "ok" ? "bg-success" : p.status === "wa" ? "bg-danger" : "bg-white/30"}`} />
              {p.p}
            </button>
          ))}
        </div>
        <div className="font-mono text-base tabular-nums text-white">00:42:18</div>
      </header>
      <div className="grid flex-1 grid-cols-[45fr_55fr] overflow-hidden">
        <div className="overflow-y-auto border-r border-border px-10 py-10">
          <div className="text-xs text-muted-foreground">Problem 3 of 4</div>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Maximum Network Flow</h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-foreground">
            Given a directed graph representing a network of pipes with capacities, find the maximum flow from source <code className="font-mono text-sm">s</code> to sink <code className="font-mono text-sm">t</code>.
          </p>
          <div className="mt-6 rounded-md bg-context-bar p-5 font-mono text-[12.5px] text-foreground">
            Input: n=4, edges=[[0,1,3],[0,2,2],[1,2,1],[1,3,2],[2,3,3]]<br />
            Output: 5
          </div>
        </div>
        <div className="bg-code-bg p-6 font-mono text-[13px] leading-6 text-foreground">
          <pre>{`def max_flow(n, edges, s, t):
    # build residual graph
    ...
`}</pre>
        </div>
      </div>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-lg hover:bg-hover-row">
        <Trophy className="h-3.5 w-3.5" /> Leaderboard
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[380px] border-l border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Leaderboard</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">DSA Lab Exam 3 · live</div>
            <div className="mt-6 divide-y divide-border">
              {ranks.map((r) => (
                <div key={r.r} className={`flex items-center justify-between py-3 ${r.n.startsWith("Aarav") ? "text-primary" : "text-foreground"}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-6 font-mono text-sm text-muted-foreground">{r.r}</span>
                    <span className="text-sm">{r.n}</span>
                  </div>
                  <span className="font-mono text-sm">{r.s}</span>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
