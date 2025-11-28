const API_URL = "http://localhost:8080";

// --- CONFIGURAÇÃO, TOKENS E USUÁRIO ---

export function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
}

export function setToken(token) {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
}

// 🟢 NOVO: Pegar dados do usuário logado (salvos no login)
export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser"); // Limpa usuário também
    window.location.href = "/"; 
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    
    if (res.status === 401) { logout(); return; }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    if (res.status === 204) return null; 
    
    return res.json();
  } catch (error) {
    console.error(`Erro na requisição ${path}:`, error);
    throw error;
  }
}

// --- AUTENTICAÇÃO ---

export async function apiRegister(userData) {
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify(userData) });
}

export async function apiLogin({ email, senha }) {
  const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) });
  
  if (data.token) setToken(data.token);
  // 🟢 NOVO: Salva os dados do usuário (ID, Nome, Email) para usarmos no Perfil
  if (data.usuario) localStorage.setItem("currentUser", JSON.stringify(data.usuario));
  
  return data;
}

// --- USUÁRIOS ---

export async function apiGetAllUsers() { return apiFetch("/usuarios"); }
export async function apiGetManicures() { return apiFetch("/usuarios"); }

// 🟢 NOVO: Buscar detalhes completos de um usuário por ID
export async function apiGetUserById(id) {
    return apiFetch(`/usuarios/${id}`);
}

// 🟢 NOVO: Atualizar usuário (PUT)
export async function apiUpdateUser(id, userData) {
    return apiFetch(`/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData)
    });
}

// --- AGENDAMENTO ---
export async function apiCreateAgendamento(data) { return apiFetch("/agendamentos", { method: "POST", body: JSON.stringify(data) }); }
export async function apiGetAgendamento() { return apiFetch("/agendamentos/meus"); }
export async function apiGetAgendamentoById(id) { return apiFetch(`/agendamentos/${id}`); }
export async function apiDeleteAgendamento(id) { return apiFetch(`/agendamentos/${id}`, { method: "DELETE" }); }

// --- POSTS ---
export async function apiGetPosts() { return apiFetch("/posts"); }
export async function apiCreatePost(data) { return apiFetch("/posts", { method: "POST", body: JSON.stringify(data) }); }
export async function apiGetMyPosts() { return apiFetch("/posts/my"); }
export async function apiDeletePost(id) { return apiFetch(`/posts/${id}`, { method: "DELETE" }); }

// --- SEGUIR ---
export async function apiFollowUser(userId) { return apiFetch(`/api/follow`, { method: "POST", body: JSON.stringify({ seguidoId: userId }) }); }
export async function apiUnfollowUser(userId) { return apiFetch(`/api/follow`, { method: "DELETE", body: JSON.stringify({ seguidoId: userId }) }); }
export async function apiGetFollowStatus(userId) { return apiFetch(`/api/follow/status/${userId}`, { method: "GET" }); }