"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface SignInUser {
  email: string;
  name: string;
  remember: boolean;
}

interface SignInViewProps {
  onSignIn: (user: SignInUser) => void;
}

function displayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "Group 4 Admin";
  return localPart
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SignInView({ onSignIn }: SignInViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (password.length < 6) {
      setError("For this local demo, the password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    onSignIn({
      email: normalizedEmail,
      name: displayNameFromEmail(normalizedEmail),
      remember,
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080F21] text-white selection:bg-blue-500/30">
      <div className="pointer-events-none absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-56 right-0 h-[38rem] w-[38rem] rounded-full bg-violet-700/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_35%,rgba(37,99,235,0.10),transparent_48%),linear-gradient(135deg,transparent_55%,rgba(139,92,246,0.06))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 shadow-lg shadow-blue-900/40 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-[0.12em] text-white">GROUP 4 PROJECT</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Academic & Inventory Suite</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.75)]" />
            SOEN 105 project environment
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-12">
          <section className="mx-auto w-full max-w-2xl lg:mx-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
              One workspace. Two essential operations.
            </div>
            <h1 className="max-w-xl text-3xl sm:text-4xl lg:text-5xl xl:text-[3.6rem] font-semibold leading-[1.08] tracking-tight text-white">
              Welcome to a clearer way to
              <span className="block bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300 bg-clip-text pb-1 text-transparent">
                manage progress.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
              Sign in to access academic performance insights, student records, stock operations, and reporting—all in one focused workspace.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/55 p-4 shadow-xl shadow-black/10 backdrop-blur-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm font-semibold text-white">Academic performance</div>
                <div className="mt-1 text-xs leading-5 text-slate-400">Weighted scores, class trends, grades, and student reports.</div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span>CAT 1 · 15%</span><span className="text-slate-700">/</span><span>CAT 2 · 15%</span><span className="text-slate-700">/</span><span>Exam · 70%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/55 p-4 shadow-xl shadow-black/10 backdrop-blur-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                  <Package className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm font-semibold text-white">Inventory operations</div>
                <div className="mt-1 text-xs leading-5 text-slate-400">Track stock, record movements, and identify restocking needs.</div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span>Receive</span><span className="text-slate-700">·</span><span>Issue</span><span className="text-slate-700">·</span><span>Report</span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5 text-blue-400" /> Live dashboards</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Validated workflows</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-violet-400" /> SOEN 105 ready</span>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <div className="rounded-[1.6rem] border border-slate-700/80 bg-[#10192e]/90 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Secure workspace access</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Sign in to continue</h2>
                <p className="mt-2 text-xs leading-5 text-slate-400">Enter your details to open the Group 4 Project dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="signin-email" className="mb-2 block text-xs font-medium text-slate-300">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="signin-email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@institution.edu"
                      className="w-full rounded-xl border border-slate-700 bg-[#0A1223] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="signin-password" className="block text-xs font-medium text-slate-300">Password</label>
                    <span className="text-[10px] text-slate-500">Minimum 6 characters</span>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-700 bg-[#0A1223] py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 accent-blue-500"
                    />
                    Remember this device
                  </label>
                  <span className="text-[10px] text-slate-500">Local demo access</span>
                </div>

                {error && (
                  <div role="alert" className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-wait disabled:opacity-70"
                >
                  <span>{isSubmitting ? "Opening your workspace..." : "Sign in to dashboard"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[10px] leading-5 text-slate-500">
                This preview uses local demo access: any valid email and password of 6+ characters will continue. Your password is not stored or sent to a server.
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] text-slate-600">
              GROUP 4 PROJECT <span className="mx-1.5 text-slate-700">·</span> SOEN 105 Software Development Fundamentals
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
