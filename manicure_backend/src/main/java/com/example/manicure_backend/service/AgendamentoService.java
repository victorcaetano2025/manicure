package com.example.manicure_backend.service;

import com.example.manicure_backend.model.Agendamento;
import com.example.manicure_backend.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendamentoService {

    private final AgendamentoRepository repository;

    public AgendamentoService(AgendamentoRepository repository) {
        this.repository = repository;
    }

    public Agendamento salvar(Agendamento agendamento) {
        return repository.save(agendamento);
    }

    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    public Optional<Agendamento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<Agendamento> atualizar(Long id, Agendamento agendamentoAtualizado) {
        return repository.findById(id).map(agendamento -> {
            agendamento.setManicure(agendamentoAtualizado.getManicure());
            agendamento.setUsuario(agendamentoAtualizado.getUsuario());
            agendamento.setDescricao(agendamentoAtualizado.getDescricao());
            agendamento.setData(agendamentoAtualizado.getData());
            agendamento.setHora(agendamentoAtualizado.getHora());
            agendamento.setStatus(agendamentoAtualizado.getStatus());
            agendamento.setValor(agendamentoAtualizado.getValor());
            return repository.save(agendamento);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
