package com.blog.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;

@Service
public class AdminPostService {

    @Autowired
    private PostRepository postRepository;

       public void hidePost(Long postId, String reason) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setEnabled(false);
        postRepository.save(post);
    }
    
    public void unhidePost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setEnabled(true);
        postRepository.save(post);
    }
    
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
}