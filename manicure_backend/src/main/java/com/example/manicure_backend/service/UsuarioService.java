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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final ComplementosRepository complementosRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
        return new CustomUserDetails(usuario);
    }

    @Transactional
    public Usuario registrarUsuario(UsuarioDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .idade(dto.getIdade())
                .sexo(dto.getSexo())
                .urlFotoPerfil(dto.getUrlFotoPerfil())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .build();

        usuario = usuarioRepository.save(usuario);

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

    @Transactional
    public Usuario atualizar(Long id, UsuarioDTO dto) {
        // Busca o usuário pelo ID
        return usuarioRepository.findById(id).map(usuario -> {
            // Atualiza campos do usuário se não forem nulos
            if (dto.getNome() != null)
                usuario.setNome(dto.getNome());
            if (dto.getEmail() != null)
                usuario.setEmail(dto.getEmail());
            if (dto.getIdade() != null)
                usuario.setIdade(dto.getIdade());
            if (dto.getSenha() != null && !dto.getSenha().isBlank())
                usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
            if (dto.getSexo() != null)
                usuario.setSexo(dto.getSexo());
            if (dto.getUrlFotoPerfil() != null)
                usuario.setUrlFotoPerfil(dto.getUrlFotoPerfil());

            // Atualiza complemento se existir
            if (usuario.getComplemento() != null) {
                if (dto.getEspecialidade() != null)
                    usuario.getComplemento().setEspecialidade(dto.getEspecialidade());
                if (dto.getRegiao() != null)
                    usuario.getComplemento().setRegiao(dto.getRegiao());
            }

            // Salva e retorna o usuário atualizado
            return usuarioRepository.save(usuario);
        }).orElse(null); // retorna null se o usuário não existir
    }

    @Transactional
    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> buscarPorSexo(String sexo) {
        try {
            Sexo enumSexo = Sexo.valueOf(sexo.toUpperCase());
            return usuarioRepository.findBySexo(enumSexo);
        } catch (IllegalArgumentException e) {
            return List.of(); // retorna lista vazia se o valor for inválido
        }
    }

}
