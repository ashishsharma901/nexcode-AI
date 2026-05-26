import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Trophy, X, ArrowLeft, Play, Sparkles, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contest")({ component: Contest });

interface ContestProblem {
  id: string;
  p: string;
  title: string;
  status: "ok" | "wa" | "";
  description: string;
  constraints: string[];
  exampleInput: string;
  exampleOutput: string;
  starterCode: string;
}

const mockProblems: ContestProblem[] = [
  {
    id: "p1",
    p: "P1",
    title: "Two Sum",
    status: "ok",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    exampleInput: "nums = [2,7,11,15], target = 9",
    exampleOutput: "[0,1]",
    starterCode: "def two_sum(nums, target):\n    # Write your solution here\n    pass"
  },
  {
    id: "p2",
    p: "P2",
    title: "LRU Cache",
    status: "ok",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations in O(1) time complexity.",
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5"],
    exampleInput: "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.get(1);",
    exampleOutput: "1",
    starterCode: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        pass"
  },
  {
    id: "p3",
    p: "P3",
    title: "Maximum Network Flow",
    status: "wa",
    description: "Given a directed graph representing a network of pipes with capacities, find the maximum flow from source s to sink t. You need to implement the Ford-Fulkerson or Edmonds-Karp algorithm.",
    constraints: ["2 <= n <= 100", "0 <= edges.length <= 1000", "capacities fit in 32-bit signed integer"],
    exampleInput: "n=4, edges=[[0,1,3],[0,2,2],[1,2,1],[1,3,2],[2,3,3]]",
    exampleOutput: "5",
    starterCode: "def max_flow(n, edges, s, t):\n    # Build residual graph\n    # Implement max flow algorithm\n    pass"
  },
  {
    id: "p4",
    p: "P4",
    title: "Word Ladder",
    status: "",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the number of words in the shortest transformation sequence.",
    constraints: ["1 <= beginWord.length <= 10", "wordList.length <= 5000", "All words are lowercase English letters"],
    exampleInput: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
    exampleOutput: "5",
    starterCode: "def ladderLength(beginWord: str, endWord: str, wordList: List[str]) -> int:\n    # Write your solution here\n    pass"
  }
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
  const [activeProblemIdx, setActiveProblemIdx] = useState(2); // Start at P3
  const [timeLeft, setTimeLeft] = useState(2538); // 42 minutes and 18 seconds in seconds
  const [code, setCode] = useState(mockProblems[2].starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [runSuccess, setRunSuccess] = useState(false);

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // User may deny fullscreen — that's ok
      }
    };
    enterFullscreen();

    // Exit fullscreen on unmount (leaving contest)
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Sync starter code when active problem changes
  useEffect(() => {
    setCode(mockProblems[activeProblemIdx].starterCode);
    setRunSuccess(false);
  }, [activeProblemIdx]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0")
    ].join(":");
  };

  const getTimerColorClass = () => {
    if (timeLeft < 300) return "text-danger font-semibold animate-pulse"; // < 5min: red
    if (timeLeft < 600) return "text-warning font-semibold"; // < 10min: yellow
    return "text-white";
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunSuccess(true);
    }, 1000);
  };

  const activeProblem = mockProblems[activeProblemIdx];
  const codeLines = code.split("\n");

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between bg-[#1A1A18] px-6 text-white">
        <div className="flex items-center gap-3">
          <Link to="/contests" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-serif text-base">DSA Lab Exam 3</span>
        </div>
        
        {/* Problem selection tabs */}
        <div className="flex items-center gap-2 bg-[#2D2D2A] rounded-lg p-0.5 border border-white/5">
          {mockProblems.map((p, idx) => (
            <button
              key={p.p}
              onClick={() => setActiveProblemIdx(idx)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeProblemIdx === idx
                  ? "bg-foreground text-background shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                p.status === "ok" ? "bg-success" : p.status === "wa" ? "bg-danger" : "bg-white/30"
              }`} />
              {p.p}
            </button>
          ))}
        </div>
        
        <div className={`font-mono text-base tabular-nums transition-colors ${getTimerColorClass()}`}>
          {formatTime(timeLeft)}
        </div>
      </header>
      
      <div className="grid flex-1 grid-cols-[45fr_55fr] overflow-hidden">
        {/* Left column: Problem Details */}
        <div className="overflow-y-auto border-r border-border px-10 py-10 flex flex-col space-y-6">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Problem {activeProblemIdx + 1} of {mockProblems.length}
            </div>
            <h1 className="mt-2 font-serif text-3xl text-foreground">{activeProblem.title}</h1>
          </div>
          
          <article className="max-w-prose text-[15px] leading-relaxed text-foreground space-y-4">
            <p>{activeProblem.description}</p>
            
            <div className="rounded-xl bg-context-bar p-5 border border-border">
              <div className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Constraints</div>
              <ul className="list-disc list-inside space-y-1 font-mono text-[12px] text-muted-foreground">
                {activeProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            
            <div className="border-l-2 border-primary bg-muted/20 px-5 py-4 font-mono text-[12.5px] text-foreground rounded-r-lg">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Example</div>
              <div className="space-y-1">
                <div><span className="text-muted-foreground">Input:</span> {activeProblem.exampleInput}</div>
                <div><span className="text-muted-foreground">Output:</span> {activeProblem.exampleOutput}</div>
              </div>
            </div>
          </article>
        </div>
        
        {/* Right column: Editor & Simple Console */}
        <div className="flex flex-col bg-code-bg overflow-hidden relative">
          <div className="flex items-center justify-between border-b border-border/10 px-6 py-2 bg-code-bg text-xs">
            <span className="text-muted-foreground font-mono">Python 3 (contest_env)</span>
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="rounded bg-white hover:bg-white/90 px-3 py-1.5 text-black font-semibold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="h-3 w-3" />
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="rounded bg-orange-500 hover:bg-orange-600 px-4 py-1.5 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="h-3 w-3" />
                Submit
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers */}
            <div className="py-6 px-3 bg-code-bg text-right font-mono text-[13px] text-muted-foreground/30 select-none border-r border-border/10 leading-6 min-w-[2.5rem]">
              {codeLines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            
            {/* Input area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 py-6 px-4 bg-transparent font-mono text-[13px] leading-6 text-foreground outline-none resize-none overflow-y-auto h-full"
              spellCheck="false"
            />
          </div>

          {runSuccess && (
            <div className="border-t border-border/20 bg-background/95 backdrop-blur px-6 py-4 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center gap-2 text-xs mb-2">
                {activeProblem.status === "ok" ? (
                  <span className="text-success font-semibold">✓ Test Cases Passed</span>
                ) : (
                  <span className="text-danger font-semibold">✗ Wrong Answer (Failed at case 3)</span>
                )}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {activeProblem.status === "ok" ? (
                  <div>Expected: {activeProblem.exampleOutput} | Got: {activeProblem.exampleOutput}</div>
                ) : (
                  <div>Expected: {activeProblem.exampleOutput} | Got: None (or empty array)</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating leaderboard trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground shadow-lg hover:bg-hover-row cursor-pointer transition-transform hover:scale-105"
      >
        <Trophy className="h-4 w-4 text-warning" />
        <span>Leaderboard</span>
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all" onClick={() => setOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[380px] border-l border-border bg-surface p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Leaderboard</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">DSA Lab Exam 3 · live updates</div>
            <div className="mt-6 divide-y divide-border">
              {ranks.map((r) => (
                <div key={r.r} className={`flex items-center justify-between py-3.5 ${r.n.startsWith("Aarav") ? "text-primary font-semibold" : "text-foreground"}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-6 font-mono text-sm text-muted-foreground">{r.r}</span>
                    <span className="text-sm">{r.n}</span>
                  </div>
                  <span className="font-mono text-sm">{r.s} pts</span>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

