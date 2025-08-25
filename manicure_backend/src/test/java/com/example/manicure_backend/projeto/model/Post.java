package com.example.manicure_backend.projeto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPost;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @ManyToOne
    @JoinColumn(name = "author", nullable = false)
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
    public String getMensagem() {
        return mensagem;
    }
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
    public Usuario getAuthor() {
        return author;
    }
    public void setAuthor(Usuario author) {
        this.author = author;
    }
}
