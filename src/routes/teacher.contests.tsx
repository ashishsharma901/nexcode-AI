import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { Plus, Search, Calendar, Users, Eye, Edit, Trash, Copy } from "lucide-react";

export const Route = createFileRoute("/teacher/contests")({ component: TeacherContests });

interface ContestItem {
  id: string;
  name: string;
  type: "Exam" | "Practice" | "Rated Contest";
  status: "Draft" | "Scheduled" | "Live" | "Ended";
  participants: number;
  date: string;
}

function TeacherContests() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [contests, setContests] = useState<ContestItem[]>([
    { id: "c1", name: "DSA Lab Exam 3", type: "Exam", status: "Live", participants: 64, date: "May 25, 1:00 PM" },
    { id: "c2", name: "Weekly Practice #18", type: "Practice", status: "Live", participants: 142, date: "May 24, 8:00 AM" },
    { id: "c3", name: "Algorithm Sprint V", type: "Rated Contest", status: "Scheduled", participants: 0, date: "May 28, 6:00 PM" },
    { id: "c4", name: "Placement Screening Test", type: "Exam", status: "Draft", participants: 0, date: "TBD" },
    { id: "c5", name: "DSA Lab Exam 2", type: "Exam", status: "Ended", participants: 62, date: "May 11, 1:00 PM" },
    { id: "c6", name: "Weekly Practice #17", type: "Practice", status: "Ended", participants: 134, date: "May 10, 8:00 AM" }
  ]);

  const handleDelete = (id: string) => {
    setContests((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDuplicate = (contest: ContestItem) => {
    const duplicated: ContestItem = {
      ...contest,
      id: Math.random().toString(),
      name: `${contest.name} (Copy)`,
      status: "Draft",
      participants: 0
    };
    setContests((prev) => [duplicated, ...prev]);
  };

  const getStatusColor = (status: ContestItem["status"]) => {
    switch (status) {
      case "Live": return "bg-success/15 text-success";
      case "Scheduled": return "bg-primary/10 text-primary";
      case "Ended": return "bg-muted text-muted-foreground";
      case "Draft": return "bg-warning/15 text-warning";
    }
  };

  const filtered = contests.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Contests</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="Live" className="bg-popover text-foreground">Live</option>
              <option value="Scheduled" className="bg-popover text-foreground">Scheduled</option>
              <option value="Draft" className="bg-popover text-foreground">Draft</option>
              <option value="Ended" className="bg-popover text-foreground">Ended</option>
            </select>
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Contests</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule, design and supervise your academic test programming sprints.
            </p>
          </div>
          
          <Link
            to="/teacher/contests/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Create Contest
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contest title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  <th className="py-4 px-6 font-semibold">Contest name</th>
                  <th className="py-4 px-6 font-semibold">Type</th>
                  <th className="py-4 px-6 font-semibold text-center">Status</th>
                  <th className="py-4 px-6 font-semibold text-center">Participants</th>
                  <th className="py-4 px-6 font-semibold">Date & Time</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="text-sm hover:bg-hover-row transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-serif text-lg font-medium text-foreground block">{c.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{c.type}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(c.status)}`}>
                        {c.status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-medium text-muted-foreground">{c.participants}</td>
                    <td className="py-4 px-6 font-sans text-xs text-muted-foreground">{c.date}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "Ended" && (
                          <Link
                            to="/teacher/plagiarism"
                            className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                            title="Plagiarism MOSS Report"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDuplicate(c)}
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                          title="Duplicate Contest"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                          title="Edit Basic Info"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="rounded p-1.5 text-danger hover:bg-danger/10 transition-all cursor-pointer"
                          title="Delete Contest"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
