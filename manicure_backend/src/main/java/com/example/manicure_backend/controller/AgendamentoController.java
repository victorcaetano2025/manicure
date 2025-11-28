package com.example.manicure_backend.controller;

import com.example.manicure_backend.DTO.AgendamentoRequestDTO;
import com.example.manicure_backend.model.Agendamento;
import com.example.manicure_backend.service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService service;

    // Listar todos (Admin/Debug)
    @GetMapping
    public List<Agendamento> listarTodos() {
        return service.listarTodos();
    }

    // Listar MEUS agendamentos (Eu como Cliente)
    @GetMapping("/meus")
    public ResponseEntity<?> meusAgendamentos(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            return ResponseEntity.ok(service.listarMeusAgendamentos(token));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("erro", e.getMessage()));
        }
    }

    // Listar MINHA AGENDA (Eu como Manicure vendo meus trabalhos)
    @GetMapping("/minha-agenda")
    public ResponseEntity<?> minhaAgenda(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            return ResponseEntity.ok(service.listarAgendaManicure(token));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 CRIAR (POST) - Agora usa o DTO e o Token
    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody AgendamentoRequestDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Agendamento novo = service.criar(dto, token);
            return ResponseEntity.status(201).body(novo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}