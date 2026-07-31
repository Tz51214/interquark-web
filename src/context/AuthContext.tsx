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
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string; user?: AuthUser; accessToken?: string }>;
  logout: () => void;
  refresh: () => Promise<string | null>;
  // Directly injects a session — used by the impersonation ("login as
  // customer") flow, which arrives with tokens already issued rather
  // than going through the normal login form.
  setSession: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The refresh token used to live only in an httpOnly cookie — but
// with the frontend and API on genuinely different domains, browsers
// increasingly block that cookie outright (third-party cookie
// blocking, independent of SameSite/Secure settings). Stored here in
// localStorage instead, sent explicitly on every /auth/refresh call,
// so login persistence doesn't depend on cross-site cookies at all.
const REFRESH_STORAGE_KEY = "interquark_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!storedRefreshToken) {
      setToken(null);
      setUser(null);
      return null;
    }

    const { ok, data } = await apiFetch<{
      accessToken?: string;
      refreshToken?: string;
      user?: AuthUser;
    }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    if (ok && data.accessToken) {
      setToken(data.accessToken);
      setUser(data.user ?? null);
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_STORAGE_KEY, data.refreshToken);
      }
      return data.accessToken;
    }

    // Stored token is invalid/expired — clear it so we don't keep
    // retrying with a dead token on every future page load.
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    setToken(null);
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    // Skip the auto-refresh when arriving via an impersonation link —
    // Customer.tsx (or Freelancer.tsx) will call setSession() itself
    // once it redeems the code. Without this, refresh() races against
    // that and reliably wins, wiping out the freshly-set session with
    // a null token since there's no real refresh token for the
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
      refreshToken?: string;
      user?: AuthUser;
      message?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!ok || !data.accessToken) {
      return { ok: false, message: data.message || "Sign in failed." };
    }

    if (data.refreshToken) {
      localStorage.setItem(REFRESH_STORAGE_KEY, data.refreshToken);
    }
    setToken(data.accessToken);
    setUser(data.user ?? null);
    return { ok: true, user: data.user, accessToken: data.accessToken };
  }, []);

  const logout = useCallback(() => {
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem(REFRESH_STORAGE_KEY);
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
