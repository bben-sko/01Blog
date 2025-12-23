package com.blog.user.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.blog.auth.dto.AuthResponse;
import com.blog.auth.dto.LoginRequest;
import com.blog.auth.dto.RegisterRequest;
import com.blog.config.JwtService;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.Role;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private SubscriptionRepository SubscriptionRepository;

    @Transactional
    public User registUser(RegisterRequest r) {
        if (userRepository.existsByUsername(r.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "username already exists");
        }
        if (userRepository.existsByEmail(r.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
        }

        User user = new User();
        user.setUsername(r.getUsername());
        user.setEmail(r.getEmail());
        user.setName(r.getName());
        user.setBio(r.getBio());
        user.setPassword(passwordEncoder.encode(r.getPassword()));
        user.setAvatar(r.getAvatar());
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public AuthResponse LoginUser(LoginRequest user) throws Exception {
        Optional<User> Username = userRepository.findByEmail(user.getUserEmail());
        if (!Username.isPresent()) {
            Username = userRepository.findByUsername(user.getUserEmail());
        }

        if (!Username.isPresent()) {
            throw new Exception("Account not found");
        }

        User foundUser = Username.get();

        if (!foundUser.isEnabled()) {
            throw new Exception("Your account has been banned");
        }

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new Exception("Password incorrect");
        }

        String token = jwtService.generateToken(foundUser.getUsername(), foundUser.getRole().toString(),
                foundUser.getId());
        AuthResponse response = new AuthResponse(token, null);
        return response;
    }

    public User GetUserInfoByid(Long userid) throws Exception {
        User user = userRepository.findById(userid).orElseThrow(() -> new Exception("User not found"));
        return user;
    }

    private List<HashMap<String, Object>> mapUsers(List<User> users, Long userID) {
        List<HashMap<String, Object>> userList = new ArrayList<>();
        for (User us : users) {
            if (us.getId().equals(userID) || us.getRole() == Role.ADMIN_USER || us.isEnabled() == false) {
                continue;
            }
            User user = new User();
            user.setId(us.getId());
            user.setUsername(us.getUsername());
            user.setName(us.getName());
            user.setAvatar(us.getAvatar());
            HashMap<String, Object> Users = new HashMap<>();
            Users.put("user", user);
            Users.put("isfollow", SubscriptionRepository.existsByFollowerIdAndFollowingId(userID, us.getId()));
            userList.add(Users);
        }

        return userList;
    }

    public List<HashMap<String, Object>> GetAllUsers(Long userID) {
        return mapUsers(userRepository.findAll(), userID);
    }

    public List<HashMap<String, Object>> searchUsers(Long userID, String query, int page, int size) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(query, PageRequest.of(page, size));
        return mapUsers(users, userID);
    }

    public List<HashMap<String, Object>> getUsersPage(Long userID, int page, int size) {
        List<User> users = userRepository.findAll(PageRequest.of(page, size)).getContent();
        return mapUsers(users, userID);
    }

    public User GetUserInfoByUsername(String username) throws Exception {
        User user = userRepository.findByUsernameAndEnabledTrue(username).orElseThrow(() -> new Exception("User not found"));
        if (!user.isEnabled()) {
            throw new Exception("user "+ user.getUsername() +" is banned");
        }
        return user;
    }
    public Long verifyToken(String token) throws Exception {
        if (token == null || token.isEmpty()) {
            throw new Exception("Invalid token");
        }
        Long userId = jwtService.extractUserId(token);
        return userId;
    }
}
