const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // send/receive the httpOnly auth cookie
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some error pages) — leave data as null
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }

  return data;
}

// ---- auth ----
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
};

// ---- music ----
export const musicApi = {
  list: ({ q = "", page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (q) params.set("q", q);
    return request(`/music?${params.toString()}`);
  },
  get: (id) => request(`/music/${id}`),
  create: (payload) => request("/music", { method: "POST", body: payload }),
  toggleLike: (id) => request(`/music/${id}/like`, { method: "POST" }),
  liked: () => request("/music/liked/me"),
};

// ---- playlists ----
export const playlistApi = {
  list: () => request("/playlist"),
  get: (id) => request(`/playlist/${id}`),
  create: (payload) => request("/playlist", { method: "POST", body: payload }),
  addTrack: (id, musicId) => request(`/playlist/${id}/tracks`, { method: "POST", body: { musicId } }),
  removeTrack: (id, musicId) => request(`/playlist/${id}/tracks/${musicId}`, { method: "DELETE" }),
  remove: (id) => request(`/playlist/${id}`, { method: "DELETE" }),
};

export { ApiError };
