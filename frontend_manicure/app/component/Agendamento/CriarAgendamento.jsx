"use client";
import React, { useState, useEffect } from "react";
import { apiCreateAgendamento, apiGetAgendamento, apiDeleteAgendamento } from "../../utils/api";

export default function CriarAgendamento() {
  const [form, setForm] = useState({ data: "", horario: "", servico: "", observacoes: "" });
  const [loading, setLoading] = useState(false);
  const [agendamento, setAgendamento] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function loadAgendamento() {
      try {
        const data = await apiGetAgendamento();
        setAgendamento(data);
      } catch (error) {
        alert("Erro ao carregar agendamentos: " + error.message);
      }
    }
    loadAgendamento();
  }, [refresh]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiCreateAgendamento(form);
      alert("Agendamento criado com sucesso!");
      setForm({ data: "", horario: "", servico: "", observacoes: "" });
      setRefresh(!refresh);
    } catch (error) {
      alert("Erro ao criar agendamento: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente deletar este agendamento?")) return;
    try {
      await apiDeleteAgendamento(id);
      alert("Agendamento deletado!");
      setRefresh(!refresh);
    } catch (error) {
      alert("Erro ao deletar agendamento: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gerenciar Agendamentos</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Data:</label>
        <input type="date" name="data" value={form.data} onChange={handleChange} required style={styles.input} />

        <label>Horário:</label>
        <input type="time" name="horario" value={form.horario} onChange={handleChange} required style={styles.input} />

        <label>Serviço:</label>
        <input type="text" name="servico" value={form.servico} onChange={handleChange} placeholder="Ex: Manicure" required style={styles.input} />

        <label>Observações:</label>
        <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Algum detalhe adicional?" style={styles.textarea}></textarea>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Salvando..." : "Criar Agendamento"}
        </button>
      </form>

      <h3 style={{ marginTop: "30px" }}>Agendamentos Existentes</h3>
      {agendamento.length === 0 ? (
        <p>Nenhum agendamento cadastrado.</p>
      ) : (
        <ul style={styles.list}>
          {agendamento.map(a => (
            <li key={a.idAgendamento} style={styles.listItem}>
              <span>{a.servico} - {a.data} {a.horario}</span>
              <button style={styles.deleteButton} onClick={() => handleDelete(a.idAgendamento)}>Deletar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Estilos
const styles = {
  container: { maxWidth: "500px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" },
  textarea: { padding: "10px", minHeight: "70px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" },
  button: { padding: "12px", marginTop: "10px", backgroundColor: "#ff66aa", color: "#fff", fontWeight: "bold", fontSize: "16px", border: "none", borderRadius: "6px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0, marginTop: "20px" },
  listItem: { display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" },
  deleteButton: { backgroundColor: "#ff4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", padding: "5px 10px" }
};
