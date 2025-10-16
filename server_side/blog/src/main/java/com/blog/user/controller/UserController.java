package com.blog.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.config.JwtService;
import com.blog.user.model.User;
import com.blog.user.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService UserService;
    @Autowired
    private JwtService JwtService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByUsername(username);
            Map<String, Object> response = new HashMap<>();
            response.put("userInfo", user);
            response.put("isMe", user.getId().equals(userId));
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}