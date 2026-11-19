import { db } from "./index";
import { students, products, stockTransactions, systemLogs } from "./schema";

export async function seedInitialData() {
  const existingStudents = await db.select().from(students).limit(1);
  if (existingStudents.length > 0) {
    return; // Already seeded
  }

  // Initial Students
  const initialStudents = [
    {
      registrationNumber: "BCS-001-2025",
      fullName: "Alex Rivera",
      cat1: 85,
      cat2: 78,
      examination: 82,
      totalScore: Number((85 * 0.15 + 78 * 0.15 + 82 * 0.7).toFixed(2)), // 81.85 -> A
      grade: "A",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-002-2025",
      fullName: "Brenda Wanjiku",
      cat1: 72,
      cat2: 68,
      examination: 74,
      totalScore: Number((72 * 0.15 + 68 * 0.15 + 74 * 0.7).toFixed(2)), // 72.80 -> A
      grade: "A",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-003-2025",
      fullName: "Christopher Nolan",
      cat1: 58,
      cat2: 64,
      examination: 62,
      totalScore: Number((58 * 0.15 + 64 * 0.15 + 62 * 0.7).toFixed(2)), // 61.70 -> B
      grade: "B",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-004-2025",
      fullName: "Diana Chen",
      cat1: 50,
      cat2: 55,
      examination: 52,
      totalScore: Number((50 * 0.15 + 55 * 0.15 + 52 * 0.7).toFixed(2)), // 52.15 -> C
      grade: "C",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-005-2025",
      fullName: "Emmanuel Ochieng",
      cat1: 42,
      cat2: 46,
      examination: 44,
      totalScore: Number((42 * 0.15 + 46 * 0.15 + 44 * 0.7).toFixed(2)), // 44.00 -> D
      grade: "D",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-006-2025",
      fullName: "Fatima Al-Mansoor",
      cat1: 30,
      cat2: 35,
      examination: 38,
      totalScore: Number((30 * 0.15 + 35 * 0.15 + 38 * 0.7).toFixed(2)), // 36.35 -> E
      grade: "E",
      status: "FAIL",
    },
    {
      registrationNumber: "BCS-007-2025",
      fullName: "George Mwangi",
      cat1: 90,
      cat2: 92,
      examination: 88,
      totalScore: Number((90 * 0.15 + 92 * 0.15 + 88 * 0.7).toFixed(2)), // 88.90 -> A
      grade: "A",
      status: "PASS",
    },
    {
      registrationNumber: "BCS-008-2025",
      fullName: "Hannah Kim",
      cat1: 65,
      cat2: 60,
      examination: 68,
      totalScore: Number((65 * 0.15 + 60 * 0.15 + 68 * 0.7).toFixed(2)), // 66.35 -> B
      grade: "B",
      status: "PASS",
    },
  ];

  await db.insert(students).values(initialStudents);

  // Initial Products
  const initialProducts = [
    {
      productId: "PRD-101",
      productName: "Dell UltraSharp 27-inch Monitor",
      category: "Hardware",
      unitPrice: 349.99,
      quantity: 18,
    },
    {
      productId: "PRD-102",
      productName: "Logitech MX Master 3S Mouse",
      category: "Peripherals",
      unitPrice: 99.5,
      quantity: 25,
    },
    {
      productId: "PRD-103",
      productName: "Keychron K2 Mechanical Keyboard",
      category: "Peripherals",
      unitPrice: 85.0,
      quantity: 7, // LOW STOCK (<10)
    },
    {
      productId: "PRD-104",
      productName: "SanDisk 1TB NVMe Extreme SSD",
      category: "Storage",
      unitPrice: 129.99,
      quantity: 4, // LOW STOCK (<10)
    },
    {
      productId: "PRD-105",
      productName: "Sony WH-1000XM5 Headphones",
      category: "Audio",
      unitPrice: 399.0,
      quantity: 12,
    },
    {
      productId: "PRD-106",
      productName: "Anker 65W GaN Fast Charger",
      category: "Accessories",
      unitPrice: 39.99,
      quantity: 0, // OUT OF STOCK (=0)
    },
    {
      productId: "PRD-107",
      productName: "HP LaserJet Pro Enterprise Printer",
      category: "Office",
      unitPrice: 549.0,
      quantity: 5, // LOW STOCK (<10)
    },
    {
      productId: "PRD-108",
      productName: "Cat-6 High-Speed Ethernet Cable 15m",
      category: "Networking",
      unitPrice: 14.5,
      quantity: 42,
    },
  ];

  await db.insert(products).values(initialProducts);

  // Initial Stock Transactions
  const initialTransactions = [
    {
      transactionId: "TXN-2025-001",
      productId: "PRD-101",
      productName: "Dell UltraSharp 27-inch Monitor",
      transactionType: "RECEIVE",
      quantity: 20,
      previousStock: 0,
      updatedStock: 20,
      notes: "Initial inventory shipment batch #A1",
    },
    {
      transactionId: "TXN-2025-002",
      productId: "PRD-101",
      productName: "Dell UltraSharp 27-inch Monitor",
      transactionType: "ISSUE",
      quantity: 2,
      previousStock: 20,
      updatedStock: 18,
      notes: "Issued to Computer Science Lab 3",
    },
    {
      transactionId: "TXN-2025-003",
      productId: "PRD-103",
      productName: "Keychron K2 Mechanical Keyboard",
      transactionType: "ISSUE",
      quantity: 5,
      previousStock: 12,
      updatedStock: 7,
      notes: "Sold to Department of Engineering",
    },
    {
      transactionId: "TXN-2025-004",
      productId: "PRD-106",
      productName: "Anker 65W GaN Fast Charger",
      transactionType: "ISSUE",
      quantity: 15,
      previousStock: 15,
      updatedStock: 0,
      notes: "Bulk issuance to Faculty staff - Stock Depleted",
    },
  ];

  await db.insert(stockTransactions).values(initialTransactions);

  // Initial System Logs
  await db.insert(systemLogs).values([
    {
      action: "SYSTEM_INITIALIZED",
      module: "CORE",
      details: "Group 4 Project initialized with default SOEN 105 dataset.",
    },
  ]);
}
