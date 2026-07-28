import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CustomerProvider } from "../../context/CustomerContext";
import PortalSidebar from "../../components/layout/PortalSidebar";
import CustomerSignIn from "./CustomerSignIn";
import SupportWidget from "../../components/SupportWidget";
import { apiFetch } from "../../lib/api";

const navItems = [
  { label: "Dashboard", to: "/customer", icon: "🏠" },
  { label: "Orders", to: "/customer/orders", icon: "📦" },
  { label: "Invoices", to: "/customer/invoices", icon: "📄" },
  { label: "Projects", to: "/customer/projects", icon: "📁" },
  { label: "Notifications", to: "/customer/notifications", icon: "🔔" },
  { label: "Refer a friend", to: "/customer/referrals", icon: "🎁" },
];

export default function CustomerLayout() {
  const { token, user, ready } = useAuth();

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (token && user && user.role !== "client") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <h1 className="mb-2 text-xl font-bold text-red-600">Access denied</h1>
          <p className="text-sm text-slate-500">This account does not have customer access.</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <CustomerSignIn />;
  }

  return (
    <PortalAccessGate token={token}>
    <CustomerProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        <PortalSidebar portalName="Customer" navItems={navItems} />
        <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          <Outlet />
          <SupportWidget audience="customer" />
        </main>
      </div>
    </CustomerProvider>
    </PortalAccessGate>
  );
}

function PortalAccessGate({ token, children }: { token: string; children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    apiFetch<{ hasAccess: boolean }>("/portal-access", { token }).then(({ ok, data }) => {
      setHasAccess(ok ? data.hasAccess : true); // fail open on network errors
      setChecking(false);
    });
  }, [token]);

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
        <div className="max-w-sm">
          <div className="mb-3 text-3xl">🔒</div>
          <h1 className="mb-2 text-xl font-bold text-ink dark:text-white">
            No completed orders yet
          </h1>
          <p className="mb-5 text-sm text-slate-500">
            Your customer portal unlocks once you have a paid order. Browse our services to get
            started.
          </p>
          <Link
            to="/services"
            className="inline-block rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-dark"
          >
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
