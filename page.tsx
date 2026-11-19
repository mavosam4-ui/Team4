"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar, { NavTab } from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DashboardView from "@/components/DashboardView";
import StudentManagementView from "@/components/StudentManagementView";
import AcademicResultsView from "@/components/AcademicResultsView";
import AcademicReportsView from "@/components/AcademicReportsView";
import InventoryManagementView from "@/components/InventoryManagementView";
import StockTransactionsView from "@/components/StockTransactionsView";
import ProductSearchView from "@/components/ProductSearchView";
import SortingVisualizerView from "@/components/SortingVisualizerView";
import InventoryReportsView from "@/components/InventoryReportsView";
import PythonHubView from "@/components/PythonHubView";
import SettingsView from "@/components/SettingsView";
import AboutView from "@/components/AboutView";
import SignInView, { SignInUser } from "@/components/SignInView";
import { StudentRecord, ProductRecord } from "@/lib/algorithms";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  // Restore only the signed-in identity; passwords are never persisted.
  useEffect(() => {
    let restoredUser: { email: string; name: string } | null = null;
    try {
      const storedSession = sessionStorage.getItem("group4-project-session");
      const rememberedUser = localStorage.getItem("group4-project-remembered-user");
      const serializedUser = storedSession || rememberedUser;
      if (serializedUser) {
        const candidate: unknown = JSON.parse(serializedUser);
        if (
          candidate &&
          typeof candidate === "object" &&
          "email" in candidate &&
          "name" in candidate &&
          typeof candidate.email === "string" &&
          typeof candidate.name === "string"
        ) {
          restoredUser = { email: candidate.email, name: candidate.name };
        }
      }
    } catch {
      // If browser storage is unavailable or malformed, continue to sign-in.
    }
    setCurrentUser(restoredUser);
    setIsAuthenticated(Boolean(restoredUser));
    setAuthReady(true);
  }, []);

  // Data States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toasts, setToasts] = useState<
    Array<{ id: string; title: string; desc: string; type: "success" | "alert" | "info" }>
  >([]);

  // Fetch all core data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, stuRes, prdRes, txnRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/students"),
        fetch("/api/products"),
        fetch("/api/transactions"),
      ]);

      const dashData = await dashRes.json();
      const stuData = await stuRes.json();
      const prdData = await prdRes.json();
      const txnData = await txnRes.json();

      if (dashData.success) setDashboardData(dashData);
      if (stuData.success) setStudents(stuData.students);
      if (prdData.success) setProducts(prdData.products);
      if (txnData.success) setTransactions(txnData.transactions);
    } catch (err) {
      console.error("Failed to load application data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady && isAuthenticated) {
      loadData();
    }
  }, [authReady, isAuthenticated, loadData]);

  const addNotification = (
    title: string,
    desc: string,
    type: "success" | "alert" | "info" = "info"
  ) => {
    const newToast = { id: Date.now().toString(), title, desc, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSignIn = (user: SignInUser) => {
    const identity = { email: user.email, name: user.name };
    try {
      sessionStorage.setItem("group4-project-session", JSON.stringify(identity));
      if (user.remember) {
        localStorage.setItem("group4-project-remembered-user", JSON.stringify(identity));
      } else {
        localStorage.removeItem("group4-project-remembered-user");
      }
    } catch {
      // Keep the current in-memory session even when browser storage is disabled.
    }
    setCurrentUser(identity);
    setIsAuthenticated(true);
    setCurrentTab("dashboard");
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem("group4-project-session");
      localStorage.removeItem("group4-project-remembered-user");
    } catch {
      // The in-memory session still ends if storage is unavailable.
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentTab("dashboard");
    setToasts([]);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    const q = query.trim().toUpperCase();
    if (q.startsWith("BCS-") || q.startsWith("STU")) {
      setCurrentTab("students");
    } else if (q.startsWith("PRD-") || q.startsWith("TXN-")) {
      setCurrentTab("inventory");
    } else {
      setCurrentTab("students");
    }
  };

  const handleQuickTransaction = (productId: string, type: "RECEIVE" | "ISSUE") => {
    setCurrentTab("transactions");
  };

  const lowStockCount = products.filter((p) => p.quantity < 10).length;

  const appBackground = isDark ? "bg-[#0B132B] text-slate-100" : "bg-slate-50 text-slate-900";

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080F21] text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          <p className="text-xs">Checking your Group 4 Project session…</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <SignInView onSignIn={handleSignIn} />;
  }

  const handleSelectTab = useCallback((tab: NavTab) => {
    setCurrentTab(tab);
    setSidebarOpen(false);
  }, []);

  return (
    <div className={`flex h-screen h-dvh w-full max-w-[100vw] overflow-hidden ${appBackground}`}>
      {/* Toast Notification Container */}
      <div className="fixed top-3 right-3 left-3 sm:left-auto sm:top-4 sm:right-4 z-[60] space-y-2 pointer-events-none flex flex-col items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 sm:p-3.5 rounded-xl shadow-2xl border text-xs w-full sm:w-auto sm:max-w-sm sm:min-w-[320px] transition-all animate-in slide-in-from-top-2 ${
              toast.type === "success"
                ? "bg-slate-900 border-emerald-500/50 text-white"
                : toast.type === "alert"
                ? "bg-slate-900 border-rose-500/50 text-white"
                : "bg-slate-900 border-blue-500/50 text-white"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === "alert" && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <div className="font-bold">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{toast.desc}</div>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Sidebar — drawer on small screens, static on large */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        lowStockCount={lowStockCount}
        totalStudents={students.length}
        isDark={isDark}
        onLogoutClick={handleSignOut}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <TopNav
          currentTab={currentTab}
          userName={currentUser.name}
          userEmail={currentUser.email}
          onMenuClick={() => setSidebarOpen(true)}
          onSearchSubmit={handleGlobalSearch}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          lowStockItemsCount={lowStockCount}
          recentAlerts={
            lowStockCount > 0
              ? [
                  {
                    id: "alert-low-stock",
                    title: "Restock Warning Alert",
                    desc: `${lowStockCount} item(s) are below minimum threshold (<10 units).`,
                    type: "alert",
                  },
                ]
              : []
          }
          onSelectTab={setCurrentTab}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {currentTab === "dashboard" && (
              <DashboardView
                data={dashboardData}
                loading={loading}
                onRefresh={loadData}
                onSelectTab={setCurrentTab}
                onOpenNewStudent={() => setCurrentTab("students")}
                onOpenNewProduct={() => setCurrentTab("inventory")}
                onOpenNewTransaction={() => setCurrentTab("transactions")}
                isDark={isDark}
              />
            )}

            {currentTab === "students" && (
              <StudentManagementView
                students={students}
                loading={loading}
                onRefresh={loadData}
                isDark={isDark}
                onNotify={addNotification}
              />
            )}

            {currentTab === "academic-results" && (
              <AcademicResultsView students={students} isDark={isDark} />
            )}

            {currentTab === "academic-reports" && (
              <AcademicReportsView students={students} isDark={isDark} />
            )}

            {currentTab === "inventory" && (
              <InventoryManagementView
                products={products}
                loading={loading}
                onRefresh={loadData}
                isDark={isDark}
                onNotify={addNotification}
                onQuickTransaction={handleQuickTransaction}
              />
            )}

            {currentTab === "transactions" && (
              <StockTransactionsView
                products={products}
                transactions={transactions}
                loading={loading}
                onRefresh={loadData}
                isDark={isDark}
                onNotify={addNotification}
              />
            )}

            {currentTab === "product-search" && (
              <ProductSearchView products={products} isDark={isDark} />
            )}

            {currentTab === "sorting-lab" && (
              <SortingVisualizerView products={products} isDark={isDark} />
            )}

            {currentTab === "inventory-reports" && (
              <InventoryReportsView
                products={products}
                isDark={isDark}
                onRefresh={loadData}
                onQuickRestock={(pid) => {
                  setCurrentTab("transactions");
                }}
              />
            )}

            {currentTab === "python-hub" && <PythonHubView isDark={isDark} />}

            {currentTab === "settings" && (
              <SettingsView
                isDark={isDark}
                onToggleTheme={handleToggleTheme}
                onRefreshAll={loadData}
                onNotify={addNotification}
              />
            )}

            {currentTab === "about" && <AboutView isDark={isDark} />}
          </div>
        </main>
      </div>
    </div>
  );
}
