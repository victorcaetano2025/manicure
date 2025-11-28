package com.example.manicure_backend.security;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        
        // 1. Aplica a configuração de CORS definida lá embaixo
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 2. Libera OPTIONS (Pre-flight request do navegador)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Libera Swagger e H2 para testes
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Libera Login e Registro
                .requestMatchers("/auth/**", "/h2-console/**").permitAll()
                // Bloqueia o resto
                .anyRequest().authenticated()
            )
            // Filtro de JWT antes do filtro padrão
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // Permite abrir o console do H2 no navegador (frame options)
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🔴 CONFIGURAÇÃO DE CORS REFORÇADA 🔴
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite EXATAMENTE o seu front-end
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        
        // Permite todos os métodos HTTP
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT"));
        
        // Permite todos os headers (Authorization, Content-Type, etc)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Permite credenciais/cookies (importante para alguns fluxos)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}