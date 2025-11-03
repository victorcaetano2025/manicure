package com.example.manicure_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import jakarta.annotation.PostConstruct; // Importe este

@Component
public class JwtUtil {

    // 🔑 O Spring injetará o valor de 'jwt.secret' do application.properties aqui.
    @Value("${jwt.secret}")
    private String secret;

    // ⏱️ O Spring injetará o valor de 'jwt.expiration' do application.properties aqui.
    @Value("${jwt.expiration}")
    private long expirationMs;

    // Variável que irá armazenar a chave de criptografia REAL
    private Key key;

    // ⚙️ Este método é executado uma vez APÓS o Spring injetar os valores @Value.
    // É o local seguro para criar a chave de segurança.
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 🔹 Gera token JWT para o email do usuário
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) 
                .signWith(this.key, SignatureAlgorithm.HS256) 
                .compact();
    }

    // 🔹 Extrai email do token (o 'subject')
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 🔹 Valida se o token é legítimo e não foi alterado ou expirou
    public boolean validateToken(String token) {
        try {
            // Se o parsing funcionar (sem exceções), o token é válido e não expirou.
            Jwts.parserBuilder()
                    .setSigningKey(this.key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // Este bloco captura ExpiredJwtException, SignatureException, etc.
            // Para debug, é bom logar 'e.getMessage()' para saber o motivo exato da falha.
            System.out.println("Erro na validação do token: " + e.getMessage());
            return false;
        }
    }

    // 🔹 Verifica se o token expirou (Opcional, mas útil para mensagens de erro específicas)
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(this.key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true; // Token expirado
        } catch (JwtException e) {
            return false; // Outro erro JWT (ex: assinatura inválida), mas não expirado.
        }
    }
}