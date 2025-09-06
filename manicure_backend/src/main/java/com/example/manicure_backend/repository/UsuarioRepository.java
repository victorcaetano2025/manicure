package com.example.manicure_backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // Lista usuários que têm um complemento e cujo nome contém a string de busca,
    // ignorando maiúsculas e minúsculas
    // Método para buscar manicures por nome
    // Método para buscar manicures por nome, ignorando maiúsculas e minúsculas
    @Query("SELECT u FROM Usuario u JOIN u.complemento c WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Usuario> findManicuresByNome(@Param("nome") String nome);

    @Query("SELECT u FROM Usuario u JOIN u.complemento c WHERE u.idade = :idade")
    List<Usuario> findManicuresByIdade(@Param("idade") Integer idade);

    @Query("SELECT u FROM Usuario u JOIN u.complemento c WHERE u.sexo = :sexo")
    List<Usuario> findManicuresBySexo(@Param("sexo") Sexo sexo);

    @Query("SELECT u FROM Usuario u JOIN u.complemento c WHERE LOWER(c.especialidade) LIKE LOWER(CONCAT('%', :especialidade, '%'))")
    List<Usuario> findManicuresByEspecialidade(@Param("especialidade") String especialidade);

    @Query("SELECT u FROM Usuario u JOIN u.complemento c WHERE LOWER(c.regiao) LIKE LOWER(CONCAT('%', :regiao, '%'))")
    List<Usuario> findManicuresByRegiao(@Param("regiao") String regiao);

}
