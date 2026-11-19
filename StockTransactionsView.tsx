"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
} from "lucide-react";
import { ProductRecord } from "@/lib/algorithms";

interface StockTransactionsViewProps {
  products: ProductRecord[];
  transactions: any[];
  loading: boolean;
  onRefresh: () => void;
  isDark: boolean;
  onNotify: (title: string, desc: string, type: "success" | "alert" | "info") => void;
}

export default function StockTransactionsView({
  products,
  transactions,
  loading,
  onRefresh,
  isDark,
  onNotify,
}: StockTransactionsViewProps) {
  const [selectedProductId, setSelectedProductId] = useState(
    products.length > 0 ? products[0].productId : ""
  );
  const [transactionType, setTransactionType] = useState<"RECEIVE" | "ISSUE" | "ADJUSTMENT">("RECEIVE");
  const [quantity, setQuantity] = useState("5");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected product object
  const activeProduct = products.find(
    (p) => p.productId.toUpperCase() === selectedProductId.toUpperCase()
  );

  const prevStock = activeProduct ? activeProduct.quantity : 0;
  const numQty = parseInt(quantity, 10) || 0;

  let computedUpdatedStock = prevStock;
  if (transactionType === "RECEIVE") {
    computedUpdatedStock = prevStock + numQty;
  } else if (transactionType === "ISSUE") {
    computedUpdatedStock = prevStock - numQty;
  } else if (transactionType === "ADJUSTMENT") {
    computedUpdatedStock = numQty;
  }

  const isInvalidIssue = transactionType === "ISSUE" && numQty > prevStock;

  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedProductId) {
      setErrorMsg("Please select a product.");
      return;
    }

    if (numQty <= 0) {
      setErrorMsg("Quantity must be a positive integer greater than 0.");
      return;
    }

    if (isInvalidIssue) {
      setErrorMsg(
        `Insufficient stock! Cannot issue ${numQty} units. Current stock is only ${prevStock} units.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          transactionType,
          quantity: numQty,
          notes: notes.trim() || `${transactionType} operation`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Transaction processing failed");
        setIsSubmitting(false);
        return;
      }

      onNotify(
        "Stock Transaction Completed",
        `Processed ${transactionType} for ${data.transaction.productName} (${data.transaction.productId}): ${data.transaction.previousStock} -> ${data.transaction.updatedStock}`,
        "success"
      );

      setNotes("");
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Transaction Entry Form */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Process Stock Movement Transaction</h3>
            <p className="text-xs text-slate-400">
              Atomically update inventory balances with guaranteed non-negative stock validation
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleProcessTransaction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Inventory Product *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                  isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200"
                }`}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.productId}>
                    [{p.productId}] {p.productName} (Current Stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Transaction Type *
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-900/60 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransactionType("RECEIVE")}
                  className={`py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    transactionType === "RECEIVE"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Receive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("ISSUE")}
                  className={`py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    transactionType === "ISSUE"
                      ? "bg-rose-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Issue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("ADJUSTMENT")}
                  className={`py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    transactionType === "ADJUSTMENT"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Quantity Units *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                  isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Transaction Reference / Destination Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Issued to Computer Lab 2, Vendor Shipment #554, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>

            {/* Stock Impact Visual Indicator */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Stock Balance Transition:</span>
                <span className="font-mono font-bold text-sm">
                  {prevStock} &rarr;{" "}
                  <span
                    className={
                      computedUpdatedStock < 0
                        ? "text-rose-500 font-extrabold"
                        : computedUpdatedStock < 10
                        ? "text-amber-400 font-extrabold"
                        : "text-emerald-400 font-extrabold"
                    }
                  >
                    {computedUpdatedStock} units
                  </span>
                </span>
              </div>

              {isInvalidIssue ? (
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  REJECTED: Stock Cannot Be Negative
                </span>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Committing..." : "Commit Transaction"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Audit History Log Table */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold">Transaction History Audit Trail</h3>
          </div>
          <button
            onClick={onRefresh}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto table-scroll">
          <table className="w-full min-w-[1020px] text-xs text-left whitespace-nowrap">
            <thead>
              <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Product Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-center">Prev Stock</th>
                <th className="py-3 px-3 text-center">New Balance</th>
                <th className="py-3 px-4">Notes / Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr
                    key={t.id || t.transactionId}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {t.transactionId}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(t.transactionDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {t.productId}
                    </td>
                    <td className="py-3 px-4 font-medium">{t.productName}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          t.transactionType === "RECEIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : t.transactionType === "ISSUE"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        }`}
                      >
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                      {t.transactionType === "RECEIVE" ? `+${t.quantity}` : `-${t.quantity}`}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {t.previousStock}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400 text-sm">
                      {t.updatedStock}
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">
                      {t.notes || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
