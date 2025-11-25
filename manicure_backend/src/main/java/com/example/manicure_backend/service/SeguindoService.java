package com.example.manicure_backend.service;

import com.example.manicure_backend.model.Seguindo;
import com.example.manicure_backend.model.Usuario;
import com.example.manicure_backend.repository.SeguindoRepository;
import com.example.manicure_backend.repository.UsuarioRepository;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeguindoService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private SeguindoRepository seguindoRepository; 
    
    /**
     * Inicia o seguimento de um usuário por outro.
     * @param seguidorId ID do usuário logado (quem segue).
     * @param seguidoId ID do usuário alvo (quem é seguido).
     */
    @Transactional
    public void follow(Long seguidorId, Long seguidoId) {
        
        if (seguidorId.equals(seguidoId)) {
            throw new IllegalStateException("Um usuário não pode seguir a si mesmo.");
        }

        // 1. Busca os usuários (garante que existem)
        Usuario seguidor = usuarioRepository.findById(seguidorId)
    .orElseThrow(() -> new NoSuchElementException("Usuário seguidor não encontrado."));
    
Usuario seguido = usuarioRepository.findById(seguidoId)
    .orElseThrow(() -> new NoSuchElementException("Usuário seguido não encontrado."));

        // 2. Verifica se o relacionamento já existe
        if (seguindoRepository.findBySeguidorAndSeguido(seguidor, seguido).isPresent()) {
             throw new IllegalStateException("Você já está seguindo este usuário.");
        }
        
        // 3. Cria e salva o novo relacionamento
        Seguindo seguindo = Seguindo.builder()
            .seguidor(seguidor)
            .seguido(seguido)
            .build();
            
        seguindoRepository.save(seguindo);
    }
    
    /**
     * Desfaz o seguimento de um usuário por outro (unfollow).
     * @param seguidorId ID do usuário logado (quem segue).
     * @param seguidoId ID do usuário alvo (quem é seguido).
     */
    @Transactional
    public void unfollow(Long seguidorId, Long seguidoId) {
        // 1. Busca o relacionamento usando os IDs
        Seguindo seguimento = seguindoRepository.findBySeguidor_IdUsuarioAndSeguido_IdUsuario(seguidorId, seguidoId)
                .orElseThrow(() -> new NoSuchElementException("Você não está seguindo este usuário."));
        // 2. Deleta o relacionamento
        seguindoRepository.delete(seguimento);
    }
}