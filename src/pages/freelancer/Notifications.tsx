import { useState, useEffect } from "react";
import { useAuthedFetch } from "../../lib/useAuthedFetch";
import { useToast } from "../../context/ToastContext";
import NotificationToggle from "../../components/NotificationToggle";

interface Prefs {
  projectAssignments: boolean;
  payouts: boolean;
  billing: boolean;
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
    if (ok) {
      showToast("Notification preferences updated", "success");
    } else {
      showToast("Could not save preference", "error");
      setPrefs(prefs);
    }
  }

  if (loading || !prefs) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Notification settings</h1>
      <p className="mb-8 text-sm text-slate-400">
        Choose how you'd like Interquark to keep you informed.
      </p>

      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        Email notifications
      </h2>
      <div className="rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
        <NotificationToggle
          icon="📋"
          label="Project assignments"
          description="Emails when you're assigned to a new project."
          checked={prefs.projectAssignments}
          onChange={(v) => update("projectAssignments", v)}
        />
        <NotificationToggle
          icon="💰"
          label="Payouts"
          description="Emails when a payout is processed."
          checked={prefs.payouts}
          onChange={(v) => update("payouts", v)}
        />
        <NotificationToggle
          icon="💳"
          label="Billing"
          description="Subscription charges and receipts."
          checked={prefs.billing}
          onChange={(v) => update("billing", v)}
        />
      </div>
    </div>
  );
}
