"use client";

import { useState } from "react";

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [sexo, setSexo] = useState("F"); // valor padrão
  const [urlFotoPerfil, setUrlFotoPerfil] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // validações simples
    if (senha !== senha2) {
      setError("As senhas não conferem!");
      return;
    }

    if (!nome || !idade || !email || !senha || !sexo) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          idade: Number(idade), // backend espera número
          email,
          senha,
          sexo,
          urlFotoPerfil: urlFotoPerfil || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao cadastrar usuário.");
      }

      setSuccess(true);
      setLoading(false);

      // limpa os campos
      setNome("");
      setIdade("");
      setEmail("");
      setSenha("");
      setSenha2("");
      setSexo("F");
      setUrlFotoPerfil("");

      alert("Cadastro realizado com sucesso!");
      // opcional: redirecionar para login
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Cadastrar</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <h3>Nome</h3>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        <label>
          <h3>Idade</h3>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        <label>
          <h3>Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        <label>
          <h3>Senha</h3>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        <label>
          <h3>Confirmar Senha</h3>
          <input
            type="password"
            value={senha2}
            onChange={(e) => setSenha2(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        <label>
          <h3>Sexo</h3>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </select>
        </label>

        <label>
          <h3>URL da Foto de Perfil (opcional)</h3>
          <input
            type="text"
            value={urlFotoPerfil}
            onChange={(e) => setUrlFotoPerfil(e.target.value)}
            style={{ width: "90%", padding: "8px", marginBottom: "10px" }}
          />
        </label>

        {/* mensagens de erro/sucesso */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Enviando dados...</p>}
        {success && <p style={{ color: "green" }}>Cadastro realizado!</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
