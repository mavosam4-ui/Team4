# SOEN 105: SOFTWARE DEVELOPMENT FUNDAMENTALS
## COMPREHENSIVE PROGRAM DEVELOPMENT LIFE CYCLE (PDLC) TECHNICAL REPORT
### PROJECT: GROUP 4 PROJECT (Academic Performance & Inventory Management)

---

## 1. INTRODUCTION
Group 4 Project is an enterprise-grade desktop and full-stack software application engineered to address two critical administrative challenges in institutional management:
1. Academic Performance Management for tertiary educational institutions.
2. Inventory, Stock Valuation, and Movement Tracking for warehouse and campus logistics.

The software has been engineered under the SOEN 105 Software Development Fundamentals syllabus to exemplify modular software architecture, algorithmic design (Linear Search, Binary Search, Bubble Sort), persistent relational database storage, and input validation.

---

## 2. PROBLEM DEFINITION
Manual academic grade recording and physical stock ledgers in institutional environments present numerous systemic vulnerabilities:
- Human transcription errors during weighted mark calculations (CAT 1 15%, CAT 2 15%, Exam 70%).
- Grade assignment inaccuracies against established institutional grading thresholds.
- Lack of immediate visibility into student pass/fail distribution and class averages.
- Inventory mismanagement resulting in stockouts (zero inventory) or over-purchasing.
- Inability to verify stock movements through auditable transaction logs.
- Negative stock errors occurring when issued quantities exceed physical available units.

---

## 3. PROBLEM ANALYSIS
To eliminate these issues, the system requires computational guarantees:
- **Mathematical Determinism:** Weighted scores must strictly follow:
  $$\text{Final Score} = (\text{CAT 1} \times 0.15) + (\text{CAT 2} \times 0.15) + (\text{Exam} \times 0.70)$$
- **Strict Boundary Enforcements:** Marks must strictly satisfy $0.0 \le \text{Mark} \le 100.0$.
- **Stock Invariant:** At all times, $\text{Quantity} \ge 0$. Any stock issuance where $\text{Quantity}_{\text{requested}} > \text{Stock}_{\text{current}}$ must be rejected prior to database commitment.
- **Relational Integrity:** Unique constraints on Student Registration Numbers and Product IDs to prevent duplicate record collisions.

---

## 4. FUNCTIONAL REQUIREMENTS

### Module A: Student Academic Performance
- **FR-A1:** Register student with Unique Registration Number, Full Name, CAT 1, CAT 2, and Final Examination scores.
- **FR-A2:** Calculate weighted final score, assign grade (A: 70-100, B: 60-69, C: 50-59, D: 40-49, E: <40), and evaluate Status (Pass $\ge 40$, Fail $<40$).
- **FR-A3:** Edit existing student records and dynamically recompute grades.
- **FR-A4:** Delete student records with confirmation.
- **FR-A5:** Execute manual Linear Search on student registration numbers.
- **FR-A6:** Generate class performance analytics: Total enrolled, pass count, fail count, class mean, highest, and lowest score.
- **FR-A7:** Export reports in CSV and PDF formats.

### Module B: Inventory & Stock Management
- **FR-B1:** Register product with Unique Product ID, Product Name, Category, Unit Price ($\ge 0$), and Initial Quantity ($\ge 0$).
- **FR-B2:** Calculate stock valuation: $\text{Value} = \text{Unit Price} \times \text{Quantity}$.
- **FR-B3:** Stock transactions: RECEIVE (increment quantity), ISSUE (decrement quantity), and ADJUSTMENT.
- **FR-B4:** Enforce inventory validation preventing negative balances and over-issuing.
- **FR-B5:** Real-time stock status monitoring: NORMAL ($\ge 10$), LOW STOCK ($<10$), OUT OF STOCK ($=0$).
- **FR-B6:** Execute manual Linear Search by Product ID.
- **FR-B7:** Execute manual Binary Search on sorted Product ID array.
- **FR-B8:** Execute manual Bubble Sort on products list in ascending Product ID order.
- **FR-B9:** Generate restocking reports and export to CSV/PDF.

---

## 5. SYSTEM DESIGN & ARCHITECTURE

