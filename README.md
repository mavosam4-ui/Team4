# GROUP 4 PROJECT
## Intelligent Academic & Inventory Management
### SOEN 105 Software Development Fundamentals Practical Assignment

---

## 1. Executive Summary

**Group 4 Project** is a desktop application developed in Python 3 using CustomTkinter, SQLite3, Matplotlib, and ReportLab. It integrates two modules:

- **Module A: Student Academic Performance Management System**
- **Module B: Inventory and Stock Management System**

The software demonstrates core concepts of software development fundamentals, manual searching algorithms (Linear Search and Binary Search), and manual sorting (Bubble Sort).

---

## 2. Key Features

### Module A: Student Academic Performance
- **Student Registration:** Unique Registration Number, Full Name, CAT 1 (0-100), CAT 2 (0-100), Final Exam (0-100).
- **Exact Academic Calculation:**
  $$\text{Final Score} = (\text{CAT 1} \times 0.15) + (\text{CAT 2} \times 0.15) + (\text{Examination} \times 0.70)$$
- **Grading Scale:**
  - $70 - 100 \rightarrow \mathbf{A}$
  - $60 - 69.99 \rightarrow \mathbf{B}$
  - $50 - 59.99 \rightarrow \mathbf{C}$
  - $40 - 49.99 \rightarrow \mathbf{D}$
  - Below $40 \rightarrow \mathbf{E}$ (FAIL)
  - $\ge 40 \rightarrow \mathbf{PASS}$
- **Manual Linear Search:** Sequentially inspects student records by Registration Number without SQL queries, providing step-by-step trace logs.
- **Reporting:** Class performance statistics (average, highest, lowest score, pass rate), CSV export, and PDF generation.

### Module B: Inventory & Stock Management
- **Product Registration:** Unique Product ID, Name, Category, Unit Price, Stock Quantity.
- **Stock Valuation:** $\text{Stock Value} = \text{Unit Price} \times \text{Quantity}$.
- **Stock Monitoring:**
  - $\text{Quantity} < 10 \rightarrow \text{LOW STOCK}$
  - $\text{Quantity} == 0 \rightarrow \text{OUT OF STOCK}$
  - $\text{Quantity} \ge 10 \rightarrow \text{NORMAL STOCK}$
- **Stock Transactions:**
  - Receive new stock (+ quantity)
  - Issue/Sell stock (- quantity)
  - Non-negative stock protection: Strictly rejects selling more than currently available in stock.
  - Full audit logging in `stock_transactions` table.
- **Algorithms:**
  - **Manual Linear Search** by Product ID.
  - **Manual Binary Search** on pre-sorted array by Product ID.
  - **Manual Bubble Sort** ordering products by Product ID in ascending order with step trace.

---

## 3. Installation & Running Instructions

### Prerequisites
- Python 3.9+ installed on your computer.

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Initialize Database & Seed Demo Data
The SQLite database (`database/group4_project.db`) automatically initializes on first run. To manually initialize:
```bash
python database/database.py
```

### Step 3: Run the Application
```bash
python main.py
```

### Step 4: Run Automated Unit Tests
```bash
python -m unittest discover -s tests
```

---

## 4. Project Directory Structure
```
GROUP_4_PROJECT/
├── main.py                  # Primary CustomTkinter desktop GUI application
├── database/
│   ├── database.py          # SQLite 3 connection manager & seeder
│   └── schema.sql           # DDL schema definition
├── modules/
│   ├── students.py          # Student management data access
│   ├── inventory.py         # Inventory product management
│   ├── transactions.py      # Stock transactions with negative protection
│   ├── searching.py         # SOEN 105 Linear & Binary search implementations
│   ├── sorting.py           # SOEN 105 Bubble sort implementation
│   └── reports.py           # PDF and formatted reporting logic
├── interface/
│   └── themes.py            # Deep navy enterprise palette & styles
├── utilities/
│   ├── calculations.py      # Academic weights & stock valuation logic
│   ├── validators.py        # Input validation for marks, prices, quantities
│   └── exporters.py         # CSV file exporters
├── tests/
│   ├── test_students.py     # Unit tests for academic performance
│   ├── test_inventory.py    # Unit tests for inventory & stock
│   └── test_algorithms.py   # Unit tests for searching & sorting algorithms
├── requirements.txt         # Required Python packages
└── README.md                # Complete documentation
```
