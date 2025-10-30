package com.example.manicure_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nome;
    private String email;
    private String senha;
}
