package com.example.manicure_backend.controller;

import com.example.manicure_backend.dto.UsuarioDTO;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    // 🔹 Listar todos usuários
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // 🔹 Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id); // retorna Usuario ou null
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuário não encontrado"));
        }
        return ResponseEntity.ok(usuario);
    }

    // 🔹 Buscar usuários por filtros
    @GetMapping("/nome")
    public List<Usuario> buscarPorNome(@RequestParam String nome) {
        return usuarioRepository.findByNomeContainingIgnoreCase(nome);
    }

    @GetMapping("/idade")
    public List<Usuario> buscarPorIdade(@RequestParam int idade) {
        return usuarioRepository.findByIdade(idade);
    }

    @GetMapping("/sexo")
    public List<Usuario> buscarPorSexo(@RequestParam Sexo sexo) {
        return usuarioRepository.findBySexo(sexo);
    }

    // 🔹 Buscar manicures por filtros (via repository)
    @GetMapping("/manicures/nome")
    public List<Usuario> buscarManicuresPorNome(@RequestParam String nome) {
        return usuarioRepository.findManicuresByNome(nome);
    }

    @GetMapping("/manicures/idade")
    public List<Usuario> buscarManicuresPorIdade(@RequestParam int idade) {
        return usuarioRepository.findManicuresByIdade(idade);
    }

    @GetMapping("/manicures/sexo")
    public List<Usuario> buscarManicuresPorSexo(@RequestParam Sexo sexo) {
        return usuarioRepository.findManicuresBySexo(sexo);
    }

    @GetMapping("/manicures/especialidade")
    public List<Usuario> buscarManicuresPorEspecialidade(@RequestParam String especialidade) {
        return usuarioRepository.findManicuresByEspecialidade(especialidade);
    }

    @GetMapping("/manicures/regiao")
    public List<Usuario> buscarManicurePorRegiao(@RequestParam String regiao) {
        return usuarioRepository.findManicuresByRegiao(regiao);
    }

    // 🔹 Cadastrar novo usuário
    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto) {
        Usuario novoUsuario = usuarioService.registrarUsuario(usuarioDto);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // 🔹 Atualizar usuário
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        Usuario atualizado = usuarioService.atualizar(id, dto); // retorna Usuario ou null
        if (atualizado == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuário não encontrado"));
        }
        return ResponseEntity.ok(atualizado);
    }

    // 🔹 Deletar usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (usuarioService.buscarPorId(id).isPresent()) {
            usuarioService.deletar(id);
            return ResponseEntity.ok(Map.of("msg", "Usuário deletado com sucesso"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuário não encontrado"));
        }
    }
}
