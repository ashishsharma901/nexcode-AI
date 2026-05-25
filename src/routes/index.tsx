import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[55fr_45fr]">
      {/* Illustration panel */}
      <div className="relative hidden overflow-hidden bg-[oklch(0.92_0.04_60)] lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.4" fill="oklch(0.5 0.08 50)" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="800" height="1000" fill="url(#grain)" />
          <circle cx="180" cy="220" r="160" fill="oklch(0.62 0.15 45)" opacity="0.85" />
          <rect x="380" y="120" width="280" height="280" fill="oklch(0.88 0.06 70)" />
          <circle cx="620" cy="680" r="220" fill="oklch(0.55 0.12 40)" opacity="0.7" />
          <rect x="80" y="560" width="320" height="160" fill="oklch(0.78 0.08 65)" />
          <line x1="0" y1="800" x2="800" y2="780" stroke="oklch(0.3 0.05 50)" strokeWidth="1" opacity="0.3" />
          <text x="60" y="940" className="font-serif" fontFamily="Instrument Serif" fontSize="48" fill="oklch(0.25 0.05 50)" opacity="0.6">
            est. on campus
          </text>
        </svg>
        <div className="absolute bottom-8 left-8 font-serif text-sm italic text-[oklch(0.3_0.05_50)]/70">
          a quiet place to think in code.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <div className="font-serif text-xl text-foreground">codelab</div>
            <div className="mt-1 text-xs text-muted-foreground">your college's coding home</div>
          </div>
          <h1 className="font-serif text-5xl leading-tight text-foreground">Welcome back.</h1>
          <p className="mt-3 text-sm text-muted-foreground">Sign in with your student or faculty account.</p>

          <form className="mt-10 space-y-6">
            <div>
              <label className="block text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                defaultValue="aarav@college.edu"
                className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground">Password</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
            <Link
              to="/dashboard"
              className="block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90"
            >
              Sign in
            </Link>
            <div className="text-center">
              <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                or continue with Google
              </button>
            </div>
          </form>

          <div className="mt-16 flex items-center justify-between text-xs text-muted-foreground">
            <span>© codelab</span>
            <Link to="/teacher" className="hover:text-foreground">Faculty sign in →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
