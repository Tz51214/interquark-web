import { useState, useEffect, useCallback, useMemo } from "react";
import logo from "../assets/interquark-wordmark-navy.png";
import { useAuth } from "../context/AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { API_BASE } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { useTableControls } from "../lib/useTableControls";
import { exportToCsv } from "../lib/csv";
import DashboardHeader from "../components/layout/DashboardHeader";
import ChatWidget from "../components/ChatWidget";
import Toolbar from "../components/admin/Toolbar";
import Pagination from "../components/admin/Pagination";
import RevenueChart from "../components/admin/RevenueChart";
import LineChart from "../components/admin/LineChart";
import PieChart from "../components/admin/PieChart";

interface Project {
  id: string;
  name: string;
  status: string;
  freelancerId?: string;
  freelancerName?: string;
}

interface Payout {
  id: string;
  freelancer: { id: string; fullName: string; email: string };
  project: { id: string; name?: string } | null;
  amount: number;
  status: string;
  notes?: string;
  paidAt: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  freelancer?: { id?: string; fullName?: string; email?: string };
  tier: string;
  status: string;
  price: number;
  createdAt: string;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
  discountCode?: string | null;
  discountPercent?: number | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
}

interface BillingHistoryEntry {
  id: string;
  amount: number;
  method: string;
  status: string;
  txnType: string;
  notes?: string;
  createdAt: string;
}

interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tier?: string;
  lastActiveAt?: string | null;
  verificationStatus?: string;
}

interface LoginAsLog {
  id: string;
  admin: { fullName?: string; email?: string };
  customer: { fullName?: string; email?: string };
  createdAt: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  total?: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer?: { fullName?: string; email?: string };
  amount: number;
  status: string;
  createdAt: string;
  dueAt?: string | null;
}

interface CreditMemo {
  id: string;
  creditMemoNumber: string;
  customer?: { fullName?: string; email?: string };
  order?: { id: string };
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  user?: { fullName?: string; email?: string };
  order?: { id: string };
  amount: number;
  method: string;
  status: string;
  txnType: string;
  createdAt: string;
}

const tabs = [
  "Overview",
  "Revenue",
  "Customer Activity",
  "Sales",
  "Customers",
  "Projects",
  "Subscriptions",
  "Freelancers",
  "Payouts",
] as const;
type Tab = (typeof tabs)[number];

const salesSubTabs = ["Orders", "Invoices", "Credit Memos", "Transactions"] as const;
type SalesSubTab = (typeof salesSubTabs)[number];

const customersSubTabs = ["All Customers", "Now Online", "Login as Customer Log"] as const;
type CustomersSubTab = (typeof customersSubTabs)[number];

const projectStatusOptions = [
  { value: "in_progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On hold" },
];

const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Matches the plan copy from the "Join as freelancer" modal on the
// storefront, so the admin sees the same descriptions customers do.
const TIER_INFO: Record<string, { label: string; description: string }> = {
  associate: {
    label: "Associate",
    description: "Shadow one active project, chat access",
  },
  core: {
    label: "Core contributor",
    description: "Assigned tasks on 1-2 projects, priority pick",
  },
  lead: {
    label: "Lead collaborator",
    description: "Co-own a project, client-facing, revenue share",
  },
};

function tierInfo(tier: string) {
  return TIER_INFO[tier] || { label: tier, description: "" };
}

function money(n: number) {
  return "£" + n.toLocaleString();
}

