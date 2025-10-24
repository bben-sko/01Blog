package com.blog.auth.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.config.JwtService;
import com.blog.user.service.CustomUserDetailsService;

import io.jsonwebtoken.Claims;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component

public class JwtAuthenticationFilter  extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

  
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws ServletException, IOException {
        final String auString = request.getHeader("Autorization");
        final String userName;
        final String jwt;
         
        if (auString == null || !auString.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = auString.substring(7);

        try {
             Long userId = jwtUtil.extractUserId(jwt);
             String role = jwtUtil.extractRole(jwt);
            userName = jwtUtil.getData(jwt, Claims::getSubject);
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
               UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
            
            if (jwtUtil.validatetoken(userName, userDetails)){
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    
                    Map<String, Object> details = new HashMap<>();
                    details.put("userId", userId);
                    details.put("role", role);
                    authToken.setDetails(details);


                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            } catch (Exception e) {
            // Log the exception (token is invalid or expired)
            System.err.println("Cannot set user authentication: "+ e.getMessage());
        }
        
        // Continue with the filter chain
        filterChain.doFilter(request,response);

    }
}