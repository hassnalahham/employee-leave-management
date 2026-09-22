const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token");
}

// Thin fetch wrapper
async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  me: () => request("/auth/me"),

  myLeaves: () => request("/leaves/mine"),
  createLeave: (payload) =>
    request("/leaves", { method: "POST", body: payload }),
  deleteLeave: (id) => request(`/leaves/${id}`, { method: "DELETE" }),

  allLeaves: ({ status = "All", search = "" } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== "All") params.set("status", status);
    if (search) params.set("search", search);
    const qs = params.toString();
    return request(`/leaves${qs ? `?${qs}` : ""}`);
  },
  leave: (id) => request(`/leaves/${id}`),
  setLeaveStatus: (id, status) =>
    request(`/leaves/${id}/status`, { method: "PATCH", body: { status } }),
};