The system implements a Layered Architecture:
1. **Presentation Layer:** CustomTkinter desktop interface / Next.js responsive fullstack dashboard.
2. **Business Logic Layer:** Grading calculations, stock status evaluation, transaction validations, searching and sorting algorithms.
3. **Data Access Layer:** SQLite3 / PostgreSQL parameterized queries with ACID transactions and schema constraints.

---

## 6. ALGORITHMS SPECIFICATION

### 6.1 Linear Search (Students & Products)
- **Time Complexity:** Best Case $O(1)$, Average/Worst Case $O(n)$.
- **Space Complexity:** $O(1)$.
- Sequentially checks each record from index $0$ to $n-1$.

### 6.2 Binary Search (Products)
- **Time Complexity:** Best Case $O(1)$, Average/Worst Case $O(\log n)$.
- **Space Complexity:** $O(1)$.
- **Precondition:** The list must be strictly sorted by key.
- Repeatedly calculates midpoint $\text{mid} = \lfloor (\text{low} + \text{high}) / 2 \rfloor$ and halves the search space.

### 6.3 Bubble Sort (Products)
- **Time Complexity:** Best Case $O(n)$ with early termination flag, Average/Worst Case $O(n^2)$.
- **Space Complexity:** $O(1)$ auxiliary.
- Adjacent elements are compared and swapped if $A[j] > A[j+1]$.

---

## 7. PSEUDOCODE

### 7.1 Student Grade Calculation
```text
FUNCTION CalculateGrade(cat1, cat2, exam):
    totalScore = (cat1 * 0.15) + (cat2 * 0.15) + (exam * 0.70)
    IF totalScore >= 70.0 THEN
        grade = 'A'
    ELSE IF totalScore >= 60.0 THEN
        grade = 'B'
    ELSE IF totalScore >= 50.0 THEN
        grade = 'C'
    ELSE IF totalScore >= 40.0 THEN
        grade = 'D'
    ELSE
        grade = 'E'
    END IF
    
    IF totalScore >= 40.0 THEN
        status = 'PASS'
    ELSE
        status = 'FAIL'
    END IF
    
    RETURN (ROUND(totalScore, 2), grade, status)
END FUNCTION
```

### 7.2 Linear Search
```text
FUNCTION LinearSearch(list, targetKey):
    FOR index FROM 0 TO LENGTH(list) - 1:
        IF list[index].key == targetKey THEN
            RETURN (list[index], comparisons = index + 1, FOUND = TRUE)
        END IF
    END FOR
    RETURN (NULL, comparisons = LENGTH(list), FOUND = FALSE)
END FUNCTION
```

### 7.3 Binary Search
```text
FUNCTION BinarySearch(sortedList, targetKey):
    low = 0
    high = LENGTH(sortedList) - 1
    comparisons = 0
    WHILE low <= high:
        comparisons = comparisons + 1
        mid = FLOOR((low + high) / 2)
        IF sortedList[mid].key == targetKey THEN
            RETURN (sortedList[mid], comparisons, FOUND = TRUE)
        ELSE IF sortedList[mid].key < targetKey THEN
            low = mid + 1
        ELSE
            high = mid - 1
        END IF
    END WHILE
    RETURN (NULL, comparisons, FOUND = FALSE)
END FUNCTION
```

### 7.4 Bubble Sort
```text
FUNCTION BubbleSort(list):
    n = LENGTH(list)
    FOR pass FROM 0 TO n - 2:
        swapped = FALSE
        FOR j FROM 0 TO n - pass - 2:
            IF list[j].key > list[j + 1].key THEN
                TEMP = list[j]
                list[j] = list[j + 1]
                list[j + 1] = TEMP
                swapped = TRUE
            END IF
        END FOR
        IF swapped == FALSE THEN
            BREAK // Early termination optimization
        END IF
    END FOR
    RETURN list
END FUNCTION
```

---

## 8. ASCII FLOWCHARTS

