const API_URL = "http://localhost:8080";

// Pegar token do localStorage
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Salvar token
export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

// Logout
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// Fetch genérico com JWT
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    let errorMessage = res.statusText;
    if (contentType?.includes("application/json")) {
      const errorJson = await res.json();
      // Ajuste na lógica de erro para pegar a mensagem de erro da API
      errorMessage = errorJson.erro || JSON.stringify(errorJson);
    } else {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null; // No Content
  return res.json();
}

// 🚀 REGISTRO CORRIGIDO: Aceita o objeto de dados completo (userData)
export async function apiRegister(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    // Envia o objeto JSON COMPLETO criado no componente Cadastrar.jsx
    body: JSON.stringify(userData), 
  });
}

// Login
export async function apiLogin({ email, senha }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  if (data.token) setToken(data.token);
  return data;
}

// Buscar posts
export async function apiGetPosts() {
  return apiFetch("/posts");
}

// Buscar usuário logado
export async function apiGetUser() {
  return apiFetch("/user/me");
}

// Criar novo post
export async function apiCreatePost({ titulo, descricao, urlImagem }) {
  // O apiFetch adicionará o token JWT automaticamente
  return apiFetch("/posts", { 
    method: "POST",
    body: JSON.stringify({ titulo, descricao, urlImagem }),
  });
}