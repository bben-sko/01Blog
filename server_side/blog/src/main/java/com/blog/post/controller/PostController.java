package com.blog.post.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog.config.JwtService;
import com.blog.post.dto.CreatePostRequest;
import com.blog.post.dto.CreatePostResponse;
import com.blog.post.dto.PostResponseDto;
import com.blog.post.dto.ProfileReponse;
import com.blog.post.model.Post;
import com.blog.post.service.PostService;
import com.blog.user.model.User;
import com.blog.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")
public class PostController {
   

     @Autowired
    private PostService PostService;
    @Autowired
    private UserService UserService;
    @Autowired
    private JwtService JwtService;

    
    PostController(PostService PostService) {
        this.PostService = PostService;
    }

    @PostMapping("/createpost")
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest post, Authentication authentication,@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long userId = JwtService.extractUserId(jwt);
            PostService.createPost(post.getContent(), post.getMedia(), userId);
               return ResponseEntity.ok().body(new CreatePostResponse("success", null));
        }catch (Exception e){
             return ResponseEntity.badRequest().body(new CreatePostResponse(null, e.getMessage()));
        }
    }


    @GetMapping("/profile/{username}")
    public ResponseEntity<?> GetPosts(@PathVariable String username,Authentication authentication,@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                throw new Exception("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByUsername(username);
            List<Post> posts = PostService.GetPostsProfile(user.getId());
            if (posts.isEmpty()) {
                throw new Exception("No posts found for this user.");
            }
            List<PostResponseDto> postDtos = posts.stream()
                    .map(post -> PostResponseDto.fromEntity(post, false, post.getUser().getId().equals(userId)))
                    .collect(Collectors.toList());
    

            return ResponseEntity.ok(postDtos);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

}