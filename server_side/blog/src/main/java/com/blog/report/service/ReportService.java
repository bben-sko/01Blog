package com.blog.report.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.post.model.Post;
import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;
import com.blog.report.repository.ReportRepository;
import com.blog.user.model.User;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public void AddReport(User user ,Post post ,String reason ) {
        Report report = new Report();
        report.setReporter(user);
        report.setPost(post);
        report.setReason(reason);
        report.setStatus(com.blog.report.model.ReportStatus.PENDING);
        reportRepository.save(report);
    }

    public void ChangeReportStatus(Report report, ReportStatus status, User admin, String adminNote) {
        report.setStatus(status);
        report.setResolvedBy(admin);
        report.setAdminNote(adminNote);
        report.setResolvedAt(LocalDateTime.now());
        reportRepository.save(report);
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }
    
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}