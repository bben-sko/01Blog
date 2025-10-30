package com.blog.report.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;


@Repository
public interface  ReportRepository extends JpaRepository<Report, Long> {

    long countByStatus(ReportStatus status);

    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    List<Report> findByStatus(ReportStatus status);
}