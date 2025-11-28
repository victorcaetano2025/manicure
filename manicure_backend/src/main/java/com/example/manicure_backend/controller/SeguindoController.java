package com.example.manicure_backend.controller;

import com.example.manicure_backend.service.SeguindoService;
import com.example.manicure_backend.DTO.SeguindoRequestDTO;
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
    
    /**
     * Método auxiliar para obter o ID do usuário logado de forma otimizada.
     * @return O ID do usuário autenticado.
     */
    private Long getRequesterId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof CustomUserDetails) {
            // Extrai o ID diretamente do objeto de detalhes do usuário
            return ((CustomUserDetails) principal).getIdUsuario(); 
        }
        
        // Se a autenticação não estiver presente ou for inválida
        throw new IllegalStateException("Acesso não autorizado. O ID do usuário logado não pôde ser extraído.");
    }

    // ----------------------------------------------------
    // 1. SEGUIR USUÁRIO (FOLLOW)
    // URL: POST /api/follow (Recebe ID no corpo JSON)
    // ----------------------------------------------------
    
    /**
     * Endpoint para seguir um usuário, recebendo o ID no CORPO (JSON).
     * Mapeia para: POST /api/follow
     * Retorna apenas o status 201 Created no sucesso (ResponseEntity<Void>).
     * @param request DTO contendo apenas o ID do usuário a ser seguido (seguidoId).
     */
    @PostMapping
    public ResponseEntity<Void> follow(@RequestBody SeguindoRequestDTO request) {
        
        try {
            Long seguidorId = getRequesterId(); 
            
            // Chama o Service. Não precisamos do ID de retorno, apenas da execução.
            seguindoService.follow(seguidorId, request.getSeguidoId());
            
            // Retorna 201 CREATED com corpo vazio
            return ResponseEntity.status(HttpStatus.CREATED).build();
            
        } catch (IllegalStateException e) {
            // Regras de negócio violadas (ex: já segue, segue a si mesmo) -> 400 Bad Request
            return ResponseEntity.badRequest().build(); 
        } catch (NoSuchElementException e) { 
            // Usuário alvo (seguido) não encontrado -> 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            // Erro interno (500)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // ----------------------------------------------------
    // 2. DEIXAR DE SEGUIR USUÁRIO (UNFOLLOW)
    // URL: DELETE /api/follow (Recebe ID no corpo JSON)
    // ----------------------------------------------------
    
    /**
     * Endpoint para deixar de seguir um usuário, recebendo o ID no CORPO (JSON).
     * Mapeia para: DELETE /api/follow
     * Retorna apenas o status 204 No Content no sucesso (ResponseEntity<Void>).
     * @param request DTO contendo apenas o ID do usuário a ser deixado de seguir (seguidoId).
     */
    @DeleteMapping
    public ResponseEntity<Void> unfollow(@RequestBody SeguindoRequestDTO request) {
        
        try {
            Long seguidorId = getRequesterId(); 
            // Chama o Service.
            seguindoService.unfollow(seguidorId, request.getSeguidoId()); 
            
            // Retorna 204 No Content para deleção bem-sucedida
            return ResponseEntity.noContent().build(); 
            
        } catch (NoSuchElementException e) {
            // Relacionamento não existe ou usuário alvo não existe -> 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            // Erro interno (500)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ----------------------------------------------------
    // 3. VERIFICAR STATUS DE SEGUIMENTO
    // URL: GET /api/follow/status/{id} (Recebe ID na URL)
    // ----------------------------------------------------
    
    /**
     * Endpoint para verificar se o usuário logado está seguindo o usuário alvo.
     * Mapeia para: GET /api/follow/status/{id}
     * @param id ID do usuário alvo para checar o status de seguimento.
     * @return true ou false
     */
    @GetMapping("/status/{id}")
    public ResponseEntity<Boolean> getFollowingStatus(@PathVariable Long id) {
        try {
            Long seguidorId = getRequesterId();
            
            // Verifica se o usuário logado está tentando checar a si mesmo
            if (seguidorId.equals(id)) {
                return ResponseEntity.ok(true); 
            }
            
            // O Service executa a checagem otimizada no Repository
            boolean isFollowing = seguindoService.isFollowing(seguidorId, id);
            return ResponseEntity.ok(isFollowing); // Retorna true ou false (200 OK)
            
        } catch (IllegalStateException e) {
             // Falha na autenticação (caso não houvesse o throw) -> 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}