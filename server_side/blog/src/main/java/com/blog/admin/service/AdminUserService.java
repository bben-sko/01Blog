package com.blog.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.Likes.repository.LikeRepository;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class AdminUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

      @Autowired
    private LikeRepository likeRepository;

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

    public void deleteUser(Long userId) {
        subscriptionRepository.deleteAllByFollowerId(userId);
        subscriptionRepository.deleteAllByFollowingId(userId);
        likeRepository.deleteAllByUserId(userId);
        userRepository.deleteById(userId);
    }

}