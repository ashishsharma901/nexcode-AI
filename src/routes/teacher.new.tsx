import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { Plus, X, Eye, EyeOff, CheckCircle2, Download, Upload, FileSpreadsheet, Search } from "lucide-react";

export const Route = createFileRoute("/teacher/new")({ component: NewQuestion });

interface TestCase {
  id: string;
  input: string;
  output: string;
  isPublic: boolean;
}

interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

const defaultStarterCode: Record<string, string> = {
  Python: `def solve():\n    # Write your solution here\n    pass`,
  "C++": `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  Java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
  JavaScript: `const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\n\n// Write your solution here`,
};

function SectionDivider({ label, onAdd }: { label: string; onAdd?: () => void }) {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="h-px flex-1 bg-border" />
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1 text-xs text-primary hover:text-foreground cursor-pointer">
          <Plus className="h-3 w-3" /> add
        </button>
      )}
    </div>
  );
}

function NewQuestion() {
  const [title, setTitle] = useState("New question");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [topic, setTopic] = useState("Graphs");
  const [tags, setTags] = useState(["bfs", "shortest-path"]);
  const [newTag, setNewTag] = useState("");
  const [statement, setStatement] = useState("Write the problem statement here. Use prose, not bullet points — make it read like a story the student steps into.\n\nGiven a directed graph...");
  const [constraints, setConstraints] = useState("1 ≤ n ≤ 1000\nedges are unique\ncapacities fit in int32");
  const [inputFormat, setInputFormat] = useState("First line: integer n (number of nodes)\nSecond line: integer m (number of edges)\nNext m lines: u v w (edge from u to v with weight w)");
  const [outputFormat, setOutputFormat] = useState("Single integer — the maximum flow from source to sink.");

  const [examples, setExamples] = useState<Example[]>([
    { id: "ex1", input: "n=4, edges=[[0,1,3],[0,2,2],[1,3,2],[2,3,3]]", output: "5", explanation: "Path 0→1→3 carries 2, path 0→2→3 carries 3. Total flow = 5." },
  ]);

  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: "tc1", input: "4 4\n0 1 3\n0 2 2\n1 3 2\n2 3 3", output: "5", isPublic: true },
    { id: "tc2", input: "2 1\n0 1 10", output: "10", isPublic: true },
    { id: "tc3", input: "5 7\n0 1 10\n0 2 8\n1 2 5\n1 3 7\n2 4 10\n3 4 6\n2 3 3", output: "15", isPublic: false },
  ]);

  const [activeCodeLang, setActiveCodeLang] = useState("Python");
  const [starterCode, setStarterCode] = useState<Record<string, string>>(defaultStarterCode);

  const [saved, setSaved] = useState(false);

  // Import modals state
  const [showLeetcodeModal, setShowLeetcodeModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [importTab, setImportTab] = useState<"url" | "auto">("url");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [importingLc, setImportingLc] = useState(false);
  const [lcPreview, setLcPreview] = useState<{ title: string; diff: string; topic: string } | null>(null);
  const [autoFetchCriteria, setAutoFetchCriteria] = useState({ count: "1", difficulty: "Medium", topic: "Arrays", subtopic: "" });
  const [autoFetchedList, setAutoFetchedList] = useState<{ id: string; title: string; diff: string; topic: string }[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvPreview, setCsvPreview] = useState<{ title: string; diff: string; topic: string; tags: string }[]>([]);

  // LeetCode by URL
  const handleLcUrlFetch = () => {
    if (!leetcodeUrl.trim()) return;
    setImportingLc(true);
    setTimeout(() => {
      const slug = leetcodeUrl.split("/").filter(Boolean).pop() || "problem";
      const t = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      setLcPreview({ title: t, diff: "Medium", topic: "Imported" });
      setImportingLc(false);
    }, 1200);
  };

  const applyLcUrl = () => {
    if (lcPreview) {
      setTitle(lcPreview.title);
      setDifficulty(lcPreview.diff as "Easy" | "Medium" | "Hard");
      setTopic(lcPreview.topic);
      setStatement(`Imported from LeetCode: ${lcPreview.title}\n\nWrite the problem statement here...`);
      setLcPreview(null);
      setLeetcodeUrl("");
      setShowLeetcodeModal(false);
    }
  };

  // LeetCode auto-fetch
  const lcPool: Record<string, Record<string, string[]>> = {
    Easy: { Arrays: ["Two Sum", "Remove Duplicates", "Best Time to Buy Stock", "Contains Duplicate", "Move Zeroes"], Strings: ["Valid Anagram", "Reverse String", "Valid Palindrome"], Graphs: ["Flood Fill", "Island Perimeter"], DP: ["Climbing Stairs", "House Robber"], Trees: ["Max Depth of Binary Tree", "Invert Binary Tree"] },
    Medium: { Arrays: ["3Sum", "Container With Most Water", "Product of Array Except Self", "Spiral Matrix"], Strings: ["Longest Substring Without Repeating", "Group Anagrams", "Decode Ways"], Graphs: ["Number of Islands", "Course Schedule", "Clone Graph"], DP: ["Coin Change", "Longest Increasing Subsequence", "Unique Paths"], Trees: ["Binary Tree Level Order", "Validate BST"] },
    Hard: { Arrays: ["Trapping Rain Water", "First Missing Positive", "Sliding Window Maximum"], Strings: ["Minimum Window Substring", "Edit Distance"], Graphs: ["Word Ladder", "Alien Dictionary"], DP: ["Burst Balloons", "Palindrome Partitioning II"], Trees: ["Serialize and Deserialize BT", "Binary Tree Max Path Sum"] },
  };

  const handleAutoFetch = () => {
    setImportingLc(true);
    setAutoFetchedList([]);
    setTimeout(() => {
      const d = autoFetchCriteria.difficulty;
      const t = autoFetchCriteria.topic;
      const count = Math.min(parseInt(autoFetchCriteria.count) || 1, 8);
      const pool = lcPool[d]?.[t] || lcPool[d]?.["Arrays"] || [];
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
      setAutoFetchedList(shuffled.map((title, i) => ({ id: `af-${Date.now()}-${i}`, title, diff: d, topic: t })));
      setImportingLc(false);
    }, 1000);
  };

  const applyAutoFetched = (item: { title: string; diff: string; topic: string }) => {
    setTitle(item.title);
    setDifficulty(item.diff as "Easy" | "Medium" | "Hard");
    setTopic(item.topic);
    setStatement(`Imported from LeetCode: ${item.title}\n\nWrite the problem statement here...`);
    setAutoFetchedList([]);
    setShowLeetcodeModal(false);
  };

  // CSV import
  const handleCsvUpload = () => {
    setCsvImporting(true);
    setCsvFileName("questions_template.csv");
    setTimeout(() => {
      setCsvPreview([
        { title: "Reverse Linked List", diff: "Easy", topic: "Linked List", tags: "linked-list, recursion" },
        { title: "Merge Intervals", diff: "Medium", topic: "Arrays", tags: "sorting, intervals" },
        { title: "Binary Tree Zigzag", diff: "Medium", topic: "Trees", tags: "bfs, tree" },
      ]);
      setCsvImporting(false);
    }, 800);
  };

  const applyCsvQuestion = (item: { title: string; diff: string; topic: string; tags: string }) => {
    setTitle(item.title);
    setDifficulty(item.diff as "Easy" | "Medium" | "Hard");
    setTopic(item.topic);
    setTags(item.tags.split(",").map((t) => t.trim()).filter(Boolean));
    setStatement(`Imported: ${item.title}\n\nWrite the problem statement here...`);
    setCsvPreview([]);
    setCsvFileName("");
    setShowCsvModal(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const addExample = () => {
    setExamples([...examples, { id: Math.random().toString(), input: "", output: "", explanation: "" }]);
  };

  const removeExample = (id: string) => setExamples(examples.filter((e) => e.id !== id));

  const updateExample = (id: string, field: keyof Example, value: string) => {
    setExamples(examples.map((e) => e.id === id ? { ...e, [field]: value } : e));
  };

  const addTestCase = () => {
    setTestCases([...testCases, { id: Math.random().toString(), input: "", output: "", isPublic: false }]);
  };

  const removeTestCase = (id: string) => setTestCases(testCases.filter((tc) => tc.id !== id));

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(testCases.map((tc) => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  const handlePublish = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const publicCount = testCases.filter((tc) => tc.isPublic).length;
  const hiddenCount = testCases.filter((tc) => !tc.isPublic).length;

  return (
    <div className="min-h-screen pb-28">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <Link to="/teacher/questions" className="hover:text-foreground transition-colors">Question Bank</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">New Question</span>
        </div>
        <div>
          {saved && <span className="text-xs text-success font-semibold">✓ Published successfully</span>}
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[800px] px-6 pt-12">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-0 bg-transparent font-serif text-5xl text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Problem title..."
        />

        {/* Metadata Row */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          {/* Difficulty Toggle */}
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            {(["Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-full px-3 py-1 text-xs cursor-pointer transition-all ${
                  difficulty === d ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Topic Selector */}
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-transparent border border-border rounded-full px-3 py-1 text-xs text-foreground outline-none cursor-pointer"
          >
            {["Arrays", "Strings", "Graphs", "Trees", "DP", "Design", "Linked List", "Sorting"].map((t) => (
              <option key={t} value={t} className="bg-popover text-foreground">{t}</option>
            ))}
          </select>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
                #{t}
                <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-danger cursor-pointer">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            <input
              placeholder="add tag…"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              className="border-0 bg-transparent text-[11px] text-muted-foreground outline-none w-16"
            />
          </div>
        </div>

        <hr className="my-10 border-border" />

        {/* Import Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs text-muted-foreground">Quick import:</span>
          <button onClick={() => setShowLeetcodeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 text-[11px] font-semibold text-orange-600 hover:bg-orange-500/20 transition-colors cursor-pointer">
            <Download className="h-3 w-3" /> LeetCode Import
          </button>
          <button onClick={() => setShowCsvModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer">
            <FileSpreadsheet className="h-3 w-3" /> CSV Import
          </button>
        </div>

        {/* Problem Statement */}
        <div>
          <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
            <button className="hover:text-foreground cursor-pointer"><b>B</b></button>
            <button className="italic hover:text-foreground cursor-pointer">I</button>
            <button className="font-mono hover:text-foreground cursor-pointer">{`</>`}</button>
            <button className="hover:text-foreground cursor-pointer">∑</button>
            <button className="hover:text-foreground cursor-pointer">img</button>
          </div>
          <textarea
            rows={8}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            className="w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-foreground outline-none"
          />
        </div>

        {/* Constraints */}
        <SectionDivider label="Constraints" />
        <textarea
          rows={3}
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-context-bar p-4 font-mono text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Input/Output Format */}
        <SectionDivider label="Input Format" />
        <textarea
          rows={3}
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-context-bar p-4 font-mono text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary"
        />

        <SectionDivider label="Output Format" />
        <textarea
          rows={2}
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-context-bar p-4 font-mono text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Examples */}
        <SectionDivider label="Examples" onAdd={addExample} />
        <div className="space-y-4">
          {examples.map((ex, idx) => (
            <div key={ex.id} className="rounded-lg border border-border p-5 relative group">
              <button
                onClick={() => removeExample(ex.id)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Example {idx + 1}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">Input</label>
                  <textarea
                    rows={2}
                    value={ex.input}
                    onChange={(e) => updateExample(ex.id, "input", e.target.value)}
                    className="w-full resize-none rounded border border-border bg-transparent p-2 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">Output</label>
                  <textarea
                    rows={2}
                    value={ex.output}
                    onChange={(e) => updateExample(ex.id, "output", e.target.value)}
                    className="w-full resize-none rounded border border-border bg-transparent p-2 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-[10px] text-muted-foreground mb-1">Explanation (optional)</label>
                <input
                  type="text"
                  value={ex.explanation}
                  onChange={(e) => updateExample(ex.id, "explanation", e.target.value)}
                  className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Brief explanation of the example..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Test Cases */}
        <SectionDivider label={`Test Cases (${publicCount} public · ${hiddenCount} hidden)`} onAdd={addTestCase} />
        <div className="space-y-3">
          {testCases.map((tc, idx) => (
            <div key={tc.id} className={`rounded-lg border p-4 relative group transition-colors ${tc.isPublic ? "border-border" : "border-border bg-muted/20"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Case {idx + 1}</span>
                  <button
                    onClick={() => updateTestCase(tc.id, "isPublic", !tc.isPublic)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors ${
                      tc.isPublic ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tc.isPublic ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                    {tc.isPublic ? "Public" : "Hidden"}
                  </button>
                </div>
                <button
                  onClick={() => removeTestCase(tc.id)}
                  className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">Input</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => updateTestCase(tc.id, "input", e.target.value)}
                    className="w-full resize-none rounded border border-border bg-transparent p-2 font-mono text-[11px] text-foreground outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Test input..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">Expected Output</label>
                  <textarea
                    rows={2}
                    value={tc.output}
                    onChange={(e) => updateTestCase(tc.id, "output", e.target.value)}
                    className="w-full resize-none rounded border border-border bg-transparent p-2 font-mono text-[11px] text-foreground outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Expected output..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Starter Code */}
        <SectionDivider label="Starter Code Templates" />
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex border-b border-border bg-muted/30">
            {Object.keys(starterCode).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveCodeLang(lang)}
                className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors ${
                  activeCodeLang === lang
                    ? "bg-background text-foreground border-b-2 border-primary -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <textarea
            rows={6}
            value={starterCode[activeCodeLang]}
            onChange={(e) => setStarterCode({ ...starterCode, [activeCodeLang]: e.target.value })}
            className="w-full resize-none bg-code-bg p-4 font-mono text-[13px] text-foreground outline-none"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm z-30">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Save draft</button>
            <span className="text-xs text-muted-foreground">
              {testCases.length} test cases · {tags.length} tags
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/teacher/questions" className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
            <button
              onClick={handlePublish}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm z-30">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Save draft</button>
            <span className="text-xs text-muted-foreground">
              {testCases.length} test cases · {tags.length} tags
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/teacher/questions" className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
            <button
              onClick={handlePublish}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* LeetCode Import Modal */}
      {showLeetcodeModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => { setShowLeetcodeModal(false); setLcPreview(null); setAutoFetchedList([]); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                    <Download className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground">Import from LeetCode</h2>
                    <p className="text-xs text-muted-foreground">Auto-fill this question from a LeetCode problem.</p>
                  </div>
                </div>
                <button onClick={() => { setShowLeetcodeModal(false); setLcPreview(null); setAutoFetchedList([]); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex border-b border-border mx-6 mt-5">
                <button onClick={() => setImportTab("url")} className={`pb-2.5 px-4 text-xs font-semibold border-b-2 cursor-pointer ${importTab === "url" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>By URL</button>
                <button onClick={() => setImportTab("auto")} className={`pb-2.5 px-4 text-xs font-semibold border-b-2 cursor-pointer ${importTab === "auto" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>Auto-Fetch by Criteria</button>
              </div>
              <div className="p-6 space-y-4">
                {importTab === "url" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">LeetCode Problem URL</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="https://leetcode.com/problems/two-sum/" value={leetcodeUrl}
                          onChange={(e) => setLeetcodeUrl(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                        <button onClick={handleLcUrlFetch} disabled={importingLc || !leetcodeUrl.trim()}
                          className="rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer">
                          {importingLc ? "Fetching..." : "Fetch"}
                        </button>
                      </div>
                    </div>
                    {lcPreview && (
                      <div className="rounded-xl border border-success/30 bg-success/5 p-5 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-sm font-semibold text-foreground">Problem Found</span></div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div><span className="text-muted-foreground">Title:</span> <span className="font-semibold text-foreground">{lcPreview.title}</span></div>
                          <div><span className="text-muted-foreground">Difficulty:</span> <span className="font-semibold text-foreground">{lcPreview.diff}</span></div>
                        </div>
                        <button onClick={applyLcUrl} className="w-full rounded-lg bg-success py-2.5 text-xs font-bold text-success-foreground hover:opacity-90 cursor-pointer">
                          Apply to This Question
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {importTab === "auto" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Number of Suggestions</label>
                        <input type="number" min="1" max="8" value={autoFetchCriteria.count}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, count: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Difficulty</label>
                        <select value={autoFetchCriteria.difficulty} onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, difficulty: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                          <option className="bg-popover text-foreground">Easy</option>
                          <option className="bg-popover text-foreground">Medium</option>
                          <option className="bg-popover text-foreground">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Topic</label>
                        <select value={autoFetchCriteria.topic} onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, topic: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
                          {["Arrays", "Strings", "Graphs", "DP", "Trees"].map((t) => <option key={t} className="bg-popover text-foreground">{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Subtopic (optional)</label>
                        <input type="text" placeholder="e.g. Sliding Window" value={autoFetchCriteria.subtopic}
                          onChange={(e) => setAutoFetchCriteria({ ...autoFetchCriteria, subtopic: e.target.value })}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <button onClick={handleAutoFetch} disabled={importingLc}
                      className="w-full rounded-lg bg-orange-500 py-3 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer">
                      {importingLc ? "Fetching..." : "Fetch Suggestions"}
                    </button>
                    {autoFetchedList.length > 0 && (
                      <div className="rounded-xl border border-border overflow-hidden animate-in fade-in duration-200">
                        <div className="bg-success/5 border-b border-success/20 px-4 py-2.5 flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">{autoFetchedList.length} suggestions</span>
                          <button onClick={handleAutoFetch} disabled={importingLc} className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer">↻ Re-fetch</button>
                        </div>
                        <div className="divide-y divide-border max-h-[180px] overflow-y-auto">
                          {autoFetchedList.map((q) => (
                            <div key={q.id} className="flex items-center justify-between px-4 py-2.5">
                              <span className="text-sm text-foreground">{q.title}</span>
                              <button onClick={() => applyAutoFetched(q)}
                                className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90 cursor-pointer">
                                Use This
                              </button>
                            </div>
                          ))}
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

      {/* CSV Import Modal */}
      {showCsvModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCsvModal(false); setCsvPreview([]); setCsvFileName(""); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground">Import from CSV</h2>
                    <p className="text-xs text-muted-foreground">Upload a question using our template format.</p>
                  </div>
                </div>
                <button onClick={() => { setShowCsvModal(false); setCsvPreview([]); setCsvFileName(""); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-5 w-5" /></button>
              </div>
              <div className="px-6 pb-6 space-y-5">
                {/* Download template */}
                <div className="rounded-xl border border-border bg-muted/10 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Download Template</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Columns: title, difficulty, topic, tags, statement, constraints</p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer">
                    <Download className="h-3.5 w-3.5 text-success" /> .csv
                  </button>
                </div>
                {/* Upload */}
                <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Upload File</p>
                  {!csvFileName ? (
                    <button onClick={handleCsvUpload}
                      className="w-full rounded-xl border-2 border-dashed border-border py-6 text-center hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all group">
                      <Upload className="h-5 w-5 mx-auto text-muted-foreground group-hover:text-primary" />
                      <p className="mt-1.5 text-xs text-muted-foreground group-hover:text-foreground">Click to select .csv or .xlsx</p>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3">
                      <FileSpreadsheet className="h-5 w-5 text-success" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{csvFileName}</p>
                        <p className="text-[10px] text-muted-foreground">{csvPreview.length} questions parsed</p>
                      </div>
                      <button onClick={() => { setCsvFileName(""); setCsvPreview([]); }} className="text-xs text-muted-foreground hover:text-danger cursor-pointer">Remove</button>
                    </div>
                  )}
                </div>
                {/* Preview */}
                {csvPreview.length > 0 && (
                  <div className="rounded-xl border border-border overflow-hidden animate-in fade-in duration-200">
                    <div className="bg-muted/30 px-4 py-2.5 text-xs font-semibold text-foreground">Select a question to import</div>
                    <div className="divide-y divide-border">
                      {csvPreview.map((q, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <span className="text-sm text-foreground">{q.title}</span>
                            <span className="ml-2 text-[10px] text-muted-foreground">{q.diff} · {q.topic}</span>
                          </div>
                          <button onClick={() => applyCsvQuestion(q)}
                            className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90 cursor-pointer">
                            Use This
                          </button>
                        </div>
                      ))}
                    </div>
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
