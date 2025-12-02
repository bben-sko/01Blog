package com.blog.report.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProfileReportDto {
    private Long id;
    private String reporterUsername;
    private String reportedUsername;
    private String reason;
    private LocalDateTime createdAt;
}
