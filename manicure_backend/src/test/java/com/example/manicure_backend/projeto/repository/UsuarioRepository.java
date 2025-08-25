package com.example.manicure_backend.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.manicure_backend.projeto.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
