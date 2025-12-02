package com.blog.report.dto;

import com.blog.report.model.ReportStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateReportStatusRequest {

    @NotNull
    private ReportStatus status;

    @NotBlank
    @Size(min = 3, max = 500)
    private String adminNote;

    private boolean hidePost;
}
