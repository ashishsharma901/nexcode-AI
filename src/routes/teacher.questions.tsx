import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState, useMemo } from "react";
import { Search, Plus, Edit, Copy, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/teacher/questions")({ component: QuestionBank });

interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  subtopic: string;
  tags: string[];
  testCases: number;
  usedIn: number;
  createdAt: string;
  acceptance: number;
}

const mockQuestions: Question[] = [
  { id: "q1", title: "Two Sum", difficulty: "Easy", topic: "Arrays", subtopic: "Hash Map", tags: ["hash-map", "two-pointer"], testCases: 15, usedIn: 4, createdAt: "Jan 12", acceptance: 72 },
  { id: "q2", title: "LRU Cache", difficulty: "Medium", topic: "Design", subtopic: "Linked List", tags: ["design", "hash-map", "linked-list"], testCases: 22, usedIn: 3, createdAt: "Jan 18", acceptance: 44 },
  { id: "q3", title: "Maximum Network Flow", difficulty: "Hard", topic: "Graphs", subtopic: "Ford-Fulkerson", tags: ["graph", "bfs", "max-flow"], testCases: 18, usedIn: 2, createdAt: "Feb 03", acceptance: 28 },
  { id: "q4", title: "Course Schedule II", difficulty: "Medium", topic: "Graphs", subtopic: "Topological Sort", tags: ["graph", "dfs", "topological-sort"], testCases: 20, usedIn: 5, createdAt: "Feb 14", acceptance: 47 },
  { id: "q5", title: "Word Ladder", difficulty: "Hard", topic: "Graphs", subtopic: "BFS", tags: ["bfs", "string"], testCases: 25, usedIn: 3, createdAt: "Feb 28", acceptance: 24 },
  { id: "q6", title: "Coin Change", difficulty: "Medium", topic: "DP", subtopic: "Unbounded Knapsack", tags: ["dp", "greedy"], testCases: 16, usedIn: 6, createdAt: "Mar 05", acceptance: 39 },
  { id: "q7", title: "Valid Parentheses", difficulty: "Easy", topic: "Strings", subtopic: "Stack", tags: ["stack", "string"], testCases: 12, usedIn: 7, createdAt: "Mar 12", acceptance: 68 },
  { id: "q8", title: "Trapping Rain Water", difficulty: "Hard", topic: "Arrays", subtopic: "Two Pointer", tags: ["two-pointer", "stack", "dp"], testCases: 19, usedIn: 2, createdAt: "Mar 20", acceptance: 31 },
  { id: "q9", title: "Number of Islands", difficulty: "Medium", topic: "Graphs", subtopic: "DFS", tags: ["dfs", "bfs", "union-find"], testCases: 14, usedIn: 4, createdAt: "Apr 02", acceptance: 51 },
  { id: "q10", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Linked List", subtopic: "Heap", tags: ["heap", "linked-list", "divide-conquer"], testCases: 17, usedIn: 1, createdAt: "Apr 15", acceptance: 35 },
  { id: "q11", title: "Maximum Subarray", difficulty: "Easy", topic: "DP", subtopic: "Kadane", tags: ["dp", "divide-conquer"], testCases: 13, usedIn: 8, createdAt: "Apr 22", acceptance: 65 },
  { id: "q12", title: "Shortest Bridge", difficulty: "Medium", topic: "Graphs", subtopic: "BFS", tags: ["bfs", "dfs", "matrix"], testCases: 21, usedIn: 2, createdAt: "May 01", acceptance: 42 },
];

const diffColor: Record<string, string> = {
  Easy: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  Hard: "bg-danger/15 text-danger",
};

function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "usedIn" | "acceptance">("createdAt");

  const topics = useMemo(() => {
    const set = new Set(mockQuestions.map((q) => q.topic));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let result = [...questions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)) || p.topic.toLowerCase().includes(q)
      );
    }
    if (diffFilter !== "All") {
      result = result.filter((p) => p.difficulty === diffFilter);
    }
    if (topicFilter !== "All") {
      result = result.filter((p) => p.topic === topicFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "usedIn") return b.usedIn - a.usedIn;
      if (sortBy === "acceptance") return b.acceptance - a.acceptance;
      return 0; // createdAt — keep original order
    });

    return result;
  }, [questions, search, diffFilter, topicFilter, sortBy]);

  const handleDuplicate = (q: Question) => {
    const dup: Question = { ...q, id: Math.random().toString(), title: `${q.title} (Copy)`, usedIn: 0, createdAt: "Today" };
    setQuestions((prev) => [dup, ...prev]);
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Question Bank</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Difficulty:</span>
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="Easy" className="bg-popover text-foreground">Easy</option>
              <option value="Medium" className="bg-popover text-foreground">Medium</option>
              <option value="Hard" className="bg-popover text-foreground">Hard</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Topic:</span>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              {topics.map((t) => (
                <option key={t} value={t} className="bg-popover text-foreground">{t}</option>
              ))}
            </select>
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Question Bank</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {filtered.length} questions · searchable by title, topic, or tag.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/teacher/upload"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Bulk Upload
            </Link>
            <Link
              to="/teacher/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> New Question
            </Link>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, topic, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="createdAt" className="bg-popover text-foreground">Recent first</option>
              <option value="title" className="bg-popover text-foreground">A → Z</option>
              <option value="usedIn" className="bg-popover text-foreground">Most used</option>
              <option value="acceptance" className="bg-popover text-foreground">Acceptance %</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <th className="py-4 px-6 font-semibold">Title</th>
                <th className="py-4 px-6 font-semibold text-center">Difficulty</th>
                <th className="py-4 px-6 font-semibold">Topic</th>
                <th className="py-4 px-6 font-semibold text-center">Test Cases</th>
                <th className="py-4 px-6 font-semibold text-center">Used In</th>
                <th className="py-4 px-6 font-semibold text-right">Acc. %</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((q) => (
                <tr key={q.id} className="text-sm hover:bg-hover-row transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-foreground">{q.title}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {q.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${diffColor[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs text-foreground">{q.topic}</span>
                    <span className="block text-[10px] text-muted-foreground">{q.subtopic}</span>
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-xs text-muted-foreground">{q.testCases}</td>
                  <td className="py-4 px-6 text-center font-mono text-xs text-muted-foreground">{q.usedIn} contests</td>
                  <td className="py-4 px-6 text-right font-mono text-xs text-muted-foreground">{q.acceptance}%</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer" title="Preview">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <Link to="/teacher/new" className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title="Edit">
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button onClick={() => handleDuplicate(q)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer" title="Duplicate">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="rounded p-1.5 text-danger hover:bg-danger/10 transition-all cursor-pointer" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">No questions match your filters.</p>
            <button
              onClick={() => { setSearch(""); setDiffFilter("All"); setTopicFilter("All"); }}
              className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
