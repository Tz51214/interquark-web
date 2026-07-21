import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
}

const freelancerTiers = [
  { id: "associate", name: "Associate", desc: "Shadow one active project, chat access", price: 29 },
  { id: "core", name: "Core contributor", desc: "Assigned tasks on 1-2 projects, priority pick", price: 79 },
  { id: "lead", name: "Lead collaborator", desc: "Co-own a project, client-facing, revenue share", price: 159 },
];

export default function JoinModal({ open, onClose }: JoinModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "join">("signin");
  const [success, setSuccess] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Sign in fields
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinNote, setSigninNote] = useState("Enter your credentials to sign in.");
  const [signinError, setSigninError] = useState(false);
  const [signinBusy, setSigninBusy] = useState(false);

  // Join fields
  const [joinName, setJoinName] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [selectedTier, setSelectedTier] = useState("core");
  const [joinNote, setJoinNote] = useState("Create your freelancer account.");
  const [joinError, setJoinError] = useState(false);
  const [joinBusy, setJoinBusy] = useState(false);

  if (!open) return null;

  function reset() {
    setSuccess(null);
    setTab("signin");
    setSigninEmail("");
    setSigninPassword("");
    setSigninNote("Enter your credentials to sign in.");
    setSigninError(false);
    setJoinName("");
    setJoinEmail("");
    setJoinPassword("");
    setJoinNote("Create your freelancer account.");
    setJoinError(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSignin() {
    if (!signinEmail || !signinPassword) {
      setSigninNote("Please fill in both fields.");
      setSigninError(true);
      return;
    }
    setSigninBusy(true);
    setSigninError(false);
    setSigninNote("Signing in...");

    const result = await login(signinEmail, signinPassword);

    if (!result.ok) {
      setSigninNote(result.message || "Sign in failed.");
      setSigninError(true);
      setSigninBusy(false);
      return;
    }

    setSuccess("Welcome back!");
    const role = result.user?.role;
    timeoutRef.current = setTimeout(() => {
      reset();
      onClose();
      if (role === "freelancer") navigate("/freelancer");
      else if (role === "client") navigate("/customer");
      else if (role === "admin") navigate("/admin");
    }, 1200);
  }

  async function handleJoin() {
    if (!joinName || !joinEmail || !joinPassword) {
      setJoinNote("Please fill in all fields.");
      setJoinError(true);
      return;
    }
    setJoinBusy(true);
    setJoinError(false);
    setJoinNote("Creating account...");

    const { ok, data } = await apiFetch<{ message?: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: joinName,
        email: joinEmail,
        password: joinPassword,
        role: "freelancer",
        tier: selectedTier,
      }),
    });

    if (!ok) {
      setJoinNote(data.message || "Registration failed.");
      setJoinError(true);
      setJoinBusy(false);
      return;
    }

    // Registration succeeded — log them straight in, then send them
    // to payment. The subscription only gets created once they pay,
    // so we can't skip this step.
    await login(joinEmail, joinPassword);

    const tier = freelancerTiers.find((t) => t.id === selectedTier)!;
    setSuccess(`Your account was created on the ${tier.name} plan. Redirecting to payment...`);
    timeoutRef.current = setTimeout(() => {
      reset();
      onClose();
      navigate(`/subscribe?tier=${selectedTier}&autopay=1`);
    }, 1500);
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-xl text-slate-400 hover:text-slate-700"
        >
          &times;
        </button>

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h2 className="mb-1 text-xl font-bold">
              {tab === "join" ? "Welcome to the studio" : "Signed in"}
            </h2>
            <p className="text-sm text-slate-500">{success}</p>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-xl font-bold">Join the studio</h2>
            <p className="mb-5 text-sm text-slate-500">
              Sign in to an existing account, or join as a freelancer with a monthly seat on
              active projects.
            </p>

            <div className="mb-5 flex gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setTab("signin")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  tab === "signin" ? "bg-white text-signal shadow-sm" : "text-slate-500"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setTab("join")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  tab === "join" ? "bg-white text-signal shadow-sm" : "text-slate-500"
                }`}
              >
                Join as freelancer
              </button>
            </div>

            {tab === "signin" ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSignin}
                  disabled={signinBusy}
                  className="rounded-lg bg-signal py-2.5 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                >
                  Sign in
                </button>
                <p className={`text-center text-xs ${signinError ? "text-red-500" : "text-slate-400"}`}>
                  {signinNote}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                    FULL NAME
                  </label>
                  <input
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {freelancerTiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTier(t.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        selectedTier === t.id
                          ? "border-signal bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <b className="text-sm">{t.name}</b>
                        <span className="font-mono text-sm font-bold text-signal">
                          £{t.price}/mo
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleJoin}
                  disabled={joinBusy}
                  className="rounded-lg bg-signal py-2.5 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                >
                  Join with selected plan
                </button>
                <p className={`text-center text-xs ${joinError ? "text-red-500" : "text-slate-400"}`}>
                  {joinNote}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
