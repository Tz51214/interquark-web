import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/interquark-wordmark-navy.png";

interface DashboardHeaderProps {
  portalName: string;
}

export default function DashboardHeader({ portalName }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("interquark_theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("interquark_theme", dark ? "dark" : "light");
  }, [dark]);

  const initial = (user?.fullName || user?.email || "?")[0]?.toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Interquark" className="h-5 w-auto dark:invert" />
        </a>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {portalName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-500 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-400"
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-sm font-bold text-white"
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-48 rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-4 py-2 text-sm dark:border-slate-700">
                <b className="block truncate">{user?.fullName || user?.email}</b>
                <span className="text-xs text-slate-400">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
