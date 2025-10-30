package com.blog.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.blog.admin.dto.DashboardStatsDTO;
import com.blog.admin.service.AdminPostService;
import com.blog.admin.service.AdminReportService;
import com.blog.admin.service.AdminUserService;
import com.blog.post.dto.PostResponseDto;
import com.blog.report.dto.ReportDTO;
import com.blog.user.dto.UserDTO;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    
    @Autowired
    private AdminPostService AdminPostService;

    @Autowired
    private AdminReportService adminService;

    @Autowired
    private AdminUserService adminUserService;
    
    // @GetMapping("/dashboard/stats")
    // public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
    //     return ResponseEntity.ok(adminService.getDashboardStats());
    // }
    
    // @GetMapping("/reports/pending")
    // public ResponseEntity<List<ReportDTO>> getPendingReports() {
    //     return ResponseEntity.ok(adminService.getPendingReports());
    // }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }
    
    @GetMapping("/posts")
    public ResponseEntity<List<PostResponseDto>> getAllPosts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getAllPosts(page, size));
    }
    
    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        try {
            adminUserService.banUser(id, payload.get("reason"));
            return ResponseEntity.ok("User banned successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            adminUserService.unbanUser(id);
            return ResponseEntity.ok("User unbanned successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminUserService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/posts/{id}/hide")
    public ResponseEntity<?> hidePost(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        try {
            AdminPostService.hidePost(id, payload.get("reason"));
            return ResponseEntity.ok("Post hidden successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/posts/{id}/unhide")
    public ResponseEntity<?> unhidePost(@PathVariable Long id) {
        try {
            AdminPostService.unhidePost(id);
            return ResponseEntity.ok("Post unhidden successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            AdminPostService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<?> resolveReport(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        try {
            Long adminId = Long.parseLong(payload.get("adminId"));
            adminService.resolveReport(id, payload.get("adminNote"), adminId);
            return ResponseEntity.ok("Report resolved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}