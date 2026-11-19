"use client";

import React from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Award,
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { NavTab } from "./Sidebar";
import { StudentRecord, ProductRecord } from "@/lib/algorithms";

interface DashboardData {
  academic: {
    totalStudents: number;
    passedStudents: number;
    failedStudents: number;
    classAverage: number;
    highestScore: number;
    lowestScore: number;
    passRate: number;
    gradeCounts: { A: number; B: number; C: number; D: number; E: number };
  };
  inventory: {
    totalProducts: number;
    totalUnits: number;
    totalInventoryValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    normalStockCount: number;
    highestValueProduct: { name: string; value: number } | null;
  };
  recentStudents: StudentRecord[];
  recentTransactions: any[];
}

interface DashboardViewProps {
  data: DashboardData | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewStudent: () => void;
  onOpenNewProduct: () => void;
  onOpenNewTransaction: () => void;
  isDark: boolean;
}

export default function DashboardView({
  data,
  loading,
  onRefresh,
  onSelectTab,
  onOpenNewStudent,
  onOpenNewProduct,
  onOpenNewTransaction,
  isDark,
}: DashboardViewProps) {
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading live academic & inventory metrics...</p>
      </div>
    );
  }

  const { academic, inventory, recentStudents, recentTransactions } = data;

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  // SVG Bar Chart for Grade Distribution
  const gradeKeys: Array<keyof typeof academic.gradeCounts> = ["A", "B", "C", "D", "E"];
  const maxGradeCount = Math.max(...gradeKeys.map((g) => academic.gradeCounts[g]), 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-4 sm:p-6 lg:p-8 text-white border border-blue-800/40 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] sm:text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">SOEN 105 Software Development Fundamentals Practical Assignment</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Group 4 Project
            </h2>
            <p className="text-blue-200/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Consolidated real-time desktop operations portal integrating Student Academic Performance (CAT1 15%, CAT2 15%, Exam 70%) and Warehouse Inventory Stock Management.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenNewStudent}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
            <button
              onClick={onOpenNewProduct}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Product</span>
            </button>
            <button
              onClick={onOpenNewTransaction}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Stock Movement</span>
            </button>
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Academic Performance KPI Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span>Academic Performance Metrics (Module A)</span>
          </h3>
          <button
            onClick={() => onSelectTab("students")}
            className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1"
          >
            <span className="hidden sm:inline">View All Students</span>
            <span className="sm:hidden">View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
          {/* Total Registered */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black tracking-tight">{academic.totalStudents}</div>
            <div className="text-[10px] text-slate-400 mt-1">Enrolled & evaluated</div>
          </div>

          {/* Passed */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Passed (&ge; 40)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500 tracking-tight">
              {academic.passedStudents}
            </div>
            <div className="text-[10px] text-emerald-600/80 font-medium mt-1">
              {academic.passRate}% pass rate
            </div>
          </div>

          {/* Failed */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Failed (&lt; 40)</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-500 tracking-tight">
              {academic.failedStudents}
            </div>
            <div className="text-[10px] text-rose-600/80 font-medium mt-1">
              Requires remediation
            </div>
          </div>

          {/* Class Average */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Class Average</span>
              <Award className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-2xl font-black text-violet-400 tracking-tight">
              {academic.classAverage}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Weighted mean score</div>
          </div>

          {/* Highest Score */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Highest Score</span>
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400 tracking-tight">
              {academic.highestScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Top class performance</div>
          </div>

          {/* Lowest Score */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Lowest Score</span>
              <ArrowDownRight className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 tracking-tight">
              {academic.lowestScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Floor baseline mark</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Inventory & Stock KPI Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-500" />
            <span>Inventory & Stock Metrics (Module B)</span>
          </h3>
          <button
            onClick={() => onSelectTab("inventory")}
            className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
          >
            <span className="hidden sm:inline">View All Inventory</span>
            <span className="sm:hidden">View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
          {/* Total Registered Products */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Products</span>
              <Package className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black tracking-tight">{inventory.totalProducts}</div>
            <div className="text-[10px] text-slate-400 mt-1">Unique catalog SKUs</div>
          </div>

          {/* Units in Stock */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Units in Stock</span>
              <Layers className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-cyan-400 tracking-tight">{inventory.totalUnits}</div>
            <div className="text-[10px] text-slate-400 mt-1">Physical stock quantity</div>
          </div>

          {/* Total Value */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Inventory Value</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500 tracking-tight">
              ${inventory.totalInventoryValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Sum of (Price &times; Qty)</div>
          </div>

          {/* Low Stock */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Low-Stock (&lt; 10)</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 tracking-tight">
              {inventory.lowStockCount}
            </div>
            <div className="text-[10px] text-amber-600/80 font-medium mt-1">Needs reordering</div>
          </div>

          {/* Out of Stock */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Out of Stock (= 0)</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-500 tracking-tight">
              {inventory.outOfStockCount}
            </div>
            <div className="text-[10px] text-rose-600/80 font-medium mt-1">Depleted inventory</div>
          </div>

          {/* Highest Value Product */}
          <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Highest-Valued</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-sm font-bold truncate text-blue-400 mt-1" title={inventory.highestValueProduct?.name}>
              {inventory.highestValueProduct ? inventory.highestValueProduct.name : "N/A"}
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
              ${inventory.highestValueProduct?.value.toLocaleString() || "0"}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Visual Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Grade Distribution Chart */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div className="min-w-0">
                <h4 className="text-sm font-bold">Academic Grade Distribution</h4>
                <p className="text-xs text-slate-400">
                  Formula: (CAT1 &times; 15%) + (CAT2 &times; 15%) + (Exam &times; 70%)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {academic.passRate}% Pass Rate
                </span>
              </div>
            </div>

            {/* SVG Bars */}
            <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-4 pt-6 px-1 sm:px-4 pb-2 border-b border-slate-700/30">
              {gradeKeys.map((grade) => {
                const count = academic.gradeCounts[grade];
                const heightPercent = maxGradeCount > 0 ? (count / maxGradeCount) * 100 : 0;
                const colors: Record<string, string> = {
                  A: "bg-emerald-500 from-emerald-500 to-teal-400",
                  B: "bg-blue-500 from-blue-500 to-indigo-400",
                  C: "bg-cyan-500 from-cyan-500 to-sky-400",
                  D: "bg-amber-500 from-amber-500 to-orange-400",
                  E: "bg-rose-500 from-rose-500 to-red-400",
                };
                return (
                  <div key={grade} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold mb-1 opacity-90 group-hover:scale-110 transition-transform">
                      {count}
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-800/60 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: `${Math.max(heightPercent, 6)}%` }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${colors[grade]} transition-all duration-500 group-hover:brightness-110`}
                      />
                    </div>
                    <span className="text-xs font-bold mt-2">Grade {grade}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-400 mt-4 px-2">
            <span>A: 70-100 (Distinction)</span>
            <span>B: 60-69</span>
            <span>C: 50-59</span>
            <span>D: 40-49</span>
            <span className="text-rose-400 font-semibold">E: &lt;40 (Fail)</span>
          </div>
        </div>

        {/* Inventory Stock Health Chart */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div className="min-w-0">
                <h4 className="text-sm font-bold">Inventory Stock Status Distribution</h4>
                <p className="text-xs text-slate-400">
                  Thresholds: Normal (&ge; 10), Low Stock (&lt; 10), Out of Stock (= 0)
                </p>
              </div>
              <button
                onClick={() => onSelectTab("inventory-reports")}
                className="text-xs font-semibold text-blue-500 hover:underline"
              >
                View Restock List &rarr;
              </button>
            </div>

            {/* Health Meter */}
            <div className="space-y-4 my-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Normal Stock (&ge;10 units)
                  </span>
                  <span className="font-bold">
                    {inventory.normalStockCount} items (
                    {inventory.totalProducts > 0
                      ? Math.round((inventory.normalStockCount / inventory.totalProducts) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        inventory.totalProducts > 0
                          ? (inventory.normalStockCount / inventory.totalProducts) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Low Stock (1 - 9 units)
                  </span>
                  <span className="font-bold">
                    {inventory.lowStockCount} items (
                    {inventory.totalProducts > 0
                      ? Math.round((inventory.lowStockCount / inventory.totalProducts) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        inventory.totalProducts > 0
                          ? (inventory.lowStockCount / inventory.totalProducts) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Out of Stock (0 units)
                  </span>
                  <span className="font-bold">
                    {inventory.outOfStockCount} items (
                    {inventory.totalProducts > 0
                      ? Math.round((inventory.outOfStockCount / inventory.totalProducts) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        inventory.totalProducts > 0
                          ? (inventory.outOfStockCount / inventory.totalProducts) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-wrap items-center justify-between gap-1 text-xs mt-4">
            <span className="text-slate-300">Total Asset Valuation:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm break-all">
              ${inventory.totalInventoryValue.toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Recent Activities Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className={`p-4 sm:p-4 sm:p-5 rounded-2xl border shadow-sm min-w-0 ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold flex items-center gap-2 min-w-0">
              <Users className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">Recent Student Registrations</span>
            </h4>
            <button
              onClick={() => onSelectTab("students")}
              className="text-xs font-semibold text-blue-500 hover:underline shrink-0"
            >
              Manage All &rarr;
            </button>
          </div>

          <div className="overflow-x-auto table-scroll -mx-1 px-1">
            <table className="w-full min-w-[480px] text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="pb-2 font-semibold">Reg Number</th>
                  <th className="pb-2 font-semibold">Full Name</th>
                  <th className="pb-2 font-semibold text-center">Score</th>
                  <th className="pb-2 font-semibold text-center">Grade</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {recentStudents.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-mono font-semibold text-blue-400">{s.registrationNumber}</td>
                    <td className="py-2.5 font-medium">{s.fullName}</td>
                    <td className="py-2.5 text-center font-bold">{s.totalScore.toFixed(2)}</td>
                    <td className="py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === "PASS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Transactions */}
        <div className={`p-4 sm:p-4 sm:p-5 rounded-2xl border shadow-sm min-w-0 ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold flex items-center gap-2 min-w-0">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Recent Stock Movement Log</span>
            </h4>
            <button
              onClick={() => onSelectTab("transactions")}
              className="text-xs font-semibold text-emerald-500 hover:underline shrink-0"
            >
              Audit History &rarr;
            </button>
          </div>

          <div className="overflow-x-auto table-scroll -mx-1 px-1">
            <table className="w-full min-w-[480px] text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="pb-2 font-semibold">Tx ID</th>
                  <th className="pb-2 font-semibold">Product</th>
                  <th className="pb-2 font-semibold text-center">Type</th>
                  <th className="pb-2 font-semibold text-center">Qty</th>
                  <th className="pb-2 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {recentTransactions.slice(0, 5).map((t) => (
                  <tr key={t.id || t.transactionId} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-mono text-slate-400">{t.transactionId}</td>
                    <td className="py-2.5 font-medium truncate max-w-[120px]">{t.productName}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.transactionType === "RECEIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="py-2.5 text-center font-bold">
                      {t.transactionType === "RECEIVE" ? `+${t.quantity}` : `-${t.quantity}`}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-cyan-400">
                      {t.updatedStock} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
