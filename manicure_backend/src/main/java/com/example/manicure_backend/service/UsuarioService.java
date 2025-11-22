package com.example.manicure_backend.service;

import com.example.manicure_backend.dto.UsuarioDTO;
import com.example.manicure_backend.model.Complementos;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.ComplementosRepository;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final ComplementosRepository complementosRepository;
    private final PasswordEncoder passwordEncoder;

    // 🔹 Implementação necessária para o Spring Security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
        return new CustomUserDetails(usuario);
    }

    // 🔹 Registrar novo usuário (com ou sem complementos)
    @Transactional
    public Usuario registrarUsuario(UsuarioDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }

        // Cria o usuário com senha criptografada
        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .idade(dto.getIdade())
                .sexo(dto.getSexo())
                .urlFotoPerfil(dto.getUrlFotoPerfil())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .build();

        usuario = usuarioRepository.save(usuario);

        // Cria o complemento (opcional)
        if (dto.getEspecialidade() != null || dto.getRegiao() != null) {
            Complementos complemento = Complementos.builder()
                    .especialidade(dto.getEspecialidade())
                    .regiao(dto.getRegiao())
                    .usuario(usuario)
                    .build();

            complementosRepository.save(complemento);
            usuario.setComplemento(complemento);
        }

        return usuario;
    }

    // 🔹 Login (validação de senha com BCrypt)
    public Optional<Usuario> login(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(senha, user.getSenha()));
    }

    // 🔹 Listar todos os usuários
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // 🔹 Buscar por ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // 🔹 Atualizar dados de um usuário
    @Transactional
    public Usuario atualizar(Long id, UsuarioDTO dto) {
        return usuarioRepository.findById(id).map(usuario -> {

            // Atualiza dados principais
            if (dto.getNome() != null) usuario.setNome(dto.getNome());
            if (dto.getEmail() != null) usuario.setEmail(dto.getEmail());
            if (dto.getIdade() != null) usuario.setIdade(dto.getIdade());
            if (dto.getSexo() != null) usuario.setSexo(dto.getSexo());
            if (dto.getUrlFotoPerfil() != null) usuario.setUrlFotoPerfil(dto.getUrlFotoPerfil());

            // Atualiza a senha se for informada
            if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
                usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
            }

            // Atualiza ou cria o complemento
            if (dto.getEspecialidade() != null || dto.getRegiao() != null) {
                Complementos complemento = usuario.getComplemento();
                if (complemento == null) {
                    complemento = new Complementos();
                    complemento.setUsuario(usuario);
                }

                if (dto.getEspecialidade() != null) complemento.setEspecialidade(dto.getEspecialidade());
                if (dto.getRegiao() != null) complemento.setRegiao(dto.getRegiao());

                complementosRepository.save(complemento);
                usuario.setComplemento(complemento);
            }

            return usuarioRepository.save(usuario);
        }).orElse(null);
    }

    // 🔹 Deletar usuário por ID
    @Transactional
    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // 🔹 Buscar por sexo (string convertida para enum)
    public List<Usuario> buscarPorSexo(String sexo) {
        try {
            Sexo enumSexo = Sexo.valueOf(sexo.toUpperCase());
            return usuarioRepository.findBySexo(enumSexo);
        } catch (IllegalArgumentException e) {
            return List.of(); // retorna lista vazia se o valor for inválido
        }
    }
}
