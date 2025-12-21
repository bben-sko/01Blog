package com.blog.report.model;

import java.time.LocalDateTime;

import com.blog.post.model.Post;
import com.blog.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "reports", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"reporter_id", "post_id"})
})
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;
    
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
    

    
    @Column(columnDefinition = "TEXT")
    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    @Size(min = 10, message = "Reason must be at least 10 characters long")
    private String Reason;
    
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
    
    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;
    
    private String adminNote;
}