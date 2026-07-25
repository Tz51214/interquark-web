import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCustomerData } from "../../context/CustomerContext";
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

export default function Overview() {
  const { user } = useAuth();
  const { orders, projects, invoices, loading } = useCustomerData();

  const activeProjects = projects.filter(
    (p) => p.status !== "completed" && p.status !== "cancelled",
  );
  const pendingInvoices = invoices.filter((i) => i.status !== "paid");
  const pendingTotal = pendingInvoices.reduce((sum, i) => sum + Number(i.amount), 0);

  // Real, simple activity feed built from actual data timestamps —
  // no fabricated events.
  const activity = [
    ...invoices
      .filter((i) => i.paidAt)
      .map((i) => ({
        text: `Invoice ${i.invoiceNumber} paid`,
        date: i.paidAt as string,
      })),
    ...orders.map((o) => ({
      text: `Order placed — ${o.items.map((it) => it.name).join(", ")}`,
      date: o.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">
        {timeGreeting()}, {user?.fullName?.split(" ")[0] || user?.email}
      </h1>
      <p className="mb-8 text-sm text-slate-400">Here's what's happening with your projects today.</p>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">
            <AnimatedCounter end={activeProjects.length} />
          </div>
          <p className="text-xs text-slate-400">Active projects</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">{money(pendingTotal)}</div>
          <p className="text-xs text-slate-400">
            {pendingInvoices.length} invoice{pendingInvoices.length === 1 ? "" : "s"} pending
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-2xl font-bold text-signal">
            <AnimatedCounter end={orders.length} />
          </div>
          <p className="text-xs text-slate-400">Total orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active projects */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Active projects
          </h2>
          {activeProjects.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No active projects right now.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <b className="text-sm">{p.name}</b>
                    <span className="text-xs text-slate-400">{p.progress ?? 0}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-signal transition-all"
                      style={{ width: `${p.progress ?? 0}%` }}
                    />
                  </div>
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
              to="/customer/projects"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
            >
              View projects
            </Link>
            <Link
              to="/customer/invoices"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
            >
              View invoices
            </Link>
            <Link
              to="/"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
            >
              + New order
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Recent activity
          </h2>
          {activity.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No activity yet.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <ul className="flex flex-col gap-3">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-mint">✓</span>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">{a.text}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(a.date).toLocaleDateString()}
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
