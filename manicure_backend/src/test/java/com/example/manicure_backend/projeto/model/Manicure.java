package com.example.manicure_backend.projeto.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "manicure")
public class Manicure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private String endereco;
    private Double precoMedio;
    private Double avaliacaoMedia;
}
