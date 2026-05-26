import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { Server, Globe, Shield, Cpu, Database, Clock, Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const [activeSection, setActiveSection] = useState<"execution" | "platform" | "departments">("execution");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [execution, setExecution] = useState({
    cpuLimit: "1",
    memoryLimit: "256",
    timeout: "5",
    maxConcurrent: "20",
    networkAccess: false,
  });

  const [platform, setPlatform] = useState({
    siteName: "nexcode-ai",
    tagline: "your college's coding home",
    maxSubmissionsPerMin: "10",
    sessionTimeout: "60",
    googleOAuth: true,
    maintenanceMode: false,
  });

  const [departments, setDepartments] = useState([
    { id: "d1", name: "Computer Science & Engineering", code: "CSE", active: true },
    { id: "d2", name: "Information Technology", code: "IT", active: true },
    { id: "d3", name: "Electronics & Communication", code: "ECE", active: true },
    { id: "d4", name: "Mechanical Engineering", code: "ME", active: true },
    { id: "d5", name: "Civil Engineering", code: "CE", active: false },
  ]);

  const [newDept, setNewDept] = useState({ name: "", code: "" });

  const handleSave = () => {
    setSaveStatus("Settings saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const toggleDept = (id: string) => {
    setDepartments((prev) => prev.map((d) => d.id === id ? { ...d, active: !d.active } : d));
  };

  const addDepartment = () => {
    if (!newDept.name || !newDept.code) return;
    setDepartments((prev) => [...prev, { id: Math.random().toString(), name: newDept.name, code: newDept.code, active: true }]);
    setNewDept({ name: "", code: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="admin" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Admin</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Platform Settings</span>
        </div>
        <div>
          {saveStatus && (
            <span className="text-xs text-success font-semibold">{saveStatus}</span>
          )}
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1000px] px-6 pt-12">
        <h1 className="font-serif text-4xl text-foreground">Platform Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure execution limits, platform behavior, and department structure.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          {/* Sidebar */}
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveSection("execution")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeSection === "execution" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Cpu className="h-4 w-4" /> Execution Limits
            </button>
            <button
              onClick={() => setActiveSection("platform")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeSection === "platform" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" /> Platform Config
            </button>
            <button
              onClick={() => setActiveSection("departments")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeSection === "departments" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Database className="h-4 w-4" /> Departments
            </button>
          </nav>

          {/* Content */}
          <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
            {activeSection === "execution" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Execution Sandbox Limits</h2>
                  <p className="text-xs text-muted-foreground">Configure Docker container resource constraints for student code execution.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-muted-foreground">CPU Cores (per container)</label>
                    <input
                      type="number"
                      value={execution.cpuLimit}
                      onChange={(e) => setExecution({ ...execution, cpuLimit: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Memory Limit (MB)</label>
                    <input
                      type="number"
                      value={execution.memoryLimit}
                      onChange={(e) => setExecution({ ...execution, memoryLimit: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Execution Timeout (seconds per test case)</label>
                    <input
                      type="number"
                      value={execution.timeout}
                      onChange={(e) => setExecution({ ...execution, timeout: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Max Concurrent Containers</label>
                    <input
                      type="number"
                      value={execution.maxConcurrent}
                      onChange={(e) => setExecution({ ...execution, maxConcurrent: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Network Access</p>
                    <p className="text-xs text-muted-foreground">Allow containers to make outbound network requests (not recommended).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={execution.networkAccess}
                    onChange={(e) => setExecution({ ...execution, networkAccess: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    <Save className="h-3.5 w-3.5" /> Save Execution Settings
                  </button>
                </div>
              </div>
            )}

            {activeSection === "platform" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Platform Configuration</h2>
                  <p className="text-xs text-muted-foreground">General platform settings, rate limits, and authentication options.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-muted-foreground">Site Name</label>
                    <input
                      type="text"
                      value={platform.siteName}
                      onChange={(e) => setPlatform({ ...platform, siteName: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Tagline</label>
                    <input
                      type="text"
                      value={platform.tagline}
                      onChange={(e) => setPlatform({ ...platform, tagline: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Max Submissions / Minute (per user)</label>
                    <input
                      type="number"
                      value={platform.maxSubmissionsPerMin}
                      onChange={(e) => setPlatform({ ...platform, maxSubmissionsPerMin: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={platform.sessionTimeout}
                      onChange={(e) => setPlatform({ ...platform, sessionTimeout: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-border/50 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Google OAuth Login</p>
                      <p className="text-xs text-muted-foreground">Allow students and faculty to sign in with Google.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platform.googleOAuth}
                      onChange={(e) => setPlatform({ ...platform, googleOAuth: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-danger">Maintenance Mode</p>
                      <p className="text-xs text-muted-foreground">Temporarily disable the platform for all non-admin users.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={platform.maintenanceMode}
                      onChange={(e) => setPlatform({ ...platform, maintenanceMode: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    <Save className="h-3.5 w-3.5" /> Save Platform Settings
                  </button>
                </div>
              </div>
            )}

            {activeSection === "departments" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Department Management</h2>
                  <p className="text-xs text-muted-foreground">Add, enable, or disable college departments for scoped access control.</p>
                </div>

                <div className="divide-y divide-border border-y border-border">
                  {departments.map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                          d.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {d.code}
                        </span>
                        <div>
                          <span className={`text-sm font-medium ${d.active ? "text-foreground" : "text-muted-foreground line-through"}`}>{d.name}</span>
                          <span className="block text-[10px] text-muted-foreground font-mono">{d.code}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDept(d.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                          d.active ? "bg-success/15 text-success hover:bg-success/25" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {d.active ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new department */}
                <div className="border-t border-border/50 pt-6">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Add New Department</h3>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground">Department Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Artificial Intelligence"
                        value={newDept.name}
                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-muted-foreground">Code</label>
                      <input
                        type="text"
                        placeholder="AI"
                        value={newDept.code}
                        onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                    </div>
                    <button
                      onClick={addDepartment}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
