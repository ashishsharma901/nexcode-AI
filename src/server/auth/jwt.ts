import { SignJWT, jwtVerify } from "jose";

// In production, use an environment variable
const JWT_SECRET = new TextEncoder().encode("nexcode-ai-secret-key-change-in-production");

export interface TokenPayload {
  userId: number;
  email: string;
  role: "student" | "teacher" | "admin";
  name: string;
}

// Access token: short-lived (15 minutes)
export async function createAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

// Refresh token: long-lived (30 days)
export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

// Verify any token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
