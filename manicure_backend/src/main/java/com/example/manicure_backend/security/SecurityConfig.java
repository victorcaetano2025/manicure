package com.example.manicure_backend.security;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // 💡 Nova importação para HttpMethod
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        
        // 1. ✅ Habilita o CORS usando o Bean definido abaixo
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                
                // 2. ✅ PERMITE OPTIONS: Crucial para o CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Suas rotas públicas originais
                .requestMatchers("/auth/**", "/h2-console/**").permitAll() 
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- Outros Beans (Corretos) ---

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // --- Bean de CORS (Correto) ---

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 🚨 LEMBRE-SE DE SUBSTITUIR PELOS DOMÍNIOS REAIS DO SEU NEXT.JS EM PRODUÇÃO
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://seu-dominio-frontend.com"));
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Opcional: cache do preflight
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}