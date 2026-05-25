import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/top-nav";

export const Route = createFileRoute("/profile")({ component: Profile });

const ratingPoints = [1100, 1140, 1090, 1180, 1220, 1200, 1280, 1310, 1290, 1340];

function Profile() {
  const w = 480, h = 160, pad = 8;
  const min = Math.min(...ratingPoints) - 30;
  const max = Math.max(...ratingPoints) + 30;
  const pts = ratingPoints.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (ratingPoints.length - 1);
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;

  return (
    <div className="min-h-screen">
      <TopNav role="student" />
      <div className="mx-auto max-w-[1000px] px-6 pb-24 pt-16">
        <h1 className="font-serif text-6xl text-foreground">Aarav Mehta</h1>
        <p className="mt-3 text-sm text-muted-foreground">CSE · Batch 2026 · Rating 1340</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">🔥 3-day streak</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">🥉 Top 50 in Section A</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">✦ Knight (1300+)</span>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
          <section>
            <div className="mb-6 text-sm text-foreground">By the numbers</div>
            <div className="space-y-6">
              {[
                { n: "47", l: "problems solved" },
                { n: "#12", l: "best contest rank" },
                { n: "68%", l: "acceptance rate" },
                { n: "9", l: "contests joined" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-4xl text-foreground">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="mb-6 text-sm text-foreground">Rating history</div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
              <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" className="text-border" />
              <path d={area} fill="oklch(0.62 0.15 45 / 0.12)" />
              <path d={path} fill="none" stroke="oklch(0.62 0.15 45)" strokeWidth="1.5" />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill="oklch(0.62 0.15 45)" />
              ))}
            </svg>
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>Jan</span><span>now</span></div>
          </section>
        </div>
        <section className="mt-20">
          <div className="mb-4 text-sm text-foreground">Recent contests</div>
          <div className="divide-y divide-border border-y border-border text-sm">
            <div className="grid grid-cols-[1fr_80px_120px_120px] py-2 text-xs text-muted-foreground">
              <span>Contest</span><span className="text-right">Rank</span><span className="text-right">Solved</span><span className="text-right">Date</span>
            </div>
            {[
              { n: "Weekly Practice #17", r: 12, s: "4/4", d: "May 18" },
              { n: "DSA Lab Exam 2", r: 24, s: "3/4", d: "May 11" },
              { n: "Algo Sprint III", r: 31, s: "5/6", d: "Apr 28" },
              { n: "Weekly Practice #16", r: 18, s: "3/4", d: "Apr 21" },
            ].map((c) => (
              <div key={c.n} className="grid grid-cols-[1fr_80px_120px_120px] py-3">
                <span className="text-foreground">{c.n}</span>
                <span className="text-right font-mono text-foreground">#{c.r}</span>
                <span className="text-right font-mono text-muted-foreground">{c.s}</span>
                <span className="text-right text-muted-foreground">{c.d}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
