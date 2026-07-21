import { useCustomerData } from "../../context/CustomerContext";
import MessageThread from "../../components/MessageThread";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function CustomerProjects() {
  const { projects, loading } = useCustomerData();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Your projects</h1>
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
    </div>
  );
}
