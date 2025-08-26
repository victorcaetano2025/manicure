package com.example.manicure_backend.service;

import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository, UsuarioService usuarioService) {
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

    public Optional<Post> atualizar(Long id, Post postAtualizado) {
        return postRepository.findById(id).map(post -> {
            post.setTitulo(postAtualizado.getTitulo());
            post.setDescricao(postAtualizado.getDescricao());
            //post.setData(postAtualizado.getData());
            post.setAuthor(postAtualizado.getAuthor());
            return postRepository.save(post);
        });
    }

    public void deletar(Long id) {
        postRepository.deleteById(id);
    }
}
