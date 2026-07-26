import { useState, useEffect } from "react";
import { useAuthedFetch } from "../../lib/useAuthedFetch";
import { useToast } from "../../context/ToastContext";

export default function Referrals() {
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authedFetch<{ code: string }>("/users/me/referral").then(({ ok, data }) => {
      if (ok) setCode(data.code);
      setLoading(false);
    });
  }, [authedFetch]);

  const link = code ? `https://interquark.co.uk/?ref=${code}` : "";

  function copyLink() {
    navigator.clipboard.writeText(link);
    showToast("Referral link copied", "success");
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Refer a friend</h1>
      <p className="mb-8 text-sm text-slate-400">
        Share your link — when someone you refer makes their first purchase, we'll send you a
        15% off code.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Your referral link
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <button
            onClick={copyLink}
            className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark"
          >
            Copy link
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Your code: <span className="font-mono font-semibold text-signal">{code}</span>
        </p>
      </div>
    </div>
  );
}
