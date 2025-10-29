package com.blog.admin.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class AdminUserService {
      @Autowired
    private UserRepository userRepository;
          public void banUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }
    
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }
    
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    
}