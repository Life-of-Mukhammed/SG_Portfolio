import type { Project } from "@/lib/types";

export type ProjectFilters = {
  category?: string;
  status?: string;
  q?: string;
};

const base = (typeof window === "undefined" ? process.env.NEXT_PUBLIC_BASE_URL : "") || "";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  listProjects(filters: ProjectFilters = {}) {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && qs.set(k, String(v)));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return http<{ data: Project[] }>(`/api/projects${suffix}`);
  },
  getProject(id: string) {
    return http<{ data: Project }>(`/api/projects/${id}`);
  },
  createProject(input: Partial<Project>) {
    return http<{ data: Project }>(`/api/projects`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateProject(id: string, input: Partial<Project>) {
    return http<{ data: Project }>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  deleteProject(id: string) {
    return http<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" });
  },
  login(email: string, password: string) {
    return http<{ ok: true }>(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    return http<{ ok: true }>(`/api/auth/logout`, { method: "POST" });
  },
  me() {
    return http<{ user: { email: string; role: string } | null }>(`/api/auth/me`);
  },
};
