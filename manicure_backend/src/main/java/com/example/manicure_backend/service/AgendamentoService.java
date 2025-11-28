package com.example.manicure_backend.service;

import com.example.manicure_backend.DTO.AgendamentoRequestDTO;
import com.example.manicure_backend.model.Agendamento;
import com.example.manicure_backend.model.StatusAgendamento;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.AgendamentoRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    // 🔹 Listar todos (Geral)
    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    // 🔹 Listar MEUS agendamentos (como cliente ou manicure)
    public List<Agendamento> listarMeusAgendamentos(String token) {
        String email = jwtUtil.extractEmail(token);
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        // Se for manicure, poderia querer ver os que tem agendado pra ela...
        // Aqui vamos simplificar: traz onde o usuário é o CLIENTE.
        // Para ver a agenda da manicure, seria outro endpoint ou lógica.
        return repository.findByUsuario_IdUsuario(usuario.getIdUsuario());
    }

    // 🔹 Listar agendamentos que uma manicure vai realizar (Agenda dela)
    public List<Agendamento> listarAgendaManicure(String token) {
        String email = jwtUtil.extractEmail(token);
        Usuario manicure = usuarioRepository.findByEmail(email).orElseThrow();
        return repository.findByManicure_IdUsuario(manicure.getIdUsuario());
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // 🔹 CRIAR AGENDAMENTO COM SEGURANÇA
    public Agendamento criar(AgendamentoRequestDTO dto, String token) {
        String email = jwtUtil.extractEmail(token);
        
        // 1. Quem está agendando? (Cliente)
        Usuario cliente = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // 2. Com quem será? (Manicure)
        Usuario manicure = usuarioRepository.findById(dto.getManicureId())
                .orElseThrow(() -> new RuntimeException("Manicure não encontrada"));

        // 3. Validação: A manicure é de fato uma manicure? (tem complementos?)
        if (manicure.getComplemento() == null) {
            throw new RuntimeException("O usuário selecionado não é uma manicure/profissional.");
        }

        // 4. Validação: Cliente tentando agendar com ele mesmo?
        if (cliente.getIdUsuario().equals(manicure.getIdUsuario())) {
            throw new RuntimeException("Você não pode agendar um serviço com você mesma.");
        }

        // 5. Validação: Horário disponível?
        boolean conflito = repository.existsByManicureAndDataAndHora(
                manicure.getIdUsuario(), dto.getData(), dto.getHora());
        
        if (conflito) {
            throw new RuntimeException("Este horário já está ocupado para esta manicure.");
        }

        // 6. Criar objeto
        Agendamento agendamento = new Agendamento();
        agendamento.setUsuario(cliente);
        agendamento.setManicure(manicure);
        agendamento.setDescricao(dto.getDescricao());
        agendamento.setData(dto.getData());
        agendamento.setHora(dto.getHora());
        agendamento.setStatus(StatusAgendamento.AGENDADO);
        agendamento.setValor(0.0); // Valor pode ser definido depois ou no DTO

        return repository.save(agendamento);
    }

    // Atualizar e Deletar mantidos similares...
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}