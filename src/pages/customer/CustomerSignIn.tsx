import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { apiFetch } from "../../lib/api";
import logo from "../../assets/interquark-wordmark-navy.png";

export default function CustomerSignIn() {
  const { login, user, setSession } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("impersonate");
    if (!code) return;

    setImpersonating(true);
    apiFetch<{ accessToken?: string; user?: typeof user; message?: string }>(
      "/auth/impersonate/redeem",
      { method: "POST", body: JSON.stringify({ code }) },
    ).then(({ ok, data }) => {
      if (ok && data.accessToken && data.user) {
        setSession(data.accessToken, data.user);
        showToast("Signed in as customer", "success");
      } else {
        showToast(data.message || "This login link has expired.", "error");
      }
      window.history.replaceState({}, "", "/customer");
      setImpersonating(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin() {
    if (!email || !password) {
      setNote("Please enter your email and password.");
      return;
    }
    setLoginBusy(true);
    setNote("Signing in...");
    const result = await login(email, password);
    setLoginBusy(false);
    setNote(result.ok ? "" : result.message || "Sign in failed.");
    if (result.ok) showToast("Signed in", "success");
  }

  if (impersonating) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
      <img src={logo} alt="Interquark" className="h-7 w-auto" />
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold">Customer sign in</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to view your orders and projects.</p>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-signal focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-signal focus:outline-none"
          />
          <button
            onClick={handleLogin}
            disabled={loginBusy}
            className="rounded-lg bg-signal py-2.5 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
          >
            {loginBusy ? "Signing in..." : "Sign in"}
          </button>
          {note && <p className="text-center text-xs text-red-500">{note}</p>}
        </div>
      </div>
    </div>
  );
}
