import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FreelancerProvider } from "../../context/FreelancerContext";
import PortalSidebar from "../../components/layout/PortalSidebar";
import FreelancerSignIn from "./FreelancerSignIn";
import SupportWidget from "../../components/SupportWidget";

const navItems = [
  { label: "Overview", to: "/freelancer" },
  { label: "Membership", to: "/freelancer/membership" },
  { label: "Billing history", to: "/freelancer/billing" },
  { label: "Payouts", to: "/freelancer/payouts" },
  { label: "Projects", to: "/freelancer/projects" },
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
    <FreelancerProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        <PortalSidebar portalName="Freelancer" navItems={navItems} />
        <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          <Outlet />
          <SupportWidget audience="freelancer" />
        </main>
      </div>
    </FreelancerProvider>
  );
}
