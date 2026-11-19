"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Download,
  FileText,
  Edit2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  X,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { ProductRecord } from "@/lib/algorithms";
import { formatCurrency, getStockStatus } from "@/lib/calculations";
import { exportInventoryToCSV } from "@/lib/csvExporter";
import { generateInventoryReportPDF } from "@/lib/pdfGenerator";

interface InventoryManagementProps {
  products: ProductRecord[];
  loading: boolean;
  onRefresh: () => void;
  isDark: boolean;
  onNotify: (title: string, desc: string, type: "success" | "alert" | "info") => void;
  onQuickTransaction: (productId: string, type: "RECEIVE" | "ISSUE") => void;
}

export default function InventoryManagementView({
  products,
  loading,
  onRefresh,
  isDark,
  onNotify,
  onQuickTransaction,
}: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStockFilter, setSelectedStockFilter] = useState("ALL");

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductRecord | null>(null);

  // Form Fields
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("General");
  const [unitPrice, setUnitPrice] = useState("49.99");
  const [quantity, setQuantity] = useState("10");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;

      let matchStock = true;
      if (selectedStockFilter === "OUT") {
        matchStock = p.quantity === 0;
      } else if (selectedStockFilter === "LOW") {
        matchStock = p.quantity > 0 && p.quantity < 10;
      } else if (selectedStockFilter === "NORMAL") {
        matchStock = p.quantity >= 10;
      }

      return matchSearch && matchCat && matchStock;
    });
  }, [products, searchTerm, selectedCategory, selectedStockFilter]);

  const openRegisterModal = () => {
    const nextNum = products.length + 101;
    setProductId(`PRD-${nextNum}`);
    setProductName("");
    setCategory("Hardware");
    setUnitPrice("49.99");
    setQuantity("15");
    setFormError("");
    setIsRegisterOpen(true);
  };

  const openEditModal = (p: ProductRecord) => {
    setEditingProduct(p);
    setProductId(p.productId);
    setProductName(p.productName);
    setCategory(p.category || "General");
    setUnitPrice(p.unitPrice.toString());
    setQuantity(p.quantity.toString());
    setFormError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          category,
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to create product");
        setIsSubmitting(false);
        return;
      }

      onNotify("Product Added", `Added ${data.product.productName} (${data.product.productId})`, "success");
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
    if (!editingProduct) return;
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          category,
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to update product");
        setIsSubmitting(false);
        return;
      }

      onNotify("Product Updated", `Updated ${data.product.productName}`, "success");
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onNotify("Product Deleted", `Removed ${deletingProduct.productName} from inventory`, "info");
        setDeletingProduct(null);
        onRefresh();
      } else {
        alert(data.error || "Could not delete product");
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
      {/* Search & Actions Bar */}
      <div className={`p-4 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:min-w-[240px] sm:flex-1 md:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Product ID, Name, or Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Level Filter */}
          <select
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="NORMAL">Normal Stock (&ge;10 units)</option>
            <option value="LOW">Low Stock (&lt;10 units)</option>
            <option value="OUT">Out of Stock (0 units)</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openRegisterModal}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>

          <button
            onClick={() => exportInventoryToCSV(filteredProducts)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark
                ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => generateInventoryReportPDF(filteredProducts)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit PDF</span>
          </button>

          <button
            onClick={onRefresh}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
            }`}
            title="Refresh inventory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto table-scroll">
          <table className="w-full min-w-[980px] text-xs text-left whitespace-nowrap">
            <thead>
              <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-right">Stock Value</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const stockVal = p.unitPrice * p.quantity;
                  const statusInfo = getStockStatus(p.quantity);
                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {p.productId}
                      </td>
                      <td className="py-3 px-4 font-medium">{p.productName}</td>
                      <td className="py-3 px-4 text-slate-400">{p.category || "General"}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-sm">{p.quantity}</span>
                        <span className="text-[10px] text-slate-400 ml-1">units</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(stockVal)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}
                        >
                          {p.quantity === 0 ? (
                            <XCircle className="w-3 h-3 text-rose-500" />
                          ) : p.quantity < 10 ? (
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>{statusInfo.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Receive Button */}
                          <button
                            onClick={() => onQuickTransaction(p.productId, "RECEIVE")}
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-0.5"
                            title="Quick Receive Stock"
                          >
                            <ArrowUpRight className="w-3 h-3" />
                            <span>+Receive</span>
                          </button>
                          {/* Quick Issue Button */}
                          <button
                            onClick={() => onQuickTransaction(p.productId, "ISSUE")}
                            disabled={p.quantity === 0}
                            className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-0.5 disabled:opacity-40"
                            title="Quick Sell/Issue Stock"
                          >
                            <ArrowDownRight className="w-3 h-3" />
                            <span>-Issue</span>
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register Product */}
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
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Register New Inventory Product</h3>
                <p className="text-xs text-slate-400">Module B: Stock & Inventory Management</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Product ID * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="e.g. PRD-109"
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono uppercase ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Hardware, Audio, etc."
                    className={`w-full px-3 py-2 text-xs rounded-lg border ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Logitech 4K Brio Ultra HD Webcam"
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Unit Price ($) * (&ge; 0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Initial Quantity * (&ge; 0)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Total Stock Value Preview */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Initial Stock Value:</span>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {formatCurrency((parseFloat(unitPrice) || 0) * (parseInt(quantity, 10) || 0))}
                </span>
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
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add to Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl relative ${cardBg}`}>
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Edit Product Information</h3>
                <p className="text-xs text-slate-400">Update pricing or specifications</p>
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
                    Product ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono uppercase ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono ${
                      isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md my-4 sm:my-6 max-h-[92vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 shadow-2xl ${cardBg}`}>
            <h3 className="text-base font-bold mb-2">Delete Product</h3>
            <p className="text-xs text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-white">{deletingProduct.productName}</strong> (
              <span className="font-mono text-indigo-400">{deletingProduct.productId}</span>
              )?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
