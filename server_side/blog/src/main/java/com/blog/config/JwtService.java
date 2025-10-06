package com.blog.config;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long jwtexpiration;

    private Key GenerateSigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    
    public String generateToken(String username) { 
         return Jwts.builder().subject(username).issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(System.currentTimeMillis() + jwtexpiration)).signWith(GenerateSigningKey()).compact();
    }
    
}