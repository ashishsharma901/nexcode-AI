import { createFileRoute } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { User, Shield, Laptop, Bell, AlertTriangle, Key } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

interface Session {
  id: string;
  device: string;
  ip: string;
  location: string;
  current: boolean;
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");
  const [profile, setProfile] = useState({
    name: "Aarav Mehta",
    email: "aarav@college.edu",
    avatar: "A",
  });
  const [preferences, setPreferences] = useState({
    language: "Python 3",
    theme: "VS-Dark",
    emailNotif: true,
    contestNotif: true,
  });
  const [sessions, setSessions] = useState<Session[]>([
    { id: "1", device: "MacBook Pro · Chrome", ip: "192.168.1.104", location: "Mumbai, India", current: true },
    { id: "2", device: "iPhone 15 · Safari", ip: "103.45.12.89", location: "Pune, India", current: false },
    { id: "3", device: "Ubuntu Workstation · Firefox", ip: "201.84.15.22", location: "Mumbai, India", current: false },
  ]);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Profile saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Preferences saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="student" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Settings</span>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs text-success font-semibold animate-fade-in">{saveStatus}</span>
          )}
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1000px] px-6 pt-10">
        <h1 className="font-serif text-4xl text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account preferences, profile details, and active sessions.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          {/* Navigation Sidebar */}
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Profile Info
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeTab === "preferences"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Laptop className="h-4 w-4" /> Preferences
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left cursor-pointer transition-colors ${
                activeTab === "security"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4" /> Security & Active
            </button>
          </nav>

          {/* Settings Panels */}
          <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Profile Information</h2>
                  <p className="text-xs text-muted-foreground">Update your personal identification details.</p>
                </div>

                <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 font-serif text-2xl text-primary font-medium">
                    {profile.avatar}
                  </div>
                  <div>
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted cursor-pointer">
                      Upload new avatar
                    </button>
                    <p className="text-[10px] text-muted-foreground mt-1">JPG or PNG. Max size 1MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Email address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    Save profile changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === "preferences" && (
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-1">Editor Preferences</h2>
                  <p className="text-xs text-muted-foreground">Customize your online code execution environment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-muted-foreground">Default programming language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
                    >
                      <option className="bg-popover text-foreground">Python 3</option>
                      <option className="bg-popover text-foreground">C++20</option>
                      <option className="bg-popover text-foreground">Java 17</option>
                      <option className="bg-popover text-foreground">Go 1.21</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground">Editor Visual Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
                    >
                      <option className="bg-popover text-foreground">VS-Dark</option>
                      <option className="bg-popover text-foreground">Monokai</option>
                      <option className="bg-popover text-foreground">GitHub Light</option>
                      <option className="bg-popover text-foreground">Nord</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6 space-y-4">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Bell className="h-4 w-4" /> Notification Toggles
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Receive weekly reports and contest summaries.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotif}
                      onChange={(e) => setPreferences({ ...preferences, emailNotif: e.target.checked })}
                      className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Contest reminders</p>
                      <p className="text-xs text-muted-foreground">Get alerted 15 minutes before any exam starts.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.contestNotif}
                      onChange={(e) => setPreferences({ ...preferences, contestNotif: e.target.checked })}
                      className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    Save preferences
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                {/* Change Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Security Credentials</h2>
                    <p className="text-xs text-muted-foreground">Keep your terminal account secure with regular updates.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="rounded-full border border-border hover:bg-muted px-4 py-2 text-xs font-semibold text-foreground transition-all cursor-pointer">
                    Change Password
                  </button>
                </form>

                {/* Active Sessions */}
                <div className="border-t border-border/50 pt-8 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Active Browser Sessions</h3>
                    <p className="text-xs text-muted-foreground">Devices logged into your account in the last 30 days.</p>
                  </div>
                  
                  <div className="divide-y divide-border border-t border-border/50">
                    {sessions.map((sess) => (
                      <div key={sess.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{sess.device}</span>
                            {sess.current && (
                              <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold text-success uppercase">
                                Current session
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{sess.ip} · {sess.location}</p>
                        </div>
                        {!sess.current && (
                          <button
                            onClick={() => revokeSession(sess.id)}
                            className="rounded-lg border border-danger/20 text-danger hover:bg-danger/5 px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-danger/20 bg-danger/5 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-danger">Danger Zone</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Deleting your account will permanently wipe your profile, contest scores, submission histories, and certificates. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button type="button" className="rounded-lg bg-danger text-danger-foreground hover:opacity-90 px-4 py-2 text-xs font-semibold cursor-pointer transition-opacity">
                    Permanently delete account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
