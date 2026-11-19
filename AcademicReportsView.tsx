"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ChevronRight,
} from "lucide-react";
import { StudentRecord } from "@/lib/algorithms";
import { generateClassPerformancePDF, generateStudentReportCardPDF } from "@/lib/pdfGenerator";
import { exportStudentsToCSV } from "@/lib/csvExporter";

interface AcademicReportsViewProps {
  students: StudentRecord[];
  isDark: boolean;
}

export default function AcademicReportsView({ students, isDark }: AcademicReportsViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students.length > 0 ? students[0].id.toString() : ""
  );

  const total = students.length;
  const passed = students.filter((s) => s.status === "PASS").length;
  const failed = students.filter((s) => s.status === "FAIL").length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

  const scores = students.map((s) => s.totalScore);
  const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : "0.00";
  const highest = scores.length > 0 ? Math.max(...scores).toFixed(2) : "0.00";
  const lowest = scores.length > 0 ? Math.min(...scores).toFixed(2) : "0.00";

  const gradeCounts = {
    A: students.filter((s) => s.grade === "A").length,
    B: students.filter((s) => s.grade === "B").length,
    C: students.filter((s) => s.grade === "C").length,
    D: students.filter((s) => s.grade === "D").length,
    E: students.filter((s) => s.grade === "E").length,
  };

  const selectedStudent = students.find((s) => s.id.toString() === selectedStudentId);

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${cardBg}`}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Academic Performance Reports Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal examination transcripts, pass/fail summaries, and SOEN 105 official class records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportStudentsToCSV(students)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Complete CSV</span>
          </button>
          <button
            onClick={() => generateClassPerformancePDF(students)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Class PDF Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Class Weighted Average</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{avg}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">CAT1 (15%) + CAT2 (15%) + Exam (70%)</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Overall Pass Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{passRate}%</div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">{passed} of {total} Passed (&ge;40%)</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Highest Achieved Mark</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{highest}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Grade A distinction</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Lowest Achieved Mark</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{lowest}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{failed} student(s) failed (&lt;40%)</div>
        </div>
      </div>

      {/* Grade Breakdown & Individual Transcript Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Breakdown */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Grade Distribution Table & Ratios</span>
          </h3>

          <div className="space-y-3">
            {[
              { grade: "A", range: "70.00% – 100.00%", count: gradeCounts.A, color: "bg-emerald-500", text: "text-emerald-400" },
              { grade: "B", range: "60.00% – 69.99%", count: gradeCounts.B, color: "bg-blue-500", text: "text-blue-400" },
              { grade: "C", range: "50.00% – 59.99%", count: gradeCounts.C, color: "bg-cyan-500", text: "text-cyan-400" },
              { grade: "D", range: "40.00% – 49.99%", count: gradeCounts.D, color: "bg-amber-500", text: "text-amber-400" },
              { grade: "E", range: "Below 40.00% (Fail)", count: gradeCounts.E, color: "bg-rose-500", text: "text-rose-400" },
            ].map((g) => {
              const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;
              return (
                <div key={g.grade} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md ${g.color} text-white flex items-center justify-center font-bold text-xs`}>
                        {g.grade}
                      </span>
                      <span>{g.range}</span>
                    </span>
                    <span className={g.text}>
                      {g.count} students ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div style={{ width: `${pct}%` }} className={`h-full ${g.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Student Transcript Generator */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Individual Student Transcript Generator</span>
          </h3>

          <p className="text-xs text-slate-400">
            Select an enrolled student to preview their academic standing and download an official PDF transcript card.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Student Record:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200"
              }`}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id.toString()}>
                  {s.registrationNumber} — {s.fullName} ({s.totalScore.toFixed(2)}%, Grade {s.grade})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedStudent.fullName}</h4>
                  <span className="font-mono text-blue-400">{selectedStudent.registrationNumber}</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    selectedStudent.status === "PASS"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">CAT 1 (15%)</div>
                  <div className="font-bold font-mono text-sm">{selectedStudent.cat1.toFixed(1)}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">CAT 2 (15%)</div>
                  <div className="font-bold font-mono text-sm">{selectedStudent.cat2.toFixed(1)}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">Exam (70%)</div>
                  <div className="font-bold font-mono text-sm">{selectedStudent.examination.toFixed(1)}</div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Aggregate Score:</span>
                <span className="font-bold text-blue-400 font-mono text-sm">
                  {selectedStudent.totalScore.toFixed(2)}% (Grade {selectedStudent.grade})
                </span>
              </div>

              <button
                onClick={() => generateStudentReportCardPDF(selectedStudent)}
                className="w-full mt-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Transcript PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
