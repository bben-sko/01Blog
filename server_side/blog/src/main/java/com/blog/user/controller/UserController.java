package com.blog.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.user.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{username}")
    public User getUserByUsername() {
        
    }
    
}