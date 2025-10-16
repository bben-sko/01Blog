package com.blog.config;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication; 
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Configuration
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long jwtexpiration;

    private SecretKey GenerateSigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public <T> T getData(String token, Function<Claims, T> claimsResolve) {
        final Claims claims = Jwts.parser().verifyWith(GenerateSigningKey()).build().parseSignedClaims(token).getPayload();
        return claimsResolve.apply(claims);
    }
    
    public String generateToken(String username,String role, Long id) { 
         return Jwts.builder().subject(username).claim("role", role).claim("id", id).issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(System.currentTimeMillis() + jwtexpiration)).signWith(GenerateSigningKey()).compact();
    }
    
    public Long extractUserId(String token) {
        System.out.println("Extracting user ID from token: ");
        return getData(token, claims -> claims.get("id", Long.class));
    }

    public String extractRole(String token) {
        return getData(token, claims -> claims.get("role", String.class));
    }

    public Boolean IsExpared(String token){
        return getData(token, Claims::getExpiration).before(new Date());
    };

    public boolean validatetoken(String token, UserDetails userDetails){
        final String user = getData(token, Claims::getSubject);
        return (user.equals(userDetails.getUsername())) && !IsExpared(token);
    }
    
    
}