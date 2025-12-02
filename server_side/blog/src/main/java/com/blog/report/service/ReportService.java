package com.blog.report.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;
import com.blog.report.repository.ReportRepository;
import com.blog.user.model.User;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostRepository postRepository;

    public void AddReport(User user, Post post, String reason) {
        Report report = new Report();
        report.setReporter(user);
        report.setPost(post);
        report.setReason(reason);
        report.setStatus(com.blog.report.model.ReportStatus.PENDING);
        reportRepository.save(report);
    }

    public Report changeReportStatus(Report report, ReportStatus status, User admin, String adminNote) {
        return changeReportStatus(report, status, admin, adminNote, false);
    }

    public Report changeReportStatus(Report report, ReportStatus status, User admin, String adminNote,
            boolean hidePost) {
        report.setStatus(status);
        report.setResolvedBy(status == ReportStatus.PENDING ? null : admin);
        report.setAdminNote(adminNote);
        report.setResolvedAt(status == ReportStatus.PENDING ? null : LocalDateTime.now());

        if (hidePost && report.getPost() != null) {
            Post reportedPost = report.getPost();
            reportedPost.setEnabled(false);
            postRepository.save(reportedPost);
        }

        return reportRepository.save(report);
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public List<Report> getAllReports() {
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
