package com.myjobs.job.config;

import com.myjobs.job.security.JwtAuthenticationFilter;
import com.myjobs.job.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenProvider);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CORS handled by API Gateway
        http
                .cors(cors -> cors.disable())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/job-offers/health").permitAll()
                        .requestMatchers("/job-applications/health").permitAll()
                        // Job Offers - GETs públicos
                        .requestMatchers(HttpMethod.GET, "/job-offers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/job-offers/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/job-offers/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/job-offers/category/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/job-offers/employer/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/job-offers/{id}").permitAll()
                        // Job Applications - GET por ID público
                        .requestMatchers(HttpMethod.GET, "/job-applications/{id}").permitAll()
                        // Endpoints autenticados - cualquier usuario con token válido
                        .requestMatchers(HttpMethod.POST, "/job-offers/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/job-offers/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/job-offers/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/job-offers/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/job-applications/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/job-applications/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/job-applications/**").authenticated()
                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
