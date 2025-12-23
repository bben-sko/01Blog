package com.blog.subscription.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blog.config.JwtService;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.subscription.service.SubscriptionService;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/follow")
public class SubscriptionController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService JwtService;

    @Autowired
    private SubscriptionRepository SubscriptionRepository;
    @Autowired
    private SubscriptionService SubscriptionService;
    
    // Follow a user
    @PostMapping("/{username}")
    public ResponseEntity<?> followUser(
            @PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long currentUserId = JwtService.extractUserId(jwt);
            
            User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            User userToFollow = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
            
            if (SubscriptionRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Already following this user");
            }
            
            if (currentUser.getId().equals(userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Cannot follow yourself");
            }
            
           
            SubscriptionService.createSubscription(currentUser, userToFollow);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully followed " + username);
            response.put("following", true);    
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{username}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long currentUserId = JwtService.extractUserId(jwt);
            
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));

            User userToFollow = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User to follow not found"));
            
            // Check if currently following
            if (!SubscriptionRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Not following this user");
            }

            if (currentUser.getId().equals(userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Cannot follow yourself");
            }
            SubscriptionService.DeletSubscription(currentUser, userToFollow);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully unfollowed " + username);
            response.put("following", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get followers of a user
    @GetMapping("/{username}/followers")
    public ResponseEntity<?> getFollowers(
            @PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long currentUserId = JwtService.extractUserId(jwt);
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Map<String, Object>> followers = SubscriptionRepository.findByFollowingId(
                    user.getId()).stream()
                .map(follower -> {
                    Map<String, Object> followerMap = new HashMap<>();
                    followerMap.put("id", follower.getId());
                    followerMap.put("username", follower.getFollower().getUsername());
                    followerMap.put("avatar", follower.getFollower().getAvatar());
                    followerMap.put("isFollowing", SubscriptionRepository.existsByFollowerIdAndFollowingId(
                            currentUser.getId(), follower.getFollower().getId()));
                    followerMap.put("isme", follower.getFollower().getId().equals(currentUser.getId()));
                    return followerMap;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // // Get users that a user is following
    @GetMapping("/{username}/following")
    public ResponseEntity<?> getFollowing(
            @PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long currentUserId = JwtService.extractUserId(jwt);
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Map<String, Object>> followers = SubscriptionRepository.findByFollowerId(
                    user.getId()).stream()
                    .map(follower -> {
                        Map<String, Object> followerMap = new HashMap<>();
                        followerMap.put("id", follower.getFollowing().getId());
                        followerMap.put("username", follower.getFollowing().getUsername());
                        followerMap.put("avatar", follower.getFollowing().getAvatar());
                        followerMap.put("isFollowing", true);
                        return followerMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}