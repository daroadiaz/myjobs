package com.myjobs.worker.config;

import com.myjobs.worker.security.JwtAuthenticationFilter;
import com.myjobs.worker.security.JwtTokenProvider;
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
                        .requestMatchers("/worker-services/health").permitAll()
                        .requestMatchers("/worker-services/my-services").authenticated()
                        .requestMatchers(HttpMethod.GET, "/worker-services").permitAll()
                        .requestMatchers(HttpMethod.GET, "/worker-services/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/worker-services/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/worker-services/category/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/worker-services/worker/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/worker-services/{id}").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
