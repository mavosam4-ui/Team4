"""
modules/searching.py
SOEN 105 Software Development Fundamentals: Searching Algorithms
Demonstrates manual Linear Search and Binary Search implementations.
"""

from typing import List, Dict, Any, Optional, Tuple

def linear_search_students(
    student_list: List[Dict[str, Any]],
    target_reg_no: str
) -> Tuple[Optional[Dict[str, Any]], int, List[str]]:
    """
    SOEN 105 Requirement:
    Manual Linear Search through student list by registration number.
    Does NOT use SQL queries.
    
    Returns:
        (found_student_or_None, total_comparisons, step_trace_log)
    """
    target = target_reg_no.strip().upper()
    comparisons = 0
    trace = []
    
    for index in range(len(student_list)):
        comparisons += 1
        current = student_list[index]
        current_reg = str(current["registration_number"]).strip().upper()
        
        if current_reg == target:
            trace.append(f"Step {comparisons}: Index [{index}] -> '{current_reg}' == '{target}' [MATCH FOUND]")
            return current, comparisons, trace
        else:
            trace.append(f"Step {comparisons}: Index [{index}] -> '{current_reg}' != '{target}' [CONTINUE]")
            
    trace.append(f"Search exhausted: Target '{target}' not found after {comparisons} sequential comparisons.")
    return None, comparisons, trace


def linear_search_products(
    product_list: List[Dict[str, Any]],
    target_product_id: str
) -> Tuple[Optional[Dict[str, Any]], int, List[str]]:
    """
    SOEN 105 Requirement:
    Manual Linear Search through products sequentially by Product ID.
    
    Returns:
        (found_product_or_None, total_comparisons, step_trace_log)
    """
    target = target_product_id.strip().upper()
    comparisons = 0
    trace = []
    
    for i in range(len(product_list)):
        comparisons += 1
        item = product_list[i]
        item_id = str(item["product_id"]).strip().upper()
        
        if item_id == target:
            trace.append(f"Step {comparisons}: Index [{i}] -> '{item_id}' == '{target}' [MATCH FOUND]")
            return item, comparisons, trace
        else:
            trace.append(f"Step {comparisons}: Index [{i}] -> '{item_id}' != '{target}' [CONTINUE]")
            
    trace.append(f"Product '{target}' not found in inventory after {comparisons} comparisons.")
    return None, comparisons, trace


def binary_search_products(
    sorted_product_list: List[Dict[str, Any]],
    target_product_id: str
) -> Tuple[Optional[Dict[str, Any]], int, List[str]]:
    """
    SOEN 105 Requirement:
    Manual Binary Search algorithm.
    Precondition: sorted_product_list must be sorted by product_id ascending.
    
    Returns:
        (found_product_or_None, total_comparisons, step_trace_log)
    """
    target = target_product_id.strip().upper()
    low = 0
    high = len(sorted_product_list) - 1
    comparisons = 0
    trace = []
    
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        mid_item = sorted_product_list[mid]
        mid_id = str(mid_item["product_id"]).strip().upper()
        
        if mid_id == target:
            trace.append(f"Step {comparisons}: Low={low}, High={high}, Mid=[{mid}] ('{mid_id}') == '{target}' [FOUND]")
            return mid_item, comparisons, trace
        elif mid_id < target:
            trace.append(f"Step {comparisons}: Low={low}, High={high}, Mid=[{mid}] ('{mid_id}') < '{target}' -> Search Right Half")
            low = mid + 1
        else:
            trace.append(f"Step {comparisons}: Low={low}, High={high}, Mid=[{mid}] ('{mid_id}') > '{target}' -> Search Left Half")
            high = mid - 1
            
    trace.append(f"Binary search completed: Target '{target}' not found after {comparisons} divide-and-conquer steps.")
    return None, comparisons, trace
