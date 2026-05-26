import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import {
  ChevronRight, ChevronLeft, Search, Check, Plus, Calendar, Clock,
  Lock, Sparkles, CheckCircle2, Download, Trash2, GripVertical,
  Globe, Eye, EyeOff, Shuffle, Award, X, AlertTriangle, Upload, FileSpreadsheet
} from "lucide-react";

export const Route = createFileRoute("/teacher/contests/new")({ component: NewContestWizard });

interface ContestQuestion {
  id: string;
  title: string;
  diff: "Easy" | "Medium" | "Hard";
  topic: string;
  points: number;
  timeLimit: number; // seconds per test case
  source: "bank" | "leetcode";
}

const bankQuestions: ContestQuestion[] = [
  { id: "q1", title: "Two Sum", diff: "Easy", topic: "Arrays", points: 100, timeLimit: 2, source: "bank" },
  { id: "q2", title: "LRU Cache", diff: "Medium", topic: "Design", points: 200, timeLimit: 3, source: "bank" },
  { id: "q3", title: "Maximum Network Flow", diff: "Hard", topic: "Graphs", points: 300, timeLimit: 5, source: "bank" },
  { id: "q4", title: "Course Schedule II", diff: "Medium", topic: "Graphs", points: 200, timeLimit: 3, source: "bank" },
  { id: "q5", title: "Word Ladder", diff: "Hard", topic: "BFS", points: 300, timeLimit: 5, source: "bank" },
  { id: "q6", title: "Coin Change", diff: "Medium", topic: "DP", points: 200, timeLimit: 3, source: "bank" },
  { id: "q7", title: "Valid Parentheses", diff: "Easy", topic: "Strings", points: 100, timeLimit: 2, source: "bank" },
  { id: "q8", title: "Trapping Rain Water", diff: "Hard", topic: "Arrays", points: 300, timeLimit: 4, source: "bank" },
  { id: "q9", title: "Number of Islands", diff: "Medium", topic: "Graphs", points: 200, timeLimit: 3, source: "bank" },
  { id: "q10", title: "Merge k Sorted Lists", diff: "Hard", topic: "Linked List", points: 300, timeLimit: 4, source: "bank" },
];

const diffColor: Record<string, string> = {
  Easy: "text-success", Medium: "text-warning", Hard: "text-danger",
};

