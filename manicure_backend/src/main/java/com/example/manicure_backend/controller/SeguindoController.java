package com.example.manicure_backend.controller;

import com.example.manicure_backend.service.SeguindoService;
import com.example.manicure_backend.security.CustomUserDetails;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/follow")
public class SeguindoController {

    @Autowired
    private SeguindoService seguindoService;
    
    // Método auxiliar para obter o ID do usuário logado de forma otimizada
    private Long getRequesterId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof CustomUserDetails) {
            // Extrai o ID diretamente do objeto de detalhes do usuário
            return ((CustomUserDetails) principal).getIdUsuario(); 
        }
        
        // Se a autenticação falhar, lança uma exceção de estado ilegal (tratada como UNAUTHORIZED)
        throw new IllegalStateException("Acesso não autorizado. O ID do usuário logado não pôde ser extraído.");
    }

    /**
     * Endpoint para seguir um usuário.
     * Mapeia para: POST /api/follow/{seguidoId}
     */
    @PostMapping("/{seguidoId:\\d+}")
    public ResponseEntity<?> follow(@PathVariable Long seguidoId) {
        
        try {
            Long seguidorId = getRequesterId(); 
            seguindoService.follow(seguidorId, seguidoId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário seguido com sucesso.");
            
        } catch (IllegalStateException e) {
            // Erros de lógica (tentar seguir a si mesmo, já está seguindo)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) { 
            // 💡 CAPTURA A EXCEÇÃO DE RECURSO NÃO ENCONTRADO
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // ...
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha interna ao iniciar seguimento.");
        }
    }
    
    @DeleteMapping("/{seguidoId:\\d+}")
    public ResponseEntity<?> unfollow(@PathVariable Long seguidoId) {
        
        try {
            Long seguidorId = getRequesterId(); 
            seguindoService.unfollow(seguidorId, seguidoId);
            return ResponseEntity.ok("Deixou de seguir o usuário com sucesso.");
            
        } catch (NoSuchElementException e) {
            // 💡 CAPTURA A EXCEÇÃO DE RECURSO NÃO ENCONTRADO
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha interna ao deixar de seguir.");
        }
    }
}