import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  doublePrecision,
  integer,
  boolean,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("USER").notNull(), // ADMIN, FACULTY, USER
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    tokenHash: text("token_hash").notNull().unique(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rememberMe: boolean("remember_me").default(false).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    registrationNumber: text("registration_number").notNull().unique(),
    fullName: text("full_name").notNull(),
    cat1: doublePrecision("cat1").notNull(),
    cat2: doublePrecision("cat2").notNull(),
    examination: doublePrecision("examination").notNull(),
    totalScore: doublePrecision("total_score").notNull(),
    grade: text("grade").notNull(), // A, B, C, D, E
    status: text("status").notNull(), // PASS, FAIL
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("students_cat1_range", sql`${table.cat1} >= 0 AND ${table.cat1} <= 100`),
    check("students_cat2_range", sql`${table.cat2} >= 0 AND ${table.cat2} <= 100`),
    check("students_exam_range", sql`${table.examination} >= 0 AND ${table.examination} <= 100`),
    check("students_grade_valid", sql`${table.grade} IN ('A', 'B', 'C', 'D', 'E')`),
    check("students_status_valid", sql`${table.status} IN ('PASS', 'FAIL')`),
    index("students_status_idx").on(table.status),
  ]
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    productId: text("product_id").notNull().unique(),
    productName: text("product_name").notNull(),
    category: text("category").default("General").notNull(),
    unitPrice: doublePrecision("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("products_unit_price_non_negative", sql`${table.unitPrice} >= 0`),
    check("products_quantity_non_negative", sql`${table.quantity} >= 0`),
    index("products_category_idx").on(table.category),
  ]
);

export const stockTransactions = pgTable(
  "stock_transactions",
  {
    id: serial("id").primaryKey(),
    transactionId: text("transaction_id").notNull().unique(),
    productId: text("product_id")
      .notNull()
      .references(() => products.productId, { onUpdate: "cascade", onDelete: "cascade" }),
    productName: text("product_name").notNull(),
    transactionType: text("transaction_type").notNull(), // RECEIVE, ISSUE, ADJUSTMENT
    quantity: integer("quantity").notNull(),
    previousStock: integer("previous_stock").notNull(),
    updatedStock: integer("updated_stock").notNull(),
    notes: text("notes"),
    performedBy: integer("performed_by").references(() => users.id, { onDelete: "set null" }),
    transactionDate: timestamp("transaction_date", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "stock_tx_type_valid",
      sql`${table.transactionType} IN ('RECEIVE', 'ISSUE', 'ADJUSTMENT')`
    ),
    check("stock_tx_quantity_positive", sql`${table.quantity} > 0`),
    check("stock_tx_prev_non_negative", sql`${table.previousStock} >= 0`),
    check("stock_tx_updated_non_negative", sql`${table.updatedStock} >= 0`),
    index("stock_tx_product_id_idx").on(table.productId),
    index("stock_tx_date_idx").on(table.transactionDate),
  ]
);

export const systemLogs = pgTable(
  "system_logs",
  {
    id: serial("id").primaryKey(),
    action: text("action").notNull(),
    module: text("module").notNull(),
    details: text("details").notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("system_logs_module_idx").on(table.module)]
);

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
