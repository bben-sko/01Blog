package com.blog.comment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.comment.dto.CreateCommentRequest;
import com.blog.comment.model.Comment;
import com.blog.comment.repository.CommentRepository;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentsR;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  PostRepository PostRepository;

    public List<Comment> getCommentPost(Long id) {
            return commentsR.findAllByPostIdOrderByCreatedAtDesc(id);
    }   

     public Comment createComment(CreateCommentRequest request, Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = PostRepository.findById(request.getPostId())
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(user);
        
        Comment savedComment = commentsR.save(comment);
        return savedComment;
        
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentsR.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        commentsR.delete(comment);
    }
}
