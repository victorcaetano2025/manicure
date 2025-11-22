package com.example.manicure_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Data                   // Gera automaticamente getters, setters, equals, hashCode e toString
@NoArgsConstructor       // Construtor vazio
@AllArgsConstructor      // Construtor com todos os campos
@Builder                 // Facilita a criação de objetos com o padrão builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore // Evita recursão infinita ao converter para JSON (Usuario → Complemento → Usuario)
    private Complementos complemento;

    @Column(nullable = false)
    private String nome;

    private Integer idade;

    private String senha;

    private String email;

    private String urlFotoPerfil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexo sexo;
}
