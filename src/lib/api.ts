// Change this when you deploy the backend somewhere other than localhost.
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

interface ApiOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<{ ok: boolean; status: number; data: T }> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    // Required so the browser sends/receives the httpOnly refresh
    // token cookie. Without this, /auth/refresh and /auth/logout
    // won't see the cookie at all.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  let data = {} as T;
  try {
    data = await res.json();
  } catch {
    // non-JSON response, leave data as {}
  }

  return { ok: res.ok, status: res.status, data };
}

// New — for multipart/form-data uploads (file attachments). Doesn't
// set Content-Type manually; the browser sets it (with the correct
// boundary) automatically when the body is a FormData instance.
export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
  token?: string | null,
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  let data = {} as T;
  try {
    data = await res.json();
  } catch {
    // non-JSON response, leave data as {}
  }

  return { ok: res.ok, status: res.status, data };
}
