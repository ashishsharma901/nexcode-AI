// Seed script - creates default admin user on first server start
import { db } from "./db";
import { hashPassword } from "./auth/password";

let seeded = false;

export async function seedDatabase() {
  if (seeded) return;
  seeded = true;

  // Check if admin exists
  const existingAdmin = await db.findUserByEmail("admin@college.edu");
  if (existingAdmin) return;

  // Create super admin
  const hash = await hashPassword("admin123");
  await db.createUser({
    email: "admin@college.edu",
    password_hash: hash,
    name: "Super Admin",
    role: "admin",
    department_id: null,
    roll_number: null,
    year: null,
    batch: null,
    employee_id: null,
    is_active: 1,
    is_verified: 1,
    approved_by: null,
  });

  // Create a demo teacher (pre-approved)
  const teacherHash = await hashPassword("teacher123");
  await db.createUser({
    email: "dr.rao@college.edu",
    password_hash: teacherHash,
    name: "Dr. Rao",
    role: "teacher",
    department_id: 1, // CSE
    roll_number: null,
    year: null,
    batch: null,
    employee_id: "EMP-1001",
    is_active: 1,
    is_verified: 1,
    approved_by: 1,
  });

  // Create a demo student
  const studentHash = await hashPassword("student123");
  await db.createUser({
    email: "aarav@college.edu",
    password_hash: studentHash,
    name: "Aarav Mehta",
    role: "student",
    department_id: 1, // CSE
    roll_number: "CS26F1023",
    year: 3,
    batch: "2022-2026",
    employee_id: null,
    is_active: 1,
    is_verified: 1,
    approved_by: null,
  });

  console.log("[seed] Database seeded with default users:");
  console.log("  Admin: admin@college.edu / admin123");
  console.log("  Teacher: dr.rao@college.edu / teacher123");
  console.log("  Student: aarav@college.edu / student123");
}
