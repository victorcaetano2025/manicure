package com.example.manicure_backend.controller;

import com.example.manicure_backend.dto.PostDTO;
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

    // 🔹 Listar todos os posts (DTO)
    @GetMapping
    public ResponseEntity<List<PostDTO>> listarTodos() {
        return ResponseEntity.ok(postService.listarTodosDTO());
    }

    // 🔹 Buscar post por ID (DTO)
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> buscarPorId(@PathVariable Long id) {
        return postService.buscarPorIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Criar post
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

    // 🔹 Atualizar post
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

    // 🔹 Deletar post
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

    @GetMapping("/my")
    public ResponseEntity<List<PostDTO>> listarMeusPosts(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            List<PostDTO> meusPosts = postService.listarPostsPorUsuarioLogado(token);
            return ResponseEntity.ok(meusPosts);
        } catch (RuntimeException e) {
            // Se o token for inválido, expirado ou não fornecido
            return ResponseEntity.status(401).body(null); 
        }
    }
}
