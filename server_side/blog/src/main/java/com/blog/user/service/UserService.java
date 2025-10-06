package com.blog.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.auth.dto.RegisterRequest;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registUser(RegisterRequest r) {
        if(userRepository.existsByUsername(r.getUsername())) {
            throw new RuntimeException("this user " + r.getUsername() +" already exists");
        }
        if (userRepository.existsByEmail(r.getEmail())) {
            throw new RuntimeException("this email " + r.getEmail() +" already exists");
        }
        User user = new User();
        user.setUsername(r.getUsername());
        user.setEmail(r.getEmail());
        user.setName(r.getName());
        user.setBio(r.getBio());
        user.setPassword(r.getPassword());
        return userRepository.save(user);
    }
    
}