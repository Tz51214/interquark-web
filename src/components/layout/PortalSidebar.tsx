import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/interquark-wordmark-navy.png";

interface NavItem {
  label: string;
  href: string;
}

interface PortalSidebarProps {
  portalName: string;
  navItems: NavItem[];
}

export default function PortalSidebar({ portalName, navItems }: PortalSidebarProps) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(
    () => localStorage.getItem("interquark_theme") === "dark",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("interquark_theme", dark ? "dark" : "light");
  }, [dark]);

  const initial = (user?.fullName || user?.email || "?")[0]?.toUpperCase();

  const content = (
    <>
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-2 pb-4 mb-4 dark:border-slate-700">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Interquark" className="h-5 w-auto dark:invert" />
        </a>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {portalName}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-left text-sm text-slate-500 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-400"
        >
          {dark ? "☀️ Light mode" : "🌙 Dark mode"}
        </button>
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-xs font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{user?.fullName || user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-700 dark:bg-slate-900">
        <img src={logo} alt="Interquark" className="h-5 w-auto dark:invert" />
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>
      {mobileOpen && (
        <div className="flex flex-col border-b border-slate-200 bg-white p-4 md:hidden dark:border-slate-700 dark:bg-slate-900">
          {content}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex dark:border-slate-700 dark:bg-slate-900">
        {content}
      </aside>
    </>
  );
}
