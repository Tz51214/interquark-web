import { useAuth } from "../../context/AuthContext";
import { useFreelancerData } from "../../context/FreelancerContext";

export default function Overview() {
  const { user } = useAuth();
  const { projects } = useFreelancerData();

  const completed = projects.filter((p) => p.status === "completed").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const totalValue = projects.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Welcome back, {user?.fullName || user?.email}</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
    </div>
  );
}