function NewContestWizard() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: "", desc: "", type: "Exam",
    visibility: "batch", // "batch" | "open" | "invite"
    allowedLanguages: ["Python 3", "C++20", "Java 17", "JavaScript"],
  });

  // Step 2: Questions
  const [contestQuestions, setContestQuestions] = useState<ContestQuestion[]>([]);
  const [questionQuery, setQuestionQuery] = useState("");
  const [questionDiffFilter, setQuestionDiffFilter] = useState("All");
  const [showImportModal, setShowImportModal] = useState(false);
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [importingLeetcode, setImportingLeetcode] = useState(false);
  const [importedPreview, setImportedPreview] = useState<ContestQuestion | null>(null);
  const [importTab, setImportTab] = useState<"url" | "auto">("url");
  const [autoFetchCriteria, setAutoFetchCriteria] = useState({
    count: "5",
    difficulty: "Medium",
    topic: "Arrays",
    subtopic: "",
  });
  const [autoFetchedQuestions, setAutoFetchedQuestions] = useState<ContestQuestion[]>([]);

  // Step 3: Timing
  const [timing, setTiming] = useState({
    startDate: "2026-05-28",
    startTime: "14:00",
    duration: "90",
    endDate: "",
    endTime: "",
    lateSubmission: false,
    lateGracePeriod: "5",
  });

  // Step 4: Scoring & Rules
  const [scoring, setScoring] = useState({
    scoringMode: "per-problem", // "per-problem" | "per-testcase" | "icpc"
    penaltyPerWrong: "10", // minutes
    partialScoring: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    maxSubmissions: "50", // per problem
  });

  // Step 5: Security
  const [security, setSecurity] = useState({
    browserLock: true,
    tabSwitchDetection: true,
    copyPasteDetection: true,
    autoSubmit: true,
    frozenLeaderboard: "15",
    showLeaderboard: true,
    webcamProctoring: false,
    ipRestriction: false,
    allowedIpRange: "",
  });

  // Step 6: Access
  const [access, setAccess] = useState({
    batches: ["CSE-2026-A", "CSE-2026-B"],
    password: "",
    requirePassword: false,
    maxParticipants: "",
    registrationDeadline: "",
  });

  // Question management helpers
  const addQuestion = (q: ContestQuestion) => {
    if (!contestQuestions.find((x) => x.id === q.id)) {
      setContestQuestions([...contestQuestions, q]);
    }
  };

  const removeQuestion = (id: string) => {
    setContestQuestions(contestQuestions.filter((q) => q.id !== id));
  };

  const updateQuestionPoints = (id: string, points: number) => {
    setContestQuestions(contestQuestions.map((q) => q.id === id ? { ...q, points } : q));
  };

  const updateQuestionTimeLimit = (id: string, timeLimit: number) => {
    setContestQuestions(contestQuestions.map((q) => q.id === id ? { ...q, timeLimit } : q));
  };

  // LeetCode import simulation
  // LeetCode import - by URL
  const handleLeetcodeImport = () => {
    if (!leetcodeUrl.trim()) return;
    setImportingLeetcode(true);
    setTimeout(() => {
      const slug = leetcodeUrl.split("/").filter(Boolean).pop() || "imported-problem";
      const title = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      setImportedPreview({
        id: `lc-${Date.now()}`,
        title,
        diff: "Medium",
        topic: "Imported",
        points: 200,
        timeLimit: 3,
        source: "leetcode",
      });
      setImportingLeetcode(false);
    }, 1500);
  };

  const confirmLeetcodeImport = () => {
    if (importedPreview) {
      addQuestion(importedPreview);
      setImportedPreview(null);
      setLeetcodeUrl("");
      setShowImportModal(false);
    }
  };

  // LeetCode auto-fetch by criteria
  const samplePool: Record<string, Record<string, string[]>> = {
    Easy: {
      Arrays: ["Two Sum", "Remove Duplicates", "Best Time to Buy Stock", "Contains Duplicate", "Single Number", "Intersection of Two Arrays", "Move Zeroes", "Plus One"],
      Strings: ["Valid Anagram", "Reverse String", "First Unique Character", "Valid Palindrome", "Longest Common Prefix", "Roman to Integer"],
      Graphs: ["Flood Fill", "Island Perimeter", "Find Center of Star Graph", "Find if Path Exists"],
      DP: ["Climbing Stairs", "House Robber", "Maximum Subarray", "Min Cost Climbing Stairs"],
      Trees: ["Maximum Depth of Binary Tree", "Invert Binary Tree", "Same Tree", "Symmetric Tree"],
    },
    Medium: {
      Arrays: ["3Sum", "Container With Most Water", "Product of Array Except Self", "Rotate Array", "Spiral Matrix", "Set Matrix Zeroes", "Next Permutation", "Subarray Sum Equals K"],
      Strings: ["Longest Substring Without Repeating", "Group Anagrams", "Longest Palindromic Substring", "Decode Ways", "Generate Parentheses"],
      Graphs: ["Number of Islands", "Course Schedule", "Clone Graph", "Pacific Atlantic Water Flow", "Rotting Oranges"],
      DP: ["Coin Change", "Longest Increasing Subsequence", "Unique Paths", "Jump Game", "Word Break", "House Robber II"],
      Trees: ["Binary Tree Level Order", "Validate BST", "Kth Smallest in BST", "Construct BT from Preorder"],
    },
    Hard: {
      Arrays: ["Trapping Rain Water", "First Missing Positive", "Median of Two Sorted Arrays", "Sliding Window Maximum"],
      Strings: ["Minimum Window Substring", "Edit Distance", "Regular Expression Matching", "Wildcard Matching"],
      Graphs: ["Word Ladder", "Alien Dictionary", "Critical Connections", "Shortest Path in Grid"],
      DP: ["Burst Balloons", "Palindrome Partitioning II", "Distinct Subsequences", "Interleaving String"],
      Trees: ["Serialize and Deserialize BT", "Binary Tree Maximum Path Sum", "Recover BST"],
    },
  };

  const handleAutoFetch = () => {
    setImportingLeetcode(true);
    setAutoFetchedQuestions([]);
    setTimeout(() => {
      const diff = autoFetchCriteria.difficulty as "Easy" | "Medium" | "Hard";
      const topic = autoFetchCriteria.topic;
      const count = Math.min(parseInt(autoFetchCriteria.count) || 5, 10);
      const pool = samplePool[diff]?.[topic] || samplePool[diff]?.["Arrays"] || [];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, count);
      const pointsMap: Record<string, number> = { Easy: 100, Medium: 200, Hard: 300 };
      const tlMap: Record<string, number> = { Easy: 2, Medium: 3, Hard: 5 };
      const results: ContestQuestion[] = picked.map((title, i) => ({
        id: `lc-auto-${Date.now()}-${i}`,
        title,
        diff,
        topic,
        points: pointsMap[diff],
        timeLimit: tlMap[diff],
        source: "leetcode" as const,
      }));
      setAutoFetchedQuestions(results);
      setImportingLeetcode(false);
    }, 1200);
  };

  const confirmAutoFetchImport = () => {
    autoFetchedQuestions.forEach((q) => addQuestion(q));
    setAutoFetchedQuestions([]);
    setShowImportModal(false);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportedPreview(null);
    setLeetcodeUrl("");
    setAutoFetchedQuestions([]);
    setImportTab("url");
  };

  // CSV import state
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvParsedQuestions, setCsvParsedQuestions] = useState<ContestQuestion[]>([]);
  const [csvImporting, setCsvImporting] = useState(false);

  const handleCsvUpload = () => {
    setCsvImporting(true);
    setCsvFileName("contest_questions_batch.csv");
    setTimeout(() => {
      const mockCsvQuestions: ContestQuestion[] = [
        { id: `csv-${Date.now()}-1`, title: "Reverse Linked List", diff: "Easy", topic: "Linked List", points: 100, timeLimit: 2, source: "bank" },
        { id: `csv-${Date.now()}-2`, title: "Merge Intervals", diff: "Medium", topic: "Arrays", points: 200, timeLimit: 3, source: "bank" },
        { id: `csv-${Date.now()}-3`, title: "Binary Tree Zigzag Level Order", diff: "Medium", topic: "Trees", points: 200, timeLimit: 3, source: "bank" },
        { id: `csv-${Date.now()}-4`, title: "Longest Valid Parentheses", diff: "Hard", topic: "Strings", points: 300, timeLimit: 5, source: "bank" },
      ];
      setCsvParsedQuestions(mockCsvQuestions);
      setCsvImporting(false);
    }, 1000);
  };

  const addCsvQuestion = (q: ContestQuestion) => {
    addQuestion(q);
    setCsvParsedQuestions((prev) => prev.filter((x) => x.id !== q.id));
  };

  const addAllCsvQuestions = () => {
    csvParsedQuestions.forEach((q) => addQuestion(q));
    setCsvParsedQuestions([]);
    setShowCsvImport(false);
    setCsvFileName("");
  };

  const filteredBankQuestions = bankQuestions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(questionQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(questionQuery.toLowerCase());
    const matchesDiff = questionDiffFilter === "All" || q.diff === questionDiffFilter;
    const notAdded = !contestQuestions.find((cq) => cq.id === q.id);
    return matchesSearch && matchesDiff && notAdded;
  });

  const totalPoints = contestQuestions.reduce((sum, q) => sum + q.points, 0);

  const [publishMode, setPublishMode] = useState<"draft" | "live" | null>(null);
  const handlePublish = (mode: "draft" | "live") => { setPublishMode(mode); setSuccess(true); };

  const toggleLanguage = (lang: string) => {
    const langs = basicInfo.allowedLanguages;
    if (langs.includes(lang)) {
      if (langs.length > 1) setBasicInfo({ ...basicInfo, allowedLanguages: langs.filter((l) => l !== lang) });
    } else {
      setBasicInfo({ ...basicInfo, allowedLanguages: [...langs, lang] });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <Link to="/teacher/contests" className="hover:text-foreground transition-colors">Contests</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Create Contest</span>
        </div>
        <div />
      </ContextBar>

      <div className="mx-auto max-w-[900px] px-6 pt-12">
        {success ? (
          <div className="space-y-6 text-center py-14 bg-surface rounded-2xl border border-border animate-in zoom-in-95 duration-200 shadow-sm max-w-lg mx-auto mt-10">
            <div className="flex justify-center">
              {publishMode === "live" ? (
                <CheckCircle2 className="h-16 w-16 text-success" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              )}
            </div>
            <h1 className="font-serif text-3xl text-foreground">
              {publishMode === "live" ? "Contest is Live!" : "Draft Saved"}
            </h1>
            <p className="text-sm text-muted-foreground px-8 leading-relaxed">
              {publishMode === "live" ? (
                <><strong>{basicInfo.name || "Unnamed Contest"}</strong> is now live with {contestQuestions.length} questions.
                Students in selected batches have been notified and can join at {timing.startDate} {timing.startTime}.</>
              ) : (
                <><strong>{basicInfo.name || "Unnamed Contest"}</strong> has been saved as a draft with {contestQuestions.length} questions.
                You can edit and publish it later from the Contests page.</>
              )}
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link to="/teacher/contests" className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                View All Contests
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-4xl text-foreground">Create Contest</h1>
              <p className="mt-2 text-sm text-muted-foreground">Step {step} of 7 — Full control over your assessment.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 border-y border-border py-3 text-[11px] font-semibold text-muted-foreground overflow-x-auto no-scrollbar">
              {[
                { s: 1, name: "Basics" }, { s: 2, name: "Questions" }, { s: 3, name: "Timing" },
                { s: 4, name: "Scoring" }, { s: 5, name: "Security" }, { s: 6, name: "Access" }, { s: 7, name: "Review" },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-1.5 shrink-0">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${
                    step === item.s ? "border-primary bg-primary/10 text-primary font-bold"
                    : step > item.s ? "border-success bg-success/15 text-success"
                    : "border-border"
                  }`}>
                    {step > item.s ? <Check className="h-2.5 w-2.5" /> : item.s}
                  </span>
                  <span className={step === item.s ? "text-foreground" : ""}>{item.name}</span>
                  {item.s < 7 && <ChevronRight className="h-3 w-3 text-border mx-0.5" />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="rounded-xl border border-border bg-surface p-8 shadow-sm min-h-[360px]">

              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Contest Details</h2>
                    <p className="text-xs text-muted-foreground">Name, type, description, and allowed languages.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground">Contest Title *</label>
                      <input type="text" placeholder="e.g. DSA Lab Exam 4" value={basicInfo.name}
                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Contest Type</label>
                      <select value={basicInfo.type} onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                        <option className="bg-popover text-foreground">Exam</option>
                        <option className="bg-popover text-foreground">Practice</option>
                        <option className="bg-popover text-foreground">Rated Contest</option>
                        <option className="bg-popover text-foreground">Assignment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">Visibility</label>
                      <select value={basicInfo.visibility} onChange={(e) => setBasicInfo({ ...basicInfo, visibility: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                        <option value="batch" className="bg-popover text-foreground">Batch-restricted</option>
                        <option value="open" className="bg-popover text-foreground">Open to all</option>
                        <option value="invite" className="bg-popover text-foreground">Invite only</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground">Description / Instructions</label>
                      <textarea rows={3} placeholder="Syllabus, rules, allowed resources..." value={basicInfo.desc}
                        onChange={(e) => setBasicInfo({ ...basicInfo, desc: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-2">Allowed Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {["Python 3", "C++20", "Java 17", "JavaScript", "Go 1.21", "Rust"].map((lang) => (
                          <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold border cursor-pointer transition-all ${
                              basicInfo.allowedLanguages.includes(lang)
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border text-muted-foreground hover:text-foreground"
                            }`}>
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Questions */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-foreground mb-1">Question Selection</h2>
                      <p className="text-xs text-muted-foreground">Add from your bank, import from LeetCode, or upload via CSV.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowCsvImport(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                        <Upload className="h-3.5 w-3.5" /> CSV Import
                      </button>
                      <button onClick={() => setShowImportModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-500/20 transition-colors cursor-pointer">
                        <Download className="h-3.5 w-3.5" /> LeetCode Import
                      </button>
                    </div>
                  </div>

                  {/* Selected questions list */}
                  {contestQuestions.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="bg-muted/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{contestQuestions.length} questions · {totalPoints} total points</span>
                        <span>Drag to reorder</span>
                      </div>
                      <div className="divide-y divide-border">
                        {contestQuestions.map((q, idx) => (
                          <div key={q.id} className="flex items-center gap-3 px-4 py-3 hover:bg-hover-row transition-colors">
                            <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                            <span className="font-mono text-xs text-muted-foreground w-6">Q{idx + 1}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-foreground truncate block">{q.title}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-semibold ${diffColor[q.diff]}`}>{q.diff}</span>
                                <span className="text-[10px] text-muted-foreground">{q.topic}</span>
                                {q.source === "leetcode" && (
                                  <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-orange-600">LeetCode</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <label className="block text-[9px] text-muted-foreground">Points</label>
                                <input type="number" value={q.points} onChange={(e) => updateQuestionPoints(q.id, Number(e.target.value))}
                                  className="w-16 rounded border border-border bg-transparent px-2 py-1 text-xs text-center text-foreground outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <div className="text-center">
                                <label className="block text-[9px] text-muted-foreground">TL (sec)</label>
                                <input type="number" value={q.timeLimit} onChange={(e) => updateQuestionTimeLimit(q.id, Number(e.target.value))}
                                  className="w-14 rounded border border-border bg-transparent px-2 py-1 text-xs text-center text-foreground outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <button onClick={() => removeQuestion(q.id)} className="text-danger hover:bg-danger/10 rounded p-1 cursor-pointer">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search & add from bank */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input type="text" placeholder="Search question bank..." value={questionQuery}
                          onChange={(e) => setQuestionQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-transparent rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <select value={questionDiffFilter} onChange={(e) => setQuestionDiffFilter(e.target.value)}
                        className="rounded-lg border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none cursor-pointer">
                        <option value="All" className="bg-popover text-foreground">All</option>
                        <option value="Easy" className="bg-popover text-foreground">Easy</option>
                        <option value="Medium" className="bg-popover text-foreground">Medium</option>
                        <option value="Hard" className="bg-popover text-foreground">Hard</option>
                      </select>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto divide-y divide-border border border-border rounded-lg">
                      {filteredBankQuestions.map((q) => (
                        <div key={q.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-hover-row transition-colors">
                          <div>
                            <span className="text-sm text-foreground">{q.title}</span>
                            <span className={`ml-2 text-[10px] font-semibold ${diffColor[q.diff]}`}>{q.diff}</span>
                            <span className="ml-2 text-[10px] text-muted-foreground">{q.topic}</span>
                          </div>
                          <button onClick={() => addQuestion(q)}
                            className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90 cursor-pointer">
                            <Plus className="inline h-3 w-3 mr-0.5" /> Add
                          </button>
                        </div>
                      ))}
                      {filteredBankQuestions.length === 0 && (
                        <div className="py-6 text-center text-xs text-muted-foreground">No matching questions found.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Timing */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Schedule & Duration</h2>
                    <p className="text-xs text-muted-foreground">Set when the contest starts, how long it runs, and late submission rules.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Start Date</label>
                      <input type="date" value={timing.startDate} onChange={(e) => setTiming({ ...timing, startDate: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Start Time</label>
                      <input type="time" value={timing.startTime} onChange={(e) => setTiming({ ...timing, startTime: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Duration (minutes)</label>
                      <input type="number" value={timing.duration} onChange={(e) => setTiming({ ...timing, duration: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Allow Late Submission</p>
                        <p className="text-xs text-muted-foreground">Students can submit after timer ends with a penalty.</p>
                      </div>
                      <input type="checkbox" checked={timing.lateSubmission}
                        onChange={(e) => setTiming({ ...timing, lateSubmission: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                    </div>
                    {timing.lateSubmission && (
                      <div>
                        <label className="block text-xs text-muted-foreground">Grace Period (minutes after end)</label>
                        <input type="number" value={timing.lateGracePeriod}
                          onChange={(e) => setTiming({ ...timing, lateGracePeriod: e.target.value })}
                          className="mt-1 w-32 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Scoring */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Scoring & Rules</h2>
                    <p className="text-xs text-muted-foreground">Configure how submissions are scored and ranked.</p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Scoring Mode</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { val: "per-problem", label: "Per Problem", desc: "Full points if all test cases pass" },
                          { val: "per-testcase", label: "Per Test Case", desc: "Partial credit for each passing case" },
                          { val: "icpc", label: "ICPC Style", desc: "Solved count + penalty time ranking" },
                        ].map((mode) => (
                          <button key={mode.val} type="button" onClick={() => setScoring({ ...scoring, scoringMode: mode.val })}
                            className={`rounded-xl border p-4 text-left cursor-pointer transition-all ${
                              scoring.scoringMode === mode.val ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}>
                            <div className="text-sm font-semibold text-foreground">{mode.label}</div>
                            <div className="text-[10px] text-muted-foreground mt-1">{mode.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-muted-foreground">Penalty per Wrong Submission (minutes)</label>
                        <input type="number" value={scoring.penaltyPerWrong}
                          onChange={(e) => setScoring({ ...scoring, penaltyPerWrong: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Max Submissions per Problem</label>
                        <input type="number" value={scoring.maxSubmissions}
                          onChange={(e) => setScoring({ ...scoring, maxSubmissions: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div className="space-y-3 border-t border-border/50 pt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Award className="h-4 w-4 text-primary" /> Partial Scoring</p>
                          <p className="text-xs text-muted-foreground">Award points proportional to test cases passed.</p>
                        </div>
                        <input type="checkbox" checked={scoring.partialScoring}
                          onChange={(e) => setScoring({ ...scoring, partialScoring: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Shuffle className="h-4 w-4 text-warning" /> Shuffle Question Order</p>
                          <p className="text-xs text-muted-foreground">Each student sees questions in a random order.</p>
                        </div>
                        <input type="checkbox" checked={scoring.shuffleQuestions}
                          onChange={(e) => setScoring({ ...scoring, shuffleQuestions: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Security */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Security & Proctoring</h2>
                    <p className="text-xs text-muted-foreground">Anti-cheat measures and browser restrictions.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: "browserLock", icon: Lock, label: "Fullscreen Browser Lock", desc: "Forces fullscreen mode. Exiting triggers a warning and is logged.", color: "text-danger" },
                      { key: "tabSwitchDetection", icon: Eye, label: "Tab-Switch Detection", desc: "Logs every time a student switches to another tab or window.", color: "text-warning" },
                      { key: "copyPasteDetection", icon: AlertTriangle, label: "Copy-Paste Detection", desc: "Monitors paste events in the editor. Large pastes are flagged.", color: "text-warning" },
                      { key: "autoSubmit", icon: Clock, label: "Auto-Submit on Timer End", desc: "Automatically submits the last saved draft when time expires.", color: "text-primary" },
                      { key: "showLeaderboard", icon: Award, label: "Show Live Leaderboard", desc: "Students can see real-time rankings during the contest.", color: "text-primary" },
                      { key: "webcamProctoring", icon: Eye, label: "Webcam Proctoring (Beta)", desc: "Captures periodic snapshots for manual review. Requires consent.", color: "text-danger" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const val = security[item.key as keyof typeof security] as boolean;
                      return (
                        <div key={item.key} className="flex items-center justify-between border border-border rounded-xl p-4">
                          <div className="flex items-start gap-3 pr-4">
                            <Icon className={`h-4 w-4 mt-0.5 ${item.color}`} />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground leading-normal">{item.desc}</p>
                            </div>
                          </div>
                          <input type="checkbox" checked={val}
                            onChange={(e) => setSecurity({ ...security, [item.key]: e.target.checked })}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary shrink-0" />
                        </div>
                      );
                    })}
                    {security.showLeaderboard && (
                      <div className="ml-7 pl-4 border-l-2 border-primary/20">
                        <label className="block text-xs text-muted-foreground">Freeze leaderboard (minutes before end)</label>
                        <input type="number" value={security.frozenLeaderboard}
                          onChange={(e) => setSecurity({ ...security, frozenLeaderboard: e.target.value })}
                          className="mt-1 w-32 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Access */}
              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Access & Participants</h2>
                    <p className="text-xs text-muted-foreground">Control who can join and how they authenticate.</p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Allowed Batches</label>
                      <div className="flex flex-wrap gap-2">
                        {["CSE-2026-A", "CSE-2026-B", "CSE-2026-C", "IT-2026-A", "ECE-2025-A", "ME-2025-A"].map((batch) => {
                          const isSelected = access.batches.includes(batch);
                          return (
                            <button key={batch} type="button"
                              onClick={() => setAccess({ ...access, batches: isSelected ? access.batches.filter((b) => b !== batch) : [...access.batches, batch] })}
                              className={`rounded-full px-4 py-1.5 text-xs font-semibold border cursor-pointer transition-all ${
                                isSelected ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
                              }`}>
                              {batch}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-muted-foreground">Max Participants (leave empty for unlimited)</label>
                        <input type="number" placeholder="∞" value={access.maxParticipants}
                          onChange={(e) => setAccess({ ...access, maxParticipants: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Registration Deadline</label>
                        <input type="datetime-local" value={access.registrationDeadline}
                          onChange={(e) => setAccess({ ...access, registrationDeadline: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Require Contest Password</p>
                          <p className="text-xs text-muted-foreground">Students must enter a password to start the contest.</p>
                        </div>
                        <input type="checkbox" checked={access.requirePassword}
                          onChange={(e) => setAccess({ ...access, requirePassword: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      </div>
                      {access.requirePassword && (
                        <div>
                          <label className="block text-xs text-muted-foreground">Contest Password</label>
                          <input type="text" placeholder="e.g. DSA2026" value={access.password}
                            onChange={(e) => setAccess({ ...access, password: e.target.value })}
                            className="mt-1 w-64 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Review */}
              {step === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-1">Review & Publish</h2>
                    <p className="text-xs text-muted-foreground">Verify all settings before going live.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/10 p-6 space-y-5 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Title</span><p className="font-semibold text-foreground">{basicInfo.name || "Untitled"}</p></div>
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Type</span><p className="font-semibold text-foreground">{basicInfo.type}</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Date</span><p className="font-semibold text-foreground">{timing.startDate}</p></div>
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Time</span><p className="font-semibold text-foreground">{timing.startTime}</p></div>
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Duration</span><p className="font-semibold text-foreground">{timing.duration} min</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Questions</span><p className="font-semibold text-foreground">{contestQuestions.length} problems · {totalPoints} pts</p></div>
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Scoring</span><p className="font-semibold text-foreground capitalize">{scoring.scoringMode.replace("-", " ")}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Batches</span><p className="font-semibold text-foreground">{access.batches.join(", ")}</p></div>
                      <div><span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Languages</span><p className="font-semibold text-foreground">{basicInfo.allowedLanguages.join(", ")}</p></div>
                    </div>
                    <div className="border-t border-border pt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div>Browser Lock: <span className="font-semibold text-foreground">{security.browserLock ? "✓" : "✗"}</span></div>
                      <div>Tab Detection: <span className="font-semibold text-foreground">{security.tabSwitchDetection ? "✓" : "✗"}</span></div>
                      <div>Auto-Submit: <span className="font-semibold text-foreground">{security.autoSubmit ? "✓" : "✗"}</span></div>
                      <div>Leaderboard: <span className="font-semibold text-foreground">{security.showLeaderboard ? `Frozen at ${security.frozenLeaderboard}m` : "Hidden"}</span></div>
                      <div>Partial Score: <span className="font-semibold text-foreground">{scoring.partialScoring ? "✓" : "✗"}</span></div>
                      <div>Password: <span className="font-semibold text-foreground">{access.requirePassword ? "Required" : "None"}</span></div>
                    </div>
                  </div>
                  {contestQuestions.length === 0 && (
                    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                      <p className="text-xs text-warning">No questions added. Go back to Step 2 to add questions before publishing.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button type="button" disabled={step === 1} onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {step < 7 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => handlePublish("draft")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer">
                    <Clock className="h-3.5 w-3.5 text-warning" /> Save as Draft
                  </button>
                  <button type="button" onClick={() => handlePublish("live")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-success px-6 py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    <Sparkles className="h-4 w-4" /> Go Live Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSV Import Modal */}
      {showCsvImport && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCsvImport(false); setCsvParsedQuestions([]); setCsvFileName(""); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground">Import from CSV / Excel</h2>
                    <p className="text-xs text-muted-foreground">Upload questions using our structured template.</p>
                  </div>
                </div>
                <button onClick={() => { setShowCsvImport(false); setCsvParsedQuestions([]); setCsvFileName(""); }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 pb-6 space-y-5">
                {/* Step 1: Download template + Upload */}
                <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">1. Download Template</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Use this exact format — columns must match.</p>
                    </div>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors">
                      <Download className="h-3.5 w-3.5 text-success" /> Download .csv
                    </button>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3 overflow-x-auto">
                    <table className="w-full text-[10px] text-muted-foreground">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-1 pr-3 text-left font-semibold text-foreground">title</th>
                          <th className="py-1 pr-3 text-left font-semibold text-foreground">difficulty</th>
                          <th className="py-1 pr-3 text-left font-semibold text-foreground">topic</th>
                          <th className="py-1 pr-3 text-left font-semibold text-foreground">points</th>
                          <th className="py-1 text-left font-semibold text-foreground">time_limit_sec</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1 pr-3">Two Sum</td>
                          <td className="py-1 pr-3">Easy</td>
                          <td className="py-1 pr-3">Arrays</td>
                          <td className="py-1 pr-3">100</td>
                          <td className="py-1">2</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-3">LRU Cache</td>
                          <td className="py-1 pr-3">Medium</td>
                          <td className="py-1 pr-3">Design</td>
                          <td className="py-1 pr-3">200</td>
                          <td className="py-1">3</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">2. Upload Your File</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Accepts .csv or .xlsx with the template columns.</p>
                  </div>
                  {!csvFileName ? (
                    <button onClick={handleCsvUpload}
                      className="w-full rounded-xl border-2 border-dashed border-border py-8 text-center hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all group">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="mt-2 text-xs text-muted-foreground group-hover:text-foreground">Click to select file or drag & drop</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">.csv or .xlsx · max 50 questions</p>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3">
                      <FileSpreadsheet className="h-5 w-5 text-success" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{csvFileName}</p>
                        <p className="text-[10px] text-muted-foreground">{csvParsedQuestions.length} questions parsed</p>
                      </div>
                      <button onClick={() => { setCsvFileName(""); setCsvParsedQuestions([]); }}
                        className="text-xs text-muted-foreground hover:text-danger cursor-pointer">Remove</button>
                    </div>
                  )}
                </div>

                {/* Parsed questions preview */}
                {csvParsedQuestions.length > 0 && (
                  <div className="rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="bg-muted/30 px-4 py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{csvParsedQuestions.length} questions ready to add</span>
                    </div>
                    <div className="divide-y divide-border max-h-[180px] overflow-y-auto">
                      {csvParsedQuestions.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-muted-foreground w-5">{idx + 1}.</span>
                            <span className="text-sm text-foreground">{q.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold ${diffColor[q.diff]}`}>{q.diff}</span>
                            <span className="text-[10px] text-muted-foreground">{q.points} pts</span>
                            <button onClick={() => addCsvQuestion(q)}
                              className="ml-1 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity"
                              title="Add this question">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border p-4">
                      <button onClick={addAllCsvQuestions}
                        className="w-full rounded-lg bg-success py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 cursor-pointer transition-opacity">
                        Add All {csvParsedQuestions.length} Questions to Contest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* LeetCode Import Modal */}
      {showImportModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeImportModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                    <Download className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground">Import from LeetCode</h2>
                    <p className="text-xs text-muted-foreground">Import by URL or auto-fetch by criteria.</p>
                  </div>
                </div>
                <button onClick={closeImportModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border mx-6 mt-5">
                <button onClick={() => setImportTab("url")}
                  className={`pb-2.5 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                    importTab === "url" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  By URL
                </button>
                <button onClick={() => setImportTab("auto")}
                  className={`pb-2.5 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                    importTab === "auto" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  Auto-Fetch by Criteria
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* TAB: By URL */}
                {importTab === "url" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">LeetCode Problem URL</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="https://leetcode.com/problems/two-sum/" value={leetcodeUrl}
                          onChange={(e) => setLeetcodeUrl(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                        <button onClick={handleLeetcodeImport} disabled={importingLeetcode || !leetcodeUrl.trim()}
                          className="rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                          {importingLeetcode ? "Fetching..." : "Fetch"}
                        </button>
                      </div>
                    </div>

                    {importedPreview && (
                      <div className="rounded-xl border border-success/30 bg-success/5 p-5 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-sm font-semibold text-foreground">Problem Found</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div><span className="text-muted-foreground">Title:</span> <span className="font-semibold text-foreground">{importedPreview.title}</span></div>
                          <div><span className="text-muted-foreground">Difficulty:</span> <span className={`font-semibold ${diffColor[importedPreview.diff]}`}>{importedPreview.diff}</span></div>
                        </div>
                        <button onClick={confirmLeetcodeImport}
                          className="w-full rounded-lg bg-success py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 cursor-pointer transition-opacity">
                          Add to Contest
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Auto-Fetch */}
                {importTab === "auto" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Number of Questions</label>
                        <input type="number" min="1" max="10" value={autoFetchCriteria.count}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, count: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Difficulty Level</label>
                        <select value={autoFetchCriteria.difficulty}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, difficulty: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                          <option className="bg-popover text-foreground">Easy</option>
                          <option className="bg-popover text-foreground">Medium</option>
                          <option className="bg-popover text-foreground">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Topic</label>
                        <select value={autoFetchCriteria.topic}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, topic: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                          {["Arrays", "Strings", "Graphs", "DP", "Trees"].map((t) => (
                            <option key={t} className="bg-popover text-foreground">{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Subtopic (optional)</label>
                        <input type="text" placeholder="e.g. Sliding Window" value={autoFetchCriteria.subtopic}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, subtopic: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>

                    <button onClick={handleAutoFetch} disabled={importingLeetcode}
                      className="w-full rounded-lg bg-orange-500 py-3 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                      {importingLeetcode ? "Fetching from LeetCode..." : `Fetch ${autoFetchCriteria.count} ${autoFetchCriteria.difficulty} ${autoFetchCriteria.topic} Questions`}
                    </button>

                    {/* Fetched results */}
                    {autoFetchedQuestions.length > 0 && (
                      <div className="rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="bg-success/5 border-b border-success/20 px-4 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-xs font-semibold text-foreground">{autoFetchedQuestions.length} questions fetched</span>
                          </div>
                          <button onClick={handleAutoFetch} disabled={importingLeetcode}
                            className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer">
                            ↻ Re-fetch different set
                          </button>
                        </div>
                        <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                          {autoFetchedQuestions.map((q, idx) => (
                            <div key={q.id} className="flex items-center justify-between px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground w-5">{idx + 1}.</span>
                                <span className="text-sm text-foreground">{q.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-semibold ${diffColor[q.diff]}`}>{q.diff}</span>
                                <span className="text-[10px] text-muted-foreground">{q.points} pts</span>
                                <button onClick={() => { addQuestion(q); setAutoFetchedQuestions((prev) => prev.filter((x) => x.id !== q.id)); }}
                                  className="ml-1 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity"
                                  title="Add this question">
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border p-4 flex gap-3">
                          <button onClick={handleAutoFetch} disabled={importingLeetcode}
                            className="flex-1 rounded-lg border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors">
                            Fetch Again
                          </button>
                          <button onClick={confirmAutoFetchImport}
                            className="flex-1 rounded-lg bg-success py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 cursor-pointer transition-opacity">
                            Add All to Contest
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
