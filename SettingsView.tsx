"use client";

import React, { useState } from "react";
import {
  Settings,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Moon,
  Sun,
  Server,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onRefreshAll: () => void;
  onNotify: (title: string, desc: string, type: "success" | "alert" | "info") => void;
}

export default function SettingsView({
  isDark,
  onToggleTheme,
  onRefreshAll,
  onNotify,
}: SettingsViewProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState("");

  const handleBackupDownload = async () => {
    try {
      const res = await fetch("/api/system/backup");
      const data = await res.json();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `group4_project_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      onNotify("Backup Downloaded", "Complete database snapshot exported.", "success");
    } catch (err: any) {
      alert("Backup error: " + err.message);
    }
  };

  const handleRestoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreMessage("Reading backup file...");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch("/api/system/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Restore failed");
      }

      onNotify("Database Restored", data.message, "success");
      onRefreshAll();
    } catch (err: any) {
      alert("Restore failed: " + err.message);
    } finally {
      setIsRestoring(false);
      e.target.value = "";
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the database? All custom records will be overwritten with the official SOEN 105 demo dataset.")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/system/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        onNotify("System Reset", "Database re-seeded with official assignment records.", "info");
        onRefreshAll();
      } else {
        alert(data.error || "Reset failed");
      }
    } catch (err: any) {
      alert("Reset error: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold tracking-tight">System Settings & Data Management</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl">
          Configure application interface preferences, manage database snapshots, and restore assignment baseline environments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Theme & Visual Presentation</span>
          </h3>

          <p className="text-xs text-slate-400">
            Group 4 Project features commercial-grade deep navy blue branding and a clean high-contrast light theme.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold block text-white">Application Appearance</span>
              <span className="text-[11px] text-slate-400">Currently active: {isDark ? "Deep Navy Dark" : "Clean Light"}</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-2 transition-all"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>Switch to {isDark ? "Light Mode" : "Dark Navy"}</span>
            </button>
          </div>
        </div>

        {/* Database Backup & Restore */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Database Backup & Recovery</span>
          </h3>

          <p className="text-xs text-slate-400">
            Export a full JSON snapshot of students, inventory, and stock transactions, or restore from a previously exported file.
          </p>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold block text-white">Export Full Database Backup</span>
                <span className="text-[11px] text-slate-400">Download snapshot (Students, Products, Logs)</span>
              </div>
              <button
                onClick={handleBackupDownload}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold block text-white">Restore from Backup File</span>
                <span className="text-[11px] text-slate-400">Upload JSON snapshot file</span>
              </div>
              <label className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{isRestoring ? "Restoring..." : "Import JSON"}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreUpload}
                  disabled={isRestoring}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Database Reset */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-4 lg:col-span-2 ${cardBg}`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-rose-400">Danger Zone: Database Reset</h3>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl">
            Reinitializes the entire SQLite / PostgreSQL database and reseeds the default SOEN 105 benchmark dataset. Use this to restore clean demonstration data during assessment.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div>
              <span className="text-xs font-bold text-rose-300 block">Reset & Reseed Benchmark Dataset</span>
              <span className="text-[11px] text-rose-400/80">Clears custom entries and restores default students & products</span>
            </div>
            <button
              onClick={handleResetDatabase}
              disabled={isResetting}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isResetting ? "Resetting Database..." : "Reset to Default Demo Data"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
