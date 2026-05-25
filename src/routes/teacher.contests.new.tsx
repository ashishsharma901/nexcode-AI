import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Search, Check, Plus, Calendar, Clock, Lock, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/teacher/contests/new")({ component: NewContestWizard });

const availableQuestions = [
  { id: "q1", title: "Two Sum", diff: "Easy", topic: "Arrays" },
  { id: "q2", title: "LRU Cache", diff: "Medium", topic: "Design" },
  { id: "q3", title: "Maximum Network Flow", diff: "Hard", topic: "Graphs" },
  { id: "q4", title: "Course Schedule II", diff: "Medium", topic: "Graphs" },
  { id: "q5", title: "Word Ladder", diff: "Hard", topic: "BFS" },
  { id: "q6", title: "Coin Change", diff: "Medium", topic: "DP" },
];

function NewContestWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Form State
  const [basicInfo, setBasicInfo] = useState({ name: "", desc: "", type: "Exam" });
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [timing, setTiming] = useState({
    startDate: "2026-05-25",
    startTime: "14:00",
    duration: "90",
    batches: ["CSE-2026-A", "CSE-2026-B"]
  });
  const [settings, setSettings] = useState({
    browserLock: true,
    autoSubmit: true,
    frozenLeaderboard: "15"
  });

  const [questionQuery, setQuestionQuery] = useState("");

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    setSuccess(true);
  };

  const filteredQuestions = availableQuestions.filter((q) =>
    q.title.toLowerCase().includes(questionQuery.toLowerCase()) ||
    q.topic.toLowerCase().includes(questionQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <Link to="/teacher/contests" className="hover:text-foreground">Contests</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">New Contest Wizard</span>
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[800px] px-6 pt-12">
        {success ? (
          <div className="space-y-6 text-center py-12 bg-surface rounded-2xl border border-border animate-in zoom-in-95 duration-200 shadow-sm max-w-lg mx-auto mt-10">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">Contest Published!</h1>
            <p className="text-sm text-muted-foreground px-8 leading-relaxed">
              Your contest <strong>{basicInfo.name || "Unnamed Contest"}</strong> has been scheduled and student groups have been notified.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/teacher/contests"
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Go to contests
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="font-serif text-4xl text-foreground">Create Contest</h1>
              <p className="mt-2 text-sm text-muted-foreground">Step {step} of 5 — Design your assessment environment.</p>
            </div>

            {/* Stepper progress indicator */}
            <div className="flex items-center justify-between border-y border-border py-4 text-xs font-semibold text-muted-foreground overflow-x-auto">
              {[
                { s: 1, name: "Basic Info" },
                { s: 2, name: "Question Selection" },
                { s: 3, name: "Schedule & Timing" },
                { s: 4, name: "Security & Rules" },
                { s: 5, name: "Review & Publish" }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2 shrink-0">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                    step === item.s
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : step > item.s
                      ? "border-success bg-success/15 text-success font-bold"
                      : "border-border text-muted-foreground"
                  }`}>
                    {step > item.s ? <Check className="h-3 w-3" /> : item.s}
                  </span>
                  <span className={step === item.s ? "text-foreground font-bold" : ""}>{item.name}</span>
                  {item.s < 5 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 hidden md:block" />}
                </div>
              ))}
            </div>

            {/* Step Contents */}
            <div className="rounded-xl border border-border bg-surface p-8 shadow-sm min-h-[300px]">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Contest Basic Details</h2>
                    <p className="text-xs text-muted-foreground font-sans">Set name, description and general context.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground">Contest Title</label>
                      <input
                        type="text"
                        placeholder="e.g. DSA Midterm Assessment"
                        value={basicInfo.name}
                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-muted-foreground">Description (Guidelines/Syllabus)</label>
                      <textarea
                        rows={4}
                        placeholder="Write detailed student instruction lines here..."
                        value={basicInfo.desc}
                        onChange={(e) => setBasicInfo({ ...basicInfo, desc: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground">Contest Type</label>
                      <select
                        value={basicInfo.type}
                        onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
                      >
                        <option className="bg-popover text-foreground">Exam</option>
                        <option className="bg-popover text-foreground">Practice</option>
                        <option className="bg-popover text-foreground">Rated Contest</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Select Questions */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-foreground mb-1">Add Questions</h2>
                      <p className="text-xs text-muted-foreground font-sans">Search and add questions to this contest sheet.</p>
                    </div>
                    <span className="rounded bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      {selectedQuestions.length} selected
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search questions by title, tags..."
                      value={questionQuery}
                      onChange={(e) => setQuestionQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-transparent rounded-full border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="divide-y divide-border border-t border-border mt-4">
                    {filteredQuestions.map((q) => {
                      const isAdded = selectedQuestions.includes(q.id);
                      return (
                        <div key={q.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{q.title}</span>
                            <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
                              <span>{q.topic}</span>
                              <span>·</span>
                              <span className={q.diff === "Easy" ? "text-success" : q.diff === "Medium" ? "text-warning" : "text-danger"}>{q.diff}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleQuestion(q.id)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                              isAdded
                                ? "bg-success/10 text-success border border-success/30"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isAdded ? "Added" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Timing & Access */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Timing & Scheduling</h2>
                    <p className="text-xs text-muted-foreground font-sans">Control when students can access and finish.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Start Date</label>
                      <input
                        type="date"
                        value={timing.startDate}
                        onChange={(e) => setTiming({ ...timing, startDate: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Start Time</label>
                      <input
                        type="time"
                        value={timing.startTime}
                        onChange={(e) => setTiming({ ...timing, startTime: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Duration (mins)</label>
                      <input
                        type="number"
                        value={timing.duration}
                        onChange={(e) => setTiming({ ...timing, duration: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-6">
                    <label className="block text-xs text-muted-foreground mb-2">Restricted Batches</label>
                    <div className="flex flex-wrap gap-2">
                      {["CSE-2026-A", "CSE-2026-B", "IT-2026-A", "ECE-2025"].map((batchName) => {
                        const isChecked = timing.batches.includes(batchName);
                        return (
                          <button
                            key={batchName}
                            type="button"
                            onClick={() => {
                              setTiming({
                                ...timing,
                                batches: isChecked
                                  ? timing.batches.filter((x) => x !== batchName)
                                  : [...timing.batches, batchName]
                              });
                            }}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {batchName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Settings & Rules */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Security & Assessment Rules</h2>
                    <p className="text-xs text-muted-foreground font-sans">Set proctored browser locks and submission limits.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-border rounded-xl p-4">
                      <div className="space-y-0.5 pr-4">
                        <p className="text-sm font-semibold flex items-center gap-1"><Lock className="h-4 w-4 text-warning" /> Browser Lock (Proctored Mode)</p>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Locks student screens. Exiting the fullscreen window flags alerts or triggers auto-submit.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.browserLock}
                        onChange={(e) => setSettings({ ...settings, browserLock: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between border border-border rounded-xl p-4">
                      <div className="space-y-0.5 pr-4">
                        <p className="text-sm font-semibold">Auto-Submit on timer end</p>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Saves and submits whatever starter code draft has been written when time limits expire.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoSubmit}
                        onChange={(e) => setSettings({ ...settings, autoSubmit: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground">Frozen Leaderboard Threshold (minutes before end)</label>
                      <input
                        type="number"
                        value={settings.frozenLeaderboard}
                        onChange={(e) => setSettings({ ...settings, frozenLeaderboard: e.target.value })}
                        className="mt-1 w-full max-w-[200px] rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Conceals leaderboard rankings from students during final minutes.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Publish */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Final Review</h2>
                    <p className="text-xs text-muted-foreground font-sans">Verify details before scheduling live.</p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-4 text-sm leading-relaxed">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Title</span>
                        <p className="font-semibold">{basicInfo.name || "Unnamed DSA Contest"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Type</span>
                        <p className="font-semibold">{basicInfo.type}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">Guidelines</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{basicInfo.desc || "None provided."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Schedule</span>
                        <p className="font-semibold">{timing.startDate} at {timing.startTime}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Duration</span>
                        <p className="font-semibold">{timing.duration} minutes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Groups</span>
                        <p className="font-semibold">{timing.batches.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Questions Included</span>
                        <p className="font-semibold">{selectedQuestions.length} selected</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>Proctored Fullscreen: <span className="font-semibold text-foreground">{settings.browserLock ? "Enabled" : "Disabled"}</span></div>
                      <div>Auto-Submit: <span className="font-semibold text-foreground">{settings.autoSubmit ? "Enabled" : "Disabled"}</span></div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Next Step <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center gap-1.5 rounded-full bg-success px-6 py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" /> Publish Contest
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
