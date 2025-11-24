package com.example.manicure_backend.dto;
// ... imports

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostDTO {
    private Long idPost;
    private String titulo;
    private String descricao;
    private String urlImagem; // 💡 NOVO CAMPO
    private LocalDate data;
    private String authorNome;
}