package com.blog.auth.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.blog.user.service.UserService;

import jakarta.validation.Valid;

import com.blog.auth.dto.AuthResponse;
import com.blog.auth.dto.LoginRequest;
import com.blog.auth.dto.RegisterRequest;
import com.blog.common.util.StorageService;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    @Autowired
    private UserService UserService;

    @Autowired
    private StorageService storageService;



    AuthController(UserService UserService){
        this.UserService = UserService;
    }


    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @RequestParam(value = "username", required = true) String username,
            @RequestParam(value = "email", required = true) String email,
            @RequestParam(value = "password", required = true) String password,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            // Validate required fields
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            RegisterRequest user = new RegisterRequest();
            user.setUsername(username.trim());
            user.setEmail(email.trim());
            user.setPassword(password);
            user.setName(name != null ? name.trim() : null);
            user.setBio(bio != null ? bio.trim() : null);

            if (avatar != null && !avatar.isEmpty()) {
                String url = storageService.saveAndReturnUrl(avatar);
                user.setAvatar(url);
            }

            UserService.registUser(user);
            return ResponseEntity.ok(new AuthResponse(null, "success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error message: " + e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> Login(@Valid @RequestBody LoginRequest user) {
          
      try {
        AuthResponse response = UserService.LoginUser(user);
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