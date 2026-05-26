import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/teacher/upload")({ component: BulkUpload });

interface ParsedQuestion {
  row: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  tags: string;
  testCases: number;
  valid: boolean;
  error?: string;
}

const mockParsedData: ParsedQuestion[] = [
  { row: 1, title: "Binary Search", difficulty: "Easy", topic: "Arrays", tags: "binary-search, divide-conquer", testCases: 12, valid: true },
  { row: 2, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Strings", tags: "dp, string", testCases: 18, valid: true },
  { row: 3, title: "", difficulty: "Hard", topic: "Graphs", tags: "bfs", testCases: 0, valid: false, error: "Missing title" },
  { row: 4, title: "Rotate Image", difficulty: "Medium", topic: "Arrays", tags: "matrix, in-place", testCases: 10, valid: true },
  { row: 5, title: "Serialize Binary Tree", difficulty: "Hard", topic: "Trees", tags: "tree, bfs, dfs", testCases: 15, valid: true },
  { row: 6, title: "Group Anagrams", difficulty: "Medium", topic: "Strings", tags: "hash-map, sorting", testCases: 14, valid: true },
  { row: 7, title: "Jump Game", difficulty: "Medium", topic: "DP", tags: "greedy, dp", testCases: 0, valid: false, error: "No test cases provided" },
  { row: 8, title: "Kth Largest Element", difficulty: "Medium", topic: "Arrays", tags: "heap, quickselect", testCases: 16, valid: true },
];

function BulkUpload() {
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload");
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState<ParsedQuestion[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = () => {
    // Simulate file selection and parsing
    setFileName("dsa_questions_batch_2026.xlsx");
    setParsedData(mockParsedData);
    setStep("preview");
  };

  const validCount = parsedData.filter((q) => q.valid).length;
  const errorCount = parsedData.filter((q) => !q.valid).length;

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setStep("success");
    }, 1500);
  };

  const removeRow = (row: number) => {
    setParsedData((prev) => prev.filter((q) => q.row !== row));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav role="teacher" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Faculty Desk</span>
          <span className="text-border">/</span>
          <span>Question Bank</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Bulk Upload</span>
        </div>
        <div />
      </ContextBar>

      <div className="mx-auto max-w-[900px] px-6 pt-12">
        {step === "upload" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-4xl text-foreground">Bulk Upload Questions</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Import multiple questions at once from a structured Excel or CSV file.
              </p>
            </div>

            {/* Upload Zone */}
            <div
              onClick={handleFileSelect}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-surface p-16 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
              </div>
              <h2 className="font-serif text-2xl text-foreground">Drop your file here</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                or click to browse. Accepts <span className="font-semibold text-foreground">.xlsx</span> and <span className="font-semibold text-foreground">.csv</span> files.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">Maximum 200 questions per upload</p>
            </div>

            {/* Template Download */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-success" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Download Template</h3>
                    <p className="text-xs text-muted-foreground">Use our structured template to ensure correct column mapping.</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer">
                  <Download className="h-3.5 w-3.5" /> Download .xlsx
                </button>
              </div>
            </div>

            {/* Expected Format */}
            <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Expected Column Format</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-4 font-semibold">Column</th>
                      <th className="py-2 pr-4 font-semibold">Required</th>
                      <th className="py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { col: "title", req: "Yes", desc: "Problem title (e.g. 'Two Sum')" },
                      { col: "statement", req: "Yes", desc: "Full problem description (supports markdown)" },
                      { col: "difficulty", req: "Yes", desc: "Easy, Medium, or Hard" },
                      { col: "topic", req: "Yes", desc: "Primary topic (e.g. Arrays, Graphs, DP)" },
                      { col: "subtopic", req: "No", desc: "Subtopic (e.g. Sliding Window, BFS)" },
                      { col: "tags", req: "No", desc: "Comma-separated tags" },
                      { col: "constraints", req: "Yes", desc: "Input constraints (newline-separated)" },
                      { col: "input_format", req: "Yes", desc: "How input is structured" },
                      { col: "output_format", req: "Yes", desc: "Expected output format" },
                      { col: "test_input_1", req: "Yes", desc: "First test case input" },
                      { col: "test_output_1", req: "Yes", desc: "First test case expected output" },
                    ].map((r) => (
                      <tr key={r.col}>
                        <td className="py-2 pr-4 font-mono font-semibold text-foreground">{r.col}</td>
                        <td className="py-2 pr-4">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${r.req === "Yes" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {r.req}
                          </span>
                        </td>
                        <td className="py-2 text-muted-foreground">{r.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-4xl text-foreground">Preview & Validate</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Parsed <span className="font-semibold text-foreground">{fileName}</span> — review before importing.
              </p>
            </div>

            {/* Summary Bar */}
            <div className="flex items-center gap-6 rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">{validCount} valid</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-danger" />
                  <span className="text-sm font-semibold text-danger">{errorCount} errors</span>
                </div>
              )}
              <div className="flex-1" />
              <button
                onClick={() => { setStep("upload"); setParsedData([]); setFileName(""); }}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Re-upload file
              </button>
            </div>

            {/* Preview Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                    <th className="py-3 px-4 font-semibold w-12">Row</th>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold text-center">Difficulty</th>
                    <th className="py-3 px-4 font-semibold">Topic</th>
                    <th className="py-3 px-4 font-semibold text-center">Tests</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedData.map((q) => (
                    <tr key={q.row} className={`text-sm transition-colors ${!q.valid ? "bg-danger/5" : "hover:bg-hover-row"}`}>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{q.row}</td>
                      <td className="py-3 px-4">
                        {q.title ? (
                          <span className="font-medium text-foreground">{q.title}</span>
                        ) : (
                          <span className="italic text-danger text-xs">— missing —</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          q.difficulty === "Easy" ? "bg-success/15 text-success" :
                          q.difficulty === "Medium" ? "bg-warning/15 text-warning" :
                          "bg-danger/15 text-danger"
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{q.topic}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-muted-foreground">{q.testCases || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        {q.valid ? (
                          <CheckCircle2 className="inline h-4 w-4 text-success" />
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-danger font-semibold">
                            <AlertCircle className="h-3 w-3" /> {q.error}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => removeRow(q.row)} className="text-muted-foreground hover:text-danger cursor-pointer">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import Button */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-xs text-muted-foreground">
                Only valid rows will be imported. Rows with errors will be skipped.
              </p>
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {importing ? "Importing..." : `Import ${validCount} Questions`}
                {!importing && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-serif text-4xl text-foreground">Import Complete</h1>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Successfully imported <span className="font-semibold text-foreground">{validCount} questions</span> into your question bank.
              {errorCount > 0 && <> {errorCount} rows were skipped due to validation errors.</>}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link
                to="/teacher/questions"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                View Question Bank
              </Link>
              <button
                onClick={() => { setStep("upload"); setParsedData([]); setFileName(""); }}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
