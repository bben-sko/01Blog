package com.blog.auth.controller;

import java.lang.StackWalker.Option;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.config.JwtService;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;
import com.blog.user.service.UserService;

import jakarta.validation.Valid;

import com.blog.auth.dto.AuthResponse;
import com.blog.auth.dto.LoginRequest;
import com.blog.auth.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    @Autowired
    private UserService UserService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
     @Autowired
    private PasswordEncoder passwordEncoder;


    AuthController(UserService UserService){
        this.UserService = UserService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> Register(@Valid @RequestBody RegisterRequest user) {
        try {
            UserService.registUser(user);
            return ResponseEntity.status(HttpStatus.OK).body("success");
        } catch (Exception e) {
              return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("error message: "+e.getMessage());  
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> Login(@Valid @RequestBody LoginRequest user) {
          
      try {
        if(!userRepository.existsByEmail(user.getUserEmail()) && !userRepository.existsByUsername(user.getUserEmail())){
            return ResponseEntity.status(404).body("Email not exists");
        }
        Optional<User> Username = userRepository.findByEmail(user.getUserEmail());
        if (!Username.isPresent()) {
            Username = userRepository.findByUsername(user.getUserEmail());
        }
        // if (!Username.get().get) {
        //     throw new RuntimeException("Account not activated");
        // }
        String token = jwtService.generateToken(Username.get().getUsername());
        if (!passwordEncoder.matches(user.getPassword(), Username.get().getPassword())) {
            return ResponseEntity.status(404).body("password incurrect");
        }
        AuthResponse response = new AuthResponse(token);
        return  ResponseEntity.status(HttpStatus.OK).body(response);
      }  catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("error message: "+e.getMessage());  
      }
      
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