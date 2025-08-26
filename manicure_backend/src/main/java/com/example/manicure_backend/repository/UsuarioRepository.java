package com.example.manicure_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.manicure_backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
