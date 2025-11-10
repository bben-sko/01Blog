package com.blog.post.controller;

import java.lang.Thread.State;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blog.Likes.service.LikeService;
import com.blog.config.JwtService;
import com.blog.post.dto.CreatePostResponse;
import com.blog.post.dto.PostResponseDto;
import com.blog.post.dto.ProfileReponse;
import com.blog.post.model.Post;
import com.blog.post.service.PostService;
import com.blog.user.model.User;
import com.blog.user.service.UserService;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService PostService;
    @Autowired
    private UserService UserService;
    @Autowired
    private JwtService JwtService;
    @Autowired
    private LikeService likeService;

    PostController(PostService PostService) {
        this.PostService = PostService;
    }

    @PostMapping(value = "/createpost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestPart("content") String content,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            Authentication authentication, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByid(userId);
            PostService.createPost(content, files, user);
            return ResponseEntity.ok(new CreatePostResponse("success", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CreatePostResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> GetPosts(@PathVariable String username, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByUsername(username);
            List<Post> posts = PostService.GetPostsProfile(user.getId());

            List<PostResponseDto> postDtos = posts.stream()
                    .map(post -> PostResponseDto.fromEntity(post, likeService.isLikedByUser(userId, post.getId()),
                            post.getUser().getId().equals(userId)))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDtos);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @PutMapping("/{Postid}")
    public ResponseEntity<?> updatePost(@PathVariable String Postid, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByid(userId);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{Postid}")
    public ResponseEntity<?> DeletePost(@PathVariable Long Postid, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            System.out.println("test ==================");
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            System.out.println("test1 ==================");

            Long userId = JwtService.extractUserId(jwt);
            System.out.println("test2 ==================");

            PostResponseDto post = PostService.GetSinglePosts(Postid, userId);
            System.out.println("test3 ==================");
            // if (!post.getUserId().equals(userId)) {
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            // }
            System.out.println("test4 ==================");

            PostService.DeletePost(Postid);
            System.out.println("test5 ==================");

            HashMap<String, String> response = new HashMap<>();
            response.put("message", "delete post");
            response.put("err", null);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @GetMapping("/home")
    public ResponseEntity<?> GetPostshome(Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                throw new Exception("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            List<Post> posts = PostService.GetPostsHome(userId);

            List<PostResponseDto> postDtos = posts.stream()
                    .map(post -> PostResponseDto.fromEntity(post, likeService.isLikedByUser(userId,
                            post.getId()), post.getUser().getId().equals(userId)))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDtos);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @GetMapping("/{Postid}")
    public ResponseEntity<?> GetSinglePost(@PathVariable Long Postid, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                ResponseEntity.badRequest().body("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            PostResponseDto post = PostService.GetSinglePosts(Postid, userId);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e);
        }

    }
}