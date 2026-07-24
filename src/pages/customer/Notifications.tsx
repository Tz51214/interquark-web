import { useState, useEffect } from "react";
import { useAuthedFetch } from "../../lib/useAuthedFetch";
import { useToast } from "../../context/ToastContext";
import NotificationToggle from "../../components/NotificationToggle";

interface Prefs {
  orderUpdates: boolean;
  invoices: boolean;
  projectMessages: boolean;
}

export default function Notifications() {
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authedFetch<Prefs>("/users/me/notifications").then(({ ok, data }) => {
      if (ok) setPrefs(data);
      setLoading(false);
    });
  }, [authedFetch]);

  async function update(key: keyof Prefs, value: boolean) {
    if (!prefs) return;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    const { ok } = await authedFetch("/users/me/notifications", {
      method: "PATCH",
      body: JSON.stringify({ [key]: value }),
    });
    if (!ok) {
      showToast("Could not save preference", "error");
      setPrefs(prefs);
    }
  }

  if (loading || !prefs) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Notification settings</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <NotificationToggle
          label="Order updates"
          description="Status changes on your orders and projects."
          checked={prefs.orderUpdates}
          onChange={(v) => update("orderUpdates", v)}
        />
        <NotificationToggle
          label="Invoices"
          description="New invoices and payment reminders."
          checked={prefs.invoices}
          onChange={(v) => update("invoices", v)}
        />
        <NotificationToggle
          label="Project messages"
          description="Emails when your developer sends you a message."
          checked={prefs.projectMessages}
          onChange={(v) => update("projectMessages", v)}
        />
      </div>
    </div>
  );
}
