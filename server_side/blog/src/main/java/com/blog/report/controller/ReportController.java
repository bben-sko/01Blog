package com.blog.report.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.blog.config.JwtService;
import com.blog.post.model.Post;
import com.blog.post.service.PostService;
import com.blog.report.dto.CreateReportRequest;
import com.blog.report.dto.ReportDTO;
import com.blog.report.dto.UpdateReportStatusRequest;
import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;
import com.blog.report.service.ReportService;
import com.blog.user.model.Role;
import com.blog.user.model.User;
import com.blog.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserService userService;
    private final JwtService jwtService;
    private final PostService postService;

    @PostMapping("/add")
    public ResponseEntity<?> addReport(@RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreateReportRequest reportRequest) {
                try {
                    HashMap<String, String> responce = new HashMap<>();
            Long userId = extractUserId(authorizationHeader);
            User user = userService.GetUserInfoByid(userId);
            Post post = postService.getPostById(reportRequest.getPostId());
            if (post == null) {
                responce.put("message", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responce);
            }

            if (reportRequest.getReason() == null || reportRequest.getReason().isBlank()) {
                responce.put("message", "Please provide a reason for reporting.");
                return ResponseEntity.badRequest().body(responce);
            }

            reportService.AddReport(user, post, reportRequest.getReason().trim());
            responce.put("message", "Report submitted successfully");
            return ResponseEntity.ok().body(responce);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception e) {
            System.out.println("Error while reporting post: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportDTO>> fetchReports(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(value = "status", required = false) String status) {
        ensureAdmin(authorizationHeader);

        List<Report> reports;
        if (status == null || status.equalsIgnoreCase("ALL")) {
            reports = reportService.getAllReports();
        } else {
            try {
                ReportStatus reportStatus = ReportStatus.valueOf(status.toUpperCase());
                reports = reportService.getReportsByStatus(reportStatus);
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status: " + status);
            }
        }

        List<ReportDTO> reportDTOs = reports.stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(reportDTOs);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDTO> getReport(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long reportId) {
        ensureAdmin(authorizationHeader);
        Report report = reportService.getReportById(reportId);
        if (report == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found");
        }
        return ResponseEntity.ok(toDto(report));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<?> changeReportStatus(@RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long reportId,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        User admin = ensureAdmin(authorizationHeader);
        Report report = reportService.getReportById(reportId);
        if (report == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found");
        }

        reportService.changeReportStatus(report, request.getStatus(), admin,
                request.getAdminNote(), request.isHidePost());

        return ResponseEntity.ok().body("Report status changed successfully");
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization required");
        }
        return authorizationHeader.substring(7);
    }

    private Long extractUserId(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        return jwtService.extractUserId(token);
    }

    private User ensureAdmin(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        String role = jwtService.extractRole(token);
        if (!Role.ADMIN_USER.name().equals(role)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization required");
        }

        try {
            Long adminId = jwtService.extractUserId(token);
            return userService.GetUserInfoByid(adminId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization required");
        }
    }

    private ReportDTO toDto(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setPostId(report.getPost().getId());
        dto.setPostContent(report.getPost().getContent());
        dto.setPostEnabled(report.getPost().isEnabled());
        dto.setReporterId(report.getReporter().getId());
        dto.setReporterUsername(report.getReporter().getUsername());
        dto.setReason(report.getReason());
        dto.setDescription(report.getReason());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setResolvedAt(report.getResolvedAt());
        dto.setAdminNote(report.getAdminNote());
        dto.setResolvedBy(report.getResolvedBy() != null ? report.getResolvedBy().getUsername() : null);
        return dto;
    }
}
