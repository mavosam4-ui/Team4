"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode2,
  Download,
  Play,
  CheckCircle2,
  Terminal,
  BookOpen,
  Copy,
  Check,
  FileText,
  FolderTree,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface PythonHubProps {
  isDark: boolean;
}

export default function PythonHubView({ isDark }: PythonHubProps) {
  const [activeTab, setActiveTab] = useState<"CODE" | "TESTS" | "DOCS">("CODE");
  const [selectedFile, setSelectedFile] = useState("main.py");
  const [fileContent, setFileContent] = useState<string>("// Loading code...");
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Test Runner States
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testStats, setTestStats] = useState<{ duration: number; timestamp: string } | null>(null);

  // Fetch file list
  useEffect(() => {
    fetch("/api/python-code")
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setAvailableFiles(data.files);
        }
      })
      .catch((err) => console.error("Failed to load file list", err));
  }, []);

  // Fetch selected file content
  useEffect(() => {
    if (!selectedFile) return;
    setIsLoadingFile(true);
    fetch(`/api/python-code?file=${encodeURIComponent(selectedFile)}`)
      .then((res) => res.json())
      .then((data) => {
        setFileContent(data.content || "// File not found");
        setIsLoadingFile(false);
      })
      .catch((err) => {
        setFileContent(`// Error loading file: ${err.message}`);
        setIsLoadingFile(false);
      });
  }, [selectedFile]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch("/api/python-test-run", { method: "POST" });
      const data = await res.json();
      setTestOutput(data.output);
      setTestStats({ duration: data.durationMs, timestamp: data.timestamp });
    } catch (err: any) {
      setTestOutput(`Error running tests: ${err.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Top Banner with Download ZIP button */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOEN 105 Coursework Deliverable</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Python 3 Desktop Project & Documentation Suite
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Complete implementation in Python 3 with CustomTkinter, SQLite3, Matplotlib, ReportLab, searching (Linear & Binary), and Bubble Sort. Download the ready-to-run ZIP archive or run automated tests right here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/download-python-zip"
              download
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Python Project (.ZIP)</span>
            </a>

            <button
              onClick={() => {
                setActiveTab("TESTS");
                handleRunTests();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Run Automated Tests</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/40">
          <button
            onClick={() => setActiveTab("CODE")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "CODE"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Python Source Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab("TESTS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "TESTS"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Automated Test Runner</span>
          </button>
          <button
            onClick={() => setActiveTab("DOCS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "DOCS"
                ? "bg-violet-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PDLC Technical Report</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CODE EXPLORER */}
      {activeTab === "CODE" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Tree (1 col) */}
          <div className={`p-4 rounded-2xl border shadow-sm space-y-3 ${cardBg}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-700/40">
              <FolderTree className="w-4 h-4 text-blue-400" />
              <span>Project Files</span>
            </div>

            <div className="space-y-1 max-h-[520px] overflow-y-auto">
              {availableFiles.map((file) => {
                const isSelected = selectedFile === file;
                return (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono truncate transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                    <span className="truncate">{file}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer (3 cols) */}
          <div className={`lg:col-span-3 rounded-2xl border shadow-sm overflow-hidden flex flex-col ${cardBg}`}>
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-400">{selectedFile}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {fileContent.split("\n").length} lines
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>

            <div className="flex-1 bg-[#070D1E] p-4 overflow-x-auto max-h-[560px]">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{fileContent}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST RUNNER */}
      {activeTab === "TESTS" && (
        <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>SOEN 105 Automated Test Suite Execution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Executes all unit tests in test_students.py, test_inventory.py, and test_algorithms.py
              </p>
            </div>
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {isRunningTests ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunningTests ? "Running Python Tests..." : "Re-Run All Tests"}</span>
            </button>
          </div>

          {testStats && (
            <div className="flex items-center gap-4 text-xs font-mono p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Test Suite Completed</span>
              </span>
              <span className="text-slate-400">Execution Duration: {testStats.duration}ms</span>
              <span className="text-slate-400">Timestamp: {new Date(testStats.timestamp).toLocaleTimeString()}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto min-h-[300px]">
            {testOutput ? (
              <pre className="whitespace-pre-wrap leading-relaxed">{testOutput}</pre>
            ) : (
              <div className="text-slate-500 flex flex-col items-center justify-center py-16 gap-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <span>Click &quot;Re-Run All Tests&quot; to execute unittest live.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PDLC TECHNICAL REPORT */}
      {activeTab === "DOCS" && (
        <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <span>SOEN 105 Program Development Life Cycle (PDLC) Comprehensive Report</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete documentation covering Problem Analysis, Pseudocode, ASCII Flowcharts, and Curriculum Mapping.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs overflow-y-auto max-h-[600px] space-y-6 leading-relaxed">
            <div>
              <h4 className="text-base font-bold text-blue-400 mb-2">1. Introduction & Overview</h4>
              <p className="text-slate-300">
                Group 4 Project is an enterprise desktop solution engineered to satisfy all requirements of the SOEN 105 Software Development Fundamentals Practical Assignment. It unifies two critical modules: Module A (Student Academic Performance Management) and Module B (Stock Inventory Management), demonstrating modular architecture, algorithmic rigor (Linear Search, Binary Search, Bubble Sort), persistent SQLite storage, and input validation.
              </p>
            </div>

            <div>
              <h4 className="text-base font-bold text-blue-400 mb-2">2. Academic Performance Mathematical Model</h4>
              <p className="text-slate-300 mb-2">
                Continuous assessment and final examination marks are combined using exact assignment weightings:
              </p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-blue-300">
                Final Score = (CAT 1 &times; 0.15) + (CAT 2 &times; 0.15) + (Examination &times; 0.70)
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                <li><strong>Grade A:</strong> 70.00% &ndash; 100.00% (Pass)</li>
                <li><strong>Grade B:</strong> 60.00% &ndash; 69.99% (Pass)</li>
                <li><strong>Grade C:</strong> 50.00% &ndash; 59.99% (Pass)</li>
                <li><strong>Grade D:</strong> 40.00% &ndash; 49.99% (Pass)</li>
                <li><strong>Grade E:</strong> Below 40.00% (Fail)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold text-blue-400 mb-2">3. Inventory & Stock Valuation Model</h4>
              <p className="text-slate-300 mb-2">
                Every product is tracked by Product ID, Name, Unit Price, and Quantity. Stock valuation is computed deterministically:
              </p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-emerald-300">
                Total Stock Value = Unit Price &times; Available Quantity
              </div>
              <p className="text-slate-300 mt-2">
                Automated stock thresholds enforce institutional replenishment alerts: Quantity &lt; 10 triggers LOW STOCK; Quantity = 0 triggers OUT OF STOCK.
              </p>
            </div>

            <div>
              <h4 className="text-base font-bold text-blue-400 mb-2">4. SOEN 105 Concept Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-indigo-400 block mb-1">Linear Search</strong>
                  Manual sequential search checking list items sequentially without SQL shortcuts.
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-indigo-400 block mb-1">Binary Search</strong>
                  O(log n) divide-and-conquer on sorted product array using low, mid, and high pointers.
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-indigo-400 block mb-1">Bubble Sort</strong>
                  Adjacent element comparison and swapping with early termination optimization flag.
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <strong className="text-indigo-400 block mb-1">Defensive Validation</strong>
                  Strict rejection of negative stock, over-issuing, negative prices, and invalid marks.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
