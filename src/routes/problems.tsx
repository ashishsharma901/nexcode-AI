import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { Check, Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/problems")({ component: Problems });

const filters = ["All", "Easy", "Medium", "Hard", "Arrays", "Strings", "Graphs", "DP", "Unsolved"];
const diffColor: Record<string, string> = { Easy: "bg-success", Medium: "bg-warning", Hard: "bg-danger" };

const mockProblems = [
  { id: 1, title: "Two Sum", diff: "Easy", topic: "Arrays", acc: 72, solved: true },
  { id: 2, title: "Longest Substring Without Repeating Characters", diff: "Medium", topic: "Strings", acc: 41, solved: true },
  { id: 3, title: "Median of Two Sorted Arrays", diff: "Hard", topic: "Arrays", acc: 28, solved: false },
  { id: 4, title: "Valid Parentheses", diff: "Easy", topic: "Strings", acc: 68, solved: true },
  { id: 5, title: "Merge k Sorted Lists", diff: "Hard", topic: "Graphs", acc: 35, solved: false },
  { id: 6, title: "Course Schedule II", diff: "Medium", topic: "Graphs", acc: 47, solved: false },
  { id: 7, title: "Word Ladder", diff: "Hard", topic: "Graphs", acc: 24, solved: false },
  { id: 8, title: "Coin Change", diff: "Medium", topic: "DP", acc: 39, solved: true },
  { id: 9, title: "LRU Cache", diff: "Medium", topic: "DP", acc: 44, solved: true },
  { id: 10, title: "Trapping Rain Water", diff: "Hard", topic: "Arrays", acc: 31, solved: false },
  { id: 11, title: "Maximum Subarray", diff: "Easy", topic: "DP", acc: 65, solved: true },
  { id: 12, title: "Number of Islands", diff: "Medium", topic: "Graphs", acc: 51, solved: false },
];

function Problems() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "diff" | "acc">("title");

  const filteredProblems = useMemo(() => {
    let result = [...mockProblems];

    // Filter by tag/difficulty
    if (activeFilter !== "All") {
      if (activeFilter === "Easy" || activeFilter === "Medium" || activeFilter === "Hard") {
        result = result.filter((p) => p.diff === activeFilter);
      } else if (activeFilter === "Unsolved") {
        result = result.filter((p) => !p.solved);
      } else {
        result = result.filter((p) => p.topic.toLowerCase() === activeFilter.toLowerCase());
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "acc") {
        return b.acc - a.acc;
      } else if (sortBy === "diff") {
        const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
        return diffWeight[a.diff as keyof typeof diffWeight] - diffWeight[b.diff as keyof typeof diffWeight];
      }
      return 0;
    });

    return result;
  }, [activeFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pb-20">
      <TopNav role="student" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Problems</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-[70%] no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition-all ${
                activeFilter === f
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </ContextBar>
      
      <div className="mx-auto max-w-[1200px] px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Problems</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredProblems.length} problems matching filter · curated for the CSE-2026 batch.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 rounded-full border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            {/* Sort select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent pl-3 pr-8 py-2 rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="title" className="bg-popover text-foreground">Sort: A-Z</option>
                <option value="diff" className="bg-popover text-foreground">Sort: Difficulty</option>
                <option value="acc" className="bg-popover text-foreground">Sort: Acceptance</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {filteredProblems.length > 0 ? (
          <div className="mt-8 divide-y divide-border border-y border-border">
            {filteredProblems.map((p) => (
              <Link
                to="/problem"
                key={p.id}
                className="group grid grid-cols-[16px_1fr_160px_80px_24px] items-center gap-4 px-2 py-4 transition-colors hover:bg-hover-row"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${diffColor[p.diff]}`} />
                <span className="text-sm font-medium text-foreground group-hover:underline">{p.title}</span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-center text-[11px] font-medium text-muted-foreground w-fit mx-auto">
                  {p.topic}
                </span>
                <span className="text-right font-mono text-xs text-muted-foreground">{p.acc}%</span>
                <div className="flex justify-end">
                  {p.solved ? <Check className="h-4 w-4 text-success" /> : <span />}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">No problems found matching your criteria.</p>
            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-semibold text-primary hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-hover-row hover:text-foreground cursor-pointer">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}

