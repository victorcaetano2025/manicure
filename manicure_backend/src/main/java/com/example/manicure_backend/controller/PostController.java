package com.example.manicure_backend.controller;

import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> listarTodos() {
        return postService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> buscarPorId(@PathVariable Long id) {
        return postService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post salvar(@RequestBody Post post) {
        return postService.salvar(post);
    }

    // 🔹 PUT para atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Post> atualizar(@PathVariable Long id, @RequestBody Post post) {
        return postService.atualizar(id, post)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        postService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}