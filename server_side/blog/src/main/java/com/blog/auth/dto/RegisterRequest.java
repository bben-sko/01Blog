package com.blog.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;
    @NotBlank(message = "Email is required")
    @Size(min = 3, max = 20, message = "Email must be between 3 and 20 characters")
    @Email
    private String email;
    @NotBlank(message = "password is required")
    @Size(min = 8, max = 30, message = "password must be between 8 and 30 characters")
    private String password;
    private String name;
    private String bio;
    private String avatar;
}