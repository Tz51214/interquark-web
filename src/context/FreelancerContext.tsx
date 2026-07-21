import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";

export interface Project {
  id: string;
  name: string;
  status: string;
  value?: number;
}

export interface Subscription {
  id: string;
  tier: string;
  status: string;
  price: number;
  currentPeriodEnd?: string;
}

export interface Payout {
  id: string;
  project: { id: string; name?: string } | null;
  amount: number;
  status: string;
  notes?: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface FreelancerContextValue {
  projects: Project[];
  subscription: Subscription | null;
  billingHistory: PaymentRecord[];
  payouts: Payout[];
  loading: boolean;
  reload: () => Promise<void>;
}

const FreelancerContext = createContext<FreelancerContextValue | null>(null);

export function FreelancerProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const authedFetch = useAuthedFetch();

  const [projects, setProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<PaymentRecord[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [projectsRes, subRes, payoutsRes] = await Promise.all([
      authedFetch<Project[]>("/projects/mine"),
      authedFetch<Subscription[]>("/subscriptions/mine"),
      authedFetch<Payout[]>("/payouts/mine"),
    ]);
    if (projectsRes.ok && Array.isArray(projectsRes.data)) setProjects(projectsRes.data);
    if (subRes.ok && Array.isArray(subRes.data) && subRes.data.length > 0) {
      const sub = subRes.data[0];
      setSubscription(sub);
      const historyRes = await authedFetch<PaymentRecord[]>(
        `/subscriptions/${sub.id}/billing-history`,
      );
      if (historyRes.ok && Array.isArray(historyRes.data)) setBillingHistory(historyRes.data);
    } else {
      setSubscription(null);
      setBillingHistory([]);
    }
    if (payoutsRes.ok && Array.isArray(payoutsRes.data)) setPayouts(payoutsRes.data);
    setLoading(false);
  }, [authedFetch]);

  useEffect(() => {
    if (token) reload();
  }, [token, reload]);

  return (
    <FreelancerContext.Provider
      value={{ projects, subscription, billingHistory, payouts, loading, reload }}
    >
      {children}
    </FreelancerContext.Provider>
  );
}

export function useFreelancerData() {
  const ctx = useContext(FreelancerContext);
  if (!ctx) throw new Error("useFreelancerData must be used within FreelancerProvider");
  return ctx;
}
