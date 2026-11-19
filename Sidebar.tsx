"use client";

import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck,
  FileSpreadsheet,
  Package,
  ArrowLeftRight,
  Search,
  ArrowUpDown,
  AlertOctagon,
  FileCode2,
  Settings,
  Info,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "students"
  | "academic-results"
  | "academic-reports"
  | "inventory"
  | "transactions"
  | "product-search"
  | "sorting-lab"
  | "inventory-reports"
  | "python-hub"
  | "settings"
  | "about";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lowStockCount: number;
  totalStudents: number;
  isDark: boolean;
  onLogoutClick: () => void;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  lowStockCount,
  totalStudents,
  isDark,
  onLogoutClick,
  open = false,
  onClose,
}: SidebarProps) {
  const academicItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "students", label: "Student Management", icon: GraduationCap, badge: totalStudents > 0 ? totalStudents : null },
    { id: "academic-results", label: "Linear Search (Academics)", icon: FileCheck, badge: "SOEN 105" },
    { id: "academic-reports", label: "Academic Reports", icon: FileSpreadsheet, badge: null },
  ];

  const inventoryItems = [
    { id: "inventory", label: "Inventory Management", icon: Package, badge: null },
    { id: "transactions", label: "Stock Transactions", icon: ArrowLeftRight, badge: null },
    { id: "product-search", label: "Product Search Lab", icon: Search, badge: "Linear & Binary" },
    { id: "sorting-lab", label: "Bubble Sort Visualizer", icon: ArrowUpDown, badge: "Algorithm" },
    { id: "inventory-reports", label: "Restock & Reports", icon: AlertOctagon, badge: lowStockCount > 0 ? `${lowStockCount} alerts` : null, badgeAlert: lowStockCount > 0 },
  ];

  const systemItems = [
    { id: "python-hub", label: "Python Source & PDLC Hub", icon: FileCode2, badge: "ZIP / Tests" },
    { id: "settings", label: "Settings & Backup", icon: Settings, badge: null },
    { id: "about", label: "About Application", icon: Info, badge: "v2.5" },
  ];

  const bgClasses = isDark ? "bg-[#111A33] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-700";

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r transition-transform transition-colors duration-200 select-none sm:max-w-xs lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0 xl:w-72 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${bgClasses}`}
      >
      {/* Brand Header */}
      <div className={`p-4 sm:p-5 border-b ${isDark ? "border-slate-800 bg-[#0E162B]" : "border-slate-100 bg-slate-50/70"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-sm font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-300 truncate">
              GROUP 4 PROJECT
            </h1>
            <span className="text-[10px] font-medium tracking-wide uppercase text-slate-400">
              Academic & Inventory
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Academic Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Module A: Academics
          </div>
          <nav className="space-y-1">
            {academicItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : isDark ? "text-slate-400 group-hover:text-blue-400" : "text-slate-500 group-hover:text-blue-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isDark
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Inventory Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Module B: Inventory & Stock
          </div>
          <nav className="space-y-1">
            {inventoryItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : isDark ? "text-slate-400 group-hover:text-indigo-400" : "text-slate-500 group-hover:text-indigo-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.badgeAlert
                          ? "bg-rose-500 text-white animate-pulse"
                          : isActive
                          ? "bg-white/20 text-white"
                          : isDark
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Delivery */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Project & System
          </div>
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : isDark ? "text-slate-400 group-hover:text-violet-400" : "text-slate-500 group-hover:text-violet-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isDark
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Exit */}
      <div className={`p-4 border-t ${isDark ? "border-slate-800 bg-[#0E162B]" : "border-slate-100 bg-slate-50/70"}`}>
        <button
          onClick={onLogoutClick}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
            isDark
              ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
      </aside>
    </>
  );
}
