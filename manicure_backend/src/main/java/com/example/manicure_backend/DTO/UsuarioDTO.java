package com.example.manicure_backend.dto;

import com.example.manicure_backend.model.Sexo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    // 🔹 Dados principais do usuário
    private String nome;
    private Integer idade;
    private String senha;
    private String email;
    private String urlFotoPerfil;
    private Sexo sexo;

    // 🔹 Dados opcionais — complementos
    private String especialidade;
    private String regiao;
}
