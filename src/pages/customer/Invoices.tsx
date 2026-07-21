import { useAuth } from "../../context/AuthContext";
import { useCustomerData } from "../../context/CustomerContext";
import { API_BASE } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

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

export default function Invoices() {
  const { token } = useAuth();
  const { invoices, loading } = useCustomerData();
  const { showToast } = useToast();

  async function downloadInvoice(id: string, invoiceNumber: string) {
    const res = await fetch(`${API_BASE}/invoices/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      showToast("Could not download invoice.", "error");
      return;
    }
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

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Your invoices</h1>
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
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    statusColors[inv.status] || "bg-slate-100 text-slate-500"
                  }`}
                >
                  {inv.status}
                </span>
                <button
                  onClick={() => downloadInvoice(inv.id, inv.invoiceNumber)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
