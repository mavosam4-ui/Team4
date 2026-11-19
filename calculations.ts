export interface AcademicResult {
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "E";
  status: "PASS" | "FAIL";
}

export function calculateAcademicGrade(cat1: number, cat2: number, exam: number): AcademicResult {
  const c1 = Number(cat1) || 0;
  const c2 = Number(cat2) || 0;
  const ex = Number(exam) || 0;

  // Weightings: CAT 1: 15%, CAT 2: 15%, Final Exam: 70%
  const totalScore = Number((c1 * 0.15 + c2 * 0.15 + ex * 0.7).toFixed(2));

  let grade: "A" | "B" | "C" | "D" | "E" = "E";
  if (totalScore >= 70) {
    grade = "A";
  } else if (totalScore >= 60) {
    grade = "B";
  } else if (totalScore >= 50) {
    grade = "C";
  } else if (totalScore >= 40) {
    grade = "D";
  } else {
    grade = "E";
  }

  const status: "PASS" | "FAIL" = totalScore >= 40 ? "PASS" : "FAIL";

  return { totalScore, grade, status };
}

export function getStockStatus(quantity: number): { status: "NORMAL STOCK" | "LOW STOCK" | "OUT OF STOCK"; color: string } {
  const q = Number(quantity) || 0;
  if (q <= 0) {
    return { status: "OUT OF STOCK", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  }
  if (q < 10) {
    return { status: "LOW STOCK", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
  }
  return { status: "NORMAL STOCK", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
