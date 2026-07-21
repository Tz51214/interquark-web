import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { apiFetch } from "../lib/api";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string; user?: AuthUser }>;
  logout: () => void;
  refresh: () => Promise<string | null>;
  // Directly injects a session — used by the impersonation ("login as
  // customer") flow, which arrives with tokens already issued rather
  // than going through the normal login form.
  setSession: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const { ok, data } = await apiFetch<{ accessToken?: string; user?: AuthUser }>(
      "/auth/refresh",
      { method: "POST" },
    );
    if (ok && data.accessToken) {
      setToken(data.accessToken);
      setUser(data.user ?? null);
      return data.accessToken;
    }
    setToken(null);
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    // Skip the auto-refresh when arriving via an impersonation link —
    // Customer.tsx (or Freelancer.tsx) will call setSession() itself
    // once it redeems the code. Without this, refresh() races against
    // that and reliably wins, wiping out the freshly-set session with
    // a null token since there's no real refresh cookie for the
    // impersonated account yet.
    const hasImpersonationCode = new URLSearchParams(window.location.search).has(
      "impersonate",
    );
    if (hasImpersonationCode) {
      setReady(true);
      return;
    }
    refresh().finally(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { ok, data } = await apiFetch<{
      accessToken?: string;
      user?: AuthUser;
      message?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!ok || !data.accessToken) {
      return { ok: false, message: data.message || "Sign in failed." };
    }

    setToken(data.accessToken);
    setUser(data.user ?? null);
    return { ok: true, user: data.user };
  }, []);

  const logout = useCallback(() => {
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  const setSession = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    setReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, ready, login, logout, refresh, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
