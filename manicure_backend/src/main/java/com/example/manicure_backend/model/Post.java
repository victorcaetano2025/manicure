package com.example.manicure_backend.model;

import jakarta.persistence.*;
//import java.time.LocalDateTime;

@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_post")
    private Long idPost;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    /*
    @Column(name = "data", nullable = false)
    private LocalDateTime data;
    */
    @ManyToOne
    @JoinColumn(name = "id_author", nullable = false) // chave estrangeira
    private Usuario author;

    // Getters e Setters
    public Long getIdPost() {
        return idPost;
    }
    public void setIdPost(Long idPost) {
        this.idPost = idPost;
    }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    /*    public LocalDateTime getData() {
        return data;
    }
    public void setData(LocalDateTime data) {
        this.data = data;
    }
     */

    public Usuario getAuthor() {
        return author;
    }
    public void setAuthor(Usuario author) {
        this.author = author;
    }
}