### 8.1 Student Registration Flowchart
```
  [ Start ]
      │
      ▼
[ Input: RegNo, Name, CAT1, CAT2, Exam ]
      │
      ▼
< Are Inputs Valid & Marks between 0 and 100? > ──No──► [ Display Validation Error ]
      │                                                               ▲
     Yes                                                              │
      │                                                               │
      ▼                                                               │
< Does RegNo already exist in Database? > ────────────Yes─────────────┘
      │
     No
      │
      ▼
[ Compute: TotalScore = CAT1*0.15 + CAT2*0.15 + Exam*0.70 ]
      │
      ▼
[ Determine Grade (A/B/C/D/E) and Status (PASS/FAIL) ]
      │
      ▼
[ INSERT record into students table ]
      │
      ▼
[ Display Success Notification & Refresh Table ]
      │
      ▼
  [ End ]
```

### 8.2 Stock Transaction Flowchart
```
  [ Start ]
      │
      ▼
[ Select Product, Type (RECEIVE/ISSUE), Quantity ]
      │
      ▼
< Quantity > 0 and Product Exists? > ────────────No──► [ Show Error ]
      │
     Yes
      │
      ▼
< Is Transaction Type == 'ISSUE'? > ───────────────
      │                                            │
     Yes                                          No (RECEIVE)
      │                                            │
      ▼                                            ▼
< Quantity > Current Stock? > ───Yes──► [ Error: Insufficient Stock ]
      │                                            │
     No                                            │
      │                                            │
      ▼                                            ▼
[ NewStock = CurrentStock - Qty ]        [ NewStock = CurrentStock + Qty ]
      │                                            │
      └─────────────────────┬──────────────────────┘
                            │
                            ▼
              [ Begin DB Transaction ]
              [ UPDATE products SET quantity = NewStock ]
              [ INSERT INTO stock_transactions ]
              [ Commit DB Transaction ]
                            │
                            ▼
              [ Update Stock Status & UI ]
                            │
                            ▼
                         [ End ]
```

---

## 9. APPLICATION OF SOEN 105 PROGRAMMING CONCEPTS

| # | SOEN 105 Concept | Application in Group 4 Project |
|---|---|---|
| 1 | **Variables & Data Types** | `float` for marks, `int` for quantities, `str` for IDs, `bool` for match flags. |
| 2 | **Arithmetic Operators** | Weighted formula `(c1 * 0.15) + (c2 * 0.15) + (ex * 0.70)`, stock valuation `price * qty`. |
| 3 | **Comparison Operators** | `totalScore >= 70.0`, `quantity < 10`, `qty > previous_stock`. |
| 4 | **Logical Operators** | `0.0 <= c1 <= 100.0`, `if valid and not duplicate:`. |
| 5 | **Input and Output** | UI Entry widgets, message dialogs, Treeview tables, PDF/CSV file I/O. |
| 6 | **Conditional Statements** | `if / elif / else` for grade tier assignment and transaction routing. |
| 7 | **For and While Loops** | `for pass in range(n - 1):` in Bubble Sort, `while low <= high:` in Binary Search. |
| 8 | **Functions with Parameters & Returns** | `calculate_student_grade(cat1, cat2, exam) -> (score, grade, status)`. |
| 9 | **Lists & Dictionaries** | Dictionaries for database rows, lists for sorted collections and audit steps. |
| 10 | **Modular Programming** | Clean separation across `modules/`, `database/`, `interface/`, and `utilities/`. |
| 11 | **Linear Search** | Sequential search through student records by registration number. |
| 12 | **Binary Search** | Divide-and-conquer search on sorted product IDs. |
| 13 | **Bubble Sort** | Adjacent element swapping sorting products in ascending order. |
| 14 | **Input Validation** | Defensive parsing of user strings into bounds-checked floats/ints. |
| 15 | **Exception Handling** | `try / except` blocks catching SQLite constraint violations and type errors. |
| 16 | **Object-Oriented Programming** | `StudentManager`, `InventoryManager`, `TransactionManager` classes encapsulation. |

---

## 10. CONCLUSION
Group 4 Project demonstrates a comprehensive application of software development fundamentals. By combining manual algorithm implementations with enterprise design patterns, persistent relational data integrity, and strict input validation, the system satisfies all SOEN 105 assignment criteria while delivering a production-ready management platform.
