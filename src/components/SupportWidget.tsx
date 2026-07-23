import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Audience = "public" | "customer" | "freelancer";

interface SupportWidgetProps {
  audience: Audience;
}

const helpArticles: Record<Audience, { label: string; href: string }[]> = {
  public: [
    { label: "How pricing and tiers work", href: "/help" },
    { label: "Becoming a freelancer on Interquark", href: "/subscribe" },
    { label: "How projects get started", href: "/guide" },
  ],
  customer: [
    { label: "Tracking your order status", href: "/help" },
    { label: "Downloading an invoice", href: "/customer/invoices" },
    { label: "Messaging your assigned developer", href: "/customer/projects" },
  ],
  freelancer: [
    { label: "How payouts work", href: "/help" },
    { label: "Upgrading or changing your plan", href: "/freelancer/membership" },
    { label: "Viewing your billing history", href: "/freelancer/billing" },
  ],
};

const greetings: Record<Audience, string> = {
  public: "Hi there 👋\nHow can we help?",
  customer: "Welcome back 👋\nHow can we help with your order?",
  freelancer: "Welcome back 👋\nHow can we help with your work?",
};

export default function SupportWidget({ audience }: SupportWidgetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"home" | "help">("home");
  const articles = helpArticles[audience];

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[140] flex h-14 w-14 items-center justify-center rounded-full bg-signal text-white shadow-lg hover:bg-signal-dark"
        aria-label="Open support"
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 01-1.9 5.4A8.5 8.5 0 0112 20a8.38 8.38 0 01-5.4-1.9L3 20l1.9-3.6A8.38 8.38 0 013 12a8.5 8.5 0 018.5-8.5A8.38 8.38 0 0121 11.5z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[140] flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-ink px-5 py-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs tracking-wide text-slate-400">
                interquark support
              </span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <h2 className="whitespace-pre-line font-display text-xl font-semibold leading-tight">
              {greetings[audience].replace(
                "Hi there",
                user?.fullName ? `Hi ${user.fullName.split(" ")[0]}` : "Hi there",
              )}
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {tab === "home" && (
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:hello@interquark.co.uk"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-signal"
                >
                  <span className="font-body text-sm font-medium text-ink">
                    Send us a message
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                    →
                  </span>
                </a>

                <div>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">
                    Popular articles
                  </p>
                  <div className="rounded-xl border border-slate-200">
                    {articles.map((a, i) => (
                      <Link
                        key={a.href + a.label}
                        to={a.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-sm text-ink hover:bg-slate-50 ${
                          i !== articles.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                      >
                        {a.label} <span className="text-slate-400">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "help" && (
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-slate-400">
                  All help topics
                </p>
                <div className="rounded-xl border border-slate-200">
                  {articles.map((a, i) => (
                    <Link
                      key={a.href + a.label}
                      to={a.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-sm text-ink hover:bg-slate-50 ${
                        i !== articles.length - 1 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      {a.label} <span className="text-slate-400">→</span>
                    </Link>
                  ))}
                  <Link
                    to="/help"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-signal hover:bg-slate-50"
                  >
                    View all help articles <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex border-t border-slate-200 bg-white py-2">
            <button
              onClick={() => setTab("home")}
              className={`flex flex-1 flex-col items-center gap-1 text-xs font-medium ${
                tab === "home" ? "text-ink" : "text-slate-400"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 11l9-7 9 7" />
                <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
              </svg>
              Home
            </button>
            <button
              onClick={() => setTab("help")}
              className={`flex flex-1 flex-col items-center gap-1 text-xs font-medium ${
                tab === "help" ? "text-ink" : "text-slate-400"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2 1.8-2 3.4" />
                <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
              </svg>
              Help
            </button>
          </div>
        </div>
      )}
    </>
  );
}
