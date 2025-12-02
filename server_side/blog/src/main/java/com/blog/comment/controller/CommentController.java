// CommentController.java
package com.blog.comment.controller;

import com.blog.comment.dto.CommentDto;
import com.blog.comment.dto.CreateCommentRequest;
import com.blog.comment.model.Comment;
import com.blog.comment.service.CommentService;
import com.blog.config.JwtService;
import com.blog.user.model.User;
import com.blog.comment.repository.CommentRepository;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtService JwtService;
    private final CommentRepository CommentRepository;

    public CommentController(CommentService commentService, JwtService jwtService, CommentRepository commentRepository) {
        this.commentService = commentService;
        this.JwtService = jwtService;
        this.CommentRepository = commentRepository;
    }

    @GetMapping("/{postId}")
     public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long postId) {


        try {
            List<Comment> comments = commentService.getCommentPost(postId);
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

            return ResponseEntity.ok(commentDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> getCommentCount(@Valid @RequestBody CreateCommentRequest post,@RequestHeader("Authorization") String authorizationHeader) {
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
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok().body("Comment deleted successfully");
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
