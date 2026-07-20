import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "interquark_cookie_notice_dismissed";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] border-t border-line bg-ink px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="font-body text-sm text-slate-300">
          We use essential cookies to keep you signed in and remember your cart. We don't use
          tracking or advertising cookies.{" "}
          <Link to="/privacy" className="text-signal hover:underline">
            Learn more
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="w-full flex-shrink-0 rounded-lg bg-signal px-4 py-2 font-body text-sm font-semibold text-white hover:bg-signal-dark sm:w-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
