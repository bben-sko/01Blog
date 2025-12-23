package com.blog.report.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.report.dto.ProfileReportDto;
import com.blog.report.model.ProfileReport;
import com.blog.report.repository.ProfileReportRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class ProfileReportService {

    @Autowired
    private ProfileReportRepository profileReportRepository;

    @Autowired
    private UserRepository userRepository;

    public void submitReport(Long reporterId, String reportedUsername, String reason) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));
        User reportedUser = userRepository.findByUsername(reportedUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reporter.getId().equals(reportedUser.getId())) {
            throw new RuntimeException("You cannot report yourself");
        }

        ProfileReport report = new ProfileReport();
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setReason(reason.trim());

        profileReportRepository.save(report);
    }

    public List<ProfileReportDto> getAllReports() {
        return profileReportRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProfileReportDto toDto(ProfileReport report) {
        ProfileReportDto dto = new ProfileReportDto();
        dto.setId(report.getId());
        dto.setReporterUsername(report.getReporter().getUsername());
        dto.setReportedUsername(report.getReportedUser().getUsername());
        dto.setReason(report.getReason());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
    public Long getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    public boolean hasUserReported(Long reporterId, Long reportedUserId) {
        return profileReportRepository.existsByReporterIdAndReportedUserId(reporterId, reportedUserId);
    }
}
