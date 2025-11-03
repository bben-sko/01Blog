package com.blog.report.dto;

import java.time.LocalDateTime;

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
    // private String postImageUrl;
    private Long reporterId;
    private String reporterUsername;
    private String reason;
    private String description;
    private boolean enable;
    private LocalDateTime createdAt;
}