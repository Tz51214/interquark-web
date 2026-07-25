import { useState, type DragEvent } from "react";
import { useFreelancerData, type Task } from "../../context/FreelancerContext";
import { useAuthedFetch } from "../../lib/useAuthedFetch";

const columns: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "completed", label: "Completed" },
];

const priorityColors: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

const priorityDot: Record<Task["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-mint",
};

export default function Tasks() {
  const { tasks, reload, loading } = useFreelancerData();
  const authedFetch = useAuthedFetch();
  const [dragging, setDragging] = useState<number | null>(null);

  async function moveTask(taskId: number, status: Task["status"]) {
    await authedFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    reload();
  }

  function handleDrop(e: DragEvent, status: Task["status"]) {
    e.preventDefault();
    if (dragging !== null) moveTask(dragging, status);
    setDragging(null);
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Tasks</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.key)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {col.label}
                </h3>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700">
                  {colTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {colTasks.length === 0 ? (
                  <p className="px-1 text-xs text-slate-400">No tasks here.</p>
                ) : (
                  colTasks.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragging(t.id)}
                      className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[t.priority]}`} />
                        <b className="text-xs">{t.title}</b>
                      </div>
                      <p className="mb-2 text-[11px] text-slate-400">{t.project?.name}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${priorityColors[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                        {t.dueDate && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
