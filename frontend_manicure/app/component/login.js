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

    // Simulação de envio pro backend
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Simula o redirecionamento pra /home depois do "Carregando..."
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }, 1000);
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

          {/* Botão Entrar */}
          <div style={{ marginBottom: "20px" }}>
            <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {/* Botões empilhados */}
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
