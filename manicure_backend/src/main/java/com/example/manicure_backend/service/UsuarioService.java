package com.example.manicure_backend.service;

import com.example.manicure_backend.DTO.UsuarioDTO;
import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.ComplementosRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final ComplementosRepository complementosRepository;

    //cadastrar
    @Transactional
    public Usuario criarUsuario(UsuarioDTO dto) {
        // Cria a entidade Usuario a partir do DTO
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dto.getNome());
        novoUsuario.setIdade(dto.getIdade());
        novoUsuario.setSenha(dto.getSenha());
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setUrlFotoPerfil(dto.getUrlFotoPerfil());
        novoUsuario.setSexo(dto.getSexo());

        // Salva o Usuario primeiro para que ele tenha um ID
        novoUsuario = usuarioRepository.save(novoUsuario);

        // Se os campos de complemento foram preenchidos, cria e salva o Complementos
        if (dto.getEspecialidade() != null && dto.getRegiao() != null) {
            Complementos novoComplemento = new Complementos();
            novoComplemento.setEspecialidade(dto.getEspecialidade());
            novoComplemento.setRegiao(dto.getRegiao());
            novoComplemento.setUsuario(novoUsuario); // Associa o Complemento ao Usuario

            // Graças ao cascade=ALL, o save no usuario ja salva o complemento
            // mas podemos explicitar o save para maior clareza
            complementosRepository.save(novoComplemento);
        }

        return novoUsuario;
    }

    // Login simples: email + senha
    public Optional<Usuario> login(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                .filter(user -> user.getSenha().equals(senha));
    }

    public UsuarioService(UsuarioRepository usuarioRepository, ComplementosRepository complementosRepository) { // Modifique
                                                                                                                // o
                                                                                                                // construtor
        this.usuarioRepository = usuarioRepository;
        this.complementosRepository = complementosRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // 🔹 Novos métodos de busca
    public List<Usuario> buscarPorNome(String nome) {
        return usuarioRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Usuario> buscarPorIdade(int idade) {
        return usuarioRepository.findByIdade(idade);
    }

    public List<Usuario> buscarPorSexo(String sexo) {
        try {
            Sexo enumSexo = Sexo.valueOf(sexo.toUpperCase()); // converte "m" ou "f" em M/F
            return usuarioRepository.findBySexo(enumSexo);
        } catch (IllegalArgumentException e) {
            return List.of(); // retorna lista vazia se o valor não for válido
        }
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNome(usuarioAtualizado.getNome());
            usuario.setIdade(usuarioAtualizado.getIdade());
            usuario.setEmail(usuarioAtualizado.getEmail());
            usuario.setSenha(usuarioAtualizado.getSenha());
            return usuarioRepository.save(usuario);
        });
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
