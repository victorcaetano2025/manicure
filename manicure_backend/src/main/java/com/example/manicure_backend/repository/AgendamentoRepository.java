package com.example.manicure_backend.repository;

import com.example.manicure_backend.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // 🔹 Buscar agendamentos de um usuário específico (cliente)
    List<Agendamento> findByUsuario_IdUsuario(Long idUsuario);

    // 🔹 Buscar agendamentos de uma manicure específica (agenda dela)
    List<Agendamento> findByManicure_IdUsuario(Long idManicure);

    // 🔹 Verifica se já existe agendamento naquele dia/hora para aquela manicure
    // Retorna true se houver conflito
    @Query("SELECT COUNT(a) > 0 FROM Agendamento a WHERE a.manicure.idUsuario = :manicureId AND a.data = :data AND a.hora = :hora AND a.status != 'CANCELADO'")
    boolean existsByManicureAndDataAndHora(@Param("manicureId") Long manicureId, @Param("data") LocalDate data, @Param("hora") LocalTime hora);
}