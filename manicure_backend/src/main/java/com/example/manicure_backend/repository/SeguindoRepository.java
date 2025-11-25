package com.example.manicure_backend.repository;

import com.example.manicure_backend.model.Seguindo;
import com.example.manicure_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeguindoRepository extends JpaRepository<Seguindo, Long> {

    // Método para verificar se um relacionamento já existe
    Optional<Seguindo> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);
    
    // Método para buscar o relacionamento por IDs (útil para o unfollow)
    Optional<Seguindo> findBySeguidor_IdUsuarioAndSeguido_IdUsuario(Long seguidorId, Long seguidoId);
}