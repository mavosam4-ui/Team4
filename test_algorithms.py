"""
tests/test_algorithms.py
Unit tests for Searching (Linear & Binary) and Sorting (Bubble Sort) (SOEN 105).
"""

import unittest
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from modules.searching import linear_search_products, binary_search_products
from modules.sorting import bubble_sort_products

class TestAlgorithms(unittest.TestCase):

    def setUp(self):
        self.unsorted_products = [
            {"product_id": "PRD-500", "product_name": "Keyboard", "unit_price": 45.0, "quantity": 10},
            {"product_id": "PRD-100", "product_name": "Monitor", "unit_price": 200.0, "quantity": 5},
            {"product_id": "PRD-300", "product_name": "Mouse", "unit_price": 25.0, "quantity": 20},
            {"product_id": "PRD-200", "product_name": "Headphones", "unit_price": 80.0, "quantity": 15},
            {"product_id": "PRD-400", "product_name": "Webcam", "unit_price": 60.0, "quantity": 8},
        ]

    def test_bubble_sort_correctness(self):
        sorted_list, comps, swaps, trace = bubble_sort_products(self.unsorted_products)
        sorted_ids = [p["product_id"] for p in sorted_list]
        expected_ids = ["PRD-100", "PRD-200", "PRD-300", "PRD-400", "PRD-500"]
        self.assertEqual(sorted_ids, expected_ids)
        self.assertGreater(comps, 0)
        self.assertGreater(swaps, 0)

    def test_linear_search_products(self):
        found, comps, _ = linear_search_products(self.unsorted_products, "PRD-300")
        self.assertIsNotNone(found)
        self.assertEqual(found["product_name"], "Mouse")
        self.assertEqual(comps, 3)

        not_found, comps_nf, _ = linear_search_products(self.unsorted_products, "PRD-999")
        self.assertIsNone(not_found)
        self.assertEqual(comps_nf, 5)

    def test_binary_search_products(self):
        # Prepare sorted list first
        sorted_list, _, _, _ = bubble_sort_products(self.unsorted_products)
        
        # Successful binary search
        found, comps, trace = binary_search_products(sorted_list, "PRD-400")
        self.assertIsNotNone(found)
        self.assertEqual(found["product_name"], "Webcam")
        self.assertLessEqual(comps, 4)

        # Unsuccessful binary search
        not_found, comps_nf, _ = binary_search_products(sorted_list, "PRD-999")
        self.assertIsNone(not_found)

if __name__ == "__main__":
    unittest.main()
