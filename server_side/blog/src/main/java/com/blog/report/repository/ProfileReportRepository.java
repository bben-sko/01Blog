package com.blog.report.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.report.model.ProfileReport;

public interface ProfileReportRepository extends JpaRepository<ProfileReport, Long> {
    boolean existsByReporterIdAndReportedUserId(Long reporterId, Long reportedUserId);

    void deleteAllByReporterIdOrReportedUserId(Long reporterId, Long reportedUserId);
}
