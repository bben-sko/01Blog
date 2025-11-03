package com.blog.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog.admin.service.AdminPostService;
import com.blog.admin.service.AdminReportService;
import com.blog.admin.service.AdminUserService;
import com.blog.config.JwtService;
import com.blog.post.dto.PostResponseDto;
import com.blog.user.dto.UserDTO;
import com.blog.user.model.User;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminPostService AdminPostService;

    @Autowired
    private AdminReportService adminService;

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private JwtService jwtServicel;


    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                System.out.println(role.equals("N_USER"));
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
        }catch (Exception e) {
            
        }
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            return ResponseEntity.ok(adminService.getAllPosts(page, size));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("BAD REQUEST");
        }
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                // Handle missing or invalid authorization
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            adminUserService.banUser(id);
            HashMap<String, String> response = new HashMap<String, String>();
            response.put("message", "User banned successfully");
            response.put("err", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                // Handle missing or invalid authorization
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            adminUserService.unbanUser(id);
            HashMap<String, String> response = new HashMap<String, String>();
            response.put("message", "User unbanned successfully");
            response.put("err", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            adminUserService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/posts/{id}/hide")
    public ResponseEntity<?> hidePost(
            @PathVariable Long id, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            AdminPostService.hidePost(id);
            HashMap<String, String> response = new HashMap<String, String>();
            response.put("message", "Post hidden successfully");
            response.put("err", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            HashMap<String, String> response = new HashMap<String, String>();
            response.put("message", null);
            response.put("err", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/posts/{id}/unhide")
    public ResponseEntity<?> unhidePost(@PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            AdminPostService.unhidePost(id);
            return ResponseEntity.ok("Post unhidden successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            AdminPostService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<?> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String role = jwtServicel.extractRole(token);
                if (role.equals("N_USER")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authorization required");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization required");
            }
            Long adminId = Long.parseLong(payload.get("adminId"));
            adminService.resolveReport(id, payload.get("adminNote"), adminId);
            return ResponseEntity.ok("Report resolved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}