package com.blog.comment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.blog.comment.dto.CreateCommentRequest;
import com.blog.comment.model.Comment;
import com.blog.comment.repository.CommentRepository;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;
import com.blog.common.exception.ResourceNotFoundException;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentsR;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  PostRepository PostRepository;

    public Page<Comment> getCommentPost(Long id, int page, int size) {
        int pageNumber = Math.max(page, 0);
        int pageSize = Math.min(Math.max(size, 1), 100);
        PageRequest pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        return commentsR.findByPostId(id, pageable);
    }

     public Comment createComment(CreateCommentRequest request, Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = PostRepository.findById(request.getPostId())
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
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
