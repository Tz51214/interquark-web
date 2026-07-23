import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CustomerProvider } from "../../context/CustomerContext";
import PortalSidebar from "../../components/layout/PortalSidebar";
import CustomerSignIn from "./CustomerSignIn";

const navItems = [
  { label: "Overview", to: "/customer" },
  { label: "Orders", to: "/customer/orders" },
  { label: "Invoices", to: "/customer/invoices" },
  { label: "Projects", to: "/customer/projects" },
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
    <CustomerProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        <PortalSidebar portalName="Customer" navItems={navItems} />
        <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          <Outlet />
        </main>
      </div>
    </CustomerProvider>
  );
}
