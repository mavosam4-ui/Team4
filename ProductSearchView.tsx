"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Code2,
  ListOrdered,
  ArrowRight,
  Info,
  GitFork,
  ArrowUpDown,
} from "lucide-react";
import { ProductRecord, linearSearchProducts, binarySearchProducts, bubbleSortProducts } from "@/lib/algorithms";
import { formatCurrency, getStockStatus } from "@/lib/calculations";

interface ProductSearchViewProps {
  products: ProductRecord[];
  isDark: boolean;
}

export default function ProductSearchView({ products, isDark }: ProductSearchViewProps) {
  const [activeAlgorithm, setActiveAlgorithm] = useState<"LINEAR" | "BINARY">("BINARY");
  const [targetProductId, setTargetProductId] = useState("PRD-104");

  // Step states
  const [linearResult, setLinearResult] = useState<ReturnType<typeof linearSearchProducts> | null>(null);
  const [binaryResult, setBinaryResult] = useState<ReturnType<typeof binarySearchProducts> | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);

  // For Binary search, prepare sorted array using Bubble Sort
  const sortedProducts = useMemo(() => {
    const { sortedList } = bubbleSortProducts(products);
    return sortedList;
  }, [products]);

  const handleRunSearch = () => {
    if (!targetProductId.trim()) return;

    if (activeAlgorithm === "LINEAR") {
      const res = linearSearchProducts(products, targetProductId);
      setLinearResult(res);
      setBinaryResult(null);
      setActiveStepIdx(0);
    } else {
      const res = binarySearchProducts(sortedProducts, targetProductId);
      setBinaryResult(res);
      setLinearResult(null);
      setActiveStepIdx(0);
    }
  };

  const handleNextStep = () => {
    if (activeStepIdx === null) return;
    const maxSteps = activeAlgorithm === "LINEAR" ? (linearResult?.steps.length || 0) : (binaryResult?.steps.length || 0);
    if (activeStepIdx < maxSteps - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    }
  };

  const handleReset = () => {
    setLinearResult(null);
    setBinaryResult(null);
    setActiveStepIdx(null);
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Algorithm Mode Switcher & Input */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>SOEN 105 Algorithm Laboratory</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Product Search Engine (Linear vs Binary)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an algorithmic search paradigm to execute a step-by-step trace through inventory memory buffers.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => {
                setActiveAlgorithm("LINEAR");
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAlgorithm === "LINEAR"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Linear Search</span>
            </button>
            <button
              onClick={() => {
                setActiveAlgorithm("BINARY");
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeAlgorithm === "BINARY"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Binary Search (O(log n))</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={targetProductId}
              onChange={(e) => setTargetProductId(e.target.value)}
              placeholder="e.g. PRD-104"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <button
            onClick={handleRunSearch}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute {activeAlgorithm === "LINEAR" ? "Linear Search" : "Binary Search"}</span>
          </button>

          {(linearResult || binaryResult) && (
            <>
              <button
                onClick={handleNextStep}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
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

      {/* Execution Visualizer */}
      {(linearResult || binaryResult) && activeStepIdx !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Step Trace (2 cols) */}
          <div className={`lg:col-span-2 p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
            {activeAlgorithm === "BINARY" && binaryResult && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold">Binary Search Step {activeStepIdx + 1}</h3>
                  </div>
                  <div className="text-xs text-slate-400">
                    Divide-and-conquer pointer comparison: Target &apos;{binaryResult.steps[activeStepIdx]?.target}&apos;
                  </div>
                </div>

                {/* Step pointer notes */}
                {binaryResult.steps[activeStepIdx] && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                        <span className="text-[10px] text-slate-400 block">Low Pointer</span>
                        <span className="font-mono font-bold text-sm">
                          [{binaryResult.steps[activeStepIdx].low}]
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 ring-2 ring-indigo-500/40">
                        <span className="text-[10px] text-slate-400 block">Mid Pointer</span>
                        <span className="font-mono font-bold text-sm">
                          [{binaryResult.steps[activeStepIdx].mid}] (
                          {binaryResult.steps[activeStepIdx].midItem.productId})
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                        <span className="text-[10px] text-slate-400 block">High Pointer</span>
                        <span className="font-mono font-bold text-sm">
                          [{binaryResult.steps[activeStepIdx].high}]
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
                      {binaryResult.steps[activeStepIdx].notes}
                    </div>
                  </div>
                )}

                {/* Sorted Array Memory Buffer */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Pre-Condition: Array Sorted Ascending by Product ID
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {sortedProducts.map((p, idx) => {
                      const step = binaryResult.steps[activeStepIdx];
                      const isMid = step?.mid === idx;
                      const inRange = step ? idx >= step.low && idx <= step.high : false;
                      const isFound = isMid && step?.comparisonResult === "EQUAL";

                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            isFound
                              ? "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg scale-105"
                              : isMid
                              ? "bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400 shadow-md scale-102"
                              : inRange
                              ? "bg-slate-800/80 border-slate-700 text-slate-200"
                              : "opacity-30 bg-slate-950 border-slate-900 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1 opacity-80 font-mono">
                            <span>Index [{idx}]</span>
                            {isMid && <span className="font-bold">MID</span>}
                            {isFound && <span className="font-bold">FOUND</span>}
                          </div>
                          <div className="font-mono font-bold truncate">{p.productId}</div>
                          <div className="truncate text-[11px] opacity-90">{p.productName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeAlgorithm === "LINEAR" && linearResult && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold">Sequential Search Step {activeStepIdx + 1}</h3>
                  </div>
                  <div className="text-xs text-slate-400">
                    Comparing element by element from index 0
                  </div>
                </div>

                {linearResult.steps[activeStepIdx] && (
                  <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
                    {linearResult.steps[activeStepIdx].notes}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
                  {products.map((p, idx) => {
                    const step = linearResult.steps[activeStepIdx];
                    const isCurr = step?.index === idx;
                    const isMatch = isCurr && step.isMatch;
                    const isPast = step ? idx < step.index : false;

                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isMatch
                            ? "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow scale-105"
                            : isCurr
                            ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400 shadow scale-102"
                            : isPast
                            ? "opacity-40 bg-slate-950 border-slate-900"
                            : "bg-slate-900/50 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1 opacity-80 font-mono">
                          <span>Index [{idx}]</span>
                          {isCurr && <span className="font-bold">INSPECTING</span>}
                        </div>
                        <div className="font-mono font-bold truncate">{p.productId}</div>
                        <div className="truncate text-[11px] opacity-90">{p.productName}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Outcome & Pseudocode Card (1 col) */}
          <div className="space-y-4">
            {/* Found Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Algorithm Execution Outcome
              </h4>

              {((activeAlgorithm === "BINARY" && binaryResult?.found) ||
                (activeAlgorithm === "LINEAR" && linearResult?.found)) ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                    <div className="font-bold text-sm mb-1">Product Successfully Found!</div>
                    <div>
                      Found in{" "}
                      {activeAlgorithm === "BINARY"
                        ? binaryResult?.totalComparisons
                        : linearResult?.totalComparisons}{" "}
                      comparison(s).
                    </div>
                  </div>

                  {(() => {
                    const foundItem =
                      activeAlgorithm === "BINARY" ? binaryResult?.result : linearResult?.result;
                    if (!foundItem) return null;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product Name:</span>
                          <span className="font-bold">{foundItem.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Product ID:</span>
                          <span className="font-mono text-indigo-400 font-bold">{foundItem.productId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Unit Price:</span>
                          <span className="font-bold">{formatCurrency(foundItem.unitPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Available Stock:</span>
                          <span className="font-bold">{foundItem.quantity} units</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  <div className="font-bold text-sm mb-1">Target Not Found</div>
                  <div>The item &apos;{targetProductId}&apos; is not present in inventory.</div>
                </div>
              )}
            </div>

            {/* Pseudocode snippet */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm font-mono text-xs ${cardBg}`}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {activeAlgorithm === "BINARY" ? "Binary Search Pseudocode" : "Linear Search Pseudocode"}
                </span>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-indigo-300 text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{activeAlgorithm === "BINARY"
  ? `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid].id == target:
            return arr[mid]
        elif arr[mid].id < target:
            low = mid + 1
        else:
            high = mid - 1
    return None`
  : `def linear_search(arr, target):
    for item in arr:
        if item.id == target:
            return item
    return None`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
