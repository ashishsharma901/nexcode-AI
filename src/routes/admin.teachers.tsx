import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState, useMemo } from "react";
import { Search, Plus, MoreHorizontal, Check, X, Shield, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/teachers")({ component: AdminTeachers });

interface Teacher {
  id: string;
  name: string;
  email: string;
  dept: string;
  empId: string;
  status: "Active" | "Pending" | "Deactivated";
  questionsCreated: number;
  contestsRun: number;
  joinedAt: string;
}

const mockTeachers: Teacher[] = [
  { id: "t1", name: "Dr. Rao", email: "dr.rao@college.edu", dept: "CSE", empId: "EMP-1001", status: "Active", questionsCreated: 124, contestsRun: 18, joinedAt: "Jan 2024" },
  { id: "t2", name: "Dr. Meena K.", email: "meena.k@college.edu", dept: "ECE", empId: "EMP-2034", status: "Active", questionsCreated: 67, contestsRun: 8, joinedAt: "Mar 2024" },
  { id: "t3", name: "Prof. Sanjay M.", email: "sanjay.m@college.edu", dept: "IT", empId: "EMP-1089", status: "Active", questionsCreated: 45, contestsRun: 12, joinedAt: "Feb 2024" },
  { id: "t4", name: "Dr. Ananya Iyer", email: "ananya.iyer@college.edu", dept: "CSE", empId: "EMP-3012", status: "Pending", questionsCreated: 0, contestsRun: 0, joinedAt: "May 2026" },
  { id: "t5", name: "Prof. Vikram Das", email: "vikram.das@college.edu", dept: "IT", empId: "EMP-3045", status: "Pending", questionsCreated: 0, contestsRun: 0, joinedAt: "May 2026" },
  { id: "t6", name: "Dr. Priti Nair", email: "priti.nair@college.edu", dept: "CSE", empId: "EMP-0892", status: "Deactivated", questionsCreated: 32, contestsRun: 5, joinedAt: "Sep 2023" },
];

function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, statusFilter]);

  const approveTeacher = (id: string) => {
    setTeachers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Active" as const } : t));
    setActionMenuId(null);
  };

  const deactivateTeacher = (id: string) => {
    setTeachers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Deactivated" as const } : t));
    setActionMenuId(null);
  };

  const reactivateTeacher = (id: string) => {
    setTeachers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Active" as const } : t));
    setActionMenuId(null);
  };

  const getStatusBadge = (status: Teacher["status"]) => {
    switch (status) {
      case "Active": return "bg-success/15 text-success";
      case "Pending": return "bg-warning/15 text-warning";
      case "Deactivated": return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="admin" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Admin</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Teachers</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All" className="bg-popover text-foreground">All</option>
              <option value="Active" className="bg-popover text-foreground">Active</option>
              <option value="Pending" className="bg-popover text-foreground">Pending</option>
              <option value="Deactivated" className="bg-popover text-foreground">Deactivated</option>
            </select>
          </div>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Manage Teachers</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Approve, deactivate, or configure faculty accounts across all departments.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
            <Plus className="h-4 w-4" /> Add Teacher
          </button>
        </div>

        <div className="mt-10 space-y-4">
          <div className="relative flex items-center w-full max-w-sm">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  <th className="py-4 px-6 font-semibold">Name</th>
                  <th className="py-4 px-6 font-semibold">Email</th>
                  <th className="py-4 px-6 font-semibold text-center">Department</th>
                  <th className="py-4 px-6 font-semibold text-center">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Questions</th>
                  <th className="py-4 px-6 font-semibold text-right">Contests</th>
                  <th className="py-4 px-6 font-semibold text-center">Joined</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="text-sm hover:bg-hover-row transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{t.name}</span>
                          <span className="block text-[10px] text-muted-foreground font-mono">{t.empId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-muted-foreground">{t.email}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{t.dept}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-muted-foreground">{t.questionsCreated}</td>
                    <td className="py-4 px-6 text-right font-mono text-muted-foreground">{t.contestsRun}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground">{t.joinedAt}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === t.id ? null : t.id)}
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionMenuId === t.id && (
                          <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-100">
                            {t.status === "Pending" && (
                              <button
                                onClick={() => approveTeacher(t.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-success hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                            )}
                            {t.status === "Active" && (
                              <button
                                onClick={() => deactivateTeacher(t.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-danger hover:bg-muted transition-colors cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" /> Deactivate
                              </button>
                            )}
                            {t.status === "Deactivated" && (
                              <button
                                onClick={() => reactivateTeacher(t.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-success hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Shield className="h-3.5 w-3.5" /> Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => setActionMenuId(null)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5" /> Send Email
                            </button>
                          </div>
                        )}
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
