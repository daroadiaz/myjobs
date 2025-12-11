package com.myjobs.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequest {
    @NotBlank(message = "El token de Google es requerido")
    private String idToken;

    // Rol seleccionado por el usuario (solo para registro)
    private String role;
}
