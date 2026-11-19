import { StudentRecord, ProductRecord } from "./algorithms";

export function exportStudentsToCSV(students: StudentRecord[], filename = "students_export.csv") {
  const headers = ["ID", "Registration Number", "Full Name", "CAT 1 (15%)", "CAT 2 (15%)", "Exam (70%)", "Total Score", "Grade", "Status"];
  const rows = students.map((s) => [
    s.id,
    `"${s.registrationNumber}"`,
    `"${s.fullName.replace(/"/g, '""')}"`,
    s.cat1,
    s.cat2,
    s.examination,
    s.totalScore,
    s.grade,
    s.status,
  ]);

  const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  downloadBlob(csvContent, filename, "text/csv;charset=utf-8;");
}

export function exportInventoryToCSV(products: ProductRecord[], filename = "inventory_export.csv") {
  const headers = ["ID", "Product ID", "Product Name", "Category", "Unit Price", "Quantity", "Total Stock Value", "Stock Status"];
  const rows = products.map((p) => {
    const val = (p.unitPrice * p.quantity).toFixed(2);
    const status = p.quantity === 0 ? "OUT OF STOCK" : p.quantity < 10 ? "LOW STOCK" : "NORMAL STOCK";
    return [
      p.id,
      `"${p.productId}"`,
      `"${p.productName.replace(/"/g, '""')}"`,
      `"${p.category || 'General'}"`,
      p.unitPrice.toFixed(2),
      p.quantity,
      val,
      status,
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  downloadBlob(csvContent, filename, "text/csv;charset=utf-8;");
}

function downloadBlob(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
