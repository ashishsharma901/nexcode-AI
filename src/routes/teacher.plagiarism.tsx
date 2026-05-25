import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/teacher/plagiarism")({ component: Plagiarism });

const pairs = [
  { a: "Priya S.", b: "Aarav M.", sim: 96, status: "open" },
  { a: "Rohan K.", b: "Kabir T.", sim: 91, status: "open" },
  { a: "Diya P.", b: "Ishaan R.", sim: 87, status: "reviewed" },
  { a: "Nikhil V.", b: "Sara M.", sim: 84, status: "open" },
  { a: "Tanvi G.", b: "Arjun L.", sim: 82, status: "open" },
  { a: "Mira S.", b: "Karthik J.", sim: 78, status: "dismissed" },
];

const code = [
  { t: "def two_sum(nums, target):", hl: false },
  { t: "    seen = {}", hl: true },
  { t: "    for i, n in enumerate(nums):", hl: true },
  { t: "        diff = target - n", hl: true },
  { t: "        if diff in seen:", hl: true },
  { t: "            return [seen[diff], i]", hl: true },
  { t: "        seen[n] = i", hl: true },
  { t: "    return []", hl: false },
];

function DiffPane({ name }: { name: string }) {
  return (
    <div className="bg-code-bg">
      <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">{name}.py</div>
      <pre className="px-4 py-3 font-mono text-[12.5px] leading-6">
        {code.map((l, i) => (
          <div key={i} className={l.hl ? "bg-warning/15 text-foreground" : "text-foreground"}>
            <span className="mr-3 text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>{l.t}
          </div>
        ))}
      </pre>
    </div>
  );
}

function Plagiarism() {
  const [active, setActive] = useState<typeof pairs[number] | null>(null);
  return (
    <div className="min-h-screen">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="text-muted-foreground">Contests <span className="mx-1">→</span> DSA Lab Exam 3 <span className="mx-1">→</span> <span className="text-foreground">Plagiarism report</span></div>
        <button className="text-xs text-muted-foreground hover:text-foreground">sort by similarity ↓</button>
      </ContextBar>
      <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-10">
        <h1 className="font-serif text-4xl text-foreground">Plagiarism report</h1>
        <p className="mt-3 text-sm text-muted-foreground"><span className="text-foreground">14 submission pairs</span> flagged above 80% similarity · run against MOSS, sorted by score.</p>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {pairs.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_100px_100px] items-center gap-4 py-4 text-sm">
              <div className="flex items-center gap-3 text-foreground">
                <span>{p.a}</span><span className="text-muted-foreground">↔</span><span>{p.b}</span>
              </div>
              <span className={`font-mono text-sm ${p.sim > 90 ? "text-danger" : "text-warning"}`}>{p.sim}%</span>
              <span className={`rounded-full px-2.5 py-0.5 text-center text-[11px] ${p.status === "open" ? "bg-warning/15 text-warning" : p.status === "reviewed" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}>{p.status}</span>
              <button onClick={() => setActive(p)} className="text-right text-sm text-foreground hover:underline">View diff →</button>
            </div>
          ))}
        </div>
      </div>
      {active && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setActive(null)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[820px] max-w-[95vw] overflow-y-auto border-l border-border bg-surface shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <div>
                <div className="font-serif text-xl text-foreground">{active.a} ↔ {active.b}</div>
                <div className="text-xs text-muted-foreground">similarity <span className="font-mono text-danger">{active.sim}%</span> · 24 matching lines</div>
              </div>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              <DiffPane name={active.a} />
              <DiffPane name={active.b} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
