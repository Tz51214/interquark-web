import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import JoinModal from "../components/JoinModal";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { useToast } from "../context/ToastContext";

const HeroSphere = lazy(() => import("../components/HeroSphere"));

const tiers = [
  {
    value: "associate",
    label: "Associate",
    price: 29,
    description: "Get started — limited proposals per month.",
    features: ["Up to 5 project matches/mo", "Standard profile listing", "Portal messaging"],
  },
  {
    value: "core",
    label: "Core contributor",
    price: 79,
    description: "Unlimited proposals, featured profile badge.",
    features: [
      "Unlimited project matches",
      "Featured profile badge",
      "Priority portal messaging",
    ],
  },
  {
    value: "lead",
    label: "Lead collaborator",
    price: 159,
    description: "Priority listing, analytics, verified badge.",
    features: [
      "Everything in Core",
      "Priority listing for matching",
      "Verified badge",
      "Earnings analytics",
    ],
  },
];

export default function Subscribe() {
  const { token, user } = useAuth();
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();
  const [busyTier, setBusyTier] = useState<string | null>(null);
  const [busyMethod, setBusyMethod] = useState<"stripe" | "paypal" | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);

  async function payWithStripe(tier: string) {
    if (!token || !user) {
      setJoinOpen(true);
      return;
    }
    setBusyTier(tier);
    setBusyMethod("stripe");
    const { ok, data } = await authedFetch<{ url?: string; message?: string }>(
      "/payments/subscription-checkout-session",
      { method: "POST", body: JSON.stringify({ tier }) },
    );
    if (ok && data.url) {
      window.location.href = data.url;
    } else {
      showToast(data.message || "Could not start checkout", "error");
      setBusyTier(null);
      setBusyMethod(null);
    }
  }

  async function payWithPaypal(tier: string) {
    if (!token || !user) {
      setJoinOpen(true);
      return;
    }
    setBusyTier(tier);
    setBusyMethod("paypal");
    const { ok, data } = await authedFetch<{ approveUrl?: string; message?: string }>(
      "/payments/paypal/create-order",
      { method: "POST", body: JSON.stringify({ tier }) },
    );
    if (ok && data.approveUrl) {
      window.location.href = data.approveUrl;
    } else {
      showToast(data.message || "Could not start PayPal checkout", "error");
      setBusyTier(null);
      setBusyMethod(null);
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar onJoinClick={() => setJoinOpen(true)} />

      {/* Cinematic hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-ink">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <HeroSphere />
          </Suspense>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            BECOME AN INTERQUARK FREELANCER
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
            Do the work you're good at.
            <br />
            We'll bring the clients.
          </h1>
          <p className="mx-auto mb-8 max-w-xl font-body text-lg text-slate-400">
            Join a vetted network matched to real client projects — Magento, Shopify,
            WooCommerce, WordPress, and custom builds. No bidding wars, no race to the bottom.
          </p>
          {token && user ? (
            <Link to="/freelancer">
              <button className="rounded-lg bg-signal px-6 py-3 font-body text-sm font-semibold text-white hover:bg-signal-dark">
                Go to your dashboard
              </button>
            </Link>
          ) : (
            <button
              onClick={() => setJoinOpen(true)}
              className="rounded-lg bg-signal px-6 py-3 font-body text-sm font-semibold text-white hover:bg-signal-dark"
            >
              Join as a freelancer
            </button>
          )}
        </div>
      </section>

      {/* Why join */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
            Why freelancers work with Interquark
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Matched, not bidding",
                desc: "You're assigned to projects that fit your platform expertise — no competing against 40 other proposals for one job.",
              },
              {
                title: "Direct client contact",
                desc: "Message clients straight from your portal. No relayed messages, no middleman guessing what they meant.",
              },
              {
                title: "Track your own payouts",
                desc: "See exactly what you've earned and what's pending, right from your freelancer dashboard.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 p-6">
                <div className="mb-3 h-px w-8 bg-signal" />
                <h3 className="mb-2 font-display text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink">
            Choose your plan
          </h2>
          <p className="mb-10 text-center font-body text-sm text-slate-500">
            {token && user
              ? "Pick a membership tier to unlock your freelancer dashboard."
              : "Create your account first, then choose a plan to get started."}
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.value} delay={i * 100}>
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10">
                  <h3 className="font-display text-lg font-bold text-ink">{t.label}</h3>
                  <p className="mt-1 font-mono text-2xl font-bold text-signal">
                    £{t.price}
                    <span className="font-body text-sm font-normal text-slate-400">/mo</span>
                  </p>
                  <p className="mt-2 mb-4 font-body text-xs text-slate-500">{t.description}</p>
                  <ul className="mb-6 flex flex-1 flex-col gap-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 font-body text-xs text-slate-600">
                        <span className="mt-0.5 text-mint">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => payWithStripe(t.value)}
                    disabled={busyTier === t.value}
                    className="mb-2 w-full rounded-lg bg-signal py-2.5 font-body text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                  >
                    {busyTier === t.value && busyMethod === "stripe"
                      ? "Redirecting..."
                      : token && user
                        ? "Pay with debit/credit card"
                        : "Get started"}
                  </button>
                  {token && user && (
                    <button
                      onClick={() => payWithPaypal(t.value)}
                      disabled={busyTier === t.value}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 font-body text-sm font-semibold text-slate-900 hover:border-signal hover:text-signal disabled:opacity-60"
                    >
                      {busyTier === t.value && busyMethod === "paypal"
                        ? "Redirecting..."
                        : "Pay with PayPal"}
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
