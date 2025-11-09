package com.example.manicure_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complementos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complementos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComplemento;

    @OneToOne
    @JoinColumn(name = "id_usuario") // FK apontando para a tabela usuario
    @JsonIgnore
    private Usuario usuario;

    @Column(nullable = false)
    private String especialidade;

    private String regiao;
}
