package com.example.manicure_backend.controller;

import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*") // permite testes via Postman / front-end
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 🔹 Listar todos os posts (não requer token)
    @GetMapping
    public List<Post> listarTodos() {
        return postService.listarTodos();
    }

    // 🔹 Buscar post por ID (não requer token)
    @GetMapping("/{id}")
    public ResponseEntity<Post> buscarPorId(@PathVariable Long id) {
        return postService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Criar post (requer token JWT)
    @PostMapping
    public ResponseEntity<?> criarPost(
            @RequestBody Post post,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Post salvo = postService.salvar(post, token);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 🔹 Atualizar post (opcional: validar autor via token)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Post post,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {
            String token = (authHeader != null) ? authHeader.replace("Bearer ", "") : null;
            Post atualizado = postService.atualizar(id, post, token);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // 🔹 Deletar post (opcional: validar autor via token)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {
            String token = (authHeader != null) ? authHeader.replace("Bearer ", "") : null;
            postService.deletar(id, token);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
