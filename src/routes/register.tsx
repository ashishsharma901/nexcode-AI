import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    employeeId: "",
    department: "Computer Science",
    year: "1",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[55fr_45fr]">
      {/* Illustration panel (similar layout/color but different design) */}
      <div className="relative hidden overflow-hidden bg-[oklch(0.94_0.03_200)] lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(0.5 0.05 200)" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="800" height="1000" fill="url(#grid-pattern)" />
          <circle cx="600" cy="300" r="280" fill="oklch(0.68 0.12 210)" opacity="0.45" />
          <rect x="120" y="450" width="300" height="300" rx="40" fill="oklch(0.85 0.08 190)" opacity="0.7" />
          <circle cx="200" cy="180" r="100" fill="oklch(0.76 0.10 205)" />
          <text x="60" y="920" className="font-serif" fontFamily="Instrument Serif" fontSize="42" fill="oklch(0.3 0.05 200)" opacity="0.6">
            build your portfolio.
          </text>
        </svg>
        <div className="absolute bottom-8 left-8 font-serif text-sm italic text-[oklch(0.3_0.05_200)]/70">
          join your campus terminal.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-8">
            <Link to="/" className="font-serif text-xl text-foreground inline-block">
              nexcode-ai
            </Link>
            <div className="mt-1 text-xs text-muted-foreground">create your campus portal account</div>
          </div>

          {success ? (
            <div className="space-y-6 text-center py-10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-center">
                <CheckCircle2 className="h-14 w-14 text-success" />
              </div>
              <h2 className="font-serif text-3xl text-foreground">
                {role === "student" ? "Registration Complete" : "Registration Received"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {role === "student"
                  ? "Welcome to NexCode AI. Your account is ready. You can now log in."
                  : "Teacher accounts require verification. Our admin staff will review your credentials shortly and email approval confirmation."}
              </p>
              <div className="pt-4">
                <Link
                  to="/"
                  className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-4xl text-foreground tracking-tight">Get started.</h1>
              <p className="mt-2 text-sm text-muted-foreground">Select your campus role and enter your details.</p>

              {/* Role Toggle Tabs */}
              <div className="mt-6 flex border-b border-border">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 pb-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                    role === "student" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 pb-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                    role === "teacher" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Faculty / Instructor
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="block text-xs text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </div>

                {role === "student" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground">University Email</label>
                        <input
                          type="email"
                          required
                          placeholder="jane.doe@college.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Roll Number</label>
                        <input
                          type="text"
                          required
                          placeholder="CS26F1023"
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground">Department</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary cursor-pointer"
                        >
                          <option className="bg-popover text-foreground" value="Computer Science">CSE</option>
                          <option className="bg-popover text-foreground" value="Information Tech">IT</option>
                          <option className="bg-popover text-foreground" value="Electrical Eng">ECE</option>
                          <option className="bg-popover text-foreground" value="Mechanical Eng">ME</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Current Year</label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary cursor-pointer"
                        >
                          <option className="bg-popover text-foreground" value="1">1st Year</option>
                          <option className="bg-popover text-foreground" value="2">2nd Year</option>
                          <option className="bg-popover text-foreground" value="3">3rd Year</option>
                          <option className="bg-popover text-foreground" value="4">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground">Faculty Email</label>
                        <input
                          type="email"
                          required
                          placeholder="dr.jane@college.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">Employee ID</label>
                        <input
                          type="text"
                          required
                          placeholder="EMP-8392"
                          value={formData.employeeId}
                          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                          className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary cursor-pointer"
                      >
                        <option className="bg-popover text-foreground" value="Computer Science">Computer Science & Engineering</option>
                        <option className="bg-popover text-foreground" value="Information Technology">Information Technology</option>
                        <option className="bg-popover text-foreground" value="Electrical Engineering">Electronics & Comm Engineering</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs text-muted-foreground">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </div>

                {role === "teacher" && (
                  <div className="rounded-lg bg-warning/5 border border-warning/20 p-3 text-[11px] text-warning leading-normal">
                    Teacher registration requests are routed to Super Admins. Access will be granted after credential verification.
                  </div>
                )}

                <button
                  type="submit"
                  className="block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer pt-3"
                >
                  Create account
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
