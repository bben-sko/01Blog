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

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:4200")
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
            
            // Check if already following
            if (SubscriptionRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Already following this user");
            }
            
            // Check if trying to follow self
            if (currentUser.getId().equals(userToFollow.getId())) {
                return ResponseEntity.badRequest().body("Cannot follow yourself");
            }
            
           
         
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully followed " + username);
            response.put("following", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Unfollow a user
    // @DeleteMapping("/{username}")
    // public ResponseEntity<?> unfollowUser(
    //         @PathVariable String username,
    //         @RequestHeader("Authorization") String authorizationHeader) {
    //     try {
    //         String jwt = authorizationHeader.substring(7);
    //         Long currentUserId = JwtService.extractUserId(jwt);
            
    //         User currentUser = userService.findById(currentUserId)
    //             .orElseThrow(() -> new RuntimeException("Current user not found"));
            
    //         User userToUnfollow = userService.findByUsername(username)
    //             .orElseThrow(() -> new RuntimeException("User not found"));
            
    //         // Check if currently following
    //         if (!currentUser.getFollowing().contains(userToUnfollow)) {
    //             return ResponseEntity.badRequest().body("Not following this user");
    //         }
            
    //         currentUser.unfollow(userToUnfollow);
    //         userService.save(currentUser);
            
    //         Map<String, Object> response = new HashMap<>();
    //         response.put("message", "Successfully unfollowed " + username);
    //         response.put("following", false);
            
    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    
    // Get followers of a user
    // @GetMapping("/{username}/followers")
    // public ResponseEntity<?> getFollowers(
    //         @PathVariable String username,
    //         @RequestHeader("Authorization") String authorizationHeader) {
    //     try {
    //         String jwt = authorizationHeader.substring(7);
    //         Long currentUserId = JwtService.extractUserId(jwt);
            
    //         User user = userService.findByUsername(username)
    //             .orElseThrow(() -> new RuntimeException("User not found"));
            
    //         List<Map<String, Object>> followers = user.getFollowers().stream()
    //             .map(follower -> {
    //                 Map<String, Object> followerMap = new HashMap<>();
    //                 followerMap.put("id", follower.getId());
    //                 followerMap.put("username", follower.getUsername());
    //                 followerMap.put("email", follower.getEmail());
    //                 followerMap.put("bio", follower.getBio());
    //                 followerMap.put("avatar", follower.getAvatar());
                    
    //                 // Check if current user is following this follower
    //                 User currentUser = userService.findById(currentUserId).orElse(null);
    //                 boolean isFollowing = currentUser != null && 
    //                     currentUser.getFollowing().contains(follower);
    //                 followerMap.put("isFollowing", isFollowing);
                    
    //                 return followerMap;
    //             })
    //             .collect(Collectors.toList());
            
    //         return ResponseEntity.ok(followers);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    
    // // Get users that a user is following
    // @GetMapping("/{username}/following")
    // public ResponseEntity<?> getFollowing(
    //         @PathVariable String username,
    //         @RequestHeader("Authorization") String authorizationHeader) {
    //     try {
    //         String jwt = authorizationHeader.substring(7);
    //         Long currentUserId = JwtService.extractUserId(jwt);
            
    //         User user = userService.findByUsername(username)
    //             .orElseThrow(() -> new RuntimeException("User not found"));
            
    //         List<Map<String, Object>> following = user.getFollowing().stream()
    //             .map(followedUser -> {
    //                 Map<String, Object> followingMap = new HashMap<>();
    //                 followingMap.put("id", followedUser.getId());
    //                 followingMap.put("username", followedUser.getUsername());
    //                 followingMap.put("email", followedUser.getEmail());
    //                 followingMap.put("bio", followedUser.getBio());
    //                 followingMap.put("avatar", followedUser.getAvatar());
    //                 followingMap.put("isFollowing", true); // Always true since this is the following list
                    
    //                 return followingMap;
    //             })
    //             .collect(Collectors.toList());
            
    //         return ResponseEntity.ok(following);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    
    // // Check if current user is following another user
    // @GetMapping("/{username}/is-following")
    // public ResponseEntity<?> isFollowing(
    //         @PathVariable String username,
    //         @RequestHeader("Authorization") String authorizationHeader) {
    //     try {
    //         String jwt = authorizationHeader.substring(7);
    //         Long currentUserId = JwtService.extractUserId(jwt);
            
    //         User currentUser = userService.findById(currentUserId)
    //             .orElseThrow(() -> new RuntimeException("Current user not found"));
            
    //         User targetUser = userService.findByUsername(username)
    //             .orElseThrow(() -> new RuntimeException("User not found"));
            
    //         boolean isFollowing = currentUser.getFollowing().contains(targetUser);
            
    //         Map<String, Object> response = new HashMap<>();
    //         response.put("isFollowing", isFollowing);
    //         response.put("followersCount", targetUser.getFollowers().size());
    //         response.put("followingCount", targetUser.getFollowing().size());
            
    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
}