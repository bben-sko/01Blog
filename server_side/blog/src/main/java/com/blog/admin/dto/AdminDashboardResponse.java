package com.blog.admin.dto;

import java.util.List;

import com.blog.post.dto.PostResponseDto;
import com.blog.report.dto.ProfileReportDto;
import com.blog.report.dto.ReportDTO;
import com.blog.user.dto.UserDTO;

import lombok.Data;

@Data
public class AdminDashboardResponse {
    private DashboardStatsDTO stats;
    private List<ReportDTO> postReports;
    private List<ProfileReportDto> profileReports;
    private List<UserDTO> users;
    private List<PostResponseDto> posts;
}
