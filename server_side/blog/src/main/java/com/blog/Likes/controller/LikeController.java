package com.blog.Likes.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.blog.Likes.service.LikeService;
import com.blog.user.model.User;
import com.blog.user.service.CustomUserDetailsService;

@RestController
@RequestMapping("/api/likes")

public class LikeController {
    private final LikeService LikeService;
    private final CustomUserDetailsService userDetailsService ;

    LikeController(LikeService LikeService, CustomUserDetailsService userDetailsService) {
        this.LikeService = LikeService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    public ResponseEntity<Void> like(@RequestParam Long postId) {
    try {
       Optional<User> userOpt = userDetailsService.getAuthoentificated();
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).build(); // Unauthorized
            }
            Long userId = userOpt.get().getId();
        LikeService.like(userId, postId);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
       return ResponseEntity.badRequest().build();
    }
    }

    @DeleteMapping
    public ResponseEntity<Void> unlike(@RequestHeader("Authorization") String authorizationHeader,@RequestParam Long postId) {
        try {
            Optional<User> userOpt = userDetailsService.getAuthoentificated();
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).build(); 
            }
        Long userId = userOpt.get().getId();
        
        LikeService.unlike(userId, postId);
        return ResponseEntity.ok().build();
        } catch (Exception e) {
           return ResponseEntity.badRequest().build();
        }
          
    }
}
