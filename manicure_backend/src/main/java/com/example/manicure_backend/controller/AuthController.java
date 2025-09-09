package com.example.manicure_backend.controller;

import com.example.manicure_backend.DTO.UsuarioDTO;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Cadastro
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario novoUsuario = usuarioService.criarUsuario(usuarioDTO);
        return ResponseEntity.ok(novoUsuario);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");

        return usuarioService.login(email, senha)
                .map(user -> ResponseEntity.ok(Map.of(
                        "message", "Login bem-sucedido!",
                        "userId", user.getIdUsuario(),
                        "nome", user.getNome(),
                        "email", user.getEmail()
                )))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas")));
    }
}
