package com.example.manicure_backend.controller;

import com.example.manicure_backend.dto.LoginRequest;
import com.example.manicure_backend.dto.RegisterRequest;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.security.JwtUtil;
import com.example.manicure_backend.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha());
            authenticationManager.authenticate(authToken);

            String token = jwtUtil.generateToken(loginRequest.getEmail());

            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenciais inválidas"));
        }
    }

    // opcional: expor rota de cadastro aqui também; você mencionou /usuarios/cadastrar — deixei abaixo outro endpoint exemplo
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            Usuario u = new Usuario();
            u.setNome(registerRequest.getNome());
            u.setEmail(registerRequest.getEmail());
            u.setSenha(registerRequest.getSenha());

            Usuario saved = usuarioService.register(u);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }
}
