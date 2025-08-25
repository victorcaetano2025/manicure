package com.example.manicure_backend.projeto.repository;

import com.example.manicure_backend.projeto.model.Manicure;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ManicureRepository extends JpaRepository<Manicure, Long> {
    Optional<Manicure> findByEmail(String email);
}
