"""
modules/students.py
Student Academic Performance Data Access and Business Logic.
"""

from typing import List, Dict, Any, Optional
from database.database import get_connection
from utilities.calculations import calculate_student_grade

class StudentManager:
    """Manages student records in the SQLite database."""
    
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    def register_student(
        self,
        reg_no: str,
        name: str,
        cat1: float,
        cat2: float,
        exam: float
    ) -> Dict[str, Any]:
        """Registers a student with automatic calculated weighted score, grade and status."""
        total, grade, status = calculate_student_grade(cat1, cat2, exam)
        conn = get_connection(self.db_path)
        with conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO students (registration_number, full_name, cat1, cat2, examination, total_score, grade, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (reg_no.strip().upper(), name.strip(), cat1, cat2, exam, total, grade, status))
            new_id = cursor.lastrowid
        conn.close()
        return self.get_student_by_id(new_id)

    def get_all_students(self) -> List[Dict[str, Any]]:
        """Returns all students as list of dictionaries."""
        conn = get_connection(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    def get_student_by_id(self, student_id: int) -> Optional[Dict[str, Any]]:
        """Retrieves a single student by primary key ID."""
        conn = get_connection(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    def update_student(
        self,
        student_id: int,
        reg_no: str,
        name: str,
        cat1: float,
        cat2: float,
        exam: float
    ) -> Dict[str, Any]:
        """Updates student marks and recalculates total, grade, status."""
        total, grade, status = calculate_student_grade(cat1, cat2, exam)
        conn = get_connection(self.db_path)
        with conn:
            conn.execute("""
                UPDATE students
                SET registration_number = ?, full_name = ?, cat1 = ?, cat2 = ?, examination = ?,
                    total_score = ?, grade = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (reg_no.strip().upper(), name.strip(), cat1, cat2, exam, total, grade, status, student_id))
        conn.close()
        return self.get_student_by_id(student_id)

    def delete_student(self, student_id: int) -> bool:
        """Deletes a student record permanently."""
        conn = get_connection(self.db_path)
        with conn:
            cursor = conn.execute("DELETE FROM students WHERE id = ?", (student_id,))
            affected = cursor.rowcount
        conn.close()
        return affected > 0
