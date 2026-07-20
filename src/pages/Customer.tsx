import { useState, useEffect, useCallback } from "react";
import logo from "../assets/interquark-wordmark-navy.png";
import { useAuth } from "../context/AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { useToast } from "../context/ToastContext";
import { apiFetch } from "../lib/api";
import DashboardHeader from "../components/layout/DashboardHeader";
import MessageThread from "../components/MessageThread";
import ChatWidget from "../components/ChatWidget";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  items: { name: string; tier: string; price: number }[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress?: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

function money(n: number) {
  return "£" + n.toLocaleString();
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Customer() {
  const { token, user, login, ready, setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [impersonating, setImpersonating] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();

  // Handles admin "Login as customer" links: /customer?impersonate=<code>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("impersonate");
    if (!code) return;

    setImpersonating(true);
    apiFetch<{ accessToken?: string; user?: typeof user; message?: string }>(
      "/auth/impersonate/redeem",
      { method: "POST", body: JSON.stringify({ code }) },
    ).then(({ ok, data }) => {
      if (ok && data.accessToken && data.user) {
        setSession(data.accessToken, data.user);
        showToast("Signed in as customer", "success");
      } else {
        showToast(data.message || "This login link has expired.", "error");
      }
      // Strip the code from the URL either way — it's single-use.
      window.history.replaceState({}, "", "/customer");
      setImpersonating(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [ordersRes, projectsRes, invoicesRes] = await Promise.all([
      authedFetch<Order[]>("/orders/mine"),
      authedFetch<Project[]>("/projects/mine"),
      authedFetch<Invoice[]>("/invoices/mine"),
    ]);
    if (ordersRes.ok && Array.isArray(ordersRes.data)) setOrders(ordersRes.data);
    if (projectsRes.ok && Array.isArray(projectsRes.data)) setProjects(projectsRes.data);
    if (invoicesRes.ok && Array.isArray(invoicesRes.data)) setInvoices(invoicesRes.data);
    setLoading(false);
  }, [authedFetch]);

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

  if (!ready || impersonating) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (token && user && user.role !== "client") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <h1 className="mb-2 text-xl font-bold text-red-600">Access denied</h1>
          <p className="text-sm text-slate-500">This account does not have customer access.</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
        <img src={logo} alt="Interquark" className="h-7 w-auto" />
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-bold">Customer sign in</h1>
          <p className="mb-6 text-sm text-slate-500">Sign in to view your orders and projects.</p>
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <DashboardHeader portalName="Customer" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="mb-8 text-2xl font-bold">Welcome back, {user.fullName || user.email}</h1>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Your orders
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No orders yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        statusColors[o.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {o.status.replace("_", " ")}
                    </span>
                  </div>
                  {o.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 text-sm">
                      <span>
                        {item.name} <span className="text-slate-400">({item.tier})</span>
                      </span>
                      <span className="font-mono font-semibold text-signal">
                        {money(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Your invoices
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : invoices.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No invoices yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div>
                    <b className="text-sm">{inv.invoiceNumber}</b>
                    <p className="text-xs text-slate-400">
                      {new Date(inv.createdAt).toLocaleDateString()} · {money(inv.amount)}
                      {inv.dueAt && inv.status !== "paid"
                        ? ` · due ${new Date(inv.dueAt).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      statusColors[inv.status] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Your projects
          </h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              No active projects yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <b className="text-sm">{p.name}</b>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        statusColors[p.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                  {typeof p.progress === "number" && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-signal"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  )}
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
