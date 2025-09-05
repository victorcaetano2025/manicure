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
    // Método que busca todos os usuários onde o atributo 'complemento' não é nulo.
    // O Spring Data JPA traduz isso para um INNER JOIN automaticamente.
    List<Usuario> findByComplementoIsNotNull();
    // Lista usuários que têm um complemento e cujo nome contém a string de busca, ignorando maiúsculas e minúsculas
    List<Usuario> findByComplementoIsNotNullAndNomeContainingIgnoreCase(String nome);
    List<Usuario> findByComplementoIsNotNullAndIdade(int idade);
    List<Usuario> findByComplementoIsNotNullAndSexo(Sexo sexo);
}
