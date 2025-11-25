const API_URL = "http://localhost:8080";

// --- Funções de Autenticação e Configuração ---

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
      // Tentativa de pegar a mensagem de erro da API, se existir
      errorMessage = errorJson.message || errorJson.erro || JSON.stringify(errorJson);
    } else {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null; // No Content
  return res.json();
}

// --- Funções de Autenticação ---

export async function apiRegister(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function apiLogin({ email, senha }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  if (data.token) setToken(data.token);
  return data;
}

// Buscar usuário logado
export async function apiGetUser() {
  return apiFetch("/user/me");
}

// --- Funções de Posts (CRUD) ---

// 1. 📖 Buscar todos os posts (Feed Geral)
export async function apiGetPosts() {
  return apiFetch("/posts", {
    // Não precisa de token para o feed geral, mas o apiFetch envia se existir.
    headers: {}, 
  }); 
}

// 2. 📝 Criar novo post
export async function apiCreatePost({ titulo, descricao, urlImagem }) {
  // O apiFetch adicionará o token JWT automaticamente
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ titulo, descricao, urlImagem }),
  });
} 

// 3. 👤 Buscar posts do usuário logado (MyFeed)
export async function apiGetMyPosts() {
  // O apiFetch enviará o JWT para o endpoint /posts/my
  return apiFetch("/posts/my");
}

// 4. ✏️ Editar um post
export async function apiUpdatePost(postId, { titulo, descricao, urlImagem }) {
  return apiFetch(`/posts/${postId}`, {
    method: "PUT",
    // Enviamos o post atualizado, incluindo a urlImagem
    body: JSON.stringify({ titulo, descricao, urlImagem }), 
  });
}

// 5. 🗑️ Deletar um post
export async function apiDeletePost(postId) {
  return apiFetch(`/posts/${postId}`, {
    method: "DELETE",
  });
}
// --- Funções de Agendamentos (CRUD) ---

// 📌 Criar um agendamento
export async function apiCreateAppointment(data) {
  return apiFetch("/agendamentos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 📌 Listar todos os agendamentos
export async function apiGetAppointments() {
  return apiFetch("/agendamentos");
}

// 📌 Buscar agendamento por ID
export async function apiGetAppointmentById(appointmentId) {
  return apiFetch(`/agendamentos/${appointmentId}`);
}

// 📌 Atualizar agendamento
export async function apiUpdateAppointment(appointmentId, data) {
  return apiFetch(`/agendamentos/${appointmentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 📌 Deletar agendamento
export async function apiDeleteAppointment(appointmentId) {
  return apiFetch(`/agendamentos/${appointmentId}`, {
    method: "DELETE",
  });
}
