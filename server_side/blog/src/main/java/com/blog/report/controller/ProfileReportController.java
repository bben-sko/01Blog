package com.blog.report.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.config.JwtService;
import com.blog.report.dto.ProfileReportDto;
import com.blog.report.dto.ProfileReportRequest;
import com.blog.report.service.ProfileReportService;
import com.blog.user.model.Role;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile-reports")
public class ProfileReportController {

    @Autowired
    private ProfileReportService profileReportService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> reportProfile(@Valid @RequestBody ProfileReportRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization required");
            }
            String token = authorizationHeader.substring(7);
            Long reporterId = jwtService.extractUserId(token);
            profileReportService.submitReport(reporterId, request.getUsername(), request.getReason());
            return ResponseEntity.ok("Profile reported successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unable to submit report");
        }
    }

    @GetMapping
    public ResponseEntity<?> getProfileReports(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization required");
            }
            String token = authorizationHeader.substring(7);
            String role = jwtService.extractRole(token);
            if (!Role.ADMIN_USER.name().equals(role)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization required");
            }
            List<ProfileReportDto> reports = profileReportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unable to fetch reports");
        }
    }
}
