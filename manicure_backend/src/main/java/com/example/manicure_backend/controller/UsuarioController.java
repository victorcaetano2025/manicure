package com.example.manicure_backend.controller;

import com.example.manicure_backend.DTO.UsuarioDTO;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.UsuarioRepository;
import com.example.manicure_backend.service.UsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // novas buscas por filtro
    @GetMapping("/nome/{nome}")
    public List<Usuario> buscarPorNome(@RequestParam String nome) {
        return usuarioService.buscarPorNome(nome);
    }

    @GetMapping("/idade/{idade}")
    public List<Usuario> buscarPorIdade(@RequestParam int idade) {
        return usuarioService.buscarPorIdade(idade);
    }

    @GetMapping("/sexo/{sexo}")
    public List<Usuario> buscarPorSexo(@PathVariable String sexo) {
        return usuarioService.buscarPorSexo(sexo);
    }

    // buscas para manicures
    @GetMapping("/manicures/{nome}")
    public List<Usuario> buscarManicuresPorNome(@RequestParam String nome) {
        return usuarioRepository.findManicuresByNome(nome);
    }

    @GetMapping("/manicure/{idade}")
    public List<Usuario> buscarPorIdadeManicure(@RequestParam int idade) {
        return usuarioRepository.findByComplementoIsNotNullAndIdade(idade);
    }

    @GetMapping("/manicure/{sexo}")
    public List<Usuario> buscarPorSexoManicure(@RequestParam Sexo sexo) {
        return usuarioRepository.findByComplementoIsNotNullAndSexo(sexo);
    }

    @GetMapping("/manicure/{especialidade}")
    public List<Usuario> buscarPorEspecialidadeManicure(@RequestParam String especialidade) {
        return usuarioRepository.findByComplementoEspecialidadeContainingIgnoreCase(especialidade);
    }

    @GetMapping("/manicure/{regiao}")
    public List<Usuario> buscarPorRegiaoManicure(@RequestParam String regiao) {
        return usuarioRepository.findByComplementoRegiaoContainingIgnoreCase(regiao);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto) {
        Usuario novoUsuario = usuarioService.criarUsuario(usuarioDto);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.atualizar(id, usuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
