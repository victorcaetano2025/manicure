package com.example.manicure_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔑 Chave secreta (melhor colocar em application.properties ou variável de ambiente)
    private static final String SECRET = "minha_chave_super_secreta_que_deve_ser_mais_longa_para_HS256";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 dia

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 🔹 Gera token JWT para o email do usuário
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔹 Extrai email do token
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 🔹 Valida se o token é legítimo e não foi alterado
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // 🔹 Verifica se o token expirou
    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
