import { useAuth } from "../../context/AuthContext";
import { useFreelancerData } from "../../context/FreelancerContext";
import { API_BASE } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export default function Billing() {
  const { token } = useAuth();
  const { billingHistory } = useFreelancerData();
  const { showToast } = useToast();

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

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Billing history</h1>
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
    </div>
  );
}
