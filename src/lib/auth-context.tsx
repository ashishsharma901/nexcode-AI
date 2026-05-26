import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrentUser, loginUser, registerUser, logoutUser, refreshAccessToken, initServer } from "@/fn/auth";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  department_id?: number | null;
  roll_number?: string | null;
  year?: number | null;
  employee_id?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: "student" | "teacher";
  departmentCode: string;
  rollNumber?: string;
  year?: number;
  employeeId?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "nexcode_access_token";
const REFRESH_KEY = "nexcode_refresh_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredRefresh(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function storeTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize server (seeds DB) and restore session on mount
  useEffect(() => {
    const restore = async () => {
      try {
        await initServer();

        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const result = await getCurrentUser({ data: { accessToken: token } });
        if (result.success) {
          setUser(result.user as AuthUser);
        } else {
          // Try refresh
          const refreshToken = getStoredRefresh();
          if (refreshToken) {
            const refreshResult = await refreshAccessToken({ data: { refreshToken } });
            if (refreshResult.success && "accessToken" in refreshResult) {
              localStorage.setItem(TOKEN_KEY, refreshResult.accessToken);
              const retryResult = await getCurrentUser({ data: { accessToken: refreshResult.accessToken } });
              if (retryResult.success) {
                setUser(retryResult.user as AuthUser);
              } else {
                clearTokens();
              }
            } else {
              clearTokens();
            }
          } else {
            clearTokens();
          }
        }
      } catch {
        clearTokens();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await loginUser({ data: { email, password } });
      if (result.success && "accessToken" in result && "refreshToken" in result) {
        storeTokens(result.accessToken, result.refreshToken);
        setUser(result.user as AuthUser);
        return true;
      } else if (!result.success && "error" in result) {
        setError(result.error);
        return false;
      }
      return false;
    } catch (e) {
      setError("Login failed. Please try again.");
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    try {
      const result = await registerUser({ data });
      if (result.success && "accessToken" in result && result.accessToken && "refreshToken" in result && result.refreshToken) {
        storeTokens(result.accessToken, result.refreshToken);
        setUser(result.user as AuthUser);
        return { success: true };
      } else if (result.success && "message" in result) {
        return { success: true, message: result.message || "Success" };
      } else if (!result.success && "error" in result) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: false, error: "Unknown error" };
    } catch (e) {
      setError("Registration failed. Please try again.");
      return { success: false, error: "Registration failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefresh();
    if (refreshToken) {
      try {
        await logoutUser({ data: { refreshToken } });
      } catch { /* ignore */ }
    }
    clearTokens();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
