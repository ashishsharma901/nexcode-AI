import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState, useMemo } from "react";
import { Search, X, Check, FileSpreadsheet, Send, FileText, ChevronRight, User } from "lucide-react";

export const Route = createFileRoute("/teacher/students")({ component: TeacherStudentsPage });

interface StudentRecord {
  id: string;
  name: string;
  roll: string;
  dept: string;
  batch: string;
  solved: number;
  rating: number;
  status: "Active" | "Inactive" | "Flagged";
  accuracy: number;
  solvedBreakdown: { easy: number; med: number; hard: number };
}

const mockStudents: StudentRecord[] = [
  { id: "s1", name: "Priya Sharma", roll: "CS26F1002", dept: "CSE", batch: "22-26", solved: 214, rating: 1840, status: "Active", accuracy: 84, solvedBreakdown: { easy: 80, med: 100, hard: 34 } },
  { id: "s2", name: "Rohan Kapoor", roll: "CS26F1012", dept: "CSE", batch: "22-26", solved: 189, rating: 1720, status: "Active", accuracy: 78, solvedBreakdown: { easy: 70, med: 90, hard: 29 } },
  { id: "s3", name: "Diya Patel", roll: "IT26F2004", dept: "IT", batch: "22-26", solved: 176, rating: 1650, status: "Active", accuracy: 74, solvedBreakdown: { easy: 65, med: 85, hard: 26 } },
  { id: "s4", name: "Kabir Thakur", roll: "EC25F3011", dept: "ECE", batch: "21-25", solved: 154, rating: 1590, status: "Flagged", accuracy: 68, solvedBreakdown: { easy: 60, med: 70, hard: 24 } },
  { id: "s5", name: "Ishaan Reddy", roll: "CS26F1034", dept: "CSE", batch: "22-26", solved: 122, rating: 1480, status: "Active", accuracy: 70, solvedBreakdown: { easy: 50, med: 55, hard: 17 } },
  { id: "s6", name: "Aarav Mehta", roll: "CS26F1023", dept: "CSE", batch: "22-26", solved: 47, rating: 1340, status: "Active", accuracy: 68, solvedBreakdown: { easy: 20, med: 22, hard: 5 } },
  { id: "s7", name: "Nikhil Verma", roll: "IT26F2018", dept: "IT", batch: "22-26", solved: 95, rating: 1380, status: "Inactive", accuracy: 62, solvedBreakdown: { easy: 45, med: 40, hard: 10 } }
];

function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailStudent, setDetailStudent] = useState<StudentRecord | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop row click trigger
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "All" || s.dept === deptFilter;
      const matchesBatch = batchFilter === "All" || s.batch === batchFilter;
      return matchesSearch && matchesDept && matchesBatch;
    });
  }, [search, deptFilter, batchFilter]);

  const handleBulkAssign = () => {
    alert(`Assigned practice sheet to ${selectedIds.length} student(s)`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    alert(`Exported CSV list for ${selectedIds.length || filtered.length} students`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Students</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="CSE" className="bg-popover text-foreground">CSE</option>
              <option value="IT" className="bg-popover text-foreground">IT</option>
              <option value="ECE" className="bg-popover text-foreground">ECE</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="22-26" className="bg-popover text-foreground">22-26</option>
              <option value="21-25" className="bg-popover text-foreground">21-25</option>
            </select>
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Students</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor programming achievements, performance metrics, and activity indicators.
            </p>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkAssign}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 px-4 py-2 text-xs font-semibold text-primary transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" /> Assign Sheet ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-full border border-border hover:bg-muted px-4 py-2 text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-success" /> Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <th className="py-4 px-6 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">Roll Number</th>
                <th className="py-4 px-6 font-semibold text-center">Dept</th>
                <th className="py-4 px-6 font-semibold text-center">Batch</th>
                <th className="py-4 px-6 font-semibold text-right">Solved</th>
                <th className="py-4 px-6 font-semibold text-right">Rating</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const isSelected = selectedIds.includes(s.id);
                return (
                  <tr
                    key={s.id}
                    onClick={() => setDetailStudent(s)}
                    className={`text-sm hover:bg-hover-row cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelect(s.id, e as any)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground">{s.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{s.roll}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{s.dept}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{s.batch}</td>
                    <td className="py-4 px-6 text-right font-mono font-medium text-muted-foreground">{s.solved}</td>
                    <td className="py-4 px-6 text-right font-mono font-semibold text-foreground">{s.rating}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        s.status === "Active" ? "bg-success/15 text-success" : s.status === "Flagged" ? "bg-danger/15 text-danger" : "bg-muted text-muted-foreground"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side drawer detail panel */}
      {detailStudent && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setDetailStudent(null)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[420px] max-w-[95vw] border-l border-border bg-surface p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-foreground font-semibold">{detailStudent.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">{detailStudent.roll} · {detailStudent.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 space-y-8">
              {/* Performance Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Rating Score</span>
                  <span className="font-serif text-3xl font-bold text-foreground mt-1 block">{detailStudent.rating}</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Coding Accuracy</span>
                  <span className="font-serif text-3xl font-bold text-foreground mt-1 block">{detailStudent.accuracy}%</span>
                </div>
              </div>

              {/* Solved breakdown progress bars */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Problem Solving Metrics</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-success font-medium">Easy Problems</span>
                      <span className="font-mono text-muted-foreground">{detailStudent.solvedBreakdown.easy} solved</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${Math.min(100, (detailStudent.solvedBreakdown.easy / 100) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warning font-medium">Medium Problems</span>
                      <span className="font-mono text-muted-foreground">{detailStudent.solvedBreakdown.med} solved</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: `${Math.min(100, (detailStudent.solvedBreakdown.med / 100) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-danger font-medium">Hard Problems</span>
                      <span className="font-mono text-muted-foreground">{detailStudent.solvedBreakdown.hard} solved</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-danger rounded-full" style={{ width: `${Math.min(100, (detailStudent.solvedBreakdown.hard / 50) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance actions */}
              <div className="border-t border-border pt-6 space-y-3 text-sm">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Teacher Commands</h4>
                <button
                  onClick={() => alert(`Assigned custom sheet to ${detailStudent.name}`)}
                  className="flex items-center gap-2 rounded-lg border border-border hover:bg-muted w-full px-4 py-2.5 font-semibold text-foreground transition-all text-left cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-primary" /> Assign Practice Sheet
                </button>
                <button
                  onClick={() => alert(`Sending alert notification to ${detailStudent.name}`)}
                  className="flex items-center gap-2 rounded-lg border border-border hover:bg-muted w-full px-4 py-2.5 font-semibold text-foreground transition-all text-left cursor-pointer"
                >
                  <Send className="h-4 w-4 text-warning" /> Send Attention Notice
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
