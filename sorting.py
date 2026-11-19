"""
modules/sorting.py
SOEN 105 Software Development Fundamentals: Bubble Sort Implementation
Sorts product inventory records ascending by Product ID.
"""

from typing import List, Dict, Any, Tuple

def bubble_sort_products(
    products: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], int, int, List[str]]:
    """
    SOEN 105 Requirement:
    Manual Bubble Sort algorithm sorting products by Product ID in ascending order.
    Preserves all product information (dictionaries/tuples).
    
    Returns:
        (sorted_products_list, total_comparisons, total_swaps, step_trace_log)
    """
    # Create shallow copy of dicts so original list is untouched
    arr = [dict(item) for item in products]
    n = len(arr)
    comparisons = 0
    swaps = 0
    trace = []
    
    for i in range(n - 1):
        swapped_in_pass = False
        trace.append(f"--- Starting Bubble Sort Pass {i + 1} ---")
        
        for j in range(0, n - i - 1):
            comparisons += 1
            id_a = str(arr[j]["product_id"]).strip().upper()
            id_b = str(arr[j + 1]["product_id"]).strip().upper()
            
            if id_a > id_b:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                swapped_in_pass = True
                trace.append(f"Pass {i + 1}, Comp {j + 1}: '{id_a}' > '{id_b}' -> SWAPPED indices {j} & {j + 1}")
            else:
                trace.append(f"Pass {i + 1}, Comp {j + 1}: '{id_a}' <= '{id_b}' -> Kept in order")
                
        if not swapped_in_pass:
            trace.append(f"Optimization: Array sorted early at Pass {i + 1} with zero swaps.")
            break
            
    trace.append(f"Bubble Sort completed. Total comparisons: {comparisons}, Total swaps: {swaps}")
    return arr, comparisons, swaps, trace
