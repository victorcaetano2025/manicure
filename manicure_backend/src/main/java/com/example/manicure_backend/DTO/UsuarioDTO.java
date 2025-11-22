package com.example.manicure_backend.dto;

import com.example.manicure_backend.model.Sexo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // Gera getters, setters, equals, hashCode e toString
@Builder                // Permite criar objetos com builder pattern
@NoArgsConstructor      // Construtor vazio
@AllArgsConstructor     // Construtor com todos os argumentos
public class UsuarioDTO {

    // 🔹 Campos do Usuario
    private String nome;
    private Integer idade;
    private String senha;
    private String email;
    private String urlFotoPerfil;
    private Sexo sexo;

    // 🔹 Campos opcionais (Complementos)
    private String especialidade;
    private String regiao;
}
