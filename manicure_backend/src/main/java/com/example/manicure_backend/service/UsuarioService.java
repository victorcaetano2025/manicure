package com.example.manicure_backend.service;

import com.example.manicure_backend.DTO.UsuarioDTO;
import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.ComplementosRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final ComplementosRepository complementosRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          ComplementosRepository complementosRepository) {
        this.usuarioRepository = usuarioRepository;
        this.complementosRepository = complementosRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Inicializa o encoder
    }

    // Cadastrar usuário com senha criptografada
    @Transactional
    public Usuario criarUsuario(UsuarioDTO dto) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dto.getNome());
        novoUsuario.setIdade(dto.getIdade());
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setUrlFotoPerfil(dto.getUrlFotoPerfil());
        novoUsuario.setSexo(dto.getSexo());

        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());
        novoUsuario.setSenha(senhaCriptografada);

        // Salva o usuario para gerar o ID
        novoUsuario = usuarioRepository.save(novoUsuario);

        // Se existir complemento
        if (dto.getEspecialidade() != null && dto.getRegiao() != null) {
            Complementos novoComplemento = new Complementos();
            novoComplemento.setEspecialidade(dto.getEspecialidade());
            novoComplemento.setRegiao(dto.getRegiao());
            novoComplemento.setUsuario(novoUsuario);

            complementosRepository.save(novoComplemento);
        }

        return novoUsuario;
    }

    // Login seguro com verificação de senha criptografada
    public Optional<Usuario> login(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(senha, user.getSenha()));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public List<Usuario> buscarPorNome(String nome) {
        return usuarioRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Usuario> buscarPorIdade(int idade) {
        return usuarioRepository.findByIdade(idade);
    }

    public List<Usuario> buscarPorSexo(String sexo) {
        try {
            Sexo enumSexo = Sexo.valueOf(sexo.toUpperCase());
            return usuarioRepository.findBySexo(enumSexo);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
//metodos CRUD
    public Usuario salvar(Usuario usuario) {
        // garante que a senha nunca seja salva sem criptografia
        if (usuario.getSenha() != null && !usuario.getSenha().startsWith("$2a$")) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNome(usuarioAtualizado.getNome());
            usuario.setIdade(usuarioAtualizado.getIdade());
            usuario.setEmail(usuarioAtualizado.getEmail());

            // Criptografa a senha apenas se for alterada
            if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isBlank()) {
                usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
            }

            return usuarioRepository.save(usuario);
        });
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
