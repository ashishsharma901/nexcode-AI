// Database access layer for Cloudflare D1
// In development, we use an in-memory SQLite-like store
// In production, this connects to Cloudflare D1

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: "student" | "teacher" | "admin";
  department_id: number | null;
  roll_number: string | null;
  year: number | null;
  batch: string | null;
  employee_id: string | null;
  is_active: number;
  is_verified: number;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  refresh_token: string;
  device: string | null;
  ip_address: string | null;
  expires_at: string;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  active: number;
  created_at: string;
}

// In-memory store for development (no D1 in local dev without wrangler)
const store = {
  users: [] as User[],
  sessions: [] as Session[],
  departments: [
    { id: 1, name: "Computer Science & Engineering", code: "CSE", active: 1, created_at: new Date().toISOString() },
    { id: 2, name: "Information Technology", code: "IT", active: 1, created_at: new Date().toISOString() },
    { id: 3, name: "Electronics & Communication", code: "ECE", active: 1, created_at: new Date().toISOString() },
    { id: 4, name: "Mechanical Engineering", code: "ME", active: 1, created_at: new Date().toISOString() },
  ] as Department[],
  _nextUserId: 1,
  _nextSessionId: 1,
};

export const db = {
  // Users
  async findUserByEmail(email: string): Promise<User | null> {
    return store.users.find((u) => u.email === email) || null;
  },

  async findUserById(id: number): Promise<User | null> {
    return store.users.find((u) => u.id === id) || null;
  },

  async createUser(data: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      ...data,
      id: store._nextUserId++,
      created_at: now,
      updated_at: now,
    };
    store.users.push(user);
    return user;
  },

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...data, updated_at: new Date().toISOString() };
    return store.users[idx];
  },

  async listUsers(role?: string): Promise<User[]> {
    if (role) return store.users.filter((u) => u.role === role);
    return store.users;
  },

  // Sessions
  async createSession(data: Omit<Session, "id" | "created_at">): Promise<Session> {
    const session: Session = {
      ...data,
      id: store._nextSessionId++,
      created_at: new Date().toISOString(),
    };
    store.sessions.push(session);
    return session;
  },

  async findSessionByToken(token: string): Promise<Session | null> {
    return store.sessions.find((s) => s.refresh_token === token) || null;
  },

  async deleteSession(id: number): Promise<void> {
    store.sessions = store.sessions.filter((s) => s.id !== id);
  },

  async deleteUserSessions(userId: number): Promise<void> {
    store.sessions = store.sessions.filter((s) => s.user_id !== userId);
  },

  async listUserSessions(userId: number): Promise<Session[]> {
    return store.sessions.filter((s) => s.user_id === userId);
  },

  // Departments
  async listDepartments(): Promise<Department[]> {
    return store.departments;
  },

  async findDepartmentByCode(code: string): Promise<Department | null> {
    return store.departments.find((d) => d.code === code) || null;
  },
};
