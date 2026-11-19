"""
tests/test_students.py
Unit tests for Student Academic Performance module (SOEN 105).
"""

import unittest
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utilities.calculations import calculate_student_grade, calculate_class_statistics
from utilities.validators import validate_student_inputs
from modules.searching import linear_search_students

class TestStudentModule(unittest.TestCase):

    def test_correct_weighted_score(self):
        # 80 * 0.15 + 70 * 0.15 + 90 * 0.70 = 12 + 10.5 + 63 = 85.5
        score, grade, status = calculate_student_grade(80, 70, 90)
        self.assertEqual(score, 85.5)
        self.assertEqual(grade, "A")
        self.assertEqual(status, "PASS")

    def test_grade_boundaries(self):
        # Grade A: >= 70
        self.assertEqual(calculate_student_grade(70, 70, 70)[1], "A")
        # Grade B: 60 - 69
        self.assertEqual(calculate_student_grade(65, 65, 65)[1], "B")
        # Grade C: 50 - 59
        self.assertEqual(calculate_student_grade(55, 55, 55)[1], "C")
        # Grade D: 40 - 49
        self.assertEqual(calculate_student_grade(42, 42, 42)[1], "D")
        # Grade E: < 40
        self.assertEqual(calculate_student_grade(35, 35, 35)[1], "E")

    def test_pass_and_fail_classification(self):
        _, _, pass_status = calculate_student_grade(40, 40, 40)
        self.assertEqual(pass_status, "PASS")

        _, _, fail_status = calculate_student_grade(39, 39, 39)
        self.assertEqual(fail_status, "FAIL")

    def test_input_validation_marks_range(self):
        # Below 0
        valid, err, _ = validate_student_inputs("BCS-01", "John", "-5", "50", "60")
        self.assertFalse(valid)
        self.assertIn("CAT 1 marks must be between", err)

        # Above 100
        valid, err, _ = validate_student_inputs("BCS-01", "John", "50", "105", "60")
        self.assertFalse(valid)
        self.assertIn("CAT 2 marks must be between", err)

        # Non-numeric
        valid, err, _ = validate_student_inputs("BCS-01", "John", "fifty", "50", "60")
        self.assertFalse(valid)

    def test_linear_search_students(self):
        students = [
            {"registration_number": "BCS-001", "full_name": "Alice"},
            {"registration_number": "BCS-002", "full_name": "Bob"},
            {"registration_number": "BCS-003", "full_name": "Charlie"},
        ]
        # Successful search
        found, comps, _ = linear_search_students(students, "BCS-002")
        self.assertIsNotNone(found)
        self.assertEqual(found["full_name"], "Bob")
        self.assertEqual(comps, 2)

        # Unsuccessful search
        not_found, comps_nf, _ = linear_search_students(students, "BCS-999")
        self.assertIsNone(not_found)
        self.assertEqual(comps_nf, 3)

    def test_class_statistics(self):
        records = [
            {"total_score": 80.0, "status": "PASS"},
            {"total_score": 60.0, "status": "PASS"},
            {"total_score": 30.0, "status": "FAIL"},
        ]
        stats = calculate_class_statistics(records)
        self.assertEqual(stats["total"], 3)
        self.assertEqual(stats["passed"], 2)
        self.assertEqual(stats["failed"], 1)
        self.assertAlmostEqual(stats["average"], 56.67, places=2)
        self.assertEqual(stats["highest"], 80.0)
        self.assertEqual(stats["lowest"], 30.0)

if __name__ == "__main__":
    unittest.main()
