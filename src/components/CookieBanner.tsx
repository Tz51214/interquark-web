import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "interquark_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface Consent {
  functional: boolean;
  analytics: boolean;
}

function applyConsent(consent: Consent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    functionality_storage: consent.functional ? "granted" : "denied",
    personalization_storage: consent.functional ? "granted" : "denied",
    ad_storage: "denied", // we don't run ads, so this stays off regardless
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const consent: Consent = JSON.parse(stored);
      applyConsent(consent);
    } else {
      setVisible(true);
    }
  }, []);

  function save(consent: Consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
    setVisible(false);
  }

  function acceptAll() {
    save({ functional: true, analytics: true });
  }

  function savePreferences() {
    save({ functional, analytics });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] border-t border-line bg-ink px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-body text-sm text-slate-300">
          We use cookies to keep you signed in, remember your cart, and understand how visitors
          use our site. You can accept all cookies or choose your preferences below.{" "}
          <Link to="/privacy" className="text-signal hover:underline">
            Privacy Policy
          </Link>
        </p>

        {showDetails && (
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-line bg-ink-light p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm font-semibold text-white">Required cookies</p>
                <p className="font-body text-xs text-slate-400">
                  Keeps you signed in and remembers your cart. Always on.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-500">ALWAYS ON</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm font-semibold text-white">Functional cookies</p>
                <p className="font-body text-xs text-slate-400">
                  Remembers preferences like dark mode.
                </p>
              </div>
              <button
                onClick={() => setFunctional((f) => !f)}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${
                  functional ? "bg-signal text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                {functional ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-body text-sm font-semibold text-white">Analytics cookies</p>
                <p className="font-body text-xs text-slate-400">
                  Helps us understand how visitors use the site (Google Analytics).
                </p>
              </div>
              <button
                onClick={() => setAnalytics((a) => !a)}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${
                  analytics ? "bg-signal text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                {analytics ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setShowDetails((s) => !s)}
            className="rounded-lg border border-slate-600 px-4 py-2 font-body text-sm font-semibold text-slate-300 hover:border-signal hover:text-signal"
          >
            {showDetails ? "Hide preferences" : "Manage preferences"}
          </button>
          {showDetails && (
            <button
              onClick={savePreferences}
              className="rounded-lg border border-slate-600 px-4 py-2 font-body text-sm font-semibold text-slate-300 hover:border-signal hover:text-signal"
            >
              Save preferences
            </button>
          )}
          <button
            onClick={acceptAll}
            className="rounded-lg bg-signal px-4 py-2 font-body text-sm font-semibold text-white hover:bg-signal-dark"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
