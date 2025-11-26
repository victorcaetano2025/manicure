package com.example.manicure_backend.repository;

import com.example.manicure_backend.model.Seguindo;
import com.example.manicure_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeguindoRepository extends JpaRepository<Seguindo, Long> {

    // Método original (mantido, mas pode ser desnecessário após a otimização do Service)
    Optional<Seguindo> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);
    
    // OTIMIZAÇÃO: Verifica a existência do relacionamento usando apenas os IDs (muito mais rápido que buscar a entidade).
    boolean existsBySeguidor_IdUsuarioAndSeguido_IdUsuario(Long seguidorId, Long seguidoId);
    
    // Método para buscar o relacionamento por IDs (usado no unfollow)
    Optional<Seguindo> findBySeguidor_IdUsuarioAndSeguido_IdUsuario(Long seguidorId, Long seguidoId);
    
    // Opcional: Métodos de Contagem para os novos serviços
    long countBySeguido_IdUsuario(Long seguidoId);
    long countBySeguidor_IdUsuario(Long seguidorId);
}