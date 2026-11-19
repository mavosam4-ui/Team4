"""
database/database.py
Database connection manager and schema initialization for SQLite3.
SOEN 105 Software Development Fundamentals
"""

import sqlite3
import os
from typing import Optional

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "group4_project.db")

def get_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Returns a connection to the SQLite database with row factory enabled."""
    target_path = db_path or DB_FILE
    conn = sqlite3.connect(target_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_database(db_path: Optional[str] = None):
    """Initializes tables using schema.sql and seeds demo records if empty."""
    conn = get_connection(db_path)
    schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    with conn:
        conn.executescript(schema_sql)
        
        # Check if students empty -> seed
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM students")
        count_students = cursor.fetchone()[0]
        
        if count_students == 0:
            sample_students = [
                ("BCS-001-2025", "Alex Rivera", 85.0, 78.0, 82.0, 81.85, "A", "PASS"),
                ("BCS-002-2025", "Brenda Wanjiku", 72.0, 68.0, 74.0, 72.80, "A", "PASS"),
                ("BCS-003-2025", "Christopher Nolan", 58.0, 64.0, 62.0, 61.70, "B", "PASS"),
                ("BCS-004-2025", "Diana Chen", 50.0, 55.0, 52.0, 52.15, "C", "PASS"),
                ("BCS-005-2025", "Emmanuel Ochieng", 42.0, 46.0, 44.0, 44.00, "D", "PASS"),
                ("BCS-006-2025", "Fatima Al-Mansoor", 30.0, 35.0, 38.0, 36.35, "E", "FAIL"),
                ("BCS-007-2025", "George Mwangi", 90.0, 92.0, 88.0, 88.90, "A", "PASS"),
                ("BCS-008-2025", "Hannah Kim", 65.0, 60.0, 68.0, 66.35, "B", "PASS"),
            ]
            cursor.executemany("""
                INSERT INTO students (registration_number, full_name, cat1, cat2, examination, total_score, grade, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_students)

        # Check if products empty -> seed
        cursor.execute("SELECT COUNT(*) FROM products")
        count_products = cursor.fetchone()[0]
        if count_products == 0:
            sample_products = [
                ("PRD-101", "Dell UltraSharp 27-inch Monitor", "Hardware", 349.99, 18),
                ("PRD-102", "Logitech MX Master 3S Mouse", "Peripherals", 99.50, 25),
                ("PRD-103", "Keychron K2 Mechanical Keyboard", "Peripherals", 85.00, 7),
                ("PRD-104", "SanDisk 1TB NVMe Extreme SSD", "Storage", 129.99, 4),
                ("PRD-105", "Sony WH-1000XM5 Headphones", "Audio", 399.00, 12),
                ("PRD-106", "Anker 65W GaN Fast Charger", "Accessories", 39.99, 0),
                ("PRD-107", "HP LaserJet Pro Enterprise Printer", "Office", 549.00, 5),
                ("PRD-108", "Cat-6 High-Speed Ethernet Cable 15m", "Networking", 14.50, 42),
            ]
            cursor.executemany("""
                INSERT INTO products (product_id, product_name, category, unit_price, quantity)
                VALUES (?, ?, ?, ?, ?)
            """, sample_products)

            # Sample transactions
            sample_tx = [
                ("TXN-2025-001", "PRD-101", "Dell UltraSharp 27-inch Monitor", "RECEIVE", 20, 0, 20, "Initial batch shipment"),
                ("TXN-2025-002", "PRD-101", "Dell UltraSharp 27-inch Monitor", "ISSUE", 2, 20, 18, "Issued to CS Lab 3"),
                ("TXN-2025-003", "PRD-103", "Keychron K2 Mechanical Keyboard", "ISSUE", 5, 12, 7, "Sold to Engineering Dept"),
                ("TXN-2025-004", "PRD-106", "Anker 65W GaN Fast Charger", "ISSUE", 15, 15, 0, "Bulk issuance - Out of stock"),
            ]
            cursor.executemany("""
                INSERT INTO stock_transactions (transaction_id, product_id, product_name, transaction_type, quantity, previous_stock, updated_stock, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_tx)
    conn.close()

if __name__ == "__main__":
    init_database()
    print(f"Database successfully initialized at {DB_FILE}")
