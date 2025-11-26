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

/**
 * Fetch genérico com JWT.
 * Lida com headers, JSON body e tratamento de erros.
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  // Adiciona Content-Type se houver body
  if (options.body) headers["Content-Type"] = "application/json";
  // Adiciona o token JWT
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

  // Lida com 204 No Content (usado no unfollow e delete)
  if (res.status === 204 || res.status === 201 && options.method === 'POST' && !res.headers.get('content-type')) return null;
  
  // Retorna o JSON da resposta (status 200, 201 com body, etc.)
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
  return apiFetch("/usuarios/me");
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

// --- Funções de friend (Feed follow e unfolllaw) ---

export async function apiGetAllUsers() {
  // Assumindo um endpoint protegido que retorna uma lista de todos os usuários
  // (Pode precisar de autenticação via JWT)
  return apiFetch("/usuarios"); 
}

// --- Funções de Seguimento (Follow/Unfollow/Status) ---

/**
 * Inicia o seguimento de um usuário, enviando o ID no corpo JSON.
 * Mapeia para: POST /api/follow
 * @param {number} userId - ID do usuário a ser seguido (Seguido).
 */
export async function apiFollowUser(userId) {
  // ALTERAÇÃO: Envia o ID no corpo JSON e não na URL.
  return apiFetch(`/api/follow`, {
    method: "POST",
    body: JSON.stringify({ seguidoId: userId }),
  });
}

/**
 * Desfaz o seguimento de um usuário, enviando o ID no corpo JSON.
 * Mapeia para: DELETE /api/follow
 * @param {number} userId - ID do usuário que será deixado de seguir (Seguido).
 */
export async function apiUnfollowUser(userId) {
  // ALTERAÇÃO: Envia o ID no corpo JSON e não na URL.
  return apiFetch(`/api/follow`, {
    method: "DELETE",
    body: JSON.stringify({ seguidoId: userId }),
  });
}

/**
 * Verifica se o usuário logado está seguindo o usuário alvo.
 * Mapeia para: GET /api/follow/status/{userId}
 * @param {number} userId - ID do usuário alvo.
 * @returns {boolean} True se estiver seguindo, false caso contrário.
 */
export async function apiGetFollowStatus(userId) {
  // NOVO ENDPOINT: Usa Path Variable
  return apiFetch(`/api/follow/status/${userId}`, {
    method: "GET",
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