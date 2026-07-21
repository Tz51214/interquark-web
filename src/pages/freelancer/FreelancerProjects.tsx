import { useFreelancerData } from "../../context/FreelancerContext";
import { useAuthedFetch } from "../../lib/useAuthedFetch";
import { useToast } from "../../context/ToastContext";
import MessageThread from "../../components/MessageThread";

const statusOptions = ["in_progress", "review", "completed", "on_hold"];

const statusColors: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-slate-100 text-slate-500",
};

export default function FreelancerProjects() {
  const { projects, reload } = useFreelancerData();
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();

  async function updateStatus(projectId: string, status: string) {
    const { ok } = await authedFetch(`/projects/${projectId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (ok) {
      showToast("Status updated", "success");
      reload();
    } else {
      showToast("Could not update status", "error");
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">My projects</h1>
      {projects.length === 0 ? (
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
    </div>
  );
}
