package com.blog.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileReportRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Reason is required")
    @Size(min = 5, max = 1000, message = "Reason must be between 5 and 1000 characters")
    private String reason;
}
