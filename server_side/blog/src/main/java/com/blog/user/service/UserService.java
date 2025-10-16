package com.blog.user.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blog.auth.dto.AuthResponse;
import com.blog.auth.dto.LoginRequest;
import com.blog.auth.dto.RegisterRequest;
import com.blog.config.JwtService;
import com.blog.user.model.Role;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public User registUser(RegisterRequest r) {
        if (userRepository.existsByUsername(r.getUsername())) {
            throw new RuntimeException("this user " + r.getUsername() + " already exists");
        }
        if (userRepository.existsByEmail(r.getEmail())) {
            throw new RuntimeException("this email " + r.getEmail() + " already exists");
        }
        User user = new User();
        user.setUsername(r.getUsername());
        user.setEmail(r.getEmail());
        user.setName(r.getName());
        user.setBio(r.getBio());
        String encodedPassword = passwordEncoder.encode(r.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public AuthResponse LoginUser(LoginRequest user) throws Exception {
        if (!userRepository.existsByEmail(user.getUserEmail())
                && !userRepository.existsByUsername(user.getUserEmail())) {
            throw new Exception("email or user not work");
        }
        Optional<User> Username = userRepository.findByEmail(user.getUserEmail());
        if (!Username.isPresent()) {
            Username = userRepository.findByUsername(user.getUserEmail());
        }
        if (!passwordEncoder.matches(user.getPassword(), Username.get().getPassword())) {
            throw new Exception("password incurrect");
        }
        String token = jwtService.generateToken(Username.get().getUsername(), Username.get().getRole().toString(),Username.get().getId());
        AuthResponse response = new AuthResponse(token, null);
        return response;
    }


    public User GetUserInfo(Long userid) throws Exception {
        User user = userRepository.findById(userid).orElseThrow(() -> new Exception("User not found"));
        return user;
    }

}