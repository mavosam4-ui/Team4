"""
utilities/exporters.py
CSV and PDF export functions for students and inventory reports.
"""

import csv
import os
from datetime import datetime
from typing import List, Dict, Any

def export_students_csv(students: List[Dict[str, Any]], filepath: str) -> str:
    """Exports student records to a standard CSV file."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["ID", "Reg Number", "Full Name", "CAT 1 (15%)", "CAT 2 (15%)", "Exam (70%)", "Total Score", "Grade", "Status"])
        for s in students:
            writer.writerow([
                s.get("id", ""),
                s.get("registration_number", ""),
                s.get("full_name", ""),
                s.get("cat1", 0),
                s.get("cat2", 0),
                s.get("examination", 0),
                s.get("total_score", 0),
                s.get("grade", ""),
                s.get("status", "")
            ])
    return filepath

def export_inventory_csv(products: List[Dict[str, Any]], filepath: str) -> str:
    """Exports product records to a standard CSV file."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["ID", "Product ID", "Product Name", "Category", "Unit Price ($)", "Quantity", "Total Stock Value ($)", "Stock Status"])
        for p in products:
            qty = p.get("quantity", 0)
            price = p.get("unit_price", 0.0)
            val = round(price * qty, 2)
            status = "OUT OF STOCK" if qty == 0 else ("LOW STOCK" if qty < 10 else "NORMAL")
            writer.writerow([
                p.get("id", ""),
                p.get("product_id", ""),
                p.get("product_name", ""),
                p.get("category", "General"),
                f"{price:.2f}",
                qty,
                f"{val:.2f}",
                status
            ])
    return filepath
