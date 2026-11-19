-- SOEN 105: GROUP 4 PROJECT
-- Database Schema for SQLite 3

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    cat1 REAL NOT NULL CHECK(cat1 >= 0 AND cat1 <= 100),
    cat2 REAL NOT NULL CHECK(cat2 >= 0 AND cat2 <= 100),
    examination REAL NOT NULL CHECK(examination >= 0 AND examination <= 100),
    total_score REAL NOT NULL,
    grade TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    unit_price REAL NOT NULL CHECK(unit_price >= 0),
    quantity INTEGER NOT NULL CHECK(quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT UNIQUE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('RECEIVE', 'ISSUE', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    previous_stock INTEGER NOT NULL,
    updated_stock INTEGER NOT NULL,
    notes TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
