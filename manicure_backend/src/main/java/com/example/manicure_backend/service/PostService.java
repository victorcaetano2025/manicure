package com.example.manicure_backend.service;

import com.example.manicure_backend.dto.PostDTO;
import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.PostRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public PostService(PostRepository postRepository, UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.postRepository = postRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Listar todos os posts (DTO)
    public List<PostDTO> listarTodosDTO() {
        return postRepository.findAll().stream()
                .map(p -> new PostDTO(
                        p.getIdPost(),
                        p.getTitulo(),
                        p.getDescricao(),
                        p.getData(),
                        p.getAuthor().getNome()
                ))
                .collect(Collectors.toList());
    }

    // 🔹 Buscar post por ID
    public Optional<PostDTO> buscarPorIdDTO(Long id) {
        return postRepository.findById(id)
                .map(p -> new PostDTO(
                        p.getIdPost(),
                        p.getTitulo(),
                        p.getDescricao(),
                        p.getData(),
                        p.getAuthor().getNome()
                ));
    }

    // 🔹 Criar post (somente usuários com complementos)
    public Post salvar(Post post, String token) {
        String email = jwtUtil.extractEmail(token);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Complementos complemento = usuario.getComplemento();
        if (complemento == null) {
            throw new RuntimeException("Usuário não tem permissão para criar post");
        }

        post.setAuthor(usuario);
        return postRepository.save(post);
    }

    // 🔹 Atualizar post
    public Post atualizar(Long id, Post postAtualizado, String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token JWT não informado");
        }

        String email = jwtUtil.extractEmail(token);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post postExistente = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        if (!postExistente.getAuthor().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new RuntimeException("Você não tem permissão para atualizar este post");
        }

        postExistente.setTitulo(postAtualizado.getTitulo());
        postExistente.setDescricao(postAtualizado.getDescricao());
        postExistente.setData(postAtualizado.getData());

        return postRepository.save(postExistente);
    }

    // 🔹 Deletar post
    public void deletar(Long id, String token) {
        String email = (token != null) ? jwtUtil.extractEmail(token) : null;

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        if (email == null || !post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Usuário não autorizado para deletar este post");
        }

        postRepository.delete(post);
    }
}
