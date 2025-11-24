package com.example.manicure_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class PostDTO {
    private Long idPost;
    private String titulo;
    private String descricao;
    private LocalDate data;
    private String authorNome;
}
