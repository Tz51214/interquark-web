import { useCustomerData } from "../../context/CustomerContext";

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

export default function Orders() {
  const { orders, loading } = useCustomerData();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Your orders</h1>
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
    </div>
  );
}
