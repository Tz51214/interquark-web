import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  items: { name: string; tier: string; price: number }[];
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface CustomerContextValue {
  orders: Order[];
  projects: Project[];
  invoices: Invoice[];
  loading: boolean;
  reload: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const authedFetch = useAuthedFetch();

  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [ordersRes, projectsRes, invoicesRes] = await Promise.all([
      authedFetch<Order[]>("/orders/mine"),
      authedFetch<Project[]>("/projects/mine"),
      authedFetch<Invoice[]>("/invoices/mine"),
    ]);
    if (ordersRes.ok && Array.isArray(ordersRes.data)) setOrders(ordersRes.data);
    if (projectsRes.ok && Array.isArray(projectsRes.data)) setProjects(projectsRes.data);
    if (invoicesRes.ok && Array.isArray(invoicesRes.data)) setInvoices(invoicesRes.data);
    setLoading(false);
  }, [authedFetch]);

  useEffect(() => {
    if (token) reload();
  }, [token, reload]);

  return (
    <CustomerContext.Provider value={{ orders, projects, invoices, loading, reload }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerData() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomerData must be used within CustomerProvider");
  return ctx;
}
