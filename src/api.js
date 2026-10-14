const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://contextgraph-7k4e.onrender.com"
).replace(/\/+$/, "") + "/api";

export function saveToken(token) {
  if (token) {
    localStorage.setItem("contextgraph_token", token);
  }
}

export function getToken() {
  return localStorage.getItem("contextgraph_token");
}

export function logout() {
  localStorage.removeItem("contextgraph_token");
  localStorage.removeItem("contextgraph_user");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // FormData must not have a manually assigned Content-Type.
  // The browser automatically adds the multipart boundary.
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      "Cannot connect to ContextGraph backend. Check your internet connection, Render status, and CORS configuration."
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? data.error || data.message || data.detail
        : typeof data === "string"
          ? data.trim()
          : "";

    if (response.status === 401) {
      throw new Error(
        message || "Session expired or invalid. Please log in again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        message || "You do not have permission to perform this action."
      );
    }

    throw new Error(
      message ||
        `Request failed with HTTP ${response.status}. Check Render logs.`
    );
  }

  return data;
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.token) {
    throw new Error(
      "Login response did not contain an authentication token."
    );
  }

  saveToken(data.token);
  return data;
}

export async function register(name, email, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!data?.token) {
    throw new Error(
      "Registration response did not contain an authentication token."
    );
  }

  saveToken(data.token);
  return data;
}

export function getDocuments() {
  return request("/documents");
}

export function uploadDocument(file) {
  if (!file) {
    return Promise.reject(new Error("Please select a file to upload."));
  }

  const form = new FormData();
  form.append("file", file);

  return request("/documents/upload", {
    method: "POST",
    body: form,
  });
}

export function deleteDocument(id) {
  if (id == null) {
    return Promise.reject(new Error("Document ID is missing."));
  }

  return request(`/documents/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function searchDocuments(query) {
  return request(`/search?q=${encodeURIComponent(query)}`);
}

export function getSearchUnderstanding(query) {
  return request(
    `/search/understanding?q=${encodeURIComponent(query)}`
  );
}

export function getGraphNodes() {
  return request("/graph/nodes");
}

export function getGraphRelations(id) {
  return request(`/graph/relations/${encodeURIComponent(id)}`);
}

export function checkBackend() {
  return request("/health");
}
