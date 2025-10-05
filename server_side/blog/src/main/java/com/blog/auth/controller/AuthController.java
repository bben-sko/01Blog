package com.blog.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.blog.auth.dto.RegisterRequest;

@RestController
public class AuthController {
    @PostMapping("/api/auth/register")
    public String Register(@RequestBody RegisterRequest user) {
            return String.format("name: %s\nemail: %s", user.getUsername(),user.getEmail());
    }
    @PostMapping("/api/auth/login")
    public String Login() {
        /*body: { usernameOrEmail, password }
        response: { accessToken, refreshToken?, tokenType, expiresIn, userDto } */
            return "{ accessToken, refreshToken?, tokenType, expiresIn, userDto }";
    }
    @PostMapping("/api/auth/logout")
    public String Logout() {
        //header Bearer token
            return "success";
    }

    @GetMapping("/api/users/me")
    public String CurrentUserProfile() {
        return "returns current user profile";
    }
    @PutMapping("/api/users/me")
    public String UpdateProfileFields() {
        return "returns UpdateProfileFields";
    }

    @GetMapping("/api/admin/users")
    public String ListUsers() {
        return "returns List Users";
    }
    @PostMapping("/api/admin/users/{id}/ban")
    public String BanUnbanUser() {
        return "BanUnbanUser";
    }



}