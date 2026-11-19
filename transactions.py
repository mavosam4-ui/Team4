"""
modules/transactions.py
Stock Transactions (Receive, Issue, Adjust) with validation and audit history.
"""

from typing import List, Dict, Any, Optional
import time
from database.database import get_connection

class TransactionManager:
    """Handles stock transactions, ensuring non-negative quantities and history logging."""
    
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    def process_transaction(
        self,
        product_code: str,
        transaction_type: str,
        quantity: int,
        notes: str = ""
    ) -> Dict[str, Any]:
        """
        Processes a stock transaction:
        - RECEIVE: Increases inventory
        - ISSUE: Decreases inventory, strictly prevents stock < 0
        """
        code = product_code.strip().upper()
        ttype = transaction_type.strip().upper()
        
        if quantity <= 0:
            raise ValueError("Transaction quantity must be a positive integer.")
            
        if ttype not in ("RECEIVE", "ISSUE", "ADJUSTMENT"):
            raise ValueError(f"Invalid transaction type: {ttype}")
            
        conn = get_connection(self.db_path)
        with conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, product_id, product_name, quantity FROM products WHERE product_id = ?", (code,))
            product = cursor.fetchone()
            
            if not product:
                raise ValueError(f"Product '{code}' does not exist.")
                
            prev_stock = product["quantity"]
            
            if ttype == "RECEIVE":
                updated_stock = prev_stock + quantity
            elif ttype == "ISSUE":
                if quantity > prev_stock:
                    raise ValueError(
                        f"Insufficient stock! Cannot issue {quantity} units. Available: {prev_stock} units."
                    )
                updated_stock = prev_stock - quantity
            else: # ADJUSTMENT
                updated_stock = quantity
                
            # Update product quantity
            cursor.execute("UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (updated_stock, product["id"]))
            
            # Insert audit transaction record
            txn_id = f"TXN-{int(time.time())}-{code[-3:] if len(code)>=3 else '001'}"
            cursor.execute("""
                INSERT INTO stock_transactions (transaction_id, product_id, product_name, transaction_type, quantity, previous_stock, updated_stock, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (txn_id, code, product["product_name"], ttype, quantity, prev_stock, updated_stock, notes or f"{ttype} stock"))
            
        conn.close()
        return {
            "transaction_id": txn_id,
            "product_id": code,
            "product_name": product["product_name"],
            "type": ttype,
            "quantity": quantity,
            "previous_stock": prev_stock,
            "updated_stock": updated_stock,
        }

    def get_all_transactions(self, product_code: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_connection(self.db_path)
        cursor = conn.cursor()
        if product_code:
            cursor.execute("SELECT * FROM stock_transactions WHERE product_id = ? ORDER BY id DESC", (product_code.strip().upper(),))
        else:
            cursor.execute("SELECT * FROM stock_transactions ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]
