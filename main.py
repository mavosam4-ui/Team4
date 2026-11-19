"""
main.py
GROUP 4 PROJECT
Intelligent Academic & Inventory Management
SOEN 105 Software Development Fundamentals Practical Assignment
Author: Group 4
"""

import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime

# Adjust module search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import init_database
from modules.students import StudentManager
from modules.inventory import InventoryManager
from modules.transactions import TransactionManager
from modules.searching import linear_search_students, linear_search_products, binary_search_products
from modules.sorting import bubble_sort_products
from utilities.validators import validate_student_inputs, validate_product_inputs
from utilities.calculations import calculate_class_statistics, calculate_stock_value
from utilities.exporters import export_students_csv, export_inventory_csv
from modules.reports import generate_academic_pdf

try:
    import customtkinter as ctk
    CTK_AVAILABLE = True
except ImportError:
    CTK_AVAILABLE = False


class Group4ProjectApp:
    """Main Desktop GUI Application Controller."""

    def __init__(self):
        # Initialize Database
        init_database()
        self.student_mgr = StudentManager()
        self.inventory_mgr = InventoryManager()
        self.txn_mgr = TransactionManager()
        
        self.current_theme = "dark"

        if CTK_AVAILABLE:
            ctk.set_appearance_mode("dark")
            ctk.set_default_color_theme("blue")
            self.root = ctk.CTk()
        else:
            self.root = tk.Tk()

        self.root.title("GROUP 4 PROJECT - Intelligent Academic & Inventory Management")
        self.root.geometry("1280x800")
        self.root.minsize(1024, 680)

        # Build Main UI Shell
        self._setup_layout()
        self.show_dashboard()

    def _setup_layout(self):
        """Builds sidebar, top navigation bar, and main container."""
        # Top container
        self.root.grid_rowconfigure(1, weight=1)
        self.root.grid_columnconfigure(1, weight=1)

        # Top Bar
        if CTK_AVAILABLE:
            self.top_bar = ctk.CTkFrame(self.root, height=56, corner_radius=0, fg_color="#0F172A")
        else:
            self.top_bar = tk.Frame(self.root, height=56, bg="#0F172A")
        self.top_bar.grid(row=0, column=0, columnspan=2, sticky="ew")

        # Top Bar Title & Date
        self.lbl_app_brand = tk.Label(
            self.top_bar,
            text="★ GROUP 4 PROJECT  |  SOEN 105 Enterprise Edition",
            fg="#38BDF8",
            bg="#0F172A",
            font=("Segoe UI", 12, "bold")
        )
        self.lbl_app_brand.pack(side="left", padx=20, pady=12)

        self.lbl_status = tk.Label(
            self.top_bar,
            text=f"SQLite 3 Connected  •  {datetime.now().strftime('%A, %d %B %Y')}",
            fg="#94A3B8",
            bg="#0F172A",
            font=("Segoe UI", 10)
        )
        self.lbl_status.pack(side="right", padx=20)

        # Sidebar
        if CTK_AVAILABLE:
            self.sidebar = ctk.CTkFrame(self.root, width=240, corner_radius=0, fg_color="#1E293B")
        else:
            self.sidebar = tk.Frame(self.root, width=240, bg="#1E293B")
        self.sidebar.grid(row=1, column=0, sticky="nsew")

        self._build_sidebar_menu()

        # Main Workspace
        if CTK_AVAILABLE:
            self.main_frame = ctk.CTkFrame(self.root, fg_color="#0B132B")
        else:
            self.main_frame = tk.Frame(self.root, bg="#0B132B")
        self.main_frame.grid(row=1, column=1, sticky="nsew", padx=16, pady=16)
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)

    def _build_sidebar_menu(self):
        """Constructs sidebar buttons."""
        menu_items = [
            ("📊 Dashboard", self.show_dashboard),
            ("🎓 Student Management", self.show_students),
            ("🔍 Linear Search (Students)", self.show_student_search),
            ("📋 Academic Reports", self.show_academic_reports),
            ("📦 Inventory Management", self.show_inventory),
            ("🔄 Stock Transactions", self.show_transactions),
            ("⚡ Search & Sort Visualizer", self.show_algorithms_view),
            ("📑 Inventory Reports", self.show_inventory_reports),
            ("⚙️ Settings & Backup", self.show_settings),
            ("ℹ️ About Application", self.show_about),
            ("🚪 Exit Application", self.root.quit),
        ]

        # Brand header in sidebar
        lbl_nav = tk.Label(self.sidebar, text="NAVIGATION MENU", fg="#94A3B8", bg="#1E293B", font=("Segoe UI", 9, "bold"))
        lbl_nav.pack(anchor="w", padx=20, pady=(20, 10))

        for text, command in menu_items:
            if CTK_AVAILABLE:
                btn = ctk.CTkButton(
                    self.sidebar,
                    text=text,
                    command=command,
                    anchor="w",
                    fg_color="transparent",
                    text_color="#E2E8F0",
                    hover_color="#334155",
                    height=38,
                    corner_radius=8,
                    font=("Segoe UI", 12)
                )
                btn.pack(fill="x", padx=12, pady=3)
            else:
                btn = tk.Button(
                    self.sidebar,
                    text=text,
                    command=command,
                    anchor="w",
                    bg="#1E293B",
                    fg="#E2E8F0",
                    activebackground="#334155",
                    activeforeground="#FFFFFF",
                    relief="flat",
                    font=("Segoe UI", 10),
                    padx=10,
                    pady=6
                )
                btn.pack(fill="x", padx=8, pady=2)

    def clear_workspace(self):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def show_dashboard(self):
        """Displays combined academic & inventory metrics."""
        self.clear_workspace()
        students = self.student_mgr.get_all_students()
        products = self.inventory_mgr.get_all_products()
        transactions = self.txn_mgr.get_all_transactions()
        
        acad_stats = calculate_class_statistics(students)
        total_products = len(products)
        total_units = sum(p["quantity"] for p in products)
        total_value = sum(p["stock_value"] for p in products)
        low_stock = sum(1 for p in products if 0 < p["quantity"] < 10)
        out_of_stock = sum(1 for p in products if p["quantity"] == 0)

        # Container
        dash_container = tk.Frame(self.main_frame, bg="#0B132B")
        dash_container.pack(fill="both", expand=True)

        # Title
        title_lbl = tk.Label(
            dash_container,
            text="Executive Dashboard Overview",
            fg="#FFFFFF",
            bg="#0B132B",
            font=("Segoe UI", 18, "bold")
        )
        title_lbl.pack(anchor="w", pady=(0, 15))

        # Metrics cards frame
        cards_frame = tk.Frame(dash_container, bg="#0B132B")
        cards_frame.pack(fill="x", pady=5)

        metrics = [
            ("Registered Students", str(acad_stats["total"]), "#3B82F6"),
            ("Pass Rate", f"{acad_stats['pass_rate']}%", "#10B981"),
            ("Class Average", f"{acad_stats['average']}", "#8B5CF6"),
            ("Total Products", str(total_products), "#6366F1"),
            ("Inventory Value", f"${total_value:,.2f}", "#F59E0B"),
            ("Low / Out Stock", f"{low_stock} / {out_of_stock}", "#EF4444"),
        ]

        for title, val, color in metrics:
            c = tk.Frame(cards_frame, bg="#1E293B", padx=16, pady=12, highlightbackground=color, highlightthickness=1)
            c.pack(side="left", fill="both", expand=True, padx=4)
            tk.Label(c, text=title, fg="#94A3B8", bg="#1E293B", font=("Segoe UI", 9)).pack(anchor="w")
            tk.Label(c, text=val, fg=color, bg="#1E293B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(4, 0))

        # Recent activities split
        split_frame = tk.Frame(dash_container, bg="#0B132B")
        split_frame.pack(fill="both", expand=True, pady=15)

        # Left: Recent Students
        left_box = tk.LabelFrame(split_frame, text=" Recent Student Registrations ", fg="#93C5FD", bg="#1E293B", padx=10, pady=10)
        left_box.pack(side="left", fill="both", expand=True, padx=(0, 8))

        columns = ("RegNo", "Name", "Total", "Grade", "Status")
        tree_s = ttk.Treeview(left_box, columns=columns, show="headings", height=8)
        for col in columns:
            tree_s.heading(col, text=col)
            tree_s.column(col, width=90, anchor="center")
        tree_s.pack(fill="both", expand=True)

        for s in students[:8]:
            tree_s.insert("", "end", values=(
                s["registration_number"],
                s["full_name"],
                f"{s['total_score']:.2f}",
                s["grade"],
                s["status"]
            ))

        # Right: Stock Alerts & Transactions
        right_box = tk.LabelFrame(split_frame, text=" Recent Stock Transactions ", fg="#FCD34D", bg="#1E293B", padx=10, pady=10)
        right_box.pack(side="right", fill="both", expand=True, padx=(8, 0))

        tx_cols = ("TxID", "Product", "Type", "Qty", "Balance")
        tree_tx = ttk.Treeview(right_box, columns=tx_cols, show="headings", height=8)
        for col in tx_cols:
            tree_tx.heading(col, text=col)
            tree_tx.column(col, width=90, anchor="center")
        tree_tx.pack(fill="both", expand=True)

        for tx in transactions[:8]:
            tree_tx.insert("", "end", values=(
                tx["transaction_id"],
                tx["product_id"],
                tx["transaction_type"],
                tx["quantity"],
                tx["updated_stock"]
            ))

    def show_students(self):
        """Student registration and table view."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        # Header
        tk.Label(container, text="Student Academic Performance Management", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        # Registration Form Card
        form_card = tk.LabelFrame(container, text=" Register New Student (CAT1: 15%, CAT2: 15%, Exam: 70%) ", fg="#93C5FD", bg="#1E293B", padx=12, pady=10)
        form_card.pack(fill="x", pady=6)

        fields_frame = tk.Frame(form_card, bg="#1E293B")
        fields_frame.pack(fill="x")

        # Entries
        tk.Label(fields_frame, text="Reg Number:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=0, padx=6, pady=4, sticky="w")
        e_reg = tk.Entry(fields_frame, width=16)
        e_reg.grid(row=0, column=1, padx=6, pady=4)

        tk.Label(fields_frame, text="Full Name:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=2, padx=6, pady=4, sticky="w")
        e_name = tk.Entry(fields_frame, width=22)
        e_name.grid(row=0, column=3, padx=6, pady=4)

        tk.Label(fields_frame, text="CAT 1 (15%):", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=4, padx=6, pady=4, sticky="w")
        e_c1 = tk.Entry(fields_frame, width=8)
        e_c1.grid(row=0, column=5, padx=6, pady=4)

        tk.Label(fields_frame, text="CAT 2 (15%):", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=6, padx=6, pady=4, sticky="w")
        e_c2 = tk.Entry(fields_frame, width=8)
        e_c2.grid(row=0, column=7, padx=6, pady=4)

        tk.Label(fields_frame, text="Exam (70%):", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=8, padx=6, pady=4, sticky="w")
        e_exam = tk.Entry(fields_frame, width=8)
        e_exam.grid(row=0, column=9, padx=6, pady=4)

        def save_student():
            valid, err, cleaned = validate_student_inputs(
                e_reg.get(), e_name.get(), e_c1.get(), e_c2.get(), e_exam.get()
            )
            if not valid:
                messagebox.showerror("Validation Error", err)
                return
            try:
                self.student_mgr.register_student(
                    cleaned["registration_number"],
                    cleaned["full_name"],
                    cleaned["cat1"],
                    cleaned["cat2"],
                    cleaned["examination"]
                )
                messagebox.showinfo("Success", f"Student '{cleaned['full_name']}' registered successfully!")
                self.show_students()
            except Exception as ex:
                messagebox.showerror("Database Error", str(ex))

        btn_save = tk.Button(fields_frame, text="➕ Register Student", command=save_student, bg="#2563EB", fg="white", font=("Segoe UI", 9, "bold"), padx=12, pady=4)
        btn_save.grid(row=0, column=10, padx=12, pady=4)

        # Table of Students
        table_frame = tk.Frame(container, bg="#1E293B")
        table_frame.pack(fill="both", expand=True, pady=10)

        cols = ("ID", "Reg Number", "Full Name", "CAT 1", "CAT 2", "Exam", "Total Score", "Grade", "Status")
        tree = ttk.Treeview(table_frame, columns=cols, show="headings")
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=100, anchor="center")
        tree.pack(fill="both", expand=True, side="left")

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        students = self.student_mgr.get_all_students()
        for s in students:
            tree.insert("", "end", values=(
                s["id"],
                s["registration_number"],
                s["full_name"],
                f"{s['cat1']:.1f}",
                f"{s['cat2']:.1f}",
                f"{s['examination']:.1f}",
                f"{s['total_score']:.2f}",
                s["grade"],
                s["status"]
            ))

    def show_student_search(self):
        """Demonstrates the manual linear search algorithm."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Linear Search Algorithm Demonstration (Students)", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        card = tk.Frame(container, bg="#1E293B", padx=16, pady=16)
        card.pack(fill="x", pady=6)

        tk.Label(card, text="Enter Target Registration Number (e.g., BCS-001-2025):", fg="#E2E8F0", bg="#1E293B", font=("Segoe UI", 11)).pack(anchor="w")
        
        search_box = tk.Frame(card, bg="#1E293B")
        search_box.pack(fill="x", pady=8)
        
        e_target = tk.Entry(search_box, font=("Segoe UI", 12), width=30)
        e_target.pack(side="left", padx=(0, 10))
        e_target.insert(0, "BCS-001-2025")

        log_box = tk.Text(container, height=18, bg="#0F172A", fg="#38BDF8", font=("Consolas", 10), padx=12, pady=12)
        log_box.pack(fill="both", expand=True, pady=10)

        def run_search():
            target = e_target.get().strip()
            if not target:
                messagebox.showwarning("Input Required", "Please enter a registration number.")
                return
            students = self.student_mgr.get_all_students()
            res, comps, trace = linear_search_students(students, target)

            log_box.delete("1.0", "end")
            log_box.insert("end", f"=== LINEAR SEARCH EXECUTION TRACE ===\n")
            log_box.insert("end", f"Target: {target}\n")
            log_box.insert("end", f"Total Records in Array: {len(students)}\n\n")
            for t in trace:
                log_box.insert("end", f"{t}\n")
            
            if res:
                log_box.insert("end", f"\n[SUCCESS] Found: {res['full_name']} | Score: {res['total_score']} | Grade: {res['grade']} | Status: {res['status']}\n")
            else:
                log_box.insert("end", f"\n[FAIL] Student with Reg Number '{target}' not found in records.\n")

        btn = tk.Button(search_box, text="▶ Run Linear Search", command=run_search, bg="#3B82F6", fg="white", font=("Segoe UI", 10, "bold"), padx=16, pady=4)
        btn.pack(side="left")

    def show_inventory(self):
        """Inventory display, products table, and stock status."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Stock & Inventory Management", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        # Add Product Card
        card = tk.LabelFrame(container, text=" Register New Inventory Product ", fg="#FCD34D", bg="#1E293B", padx=12, pady=10)
        card.pack(fill="x", pady=6)

        fields = tk.Frame(card, bg="#1E293B")
        fields.pack(fill="x")

        tk.Label(fields, text="Product ID:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=0, padx=6, pady=4)
        e_pid = tk.Entry(fields, width=12)
        e_pid.grid(row=0, column=1, padx=6, pady=4)

        tk.Label(fields, text="Product Name:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=2, padx=6, pady=4)
        e_pname = tk.Entry(fields, width=24)
        e_pname.grid(row=0, column=3, padx=6, pady=4)

        tk.Label(fields, text="Category:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=4, padx=6, pady=4)
        e_cat = tk.Entry(fields, width=14)
        e_cat.insert(0, "General")
        e_cat.grid(row=0, column=5, padx=6, pady=4)

        tk.Label(fields, text="Unit Price ($):", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=6, padx=6, pady=4)
        e_price = tk.Entry(fields, width=10)
        e_price.grid(row=0, column=7, padx=6, pady=4)

        tk.Label(fields, text="Quantity:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=8, padx=6, pady=4)
        e_qty = tk.Entry(fields, width=8)
        e_qty.grid(row=0, column=9, padx=6, pady=4)

        def save_product():
            valid, err, cleaned = validate_product_inputs(
                e_pid.get(), e_pname.get(), e_price.get(), e_qty.get()
            )
            if not valid:
                messagebox.showerror("Validation Error", err)
                return
            try:
                self.inventory_mgr.register_product(
                    cleaned["product_id"],
                    cleaned["product_name"],
                    e_cat.get(),
                    cleaned["unit_price"],
                    cleaned["quantity"]
                )
                messagebox.showinfo("Success", f"Product '{cleaned['product_name']}' added.")
                self.show_inventory()
            except Exception as ex:
                messagebox.showerror("Error", str(ex))

        btn = tk.Button(fields, text="➕ Add Product", command=save_product, bg="#F59E0B", fg="black", font=("Segoe UI", 9, "bold"), padx=12, pady=4)
        btn.grid(row=0, column=10, padx=12, pady=4)

        # Inventory Table
        table_frame = tk.Frame(container, bg="#1E293B")
        table_frame.pack(fill="both", expand=True, pady=10)

        cols = ("Product ID", "Product Name", "Category", "Unit Price ($)", "Quantity", "Stock Value ($)", "Stock Status")
        tree = ttk.Treeview(table_frame, columns=cols, show="headings")
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=110, anchor="center")
        tree.pack(fill="both", expand=True, side="left")

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        products = self.inventory_mgr.get_all_products()
        for p in products:
            tree.insert("", "end", values=(
                p["product_id"],
                p["product_name"],
                p.get("category", "General"),
                f"${p['unit_price']:.2f}",
                p["quantity"],
                f"${p['stock_value']:.2f}",
                p["stock_status"]
            ))

    def show_transactions(self):
        """Stock transaction interface: Receive, Issue, Adjust."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Stock Transactions (Receive / Issue / Adjust)", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        card = tk.LabelFrame(container, text=" Process Stock Transaction ", fg="#10B981", bg="#1E293B", padx=14, pady=12)
        card.pack(fill="x", pady=6)

        fields = tk.Frame(card, bg="#1E293B")
        fields.pack(fill="x")

        tk.Label(fields, text="Product Code:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=0, padx=6, pady=4)
        e_pcode = tk.Entry(fields, width=14)
        e_pcode.grid(row=0, column=1, padx=6, pady=4)

        tk.Label(fields, text="Transaction Type:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=2, padx=6, pady=4)
        cb_type = ttk.Combobox(fields, values=["RECEIVE", "ISSUE", "ADJUSTMENT"], width=14)
        cb_type.current(0)
        cb_type.grid(row=0, column=3, padx=6, pady=4)

        tk.Label(fields, text="Quantity:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=4, padx=6, pady=4)
        e_tqty = tk.Entry(fields, width=8)
        e_tqty.grid(row=0, column=5, padx=6, pady=4)

        tk.Label(fields, text="Notes / Reference:", fg="#E2E8F0", bg="#1E293B").grid(row=0, column=6, padx=6, pady=4)
        e_notes = tk.Entry(fields, width=20)
        e_notes.grid(row=0, column=7, padx=6, pady=4)

        def execute_tx():
            try:
                qty = int(e_tqty.get())
                res = self.txn_mgr.process_transaction(
                    e_pcode.get(),
                    cb_type.get(),
                    qty,
                    e_notes.get()
                )
                messagebox.showinfo(
                    "Transaction Confirmed",
                    f"Successfully processed {res['type']} of {res['quantity']} units.\n"
                    f"Previous Stock: {res['previous_stock']} -> New Balance: {res['updated_stock']}"
                )
                self.show_transactions()
            except Exception as ex:
                messagebox.showerror("Transaction Denied", str(ex))

        btn = tk.Button(fields, text="⚡ Execute Transaction", command=execute_tx, bg="#10B981", fg="white", font=("Segoe UI", 9, "bold"), padx=12, pady=4)
        btn.grid(row=0, column=8, padx=12, pady=4)

        # Transaction History Table
        table_frame = tk.Frame(container, bg="#1E293B")
        table_frame.pack(fill="both", expand=True, pady=10)

        cols = ("TxID", "Product ID", "Product Name", "Type", "Qty", "Prev Stock", "New Stock", "Date", "Notes")
        tree = ttk.Treeview(table_frame, columns=cols, show="headings")
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=100, anchor="center")
        tree.pack(fill="both", expand=True, side="left")

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        txs = self.txn_mgr.get_all_transactions()
        for t in txs:
            tree.insert("", "end", values=(
                t["transaction_id"],
                t["product_id"],
                t["product_name"],
                t["transaction_type"],
                t["quantity"],
                t["previous_stock"],
                t["updated_stock"],
                t["transaction_date"],
                t.get("notes", "")
            ))

    def show_algorithms_view(self):
        """Displays Bubble Sort and Binary Search algorithm executions."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Searching & Sorting Algorithm Laboratory (SOEN 105)", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        btn_bar = tk.Frame(container, bg="#0B132B")
        btn_bar.pack(fill="x", pady=5)

        log_box = tk.Text(container, height=22, bg="#0F172A", fg="#A7F3D0", font=("Consolas", 10), padx=12, pady=12)
        log_box.pack(fill="both", expand=True, pady=10)

        def run_bubble_sort():
            products = self.inventory_mgr.get_all_products()
            sorted_p, comps, swaps, trace = bubble_sort_products(products)
            log_box.delete("1.0", "end")
            log_box.insert("end", "========================================================\n")
            log_box.insert("end", "SOEN 105 BUBBLE SORT DEMONSTRATION (SORT BY PRODUCT ID)\n")
            log_box.insert("end", "========================================================\n\n")
            for line in trace:
                log_box.insert("end", f"{line}\n")
            log_box.insert("end", f"\nFinal Sorted List ({len(sorted_p)} items):\n")
            for item in sorted_p:
                log_box.insert("end", f"  [{item['product_id']}] {item['product_name']} - Stock: {item['quantity']}\n")

        def run_binary_search():
            products = self.inventory_mgr.get_all_products()
            sorted_p, _, _, _ = bubble_sort_products(products) # precondition: must be sorted
            target = "PRD-104"
            found, comps, trace = binary_search_products(sorted_p, target)
            log_box.delete("1.0", "end")
            log_box.insert("end", "========================================================\n")
            log_box.insert("end", f"SOEN 105 BINARY SEARCH DEMONSTRATION (TARGET: {target})\n")
            log_box.insert("end", "========================================================\n\n")
            for line in trace:
                log_box.insert("end", f"{line}\n")
            if found:
                log_box.insert("end", f"\n[SUCCESS] Found: {found['product_name']} (Qty: {found['quantity']})\n")

        b1 = tk.Button(btn_bar, text="▶ Run Bubble Sort (Product ID Ascending)", command=run_bubble_sort, bg="#6366F1", fg="white", font=("Segoe UI", 10, "bold"), padx=14, pady=6)
        b1.pack(side="left", padx=5)

        b2 = tk.Button(btn_bar, text="▶ Run Binary Search (on Sorted Array)", command=run_binary_search, bg="#0D9488", fg="white", font=("Segoe UI", 10, "bold"), padx=14, pady=6)
        b2.pack(side="left", padx=5)

    def show_academic_reports(self):
        """Academic reports & export interface."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Academic Performance Reports & Export", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        card = tk.Frame(container, bg="#1E293B", padx=20, pady=20)
        card.pack(fill="x", pady=10)

        students = self.student_mgr.get_all_students()
        stats = calculate_class_statistics(students)

        tk.Label(card, text="Academic Class Performance Summary", fg="#38BDF8", bg="#1E293B", font=("Segoe UI", 13, "bold")).pack(anchor="w")
        summary_text = (
            f"• Total Students: {stats['total']}\n"
            f"• Total Passed (Score >= 40): {stats['passed']}\n"
            f"• Total Failed (Score < 40): {stats['failed']}\n"
            f"• Overall Pass Rate: {stats['pass_rate']}%\n"
            f"• Class Weighted Mean: {stats['average']}%\n"
            f"• Highest Student Score: {stats['highest']}%\n"
            f"• Lowest Student Score: {stats['lowest']}%"
        )
        tk.Label(card, text=summary_text, fg="#E2E8F0", bg="#1E293B", font=("Segoe UI", 10), justify="left").pack(anchor="w", pady=10)

        def do_export_csv():
            path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV Files", "*.csv")])
            if path:
                export_students_csv(students, path)
                messagebox.showinfo("Export Successful", f"Students records exported to {path}")

        def do_export_pdf():
            path = filedialog.asksaveasfilename(defaultextension=".pdf", filetypes=[("PDF Files", "*.pdf")])
            if path:
                generate_academic_pdf(students, path)
                messagebox.showinfo("Export Successful", f"PDF Report saved to {path}")

        b_frame = tk.Frame(card, bg="#1E293B")
        b_frame.pack(anchor="w", pady=5)
        tk.Button(b_frame, text="📥 Export CSV", command=do_export_csv, bg="#2563EB", fg="white", padx=14, pady=6).pack(side="left", padx=5)
        tk.Button(b_frame, text="📄 Generate PDF Report", command=do_export_pdf, bg="#7C3AED", fg="white", padx=14, pady=6).pack(side="left", padx=5)

    def show_inventory_reports(self):
        """Inventory reports and restocking recommendations."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Inventory Valuation & Restocking Reports", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        products = self.inventory_mgr.get_all_products()
        restock = [p for p in products if p["quantity"] < 10]

        card = tk.Frame(container, bg="#1E293B", padx=20, pady=20)
        card.pack(fill="both", expand=True, pady=10)

        tk.Label(card, text=f"⚠️ Critical Restocking Alerts ({len(restock)} items below threshold 10)", fg="#EF4444", bg="#1E293B", font=("Segoe UI", 13, "bold")).pack(anchor="w")

        cols = ("Product ID", "Product Name", "Current Stock", "Status", "Restock Advice")
        tree = ttk.Treeview(card, columns=cols, show="headings", height=8)
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=120, anchor="center")
        tree.pack(fill="both", expand=True, pady=10)

        for p in restock:
            advice = "URGENT: Re-order immediately (0 stock)" if p["quantity"] == 0 else "Re-order suggested (<10 units)"
            tree.insert("", "end", values=(
                p["product_id"],
                p["product_name"],
                p["quantity"],
                p["stock_status"],
                advice
            ))

        def export_inv_csv():
            path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV Files", "*.csv")])
            if path:
                export_inventory_csv(products, path)
                messagebox.showinfo("Export Successful", f"Inventory exported to {path}")

        tk.Button(card, text="📥 Export Complete Inventory CSV", command=export_inv_csv, bg="#F59E0B", fg="black", padx=14, pady=6).pack(anchor="w", pady=5)

    def show_settings(self):
        """Settings, database reset, and preferences."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="Application Settings & Database Management", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        card = tk.Frame(container, bg="#1E293B", padx=20, pady=20)
        card.pack(fill="x", pady=10)

        tk.Label(card, text="Database Controls", fg="#38BDF8", bg="#1E293B", font=("Segoe UI", 12, "bold")).pack(anchor="w")
        tk.Label(card, text="Location: database/group4_project.db (Permanent SQLite3 Storage)", fg="#94A3B8", bg="#1E293B").pack(anchor="w", pady=4)

        def reseed():
            if messagebox.askyesno("Confirm Reset", "Are you sure you want to reset the database to default demo data?"):
                init_database()
                messagebox.showinfo("Reset Complete", "Database reinitialized successfully.")

        tk.Button(card, text="🔄 Reset & Reseed Demo Data", command=reseed, bg="#DC2626", fg="white", padx=14, pady=6).pack(anchor="w", pady=10)

    def show_about(self):
        """About the SOEN 105 Group 4 Project application."""
        self.clear_workspace()
        container = tk.Frame(self.main_frame, bg="#0B132B")
        container.pack(fill="both", expand=True)

        tk.Label(container, text="About Group 4 Project", fg="#FFFFFF", bg="#0B132B", font=("Segoe UI", 16, "bold")).pack(anchor="w", pady=(0, 10))

        card = tk.Frame(container, bg="#1E293B", padx=20, pady=20)
        card.pack(fill="both", expand=True, pady=10)

        about_text = (
            "GROUP 4 PROJECT\n"
            "Intelligent Academic & Inventory Management\n"
            "Version 2.5.0-ENTERPRISE\n\n"
            "Developed strictly for the SOEN 105 Software Development Fundamentals Practical Assignment.\n\n"
            "Key Features & Algorithms Implemented:\n"
            "  1. Module A: Student Academic Performance Management\n"
            "     - CAT 1 (15%), CAT 2 (15%), Final Examination (70%)\n"
            "     - Final Score calculation, A/B/C/D/E grading & Pass/Fail classification\n"
            "     - Manual Linear Search algorithm on student registration numbers\n"
            "     - PDF and CSV reporting\n\n"
            "  2. Module B: Stock & Inventory Management\n"
            "     - Stock valuation (Unit Price * Quantity)\n"
            "     - Stock transactions (Receive stock, Issue stock, Non-negative stock protection)\n"
            "     - Stock monitoring (Low Stock < 10, Out of Stock = 0, Normal >= 10)\n"
            "     - Manual Linear Search by Product ID\n"
            "     - Manual Binary Search by Product ID (on sorted array)\n"
            "     - Manual Bubble Sort by Product ID in ascending order\n\n"
            "  3. Database & Architecture:\n"
            "     - SQLite3 permanent relational database storage\n"
            "     - Modular object-oriented Python architecture\n"
            "     - Comprehensive error handling and input validation\n"
        )
        tk.Label(card, text=about_text, fg="#E2E8F0", bg="#1E293B", font=("Segoe UI", 10), justify="left").pack(anchor="w")

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    app = Group4ProjectApp()
    app.run()
