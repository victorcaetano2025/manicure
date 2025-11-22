"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao fazer login");
      }

      // Salva token e dados do usuário
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setSuccess(true);
      setLoading(false);

      // Redireciona após login
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleCriarConta() {
    window.location.href = "/cadastrar";
  }

  function handleEsqueciSenha() {
    alert("Função de recuperação de senha ainda será implementada.");
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", padding: "20px" }}>
      <h1>Login</h1>

      {success ? (
        <p style={{ color: "green", fontWeight: "bold" }}>Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "15px" }}
          />

          <h3>Senha</h3>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "15px" }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginBottom: "20px" }}>
            <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button type="button" onClick={handleCriarConta}>
              Criar nova conta
            </button>
            <button type="button" onClick={handleEsqueciSenha}>
              Esqueci minha senha
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
