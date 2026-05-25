import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav, ContextBar } from "@/components/top-nav";
import { useState, useMemo } from "react";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/contests")({ component: Contests });

interface ContestData {
  id: string;
  title: string;
  time: string;
  duration: string;
  participants: number;
  status: "upcoming" | "active" | "past";
  registered?: boolean;
}

const mockContests: ContestData[] = [
  {
    id: "1",
    title: "DSA Lab Exam 3",
    time: "Ongoing · Ends 2:30 PM",
    duration: "90 Mins",
    participants: 64,
    status: "active",
  },
  {
    id: "2",
    title: "Algo Sprint IV",
    time: "Ongoing · Ends 6:00 PM",
    duration: "120 Mins",
    participants: 118,
    status: "active",
  },
  {
    id: "3",
    title: "Weekly Practice #19",
    time: "May 28, 6:00 PM",
    duration: "180 Mins",
    participants: 45,
    status: "upcoming",
    registered: false,
  },
  {
    id: "4",
    title: "Placement Mock Test 2",
    time: "May 30, 10:00 AM",
    duration: "180 Mins",
    participants: 240,
    status: "upcoming",
    registered: true,
  },
  {
    id: "5",
    title: "DSA Lab Exam 2",
    time: "Completed May 11",
    duration: "90 Mins",
    participants: 62,
    status: "past",
  },
  {
    id: "6",
    title: "Algo Sprint III",
    time: "Completed Apr 28",
    duration: "120 Mins",
    participants: 134,
    status: "past",
  },
  {
    id: "7",
    title: "Weekly Practice #18",
    time: "Completed Apr 20",
    duration: "180 Mins",
    participants: 86,
    status: "past",
  }
];

function Contests() {
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "past">("active");
  const [contests, setContests] = useState<ContestData[]>(mockContests);

  const toggleRegister = (id: string) => {
    setContests((prev) =>
      prev.map((c) => (c.id === id ? { ...c, registered: !c.registered } : c))
    );
  };

  const filteredContests = useMemo(() => {
    return contests.filter((c) => c.status === activeTab);
  }, [contests, activeTab]);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <TopNav role="student" />
      <ContextBar>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Contests</span>
        </div>
        <div className="flex items-center gap-1">
          {(["active", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1 text-xs font-semibold capitalize cursor-pointer transition-all ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </ContextBar>

      <div className="mx-auto max-w-[1200px] px-6 pt-10">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Contests</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete assessment and practice sprints for your batch.
          </p>
        </div>

        {filteredContests.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((c) => (
              <div
                key={c.id}
                className="group rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {c.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live Now
                      </span>
                    ) : c.status === "upcoming" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Ended
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                      <Clock className="h-3 w-3" /> {c.duration}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-foreground mb-3 truncate">{c.title}</h2>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{c.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{c.participants} students joined</span>
                    </div>
                  </div>
                </div>

                <div>
                  {c.status === "active" && (
                    <Link
                      to="/contest"
                      className="flex items-center justify-center gap-2 rounded-lg bg-success text-success-foreground py-2.5 text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Enter Contest <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {c.status === "upcoming" && (
                    <button
                      onClick={() => toggleRegister(c.id)}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        c.registered
                          ? "bg-secondary text-foreground hover:bg-muted"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {c.registered ? "Registered (Leave)" : "Register"}
                    </button>
                  )}
                  {c.status === "past" && (
                    <Link
                      to="/contest-review"
                      className="flex items-center justify-center gap-2 rounded-lg bg-secondary text-foreground py-2.5 text-xs font-bold hover:bg-muted transition-colors border border-border"
                    >
                      Review Performance
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-sm text-muted-foreground">No contests available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
