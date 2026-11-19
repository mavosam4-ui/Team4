"use client";

import React from "react";
import { Info, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Layers } from "lucide-react";

interface AboutViewProps {
  isDark: boolean;
}

export default function AboutView({ isDark }: AboutViewProps) {
  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold tracking-tight">About Group 4 Project</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl">
          GROUP 4 PROJECT &bull; Version 2.5.0-ENTERPRISE &bull; SOEN 105 Software Development Fundamentals Practical Assignment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Executive Specification</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Group 4 Project unifies two independent administrative systems:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Module A (Academic Performance Management):</strong> Records student assessment marks, applies exact weighting (CAT1 15%, CAT2 15%, Exam 70%), evaluates letter grades A through E, determines PASS/FAIL classification, and executes manual Linear Search.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Module B (Inventory & Stock Management):</strong> Catalogs product assets, computes valuation (Price &times; Quantity), processes stock movements (Receive, Issue), defends against negative inventory, and demonstrates manual Linear Search, Binary Search, and Bubble Sort.
              </span>
            </li>
          </ul>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Technology Stack</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Python Engine</span>
              <span className="font-bold text-white">Python 3.10+ / CustomTkinter</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Storage</span>
              <span className="font-bold text-white">SQLite 3 / PostgreSQL (ACID)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Visual Analytics</span>
              <span className="font-bold text-white">Matplotlib / Dynamic SVG</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Report Engine</span>
              <span className="font-bold text-white">ReportLab / jsPDF / CSV</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1.5" />
            <span>Compliant with all SOEN 105 software development fundamentals guidelines.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
