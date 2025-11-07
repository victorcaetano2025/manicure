package com.example.manicure_backend.service;

import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.repository.PostRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository; // Para buscar o usuário pelo email extraído do token
    private final JwtUtil jwtUtil; // Para extrair email do token JWT

    public PostService(PostRepository postRepository, UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.postRepository = postRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Listar todos os posts
    public List<Post> listarTodos() {
        return postRepository.findAll();
    }

    // 🔹 Buscar post por ID
    public Optional<Post> buscarPorId(Long id) {
        return postRepository.findById(id);
    }

    // 🔹 Salvar post com validação do token
    public Post salvar(Post post, String token) {

        // 1️⃣ Extrai email do token
        String email = jwtUtil.extractEmail(token);

        // 2️⃣ Busca usuário pelo email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 3️⃣ Verifica se o usuário tem complemento
        Complementos complemento = usuario.getComplemento();
        if (complemento == null) {
            // Se não tiver, não pode criar post
            throw new RuntimeException("Usuário não tem permissão para criar post");
        }

        // 4️⃣ Define o autor do post como o usuário que fez login
        post.setAuthor(usuario);

        // 5️⃣ Salva o post
        return postRepository.save(post);
    }

    // 🔹 Atualizar post
    public Optional<Post> atualizar(Long id, Post postAtualizado) {
        return postRepository.findById(id).map(post -> {
            post.setTitulo(postAtualizado.getTitulo());
            post.setDescricao(postAtualizado.getDescricao());
            post.setAuthor(postAtualizado.getAuthor()); // Pode manter o mesmo autor
            return postRepository.save(post);
        });
    }

    // 🔹 Deletar post por ID
    public void deletar(Long id) {
        postRepository.deleteById(id);
    }
}
