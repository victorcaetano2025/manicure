package com.example.manicure_backend.projeto.controller;

import com.example.manicure_backend.projeto.model.Manicure;
import com.example.manicure_backend.projeto.service.ManicureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manicures")
public class ManicureController {

    private final ManicureService manicureService;

    public ManicureController(ManicureService manicureService) {
        this.manicureService = manicureService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Manicure> cadastrar(@RequestBody Manicure manicure) {
        return ResponseEntity.ok(manicureService.cadastrar(manicure));
    }

    @PostMapping("/login")
    public ResponseEntity<Manicure> login(@RequestBody Manicure manicure) {
        return manicureService.login(manicure.getEmail(), manicure.getSenha())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
