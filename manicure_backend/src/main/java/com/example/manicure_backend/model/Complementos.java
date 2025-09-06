package com.example.manicure_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "complementos")
public class Complementos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComplemento;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_complemento", referencedColumnName = "id_usuario")
    @JsonIgnore
    private Usuario usuario;

    @Column(nullable = false)
    private String especialidade;

    private String regiao;

    public Long getIdComplemento() {
        return idComplemento;
    }

    public void setIdComplemento(Long idComplemento) {
        this.idComplemento = idComplemento;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

}
