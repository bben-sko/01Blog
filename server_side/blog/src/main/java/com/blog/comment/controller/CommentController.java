// CommentController.java
package com.blog.comment.controller;

import com.blog.comment.dto.CommentDto;
import com.blog.comment.dto.CreateCommentRequest;
import com.blog.comment.model.Comment;
import com.blog.comment.service.CommentService;
import com.blog.config.JwtService;
import com.blog.user.model.User;

import jakarta.validation.Valid;

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

    public CommentController(CommentService commentService, JwtService jwtService) {
        this.commentService = commentService;
        this.JwtService = jwtService;
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getCommentsForPost(
            @PathVariable Long postId,
            Authentication authentication) {
        // String currentUsername = authentication != null ? authentication.getName() : null;
        List<Comment> comments = commentService.getCommentPost(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{postId}")
    public ResponseEntity<?> getCommentCount(@Valid @RequestBody CreateCommentRequest post,@PathVariable Long postId,
             @AuthenticationPrincipal User user) {
        try {
            Comment Comment = commentService.createComment(post,user.getId());
            return ResponseEntity.ok("succed");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
