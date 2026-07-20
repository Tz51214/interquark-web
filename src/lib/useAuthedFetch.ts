import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "./api";

export function useAuthedFetch() {
  const { token, refresh, logout } = useAuth();

  return useCallback(
    async <T = unknown,>(path: string, options: RequestInit = {}) => {
      let result = await apiFetch<T>(path, { ...options, token });

      // Access token likely expired (they only last 15 minutes) — try
      // a silent refresh once using the httpOnly cookie, then retry
      // the original request with the new token.
      if (result.status === 401) {
        const newToken = await refresh();
        if (newToken) {
          result = await apiFetch<T>(path, { ...options, token: newToken });
        } else {
          logout();
        }
      }

      return result;
    },
    [token, refresh, logout],
  );
}
