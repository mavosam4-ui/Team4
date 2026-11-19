"use client";

import React from "react";
import {
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Package,
  DollarSign,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ProductRecord } from "@/lib/algorithms";
import { formatCurrency, getStockStatus } from "@/lib/calculations";
import { exportInventoryToCSV } from "@/lib/csvExporter";
import { generateInventoryReportPDF } from "@/lib/pdfGenerator";

interface InventoryReportsViewProps {
  products: ProductRecord[];
  isDark: boolean;
  onRefresh: () => void;
  onQuickRestock: (productId: string) => void;
}

export default function InventoryReportsView({
  products,
  isDark,
  onRefresh,
  onQuickRestock,
}: InventoryReportsViewProps) {
  const lowStockItems = products.filter((p) => p.quantity < 10);
  const outOfStockItems = products.filter((p) => p.quantity === 0);
  const totalValue = products.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);

  // Group by category
  const categories: Record<string, { count: number; totalValue: number; units: number }> = {};
  products.forEach((p) => {
    const cat = p.category || "General";
    if (!categories[cat]) {
      categories[cat] = { count: 0, totalValue: 0, units: 0 };
    }
    categories[cat].count += 1;
    categories[cat].units += p.quantity;
    categories[cat].totalValue += p.unitPrice * p.quantity;
  });

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${cardBg}`}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Inventory Stock & Restocking Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated restocking threshold audit: Quantities below 10 are flagged for reordering; 0 units are out of stock.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportInventoryToCSV(products)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inventory CSV</span>
          </button>
          <button
            onClick={() => generateInventoryReportPDF(products)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Valuation PDF</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Total Inventory Asset Value</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalValue)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sum of (Unit Price &times; Qty)</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Critical Restock Alerts</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{lowStockItems.length}</div>
          <div className="text-[10px] text-amber-500/80 mt-0.5">Items with stock &lt; 10 units</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Completely Depleted (0 Stock)</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{outOfStockItems.length}</div>
          <div className="text-[10px] text-rose-500/80 mt-0.5">Items unavailable to issue</div>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg}`}>
          <div className="text-xs text-slate-400 font-medium">Product Catalog Breadth</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{products.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{Object.keys(categories).length} unique categories</div>
        </div>
      </div>

      {/* Restocking Schedule Table */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">Actionable Restocking Priority List (&lt; 10 Units)</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {lowStockItems.length} items requiring replenishment
          </span>
        </div>

        <div className="overflow-x-auto table-scroll">
          <table className="w-full min-w-[900px] text-xs text-left whitespace-nowrap">
            <thead>
              <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Urgency</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((p) => {
                  const isOut = p.quantity === 0;
                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">{p.productId}</td>
                      <td className="py-3 px-4 font-medium">{p.productName}</td>
                      <td className="py-3 px-4 text-slate-400">{p.category || "General"}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                        <span className={isOut ? "text-rose-400" : "text-amber-400"}>
                          {p.quantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                            isOut
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {isOut ? "CRITICAL (0 STOCK)" : "HIGH PRIORITY"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {isOut
                          ? "Issue emergency purchase order for immediate restock."
                          : `Reorder minimum ${20 - p.quantity} units to restore normal baseline.`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onQuickRestock(p.productId)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow"
                        >
                          + Receive Units
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-emerald-400 font-medium">
                    All inventory items are currently at or above normal operational stock levels (&ge;10 units).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${cardBg}`}>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-indigo-400" />
          <span>Valuation Breakdown by Product Category</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categories).map(([catName, stats]) => (
            <div key={catName} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{catName}</span>
                <span className="text-slate-400">{stats.count} SKUs</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(stats.totalValue)}
              </div>
              <div className="text-[11px] text-slate-400">
                Total physical stock: <strong className="text-slate-200">{stats.units}</strong> units
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
