const BASE = "/api/admin";

function getToken() {
  return localStorage.getItem("admin_token") || "";
}

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const adminApi = {
  login: (password: string) =>
    req<{ token: string }>("POST", "/login", { password }),
  logout: () => req<void>("POST", "/logout"),
  me: () => req<{ authenticated: boolean }>("GET", "/me"),
  stats: () =>
    req<{
      totalRequests: number;
      approved: number;
      pending: number;
      rejected: number;
      todayRequests: number;
      weekRequests: number;
    }>("GET", "/stats"),
  leads: {
    list: (params?: { status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.status && params.status !== "all") q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      return req<Lead[]>("GET", `/leads?${q.toString()}`);
    },
    get: (id: number) => req<Lead>("GET", `/leads/${id}`),
    update: (id: number, data: Partial<Lead>) =>
      req<Lead>("PATCH", `/leads/${id}`, data),
    delete: (id: number) => req<{ success: boolean }>("DELETE", `/leads/${id}`),
  },
  webhook: {
    get: () => req<WebhookSettings>("GET", "/webhook"),
    save: (data: { label?: string; url: string; enabled?: boolean }) =>
      req<WebhookSettings>("PUT", "/webhook", data),
    test: (url: string) =>
      req<{ success: boolean; status: number; message: string }>("POST", "/webhook/test", { url }),
  },
};

export interface Lead {
  id: number;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  country: string;
  requirement: string;
  referralSource?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookSettings {
  id: number;
  label: string;
  url: string;
  enabled: boolean;
  updatedAt: string;
}
