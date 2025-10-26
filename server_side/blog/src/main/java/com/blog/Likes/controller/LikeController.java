package com.blog.Likes.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.blog.Likes.service.LikeService;
import com.blog.config.JwtService;
import com.blog.user.service.UserService;

@RestController
@RequestMapping("/api/likes")

public class LikeController {
    private final LikeService LikeService;
    private final UserService userService;
    private final JwtService JwtService;

    LikeController(LikeService LikeService, UserService userService, JwtService JwtService) {
        this.LikeService = LikeService;
        this.userService = userService;
        this.JwtService = JwtService;
    }

    @PostMapping
    public ResponseEntity<Void> like(@RequestHeader("Authorization") String authorizationHeader,@RequestParam Long postId) {
    //    Long userId = currentUserId();
    try {
       String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                ResponseEntity.badRequest().body("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            System.out.println("userId in like controller: " + userId);
        LikeService.like(userId, postId);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
       return ResponseEntity.badRequest().build();
    }
    }

    @DeleteMapping
    public ResponseEntity<Void> unlike(@RequestHeader("Authorization") String authorizationHeader,@RequestParam Long postId) {
        //  Long userId = currentUserId();
        try {
             String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                ResponseEntity.badRequest().body("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
        LikeService.unlike(userId, postId);
        return ResponseEntity.ok().build();
        } catch (Exception e) {
           return ResponseEntity.badRequest().build();
        }
          
    }

    // private Long currentUserId() {
    //     // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    //     // System.out.println("Current username: " + (auth != null ? auth : "null"));
    //     // if (auth == null || !auth.isAuthenticated()) {
    //     //     throw new RuntimeException("Unauthenticated");
    //     // }
    //     // String username = auth.getName();
    //     try {
    //         return userService.GetUserInfoByUsername(username).getId();
    //     }catch (Exception e) {
    //          throw new IllegalStateException("Failed to like post", e);
    //     }
    // }
}
