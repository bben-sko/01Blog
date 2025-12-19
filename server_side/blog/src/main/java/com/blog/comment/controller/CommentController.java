// CommentController.java
package com.blog.comment.controller;

import com.blog.comment.dto.CommentDto;
import com.blog.comment.dto.CommentPageResponse;
import com.blog.comment.dto.CreateCommentRequest;
import com.blog.comment.model.Comment;
import com.blog.comment.service.CommentService;
import com.blog.config.JwtService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtService JwtService;

    public CommentController(CommentService commentService, JwtService jwtService) {
        this.commentService = commentService;
        this.JwtService = jwtService;
    }

    @GetMapping("/{postId}")
     public ResponseEntity<CommentPageResponse> getComments(@PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<Comment> comments = commentService.getCommentPost(postId, page, size);
            List<CommentDto> commentDtos = comments.stream().map(comment -> {
                CommentDto dto = new CommentDto();
                dto.setId(comment.getId());
                dto.setContent(comment.getContent());
                dto.setUsername(comment.getUser().getUsername());
                dto.setAvatar(comment.getUser().getAvatar());
                dto.setUserId(comment.getUser().getId());
                dto.setTime(comment.getCreatedAt());
                return dto;
            }).toList();

            CommentPageResponse response = new CommentPageResponse(
                    commentDtos,
                    comments.getNumber(),
                    comments.getSize(),
                    comments.getTotalElements(),
                    comments.getTotalPages(),
                    comments.isLast());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody CreateCommentRequest post,@RequestHeader("Authorization") String authorizationHeader) {
        try {
              String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                ResponseEntity.badRequest().body("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            commentService.createComment(post,userId);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            if (jwt == null || jwt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT token.");
            }
            Long userId = JwtService.extractUserId(jwt);
            // check use wach mbani
            commentService.deleteComment(commentId, userId);
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted successfully");
            return ResponseEntity.ok().body(response);
        } catch (RuntimeException e) {
            if ("Unauthorized".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
