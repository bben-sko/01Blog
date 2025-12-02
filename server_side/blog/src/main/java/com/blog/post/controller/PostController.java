package com.blog.post.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blog.Likes.service.LikeService;
import com.blog.config.JwtService;
import com.blog.common.exception.ResourceNotFoundException;
import com.blog.notification.service.NotificationService;
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
    @Autowired
    private NotificationService notificationService;

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
            Post save = PostService.createPost(content, files, user);
            notificationService.notifySubscribers(save, user);

            return ResponseEntity.ok(new CreatePostResponse("success", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CreatePostResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> GetPosts(@PathVariable String username, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByUsername(username);
            List<Post> posts = PostService.GetPostsProfile(user.getId(), page, size);

            List<PostResponseDto> postDtos = posts.stream()
                    .map(post -> PostResponseDto.fromEntity(post, likeService.isLikedByUser(userId, post.getId()),
                            post.getUser().getId().equals(userId)))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDtos);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @RequestMapping(value = "/{Postid}", method = { RequestMethod.PUT, RequestMethod.POST }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable Long Postid,
            @RequestParam("content") String content,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @RequestParam(name = "existingMedia", required = false) List<String> existingMedia,
            Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Long userId = JwtService.extractUserId(jwt);
            User user = UserService.GetUserInfoByid(userId);

            PostResponseDto updatedPost = PostService.updatePost(Postid, content, files, existingMedia, user);
            return ResponseEntity.ok(updatedPost);

        } catch (RuntimeException e) {
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            if ("Unauthorized".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{Postid}")
    public ResponseEntity<?> DeletePost(@PathVariable Long Postid, Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Long userId = JwtService.extractUserId(jwt);

            PostResponseDto post = PostService.GetSinglePosts(Postid, userId);
            // if (!post.getUserId().equals(userId)) {
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            // }

            PostService.DeletePost(Postid);

            HashMap<String, String> response = new HashMap<>();
            response.put("message", "delete post");
            response.put("err", null);
            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProfileReponse(null, e.getMessage()));
        }
    }

    @GetMapping("/home")
    public ResponseEntity<?> GetPostshome(Authentication authentication,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                throw new Exception("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            List<Post> posts = PostService.GetPostsHome(userId, page, size);

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
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization required");
        }

        String jwt = authorizationHeader.substring(7);
        if (jwt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT token.");
        }

        Long userId = JwtService.extractUserId(jwt);
        PostResponseDto post = PostService.GetSinglePosts(Postid, userId);
        return ResponseEntity.ok(post);
    }
}
