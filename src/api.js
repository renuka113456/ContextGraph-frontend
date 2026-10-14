
const API_BASE = "https://contextgraph-7k4e.onrender.com/api";

export function saveToken(token) {
  localStorage.setItem("contextgraph_token", token);
}

export function getToken() {
  return localStorage.getItem("contextgraph_token");
}

export function logout() {
  localStorage.removeItem("contextgraph_token");
}

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      (await response.text()) || `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveToken(data.token);
  return data;
}

export async function register(name, email, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveToken(data.token);
  return data;
}

export function getDocuments() {
  return request("/documents");
}

export function uploadDocument(file) {
  const form = new FormData();
  form.append("file", file);
  return request("/documents/upload", {
    method: "POST",
    body: form,
  });
}

export function deleteDocument(id) {
  return request(`/documents/${id}`, {
    method: "DELETE",
  });
}

export function searchDocuments(query) {
  return request(`/search?q=${encodeURIComponent(query)}`);
}

export function getSearchUnderstanding(query) {
  return request(`/search/understanding?q=${encodeURIComponent(query)}`);
}

export function getGraphNodes() {
  return request("/graph/nodes");
}

export function getGraphRelations(id) {
  return request(`/graph/relations/${id}`);
}

export function checkBackend() {
  return request("/health");
}
