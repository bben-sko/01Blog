package com.blog.report.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.blog.config.JwtService;
import com.blog.post.model.Post;
import com.blog.post.service.PostService;
import com.blog.report.dto.CreateReportRequest;
import com.blog.report.dto.ReportDTO;
import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;
import com.blog.report.service.ReportService;
import com.blog.user.model.User;
import com.blog.user.service.UserService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService JwtService;
    @Autowired
    private PostService PostService;

    @PostMapping("/add")
    public ResponseEntity<?> addReport(@RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateReportRequest reportRequest) {

        try {
            String jwt = authorizationHeader.substring(7);
            Long userId = JwtService.extractUserId(jwt);
            User user = userService.GetUserInfoByid(userId);
            Post post = PostService.getPostById(reportRequest.getPostId());
            reportService.AddReport(user, post, reportRequest.getReason());
            return ResponseEntity.ok().body("Report submitted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportDTO>> fetchReports(
            @RequestHeader("Authorization") String authorizationHeader) {
        List<Report> reports = reportService.getAllReports();
        List<ReportDTO> reportDTOs = reports.stream()
                .map(report -> {
                    ReportDTO dto = new ReportDTO();
                    dto.setId(report.getId());
                    dto.setPostId(report.getPost().getId());
                    dto.setPostContent(report.getPost().getContent());
                    // dto.setPostImageUrl(report.getPost().getImageUrl());
                    dto.setReporterId(report.getReporter().getId());
                    dto.setReporterUsername(report.getReporter().getUsername());
                    dto.setReason(report.getReason());
                    dto.setEnable(report.getPost().isEnabled());
                    dto.setCreatedAt(report.getCreatedAt());
                    return dto;
                })
                .toList();
        return ResponseEntity.ok().body(reportDTOs);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReports(@RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Long reportId) {
        try {
            return ResponseEntity.ok().body(reportService.getReportById(reportId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<?> changeReportStatus(@RequestHeader("Authorization") String authorizationHeader,
            @RequestBody String adminNote,
            @RequestBody Long reportId) {
        try {
            String jwt = authorizationHeader.substring(7);
            Long adminId = JwtService.extractUserId(jwt);
            User admin = userService.GetUserInfoByid(adminId);
            var report = reportService.getReportById(reportId);
            reportService.ChangeReportStatus(report, ReportStatus.RESOLVED, admin, adminNote);
            return ResponseEntity.ok().body("Report status changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

}