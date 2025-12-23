package com.blog.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.comment.repository.CommentRepository;
import com.blog.post.service.PostService;
import com.blog.report.repository.ProfileReportRepository;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AdminUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ProfileReportRepository profileReportRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostService postService;

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
    }

    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        subscriptionRepository.deleteAllByFollowerId(userId);
        subscriptionRepository.deleteAllByFollowingId(userId);
        postService.deletePost(userId);
        commentRepository.deleteAllByUserId(userId);
        profileReportRepository.deleteAllByReporterIdOrReportedUserId(userId, userId);
        userRepository.deleteById(userId);
    }

}