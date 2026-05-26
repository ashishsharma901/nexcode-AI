import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { verifyToken } from "../auth/jwt";

// ─── Approve Teacher ────────────────────────────────────────────────────────

export const approveTeacher = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; teacherId: number }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload || payload.role !== "admin") return { success: false as const, error: "Unauthorized" };

    const teacher = await db.findUserById(data.teacherId);
    if (!teacher || teacher.role !== "teacher") return { success: false as const, error: "Teacher not found" };

    await db.updateUser(data.teacherId, { is_verified: 1, approved_by: payload.userId });
    return { success: true as const, message: `${teacher.name} approved` };
  });

// ─── Deactivate User ────────────────────────────────────────────────────────

export const deactivateUser = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; userId: number }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload || payload.role !== "admin") return { success: false as const, error: "Unauthorized" };

    await db.updateUser(data.userId, { is_active: 0 });
    await db.deleteUserSessions(data.userId);
    return { success: true as const };
  });

// ─── Reactivate User ────────────────────────────────────────────────────────

export const reactivateUser = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; userId: number }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload || payload.role !== "admin") return { success: false as const, error: "Unauthorized" };

    await db.updateUser(data.userId, { is_active: 1 });
    return { success: true as const };
  });

// ─── List Teachers ──────────────────────────────────────────────────────────

export const listTeachers = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload || payload.role !== "admin") return { success: false as const, error: "Unauthorized" };

    const teachers = await db.listUsers("teacher");
    return {
      success: true as const,
      teachers: teachers.map((t) => ({
        id: t.id, name: t.name, email: t.email, employee_id: t.employee_id,
        department_id: t.department_id, is_active: t.is_active, is_verified: t.is_verified, created_at: t.created_at,
      })),
    };
  });

// ─── List All Users ─────────────────────────────────────────────────────────

export const listAllUsers = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload || payload.role !== "admin") return { success: false as const, error: "Unauthorized" };

    const users = await db.listUsers();
    return {
      success: true as const,
      users: users.map((u) => ({
        id: u.id, name: u.name, email: u.email, role: u.role,
        is_active: u.is_active, is_verified: u.is_verified, created_at: u.created_at,
      })),
    };
  });
