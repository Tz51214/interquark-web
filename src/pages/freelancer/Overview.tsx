import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFreelancerData } from "../../context/FreelancerContext";
import AnimatedCounter from "../../components/AnimatedCounter";

function money(n: number) {
  return "£" + n.toLocaleString();
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-mint",
};

export default function Overview() {
  const { user } = useAuth();
  const { projects, payouts, tasks, loading } = useFreelancerData();

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const tasksDueToday = tasks.filter((t) => t.dueDate && isToday(t.dueDate) && t.status !== "completed");
  const openTasks = tasks.filter((t) => t.status !== "completed");
  const totalEarned = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const pendingPayout = payouts.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount), 0);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">
        {timeGreeting()}, {user?.fullName?.split(" ")[0] || user?.email}
      </h1>
      <p className="mb-8 text-sm text-slate-400">Here's your workload for today.</p>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">
            <AnimatedCounter end={activeProjects.length} />
          </div>
          <p className="text-xs text-slate-400">Active projects</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">
            <AnimatedCounter end={tasksDueToday.length} />
          </div>
          <p className="text-xs text-slate-400">Tasks due today</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">{money(totalEarned)}</div>
          <p className="text-xs text-slate-400">Total earned</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">{money(pendingPayout)}</div>
          <p className="text-xs text-slate-400">Pending payout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's tasks — the biggest widget */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Today's tasks
          </h2>
          {tasksDueToday.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              🎉 No tasks due today. Enjoy the rest of your day.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasksDueToday.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${priorityDot[t.priority]}`} />
                    <div>
                      <b className="text-sm">{t.title}</b>
                      <p className="text-xs text-slate-400">{t.project?.name}</p>
                    </div>
                  </div>
                  <Link
                    to="/freelancer/tasks"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Current projects */}
          <h2 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">
            Current projects
          </h2>
          {activeProjects.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No active projects. You'll be notified when a new one is assigned.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <b className="text-sm">{p.name}</b>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                    {p.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <h2 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">
            Quick actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/freelancer/tasks"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
            >
              View tasks
            </Link>
            <Link
              to="/freelancer/projects"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
            >
              View projects
            </Link>
            <Link
              to="/freelancer/payouts"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
            >
              View payouts
            </Link>
          </div>
        </div>

        {/* Open tasks summary */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Open tasks ({openTasks.length})
          </h2>
          {openTasks.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              You're all caught up.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <ul className="flex flex-col gap-3">
                {openTasks.slice(0, 8).map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-sm">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${priorityDot[t.priority]}`} />
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">{t.title}</p>
                      <p className="text-xs text-slate-400">
                        {t.status.replace("_", " ")}
                        {t.dueDate ? ` · due ${new Date(t.dueDate).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
