"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Menu,
} from "lucide-react";
import { NavTab } from "./Sidebar";

interface TopNavProps {
  currentTab: NavTab;
  userName: string;
  userEmail: string;
  onMenuClick: () => void;
  onSearchSubmit: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  lowStockItemsCount: number;
  recentAlerts: Array<{ id: string; title: string; desc: string; type: "alert" | "info" | "success" }>;
  onSelectTab: (tab: NavTab) => void;
}

const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Executive Dashboard",
    subtitle: "Real-time consolidated analytics for student performance and inventory stock",
  },
  students: {
    title: "Student Academic Performance Management",
    subtitle: "Register students, evaluate weighted scores (CAT1 15%, CAT2 15%, Exam 70%), and assign grades",
  },
  "academic-results": {
    title: "Linear Search Algorithm Laboratory",
    subtitle: "SOEN 105 Demonstration: Sequential search by Student Registration Number without SQL",
  },
  "academic-reports": {
    title: "Academic Performance Reports & Transcripts",
    subtitle: "Official student transcripts, grade distributions, and PDF generation",
  },
  inventory: {
    title: "Inventory & Stock Management",
    subtitle: "Stock valuation, available quantities, and automated low-stock warnings (<10)",
  },
  transactions: {
    title: "Stock Movement & Transactions",
    subtitle: "Receive stock, issue goods, and prevent negative stock balances",
  },
  "product-search": {
    title: "Searching Algorithm Laboratory (Linear & Binary)",
    subtitle: "SOEN 105 Demonstration: Sequential search and divide-and-conquer binary search",
  },
  "sorting-lab": {
    title: "Bubble Sort Algorithm Visualizer",
    subtitle: "SOEN 105 Demonstration: Interactive step-by-step sorting by Product ID in ascending order",
  },
  "inventory-reports": {
    title: "Inventory Reports & Restocking Schedule",
    subtitle: "Actionable replenishment lists for items with low stock or zero inventory",
  },
  "python-hub": {
    title: "Python 3 Source Code & Coursework Delivery Hub",
    subtitle: "Inspect the full CustomTkinter Python files, execute automated unit tests, and download runnable ZIP",
  },
  settings: {
    title: "Application Settings & Database Management",
    subtitle: "System configuration, SQLite/PostgreSQL backups, JSON export/restore, and reset",
  },
  about: {
    title: "About Group 4 Project",
    subtitle: "SOEN 105 Software Development Fundamentals Practical Project Specifications",
  },
};

export default function TopNav({
  currentTab,
  userName,
  userEmail,
  onMenuClick,
  onSearchSubmit,
  isDark,
  onToggleTheme,
  lowStockItemsCount,
  recentAlerts,
  onSelectTab,
}: TopNavProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const meta = tabTitles[currentTab] || { title: "Group 4 Project", subtitle: "Management Console" };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(searchVal);
    }
  };

  const navClasses = isDark
    ? "bg-[#0E162B] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <header className={`min-h-14 sm:h-16 px-3 sm:px-4 lg:px-6 py-2 sm:py-0 border-b flex items-center justify-between gap-2 shrink-0 transition-colors duration-200 ${navClasses}`}>
      {/* Left: menu + Title & Subtitle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={`lg:hidden p-2 rounded-lg border transition-colors shrink-0 ${
            isDark
              ? "border-slate-800 hover:bg-slate-800 text-slate-300"
              : "border-slate-200 hover:bg-slate-100 text-slate-700"
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col min-w-0 pr-2">
          <h1 className="text-[13px] sm:text-sm font-bold tracking-tight truncate flex items-center gap-2">
            {meta.title}
          </h1>
          <p className={`text-[11px] truncate hidden sm:block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Global search..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className={`w-44 lg:w-56 pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Live Clock */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border ${
            isDark
              ? "bg-slate-900/80 border-slate-800 text-slate-300"
              : "bg-slate-100 border-slate-200 text-slate-700"
          }`}
          title="Current System Time"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{currentTime || "Loading..."}</span>
        </div>

        {/* System Status Indicator */}
        <div
          className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border ${
            isDark
              ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DB Active (ACID)</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg border transition-colors ${
              isDark
                ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {lowStockItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {lowStockItemsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 rounded-xl shadow-2xl border p-4 z-50 animate-in fade-in zoom-in-95 ${
                isDark ? "bg-[#111A33] border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">System Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs flex gap-2.5 ${
                        alert.type === "alert"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                          : alert.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                      }`}
                    >
                      {alert.type === "alert" ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-[11px] opacity-80 mt-0.5">{alert.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No active system alerts.</p>
                )}

                {lowStockItemsCount > 0 && (
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab("inventory-reports");
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-blue-400 hover:underline flex items-center justify-center gap-1"
                  >
                    <span>View Restocking Schedule</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition-colors ${
            isDark
              ? "border-slate-800 hover:bg-slate-800 text-amber-400"
              : "border-slate-200 hover:bg-slate-100 text-slate-700"
          }`}
          title={isDark ? "Switch to Light Theme" : "Switch to Deep Navy Dark Theme"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        <div
          className={`flex items-center gap-2 pl-2 sm:pl-3 border-l ${
            isDark ? "border-slate-800 text-slate-200" : "border-slate-200 text-slate-800"
          }`}
        >
          <div title={`${userName} (${userEmail})`} className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow shrink-0">
            {userName.split(/\s+/).map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase() || "G4"}
          </div>
          <div className="hidden lg:flex flex-col max-w-40">
            <span className="text-xs font-semibold leading-tight truncate">{userName}</span>
            <span className="text-[10px] text-slate-400 leading-tight truncate">{userEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
