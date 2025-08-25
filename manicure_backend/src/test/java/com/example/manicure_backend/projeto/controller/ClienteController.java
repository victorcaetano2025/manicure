package com.example.manicure_backend.projeto.controller;

import com.example.manicure_backend.projeto.model.Cliente;
import com.example.manicure_backend.projeto.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Cliente> cadastrar(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.cadastrar(cliente));
    }

    @PostMapping("/login")
    public ResponseEntity<Cliente> login(@RequestBody Cliente cliente) {
        return clienteService.login(cliente.getEmail(), cliente.getSenha())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
