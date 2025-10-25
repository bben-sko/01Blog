package com.blog.Likes.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.blog.Likes.service.LikeService;
import com.blog.user.service.UserService;

@RestController
@RequestMapping("/api/likes")

public class LikeController {
    private final LikeService LikeService;
    private final UserService userService;

    LikeController(LikeService LikeService, UserService userService) {
        this.LikeService = LikeService;
        this.userService = userService;
    }

    @PostMapping
    public void like(@RequestParam Long postId) {
       Long userId = currentUserId();
        LikeService.like(userId, postId);
    }

    @DeleteMapping
    public void unlike(@RequestParam Long postId) {
         Long userId = currentUserId();
        LikeService.unlike(userId, postId);
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }
        String username = auth.getName();
        try {
            return userService.GetUserInfoByUsername(username).getId();
        }catch (Exception e) {
             throw new IllegalStateException("Failed to like post", e);
        }
    }
}
