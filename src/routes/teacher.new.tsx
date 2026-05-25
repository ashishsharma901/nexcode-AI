import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/top-nav";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/teacher/new")({ component: NewQuestion });

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="text-sm text-foreground">{label}</div>
      <div className="h-px flex-1 bg-border" />
      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /> add</button>
    </div>
  );
}

function NewQuestion() {
  return (
    <div className="min-h-screen pb-28">
      <TopNav role="teacher" />
      <div className="mx-auto max-w-[800px] px-6 pt-16">
        <input defaultValue="New question" className="w-full border-0 bg-transparent font-serif text-5xl text-foreground outline-none placeholder:text-muted-foreground" />
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            {["Easy", "Medium", "Hard"].map((d, i) => (
              <button key={d} className={`rounded-full px-3 py-1 text-xs ${i === 1 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>{d}</button>
            ))}
          </div>
          <button className="text-muted-foreground hover:text-foreground">Topic: Graphs ▾</button>
          <div className="flex flex-wrap items-center gap-1.5">
            {["bfs", "shortest-path"].map((t) => (
              <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">#{t}</span>
            ))}
            <input placeholder="add tag…" className="border-0 bg-transparent text-[11px] text-muted-foreground outline-none" />
          </div>
        </div>
        <hr className="my-10 border-border" />
        <div>
          <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
            <button className="hover:text-foreground"><b>B</b></button>
            <button className="italic hover:text-foreground">I</button>
            <button className="font-mono hover:text-foreground">{`</>`}</button>
            <button className="hover:text-foreground">∑</button>
            <button className="hover:text-foreground">img</button>
          </div>
          <textarea rows={8} defaultValue={"Write the problem statement here. Use prose, not bullet points — make it read like a story the student steps into.\n\nGiven a directed graph..."} className="w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-foreground outline-none" />
        </div>
        <SectionDivider label="Constraints" />
        <textarea rows={3} defaultValue={"1 ≤ n ≤ 1000\nedges are unique\ncapacities fit in int32"} className="w-full resize-none border-0 bg-context-bar p-4 font-mono text-[13px] text-foreground outline-none" />
        <SectionDivider label="Examples" />
        <div className="space-y-3">
          <div className="rounded-md border border-border p-4">
            <div className="font-mono text-xs text-muted-foreground">Input</div>
            <div className="mt-1 font-mono text-sm text-foreground">n=4, edges=[[0,1,3]]</div>
            <div className="mt-3 font-mono text-xs text-muted-foreground">Output</div>
            <div className="mt-1 font-mono text-sm text-foreground">3</div>
          </div>
        </div>
        <SectionDivider label="Test cases" />
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Drop a .txt file or paste cases below</div>
        <SectionDivider label="Starter code" />
        <div className="flex gap-4 border-b border-border text-xs">
          {["Python", "C++", "Java"].map((l, i) => (
            <button key={l} className={`-mb-px border-b-2 pb-2 ${i === 0 ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
        <pre className="mt-3 rounded-md bg-code-bg p-4 font-mono text-[13px] text-foreground">{`def max_flow(n, edges, s, t):
    # write your solution
    pass`}</pre>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-6 py-3">
          <button className="text-sm text-muted-foreground hover:text-foreground">Save draft</button>
          <button className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:opacity-90">Publish</button>
        </div>
      </div>
    </div>
  );
}
