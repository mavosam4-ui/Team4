"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Code2,
  Sliders,
  Info,
} from "lucide-react";
import { ProductRecord, bubbleSortProducts } from "@/lib/algorithms";

interface SortingVisualizerViewProps {
  products: ProductRecord[];
  isDark: boolean;
}

export default function SortingVisualizerView({ products, isDark }: SortingVisualizerViewProps) {
  const [sortResult, setSortResult] = useState<ReturnType<typeof bubbleSortProducts> | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600); // ms per step

  const handleStartSort = () => {
    // Intentionally shuffle slightly or run on current products
    const res = bubbleSortProducts(products);
    setSortResult(res);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (!sortResult) return;
    if (currentStepIdx < sortResult.steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (!sortResult) return;
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSortResult(null);
  };

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && sortResult) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < sortResult.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sortResult, playbackSpeed]);

  const activeStep = sortResult && sortResult.steps[currentStepIdx] ? sortResult.steps[currentStepIdx] : null;
  const currentArray = activeStep ? activeStep.currentArray : products;

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2 border border-violet-500/20">
              <Code2 className="w-3.5 h-3.5" />
              <span>SOEN 105 Sorting Algorithm Demonstration</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Bubble Sort Algorithm Visualizer</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Sorts inventory items by Product ID in ascending order by repeatedly stepping through the list, comparing adjacent items, and swapping them if out of order.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!sortResult ? (
              <button
                onClick={handleStartSort}
                className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Initialize Bubble Sort</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? "Pause" : "Auto-Play"}</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIdx >= sortResult.steps.length - 1}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 disabled:opacity-40"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Step Forward</span>
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
              </div>
            )}
          </div>
        </div>

        {/* Playback Stats Bar */}
        {sortResult && (
          <div className="mt-6 pt-4 border-t border-slate-700/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Current Pass:</span>
              <span className="font-mono font-bold text-sm text-violet-400">
                Pass {activeStep?.pass || 1} of {sortResult.totalPasses}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Execution Step:</span>
              <span className="font-mono font-bold text-sm text-blue-400">
                {currentStepIdx + 1} / {sortResult.steps.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Comparisons:</span>
              <span className="font-mono font-bold text-sm text-amber-400">
                {sortResult.totalComparisons} comparisons
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Swaps Made:</span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                {sortResult.totalSwaps} swaps
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Array Cards (2 cols) */}
        <div className={`lg:col-span-2 p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-violet-400" />
              <span>Array Memory State (Product ID Order)</span>
            </h3>
            {activeStep && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  activeStep.swapped
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {activeStep.swapped ? "SWAP EXECUTED" : "NO SWAP NEEDED"}
              </span>
            )}
          </div>

          {/* Active Step Explanation */}
          {activeStep && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
              <div className="text-[10px] text-violet-400 uppercase tracking-wider mb-1">
                Pass {activeStep.pass} • Comparison between index [{activeStep.indexA}] and [
                {activeStep.indexB}]:
              </div>
              <p>{activeStep.notes}</p>
            </div>
          )}

          {/* Product Items Display */}
          <div className="space-y-2 pt-2">
            {currentArray.map((p, idx) => {
              const isComparingA = activeStep?.indexA === idx;
              const isComparingB = activeStep?.indexB === idx;
              const isBeingCompared = isComparingA || isComparingB;
              const isSwapped = isBeingCompared && activeStep?.swapped;

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 transition-all duration-300 ${
                    isSwapped
                      ? "bg-amber-600/20 border-amber-500 text-white ring-2 ring-amber-500/50 shadow-md"
                      : isBeingCompared
                      ? "bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/50 shadow-md"
                      : isDark
                      ? "bg-slate-900/60 border-slate-800 text-slate-300"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                      [{idx}]
                    </span>
                    <div>
                      <div className="font-mono font-bold text-sm text-indigo-400">{p.productId}</div>
                      <div className="text-xs font-medium">{p.productName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">${p.unitPrice.toFixed(2)}</span>
                    <span className="font-bold">{p.quantity} units</span>
                    {isComparingA && (
                      <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold">
                        Element A
                      </span>
                    )}
                    {isComparingB && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500 text-white text-[10px] font-bold">
                        Element B
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm Pseudocode and Theory (1 col) */}
        <div className="space-y-4">
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
              SOEN 105 Bubble Sort Algorithm
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Bubble Sort compares adjacent elements and swaps them if the left element is lexicographically greater than the right element. With the early termination flag, it achieves O(n) best-case complexity.
            </p>

            <pre className="p-3 rounded-xl bg-slate-950 text-violet-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j].id > arr[j + 1].id:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`}
            </pre>
          </div>

          <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
              Algorithmic Complexity
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Best Case Time:</span>
                <span className="font-mono font-bold text-emerald-400">O(n)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Average Case Time:</span>
                <span className="font-mono font-bold text-amber-400">O(n²)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Worst Case Time:</span>
                <span className="font-mono font-bold text-rose-400">O(n²)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Auxiliary Space:</span>
                <span className="font-mono font-bold text-blue-400">O(1) (In-Place)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
