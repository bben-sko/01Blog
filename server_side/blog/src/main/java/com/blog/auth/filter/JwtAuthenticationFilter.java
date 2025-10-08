package com.blog.auth.filter;

import java.io.IOException;

import org.apache.tomcat.util.net.openssl.ciphers.Protocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.config.JwtService;
import com.blog.user.model.User;
import com.blog.user.service.CustomUserDetailsService;
import com.blog.user.service.UserService;

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
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String auString = request.getHeader("Autorization");
        final String jwt;
        final String userName;

        if (auString == null || !auString.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = auString.substring(7);

        try {

            userName = jwtUtil.getData(jwt, Claims::getSubject);
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
               UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
            
            if (jwtUtil.validatetoken(userName, userDetails)){
                // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    
                    // Set additional details
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // Set authentication in security context
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