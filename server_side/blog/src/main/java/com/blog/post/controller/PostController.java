package com.blog.post.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.post.dto.CreatePostRequest;
import com.blog.post.service.PostService;
import com.blog.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")
public class PostController {
    @Autowired
    private UserService userService;

     @Autowired
    private PostService PostService;

    
    PostController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create-post")
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest post) {
        try {
            Long t =1l;
            PostService.createPost(post.getContent(), post.getMedia(), t);
               return ResponseEntity.ok().body(null);
        }catch (Exception e){
             return ResponseEntity.badRequest().body(e);
        }
    }

}