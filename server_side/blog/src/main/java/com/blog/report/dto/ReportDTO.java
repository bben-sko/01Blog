package com.blog.report.dto;

import java.time.LocalDateTime;

import com.blog.report.model.ReportStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDTO {
    private Long id;
    private Long postId;
    private String postContent;
    private boolean postEnabled;
    private Long reporterId;
    private String reporterUsername;
    private String reason;
    private String description;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String adminNote;
    private String resolvedBy;
}
