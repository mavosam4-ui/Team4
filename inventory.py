"""
modules/inventory.py
Product and stock data access and monitoring for SOEN 105.
"""

from typing import List, Dict, Any, Optional
from database.database import get_connection
from utilities.calculations import evaluate_stock_level

class InventoryManager:
    """Manages products inventory records and status evaluation."""
    
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    def register_product(
        self,
        product_id: str,
        name: str,
        category: str,
        unit_price: float,
        quantity: int
    ) -> Dict[str, Any]:
        """Registers a new inventory product."""
        conn = get_connection(self.db_path)
        with conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO products (product_id, product_name, category, unit_price, quantity)
                VALUES (?, ?, ?, ?, ?)
            """, (product_id.strip().upper(), name.strip(), category.strip(), unit_price, quantity))
            new_id = cursor.lastrowid
        conn.close()
        return self.get_product_by_id(new_id)

    def get_all_products(self) -> List[Dict[str, Any]]:
        """Returns all products with computed stock values and alerts."""
        conn = get_connection(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for r in rows:
            p = dict(r)
            p["stock_value"] = round(p["unit_price"] * p["quantity"], 2)
            p["stock_status"] = evaluate_stock_level(p["quantity"])
            results.append(p)
        return results

    def get_product_by_id(self, product_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        p = dict(row)
        p["stock_value"] = round(p["unit_price"] * p["quantity"], 2)
        p["stock_status"] = evaluate_stock_level(p["quantity"])
        return p

    def update_product(
        self,
        product_id_pk: int,
        product_code: str,
        name: str,
        category: str,
        unit_price: float,
        quantity: int
    ) -> Dict[str, Any]:
        conn = get_connection(self.db_path)
        with conn:
            conn.execute("""
                UPDATE products
                SET product_id = ?, product_name = ?, category = ?, unit_price = ?, quantity = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (product_code.strip().upper(), name.strip(), category.strip(), unit_price, quantity, product_id_pk))
        conn.close()
        return self.get_product_by_id(product_id_pk)

    def delete_product(self, product_id_pk: int) -> bool:
        conn = get_connection(self.db_path)
        with conn:
            cursor = conn.execute("DELETE FROM products WHERE id = ?", (product_id_pk,))
            affected = cursor.rowcount
        conn.close()
        return affected > 0
