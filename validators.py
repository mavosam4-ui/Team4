"""
utilities/validators.py
Input validation functions demonstrating SOEN 105 principles.
"""

from typing import Tuple

def validate_student_inputs(
    reg_no: str,
    full_name: str,
    cat1_raw: str,
    cat2_raw: str,
    exam_raw: str
) -> Tuple[bool, str, dict]:
    """Validates registration inputs according to assignment rules."""
    reg = reg_no.strip().upper()
    name = full_name.strip()
    
    if not reg:
        return False, "Registration number cannot be empty.", {}
    if not name:
        return False, "Student full name cannot be empty.", {}
    
    try:
        c1 = float(cat1_raw)
        if not (0.0 <= c1 <= 100.0):
            return False, "CAT 1 marks must be between 0.0 and 100.0.", {}
    except ValueError:
        return False, "CAT 1 marks must be a valid numeric value.", {}
        
    try:
        c2 = float(cat2_raw)
        if not (0.0 <= c2 <= 100.0):
            return False, "CAT 2 marks must be between 0.0 and 100.0.", {}
    except ValueError:
        return False, "CAT 2 marks must be a valid numeric value.", {}
        
    try:
        exam = float(exam_raw)
        if not (0.0 <= exam <= 100.0):
            return False, "Examination marks must be between 0.0 and 100.0.", {}
    except ValueError:
        return False, "Examination marks must be a valid numeric value.", {}
        
    return True, "", {
        "registration_number": reg,
        "full_name": name,
        "cat1": round(c1, 2),
        "cat2": round(c2, 2),
        "examination": round(exam, 2)
    }

def validate_product_inputs(
    product_id: str,
    product_name: str,
    price_raw: str,
    quantity_raw: str
) -> Tuple[bool, str, dict]:
    """Validates product inputs ensuring no negative quantities or prices."""
    pid = product_id.strip().upper()
    pname = product_name.strip()
    
    if not pid:
        return False, "Product ID cannot be empty.", {}
    if not pname:
        return False, "Product name cannot be empty.", {}
        
    try:
        price = float(price_raw)
        if price < 0.0:
            return False, "Unit price cannot be negative.", {}
    except ValueError:
        return False, "Unit price must be a valid positive number.", {}
        
    try:
        qty = int(quantity_raw)
        if qty < 0:
            return False, "Stock quantity cannot be negative.", {}
    except ValueError:
        return False, "Stock quantity must be a non-negative whole integer.", {}
        
    return True, "", {
        "product_id": pid,
        "product_name": pname,
        "unit_price": round(price, 2),
        "quantity": qty
    }
