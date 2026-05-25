import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { Check } from "lucide-react";

export const Route = createFileRoute("/problems")({ component: Problems });

const filters = ["All", "Easy", "Medium", "Hard", "Arrays", "Strings", "Graphs", "DP", "Unsolved"];
const diffColor: Record<string, string> = { Easy: "bg-success", Medium: "bg-warning", Hard: "bg-danger" };

const problems = [
  { id: 1, title: "Two Sum", diff: "Easy", topic: "Hashing", acc: 72, solved: true },
  { id: 2, title: "Longest Substring Without Repeating Characters", diff: "Medium", topic: "Sliding Window", acc: 41, solved: true },
  { id: 3, title: "Median of Two Sorted Arrays", diff: "Hard", topic: "Binary Search", acc: 28, solved: false },
  { id: 4, title: "Valid Parentheses", diff: "Easy", topic: "Stack", acc: 68, solved: true },
  { id: 5, title: "Merge k Sorted Lists", diff: "Hard", topic: "Heap", acc: 35, solved: false },
  { id: 6, title: "Course Schedule II", diff: "Medium", topic: "Graphs", acc: 47, solved: false },
  { id: 7, title: "Word Ladder", diff: "Hard", topic: "BFS", acc: 24, solved: false },
  { id: 8, title: "Coin Change", diff: "Medium", topic: "DP", acc: 39, solved: true },
  { id: 9, title: "LRU Cache", diff: "Medium", topic: "Design", acc: 44, solved: true },
  { id: 10, title: "Trapping Rain Water", diff: "Hard", topic: "Two Pointers", acc: 31, solved: false },
  { id: 11, title: "Maximum Subarray", diff: "Easy", topic: "DP", acc: 65, solved: true },
  { id: 12, title: "Number of Islands", diff: "Medium", topic: "Graphs", acc: 51, solved: false },
];

function Problems() {
  return (
    <div className="min-h-screen">
      <TopNav role="student" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground"><span>Problems</span></div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {filters.map((f, i) => (
            <button key={f} className={`rounded-full px-3 py-1 text-xs transition-colors ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </ContextBar>
      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-10">
        <h1 className="font-serif text-4xl text-foreground">Problems</h1>
        <p className="mt-2 text-sm text-muted-foreground">412 problems · curated for the CSE-2026 batch.</p>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {problems.map((p) => (
            <Link to="/problem" key={p.id} className="group grid grid-cols-[16px_1fr_160px_80px_24px] items-center gap-4 px-2 py-3.5 transition-colors hover:bg-hover-row">
              <span className={`h-1.5 w-1.5 rounded-full ${diffColor[p.diff]}`} />
              <span className="text-sm text-foreground group-hover:underline">{p.title}</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-center text-[11px] text-muted-foreground">{p.topic}</span>
              <span className="text-right font-mono text-xs text-muted-foreground">{p.acc}%</span>
              {p.solved ? <Check className="h-3.5 w-3.5 text-success" /> : <span />}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="rounded-full border border-border px-5 py-2 text-xs text-muted-foreground transition-colors hover:bg-hover-row hover:text-foreground">Load more</button>
        </div>
      </div>
    </div>
  );
}
