-- NexCode AI - Database Schema (Cloudflare D1 / SQLite)
-- Phase 1: Authentication & Core Tables

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Users (students, teachers, admins)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  department_id INTEGER REFERENCES departments(id),
  -- Student-specific
  roll_number TEXT,
  year INTEGER,
  batch TEXT,
  -- Teacher-specific
  employee_id TEXT,
  -- Status
  is_active INTEGER NOT NULL DEFAULT 1,
  is_verified INTEGER NOT NULL DEFAULT 0,
  approved_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sessions (refresh tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL UNIQUE,
  device TEXT,
  ip_address TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed default departments
INSERT OR IGNORE INTO departments (name, code) VALUES
  ('Computer Science & Engineering', 'CSE'),
  ('Information Technology', 'IT'),
  ('Electronics & Communication', 'ECE'),
  ('Mechanical Engineering', 'ME');

-- Seed super admin (password: admin123 - hashed with bcrypt)
-- This will be inserted via the seed script, not here
