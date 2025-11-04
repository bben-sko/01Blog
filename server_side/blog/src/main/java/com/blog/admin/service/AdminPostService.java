package com.blog.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.Likes.repository.LikeRepository;
import com.blog.comment.repository.CommentRepository;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.report.repository.ReportRepository;

import jakarta.transaction.Transactional;

@Service
public class AdminPostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository CommentRepository;

    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private ReportRepository reportRepository;

    public void hidePost(Long postId) {
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
    @Transactional
    public void deletePost(Long postId) {
        CommentRepository.deleteAllByPostId(postId);
        likeRepository.deleteAllByPostId(postId);
        reportRepository.deleteAllByPostId(postId);
        postRepository.deleteById(postId);
    }
}