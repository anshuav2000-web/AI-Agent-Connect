const BASE = "/api/admin";

function getToken() { return localStorage.getItem("admin_token") || ""; }
function headers() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

async function req<T>(method: string, path: string, body?: unknown, base = BASE): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method, headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const adminApi = {
  login: (password: string) => req<{ token: string }>("POST", "/login", { password }),
  logout: () => req<void>("POST", "/logout"),
  me: () => req<{ authenticated: boolean }>("GET", "/me"),
  stats: () => req<Stats>("GET", "/stats"),
  leads: {
    list: (params?: { status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.status && params.status !== "all") q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      return req<Lead[]>("GET", `/leads?${q}`);
    },
    get: (id: number) => req<Lead>("GET", `/leads/${id}`),
    update: (id: number, data: Partial<Lead>) => req<Lead>("PATCH", `/leads/${id}`, data),
    delete: (id: number) => req<{ success: boolean }>("DELETE", `/leads/${id}`),
  },
  webhook: {
    get: () => req<WebhookSettings>("GET", "/webhook"),
    save: (data: { label?: string; url: string; enabled?: boolean }) => req<WebhookSettings>("PUT", "/webhook", data),
    test: (url: string) => req<{ success: boolean; status: number; message: string }>("POST", "/webhook/test", { url }),
  },
  siteSettings: {
    get: () => req<Record<string, string>>("GET", "/site-settings"),
    save: (data: Record<string, string>) => req<Record<string, string>>("PUT", "/site-settings", data),
  },
};

export interface Stats {
  totalRequests: number; approved: number; pending: number; rejected: number;
  todayRequests: number; weekRequests: number; monthRequests: number;
}
export interface Lead {
  id: number; fullName: string; companyName?: string; email: string;
  phone: string; country: string; consoleModel?: string;
  requirement: string; referralSource?: string; status: string;
  notes?: string; createdAt: string; updatedAt: string;
}
export interface WebhookSettings {
  id: number; label: string; url: string; enabled: boolean; updatedAt: string;
}
