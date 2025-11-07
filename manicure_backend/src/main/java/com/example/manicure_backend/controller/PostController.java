package com.example.manicure_backend.controller;

import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 🔹 Listar todos os posts (não precisa de token)
    @GetMapping
    public List<Post> listarTodos() {
        return postService.listarTodos();
    }

    // 🔹 Buscar post por ID (não precisa de token)
    @GetMapping("/{id}")
    public ResponseEntity<Post> buscarPorId(@PathVariable Long id) {
        return postService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Criar post (precisa de token JWT)
    @PostMapping
    public ResponseEntity<Post> salvar(
            @RequestBody Post post,
            @RequestHeader("Authorization") String authHeader // Recebe token do header
    ) {
        try {
            // ⚠️ Remove "Bearer " caso venha no padrão Bearer <token>
            String token = authHeader.replace("Bearer ", "");
            Post salvo = postService.salvar(post, token);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            // Retorna erro 403 caso usuário não tenha permissão
            return ResponseEntity.status(403).body(null);
        }
    }

    // 🔹 Atualizar post (pode exigir token se quiser validar autor)
    @PutMapping("/{id}")
    public ResponseEntity<Post> atualizar(
            @PathVariable Long id,
            @RequestBody Post post
    ) {
        return postService.atualizar(id, post)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Deletar post (pode exigir token se quiser validar autor)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        postService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
