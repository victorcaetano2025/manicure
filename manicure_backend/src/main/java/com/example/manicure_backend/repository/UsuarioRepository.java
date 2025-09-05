package com.example.manicure_backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.manicure_backend.model.Sexo;
import com.example.manicure_backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByNomeContainingIgnoreCase(String nome);
    List<Usuario> findByIdade(Integer idade);
    List<Usuario> findBySexo(Sexo sexo); 
}
