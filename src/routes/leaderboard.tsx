import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState, useMemo } from "react";
import { Search, Trophy, Medal, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({ component: LeaderboardPage });

interface StudentRank {
  rank: number;
  name: string;
  department: string;
  batch: string;
  rating: number;
  solved: number;
  contests: number;
  isCurrentUser?: boolean;
}

const mockRankings: StudentRank[] = [
  { rank: 1, name: "Priya Sharma", department: "CSE", batch: "2026", rating: 1840, solved: 214, contests: 24 },
  { rank: 2, name: "Rohan Kapoor", department: "CSE", batch: "2026", rating: 1720, solved: 189, contests: 22 },
  { rank: 3, name: "Diya Patel", department: "IT", batch: "2026", rating: 1650, solved: 176, contests: 23 },
  { rank: 4, name: "Kabir Thakur", department: "ECE", batch: "2025", rating: 1590, solved: 154, contests: 20 },
  { rank: 5, name: "Ishaan Reddy", department: "CSE", batch: "2026", rating: 1480, solved: 122, contests: 18 },
  { rank: 6, name: "Sara Mehta", department: "CSE", batch: "2027", rating: 1420, solved: 104, contests: 12 },
  { rank: 12, name: "Aarav Mehta", department: "CSE", batch: "2026", rating: 1340, solved: 47, contests: 9, isCurrentUser: true },
  { rank: 7, name: "Nikhil Verma", department: "IT", batch: "2026", rating: 1380, solved: 95, contests: 14 },
  { rank: 8, name: "Tanvi Gupta", department: "CSE", batch: "2026", rating: 1350, solved: 88, contests: 15 },
  { rank: 9, name: "Arjun Lal", department: "ECE", batch: "2026", rating: 1310, solved: 76, contests: 10 },
  { rank: 10, name: "Mira Sen", department: "ME", batch: "2025", rating: 1280, solved: 62, contests: 8 },
  { rank: 11, name: "Karthik Jay", department: "CSE", batch: "2026", rating: 1250, solved: 55, contests: 9 }
];

function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [batch, setBatch] = useState("All");

  const filteredRankings = useMemo(() => {
    let list = [...mockRankings];

    if (dept !== "All") {
      list = list.filter((r) => r.department === dept);
    }
    if (batch !== "All") {
      list = list.filter((r) => r.batch === batch);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }

    // Sort by rank ascending
    return list.sort((a, b) => a.rank - b.rank);
  }, [search, dept, batch]);

  // Extract top 3 for podium visualization
  const podium = useMemo(() => {
    const sorted = [...mockRankings].sort((a, b) => a.rank - b.rank);
    return {
      first: sorted.find((r) => r.rank === 1),
      second: sorted.find((r) => r.rank === 2),
      third: sorted.find((r) => r.rank === 3),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="student" />
      
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Global Leaderboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Dept:</span>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="CSE" className="bg-popover text-foreground">CSE</option>
              <option value="IT" className="bg-popover text-foreground">IT</option>
              <option value="ECE" className="bg-popover text-foreground">ECE</option>
              <option value="ME" className="bg-popover text-foreground">ME</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Batch:</span>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="2025" className="bg-popover text-foreground">2025</option>
              <option value="2026" className="bg-popover text-foreground">2026</option>
              <option value="2027" className="bg-popover text-foreground">2027</option>
            </select>
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1000px] px-6 pt-10">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Leaderboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rankings and ratings for all student programmers on campus.
          </p>
        </div>

        {/* Podium visualization for top 3 */}
        <div className="mt-10 flex flex-col md:flex-row justify-center items-end gap-6 border-b border-border pb-12">
          {/* 2nd Place */}
          {podium.second && (
            <div className="flex flex-col items-center group order-2 md:order-1">
              <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-serif text-lg font-bold text-slate-500 border border-slate-300 shadow-sm">
                🥈
              </div>
              <span className="text-sm font-semibold text-foreground">{podium.second.name}</span>
              <span className="text-xs text-muted-foreground">{podium.second.department} · {podium.second.rating}</span>
              <div className="mt-3 h-28 w-32 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800/40 dark:to-slate-900/40 border-t-2 border-slate-300 rounded-t-xl flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-slate-400">2nd</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {podium.first && (
            <div className="flex flex-col items-center group order-1 md:order-2">
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 font-serif text-xl font-bold text-amber-600 border border-amber-300 shadow-md">
                👑
              </div>
              <span className="text-base font-bold text-foreground">{podium.first.name}</span>
              <span className="text-xs text-muted-foreground">{podium.first.department} · {podium.first.rating}</span>
              <div className="mt-3 h-36 w-36 bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-500/20 dark:to-amber-600/10 border-t-2 border-amber-400 rounded-t-xl flex items-center justify-center">
                <span className="font-serif text-4xl font-bold text-amber-500">1st</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {podium.third && (
            <div className="flex flex-col items-center group order-3">
              <div className="relative mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-serif text-base font-bold text-orange-600 border border-orange-300 shadow-sm">
                🥉
              </div>
              <span className="text-sm font-semibold text-foreground">{podium.third.name}</span>
              <span className="text-xs text-muted-foreground">{podium.third.department} · {podium.third.rating}</span>
              <div className="mt-3 h-20 w-32 bg-gradient-to-t from-orange-200 to-orange-100 dark:from-orange-800/30 dark:to-orange-900/30 border-t-2 border-orange-300 rounded-t-xl flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-orange-500">3rd</span>
              </div>
            </div>
          )}
        </div>

        {/* Search bar & list */}
        <div className="mt-10 space-y-4">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student rank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  <th className="py-3.5 px-6 font-semibold">Rank</th>
                  <th className="py-3.5 px-6 font-semibold">Name</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Department</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Batch</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Rating</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Solved</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Contests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRankings.map((student) => (
                  <tr
                    key={student.name}
                    className={`text-sm transition-colors hover:bg-hover-row ${
                      student.isCurrentUser
                        ? "bg-primary/5 text-primary font-semibold border-y border-primary/20"
                        : "text-foreground"
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-medium">
                      {student.rank === 1 ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">1</span>
                      ) : student.rank === 2 ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-bold">2</span>
                      ) : student.rank === 3 ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">3</span>
                      ) : (
                        `#${student.rank}`
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{student.department}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{student.batch}</td>
                    <td className="py-4 px-6 text-right font-mono font-semibold">{student.rating}</td>
                    <td className="py-4 px-6 text-right font-mono text-muted-foreground">{student.solved}</td>
                    <td className="py-4 px-6 text-right font-mono text-muted-foreground">{student.contests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground">Showing 1-12 of {mockRankings.length} rankings</span>
            <div className="flex items-center gap-2">
              <button disabled className="rounded-lg border border-border p-1.5 text-muted-foreground opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button disabled className="rounded-lg border border-border p-1.5 text-muted-foreground opacity-50 cursor-not-allowed">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
