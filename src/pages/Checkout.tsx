import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { useTranslation } from "react-i18next";
import logo from "../assets/interquark-wordmark-navy.png";
import SiteFooter from "../components/layout/SiteFooter";

function money(n: number) {
  return "£" + n.toLocaleString();
}

export default function Checkout() {
  const { t } = useTranslation();
  const { items, total, clear, removeItem } = useCart();
  const { token, user, login, logout } = useAuth();

  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authNote, setAuthNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [payingPaypal, setPayingPaypal] = useState(false);
  const [placeNote, setPlaceNote] = useState<{ text: string; error?: boolean } | null>(null);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupBusy, setSignupBusy] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setAuthNote("Please fill in both fields.");
      return;
    }
    setAuthNote("Signing in...");
    const result = await login(email, password);
    setAuthNote(result.ok ? "" : result.message || "Sign in failed.");
  }

  async function handleSignUp() {
    if (!signupName || !signupEmail || !signupPassword) {
      setAuthNote("Please fill in all fields.");
      return;
    }
    setSignupBusy(true);
    setAuthNote("Creating account...");
    const { ok, data } = await apiFetch<{ message?: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: signupName,
        email: signupEmail,
        password: signupPassword,
        role: "client",
      }),
    });
    if (!ok) {
      setSignupBusy(false);
      setAuthNote(data.message || "Could not create account.");
      return;
    }
    const result = await login(signupEmail, signupPassword);
    setSignupBusy(false);
    setAuthNote(result.ok ? "" : result.message || "Account created — please sign in.");
  }

  async function createOrder() {
    const orderRes = await apiFetch<{ id?: number; message?: string }>("/orders", {
      method: "POST",
      token,
      body: JSON.stringify({
        items: items.map((c) => ({ sku: c.sku, name: c.name, tier: c.tier, price: c.price })),
      }),
    });
    if (!orderRes.ok) {
      setPlaceNote({
        text: orderRes.data.message || `Could not place order (${orderRes.status}).`,
        error: true,
      });
      return null;
    }
    return orderRes.data.id ?? null;
  }

  async function placeOrder() {
    if (!token) {
      setPlaceNote({ text: "Please sign in above before placing your order.", error: true });
      return;
    }

    setPlacing(true);
    setPlaceNote(null);

    const orderId = await createOrder();
    if (!orderId) {
      setPlacing(false);
      return;
    }

    const sessionRes = await apiFetch<{ url?: string; message?: string }>(
      "/payments/checkout-session",
      {
        method: "POST",
        token,
        body: JSON.stringify({ orderId }),
      },
    );

    if (!sessionRes.ok || !sessionRes.data.url) {
      setPlaceNote({
        text:
          sessionRes.data.message ||
          "Order was placed, but we could not start payment. Please contact us.",
        error: true,
      });
      setPlacing(false);
      return;
    }

    clear();
    window.location.href = sessionRes.data.url;
  }

  async function placeOrderWithPaypal() {
    if (!token) {
      setPlaceNote({ text: "Please sign in above before placing your order.", error: true });
      return;
    }

    setPayingPaypal(true);
    setPlaceNote(null);

    const orderId = await createOrder();
    if (!orderId) {
      setPayingPaypal(false);
      return;
    }

    const paypalRes = await apiFetch<{ approveUrl?: string; message?: string }>(
      "/payments/paypal/order/create",
      {
        method: "POST",
        token,
        body: JSON.stringify({ orderId }),
      },
    );

    if (!paypalRes.ok || !paypalRes.data.approveUrl) {
      setPlaceNote({
        text:
          paypalRes.data.message ||
          "Order was placed, but we could not start PayPal payment. Please contact us.",
        error: true,
      });
      setPayingPaypal(false);
      return;
    }

    clear();
    window.location.href = paypalRes.data.approveUrl;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Interquark" className="h-5 w-auto" />
        </Link>
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-signal">
          &larr; Back to store
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="mb-1.5 text-2xl font-bold">{t("checkout.title")}</h1>
        <p className="mb-7 text-sm text-slate-500">
          {t("checkout.subtitle")}
        </p>

        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-16 text-center text-slate-400">
            <p className="mb-2">{t("checkout.emptyCart")}</p>
            <Link to="/" className="font-semibold text-signal">
              {t("checkout.browseServices")} &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px]">
            <div>
              <div className="mb-5 rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{t("checkout.orderSummary")}</h2>
                  <Link to="/" className="text-xs font-semibold text-signal hover:underline">
                    + Add another service
                  </Link>
                </div>
                <p className="mb-4 text-xs text-slate-400">
                  {items.length} service{items.length > 1 ? "s" : ""} in your order
                </p>
                {items.map((c) => (
                  <div
                    key={c.cartId}
                    className="flex items-start justify-between gap-3 border-b border-slate-100 py-3.5 last:border-none"
                  >
                    <div>
                      <b className="block text-sm">{c.name}</b>
                      <span className="text-xs text-slate-400">
                        {c.sku} — {c.tier}
                      </span>
                      {c.features && c.features.length > 0 && (
                        <ul className="mt-1.5 flex flex-col gap-0.5">
                          {c.features.map((f) => (
                            <li key={f} className="flex items-start gap-1 text-[11px] text-slate-400">
                              <span className="text-mint">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap font-mono font-bold text-signal">
                        {money(c.price)}
                      </span>
                      <button
                        onClick={() => removeItem(c.cartId)}
                        aria-label={`Remove ${c.name}`}
                        className="text-xs font-semibold text-slate-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-1 text-sm font-semibold">Your details</h2>
                <p className="mb-4 text-xs text-slate-400">
                  {token
                    ? "We'll use your account details for this order."
                    : "Sign in to place your order."}
                </p>

                {token && user ? (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-2.5 rounded-lg bg-green-50 px-3.5 py-3 text-sm font-semibold text-green-700">
                      <span>✓ Signed in as {user.fullName || user.email}</span>
                      <button
                        onClick={logout}
                        className="text-xs font-semibold text-green-700 underline hover:text-green-800"
                      >
                        Sign out
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                        EMAIL
                      </label>
                      <input
                        value={user.email}
                        disabled
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
                      <button
                        onClick={() => { setAuthTab("signin"); setAuthNote(""); }}
                        className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
                          authTab === "signin" ? "bg-white text-signal shadow-sm" : "text-slate-500"
                        }`}
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => { setAuthTab("signup"); setAuthNote(""); }}
                        className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
                          authTab === "signup" ? "bg-white text-signal shadow-sm" : "text-slate-500"
                        }`}
                      >
                        Create account
                      </button>
                    </div>

                    {authTab === "signin" ? (
                      <>
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                            {t("checkout.email").toUpperCase()}
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                            {t("checkout.password").toUpperCase()}
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleSignIn}
                          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 text-[13.5px] font-semibold text-slate-900 hover:border-signal hover:text-signal"
                        >
                          {t("checkout.signIn")}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                            FULL NAME
                          </label>
                          <input
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                            {t("checkout.email").toUpperCase()}
                          </label>
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[11.5px] font-semibold text-slate-400">
                            {t("checkout.password").toUpperCase()}
                          </label>
                          <input
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleSignUp}
                          disabled={signupBusy}
                          className="w-full rounded-lg bg-signal py-2.5 text-[13.5px] font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                        >
                          {signupBusy ? "Creating account..." : "Create account"}
                        </button>
                      </>
                    )}
                    <p className="mt-3 text-center text-xs text-slate-400">{authNote}</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-1 text-sm font-semibold">{t("checkout.total")}</h2>
                <p className="mb-4 text-xs text-slate-400">
                  Card payments are handled securely by Stripe or PayPal.
                </p>
                <div className="flex justify-between py-1.5 text-[13.5px] text-slate-500">
                  <span>{t("checkout.subtotal")}</span>
                  <span>{money(total)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-3.5 text-lg font-bold">
                  <span>{t("checkout.total")}</span>
                  <span className="font-mono text-signal">{money(total)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={placing || payingPaypal}
                  className="mt-4 w-full rounded-lg bg-signal py-3.5 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                >
                  {placing ? "Redirecting..." : t("checkout.payByCard")}
                </button>
                <button
                  onClick={placeOrderWithPaypal}
                  disabled={placing || payingPaypal}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-900 hover:border-signal hover:text-signal disabled:opacity-60"
                >
                  {payingPaypal ? "Redirecting..." : t("checkout.payByPaypal")}
                </button>
                {placeNote && (
                  <p
                    className={`mt-3 text-center text-xs ${
                      placeNote.error ? "text-red-500" : "text-slate-400"
                    }`}
                  >
                    {placeNote.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
