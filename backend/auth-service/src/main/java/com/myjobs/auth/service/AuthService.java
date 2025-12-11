package com.myjobs.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.myjobs.auth.dto.*;
import com.myjobs.auth.entity.User;
import com.myjobs.auth.enums.Role;
import com.myjobs.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleTokenVerifier googleTokenVerifier;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadCredentialsException("El email ya está registrado");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.valueOf(request.getRole()))
                .location(request.getLocation())
                .active(true)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(convertToDTO(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        if (!user.isActive()) {
            throw new BadCredentialsException("Usuario desactivado");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(convertToDTO(user))
                .build();
    }

    public UserDTO validateToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new BadCredentialsException("Token inválido");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        return convertToDTO(user);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage() != null ? user.getProfileImage() : user.getGoogleProfileImage())
                .bio(user.getBio())
                .location(user.getLocation())
                .active(user.isActive())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Autenticación con Google OAuth 2.0 / OpenID Connect
     * Este método maneja tanto el login como el registro con Google
     */
    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        // Verificar el token de Google usando OpenID Connect
        GoogleIdToken.Payload payload = googleTokenVerifier.verifyToken(request.getIdToken());

        if (payload == null) {
            throw new BadCredentialsException("Token de Google inválido");
        }

        String googleId = payload.getSubject();
        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");
        String pictureUrl = (String) payload.get("picture");
        boolean emailVerified = payload.getEmailVerified();

        log.info("Google Auth - Email: {}, GoogleID: {}", email, googleId);

        // Buscar usuario existente por googleId o email
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isEmpty()) {
            existingUser = userRepository.findByEmail(email);
        }

        User user;

        if (existingUser.isPresent()) {
            // Usuario existe - Login
            user = existingUser.get();

            // Actualizar googleId si el usuario se registró previamente con email/password
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setGoogleProfileImage(pictureUrl);
                user.setEmailVerified(true);
                user = userRepository.save(user);
            }

            if (!user.isActive()) {
                throw new BadCredentialsException("Usuario desactivado");
            }
        } else {
            // Usuario nuevo - Registro
            if (request.getRole() == null || request.getRole().isBlank()) {
                throw new BadCredentialsException("Debe seleccionar un rol para completar el registro");
            }

            // Crear nuevo usuario con datos de Google
            user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Password aleatorio (no se usa)
                    .firstName(firstName != null ? firstName : "Usuario")
                    .lastName(lastName != null ? lastName : "Google")
                    .googleId(googleId)
                    .googleProfileImage(pictureUrl)
                    .role(Role.valueOf(request.getRole()))
                    .active(true)
                    .emailVerified(emailVerified)
                    .build();

            user = userRepository.save(user);
            log.info("Nuevo usuario registrado con Google: {}", email);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(convertToDTO(user))
                .build();
    }
}
