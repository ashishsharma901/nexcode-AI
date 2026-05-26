import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { hashPassword, verifyPassword } from "../auth/password";
import { createAccessToken, createRefreshToken, verifyToken, type TokenPayload } from "../auth/jwt";

// ─── Register ───────────────────────────────────────────────────────────────

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: "student" | "teacher";
  departmentCode: string;
  rollNumber?: string;
  year?: number;
  employeeId?: string;
}

export const registerUser = createServerFn({ method: "POST" })
  .inputValidator((d: RegisterInput) => d)
  .handler(async ({ data }) => {
    const existing = await db.findUserByEmail(data.email);
    if (existing) return { success: false as const, error: "Email already registered" };

    const dept = await db.findDepartmentByCode(data.departmentCode);
    if (!dept) return { success: false as const, error: "Invalid department" };

    const passwordHash = await hashPassword(data.password);
    const user = await db.createUser({
      email: data.email, password_hash: passwordHash, name: data.name, role: data.role,
      department_id: dept.id, roll_number: data.rollNumber || null, year: data.year || null,
      batch: null, employee_id: data.employeeId || null, is_active: 1,
      is_verified: data.role === "student" ? 1 : 0, approved_by: null,
    });

    if (data.role === "student") {
      const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role, name: user.name };
      const accessToken = await createAccessToken(payload);
      const refreshToken = await createRefreshToken(payload);
      await db.createSession({ user_id: user.id, refresh_token: refreshToken, device: null, ip_address: null, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
      return { success: true as const, user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
    }

    return { success: true as const, user: { id: user.id, email: user.email, name: user.name, role: user.role }, message: "Awaiting admin approval." };
  });

// ─── Login ──────────────────────────────────────────────────────────────────

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const user = await db.findUserByEmail(data.email);
    if (!user) return { success: false as const, error: "Invalid email or password" };

    const valid = await verifyPassword(data.password, user.password_hash);
    if (!valid) return { success: false as const, error: "Invalid email or password" };
    if (!user.is_active) return { success: false as const, error: "Account deactivated" };
    if (user.role === "teacher" && !user.is_verified) return { success: false as const, error: "Pending admin approval" };

    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);
    await db.createSession({ user_id: user.id, refresh_token: refreshToken, device: null, ip_address: null, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });

    return { success: true as const, user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
  });

// ─── Refresh Token ──────────────────────────────────────────────────────────

export const refreshAccessToken = createServerFn({ method: "POST" })
  .inputValidator((d: { refreshToken: string }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.refreshToken);
    if (!payload) return { success: false as const, error: "Invalid refresh token" };

    const session = await db.findSessionByToken(data.refreshToken);
    if (!session) return { success: false as const, error: "Session not found" };
    if (new Date(session.expires_at) < new Date()) {
      await db.deleteSession(session.id);
      return { success: false as const, error: "Session expired" };
    }

    const newAccessToken = await createAccessToken(payload);
    return { success: true as const, accessToken: newAccessToken };
  });

// ─── Get Current User ───────────────────────────────────────────────────────

export const getCurrentUser = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload) return { success: false as const, error: "Invalid token" };

    const user = await db.findUserById(payload.userId);
    if (!user) return { success: false as const, error: "User not found" };

    return {
      success: true as const,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, department_id: user.department_id, roll_number: user.roll_number, year: user.year, employee_id: user.employee_id, is_verified: user.is_verified, created_at: user.created_at },
    };
  });

// ─── Logout ─────────────────────────────────────────────────────────────────

export const logoutUser = createServerFn({ method: "POST" })
  .inputValidator((d: { refreshToken: string }) => d)
  .handler(async ({ data }) => {
    const session = await db.findSessionByToken(data.refreshToken);
    if (session) await db.deleteSession(session.id);
    return { success: true as const };
  });

// ─── List Sessions ──────────────────────────────────────────────────────────

export const listSessions = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload) return { success: false as const, error: "Invalid token" };
    const sessions = await db.listUserSessions(payload.userId);
    return { success: true as const, sessions };
  });

// ─── Revoke Session ─────────────────────────────────────────────────────────

export const revokeSession = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string; sessionId: number }) => d)
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.accessToken);
    if (!payload) return { success: false as const, error: "Invalid token" };
    await db.deleteSession(data.sessionId);
    return { success: true as const };
  });
