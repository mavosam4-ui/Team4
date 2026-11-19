"""
utilities/calculations.py
Academic grading formulas and stock valuation logic.
SOEN 105 Software Development Fundamentals
"""

from typing import Tuple, Dict, Any, List

def calculate_student_grade(cat1: float, cat2: float, exam: float) -> Tuple[float, str, str]:
    """
    Applies the SOEN 105 weighting:
    CAT 1: 15%
    CAT 2: 15%
    Final examination: 70%
    Formula: Final Score = (CAT 1 * 0.15) + (CAT 2 * 0.15) + (Exam * 0.70)
    
    Grading Scale:
    70 - 100: A
    60 - 69: B
    50 - 59: C
    40 - 49: D
    Below 40: E
    
    Classification:
    >= 40: PASS
    < 40: FAIL
    """
    total_score = round((cat1 * 0.15) + (cat2 * 0.15) + (exam * 0.70), 2)
    
    if total_score >= 70.0:
        grade = "A"
    elif total_score >= 60.0:
        grade = "B"
    elif total_score >= 50.0:
        grade = "C"
    elif total_score >= 40.0:
        grade = "D"
    else:
        grade = "E"
        
    status = "PASS" if total_score >= 40.0 else "FAIL"
    return total_score, grade, status

def calculate_stock_value(unit_price: float, quantity: int) -> float:
    """Calculates product stock value = unit_price * quantity."""
    return round(unit_price * quantity, 2)

def evaluate_stock_level(quantity: int) -> str:
    """
    Evaluates inventory threshold:
    - Quantity == 0: OUT OF STOCK
    - Quantity < 10: LOW STOCK
    - Quantity >= 10: NORMAL STOCK
    """
    if quantity <= 0:
        return "OUT OF STOCK"
    elif quantity < 10:
        return "LOW STOCK"
    else:
        return "NORMAL STOCK"

def calculate_class_statistics(students: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculates mean average, pass rate, highest and lowest scores."""
    if not students:
        return {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "average": 0.0,
            "highest": 0.0,
            "lowest": 0.0,
            "pass_rate": 0.0
        }
    
    scores = [s["total_score"] for s in students]
    passed = sum(1 for s in students if s["status"] == "PASS")
    failed = len(students) - passed
    avg = round(sum(scores) / len(scores), 2)
    
    return {
        "total": len(students),
        "passed": passed,
        "failed": failed,
        "average": avg,
        "highest": max(scores),
        "lowest": min(scores),
        "pass_rate": round((passed / len(students)) * 100, 1)
    }
