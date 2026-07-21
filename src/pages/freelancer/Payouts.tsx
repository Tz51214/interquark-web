import { useFreelancerData } from "../../context/FreelancerContext";

export default function Payouts() {
  const { payouts } = useFreelancerData();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Payouts</h1>
      {payouts.length === 0 ? (
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
    </div>
  );
}
