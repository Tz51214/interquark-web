import { useState } from "react";
import { Link } from "react-router-dom";
import { useFreelancerData } from "../../context/FreelancerContext";
import { useAuthedFetch } from "../../lib/useAuthedFetch";
import { useToast } from "../../context/ToastContext";

const tiers = [
  { value: "associate", label: "Associate", price: 29 },
  { value: "core", label: "Core contributor", price: 79 },
  { value: "lead", label: "Lead collaborator", price: 159 },
];

export default function Membership() {
  const { subscription, loading } = useFreelancerData();
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  async function upgradeTo(tier: string) {
    setUpgrading(tier);
    const { ok, data } = await authedFetch<{ url?: string; message?: string }>(
      "/payments/subscription-checkout-session",
      { method: "POST", body: JSON.stringify({ tier }) },
    );
    if (ok && data.url) {
      window.location.href = data.url;
    } else {
      showToast(data.message || "Could not start upgrade checkout.", "error");
      setUpgrading(null);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Membership</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
          Current plan
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : subscription ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <b className="text-sm capitalize">{subscription.tier} plan</b>
                <p className="text-xs text-slate-400">
                  £{subscription.price}/mo · {subscription.status}
                  {subscription.currentPeriodEnd &&
                    ` · renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  subscription.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {subscription.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3">No active membership plan found.</p>
            <Link
              to="/subscribe"
              className="inline-block rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
            >
              Choose a plan
            </Link>
          </div>
        )}
      </section>

      {subscription && (
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            Change plan
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tiers.map((t) => {
              const isCurrent = t.value === subscription.tier;
              return (
                <div
                  key={t.value}
                  className={`rounded-xl border p-5 ${
                    isCurrent
                      ? "border-signal bg-signal/5"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  <b className="text-sm">{t.label}</b>
                  <p className="mb-4 font-mono text-lg text-signal">£{t.price}/mo</p>
                  {isCurrent ? (
                    <span className="block rounded-lg bg-slate-100 py-2 text-center text-xs font-semibold text-slate-500 dark:bg-slate-800">
                      Current plan
                    </span>
                  ) : (
                    <button
                      onClick={() => upgradeTo(t.value)}
                      disabled={upgrading === t.value}
                      className="w-full rounded-lg bg-signal py-2 text-xs font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                    >
                      {upgrading === t.value ? "Redirecting..." : "Switch to this plan"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
