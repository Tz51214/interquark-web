import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import logo from "../../assets/interquark-wordmark-navy.png";

export default function FreelancerSignIn() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <img src={logo} alt="Interquark" className="mb-4 h-7 w-auto" />
        <h1 className="mb-1 text-xl font-bold">Freelancer sign in</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to view your projects and payouts.</p>
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
