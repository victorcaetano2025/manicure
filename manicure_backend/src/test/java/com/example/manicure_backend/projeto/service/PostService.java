package com.example.manicure_backend.projeto.service;

import com.example.manicure_backend.projeto.model.Post;
import com.example.manicure_backend.projeto.repository.PostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> listarTodos() {
        return postRepository.findAll();
    }

    public Optional<Post> buscarPorId(Long id) {
        return postRepository.findById(id);
    }

    public Post salvar(Post post) {
        return postRepository.save(post);
    }

    public void deletar(Long id) {
        postRepository.deleteById(id);
    }
}
