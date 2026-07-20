import { useState, lazy, Suspense } from "react";
import { apiFetch } from "../lib/api";

const HeroSphere = lazy(() => import("./HeroSphere"));

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ open, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  async function submit() {
    if (!email) return;
    setStatus("sending");
    const { ok, data } = await apiFetch<{ message?: string }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setErrorMsg(data.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white hover:bg-white/20"
        >
          &times;
        </button>

        {/* Cinematic left panel */}
        <div className="relative hidden min-h-[420px] items-center justify-center overflow-hidden bg-ink md:flex">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <Suspense fallback={null}>
              <HeroSphere />
            </Suspense>
          </div>
          <div className="relative px-10 text-center">
            <span className="mb-3 block font-mono text-[11px] font-semibold tracking-wide text-signal">
              STAY IN THE LOOP
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight text-white">
              Build, ship, repeat.
            </h2>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
          {status === "sent" ? (
            <div className="text-center">
              <span className="mb-3 block text-3xl">✓</span>
              <h3 className="mb-2 font-display text-xl font-bold text-ink">You're subscribed</h3>
              <p className="font-body text-sm text-slate-500">
                We'll email you when there's something worth sharing — new services, platform
                updates, and occasional offers.
              </p>
            </div>
          ) : (
            <>
              <h3 className="mb-2 font-display text-2xl font-bold text-ink">
                Get updates from Interquark
              </h3>
              <p className="mb-6 font-body text-sm text-slate-500">
                Occasional emails about new services and platform updates. No spam, unsubscribe
                anytime.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mb-3 rounded-lg border border-slate-300 px-4 py-3 font-body text-sm focus:border-signal focus:outline-none"
              />
              <button
                onClick={submit}
                disabled={status === "sending"}
                className="rounded-lg bg-signal py-3 font-body text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
              >
                {status === "sending" ? "Subscribing..." : "Subscribe"}
              </button>
              {status === "error" && (
                <p className="mt-3 text-center font-body text-sm text-red-500">{errorMsg}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
