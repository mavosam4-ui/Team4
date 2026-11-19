import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StudentRecord, ProductRecord } from "./algorithms";

export function generateStudentReportCardPDF(student: StudentRecord) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep Navy #0F172A
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GROUP 4 PROJECT", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Student Academic Performance Transcript | SOEN 105", 14, 28);
  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 145, 28);

  // Student Profile Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT PROFILE", 14, 50);

  autoTable(doc, {
    startY: 55,
    theme: "plain",
    head: [["Attribute", "Information"]],
    body: [
      ["Student Full Name", student.fullName],
      ["Registration Number", student.registrationNumber],
      ["Evaluation Framework", "SOEN 105 Software Development Fundamentals"],
      ["Academic Standing", student.status === "PASS" ? "GOOD STANDING (PASSED)" : "ACADEMIC PROBATION (FAILED)"],
    ],
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
    styles: { cellPadding: 3, fontSize: 10 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Grade Breakdown Table
  doc.text("ACADEMIC ASSESSMENT BREAKDOWN", 14, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    theme: "striped",
    head: [["Component", "Weight", "Max Marks", "Score Obtained", "Weighted Contribution"]],
    body: [
      ["Continuous Assessment Test 1 (CAT 1)", "15%", "100", `${student.cat1.toFixed(1)}`, `${(student.cat1 * 0.15).toFixed(2)}%`],
      ["Continuous Assessment Test 2 (CAT 2)", "15%", "100", `${student.cat2.toFixed(1)}`, `${(student.cat2 * 0.15).toFixed(2)}%`],
      ["Final Semester Examination", "70%", "100", `${student.examination.toFixed(1)}`, `${(student.examination * 0.70).toFixed(2)}%`],
      ["FINAL AGGREGATE SCORE", "100%", "100", `${student.totalScore.toFixed(2)}%`, `Grade: ${student.grade} (${student.status})`],
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { cellPadding: 4, fontSize: 10 },
    columnStyles: {
      3: { fontStyle: "bold", halign: "center" },
      4: { fontStyle: "bold", halign: "center" },
    },
  });

  const summaryY = (doc as any).lastAutoTable.finalY + 15;

  // Grading Scale Reference
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Official Grading Reference Key:", 14, summaryY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("A: 70 - 100% (Distinction) | B: 60 - 69.99% (Credit) | C: 50 - 59.99% (Pass) | D: 40 - 49.99% (Pass) | E: < 40% (Fail)", 14, summaryY + 6);
  doc.text("Pass Criteria: Minimum aggregate weighted score of 40.00%. Verified by SOEN 105 Examination Board.", 14, summaryY + 12);

  // Footer
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 270, 196, 270);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Group 4 Project • Automated PDF Transcript Generator", 14, 276);
  doc.text(`Document Ref: NMS-${student.registrationNumber}-${Date.now().toString().slice(-4)}`, 140, 276);

  doc.save(`Student_Report_${student.registrationNumber}.pdf`);
}

export function generateClassPerformancePDF(studentsList: StudentRecord[]) {
  const doc = new jsPDF("landscape");

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 34, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GROUP 4 PROJECT - CLASS PERFORMANCE REPORT", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`SOEN 105 Practical Assignment | Total Enrolled: ${studentsList.length} Students | Generated: ${new Date().toLocaleString()}`, 14, 26);

  // Table
  const tableData = studentsList.map((s, idx) => [
    idx + 1,
    s.registrationNumber,
    s.fullName,
    s.cat1.toFixed(1),
    s.cat2.toFixed(1),
    s.examination.toFixed(1),
    s.totalScore.toFixed(2),
    s.grade,
    s.status,
  ]);

  autoTable(doc, {
    startY: 42,
    head: [["#", "Reg Number", "Full Name", "CAT 1 (15%)", "CAT 2 (15%)", "Exam (70%)", "Total Score", "Grade", "Status"]],
    body: tableData,
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    styles: { cellPadding: 3, fontSize: 9, halign: "center" },
    columnStyles: {
      2: { halign: "left" },
    },
  });

  doc.save(`Class_Performance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function generateInventoryReportPDF(productsList: ProductRecord[]) {
  const doc = new jsPDF();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GROUP 4 PROJECT", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Official Inventory Stock & Valuation Audit | Date: ${new Date().toLocaleString()}`, 14, 27);

  const totalValue = productsList.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);

  const tableData = productsList.map((p) => [
    p.productId,
    p.productName,
    p.category || "General",
    `$${p.unitPrice.toFixed(2)}`,
    p.quantity,
    `$${(p.unitPrice * p.quantity).toFixed(2)}`,
    p.quantity === 0 ? "OUT OF STOCK" : p.quantity < 10 ? "LOW STOCK" : "NORMAL",
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Product ID", "Product Name", "Category", "Unit Price", "Stock Qty", "Stock Value", "Status"]],
    body: tableData,
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    styles: { cellPadding: 3, fontSize: 9, halign: "center" },
    columnStyles: {
      1: { halign: "left" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Products Tracked: ${productsList.length}`, 14, finalY);
  doc.text(`Total Aggregate Inventory Valuation: $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 14, finalY + 6);

  doc.save(`Inventory_Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
