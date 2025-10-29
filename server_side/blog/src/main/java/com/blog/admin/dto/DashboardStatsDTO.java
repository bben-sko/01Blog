package com.blog.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long bannedUsers;
    private long totalPosts;
    private long activePosts;
    private long hiddenPosts;
}