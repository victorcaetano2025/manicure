package com.example.manicure_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguindoRequestDTO {

    // ⭐ O único campo que será exigido no JSON enviado pelo front-end ⭐
    @NotNull(message = "O ID do usuário a ser seguido (seguidoId) não pode ser nulo.")
    private Long seguidoId;
}