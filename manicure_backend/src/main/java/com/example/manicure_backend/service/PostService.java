package com.example.manicure_backend.service;

import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.model.Post;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.PostRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // 🔹 Listar todos os posts
    public List<Post> listarTodos() {
        return postRepository.findAll();
    }

    // 🔹 Buscar post por ID
    public Optional<Post> buscarPorId(Long id) {
        return postRepository.findById(id);
    }

    // 🔹 Criar post (somente usuário com complemento)
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

    // 🔹 Atualizar post com validação de token
public Post atualizar(Long id, Post postAtualizado, String token) {

    // 1️⃣ Extrai email do token (se enviado)
    if (token == null || token.isEmpty()) {
        throw new RuntimeException("Token JWT não informado");
    }

    String email = jwtUtil.extractEmail(token);

    // 2️⃣ Busca o usuário pelo email
    Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    // 3️⃣ Busca o post existente
    Post postExistente = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post não encontrado"));

    // 4️⃣ Verifica se o autor do post é o mesmo do token
    if (!postExistente.getAuthor().getIdUsuario().equals(usuario.getIdUsuario())) {
        throw new RuntimeException("Você não tem permissão para atualizar este post");
    }

    // 5️⃣ Atualiza apenas os campos permitidos
    postExistente.setTitulo(postAtualizado.getTitulo());
    postExistente.setDescricao(postAtualizado.getDescricao());
    postExistente.setData(postAtualizado.getData());

    // 6️⃣ Salva e retorna o post atualizado
    return postRepository.save(postExistente);
}

    // 🔹 Deletar post (somente o autor pode deletar)
    public void deletar(Long id, String token) {
        String email = (token != null) ? jwtUtil.extractEmail(token) : null;

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        // ✅ Verifica se o usuário do token é o autor
        if (email == null || !post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Usuário não autorizado para deletar este post");
        }

        postRepository.delete(post);
    }
}
