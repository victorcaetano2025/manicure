"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGetAppointmentById } from "../../../../utils/api";

export default function AgendamentoDetalhes() {
  const params = useParams();
  const appointmentId = params.id;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointment() {
      try {
        const data = await apiGetAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        alert("Erro ao carregar agendamento: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAppointment();
  }, [appointmentId]);

  if (loading) return <p>Carregando...</p>;
  if (!appointment) return <p>Agendamento não encontrado.</p>;

  return (
    <div style={styles.container}>
      <h2>Detalhes do Agendamento</h2>
      <p><strong>Serviço:</strong> {appointment.servico}</p>
      <p><strong>Data:</strong> {appointment.data}</p>
      <p><strong>Horário:</strong> {appointment.horario}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  },
};