export default function Admin() {
  const { token, user, login, ready } = useAuth();

  async function downloadInvoice(id: string, invoiceNumber: string) {
    const res = await fetch(`${API_BASE}/invoices/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const [salesSubTab, setSalesSubTab] = useState<SalesSubTab>("Orders");
  const [customersSubTab, setCustomersSubTab] = useState<CustomersSubTab>("All Customers");

  const [projects, setProjects] = useState<Project[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [newPayout, setNewPayout] = useState({ freelancerId: "", projectId: "", amount: "", notes: "" });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [allUsers, setAllUsers] = useState<PlatformUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<PlatformUser[]>([]);
  const [loginAsLogs, setLoginAsLogs] = useState<LoginAsLog[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditMemos, setCreditMemos] = useState<CreditMemo[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [newFreelancer, setNewFreelancer] = useState({ name: "", email: "", password: "", tier: "core" });

  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const [projectsRes, subsRes, usersRes, onlineRes, logsRes, ordersRes, invoicesRes, creditMemosRes, transactionsRes, payoutsRes] = await Promise.all([
      authedFetch<Project[]>("/projects"),
      authedFetch<Subscription[]>("/subscriptions"),
      authedFetch<PlatformUser[]>("/users"),
      authedFetch<PlatformUser[]>("/users/online"),
      authedFetch<LoginAsLog[]>("/auth/login-as/logs"),
      authedFetch<Order[]>("/orders/all"),
      authedFetch<Invoice[]>("/invoices"),
      authedFetch<CreditMemo[]>("/credit-memos"),
      authedFetch<Transaction[]>("/ledger/transactions"),
      authedFetch<Payout[]>("/payouts"),
    ]);
    if (projectsRes.ok && Array.isArray(projectsRes.data)) setProjects(projectsRes.data);
    if (payoutsRes.ok && Array.isArray(payoutsRes.data)) setPayouts(payoutsRes.data);
    if (subsRes.ok && Array.isArray(subsRes.data)) setSubscriptions(subsRes.data);
    if (usersRes.ok && Array.isArray(usersRes.data)) setAllUsers(usersRes.data);
    if (onlineRes.ok && Array.isArray(onlineRes.data)) setOnlineUsers(onlineRes.data);
    if (logsRes.ok && Array.isArray(logsRes.data)) setLoginAsLogs(logsRes.data);
    if (ordersRes.ok && Array.isArray(ordersRes.data)) setOrders(ordersRes.data);
    if (invoicesRes.ok && Array.isArray(invoicesRes.data)) setInvoices(invoicesRes.data);
    if (creditMemosRes.ok && Array.isArray(creditMemosRes.data)) setCreditMemos(creditMemosRes.data);
    if (transactionsRes.ok && Array.isArray(transactionsRes.data)) setTransactions(transactionsRes.data);
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

  async function updateProjectStatus(id: string, status: string) {
    const { ok } = await authedFetch(`/projects/${id}/status`, {
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

  async function assignFreelancer(projectId: string, freelancerId: string) {
    const { ok } = await authedFetch(`/projects/${projectId}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ freelancerId }),
    });
    if (ok) {
      showToast("Freelancer assigned", "success");
      load();
    } else {
      showToast("Could not assign freelancer", "error");
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const { ok } = await authedFetch(`/projects/${id}`, { method: "DELETE" });
    if (ok) {
      showToast("Project deleted", "success");
      load();
    } else {
      showToast("Could not delete project", "error");
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    const { ok } = await authedFetch(`/orders/${id}`, { method: "DELETE" });
    if (ok) {
      showToast("Order deleted", "success");
      load();
    } else {
      showToast("Could not delete order", "error");
    }
  }

  async function createPayout() {
    if (!newPayout.freelancerId || !newPayout.amount) {
      showToast("Please select a freelancer and enter an amount", "error");
      return;
    }
    const { ok } = await authedFetch("/payouts", {
      method: "POST",
      body: JSON.stringify({
        freelancerId: newPayout.freelancerId,
        projectId: newPayout.projectId || undefined,
        amount: Number(newPayout.amount),
        notes: newPayout.notes || undefined,
      }),
    });
    if (ok) {
      showToast("Payout created", "success");
      setNewPayout({ freelancerId: "", projectId: "", amount: "", notes: "" });
      load();
    } else {
      showToast("Could not create payout", "error");
    }
  }

  async function markPayoutPaid(id: string) {
    const { ok } = await authedFetch(`/payouts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid" }),
    });
    if (ok) {
      showToast("Payout marked as paid", "success");
      load();
    } else {
      showToast("Could not update payout", "error");
    }
  }

  async function refundOrder(id: string) {
    const reason = prompt("Reason for this refund:");
    if (reason === null) return;
    const { ok } = await authedFetch(`/orders/${id}/refund`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "Refunded by admin" }),
    });
    if (ok) {
      showToast("Order refunded", "success");
      load();
    } else {
      showToast("Could not refund order", "error");
    }
  }

  async function deleteFreelancer(id: string) {
    if (!confirm("Remove this freelancer?")) return;
    const { ok } = await authedFetch(`/users/${id}`, { method: "DELETE" });
    if (ok) {
      showToast("Freelancer removed", "success");
      load();
    } else {
      showToast("Could not remove freelancer", "error");
    }
  }

  async function verifyFreelancer(id: string) {
    const { ok } = await authedFetch(`/users/${id}/verify`, { method: "PATCH" });
    if (ok) {
      showToast("Freelancer verified", "success");
      load();
    } else {
      showToast("Could not verify freelancer", "error");
    }
  }

  async function rejectFreelancer(id: string) {
    if (!confirm("Reject this freelancer application?")) return;
    const { ok } = await authedFetch(`/users/${id}/reject`, { method: "PATCH" });
    if (ok) {
      showToast("Freelancer rejected", "success");
      load();
    } else {
      showToast("Could not reject freelancer", "error");
    }
  }

  async function addFreelancer() {
    if (!newFreelancer.name || !newFreelancer.email || !newFreelancer.password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    const { ok, data } = await authedFetch<{ message?: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: newFreelancer.name,
        email: newFreelancer.email,
        password: newFreelancer.password,
        role: "freelancer",
        tier: newFreelancer.tier,
      }),
    });
    if (ok) {
      showToast("Freelancer added", "success");
      setNewFreelancer({ name: "", email: "", password: "", tier: "core" });
      load();
    } else {
      showToast(data.message || "Could not add freelancer", "error");
    }
  }

  const projectsTable = useTableControls({
    data: projects,
    searchFields: (p) => [p.name, p.freelancerName || ""],
    filterValue: (p) => p.status,
  });

  const subsTable = useTableControls({
    data: subscriptions,
    searchFields: (s) => [s.freelancer?.fullName || "", s.freelancer?.email || ""],
    filterValue: (s) => s.status,
    filterValue2: (s) => s.tier,
  });

  const [billingHistoryFor, setBillingHistoryFor] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryEntry[]>([]);
  const [billingHistoryLoading, setBillingHistoryLoading] = useState(false);

  async function openBillingHistory(sub: Subscription) {
    setBillingHistoryFor(sub);
    setBillingHistoryLoading(true);
    const { ok, data } = await authedFetch<BillingHistoryEntry[]>(
      `/subscriptions/${sub.id}/billing-history`,
    );
    if (ok && Array.isArray(data)) setBillingHistory(data);
    setBillingHistoryLoading(false);
  }

  async function applyDiscount(subId: string) {
    const percentStr = prompt("Discount percent (0-100):");
    if (percentStr === null) return;
    const percent = Number(percentStr);
    if (Number.isNaN(percent) || percent < 0 || percent > 100) {
      showToast("Enter a number between 0 and 100", "error");
      return;
    }
    const code = prompt("Discount/coupon code (optional):") || undefined;
    const { ok } = await authedFetch(`/subscriptions/${subId}/discount`, {
      method: "PATCH",
      body: JSON.stringify({ percent, code }),
    });
    if (ok) {
      showToast("Discount applied", "success");
      load();
    } else {
      showToast("Could not apply discount", "error");
    }
  }

  async function forceCancelSubscription(subId: string) {
    const reason = prompt("Reason for force-cancelling this subscription:");
    if (!reason) return;
    const { ok } = await authedFetch(`/subscriptions/${subId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
    if (ok) {
      showToast("Subscription cancelled", "success");
      load();
    } else {
      showToast("Could not cancel subscription", "error");
    }
  }

  async function refundSubscription(subId: string, price: number) {
    const amountStr = prompt("Refund amount:", String(price));
    if (amountStr === null) return;
    const amount = Number(amountStr);
    if (Number.isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    const reason = prompt("Reason for refund (optional):") || undefined;
    const { ok } = await authedFetch(`/subscriptions/${subId}/refund`, {
      method: "POST",
      body: JSON.stringify({ amount, reason }),
    });
    if (ok) {
      showToast("Refund recorded", "success");
      load();
    } else {
      showToast("Could not process refund", "error");
    }
  }

  // Derived from the single /users fetch — this fixes a bug where the
  // "Freelancers" tab previously showed every user regardless of role.
  const freelancers = useMemo(
    () => allUsers.filter((u) => u.role === "freelancer"),
    [allUsers],
  );
  const customers = useMemo(
    () => allUsers.filter((u) => u.role === "client"),
    [allUsers],
  );

  const freelancersTable = useTableControls({
    data: freelancers,
    searchFields: (f) => [f.fullName, f.email],
  });

  const customersTable = useTableControls({
    data: customers,
    searchFields: (c) => [c.fullName, c.email],
  });

  const onlineUsersTable = useTableControls({
    data: onlineUsers,
    searchFields: (u) => [u.fullName, u.email],
    filterValue: (u) => u.role,
  });

  const loginAsLogsTable = useTableControls({
    data: loginAsLogs,
    searchFields: (l) => [
      l.admin?.fullName || "",
      l.admin?.email || "",
      l.customer?.fullName || "",
      l.customer?.email || "",
    ],
  });

  async function handleLoginAsCustomer(customerId: string) {
    const { ok, data } = await authedFetch<{ impersonationUrl?: string; message?: string }>(
      `/auth/login-as/${customerId}`,
      { method: "POST" },
    );
    if (ok && data.impersonationUrl) {
      window.open(data.impersonationUrl, "_blank");
      showToast("Opened customer session in a new tab", "success");
      load(); // refresh the log
    } else {
      showToast(data.message || "Could not start impersonation", "error");
    }
  }

  const ordersTable = useTableControls({
    data: orders,
    searchFields: (o) => [o.customerName || "", o.customerEmail || ""],
    filterValue: (o) => o.status,
  });

  const invoicesTable = useTableControls({
    data: invoices,
    searchFields: (i) => [i.invoiceNumber, i.customer?.fullName || "", i.customer?.email || ""],
    filterValue: (i) => i.status,
  });

  const creditMemosTable = useTableControls({
    data: creditMemos,
    searchFields: (c) => [c.creditMemoNumber, c.customer?.fullName || "", c.customer?.email || ""],
    filterValue: (c) => c.status,
  });

  const transactionsTable = useTableControls({
    data: transactions,
    searchFields: (t) => [t.user?.fullName || "", t.user?.email || "", t.order?.id || ""],
    filterValue: (t) => t.txnType,
  });

  const customerActivity = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string; orderCount: number; totalSpent: number; lastOrder: string }
    >();
    for (const o of orders) {
      const key = o.customerEmail || o.customerName || "unknown";
      const existing = map.get(key);
      const total = o.total ?? 0;
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += total;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt;
        }
      } else {
        map.set(key, {
          name: o.customerName || "—",
          email: o.customerEmail || "—",
          orderCount: 1,
          totalSpent: total,
          lastOrder: o.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const customerActivityTable = useTableControls({
    data: customerActivity,
    searchFields: (c) => [c.name, c.email],
  });

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      map.set(key, (map.get(key) || 0) + (o.total ?? 0));
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .slice(-6);
  }, [orders]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (token && user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <h1 className="mb-2 text-xl font-bold text-red-600">Access denied</h1>
          <p className="text-sm text-slate-500">
            This account does not have admin access.
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <img src={logo} alt="Interquark" className="mb-4 h-7 w-auto" />
          <h1 className="mb-1 text-xl font-bold">Admin sign in</h1>
          <p className="mb-6 text-sm text-slate-500">Sign in to manage the platform.</p>
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

  const activeSubs = subscriptions.filter((s) => s.status === "active").length;
  const mrr = subscriptions
    .filter((s) => s.status === "active" || s.status === "trialing")
    .reduce((sum, s) => {
      const discount = s.discountPercent ? (100 - s.discountPercent) / 100 : 1;
      return sum + s.price * discount;
    }, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  // --- Subscription-specific metrics (Subscriptions tab) ---

  const activeByTier = ["associate", "core", "lead"].map((tier) => ({
    tier,
    count: subscriptions.filter((s) => s.tier === tier && s.status === "active").length,
  }));

  // Churn rate = cancelled this month / (active at some point this
  // month, approximated as active-or-cancelled-this-month count).
  // NOTE: this is an approximation from current snapshot data — your
  // schema doesn't track a full status-change history, so this can't
  // be as precise as a real subscription-analytics system. Good
  // enough for a directional trend, not for financial reporting.
  function churnRateForMonth(monthsAgo: number) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);

    const cancelledThisMonth = subscriptions.filter((s) => {
      if (!s.cancelledAt) return false;
      const d = new Date(s.cancelledAt);
      return d >= monthStart && d < monthEnd;
    }).length;

    const activeAtStartOfMonth = subscriptions.filter((s) => {
      const created = new Date(s.createdAt);
      const stillActiveOrCancelledLater =
        !s.cancelledAt || new Date(s.cancelledAt) >= monthStart;
      return created < monthStart && stillActiveOrCancelledLater;
    }).length;

    return activeAtStartOfMonth > 0
      ? (cancelledThisMonth / activeAtStartOfMonth) * 100
      : 0;
  }
  const churnRateThisMonth = churnRateForMonth(0);
  const churnRateLastMonth = churnRateForMonth(1);

  // Trial-to-paid conversion = active or cancelled-after-trial /
  // everyone who ever had a trialEndsAt in the past.
  // NOTE: also an approximation — same limitation as churn above.
  const trialsCompleted = subscriptions.filter(
    (s) => s.trialEndsAt && new Date(s.trialEndsAt) < new Date(),
  );
  const trialsConverted = trialsCompleted.filter((s) => s.status !== "trialing");
  const trialToPaidRate =
    trialsCompleted.length > 0
      ? (trialsConverted.length / trialsCompleted.length) * 100
      : 0;

  // MRR growth over time — cumulative active-subscription value by
  // month, based on createdAt/cancelledAt. Approximates historical MRR
  // since actual price changes over time aren't tracked.
  const mrrGrowthData = (() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const value = subscriptions
        .filter((s) => {
          const created = new Date(s.createdAt);
          const stillActive = !s.cancelledAt || new Date(s.cancelledAt) >= monthEnd;
          return created < monthEnd && stillActive;
        })
        .reduce((sum, s) => sum + s.price, 0);
      months.push({
        label: monthEnd.toLocaleDateString("en-GB", { month: "short" }),
        value: Math.round(value),
      });
    }
    return months;
  })();

  const planDistributionData = [
    { label: tierInfo("associate").label, value: activeByTier[0].count, color: "#60a5fa" },
    { label: tierInfo("core").label, value: activeByTier[1].count, color: "#2563eb" },
    { label: tierInfo("lead").label, value: activeByTier[2].count, color: "#1e3a8a" },
  ];

  const churnTrendData = (() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = subscriptions.filter((s) => {
        if (!s.cancelledAt) return false;
        const d = new Date(s.cancelledAt);
        return d >= monthStart && d < monthEnd;
      }).length;
      months.push({
        label: monthStart.toLocaleDateString("en-GB", { month: "short" }),
        value: count,
      });
    }
    return months;
  })();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <DashboardHeader portalName="Admin" />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="mb-6 text-2xl font-bold">Admin dashboard</h1>

        <div className="mb-8 flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-white text-signal shadow-sm dark:bg-slate-900"
                  : "text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <>
            {tab === "Overview" && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Freelancers", value: freelancers.length },
                  { label: "Active subscriptions", value: activeSubs },
                  { label: "Monthly recurring revenue", value: money(mrr) },
                  { label: "Total projects", value: projects.length },
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
            )}

            {tab === "Revenue" && (
              <div>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { label: "Total order revenue", value: money(totalRevenue) },
                    { label: "Monthly recurring revenue", value: money(mrr) },
                    { label: "Active subscriptions", value: activeSubs },
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

                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="mb-4 text-sm font-semibold">Order revenue by month</h3>
                  {revenueByMonth.length === 0 ? (
                    <p className="text-sm text-slate-400">No order data yet.</p>
                  ) : (
                    <RevenueChart data={revenueByMonth} />
                  )}
                </div>
              </div>
            )}

            {tab === "Customer Activity" && (
              <div>
                <Toolbar
                  search={customerActivityTable.search}
                  onSearchChange={customerActivityTable.setSearch}
                  onExport={() =>
                    exportToCsv("customer-activity", customerActivityTable.filtered, [
                      { header: "Name", value: (c) => c.name },
                      { header: "Email", value: (c) => c.email },
                      { header: "Orders", value: (c) => c.orderCount },
                      { header: "Total spent", value: (c) => c.totalSpent },
                      {
                        header: "Last order",
                        value: (c) => new Date(c.lastOrder).toLocaleDateString(),
                      },
                    ])
                  }
                  searchPlaceholder="Search customers..."
                />
                {customerActivityTable.paged.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    No customer activity yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {customerActivityTable.paged.map((c) => (
                      <div
                        key={c.email}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div>
                          <b className="text-sm">{c.name}</b>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-mono font-semibold text-signal">
                            {money(c.totalSpent)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {c.orderCount} order{c.orderCount > 1 ? "s" : ""} · last{" "}
                            {new Date(c.lastOrder).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Pagination
                  page={customerActivityTable.page}
                  totalPages={customerActivityTable.totalPages}
                  onChange={customerActivityTable.setPage}
                />
              </div>
            )}

            {tab === "Projects" && (
              <div>
                <Toolbar
                  search={projectsTable.search}
                  onSearchChange={projectsTable.setSearch}
                  filter={projectsTable.filter}
                  onFilterChange={projectsTable.setFilter}
                  filterOptions={projectStatusOptions}
                  onExport={() =>
                    exportToCsv("projects", projectsTable.filtered, [
                      { header: "Name", value: (p) => p.name },
                      { header: "Status", value: (p) => p.status },
                      { header: "Freelancer", value: (p) => p.freelancerName || "Unassigned" },
                    ])
                  }
                  searchPlaceholder="Search projects..."
                />
                {projectsTable.paged.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    No projects match.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {projectsTable.paged.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div>
                          <b className="text-sm">{p.name}</b>
                          <p className="text-xs text-slate-400">
                            {p.freelancerName || "Unassigned"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={p.freelancerId || ""}
                            onChange={(e) => assignFreelancer(p.id, e.target.value)}
                            className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800"
                          >
                            <option value="">Assign freelancer...</option>
                            {freelancers.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.fullName}
                              </option>
                            ))}
                          </select>
                          <select
                            value={p.status}
                            onChange={(e) => updateProjectStatus(p.id, e.target.value)}
                            className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800"
                          >
                            {projectStatusOptions.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Pagination
                  page={projectsTable.page}
                  totalPages={projectsTable.totalPages}
                  onChange={projectsTable.setPage}
                />
              </div>
            )}

            {tab === "Subscriptions" && (
              <div>
                {/* Overview metric cards */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">{money(mrr)}</div>
                    <div className="text-xs text-slate-400">MRR</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">{activeSubs}</div>
                    <div className="text-xs text-slate-400">
                      Active — {activeByTier.map((t) => `${t.count} ${t.tier}`).join(" · ")}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">{churnRateThisMonth.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">
                      Churn this month (vs {churnRateLastMonth.toFixed(1)}% last)
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">{trialToPaidRate.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">Trial → paid conversion</div>
                  </div>
                </div>
                <p className="mb-6 text-xs text-slate-400 italic">
                  Churn and trial-conversion figures are approximated from current
                  subscription records (no full status-history log exists yet) — treat
                  as directional, not exact.
                </p>

                {/* Charts */}
                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="mb-4 text-sm font-semibold">MRR growth</h3>
                    <LineChart data={mrrGrowthData} />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="mb-4 text-sm font-semibold">Plan distribution</h3>
                    <PieChart data={planDistributionData} />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
                    <h3 className="mb-4 text-sm font-semibold">Churn trend (cancellations/month)</h3>
                    <RevenueChart data={churnTrendData} />
                  </div>
                </div>

                {/* Table */}
                <Toolbar
                  search={subsTable.search}
                  onSearchChange={subsTable.setSearch}
                  filter={subsTable.filter}
                  onFilterChange={subsTable.setFilter}
                  filterOptions={[
                    { value: "active", label: "Active" },
                    { value: "trialing", label: "Trialing" },
                    { value: "past_due", label: "Past due" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                  filterLabel="All statuses"
                  filter2={subsTable.filter2}
                  onFilter2Change={subsTable.setFilter2}
                  filter2Options={[
                    { value: "associate", label: "Associate" },
                    { value: "core", label: "Core" },
                    { value: "lead", label: "Lead" },
                  ]}
                  filter2Label="All plans"
                  onExport={() =>
                    exportToCsv("subscriptions", subsTable.filtered, [
                      { header: "Freelancer", value: (s) => s.freelancer?.fullName || "—" },
                      { header: "Email", value: (s) => s.freelancer?.email || "—" },
                      { header: "Plan", value: (s) => s.tier },
                      { header: "Status", value: (s) => s.status },
                      { header: "Start date", value: (s) => new Date(s.createdAt).toLocaleDateString() },
                      {
                        header: "Next renewal",
                        value: (s) => (s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"),
                      },
                    ])
                  }
                  searchPlaceholder="Search by freelancer name..."
                />
                {subsTable.paged.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    No subscriptions match.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {subsTable.paged.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <b className="text-sm">{s.freelancer?.fullName || "—"}</b>
                            <p className="text-xs text-slate-400">{s.freelancer?.email || "—"}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              <span className="font-semibold text-slate-600 dark:text-slate-300">
                                {tierInfo(s.tier).label}
                              </span>{" "}
                              · {money(s.price)}/mo
                              {s.discountPercent ? ` · ${s.discountPercent}% off` : ""} · started{" "}
                              {new Date(s.createdAt).toLocaleDateString()} · renews{" "}
                              {s.currentPeriodEnd
                                ? new Date(s.currentPeriodEnd).toLocaleDateString()
                                : "—"}
                            </p>
                            {tierInfo(s.tier).description && (
                              <p className="mt-0.5 text-[11px] italic text-slate-400">
                                {tierInfo(s.tier).description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              s.status === "active"
                                ? "bg-green-100 text-green-700"
                                : s.status === "trialing"
                                  ? "bg-blue-100 text-blue-700"
                                  : s.status === "past_due"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {s.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                          <button
                            onClick={() => applyDiscount(s.id)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                          >
                            Apply discount
                          </button>
                          <button
                            onClick={() => refundSubscription(s.id, s.price)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                          >
                            Refund
                          </button>
                          <button
                            onClick={() => openBillingHistory(s)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                          >
                            Billing history
                          </button>
                          {s.status !== "cancelled" && (
                            <button
                              onClick={() => forceCancelSubscription(s.id)}
                              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                            >
                              Force-cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Pagination
                  page={subsTable.page}
                  totalPages={subsTable.totalPages}
                  onChange={subsTable.setPage}
                />

                {/* Billing history modal */}
                {billingHistoryFor && (
                  <div
                    onClick={(e) => e.target === e.currentTarget && setBillingHistoryFor(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                  >
                    <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-bold">
                          Billing history — {billingHistoryFor.freelancer?.fullName || "—"}
                        </h3>
                        <button
                          onClick={() => setBillingHistoryFor(null)}
                          className="text-xl text-slate-400 hover:text-slate-700"
                        >
                          &times;
                        </button>
                      </div>
                      {billingHistoryLoading ? (
                        <p className="text-sm text-slate-400">Loading...</p>
                      ) : billingHistory.length === 0 ? (
                        <p className="text-sm text-slate-400">No billing history for this subscription yet.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {billingHistory.map((b) => (
                            <div
                              key={b.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                            >
                              <div>
                                <b className="text-sm capitalize">{b.txnType}</b>
                                <p className="text-xs text-slate-400">
                                  {b.method} · {new Date(b.createdAt).toLocaleString()}
                                  {b.notes ? ` · ${b.notes}` : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-semibold">{money(b.amount)}</div>
                                <span
                                  className={`text-[11px] font-semibold ${
                                    b.status === "succeeded"
                                      ? "text-green-600"
                                      : b.status === "failed"
                                        ? "text-red-500"
                                        : "text-slate-400"
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "Customers" && (
              <div>
                <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 w-fit">
                  {customersSubTabs.map((st) => (
                    <button
                      key={st}
                      onClick={() => setCustomersSubTab(st)}
                      className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        customersSubTab === st
                          ? "bg-white text-signal shadow-sm dark:bg-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {customersSubTab === "All Customers" && (
                  <div>
                    <Toolbar
                      search={customersTable.search}
                      onSearchChange={customersTable.setSearch}
                      onExport={() =>
                        exportToCsv("customers", customersTable.filtered, [
                          { header: "Name", value: (c) => c.fullName },
                          { header: "Email", value: (c) => c.email },
                        ])
                      }
                      searchPlaceholder="Search customers..."
                    />
                    {customersTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No customers match.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {customersTable.paged.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div>
                              <b className="text-sm">{c.fullName}</b>
                              <p className="text-xs text-slate-400">{c.email}</p>
                            </div>
                            <button
                              onClick={() => handleLoginAsCustomer(c.id)}
                              className="rounded-lg border border-blue-200 px-2.5 py-1.5 text-xs font-semibold text-signal hover:bg-blue-50"
                            >
                              Login as customer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={customersTable.page}
                      totalPages={customersTable.totalPages}
                      onChange={customersTable.setPage}
                    />
                  </div>
                )}

                {customersSubTab === "Now Online" && (
                  <div>
                    <Toolbar
                      search={onlineUsersTable.search}
                      onSearchChange={onlineUsersTable.setSearch}
                      filter={onlineUsersTable.filter}
                      onFilterChange={onlineUsersTable.setFilter}
                      filterOptions={[
                        { value: "client", label: "Customer" },
                        { value: "freelancer", label: "Freelancer" },
                        { value: "admin", label: "Admin" },
                      ]}
                      onExport={() =>
                        exportToCsv("online-users", onlineUsersTable.filtered, [
                          { header: "Name", value: (u) => u.fullName },
                          { header: "Email", value: (u) => u.email },
                          { header: "Role", value: (u) => u.role },
                          {
                            header: "Last active",
                            value: (u) => (u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString() : "—"),
                          },
                        ])
                      }
                      searchPlaceholder="Search online users..."
                    />
                    <p className="mb-3 text-xs text-slate-400">
                      Active within the last 15 minutes.
                    </p>
                    {onlineUsersTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No one is currently online.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {onlineUsersTable.paged.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <div>
                                <b className="text-sm">{u.fullName}</b>
                                <p className="text-xs capitalize text-slate-400">
                                  {u.email} · {u.role}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">
                              {u.lastActiveAt
                                ? new Date(u.lastActiveAt).toLocaleTimeString()
                                : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={onlineUsersTable.page}
                      totalPages={onlineUsersTable.totalPages}
                      onChange={onlineUsersTable.setPage}
                    />
                  </div>
                )}

                {customersSubTab === "Login as Customer Log" && (
                  <div>
                    <Toolbar
                      search={loginAsLogsTable.search}
                      onSearchChange={loginAsLogsTable.setSearch}
                      onExport={() =>
                        exportToCsv("login-as-logs", loginAsLogsTable.filtered, [
                          { header: "Admin", value: (l) => l.admin?.fullName || "—" },
                          { header: "Customer", value: (l) => l.customer?.fullName || "—" },
                          { header: "Date", value: (l) => new Date(l.createdAt).toLocaleString() },
                        ])
                      }
                      searchPlaceholder="Search login-as log..."
                    />
                    {loginAsLogsTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No impersonation activity yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {loginAsLogsTable.paged.map((l) => (
                          <div
                            key={l.id}
                            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <p className="text-sm">
                              <b>{l.admin?.fullName || "—"}</b> logged in as{" "}
                              <b>{l.customer?.fullName || "—"}</b>
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(l.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={loginAsLogsTable.page}
                      totalPages={loginAsLogsTable.totalPages}
                      onChange={loginAsLogsTable.setPage}
                    />
                  </div>
                )}
              </div>
            )}

            {tab === "Freelancers" && (
              <div>
                {/* Summary stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">{freelancers.length}</div>
                    <div className="text-xs text-slate-400">Total freelancers</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">
                      {freelancers.filter((f) => f.verificationStatus === "pending").length}
                    </div>
                    <div className="text-xs text-slate-400">Pending verification</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">
                      {subscriptions.filter((s) => s.status === "active").length}
                    </div>
                    <div className="text-xs text-slate-400">Active subscriptions</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-2xl font-bold">
                      {freelancers.filter((f) => f.verificationStatus === "rejected").length}
                    </div>
                    <div className="text-xs text-slate-400">Rejected</div>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="mb-3 text-sm font-semibold">Add a freelancer</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      placeholder="Full name"
                      value={newFreelancer.name}
                      onChange={(e) => setNewFreelancer({ ...newFreelancer, name: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                    <input
                      placeholder="Email"
                      value={newFreelancer.email}
                      onChange={(e) => setNewFreelancer({ ...newFreelancer, email: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newFreelancer.password}
                      onChange={(e) =>
                        setNewFreelancer({ ...newFreelancer, password: e.target.value })
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                    <select
                      value={newFreelancer.tier}
                      onChange={(e) => setNewFreelancer({ ...newFreelancer, tier: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    >
                      <option value="associate">Associate</option>
                      <option value="core">Core contributor</option>
                      <option value="lead">Lead collaborator</option>
                    </select>
                  </div>
                  <button
                    onClick={addFreelancer}
                    className="mt-3 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
                  >
                    Add freelancer
                  </button>
                </div>

                <Toolbar
                  search={freelancersTable.search}
                  onSearchChange={freelancersTable.setSearch}
                  onExport={() =>
                    exportToCsv("freelancers", freelancersTable.filtered, [
                      { header: "Name", value: (f) => f.fullName },
                      { header: "Email", value: (f) => f.email },
                      { header: "Tier", value: (f) => f.tier || "—" },
                      { header: "Verification", value: (f) => f.verificationStatus || "—" },
                      {
                        header: "Payment status",
                        value: (f) => {
                          const s = subscriptions.find((sub) => sub.freelancer?.id === f.id);
                          return s && s.status === "active" ? "Paid" : "Unpaid";
                        },
                      },
                    ])
                  }
                  searchPlaceholder="Search freelancers..."
                />

                {freelancersTable.paged.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    No freelancers match.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {freelancersTable.paged.map((f) => {
                      const sub = subscriptions.find((s) => s.freelancer?.id === f.id);
                      const memoCount = creditMemos.filter(
                        (c) => c.customer?.email === f.email,
                      ).length;
                      return (
                        <div
                          key={f.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <b className="text-sm">{f.fullName}</b>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    f.verificationStatus === "verified"
                                      ? "bg-green-100 text-green-700"
                                      : f.verificationStatus === "rejected"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {f.verificationStatus || "pending"}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    sub && sub.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {sub && sub.status === "active" ? "Paid" : "Unpaid"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">{f.email}</p>
                              {sub ? (
                                <p className="mt-1 text-xs text-slate-400">
                                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                                    {sub.tier}
                                  </span>{" "}
                                  · {money(sub.price)}/mo ·{" "}
                                  <span
                                    className={
                                      sub.status === "active"
                                        ? "text-green-600"
                                        : "text-amber-600"
                                    }
                                  >
                                    {sub.status}
                                  </span>
                                  {memoCount > 0 && ` · ${memoCount} credit memo${memoCount > 1 ? "s" : ""}`}
                                </p>
                              ) : (
                                <p className="mt-1 text-xs text-slate-400">No subscription yet</p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {f.verificationStatus === "pending" && (
                                <>
                                  <button
                                    onClick={() => verifyFreelancer(f.id)}
                                    className="rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => rejectFreelancer(f.id)}
                                    className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {sub && (
                                <button
                                  onClick={() => openBillingHistory(sub)}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                                >
                                  Billing history
                                </button>
                              )}
                              <button
                                onClick={() => deleteFreelancer(f.id)}
                                className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Pagination
                  page={freelancersTable.page}
                  totalPages={freelancersTable.totalPages}
                  onChange={freelancersTable.setPage}
                />
              </div>
            )}
            {tab === "Payouts" && (
              <div>
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="mb-3 text-sm font-semibold">Create a payout</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <select
                      value={newPayout.freelancerId}
                      onChange={(e) => setNewPayout({ ...newPayout, freelancerId: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    >
                      <option value="">Select freelancer...</option>
                      {freelancers.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.fullName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newPayout.projectId}
                      onChange={(e) => setNewPayout({ ...newPayout, projectId: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    >
                      <option value="">No project (optional)</option>
                      {projects
                        .filter((p) => p.freelancerId === newPayout.freelancerId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Amount (£)"
                      value={newPayout.amount}
                      onChange={(e) => setNewPayout({ ...newPayout, amount: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                    <input
                      placeholder="Notes (optional)"
                      value={newPayout.notes}
                      onChange={(e) => setNewPayout({ ...newPayout, notes: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                  </div>
                  <button
                    onClick={createPayout}
                    className="mt-3 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
                  >
                    Create payout
                  </button>
                </div>

                {payouts.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    No payouts yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {payouts.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div>
                          <b className="text-sm">{p.freelancer?.fullName || "—"}</b>
                          <p className="text-xs text-slate-400">
                            {money(p.amount)}
                            {p.project?.name && ` · ${p.project.name}`}
                            {p.notes && ` · ${p.notes}`}
                            {" · "}
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              p.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.status !== "paid" && (
                            <button
                              onClick={() => markPayoutPaid(p.id)}
                              className="rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50"
                            >
                              Mark paid
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {tab === "Sales" && (
              <div>
                <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 w-fit">
                  {salesSubTabs.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSalesSubTab(st)}
                      className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        salesSubTab === st
                          ? "bg-white text-signal shadow-sm dark:bg-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {salesSubTab === "Orders" && (
                  <div>
                    <Toolbar
                      search={ordersTable.search}
                      onSearchChange={ordersTable.setSearch}
                      filter={ordersTable.filter}
                      onFilterChange={ordersTable.setFilter}
                      filterOptions={orderStatusOptions}
                      onExport={() =>
                        exportToCsv("orders", ordersTable.filtered, [
                          { header: "Customer", value: (o) => o.customerName || "—" },
                          { header: "Date", value: (o) => new Date(o.createdAt).toLocaleDateString() },
                          { header: "Status", value: (o) => o.status },
                          { header: "Total", value: (o) => o.total ?? 0 },
                        ])
                      }
                      searchPlaceholder="Search orders..."
                    />
                    {ordersTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No orders match.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {ordersTable.paged.map((o) => (
                          <div
                            key={o.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div>
                              <b className="text-sm">{o.customerName || "—"}</b>
                              <p className="text-xs text-slate-400">
                                {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                                {typeof o.total === "number" && ` · ${money(o.total)}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {o.status !== "refunded" && o.status !== "cancelled" && (
                                <button
                                  onClick={() => refundOrder(o.id)}
                                  className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                                >
                                  Refund
                                </button>
                              )}
                              <button
                                onClick={() => deleteOrder(o.id)}
                                className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={ordersTable.page}
                      totalPages={ordersTable.totalPages}
                      onChange={ordersTable.setPage}
                    />
                  </div>
                )}

                {salesSubTab === "Invoices" && (
                  <div>
                    <Toolbar
                      search={invoicesTable.search}
                      onSearchChange={invoicesTable.setSearch}
                      filter={invoicesTable.filter}
                      onFilterChange={invoicesTable.setFilter}
                      filterOptions={[
                        { value: "draft", label: "Draft" },
                        { value: "sent", label: "Sent" },
                        { value: "paid", label: "Paid" },
                        { value: "overdue", label: "Overdue" },
                        { value: "cancelled", label: "Cancelled" },
                      ]}
                      onExport={() =>
                        exportToCsv("invoices", invoicesTable.filtered, [
                          { header: "Invoice #", value: (i) => i.invoiceNumber },
                          { header: "Customer", value: (i) => i.customer?.fullName || "—" },
                          { header: "Amount", value: (i) => i.amount },
                          { header: "Status", value: (i) => i.status },
                          { header: "Date", value: (i) => new Date(i.createdAt).toLocaleDateString() },
                        ])
                      }
                      searchPlaceholder="Search invoices..."
                    />
                    {invoicesTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No invoices match.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {invoicesTable.paged.map((i) => (
                          <div
                            key={i.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div>
                              <b className="text-sm">{i.invoiceNumber}</b>
                              <p className="text-xs text-slate-400">
                                {i.customer?.fullName || "—"} ·{" "}
                                {new Date(i.createdAt).toLocaleDateString()} · {money(i.amount)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                  i.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : i.status === "overdue"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {i.status}
                              </span>
                              <button
                                onClick={() => downloadInvoice(i.id, i.invoiceNumber)}
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={invoicesTable.page}
                      totalPages={invoicesTable.totalPages}
                      onChange={invoicesTable.setPage}
                    />
                  </div>
                )}

                {salesSubTab === "Credit Memos" && (
                  <div>
                    <Toolbar
                      search={creditMemosTable.search}
                      onSearchChange={creditMemosTable.setSearch}
                      filter={creditMemosTable.filter}
                      onFilterChange={creditMemosTable.setFilter}
                      filterOptions={[
                        { value: "pending", label: "Pending" },
                        { value: "refunded", label: "Refunded" },
                        { value: "cancelled", label: "Cancelled" },
                      ]}
                      onExport={() =>
                        exportToCsv("credit-memos", creditMemosTable.filtered, [
                          { header: "Credit Memo #", value: (c) => c.creditMemoNumber },
                          { header: "Customer", value: (c) => c.customer?.fullName || "—" },
                          { header: "Amount", value: (c) => c.amount },
                          { header: "Reason", value: (c) => c.reason },
                          { header: "Status", value: (c) => c.status },
                          { header: "Date", value: (c) => new Date(c.createdAt).toLocaleDateString() },
                        ])
                      }
                      searchPlaceholder="Search credit memos..."
                    />
                    {creditMemosTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No credit memos match.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {creditMemosTable.paged.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div>
                              <b className="text-sm">{c.creditMemoNumber}</b>
                              <p className="text-xs text-slate-400">
                                {c.customer?.fullName || "—"} ·{" "}
                                {new Date(c.createdAt).toLocaleDateString()} · {money(c.amount)}
                              </p>
                              <p className="text-xs text-slate-400 italic">{c.reason}</p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                c.status === "refunded"
                                  ? "bg-green-100 text-green-700"
                                  : c.status === "cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={creditMemosTable.page}
                      totalPages={creditMemosTable.totalPages}
                      onChange={creditMemosTable.setPage}
                    />
                  </div>
                )}

                {salesSubTab === "Transactions" && (
                  <div>
                    <Toolbar
                      search={transactionsTable.search}
                      onSearchChange={transactionsTable.setSearch}
                      filter={transactionsTable.filter}
                      onFilterChange={transactionsTable.setFilter}
                      filterOptions={[
                        { value: "authorization", label: "Authorization" },
                        { value: "capture", label: "Capture" },
                        { value: "refund", label: "Refund" },
                        { value: "void", label: "Void" },
                      ]}
                      onExport={() =>
                        exportToCsv("transactions", transactionsTable.filtered, [
                          { header: "User", value: (t) => t.user?.fullName || "—" },
                          { header: "Order", value: (t) => t.order?.id || "—" },
                          { header: "Type", value: (t) => t.txnType },
                          { header: "Method", value: (t) => t.method },
                          { header: "Amount", value: (t) => t.amount },
                          { header: "Status", value: (t) => t.status },
                          { header: "Date", value: (t) => new Date(t.createdAt).toLocaleDateString() },
                        ])
                      }
                      searchPlaceholder="Search transactions..."
                    />
                    {transactionsTable.paged.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                        No transactions match.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {transactionsTable.paged.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div>
                              <b className="text-sm capitalize">{t.txnType}</b>
                              <p className="text-xs text-slate-400">
                                {t.user?.fullName || "—"} · {t.method} ·{" "}
                                {new Date(t.createdAt).toLocaleDateString()} · {money(t.amount)}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                t.status === "succeeded"
                                  ? "bg-green-100 text-green-700"
                                  : t.status === "failed"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Pagination
                      page={transactionsTable.page}
                      totalPages={transactionsTable.totalPages}
                      onChange={transactionsTable.setPage}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <ChatWidget />
    </div>
  );
}
