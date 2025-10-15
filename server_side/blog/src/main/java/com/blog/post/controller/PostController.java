package com.blog.post.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.auth.service.AuthenticationService;
import com.blog.config.JwtService;
import com.blog.post.dto.CreatePostRequest;
import com.blog.post.dto.CreatePostResponse;
import com.blog.post.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")
public class PostController {
   

     @Autowired
    private PostService PostService;
    @Autowired
    private AuthenticationService authService;
    @Autowired
    private JwtService JwtService;

    
    PostController(PostService PostService) {
        this.PostService = PostService;
    }

    @PostMapping("/createpost")
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest post, Authentication authentication,@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long userId = Long.parseLong(JwtService.extractUserId(jwt));
            System.out.println(userId);
            // String role = authService.getCurrentUserRole();
            PostService.createPost(post.getContent(), post.getMedia(), userId);
           

               return ResponseEntity.ok().body(new CreatePostResponse("success", null));
        }catch (Exception e){
             return ResponseEntity.badRequest().body(new CreatePostResponse(null, e.getMessage()));
        }
    }

}