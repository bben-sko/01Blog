package com.blog.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.config.JwtService;
import com.blog.user.service.UserService;
import com.blog.auth.dto.AuthResponse;
import com.blog.auth.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    @Autowired
    private UserService UserService;
    @Autowired
    private JwtService jwtService;


    @PostMapping("/register")
    public ResponseEntity<?> Register(@Validated @RequestBody RegisterRequest user) {
        try {
            UserService.registUser(user);
            AuthResponse response = new AuthResponse(jwtService.generateToken(user.getUsername()));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
              return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("error message: "+e.getMessage());  
        }
    }








    @PostMapping("/login")
    public String Login() {
        /*body: { usernameOrEmail, password }
        response: { accessToken, refreshToken?, tokenType, expiresIn, userDto } */
            return "{ accessToken, refreshToken?, tokenType, expiresIn, userDto }";
    }
    @PostMapping("/logout")
    public String Logout() {
        //header Bearer token
            return "success";
    }

    // @GetMapping("/api/users/me")
    // public String CurrentUserProfile() {
    //     return "returns current user profile";
    // }
    // @PutMapping("/api/users/me")
    // public String UpdateProfileFields() {
    //     return "returns UpdateProfileFields";
    // }

    // @GetMapping("/api/admin/users")
    // public String ListUsers() {
    //     return "returns List Users";
    // }
    // @PostMapping("/api/admin/users/{id}/ban")
    // public String BanUnbanUser() {
    //     return "BanUnbanUser";
    // }



}