"use client";

import React, { useState } from "react";
import {
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  ListOrdered,
  ArrowRight,
  Info,
} from "lucide-react";
import { StudentRecord, linearSearchStudents } from "@/lib/algorithms";

interface AcademicResultsViewProps {
  students: StudentRecord[];
  isDark: boolean;
}

export default function AcademicResultsView({ students, isDark }: AcademicResultsViewProps) {
  const [targetRegNo, setTargetRegNo] = useState("BCS-003-2025");
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [searchExecution, setSearchExecution] = useState<ReturnType<typeof linearSearchStudents> | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const handleStartSearch = () => {
    if (!targetRegNo.trim()) return;
    const result = linearSearchStudents(students, targetRegNo);
    setSearchExecution(result);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (!searchExecution || currentStepIndex === null) return;
    if (currentStepIndex < searchExecution.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setSearchExecution(null);
    setCurrentStepIndex(null);
    setIsAutoPlaying(false);
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  const activeStep = searchExecution && currentStepIndex !== null ? searchExecution.steps[currentStepIndex] : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>SOEN 105 Algorithm Practical Demonstration</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Sequential Linear Search Algorithm (Students)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strictly demonstrates manual sequential search traversing student array records element-by-element by Registration Number. This is not a database query shortcut.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total records in array:</span>
            <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30">
              {students.length} Students
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={targetRegNo}
              onChange={(e) => setTargetRegNo(e.target.value)}
              placeholder="e.g. BCS-003-2025"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <button
            onClick={handleStartSearch}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute Linear Search</span>
          </button>

          {searchExecution && (
            <>
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === searchExecution.steps.length - 1}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 disabled:opacity-40 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Execution Visualizer & Array Display */}
      {searchExecution && currentStepIndex !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step Inspector (Left 2 cols) */}
          <div className={`lg:col-span-2 p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Sequential Execution Trace</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Step:</span>
                <span className="font-mono font-bold text-blue-400">
                  {currentStepIndex + 1} of {searchExecution.steps.length}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">Comparisons made:</span>
                <span className="font-mono font-bold text-amber-400">
                  {currentStepIndex + 1}
                </span>
              </div>
            </div>

            {/* Current Step Highlight */}
            {activeStep && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  activeStep.isMatch
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-800/40 border-slate-700/50 text-slate-300"
                }`}
              >
                {activeStep.isMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Index [{activeStep.index}] Inspection:
                  </div>
                  <p className="text-xs font-mono">{activeStep.notes}</p>
                </div>
              </div>
            )}

            {/* Visual Array Grid */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Memory Array Buffer (Index 0 to {students.length - 1}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {students.map((st, idx) => {
                  const isCurrent = activeStep?.index === idx;
                  const isPast = activeStep ? idx < activeStep.index : false;
                  const isMatched = activeStep?.index === idx && activeStep.isMatch;

                  return (
                    <div
                      key={st.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isMatched
                          ? "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg scale-105"
                          : isCurrent
                          ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400 shadow-md scale-102"
                          : isPast
                          ? "opacity-50 bg-slate-900 border-slate-800"
                          : isDark
                          ? "bg-slate-900/50 border-slate-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1 opacity-80 font-mono">
                        <span>Index [{idx}]</span>
                        {isCurrent && <span className="font-bold">INSPECTING</span>}
                        {isMatched && <span className="font-bold">MATCH</span>}
                      </div>
                      <div className="font-mono font-bold truncate">{st.registrationNumber}</div>
                      <div className="truncate text-[11px] opacity-90">{st.fullName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Algorithm Details & Match Card (Right col) */}
          <div className="space-y-4">
            {/* Final Outcome Card */}
            {searchExecution && (
              <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Search Result
                </h4>
                {searchExecution.found && searchExecution.result ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      <div className="font-bold text-sm mb-1">Match Successfully Located!</div>
                      <div>Found after {searchExecution.totalComparisons} comparison(s).</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Full Name:</span>
                        <span className="font-bold">{searchExecution.result.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reg Number:</span>
                        <span className="font-mono text-blue-400 font-bold">
                          {searchExecution.result.registrationNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weighted Score:</span>
                        <span className="font-bold">{searchExecution.result.totalScore.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Grade & Status:</span>
                        <span className="font-bold">
                          Grade {searchExecution.result.grade} ({searchExecution.result.status})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    <div className="font-bold text-sm mb-1">Target Not Found</div>
                    <div>
                      Scanned all {students.length} elements without finding &apos;{targetRegNo}&apos;.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pseudocode Reference Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm font-mono text-xs ${cardBg}`}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>SOEN 105 Pseudocode Reference</span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-blue-300 text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i].reg_no == target:
            return arr[i] # Found
    return None       # Not Found`}
              </pre>
              <p className="text-[10px] text-slate-400 mt-2 font-sans">
                Time Complexity: Best Case O(1), Worst Case O(n).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
