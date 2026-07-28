import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FreelancerProvider } from "../../context/FreelancerContext";
import PortalSidebar from "../../components/layout/PortalSidebar";
import FreelancerSignIn from "./FreelancerSignIn";
import SupportWidget from "../../components/SupportWidget";
import { apiFetch } from "../../lib/api";

const navItems = [
  { label: "Dashboard", to: "/freelancer", icon: "🏠" },
  { label: "Tasks", to: "/freelancer/tasks", icon: "📋" },
  { label: "Membership", to: "/freelancer/membership", icon: "⭐" },
  { label: "Billing history", to: "/freelancer/billing", icon: "💳" },
  { label: "Payouts", to: "/freelancer/payouts", icon: "💰" },
  { label: "Projects", to: "/freelancer/projects", icon: "📁" },
  { label: "Notifications", to: "/freelancer/notifications", icon: "🔔" },
  { label: "Refer a friend", to: "/freelancer/referrals", icon: "🎁" },
];

export default function FreelancerLayout() {
  const { token, user, ready } = useAuth();

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (token && user && user.role !== "freelancer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <h1 className="mb-2 text-xl font-bold text-red-600">Access denied</h1>
          <p className="text-sm text-slate-500">This account does not have freelancer access.</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <FreelancerSignIn />;
  }

  return (
    <PortalAccessGate token={token}>
    <FreelancerProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        <PortalSidebar portalName="Freelancer" navItems={navItems} />
        <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          <Outlet />
          <SupportWidget audience="freelancer" />
        </main>
      </div>
    </FreelancerProvider>
    </PortalAccessGate>
  );
}

function PortalAccessGate({ token, children }: { token: string; children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
  const location = useLocation();
  // The membership page itself must always be reachable — otherwise
  // an unsubscribed freelancer would have nowhere to actually pay.
  const isMembershipPage = location.pathname.startsWith("/freelancer/membership");

  useEffect(() => {
    apiFetch<{ hasAccess: boolean }>("/portal-access", { token }).then(({ ok, data }) => {
      setHasAccess(ok ? data.hasAccess : true); // fail open on network errors
      setChecking(false);
    });
  }, [token]);

  if (isMembershipPage) {
    return <>{children}</>;
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50" />;
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
        <div className="max-w-sm">
          <div className="mb-3 text-3xl">🔒</div>
          <h1 className="mb-2 text-xl font-bold text-ink dark:text-white">
            Active subscription required
          </h1>
          <p className="mb-5 text-sm text-slate-500">
            Your freelancer portal unlocks once your membership subscription is active.
          </p>
          <Link
            to="/freelancer/membership"
            className="inline-block rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-dark"
          >
            View membership plans
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
