"""
modules/reports.py
Report generation utilities for Academic Performance and Stock Inventory.
Supports PDF reporting via ReportLab and formatted text reports.
"""

import os
from datetime import datetime
from typing import List, Dict, Any

def generate_academic_pdf(students: List[Dict[str, Any]], output_filepath: str) -> str:
    """Generates an academic performance PDF report using ReportLab if installed, or plain text."""
    os.makedirs(os.path.dirname(os.path.abspath(output_filepath)), exist_ok=True)
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        doc = SimpleDocTemplate(output_filepath, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor("#0F172A"),
            spaceAfter=12
        )
        story.append(Paragraph("GROUP 4 PROJECT - ACADEMIC PERFORMANCE REPORT", title_style))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Total Students: {len(students)}", styles['Normal']))
        story.append(Spacer(1, 15))

        table_data = [["Reg Number", "Student Name", "CAT 1 (15%)", "CAT 2 (15%)", "Exam (70%)", "Total", "Grade", "Status"]]
        for s in students:
            table_data.append([
                s.get("registration_number", ""),
                s.get("full_name", ""),
                f"{s.get('cat1', 0):.1f}",
                f"{s.get('cat2', 0):.1f}",
                f"{s.get('examination', 0):.1f}",
                f"{s.get('total_score', 0):.2f}",
                s.get("grade", ""),
                s.get("status", "")
            ])

        t = Table(table_data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ]))
        story.append(t)
        doc.build(story)
        return output_filepath
    except ImportError:
        # Fallback to formatted text summary if reportlab is not installed
        with open(output_filepath, "w", encoding="utf-8") as f:
            f.write(f"GROUP 4 PROJECT - ACADEMIC REPORT\n")
            f.write(f"Generated: {datetime.now()}\n\n")
            for s in students:
                f.write(f"{s.get('registration_number')}: {s.get('full_name')} - Score: {s.get('total_score')} [{s.get('grade')}] ({s.get('status')})\n")
        return output_filepath
