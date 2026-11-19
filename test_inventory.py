"""
tests/test_inventory.py
Unit tests for Inventory and Stock Management module (SOEN 105).
"""

import unittest
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utilities.calculations import calculate_stock_value, evaluate_stock_level
from utilities.validators import validate_product_inputs

class TestInventoryModule(unittest.TestCase):

    def test_stock_valuation(self):
        val = calculate_stock_value(25.50, 4)
        self.assertEqual(val, 102.0)

    def test_stock_threshold_monitoring(self):
        self.assertEqual(evaluate_stock_level(0), "OUT OF STOCK")
        self.assertEqual(evaluate_stock_level(5), "LOW STOCK")
        self.assertEqual(evaluate_stock_level(9), "LOW STOCK")
        self.assertEqual(evaluate_stock_level(10), "NORMAL STOCK")
        self.assertEqual(evaluate_stock_level(50), "NORMAL STOCK")

    def test_negative_price_and_quantity_rejection(self):
        # Negative price
        valid, err, _ = validate_product_inputs("PRD-1", "Monitor", "-10.0", "5")
        self.assertFalse(valid)
        self.assertIn("cannot be negative", err)

        # Negative quantity
        valid, err, _ = validate_product_inputs("PRD-1", "Monitor", "10.0", "-5")
        self.assertFalse(valid)
        self.assertIn("cannot be negative", err)

    def test_empty_product_name(self):
        valid, err, _ = validate_product_inputs("PRD-1", "", "10.0", "5")
        self.assertFalse(valid)
        self.assertIn("cannot be empty", err)

if __name__ == "__main__":
    unittest.main()
