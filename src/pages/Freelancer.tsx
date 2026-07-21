import { useState, useEffect, useCallback } from "react";
import logo from "../assets/interquark-wordmark-navy.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { API_BASE } from "../lib/api";
import { useToast } from "../context/ToastContext";
import DashboardHeader from "../components/layout/DashboardHeader";
import MessageThread from "../components/MessageThread";
import ChatWidget from "../components/ChatWidget";

interface Project {
  id: string;
  name: string;
  status: string;
  value?: number;
}

interface Subscription {
  id: string;
  tier: string;
  status: string;
  price: number;
  currentPeriodEnd?: string;
}

interface Payout {
  id: string;
  project: { id: string; name?: string } | null;
  amount: number;
  status: string;
  notes?: string;
  paidAt: string | null;
  createdAt: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

const statusOptions = ["in_progress", "review", "completed", "on_hold"];

const statusColors: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-slate-100 text-slate-500",
};

export default function Freelancer() {
  const { token, user, login, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<PaymentRecord[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const [projectsRes, subRes, payoutsRes] = await Promise.all([
      authedFetch<Project[]>("/projects/mine"),
      authedFetch<Subscription[]>("/subscriptions/mine"),
      authedFetch<Payout[]>("/payouts/mine"),
    ]);
    if (projectsRes.ok && Array.isArray(projectsRes.data)) setProjects(projectsRes.data);
    if (subRes.ok && Array.isArray(subRes.data) && subRes.data.length > 0) {
      const sub = subRes.data[0];
      setSubscription(sub);
      const historyRes = await authedFetch<PaymentRecord[]>(
        `/subscriptions/${sub.id}/billing-history`,
      );
      if (historyRes.ok && Array.isArray(historyRes.data)) setBillingHistory(historyRes.data);
    }
    if (payoutsRes.ok && Array.isArray(payoutsRes.data)) setPayouts(payoutsRes.data);
    setLoading(false);
  }, [authedFetch]);

  async function downloadReceipt(id: string) {
    const res = await fetch(`${API_BASE}/ledger/${id}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      showToast("Could not download receipt.", "error");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  async function handleLogin() {
    if (!email || !password) {
      setNote("Please enter your email and password.");
      return;
    }
    setLoginBusy(true);
    setNote("Signing in...");
    const result = await login(email, password);
    setLoginBusy(false);
    setNote(result.ok ? "" : result.message || "Sign in failed.");
    if (result.ok) showToast("Signed in", "success");
  }

  async function updateStatus(projectId: string, status: string) {
    const { ok } = await authedFetch(`/projects/${projectId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (ok) {
      showToast("Status updated", "success");
      load();
    } else {
      showToast("Could not update status", "error");
    }
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (token && user && user.role !== "freelancer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <h1 className="mb-2 text-xl font-bold text-red-600">Access denied</h1>
          <p className="text-sm text-slate-500">This account does not have freelancer access.</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <img src={logo} alt="Interquark" className="mb-4 h-7 w-auto" />
          <h1 className="mb-1 text-xl font-bold">Freelancer sign in</h1>
          <p className="mb-6 text-sm text-slate-500">Sign in to view your projects and payouts.</p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-signal focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-signal focus:outline-none"
            />
            <button
              onClick={handleLogin}
              disabled={loginBusy}
              className="rounded-lg bg-signal py-2.5 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
            >
              {loginBusy ? "Signing in..." : "Sign in"}
            </button>
            {note && <p className="text-center text-xs text-red-500">{note}</p>}
          </div>
        </div>
      </div>
    );
  }

  const completed = projects.filter((p) => p.status === "completed").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const totalValue = projects.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <DashboardHeader portalName="Freelancer" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="mb-8 text-2xl font-bold">Welcome back, {user.fullName || user.email}</h1>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total projects", value: projects.length },
            { label: "In progress", value: inProgress },
            { label: "Completed", value: completed },
            { label: "Total value", value: `£${totalValue.toLocaleString()}` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subscription / payments card */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Your membership & payments
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : subscription ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <b className="text-sm capitalize">{subscription.tier} plan</b>
                  <p className="text-xs text-slate-400">
                    £{subscription.price}/mo · {subscription.status}
                    {subscription.currentPeriodEnd &&
                      ` · renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-3">No active membership plan found.</p>
              <Link
                to="/subscribe"
                className="inline-block rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
              >
                Choose a plan
              </Link>
            </div>
          )}
        </section>

        {/* Billing history */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Billing history
          </h2>
          {billingHistory.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No payments yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {billingHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div>
                    <b className="text-sm">£{Number(rec.amount).toFixed(2)}</b>
                    <p className="text-xs text-slate-400">
                      {new Date(rec.createdAt).toLocaleDateString()} · {rec.method} · {rec.status}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadReceipt(rec.id)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payouts */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Your payouts
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : payouts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No payouts yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div>
                    <b className="text-sm">£{p.amount.toLocaleString()}</b>
                    <p className="text-xs text-slate-400">
                      {p.project?.name && `${p.project.name} · `}
                      {new Date(p.createdAt).toLocaleDateString()}
                      {p.paidAt && ` · paid ${new Date(p.paidAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      p.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            My projects
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No projects assigned yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <b className="text-sm">{p.name}</b>
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className={`rounded-full border-none px-2.5 py-1 text-[11px] font-semibold ${
                        statusColors[p.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <MessageThread projectId={p.id} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
