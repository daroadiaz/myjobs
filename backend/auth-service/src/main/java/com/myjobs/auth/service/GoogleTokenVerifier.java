package com.myjobs.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class GoogleTokenVerifier {

    @Value("${google.client.id}")
    private String googleClientId;

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        try {
            log.info("Verificando token con Google Client ID: {}", googleClientId);

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                log.info("Token verificado correctamente para: {}", idToken.getPayload().getEmail());
                return idToken.getPayload();
            } else {
                log.warn("Token de Google inválido o expirado. Client ID configurado: {}", googleClientId);
                return null;
            }
        } catch (Exception e) {
            log.error("Error al verificar token de Google: {} - Client ID: {}", e.getMessage(), googleClientId);
            return null;
        }
    }
}
