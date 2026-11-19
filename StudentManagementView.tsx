"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { StudentRecord } from "@/lib/algorithms";
import { calculateAcademicGrade } from "@/lib/calculations";
import { generateStudentReportCardPDF, generateClassPerformancePDF } from "@/lib/pdfGenerator";
import { exportStudentsToCSV } from "@/lib/csvExporter";

interface StudentManagementProps {
  students: StudentRecord[];
  loading: boolean;
  onRefresh: () => void;
  isDark: boolean;
  onNotify: (title: string, desc: string, type: "success" | "alert" | "info") => void;
}

export default function StudentManagementView({
  students,
  loading,
  onRefresh,
  isDark,
  onNotify,
}: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentRecord | null>(null);
  const [viewingProfile, setViewingProfile] = useState<StudentRecord | null>(null);

  // Form Fields
  const [regNo, setRegNo] = useState("");
  const [fullName, setFullName] = useState("");
  const [cat1, setCat1] = useState<string>("70");
  const [cat2, setCat2] = useState<string>("70");
  const [exam, setExam] = useState<string>("70");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation preview
  const liveCalc = useMemo(() => {
    const c1 = parseFloat(cat1) || 0;
    const c2 = parseFloat(cat2) || 0;
    const ex = parseFloat(exam) || 0;
    return calculateAcademicGrade(c1, c2, ex);
  }, [cat1, cat2, exam]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGrade = selectedGradeFilter === "ALL" || s.grade === selectedGradeFilter;
      const matchStatus = selectedStatusFilter === "ALL" || s.status === selectedStatusFilter;
      return matchSearch && matchGrade && matchStatus;
    });
  }, [students, searchTerm, selectedGradeFilter, selectedStatusFilter]);

  const openRegisterModal = () => {
    setRegNo(`BCS-${String(students.length + 1).padStart(3, "0")}-2025`);
    setFullName("");
    setCat1("75");
    setCat2("80");
    setExam("75");
    setFormError("");
    setIsRegisterOpen(true);
  };

  const openEditModal = (student: StudentRecord) => {
    setEditingStudent(student);
    setRegNo(student.registrationNumber);
    setFullName(student.fullName);
    setCat1(student.cat1.toString());
    setCat2(student.cat2.toString());
    setExam(student.examination.toString());
    setFormError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationNumber: regNo,
          fullName,
          cat1: parseFloat(cat1),
          cat2: parseFloat(cat2),
          examination: parseFloat(exam),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to register student");
        setIsSubmitting(false);
        return;
      }

      onNotify(
        "Student Registered",
        `Successfully added ${data.student.fullName} (${data.student.registrationNumber})`,
        "success"
      );
      setIsRegisterOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationNumber: regNo,
          fullName,
          cat1: parseFloat(cat1),
          cat2: parseFloat(cat2),
          examination: parseFloat(exam),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to update student");
        setIsSubmitting(false);
        return;
      }

      onNotify("Student Updated", `Updated record for ${data.student.fullName}`, "success");
      setEditingStudent(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onNotify("Student Record Deleted", `Deleted ${deletingStudent.fullName}`, "info");
        setDeletingStudent(null);
        onRefresh();
      } else {
        alert(data.error || "Could not delete student");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const cardBg = isDark
    ? "bg-[#111A33] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className={`p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-auto sm:min-w-[240px] sm:flex-1 md:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Reg No or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <option value="ALL">All Grades (A-E)</option>
            <option value="A">Grade A (70-100%)</option>
            <option value="B">Grade B (60-69%)</option>
            <option value="C">Grade C (50-59%)</option>
            <option value="D">Grade D (40-49%)</option>
            <option value="E">Grade E (&lt;40%)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <option value="ALL">All Status</option>
            <option value="PASS">PASS (&ge;40%)</option>
            <option value="FAIL">FAIL (&lt;40%)</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openRegisterModal}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Student</span>
          </button>

          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark
                ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => generateClassPerformancePDF(filteredStudents)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Download Class Performance Report as PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Class PDF</span>
          </button>

          <button
            onClick={onRefresh}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
            }`}
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Student Records Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto table-scroll">
          <table className="w-full min-w-[920px] text-xs text-left whitespace-nowrap">
            <thead>
              <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3 text-center">CAT 1 (15%)</th>
                <th className="py-3 px-3 text-center">CAT 2 (15%)</th>
                <th className="py-3 px-3 text-center">Final Exam (70%)</th>
                <th className="py-3 px-3 text-center">Final Score</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {s.registrationNumber}
                    </td>
                    <td className="py-3 px-4 font-medium">{s.fullName}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.cat1.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.cat2.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.examination.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-100">
                      {s.totalScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                          s.grade === "A"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : s.grade === "B"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : s.grade === "C"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : s.grade === "D"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "PASS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {s.status === "PASS" ? (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-400" />
                        )}
                        <span>{s.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateStudentReportCardPDF(s)}
                          className="p-1.5 rounded hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Download Official Transcript PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setViewingProfile(s)}
                          className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 transition-colors"
                          title="Edit Marks / Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No student records matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register Student */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl relative ${cardBg}`}>
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Register Student</h3>
                <p className="text-xs text-slate-400">SOEN 105 Academic Performance Management</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. BCS-009-2025"
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono uppercase ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className={`w-full px-3 py-2 text-xs rounded-lg border ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Assessment Marks */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assessment Weightings (0 - 100)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CAT 1 (15%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={cat1}
                      onChange={(e) => setCat1(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CAT 2 (15%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={cat2}
                      onChange={(e) => setCat2(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Exam (70%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={exam}
                      onChange={(e) => setExam(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Real-time Calculation Badge */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Calculated Final Score:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-400">
                      {liveCalc.totalScore.toFixed(2)}%
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white">
                      Grade {liveCalc.grade}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        liveCalc.status === "PASS"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {liveCalc.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl relative ${cardBg}`}>
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Edit Student Information</h3>
                <p className="text-xs text-slate-400">Update academic marks and details</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono uppercase ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Assessment Marks */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CAT 1 (15%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={cat1}
                      onChange={(e) => setCat1(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CAT 2 (15%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={cat2}
                      onChange={(e) => setCat2(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Exam (70%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={exam}
                      onChange={(e) => setExam(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-mono ${
                        isDark ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Recalculated Score:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-amber-400">
                      {liveCalc.totalScore.toFixed(2)}%
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white">
                      Grade {liveCalc.grade}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        liveCalc.status === "PASS"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {liveCalc.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Student Confirmation */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl ${cardBg}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Delete Student Record</h3>
                <p className="text-xs text-slate-400">Permanent database operation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6">
              Are you sure you want to delete student{" "}
              <strong className="text-white">{deletingStudent.fullName}</strong> (
              <span className="font-mono text-blue-400">{deletingStudent.registrationNumber}</span>
              )? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View Profile */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl relative ${cardBg}`}>
            <button
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                {viewingProfile.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold">{viewingProfile.fullName}</h3>
                <p className="font-mono text-xs text-blue-400">{viewingProfile.registrationNumber}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Continuous Assessment 1 (15%):</span>
                <span className="font-bold">{viewingProfile.cat1.toFixed(1)} / 100</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Continuous Assessment 2 (15%):</span>
                <span className="font-bold">{viewingProfile.cat2.toFixed(1)} / 100</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Final Semester Exam (70%):</span>
                <span className="font-bold">{viewingProfile.examination.toFixed(1)} / 100</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-300 font-semibold">Total Aggregate Score:</span>
                <span className="font-bold text-sm text-blue-400">{viewingProfile.totalScore.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Assigned Grade:</span>
                <span className="font-bold text-sm">Grade {viewingProfile.grade}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Academic Standing:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    viewingProfile.status === "PASS"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {viewingProfile.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => generateStudentReportCardPDF(viewingProfile)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Transcript PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
